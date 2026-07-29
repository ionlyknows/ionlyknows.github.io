import * as THREE from 'three';

const cache = new Map();

const VARIANTS = {
  glass: {
    baseColor: 0x0b0d14,
    metalness: 0.55,
    roughness: 0.25,
    tintStrength: 0.12,
  },
  industrial: {
    baseColor: 0x0d0d10,
    metalness: 0.1,
    roughness: 0.85,
    tintStrength: 0.05,
  },
};

export function getBuildingBodyMaterial(zoneColor, variant = 'industrial') {
  const key = `${zoneColor}-${variant}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const spec = VARIANTS[variant] ?? VARIANTS.industrial;
  const color = new THREE.Color(spec.baseColor).lerp(
    new THREE.Color(zoneColor),
    spec.tintStrength
  );

  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: spec.metalness,
    roughness: spec.roughness,
  });

  cache.set(key, material);
  return material;
}

export function disposeBuildingMaterials() {
  for (const material of cache.values()) material.dispose();
  cache.clear();
}
