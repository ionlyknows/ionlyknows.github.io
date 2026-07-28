import * as THREE from 'three';

// Buildings previously used a single unlit MeshBasicMaterial body (pure flat
// color, no reaction to light). This gives each zone two lit style variants
// so Phase 5's district lighting (step 4) has something to actually light.
//
// Materials are cached and shared: with up to 138 buildings at stress
// density, creating one material per building would mean 138 separate GPU
// material instances for what is visually only 4 zones x 2 variants = 8
// distinct looks. Sharing keeps memory flat regardless of building count.

const cache = new Map();

const VARIANTS = {
  glass: {
    // Cool, low-saturation panel look with a hint of zone-color tint and
    // higher metalness/lower roughness so it picks up point-light highlights
    // and future reflection probes cleanly.
    baseColor: 0x0b0d14,
    metalness: 0.55,
    roughness: 0.25,
    tintStrength: 0.12,
  },
  industrial: {
    // Near-black matte concrete/panel look; mostly reads via silhouette and
    // neon trim rather than surface highlights.
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
