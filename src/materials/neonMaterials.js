import * as THREE from 'three';

// Neon signage needs to read as "glowing" with zero scene lights, since
// district point lights don't land until Phase 5 step 4. MeshBasicMaterial
// is unlit by definition -- its color is the final pixel color regardless
// of what illuminates the scene -- so it's the right base for both the
// crisp "tube" line and the soft "glow" halo behind it.
//
// Cached per (zoneColor, kind) for the same reason as buildingMaterials.js:
// every building in a zone reuses one of two material instances instead of
// allocating its own.

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
        fog: false,
        toneMapped: false,
      })
    : new THREE.MeshBasicMaterial({
        color: zoneColor,
        fog: false,
        toneMapped: false,
      });

  cache.set(key, material);
  return material;
}

export function disposeNeonMaterials() {
  for (const material of cache.values()) material.dispose();
  cache.clear();
}
