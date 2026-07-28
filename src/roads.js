import * as THREE from 'three';
import { getRoadCurves, ROAD_WIDTH } from './city.js';

function roadMesh(curve, color) {
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

  const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uSurface: { value: new THREE.Color(0x0d0d14) },
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
      uniform vec3 uSurface;
      varying vec2 vUv;
      void main() {
        float edge = 1.0 - (smoothstep(0.0, 0.04, vUv.x) * (1.0 - smoothstep(0.96, 1.0, vUv.x)));
        float d = fract(vUv.y * 20.0);
        float aa = clamp(fwidth(d), 0.001, 0.2);
        float dash = smoothstep(0.5 - aa, 0.5 + aa, d);
        vec3 color = mix(uSurface, uColor, edge * 0.9);
        color = mix(color, uColor, dash * 0.15 * (1.0 - edge));
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

  return new THREE.Mesh(geometry, material);
}

export function createRoads(scene) {
  const roads = getRoadCurves();
  roads.forEach(({ zone, curve }) => {
    const mesh = roadMesh(curve, zone.color);
    scene.add(mesh);
  });
  return roads;
}
