import * as THREE from 'three';
import { COLORS } from './scene.js';
export const ZONES = {
  code: { label: 'code district', sector: 1, color: COLORS.cyan, centerZ: -14, count: 8 },
  design: { label: 'design district', sector: 2, color: COLORS.magenta, centerZ: -34, count: 6 },
};
const ENTRANCE_ZONE = { label: 'entrance', sector: 0 };
const ZONE_SPREAD = 20;
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
  const bounds = { minX: -35, maxX: 35, minZ: -55, maxZ: 15, colliders: [] };
  const rand = seededRandom(42);
  Object.values(ZONES).forEach((zone) => {
    for (let i = 0; i < zone.count; i++) {
      const width = 3 + rand() * 4;
      const depth = 3 + rand() * 4;
      const height = 6 + rand() * 22;
      const x = (rand() - 0.5) * ZONE_SPREAD * 1.4;
      const z = zone.centerZ + (rand() - 0.5) * ZONE_SPREAD;
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
export function zoneAt(z) {
  if (z < -29) return ZONES.design;
  if (z < -4) return ZONES.code;
  return ENTRANCE_ZONE;
}
