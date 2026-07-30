import * as THREE from 'three';
import { planStreetLamps } from './lampPlacement.js';
import { getPoleMaterial, getLampMaterial } from '../materials/lampMaterials.js';
import { registerAnimator } from '../effects/animator.js';

const POLE_HEIGHT = 4.2;
const ARM_LENGTH = 0.9;

const LIGHT_INTENSITY = 18;
const LIGHT_DISTANCE = 12;
const LIGHT_DECAY = 2;

export function breathingBrightness(t, phase) {
  return 0.85 + 0.15 * Math.sin(t * 1.6 + phase);
}

function buildLampPost(zoneColor, phase) {
  const group = new THREE.Group();
  const poleMat = getPoleMaterial();

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, POLE_HEIGHT, 8), poleMat);
  pole.position.y = POLE_HEIGHT / 2;
  group.add(pole);

  const arm = new THREE.Mesh(new THREE.BoxGeometry(ARM_LENGTH, 0.06, 0.06), poleMat);
  arm.position.set(ARM_LENGTH / 2, POLE_HEIGHT - 0.15, 0);
  group.add(arm);

  const bulbPos = new THREE.Vector3(ARM_LENGTH, POLE_HEIGHT - 0.3, 0);

  const bulbMat = getLampMaterial(zoneColor, 'bulb').clone();
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), bulbMat);
  bulb.position.copy(bulbPos);
  group.add(bulb);

  const glowMat = getLampMaterial(zoneColor, 'glow').clone();
  const glow = new THREE.Mesh(new THREE.SphereGeometry(0.4, 10, 8), glowMat);
  glow.position.copy(bulbPos);
  group.add(glow);

  const light = new THREE.PointLight(bulbMat.color.clone(), LIGHT_INTENSITY, LIGHT_DISTANCE, LIGHT_DECAY);
  light.position.copy(bulbPos);
  group.add(light);

  const bulbBase = bulbMat.color.clone();
  const glowBase = glowMat.color.clone();
  registerAnimator((elapsed) => {
    const brightness = breathingBrightness(elapsed, phase);
    bulbMat.color.copy(bulbBase).multiplyScalar(brightness);
    glowMat.color.copy(glowBase).multiplyScalar(brightness);
    light.intensity = LIGHT_INTENSITY * brightness;
  });

  return group;
}

export function createStreetLights(scene) {
  const lamps = planStreetLamps();

  for (const { groundPosition, rotationY, color, phase } of lamps) {
    const lamp = buildLampPost(color, phase);
    lamp.position.copy(groundPosition);
    lamp.rotation.y = rotationY;
    scene.add(lamp);
  }

  return lamps.length;
}
