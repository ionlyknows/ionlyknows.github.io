// Headless re-verification for TD-001 (docs/TECH_DEBT.md).
//
// Re-implements createCity()'s placement loop without touching the DOM/WebGL,
// then checks every building against all three clearance constraints at once:
// zone-core radius, road-corridor width, and gate radius. Before the TD-001
// fix, each constraint was only checked in isolation by its own pass, so a
// building could satisfy pass N and still fail pass N-1's constraint by the
// time placement finished. This script re-checks the *final* position against
// *all* constraints together, which is the only way to catch that class of bug.
//
// Run at current density (npm run verify:city) and, as a Phase 5 stress case,
// at raised per-zone counts, since the doc flags density increases as the
// condition most likely to expose non-convergence.

import * as THREE from 'three';
import { ZONES, getRoadCurves, getGates, ROAD_WIDTH } from '../src/city.js';

const GATE_CLEARANCE = 10;
const CORE_CLEARANCE = 6;
const CLEARANCE_MAX_ITERATIONS = 8;
const CLEARANCE_EPSILON = 0.01;
const ZONE_SPREAD = 20;

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function distanceToCurve(x, z, curve, samples = 24) {
  let minDist = Infinity;
  for (let i = 0; i <= samples; i++) {
    const p = curve.getPointAt(i / samples);
    const d = Math.hypot(x - p.x, z - p.z);
    if (d < minDist) minDist = d;
  }
  return minDist;
}

function clearRoadCorridor(x, z, halfSize, roads) {
  let px = x, pz = z;
  for (const { curve } of roads) {
    const nearest = (() => {
      let minDist = Infinity, np = null;
      for (let i = 0; i <= 24; i++) {
        const p = curve.getPointAt(i / 24);
        const d = Math.hypot(px - p.x, pz - p.z);
        if (d < minDist) { minDist = d; np = p; }
      }
      return { minDist, np };
    })();
    const clearance = ROAD_WIDTH / 2 + halfSize + 1.5;
    if (nearest.minDist < clearance) {
      const dx = px - nearest.np.x, dz = pz - nearest.np.z;
      const len = Math.hypot(dx, dz);
      const dirX = len > 0.01 ? dx / len : 1;
      const dirZ = len > 0.01 ? dz / len : 0;
      const push = clearance - nearest.minDist;
      px += dirX * push;
      pz += dirZ * push;
    }
  }
  return { x: px, z: pz };
}

function clearGates(x, z, halfSize, gates) {
  let px = x, pz = z;
  for (const { point } of gates) {
    const dist = Math.hypot(px - point.x, pz - point.z);
    const clearance = GATE_CLEARANCE + halfSize;
    if (dist < clearance) {
      const dx = px - point.x, dz = pz - point.z;
      const len = Math.hypot(dx, dz);
      const dirX = len > 0.01 ? dx / len : 1;
      const dirZ = len > 0.01 ? dz / len : 0;
      const push = clearance - dist;
      px += dirX * push;
      pz += dirZ * push;
    }
  }
  return { x: px, z: pz };
}

function clearZoneCore(x, z, halfSize, zone, gates) {
  const minRadius = CORE_CLEARANCE + halfSize;
  const dx = x - zone.x, dz = z - zone.z;
  const dist = Math.hypot(dx, dz);
  if (dist >= minRadius) return { x, z };

  const gate = gates.find(g => g.zone === zone);
  let dirX = dist > 0.01 ? dx / dist : 1;
  let dirZ = dist > 0.01 ? dz / dist : 0;

  if (gate) {
    const axisX = zone.x - gate.point.x, axisZ = zone.z - gate.point.z;
    const axisLen = Math.hypot(axisX, axisZ);
    if (axisLen > 0.01) {
      const nx = axisX / axisLen, nz = axisZ / axisLen;
      const along = dirX * nx + dirZ * nz;
      dirX -= along * nx * 0.85;
      dirZ -= along * nz * 0.85;
      const len = Math.hypot(dirX, dirZ);
      if (len > 0.01) { dirX /= len; dirZ /= len; }
    }
  }

  const push = minRadius - dist;
  return { x: x + dirX * push, z: z + dirZ * push };
}

