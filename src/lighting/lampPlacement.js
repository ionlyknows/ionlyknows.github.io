import * as THREE from 'three';
import { getRoadCurves, getGates, ROAD_WIDTH, GATE_ARCH_CLEARANCE } from '../city.js';

export const LAMP_SPACING = 9;
export const MIN_LAMPS_PER_ROAD = 2;
export const MAX_LAMPS_PER_ROAD = 5;
export const U_MARGIN = 0.08;
export const SIDE_OFFSET = ROAD_WIDTH / 2 + 1.1;
export const BULB_HEIGHT = 3.9;

function lampCountForLength(length) {
  const usableLength = length * (1 - 2 * U_MARGIN);
  const raw = Math.round(usableLength / LAMP_SPACING);
  return Math.min(MAX_LAMPS_PER_ROAD, Math.max(MIN_LAMPS_PER_ROAD, raw));
}

export function planStreetLamps() {
  const roads = getRoadCurves();
  const gates = getGates();
  const lamps = [];

  for (const { zone, curve } of roads) {
    const gate = gates.find((g) => g.zone === zone);
    const length = curve.getLength();
    const count = lampCountForLength(length);

    for (let i = 0; i < count; i++) {
      const u = U_MARGIN + (i / (count - 1)) * (1 - 2 * U_MARGIN);
      const point = curve.getPointAt(u);

      if (gate && Math.hypot(point.x - gate.point.x, point.z - gate.point.z) < GATE_ARCH_CLEARANCE) {
        continue;
      }

      const tangent = curve.getTangentAt(u);
      const perp = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      const side = i % 2 === 0 ? 1 : -1;

      const groundPosition = new THREE.Vector3(
        point.x + perp.x * SIDE_OFFSET * side,
        0,
        point.z + perp.z * SIDE_OFFSET * side
      );
      const bulbPosition = groundPosition.clone().setY(BULB_HEIGHT);

      const dirX = -perp.x * side;
      const dirZ = -perp.z * side;
      const rotationY = Math.atan2(-dirZ, dirX);

      const phase = lamps.length * 2.399;

      lamps.push({ groundPosition, bulbPosition, rotationY, color: zone.color, zone, phase });
    }
  }

  return lamps;
}
