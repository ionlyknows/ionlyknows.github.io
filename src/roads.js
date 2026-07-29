import * as THREE from 'three';
import { getRoadCurves, ROAD_WIDTH } from './city.js';
import { planStreetLamps, MAX_LAMPS_PER_ROAD } from './lighting/lampPlacement.js';

function padLampUniforms(roadLamps) {
  const positions = [];
  const colors = [];
  for (let i = 0; i < MAX_LAMPS_PER_ROAD; i++) {
    const lamp = roadLamps[i];
    positions.push(lamp ? new THREE.Vector2(lamp.bulbPosition.x, lamp.bulbPosition.z) : new THREE.Vector2());
    colors.push(lamp ? new THREE.Color(lamp.color) : new THREE.Color(0x000000));
  }
  return { positions, colors, count: Math.min(roadLamps.length, MAX_LAMPS_PER_ROAD) };
}

function roadMesh(curve, color, roadLamps) {
  const segments = 48;
  const points = curve.getPoints(segments);
  const positions = [];
  const uvs = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = points[i];
    const tangent = curve.getTangentAt(t);
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    const left = point.clone().addScaledVector(side, ROAD_WIDTH / 2);
    const right = point.clone().addScaledVector(side, -ROAD_WIDTH / 2);
    positions.push(left.x, left.y, left.z, right.x, right.y, right.z);
    uvs.push(0, t, 1, t);
  }

  const indices = [];
  for (let i = 0; i < segments; i++) {
    const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1;
    indices.push(a, b, c, b, d, c);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

  const { positions: lampPositions, colors: lampColors, count: lampCount } = padLampUniforms(roadLamps);

  const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uSurface: { value: new THREE.Color(0x0d0d14) },
      uReflectionColor: { value: new THREE.Color(0x0a0a0f) },
      uTime: { value: 0 },
      uLampPos: { value: lampPositions },
      uLampColor: { value: lampColors },
      uLampCount: { value: lampCount },
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
      uniform vec3 uColor;
      uniform vec3 uSurface;
      uniform vec3 uReflectionColor;
      uniform float uTime;
      uniform vec2 uLampPos[${MAX_LAMPS_PER_ROAD}];
      uniform vec3 uLampColor[${MAX_LAMPS_PER_ROAD}];
      uniform int uLampCount;
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
        float edge = 1.0 - (smoothstep(0.0, 0.04, vUv.x) * (1.0 - smoothstep(0.96, 1.0, vUv.x)));
        float d = fract(vUv.y * 20.0);
        float aa = clamp(fwidth(d), 0.001, 0.2);
        float dash = smoothstep(0.5 - aa, 0.5 + aa, d);
        vec3 color = mix(uSurface, uColor, edge * 0.9);
        color = mix(color, uColor, dash * 0.15 * (1.0 - edge));

        float puddleMask = smoothstep(0.55, 0.75, valueNoise(vWorldPos.xz * 0.15 + uTime * 0.02));
        float wear = valueNoise(vWorldPos.xz * 0.05 + 50.0) * 0.15 - 0.075;
        color *= 1.0 + wear * (1.0 - puddleMask);

        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float fresnel = pow(1.0 - clamp(dot(viewDir, vec3(0.0, 1.0, 0.0)), 0.0, 1.0), 3.0);
        float reflectivity = fresnel * mix(0.08, 0.65, puddleMask);
        color = mix(color, uReflectionColor, reflectivity);

        vec3 lampGlow = vec3(0.0);
        for (int i = 0; i < ${MAX_LAMPS_PER_ROAD}; i++) {
          if (i >= uLampCount) break;
          float dist = length(vWorldPos.xz - uLampPos[i]);
          float falloff = smoothstep(6.0, 0.0, dist);
          lampGlow += uLampColor[i] * falloff;
        }
        color += lampGlow * puddleMask * 0.5;

        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

  return new THREE.Mesh(geometry, material);
}

export function createRoads(scene) {
  const roads = getRoadCurves();
  const lamps = planStreetLamps();
  const materials = [];

  roads.forEach(({ zone, curve }) => {
    const roadLamps = lamps.filter((lamp) => lamp.zone === zone);
    const mesh = roadMesh(curve, zone.color, roadLamps);
    materials.push(mesh.material);
    scene.add(mesh);
  });

  function updateReflections(reflectionColor, elapsedTime) {
    for (const material of materials) {
      material.uniforms.uReflectionColor.value.copy(reflectionColor);
      material.uniforms.uTime.value = elapsedTime;
    }
  }

  return { roads, updateReflections };
}
