const animators = [];

export function registerAnimator(fn) {
  animators.push(fn);
  return () => {
    const index = animators.indexOf(fn);
    if (index !== -1) animators.splice(index, 1);
  };
}

export function updateAnimators(elapsed, delta) {
  for (const fn of animators) fn(elapsed, delta);
}
