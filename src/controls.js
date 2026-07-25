import { Euler } from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { DEBUG } from './config.js';
import { isTouchDevice } from './deviceDetect.js';
import { createTouchControls } from './touchControls.js';

const MOVE_SPEED = 6.0;
const LOOK_SENSITIVITY = 0.0025;
const PITCH_LIMIT = Math.PI / 2 - 0.05;
const _lookEuler = new Euler(0, 0, 0, 'YXZ');

export function createControls(camera, domElement, overlayEl) {
  const controls = new PointerLockControls(camera, domElement);
  const state = { forward: false, back: false, left: false, right: false };
  const touch = isTouchDevice();
  let entered = false;

  function enter() {
    if (entered) return;
    entered = true;
    overlayEl.classList.add('hidden');
  }

  function look(deltaX, deltaY) {
    _lookEuler.setFromQuaternion(camera.quaternion);
    _lookEuler.y -= deltaX * LOOK_SENSITIVITY;
    _lookEuler.x -= deltaY * LOOK_SENSITIVITY;
    _lookEuler.x = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, _lookEuler.x));
    camera.quaternion.setFromEuler(_lookEuler);
  }

  function setKey(code, value) {
    switch (code) {
      case 'KeyW': case 'ArrowUp': state.forward = value; break;
      case 'KeyS': case 'ArrowDown': state.back = value; break;
      case 'KeyA': case 'ArrowLeft': state.left = value; break;
      case 'KeyD': case 'ArrowRight': state.right = value; break;
    }
  }

  if (touch) {
    document.body.classList.add('touch');
    overlayEl.addEventListener('click', () => enter());
    createTouchControls({ state, look, onEnter: enter });
  } else {
    overlayEl.addEventListener('click', () => controls.lock());
    controls.addEventListener('lock', enter);
    controls.addEventListener('unlock', () => {
      entered = false;
      overlayEl.classList.remove('hidden');
    });
    document.addEventListener('keydown', (e) => setKey(e.code, true));
    document.addEventListener('keyup', (e) => setKey(e.code, false));
  }

  function checkCollision(x, z, colliders) {
    for (const c of colliders) {
      if (Math.abs(x - c.x) < c.halfW && Math.abs(z - c.z) < c.halfD) {
        if (DEBUG) console.log('[COLLISION] blocked at', x.toFixed(1), z.toFixed(1), 'by building at', c.x.toFixed(1), c.z.toFixed(1));
        return true;
      }
    }
    return false;
  }

  function update(delta, bounds) {
    if (!entered) return;
    const step = MOVE_SPEED * delta;
    const obj = controls.getObject();
    const colliders = bounds?.colliders || [];
    if (DEBUG && !window.__loggedColliders) { console.log('[DEBUG] collider count:', colliders.length); window.__loggedColliders = true; }
    const startX = obj.position.x;
    const startZ = obj.position.z;

    if (state.forward) controls.moveForward(step);
    if (state.back) controls.moveForward(-step);
    if (checkCollision(obj.position.x, obj.position.z, colliders)) {
      obj.position.x = startX;
      obj.position.z = startZ;
    }

    const midX = obj.position.x;
    const midZ = obj.position.z;

    if (state.right) controls.moveRight(step);
    if (state.left) controls.moveRight(-step);
    if (checkCollision(obj.position.x, obj.position.z, colliders)) {
      obj.position.x = midX;
      obj.position.z = midZ;
    }

    if (bounds) {
      obj.position.x = Math.min(bounds.maxX, Math.max(bounds.minX, obj.position.x));
      obj.position.z = Math.min(bounds.maxZ, Math.max(bounds.minZ, obj.position.z));
    }
  }

  return { controls, update };
}


