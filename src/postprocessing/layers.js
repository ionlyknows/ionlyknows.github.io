export const BLOOM_LAYER = 1;

export function enableBloom(object3d) {
  object3d.traverse((child) => {
    if (child.isMesh || child.isLineSegments || child.isLine || child.isPoints) {
      child.layers.enable(BLOOM_LAYER);
    }
  });
}