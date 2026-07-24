import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
const MOVE_SPEED = 6.0;
export function createControls(camera, domElement, overlayEl) {
  const controls = new PointerLockControls(camera, domElement);
  const state = { forward: false, back: false, left: false, right: false };
  overlayEl.addEventListener('click', () => controls.lock());
  controls.addEventListener('lock', () => overlayEl.classList.add('hidden'));
  controls.addEventListener('unlock', () => overlayEl.classList.remove('hidden'));
  document.addEventListener('keydown', (e) => setKey(e.code, true));
  document.addEventListener('keyup', (e) => setKey(e.code, false));
  function setKey(code, value) {
    switch (code) {
      case 'KeyW': case 'ArrowUp': state.forward = value; break;
      case 'KeyS': case 'ArrowDown': state.back = value; break;
      case 'KeyA': case 'ArrowLeft': state.left = value; break;
      case 'KeyD': case 'ArrowRight': state.right = value; break;
    }
  }
  function checkCollision(x, z, colliders) {
    for (const c of colliders) {
      if (Math.abs(x - c.x) < c.halfW && Math.abs(z - c.z) < c.halfD) {
        console.log('[COLLISION] blocked at', x.toFixed(1), z.toFixed(1), 'by building at', c.x.toFixed(1), c.z.toFixed(1));
        return true;
      }
    }
    return false;
  }
  function update(delta, bounds) {
    if (!controls.isLocked) return;
    const step = MOVE_SPEED * delta;
    const obj = controls.getObject();
    const colliders = bounds?.colliders || [];
    if (!window.__loggedColliders) { console.log('[DEBUG] collider count:', colliders.length); window.__loggedColliders = true; }
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


