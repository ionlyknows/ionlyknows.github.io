import * as THREE from 'three';
import { getRoadCurves, getGates, ROAD_WIDTH, GATE_ARCH_CLEARANCE, seededRandom } from '../city.js';
import { SIDE_OFFSET as LAMP_SIDE_OFFSET } from '../lighting/lampPlacement.js';

export const PROP_SPACING = 6;
export const MIN_PROPS_PER_ROAD = 3;
export const MAX_PROPS_PER_ROAD = 8;
const U_MARGIN = 0.05;
export const SIDE_OFFSET = LAMP_SIDE_OFFSET + 1.0;

const PROP_TYPES = ['trashBin', 'trashBin', 'pole', 'barrier', 'bench', 'vendingMachine'];

function propCountForLength(length) {
  const usableLength = length * (1 - 2 * U_MARGIN);
  const raw = Math.round(usableLength / PROP_SPACING);
  return Math.min(MAX_PROPS_PER_ROAD, Math.max(MIN_PROPS_PER_ROAD, raw));
}

export function planStreetProps(seed = 900) {
  const roads = getRoadCurves();
  const gates = getGates();
  const rand = seededRandom(seed);
  const props = [];

  for (const { zone, curve } of roads) {
    const gate = gates.find((g) => g.zone === zone);
    const length = curve.getLength();
    const count = propCountForLength(length);

    for (let i = 0; i < count; i++) {
      const u = U_MARGIN + (i / (count - 1)) * (1 - 2 * U_MARGIN);
      const point = curve.getPointAt(u);

      if (gate && Math.hypot(point.x - gate.point.x, point.z - gate.point.z) < GATE_ARCH_CLEARANCE) {
        continue;
      }

      const tangent = curve.getTangentAt(u);
      const perp = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      const side = i % 2 === 0 ? 1 : -1;

      const position = new THREE.Vector3(
        point.x + perp.x * SIDE_OFFSET * side,
        0,
        point.z + perp.z * SIDE_OFFSET * side
      );

      const dirX = -perp.x * side;
      const dirZ = -perp.z * side;
      const rotationY = Math.atan2(-dirZ, dirX);

      const type = PROP_TYPES[Math.floor(rand() * PROP_TYPES.length)];

      props.push({ type, position, rotationY, zoneColor: zone.color });
    }
  }

  return props;
}
