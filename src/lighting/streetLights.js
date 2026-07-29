import * as THREE from 'three';
import { getRoadCurves, ROAD_WIDTH } from '../city.js';
import { getPoleMaterial, getLampMaterial } from '../materials/lampMaterials.js';

const LAMP_SPACING = 9;
const MIN_LAMPS_PER_ROAD = 2;
const MAX_LAMPS_PER_ROAD = 5;
const U_MARGIN = 0.08;

const POLE_HEIGHT = 4.2;
const ARM_LENGTH = 0.9;
const SIDE_OFFSET = ROAD_WIDTH / 2 + 1.1;

const LIGHT_INTENSITY = 18;
const LIGHT_DISTANCE = 12;
const LIGHT_DECAY = 2;

function buildLampPost(zoneColor) {
  const group = new THREE.Group();
  const poleMat = getPoleMaterial();

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, POLE_HEIGHT, 8), poleMat);
  pole.position.y = POLE_HEIGHT / 2;
  group.add(pole);

  const arm = new THREE.Mesh(new THREE.BoxGeometry(ARM_LENGTH, 0.06, 0.06), poleMat);
  arm.position.set(ARM_LENGTH / 2, POLE_HEIGHT - 0.15, 0);
  group.add(arm);

  const bulbPos = new THREE.Vector3(ARM_LENGTH, POLE_HEIGHT - 0.3, 0);

  const bulbMat = getLampMaterial(zoneColor, 'bulb');
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), bulbMat);
  bulb.position.copy(bulbPos);
  group.add(bulb);

  const glowMat = getLampMaterial(zoneColor, 'glow');
  const glow = new THREE.Mesh(new THREE.SphereGeometry(0.4, 10, 8), glowMat);
  glow.position.copy(bulbPos);
  group.add(glow);

  const light = new THREE.PointLight(bulbMat.color.clone(), LIGHT_INTENSITY, LIGHT_DISTANCE, LIGHT_DECAY);
  light.position.copy(bulbPos);
  group.add(light);

  return group;
}

function lampCountForLength(length) {
  const usableLength = length * (1 - 2 * U_MARGIN);
  const raw = Math.round(usableLength / LAMP_SPACING);
  return Math.min(MAX_LAMPS_PER_ROAD, Math.max(MIN_LAMPS_PER_ROAD, raw));
}

export function createStreetLights(scene) {
  const roads = getRoadCurves();
  let placed = 0;

  for (const { zone, curve } of roads) {
    const length = curve.getLength();
    const count = lampCountForLength(length);

    for (let i = 0; i < count; i++) {
      const u = U_MARGIN + (i / (count - 1)) * (1 - 2 * U_MARGIN);
      const point = curve.getPointAt(u);
      const tangent = curve.getTangentAt(u);
      const perp = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      const side = i % 2 === 0 ? 1 : -1;

      const lamp = buildLampPost(zone.color);
      lamp.position.set(
        point.x + perp.x * SIDE_OFFSET * side,
        0,
        point.z + perp.z * SIDE_OFFSET * side
      );

      const dirX = -perp.x * side;
      const dirZ = -perp.z * side;
      lamp.rotation.y = Math.atan2(-dirZ, dirX);

      scene.add(lamp);
      placed++;
    }
  }

  return placed;
}
