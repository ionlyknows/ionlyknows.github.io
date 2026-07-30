import * as THREE from 'three';
import { planStreetLamps } from '../lighting/lampPlacement.js';
import { breathingBrightness } from '../lighting/streetLights.js';
import { registerAnimator } from './animator.js';

const CONE_RADIUS = 1.6;
const CONE_HEIGHT_RATIO = 0.82;
const PEAK_ALPHA = 0.1;

function buildMaterial(color) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uBrightness: { value: 1 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uBrightness;
      varying vec2 vUv;
      void main() {
        float falloff = pow(vUv.y, 1.6);
        gl_FragColor = vec4(uColor, falloff * ${PEAK_ALPHA.toFixed(3)} * uBrightness);
      }
    `,
  });
}

export function createLampVolumetrics(scene) {
  const lamps = planStreetLamps();

  for (const { bulbPosition, color, phase } of lamps) {
    const coneHeight = bulbPosition.y * CONE_HEIGHT_RATIO;
    const geometry = new THREE.ConeGeometry(CONE_RADIUS, coneHeight, 16, 1, true);
    geometry.translate(0, -coneHeight / 2, 0);

    const material = buildMaterial(color);
    const cone = new THREE.Mesh(geometry, material);
    cone.position.copy(bulbPosition);
    scene.add(cone);

    registerAnimator((elapsed) => {
      material.uniforms.uBrightness.value = breathingBrightness(elapsed, phase);
    });
  }

  return lamps.length;
}
