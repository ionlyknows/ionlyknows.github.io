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

  function update(delta) {
    if (!controls.isLocked) return;
    const step = MOVE_SPEED * delta;
    if (state.forward) controls.moveForward(step);
    if (state.back) controls.moveForward(-step);
    if (state.right) controls.moveRight(step);
    if (state.left) controls.moveRight(-step);
  }

  return { controls, update };
}
