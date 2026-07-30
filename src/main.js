import * as THREE from 'three';
import { createScene, createCamera, createRenderer, handleResize, COLORS } from './scene.js';
import { createGround } from './ground.js';
import { createControls } from './controls.js';
import { createCity, zoneAt, atmosphereColor } from './city.js';
import { createRoads } from './roads.js';
import { createGates } from './gates.js';
import { createStreetLights } from './lighting/streetLights.js';
import { createStreetProps } from './props/streetProps.js';
import { createCables } from './props/cables.js';
import { createParticles } from './effects/particles.js';
import { createSteamVents } from './effects/steamVents.js';
import { createGroundMist } from './effects/groundMist.js';
import { createLampVolumetrics } from './effects/lampVolumetrics.js';
import { updateAnimators } from './effects/animator.js';
import { DEBUG } from './config.js';

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
handleResize(camera, renderer);

const ground = createGround();
scene.add(ground);

scene.add(new THREE.HemisphereLight(0x2a3a55, COLORS.void, 0.55));

const bounds = createCity(scene);
const { updateReflections } = createRoads(scene);
createGates(scene);
const lampCount = createStreetLights(scene);
const propColliders = createStreetProps(scene, bounds.colliders);
bounds.colliders.push(...propColliders);
const cableCount = createCables(scene);
createParticles(scene);
const steamCount = createSteamVents(scene);
const groundMist = createGroundMist(scene, bounds);
const volumetricCount = createLampVolumetrics(scene);
if (DEBUG) {
  console.log('[DEBUG] street lamps placed:', lampCount);
  console.log('[DEBUG] street props placed:', propColliders.length);
  console.log('[DEBUG] cables placed:', cableCount);
  console.log('[DEBUG] steam vents placed:', steamCount);
  console.log('[DEBUG] lamp volumetric cones placed:', volumetricCount);
}

const overlay = document.getElementById('overlay');
const { controls, update } = createControls(camera, renderer.domElement, overlay);
scene.add(controls.getObject());

const hud = document.getElementById('hud');
const clock = new THREE.Clock();
let hudTimer = 0;
let elapsed = 0;

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  elapsed += delta;
  update(delta, bounds);

  const pos = controls.getObject().position;
  const zone = zoneAt(pos.x, pos.z);
  const targetColor = atmosphereColor(zone);
  const blend = Math.min(delta * 2, 1);
  scene.fog.color.lerp(targetColor, blend);
  scene.background.lerp(targetColor, blend);
  updateReflections(scene.fog.color, elapsed);
  groundMist.update(scene.fog.color, elapsed);
  updateAnimators(elapsed, delta);

  hudTimer += delta;
  if (hudTimer > 0.2) {
    hudTimer = 0;
    hud.textContent = 'SECTOR ' + zone.sector + ' - ' + zone.label.toUpperCase();
  }

  renderer.render(scene, camera);
}

animate();
