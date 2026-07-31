import * as THREE from 'three';
import { ZONES, seededRandom } from '../city.js';
import { registerAnimator } from './animator.js';

const PLUME_HEIGHT = 3.2;
const PLUME_WIDTH = 1.1;
const ZONE_OFFSET_RADIUS = 6;

function buildMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x8fa0ad) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float valueNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 p = vUv * vec2(2.0, 3.0) - vec2(1.0, uTime * 0.6);
        float n = valueNoise(p * 2.5);
        float wisp = smoothstep(0.35, 0.75, n);
        float vertical = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
        float edge = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
        float alpha = wisp * vertical * edge * 0.18;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
  });
}

function buildPlume() {
  // The two crossed planes below share this material and overlap heavily
  // near their shared vertical axis. Since blending is additive, overlapping
  // fragments sum their brightness rather than compositing normally -- alpha
  // here is tuned assuming ~2x stacking in the overlap region, so it reads
  // as smoke rather than blowing out to white once ACES tone mapping and
  // exposure (see postprocessing/composer.js) are applied.
  const group = new THREE.Group();
  const material = buildMaterial();
  const geometry = new THREE.PlaneGeometry(PLUME_WIDTH, PLUME_HEIGHT, 1, 1);
  geometry.translate(0, PLUME_HEIGHT / 2, 0);

  const planeA = new THREE.Mesh(geometry, material);
  group.add(planeA);
  const planeB = new THREE.Mesh(geometry, material);
  planeB.rotation.y = Math.PI / 2;
  group.add(planeB);

  registerAnimator((elapsed) => {
    material.uniforms.uTime.value = elapsed;
  });

  return group;
}

export function createSteamVents(scene, seed = 7700) {
  const rand = seededRandom(seed);
  let count = 0;

  for (const zone of Object.values(ZONES)) {
    const angle = rand() * Math.PI * 2;
    const x = zone.x + Math.cos(angle) * ZONE_OFFSET_RADIUS;
    const z = zone.z + Math.sin(angle) * ZONE_OFFSET_RADIUS;

    const plume = buildPlume();
    plume.position.set(x, 0, z);
    scene.add(plume);
    count++;
  }

  return count;
}
