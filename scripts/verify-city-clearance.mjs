// Headless re-verification for TD-001 (docs/TECH_DEBT.md).
//
// Calls the actual production placement logic (planCityBuildings, exported
// from src/city.js) rather than a hand-maintained re-implementation, so this
// script tests what createCity() really does -- not a copy of it that could
// silently drift out of sync.
//
// Checks every building's final position against all three clearance
// constraints simultaneously (zone-core radius, road-corridor width, gate
// radius). Before the TD-001 fix, each constraint was only checked in
// isolation by its own pass, so a building could satisfy pass N and still
// fail pass N-1's constraint by the time placement finished -- the only way
// to catch that class of bug is to re-check the *final* position against
// *all* constraints together, which is what this script does.
//
// Run at current density (npm run verify:city) and, as a Phase 5 stress
// case, at raised per-zone counts, since the doc flags density increases as
// the condition most likely to expose non-convergence.

import {
  planCityBuildings,
  getRoadCurves,
  getGates,
  ROAD_WIDTH,
  GATE_CLEARANCE,
  CORE_CLEARANCE,
  CLEARANCE_EPSILON,
} from '../src/city.js';

function distanceToCurve(x, z, curve, samples = 24) {
  let minDist = Infinity;
  for (let i = 0; i <= samples; i++) {
    const p = curve.getPointAt(i / samples);
    const d = Math.hypot(x - p.x, z - p.z);
    if (d < minDist) minDist = d;
  }
  return minDist;
}

function verify(label, zoneCounts, seed = 42) {
  const { placements } = planCityBuildings(zoneCounts, seed);
  const roads = getRoadCurves();
  const gates = getGates();
  let violations = 0;

  for (const b of placements) {
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

  console.log(`${violations === 0 ? '✓' : '✗'} [${label}] ${placements.length} buildings, ${violations} constraint violations`);
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
