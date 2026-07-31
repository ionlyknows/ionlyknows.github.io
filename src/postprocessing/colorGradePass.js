import * as THREE from 'three';

export const GRADE_DEFAULTS = {
  contrast: 1.04,
  saturation: 1.08,
  aberration: 0.0018,
  vignetteRadius: 0.35,
  vignetteSoftness: 0.7,
  vignetteIntensity: 0.45,
  shadowTint: new THREE.Color(0.85, 0.95, 1.05),
  highlightTint: new THREE.Color(1.05, 0.97, 1.02),
};

export const CyberGradeShader = {
  name: 'CyberGradeShader',
  uniforms: {
    tDiffuse: { value: null },
    uContrast: { value: GRADE_DEFAULTS.contrast },
    uSaturation: { value: GRADE_DEFAULTS.saturation },
    uAberration: { value: GRADE_DEFAULTS.aberration },
    uVignetteRadius: { value: GRADE_DEFAULTS.vignetteRadius },
    uVignetteSoftness: { value: GRADE_DEFAULTS.vignetteSoftness },
    uVignetteIntensity: { value: GRADE_DEFAULTS.vignetteIntensity },
    uShadowTint: { value: GRADE_DEFAULTS.shadowTint.clone() },
    uHighlightTint: { value: GRADE_DEFAULTS.highlightTint.clone() },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uContrast;
    uniform float uSaturation;
    uniform float uAberration;
    uniform float uVignetteRadius;
    uniform float uVignetteSoftness;
    uniform float uVignetteIntensity;
    uniform vec3 uShadowTint;
    uniform vec3 uHighlightTint;
    varying vec2 vUv;

    vec3 applyContrast(vec3 color, float amount) {
      return (color - 0.5) * amount + 0.5;
    }

    vec3 applySaturation(vec3 color, float amount) {
      float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
      return mix(vec3(luma), color, amount);
    }

    void main() {
      vec2 centered = vUv - 0.5;
      vec2 offset = centered * uAberration;

      vec3 color = vec3(
        texture2D(tDiffuse, vUv - offset).r,
        texture2D(tDiffuse, vUv).g,
        texture2D(tDiffuse, vUv + offset).b
      );

      color = applyContrast(color, uContrast);
      color = applySaturation(color, uSaturation);

      float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
      vec3 tint = mix(uShadowTint, uHighlightTint, luma);
      color = mix(color, color * tint, 0.18);

      float dist = length(centered);
      float vignette = smoothstep(uVignetteRadius, uVignetteRadius + uVignetteSoftness, dist);
      color *= 1.0 - vignette * uVignetteIntensity;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
};
