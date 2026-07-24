import * as THREE from 'three';

export const COLORS = {
  void: 0x0a0a0f,
  cyan: 0x00f0ff,
  magenta: 0xff2ec4,
  yellow: 0xe8ff3d,
  steel: 0x2a2f3a,
};

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.void);
  scene.fog = new THREE.FogExp2(COLORS.void, 0.035);
  return scene;
}

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.7, 5);
  return camera;
}

export function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.getElementById('app').prepend(renderer.domElement);
  return renderer;
}

export function handleResize(camera, renderer) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
