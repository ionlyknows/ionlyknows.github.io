import { Euler, Vector3 } from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { DEBUG } from './config.js';
import { isTouchDevice } from './deviceDetect.js';
import { createTouchControls } from './touchControls.js';

const MOVE_SPEED = 6.0;
const SPRINT_MULTIPLIER = 1.8;
const ACCEL = 30.0;
const DECEL = 40.0;
const LOOK_SENSITIVITY = 0.0025;
const PITCH_LIMIT = Math.PI / 2 - 0.05;
const _lookEuler = new Euler(0, 0, 0, 'YXZ');
const _forwardDir = new Vector3();
const _rightDir = new Vector3();

function moveTowards(current, target, maxDelta) {
  if (Math.abs(target - current) <= maxDelta) return target;
  return current + Math.sign(target - current) * maxDelta;
}

export function createControls(camera, domElement, overlayEl) {
  const controls = new PointerLockControls(camera, domElement);
  const state = { forward: false, back: false, left: false, right: false, sprint: false };
  const velocity = { forward: 0, right: 0 };
  const touch = isTouchDevice();
  let entered = false;

  function resetMovementKeys() {
    state.forward = false;
    state.back = false;
    state.left = false;
    state.right = false;
    state.sprint = false;
  }

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
      case 'ShiftLeft': case 'ShiftRight': state.sprint = value; break;
    }
  }

  // Prevents movement keys from getting stuck "on" if the tab loses focus
  // mid-press (alt-tab, notification, etc.) — keyup never fires in that case.
  window.addEventListener('blur', resetMovementKeys);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) resetMovementKeys();
  });

  if (touch) {
    document.body.classList.add('touch');
    overlayEl.addEventListener('click', () => enter());
    const touchApi = createTouchControls({ state, look, onEnter: enter });
    const exitBtn = document.getElementById('exit-btn');
    exitBtn?.addEventListener('click', () => {
      entered = false;
      overlayEl.classList.remove('hidden');
      touchApi.reset();
    });
  } else {
    overlayEl.addEventListener('click', () => controls.lock());
    controls.addEventListener('lock', enter);
    controls.addEventListener('unlock', () => {
      entered = false;
      overlayEl.classList.remove('hidden');
      resetMovementKeys();
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
    const obj = controls.getObject();
    const colliders = bounds?.colliders || [];
    if (DEBUG && !window.__loggedColliders) { console.log('[DEBUG] collider count:', colliders.length); window.__loggedColliders = true; }

    // Normalize diagonal input so forward+strafe isn't faster than either alone.
    let inputForward = (state.forward ? 1 : 0) - (state.back ? 1 : 0);
    let inputRight = (state.right ? 1 : 0) - (state.left ? 1 : 0);
    const inputLen = Math.hypot(inputForward, inputRight);
    if (inputLen > 1) {
      inputForward /= inputLen;
      inputRight /= inputLen;
    }

    const targetSpeed = MOVE_SPEED * (state.sprint ? SPRINT_MULTIPLIER : 1);
    const rate = inputLen > 0 ? ACCEL : DECEL;
    velocity.forward = moveTowards(velocity.forward, inputForward * targetSpeed, rate * delta);
    velocity.right = moveTowards(velocity.right, inputRight * targetSpeed, rate * delta);

    // Convert local forward/right velocity into a world-space XZ step, then
    // resolve collision on X and Z independently. Colliders are axis-aligned
    // in world space, so this is what makes wall-sliding actually work —
    // regardless of camera angle or how many direction keys are held.
    _forwardDir.setFromMatrixColumn(camera.matrix, 0);
    _forwardDir.crossVectors(camera.up, _forwardDir);
    _rightDir.setFromMatrixColumn(camera.matrix, 0);

    const stepX = _forwardDir.x * velocity.forward * delta + _rightDir.x * velocity.right * delta;
    const stepZ = _forwardDir.z * velocity.forward * delta + _rightDir.z * velocity.right * delta;

    if (stepX !== 0) {
      obj.position.x += stepX;
      if (checkCollision(obj.position.x, obj.position.z, colliders)) {
        obj.position.x -= stepX;
      }
    }

    if (stepZ !== 0) {
      obj.position.z += stepZ;
      if (checkCollision(obj.position.x, obj.position.z, colliders)) {
        obj.position.z -= stepZ;
      }
    }

    if (bounds) {
      obj.position.x = Math.min(bounds.maxX, Math.max(bounds.minX, obj.position.x));
      obj.position.z = Math.min(bounds.maxZ, Math.max(bounds.minZ, obj.position.z));
    }
  }

  return { controls, update };
}