function resolveClearance(x, z, halfSize, zone, gates, roads) {
  let px = x, pz = z;
  for (let i = 0; i < CLEARANCE_MAX_ITERATIONS; i++) {
    const beforeX = px, beforeZ = pz;
    ({ x: px, z: pz } = clearZoneCore(px, pz, halfSize, zone, gates));
    ({ x: px, z: pz } = clearRoadCorridor(px, pz, halfSize, roads));
    ({ x: px, z: pz } = clearGates(px, pz, halfSize, gates));
    const moved = Math.hypot(px - beforeX, pz - beforeZ);
    if (moved < CLEARANCE_EPSILON) break;
  }
  return { x: px, z: pz };
}

function placeBuildings(zoneCounts, seed = 42) {
  const rand = seededRandom(seed);
  const roads = getRoadCurves();
  const gates = getGates();
  const placed = [];

  Object.entries(ZONES).forEach(([key, zone]) => {
    const count = zoneCounts[key] ?? zone.count;
    for (let i = 0; i < count; i++) {
      const width = 3 + rand() * 4;
      const depth = 3 + rand() * 4;
      let x = zone.x + (rand() - 0.5) * ZONE_SPREAD * 1.4;
      let z = zone.z + (rand() - 0.5) * ZONE_SPREAD;
      const halfSize = Math.max(width, depth) / 2;
      ({ x, z } = resolveClearance(x, z, halfSize, zone, gates, roads));
      placed.push({ x, z, halfSize, zone });
    }
  });
  return { placed, roads, gates };
}

function verify(label, zoneCounts, seed = 42) {
  const { placed, roads, gates } = placeBuildings(zoneCounts, seed);
  let violations = 0;

  for (const b of placed) {
    const coreDist = Math.hypot(b.x - b.zone.x, b.z - b.zone.z);
    if (coreDist < CORE_CLEARANCE + b.halfSize - CLEARANCE_EPSILON) {
      console.error(`  ✗ [${label}] core-clearance violation in ${b.zone.label}: dist=${coreDist.toFixed(2)}`);
      violations++;
    }
    for (const { point } of gates) {
      const gateDist = Math.hypot(b.x - point.x, b.z - point.z);
      if (gateDist < GATE_CLEARANCE + b.halfSize - CLEARANCE_EPSILON) {
        console.error(`  ✗ [${label}] gate-clearance violation in ${b.zone.label}: dist=${gateDist.toFixed(2)}`);
        violations++;
      }
    }
    for (const { curve } of roads) {
      const roadDist = distanceToCurve(b.x, b.z, curve);
      if (roadDist < ROAD_WIDTH / 2 + b.halfSize + 1.5 - CLEARANCE_EPSILON) {
        console.error(`  ✗ [${label}] road-corridor violation in ${b.zone.label}: dist=${roadDist.toFixed(2)}`);
        violations++;
      }
    }
  }

  console.log(`${violations === 0 ? '✓' : '✗'} [${label}] ${placed.length} buildings, ${violations} constraint violations`);
  return violations;
}

let totalViolations = 0;
totalViolations += verify('current density', {});
totalViolations += verify('3x density (Phase 5 stress case)', {
  code: 24, design: 18, about: 15, contact: 12,
});
totalViolations += verify('6x density (extreme stress case)', {
  code: 48, design: 36, about: 30, contact: 24,
});
for (const seed of [1, 7, 99, 12345, 500000]) {
  totalViolations += verify(`6x density, seed=${seed}`, {
    code: 48, design: 36, about: 30, contact: 24,
  }, seed);
}

if (totalViolations > 0) {
  console.error(`\nTD-001 verification failed: ${totalViolations} total violations.`);
  process.exit(1);
} else {
  console.log('\nAll clearance constraints satisfied at current and stress density. TD-001 verified resolved.');
}
