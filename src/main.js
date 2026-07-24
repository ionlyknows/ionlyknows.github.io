import * as THREE from 'three';
import { createScene, createCamera, createRenderer, handleResize } from './scene.js';
import { createGround } from './ground.js';
import { createControls } from './controls.js';
import { createCity, zoneAt } from './city.js';

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
handleResize(camera, renderer);

const ground = createGround();
scene.add(ground);

scene.add(new THREE.AmbientLight(0x223344, 0.6));

const bounds = createCity(scene);

const overlay = document.getElementById('overlay');
const { controls, update } = createControls(camera, renderer.domElement, overlay);
scene.add(controls.getObject());

const hud = document.getElementById('hud');
const clock = new THREE.Clock();
let hudTimer = 0;

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  update(delta, bounds);

  hudTimer += delta;
  if (hudTimer > 0.2) {
    hudTimer = 0;
    const pos = controls.getObject().position;
    hud.textContent = `SECTOR ? ${zoneAt(pos.x).toUpperCase()}`;
  }

  renderer.render(scene, camera);
}

animate();