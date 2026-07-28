import * as THREE from 'three';
import { COLORS } from './scene.js';

export const ZONES = {
  code:    { label: 'code district',    sector: 1, color: COLORS.cyan,    x: -16, z: -22, count: 8, from: 'entrance' },
  design:  { label: 'design district',  sector: 2, color: COLORS.magenta, x:  16, z: -22, count: 6, from: 'entrance' },
  about:   { label: 'about district',   sector: 3, color: COLORS.yellow,  x: -18, z: -50, count: 5, from: 'code' },
  contact: { label: 'contact district', sector: 4, color: COLORS.lime,    x:  18, z: -50, count: 4, from: 'design' },
};
const ENTRANCE_ZONE = { label: 'entrance', sector: 0 };

const ZONE_SPREAD = 20;
export const ZONE_RADIUS = 15;

export const ENTRANCE_POINT = new THREE.Vector3(0, 0.02, 3);
export const ROAD_WIDTH = 3.5;
const HUB_RADIUS = 2.5;
const DISTRICT_EXIT_RADIUS = 3;
const GATE_CLEARANCE = 10;

const NODES = { entrance: { x: ENTRANCE_POINT.x, z: ENTRANCE_POINT.z, exitRadius: HUB_RADIUS } };
Object.entries(ZONES).forEach(([key, zone]) => {
  NODES[key] = { x: zone.x, z: zone.z, exitRadius: DISTRICT_EXIT_RADIUS };
});

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function buildCurve(start, end, seed) {
  const rand = seededRandom(seed);
  const dir = new THREE.Vector3().subVectors(end, start);
  const length = dir.length();
  const perp = new THREE.Vector3(-dir.z, 0, dir.x).normalize();
  const swing = (rand() - 0.5) * length * 0.35;

  const p1 = new THREE.Vector3().lerpVectors(start, end, 0.25).addScaledVector(perp, swing * 0.6);
  const p2 = new THREE.Vector3().lerpVectors(start, end, 0.5).addScaledVector(perp, swing);
  const p3 = new THREE.Vector3().lerpVectors(start, end, 0.75).addScaledVector(perp, -swing * 0.5);

  return new THREE.CatmullRomCurve3([start, p1, p2, p3, end]);
}

export function getRoadCurves() {
  return Object.entries(ZONES).map(([key, zone], index) => {
    const laneY = 0.02 + index * 0.004;
    const parent = NODES[zone.from];
    const parentPoint = new THREE.Vector3(parent.x, laneY, parent.z);
    const end = new THREE.Vector3(zone.x, laneY, zone.z);
    const dir = new THREE.Vector3().subVectors(end, parentPoint).normalize();
    const start = parentPoint.clone().addScaledVector(dir, parent.exitRadius);
    return {
      zone,
      curve: buildCurve(start, end, 200 + index * 37),
    };
  });
}

function findZoneCrossing(curve, zone, samples = 160) {
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const p = curve.getPointAt(t);
    if (zoneAt(p.x, p.z) === zone) {
      return { point: p, t };
    }
  }
  return { point: curve.getPointAt(1), t: 1 };
}

// Single source of truth for gate placement -- used both to render the
// arches (gates.js) and to keep buildings from crowding the opening
// (createCity below). Computing this twice in two files would risk the
// two falling out of sync.
export function getGates() {
  return getRoadCurves().map(({ zone, curve }) => {
    const { point, t } = findZoneCrossing(curve, zone);
    const tangent = curve.getTangentAt(Math.min(t + 0.02, 1));
    return { zone, point, tangent };
  });
}

function distanceToCurve(x, z, curve, samples = 24) {
  let minDist = Infinity;
  let nearest = null;
  for (let i = 0; i <= samples; i++) {
    const p = curve.getPointAt(i / samples);
    const d = Math.hypot(x - p.x, z - p.z);
    if (d < minDist) {
      minDist = d;
      nearest = p;
    }
  }
  return { minDist, nearest };
}

function clearRoadCorridor(x, z, halfSize, roads) {
  let px = x;
  let pz = z;
  for (const { curve } of roads) {
    const { minDist, nearest } = distanceToCurve(px, pz, curve);
    const clearance = ROAD_WIDTH / 2 + halfSize + 1.5;
    if (minDist < clearance) {
      const dx = px - nearest.x;
      const dz = pz - nearest.z;
      const len = Math.hypot(dx, dz);
      const dirX = len > 0.01 ? dx / len : 1;
      const dirZ = len > 0.01 ? dz / len : 0;
      const push = clearance - minDist;
      px += dirX * push;
      pz += dirZ * push;
    }
  }
  return { x: px, z: pz };
}

function clearGates(x, z, halfSize, gates) {
  let px = x;
  let pz = z;
  for (const { point } of gates) {
    const dist = Math.hypot(px - point.x, pz - point.z);
    const clearance = GATE_CLEARANCE + halfSize;
    if (dist < clearance) {
      const dx = px - point.x;
      const dz = pz - point.z;
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

function buildingMesh(color, width, height, depth) {
  const group = new THREE.Group();
  const bodyGeo = new THREE.BoxGeometry(width, height, depth);
  const bodyMat = new THREE.MeshBasicMaterial({ color: 0x0d0d14 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = height / 2;
  group.add(body);
  const edges = new THREE.EdgesGeometry(bodyGeo);
  const lineMat = new THREE.LineBasicMaterial({ color, fog: false });
  const wireframe = new THREE.LineSegments(edges, lineMat);
  wireframe.position.y = height / 2;
  group.add(wireframe);
  if (height > 8) {
    const floors = Math.floor(height / 4);
    for (let f = 1; f < floors; f++) {
      const ring = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(width, 0.05, depth)),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5, fog: false })
      );
      ring.position.y = f * 4;
      group.add(ring);
    }
  }
  return group;
}

export function createCity(scene) {
  const bounds = { minX: -40, maxX: 40, minZ: -70, maxZ: 15, colliders: [] };
  const rand = seededRandom(42);
  const roads = getRoadCurves();
  const gates = getGates();

  Object.values(ZONES).forEach((zone) => {
    for (let i = 0; i < zone.count; i++) {
      const width = 3 + rand() * 4;
      const depth = 3 + rand() * 4;
      const height = 6 + rand() * 22;
      let x = zone.x + (rand() - 0.5) * ZONE_SPREAD * 1.4;
      let z = zone.z + (rand() - 0.5) * ZONE_SPREAD;

      const halfSize = Math.max(width, depth) / 2;
      ({ x, z } = clearRoadCorridor(x, z, halfSize, roads));
      ({ x, z } = clearGates(x, z, halfSize, gates));

      const building = buildingMesh(zone.color, width, height, depth);
      building.position.set(x, 0, z);
      scene.add(building);
      bounds.colliders.push({
        x, z,
        halfW: width / 2 + 0.5,
        halfD: depth / 2 + 0.5,
      });
    }
  });
  return bounds;
}

export function zoneAt(x, z) {
  let closest = ENTRANCE_ZONE;
  let closestDist = ZONE_RADIUS;
  for (const zone of Object.values(ZONES)) {
    const dist = Math.hypot(x - zone.x, z - zone.z);
    if (dist < closestDist) {
      closestDist = dist;
      closest = zone;
    }
  }
  return closest;
}

export function atmosphereColor(zone) {
  const base = new THREE.Color(COLORS.void);
  if (!zone || !zone.color) return base;
  return base.clone().lerp(new THREE.Color(zone.color), 0.18);
}
