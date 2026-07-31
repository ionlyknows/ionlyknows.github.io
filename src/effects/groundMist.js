import * as THREE from 'three';

const MIST_HEIGHT = 0.9;
const EDGE_MARGIN = 12;

function buildMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.NormalBlending,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x0a0a0f) },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vWorldPos;
      void main() {
        vUv = uv;
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;
      varying vec3 vWorldPos;

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
        vec2 drift = vec2(uTime * 0.015, uTime * 0.01);
        float n1 = valueNoise(vWorldPos.xz * 0.035 + drift);
        float n2 = valueNoise(vWorldPos.xz * 0.09 - drift * 1.6);
        float mistAmount = n1 * 0.65 + n2 * 0.35;
        float mistMask = smoothstep(0.35, 0.75, mistAmount);

        float edgeX = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
        float edgeY = smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y);
        float edge = edgeX * edgeY;

        float alpha = mistMask * edge * 0.22;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
  });
}

export function createGroundMist(scene, bounds) {
  const width = bounds.maxX - bounds.minX + EDGE_MARGIN * 2;
  const depth = bounds.maxZ - bounds.minZ + EDGE_MARGIN * 2;
  const centerX = (bounds.maxX + bounds.minX) / 2;
  const centerZ = (bounds.maxZ + bounds.minZ) / 2;

  const geometry = new THREE.PlaneGeometry(width, depth, 1, 1);
  geometry.rotateX(-Math.PI / 2);
  const material = buildMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(centerX, MIST_HEIGHT, centerZ);
  scene.add(mesh);

  function update(color, elapsedTime) {
    material.uniforms.uColor.value.copy(color);
    material.uniforms.uTime.value = elapsedTime;
  }

  return { mesh, update };
}
