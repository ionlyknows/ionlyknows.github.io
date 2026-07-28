import * as THREE from 'three';
import { COLORS } from './scene.js';

export const ZONES = {
  code:    { label: 'code district',    sector: 1, color: COLORS.cyan,    x: -16, z: -22, count: 8 },
  design:  { label: 'design district',  sector: 2, color: COLORS.magenta, x:  16, z: -22, count: 6 },
  about:   { label: 'about district',   sector: 3, color: COLORS.yellow,  x: -18, z: -50, count: 5 },
  contact: { label: 'contact district', sector: 4, color: COLORS.lime,    x:  18, z: -50, count: 4 },
};
const ENTRANCE_ZONE = { label: 'entrance', sector: 0 };

// ZONE_SPREAD: how far buildings scatter within their own district.
// ZONE_RADIUS: how close the player must be to register as "inside" a
// district for HUD purposes. Kept separate  conflating them broke down
// once districts stopped sitting on a single line.
const ZONE_SPREAD = 20;
const ZONE_RADIUS = 15;

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

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export function createCity(scene) {
  const bounds = { minX: -40, maxX: 40, minZ: -70, maxZ: 15, colliders: [] };
  const rand = seededRandom(42);
  Object.values(ZONES).forEach((zone) => {
    for (let i = 0; i < zone.count; i++) {
      const width = 3 + rand() * 4;
      const depth = 3 + rand() * 4;
      const height = 6 + rand() * 22;
      const x = zone.x + (rand() - 0.5) * ZONE_SPREAD * 1.4;
      const z = zone.z + (rand() - 0.5) * ZONE_SPREAD;
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
