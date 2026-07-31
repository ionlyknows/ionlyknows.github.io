import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { BLOOM_LAYER } from './layers.js';
import { CyberGradeShader } from './colorGradePass.js';
import { DEBUG } from '../config.js';

const BLOOM_STRENGTH = 0.85;
const BLOOM_RADIUS = 0.45;
const BLOOM_THRESHOLD = 0.35;
const TONE_MAPPING_EXPOSURE = 1.15;

const mixShaderDef = {
  uniforms: {
    baseTexture: { value: null },
    bloomTexture: { value: null },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D baseTexture;
    uniform sampler2D bloomTexture;
    varying vec2 vUv;
    void main() {
      gl_FragColor = texture2D(baseTexture, vUv) + texture2D(bloomTexture, vUv);
    }
  `,
};

export function createPostProcessing(renderer, scene, camera) {
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = TONE_MAPPING_EXPOSURE;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const size = new THREE.Vector2();
  renderer.getSize(size);

  function createRenderTarget() {
    return new THREE.WebGLRenderTarget(size.x, size.y, {
      type: THREE.HalfFloatType,
      samples: 4,
    });
  }

  const bloomComposer = new EffectComposer(renderer, createRenderTarget());
  bloomComposer.renderToScreen = false;
  bloomComposer.addPass(new RenderPass(scene, camera));

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(size.x, size.y),
    BLOOM_STRENGTH,
    BLOOM_RADIUS,
    BLOOM_THRESHOLD
  );
  bloomComposer.addPass(bloomPass);

  const finalComposer = new EffectComposer(renderer, createRenderTarget());
  finalComposer.addPass(new RenderPass(scene, camera));

  const mixPass = new ShaderPass(mixShaderDef, 'baseTexture');
  mixPass.uniforms.bloomTexture.value = bloomComposer.renderTarget2.texture;
  finalComposer.addPass(mixPass);

  const gradePass = new ShaderPass(CyberGradeShader);
  finalComposer.addPass(gradePass);

  const smaaPass = new SMAAPass(size.x * renderer.getPixelRatio(), size.y * renderer.getPixelRatio());
  finalComposer.addPass(smaaPass);

  const outputPass = new OutputPass();
  finalComposer.addPass(outputPass);

  function resize(width, height) {
    bloomComposer.setSize(width, height);
    finalComposer.setSize(width, height);
    if (DEBUG) console.log('[DEBUG] postFX resized:', width, height);
  }

  function render() {
    camera.layers.set(BLOOM_LAYER);
    bloomComposer.render();
    camera.layers.set(0);
    finalComposer.render();
  }

  if (DEBUG) console.log('[DEBUG] postFX pipeline ready (bloom + grade + SMAA + ACES)');

  return { render, resize, bloomPass, gradePass };
}
