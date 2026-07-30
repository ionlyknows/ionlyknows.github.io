import * as THREE from 'three';
import { seededRandom } from '../city.js';
import { registerAnimator } from './animator.js';

const PARTICLE_COUNT = 400;
const AREA = { minX: -40, maxX: 40, minZ: -70, maxZ: 15 };
const HEIGHT_RANGE = 14;

function buildGeometry(seed) {
  const rand = seededRandom(seed);
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const seeds = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3 + 0] = THREE.MathUtils.lerp(AREA.minX, AREA.maxX, rand());
    positions[i * 3 + 1] = rand() * HEIGHT_RANGE;
    positions[i * 3 + 2] = THREE.MathUtils.lerp(AREA.minZ, AREA.maxZ, rand());
    seeds[i] = rand() * 100;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  return geometry;
}

function buildMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x9fb4c9) },
    },
    vertexShader: `
      attribute float aSeed;
      uniform float uTime;
      varying float vAlpha;
      void main() {
        vec3 pos = position;
        float speed = 0.3 + fract(aSeed * 0.137) * 0.4;
        pos.y = mod(pos.y + uTime * speed, ${HEIGHT_RANGE.toFixed(1)});
        pos.x += sin(uTime * 0.8 + aSeed) * 0.6;
        pos.z += cos(uTime * 0.6 + aSeed * 1.3) * 0.6;
        vAlpha = 0.15 + 0.15 * sin(uTime * 1.3 + aSeed * 3.0);
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = 3.0 * (40.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
  });
}

export function createParticles(scene, seed = 4200) {
  const geometry = buildGeometry(seed);
  const material = buildMaterial();
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  registerAnimator((elapsed) => {
    material.uniforms.uTime.value = elapsed;
  });

  return points;
}
