import * as THREE from 'three';
import { COLORS } from '../scene.js';

const WARM_WHITE = 0xfff1d6;
const TINT_STRENGTH = 0.22;

const poleMaterial = new THREE.MeshStandardMaterial({
  color: COLORS.steel,
  metalness: 0.6,
  roughness: 0.5,
});

const cache = new Map();

export function getPoleMaterial() {
  return poleMaterial;
}

export function getLampMaterial(zoneColor, kind = 'bulb') {
  const key = `${zoneColor}-${kind}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const color = new THREE.Color(WARM_WHITE).lerp(new THREE.Color(zoneColor), TINT_STRENGTH);

  const material = kind === 'glow'
    ? new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
        toneMapped: false,
      })
    : new THREE.MeshBasicMaterial({
        color,
        fog: false,
        toneMapped: false,
      });

  cache.set(key, material);
  return material;
}

export function disposeLampMaterials() {
  for (const material of cache.values()) material.dispose();
  cache.clear();
  poleMaterial.dispose();
}
