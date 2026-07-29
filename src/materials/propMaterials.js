import * as THREE from 'three';

const cache = new Map();

const barrierBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, metalness: 0.1 });
const barrierStripeMaterial = new THREE.MeshStandardMaterial({ color: 0xff9500, roughness: 0.6, metalness: 0.1 });
const benchSeatMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a30, roughness: 0.7, metalness: 0.2 });

export function getBarrierBaseMaterial() {
  return barrierBaseMaterial;
}

export function getBarrierStripeMaterial() {
  return barrierStripeMaterial;
}

export function getBenchSeatMaterial() {
  return benchSeatMaterial;
}

export function getBinLidMaterial(zoneColor) {
  const cached = cache.get(zoneColor);
  if (cached) return cached;

  const color = new THREE.Color(0x1a1a1a).lerp(new THREE.Color(zoneColor), 0.35);
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.3 });
  cache.set(zoneColor, material);
  return material;
}

export function disposePropMaterials() {
  for (const material of cache.values()) material.dispose();
  cache.clear();
  barrierBaseMaterial.dispose();
  barrierStripeMaterial.dispose();
  benchSeatMaterial.dispose();
}
