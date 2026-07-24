import * as THREE from 'three';
import { createScene, createCamera, createRenderer, handleResize } from './scene.js';
import { createGround } from './ground.js';
import { createControls } from './controls.js';

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
handleResize(camera, renderer);

const ground = createGround();
scene.add(ground);

scene.add(new THREE.AmbientLight(0x223344, 0.6));

const overlay = document.getElementById('overlay');
const { controls, update } = createControls(camera, renderer.domElement, overlay);
scene.add(controls.getObject());

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  update(delta);
  renderer.render(scene, camera);
}

animate();
