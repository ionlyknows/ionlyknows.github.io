import * as THREE from 'three';
import { planStreetProps } from './streetPropPlacement.js';
import { getPoleMaterial } from '../materials/lampMaterials.js';
import { getNeonMaterial } from '../materials/neonMaterials.js';
import {
  getBarrierBaseMaterial,
  getBarrierStripeMaterial,
  getBenchSeatMaterial,
  getBinLidMaterial,
} from '../materials/propMaterials.js';

const FOOTPRINTS = {
  trashBin: { halfW: 0.3, halfD: 0.3 },
  pole: { halfW: 0.09, halfD: 0.09 },
  barrier: { halfW: 0.6, halfD: 0.2 },
  bench: { halfW: 0.7, halfD: 0.3 },
  vendingMachine: { halfW: 0.45, halfD: 0.35 },
};

function buildTrashBin(zoneColor) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.65, 10), getPoleMaterial());
  body.position.y = 0.325;
  group.add(body);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 10), getBinLidMaterial(zoneColor));
  lid.position.y = 0.68;
  group.add(lid);
  return group;
}

function buildUtilityPole() {
  const group = new THREE.Group();
  const mat = getPoleMaterial();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 5.0, 8), mat);
  pole.position.y = 2.5;
  group.add(pole);
  for (const y of [3.6, 4.1]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 0.05), mat);
    arm.position.y = y;
    group.add(arm);
  }
  return group;
}

function buildBarrier() {
  const group = new THREE.Group();
  const baseMat = getBarrierBaseMaterial();
  const stripeMat = getBarrierStripeMaterial();

  const panel = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 0.05), baseMat);
  panel.position.y = 0.55;
  group.add(panel);

  for (let i = -1; i <= 1; i += 2) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 0.052), stripeMat);
    stripe.position.set(i * 0.32, 0.55, 0);
    stripe.rotation.z = i * 0.35;
    group.add(stripe);
  }

  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.55, 0.4), baseMat);
  legL.position.set(-0.5, 0.275, 0);
  group.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.5;
  group.add(legR);

  return group;
}

function buildBench() {
  const group = new THREE.Group();
  const seatMat = getBenchSeatMaterial();
  const frameMat = getPoleMaterial();

  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.5), seatMat);
  seat.position.y = 0.45;
  group.add(seat);

  const back = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 0.06), seatMat);
  back.position.set(0, 0.7, -0.22);
  group.add(back);

  for (const x of [-0.6, 0.6]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.45), frameMat);
    leg.position.set(x, 0.225, 0);
    group.add(leg);
  }

  return group;
}

function buildVendingMachine(zoneColor) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.8, 0.7), getPoleMaterial());
  body.position.y = 0.9;
  group.add(body);

  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 0.02), getNeonMaterial(zoneColor, 'tube'));
  screen.position.set(0, 1.05, 0.36);
  group.add(screen);

  const glow = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.2, 0.02), getNeonMaterial(zoneColor, 'glow'));
  glow.position.set(0, 1.05, 0.35);
  group.add(glow);

  return group;
}

const BUILDERS = {
  trashBin: buildTrashBin,
  pole: buildUtilityPole,
  barrier: buildBarrier,
  bench: buildBench,
  vendingMachine: buildVendingMachine,
};

function overlapsCollider(x, z, footprint, colliders) {
  for (const c of colliders) {
    if (Math.abs(x - c.x) < footprint.halfW + c.halfW && Math.abs(z - c.z) < footprint.halfD + c.halfD) {
      return true;
    }
  }
  return false;
}

export function createStreetProps(scene, buildingColliders = []) {
  const props = planStreetProps();
  const colliders = [];

  for (const { type, position, rotationY, zoneColor } of props) {
    const footprint = FOOTPRINTS[type];
    const builder = BUILDERS[type];
    if (!footprint || !builder) continue;
    if (overlapsCollider(position.x, position.z, footprint, buildingColliders)) continue;

    const group = builder(zoneColor);
    group.position.copy(position);
    group.rotation.y = rotationY;
    scene.add(group);

    colliders.push({ x: position.x, z: position.z, halfW: footprint.halfW, halfD: footprint.halfD });
  }

  return colliders;
}
