import * as THREE from 'three';

export function createGround() {
  const size = 400;
  const geometry = new THREE.PlaneGeometry(size, size, 1, 1);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0x00f0ff) },
      uBackground: { value: new THREE.Color(0x0a0a0f) },
      uCellSize: { value: 2.0 },
      uLineWidth: { value: 0.02 },
      uFadeDistance: { value: 80.0 },
    },
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform vec3 uBackground;
      uniform float uCellSize;
      uniform float uLineWidth;
      uniform float uFadeDistance;
      varying vec3 vWorldPos;

      float gridLine(vec2 coord, float cell, float width) {
        vec2 g = abs(fract(coord / cell - 0.5) - 0.5) / fwidth(coord / cell);
        float line = min(g.x, g.y);
        return 1.0 - smoothstep(0.0, width * 10.0, line);
      }

      void main() {
        float dist = length(vWorldPos.xz);
        float fade = 1.0 - smoothstep(0.0, uFadeDistance, dist);

        // gridLine()'s fwidth-based antialiasing is only stable while a grid
        // cell still spans a few screen pixels. At grazing viewing angles
        // (looking near the horizon from a low first-person camera), a
        // single pixel can cover many world-space units, so the derivative
        // swings wildly and the line test flickers between 0 and 1 per
        // pixel -- visible as a dashed/staticky pattern that shifts as the
        // camera moves. Fading the grid out once cells approach sub-pixel
        // size (independent of the existing distance fade, which alone
        // doesn't kick in early enough at shallow angles) keeps the pattern
        // from ever reaching that aliased regime.
        vec2 cellDerivative = fwidth(vWorldPos.xz / uCellSize);
        float cellDensity = max(cellDerivative.x, cellDerivative.y);
        float aaFade = 1.0 - smoothstep(0.15, 0.5, cellDensity);

        float line = gridLine(vWorldPos.xz, uCellSize, uLineWidth);
        vec3 color = mix(uBackground, uColor, line * fade * aaFade);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

  const ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  return ground;
}
