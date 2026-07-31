import * as THREE from 'three';

const cache = new Map();

export function getNeonMaterial(zoneColor, kind = 'tube') {
  const key = `${zoneColor}-${kind}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const material = kind === 'glow'
    ? new THREE.MeshBasicMaterial({
        color: zoneColor,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      })
    : new THREE.MeshBasicMaterial({
        color: zoneColor,
        toneMapped: false,
      });

  cache.set(key, material);
  return material;
}

export function disposeNeonMaterials() {
  for (const material of cache.values()) material.dispose();
  cache.clear();
}
