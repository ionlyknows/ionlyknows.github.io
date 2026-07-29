import * as THREE from 'three';
import { planStreetLamps } from '../lighting/lampPlacement.js';

const CABLE_COLOR = 0x151515;
const CABLE_RADIUS = 0.025;
const SAG = 0.6;
const TUBE_SEGMENTS = 12;
const RADIAL_SEGMENTS = 5;

const cableMaterial = new THREE.MeshStandardMaterial({
  color: CABLE_COLOR,
  roughness: 0.9,
  metalness: 0.1,
});

function buildCable(start, end) {
  const mid = start.clone().lerp(end, 0.5);
  mid.y -= SAG;
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  const geometry = new THREE.TubeGeometry(curve, TUBE_SEGMENTS, CABLE_RADIUS, RADIAL_SEGMENTS, false);
  return new THREE.Mesh(geometry, cableMaterial);
}

export function createCables(scene) {
  const lamps = planStreetLamps();

  const byRoad = new Map();
  for (const lamp of lamps) {
    const list = byRoad.get(lamp.zone) ?? [];
    list.push(lamp);
    byRoad.set(lamp.zone, list);
  }

  let count = 0;
  for (const roadLamps of byRoad.values()) {
    for (let i = 0; i < roadLamps.length - 1; i++) {
      const cable = buildCable(roadLamps[i].bulbPosition, roadLamps[i + 1].bulbPosition);
      scene.add(cable);
      count++;
    }
  }

  return count;
}
