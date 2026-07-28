const JOYSTICK_RADIUS = 45;
const DEAD_ZONE = 8;

export function createTouchControls({ state, look, onEnter }) {
  const joystick = document.getElementById('joystick');
  const knob = document.getElementById('joystick-knob');
  const lookZone = document.getElementById('look-zone');

  let joystickTouchId = null;
  let joystickOrigin = { x: 0, y: 0 };
  let lookTouchId = null;
  let lastLook = { x: 0, y: 0 };

  function resetJoystick() {
    joystickTouchId = null;
    knob.style.transform = 'translate(0px, 0px)';
    state.forward = false;
    state.back = false;
    state.left = false;
    state.right = false;
  }

  joystick.addEventListener('touchstart', (e) => {
    const touch = e.changedTouches[0];
    joystickTouchId = touch.identifier;
    const rect = joystick.getBoundingClientRect();
    joystickOrigin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    onEnter();
  }, { passive: true });

  joystick.addEventListener('touchmove', (e) => {
    const touch = Array.from(e.changedTouches).find((t) => t.identifier === joystickTouchId);
    if (!touch) return;

    const dx = touch.clientX - joystickOrigin.x;
    const dy = touch.clientY - joystickOrigin.y;
    const dist = Math.min(Math.hypot(dx, dy), JOYSTICK_RADIUS);
    const angle = Math.atan2(dy, dx);
    const kx = Math.cos(angle) * dist;
    const ky = Math.sin(angle) * dist;
    knob.style.transform = `translate(${kx}px, ${ky}px)`;

    state.forward = ky < -DEAD_ZONE;
    state.back = ky > DEAD_ZONE;
    state.left = kx < -DEAD_ZONE;
    state.right = kx > DEAD_ZONE;
  }, { passive: true });

  joystick.addEventListener('touchend', (e) => {
    if (Array.from(e.changedTouches).some((t) => t.identifier === joystickTouchId)) resetJoystick();
  });
  joystick.addEventListener('touchcancel', resetJoystick);

  lookZone.addEventListener('touchstart', (e) => {
    const touch = e.changedTouches[0];
    lookTouchId = touch.identifier;
    lastLook = { x: touch.clientX, y: touch.clientY };
    onEnter();
  }, { passive: true });

  lookZone.addEventListener('touchmove', (e) => {
    const touch = Array.from(e.changedTouches).find((t) => t.identifier === lookTouchId);
    if (!touch) return;
    const dx = touch.clientX - lastLook.x;
    const dy = touch.clientY - lastLook.y;
    lastLook = { x: touch.clientX, y: touch.clientY };
    look(dx, dy);
  }, { passive: true });

  function resetLook(e) {
    if (Array.from(e.changedTouches).some((t) => t.identifier === lookTouchId)) lookTouchId = null;
  }
  lookZone.addEventListener('touchend', resetLook);
  lookZone.addEventListener('touchcancel', resetLook);

  return {
    reset() {
      resetJoystick();
      lookTouchId = null;
    },
  };
}
