import * as THREE from 'three';
import { registerAnimator } from './animator.js';

function flickerBrightness(t, phase) {
  const a = Math.sin(t * 8.0 + phase);
  const b = Math.sin(t * 2.3 + phase * 1.7);
  const c = Math.sin(t * 13.0 + phase * 0.6);
  const combined = a * 0.5 + b * 0.35 + c * 0.15;
  return THREE.MathUtils.clamp(0.8 + combined * 0.35, 0.15, 1.0);
}

export function registerFlicker(material, phase) {
  const baseColor = material.color.clone();
  return registerAnimator((elapsed) => {
    const brightness = flickerBrightness(elapsed, phase);
    material.color.copy(baseColor).multiplyScalar(brightness);
  });
}
