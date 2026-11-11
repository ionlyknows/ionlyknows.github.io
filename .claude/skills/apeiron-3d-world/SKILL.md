---
name: apeiron-3d-world
description: Apeiron's Three.js patterns for small spherical planets, astronaut movement, the follow camera, cinematic PBR materials, travel cinematics, and 3D performance. Use for any work in sources/Game/ (planets, player, camera, travel, materials, shaders).
---

# Apeiron 3D world (Three.js r0.184, WebGL 2, plain JS, no React)

Project rules in CLAUDE.md win over anything here. No physics engine, no WebGPU, no new libraries.

## Small-planet movement (spec §8, BR-03 to BR-06)
Each frame, for the player on planet `p` (center `c`, radius `r`):
```js
const up = _v1.copy(player.position).sub(c).normalize();          // gravity points to the center
// Movement input → tangent plane: project the camera forward onto the plane ⟂ up
const fwd = _v2.copy(cameraForward).projectOnPlane(up).normalize();
const right = _v3.crossVectors(fwd, up).normalize();
velocity.copy(fwd).multiplyScalar(inputZ).addScaledVector(right, inputX).multiplyScalar(speed);
player.position.addScaledVector(velocity, dt);
// Jump: keep a scalar height h above the surface; h += vy*dt; vy -= g*dt; clamp at 0
const h = Math.max(0, height);
player.position.sub(c).setLength(r + h).add(c);                    // re-project onto the sphere
// Orientation: align the model's up to `up`, face the movement direction
player.quaternion.setFromUnitVectors(_yAxis, up);                  // then rotate around `up` toward velocity (slerp)
```
- Reuse module-level temp vectors (`_v1`, `_v2`…); never allocate inside the frame loop.
- Props: sphere colliders `{center, radius}`. **Slide, don't bounce:** remove the velocity component pointing into the collider before moving, resolve overlap once after moving (skin 0.02), then re-project onto the radius. Collision never changes facing. Smooth the visual model and camera target so corrections don't show.
- Content point "in range" = straight-line distance ≤ 3 units; only the nearest one shows a prompt.

## Follow camera
- The camera sits behind and above the player in the player's local frame. Its `camera.up` = slerp toward the player's `up` (factor ~0.1/frame) to avoid flips at the poles.
- Mouse drag orbits around the player's `up` axis; clamp pitch to 10°–70°.
- Use `camera.lookAt(player.position + up * 1.2)`.

## Travel (BR-05, M3 + M5): every trip is by ship
- `State/Flight.js` runs `State/FlightPhysics.js` in fixed 1/120 s steps: boarding → take-off → flying → landing → establishing shot. "Fly it yourself" steers inside the corridor; "Autopilot" flies the same route with no steering (≈ 8 s take-off → touchdown) and cinematic camera angles (`State/CameraChase.js`).
- Map trips start already inside the ship (fade from black). "Skip flight" / Esc fades to black and jumps to the touchdown; `prefers-reduced-motion` = that fade only (≤ 3 s).
- Input locked except Skip; on arrival Player.update shifts the floating origin, `location:change` goes through UIBridge and the state returns to `ON_FOOT`. No flying-astronaut travel anywhere.

## Look: cinematic, polished space (changed 2026-11-10; replaces "cute low-poly toon")
- PBR: `MeshStandardMaterial` everywhere, CC0 textures (ambientCG / Poly Haven) with triplanar mapping, NASA Blue Marble for Earth.
- ACES tone mapping, exposure ~0.75. One directional sun with a real dark side; very weak cool fill. Content points sit on the day side.
- Near-black space, subtle stars, one soft procedural nebula. Bloom threshold ~0.85, strength ~0.5: only beacons, sun and emissive details glow.
- Soft scattering atmosphere rim per planet; PMREM environment map for metals and the astronaut visor.
- Post-processing breaks default MSAA: use a `WebGLRenderTarget` with `samples: 4` (or SMAA).
- Quality levels: see docs/milestones/M2a-revision.md §5.

## Performance (spec §10)
- Budget: ≤ 150 draw calls, ≤ 300k triangles, initial 3D assets ≤ 8 MB.
- Repeated props → `InstancedMesh`. Static props per planet → merge geometries.
- Only the current planet runs updates; other planets are just visible meshes.
- `renderer.setPixelRatio(Math.min(devicePixelRatio, quality === 'high' ? 2 : 1.5))`.
- Load GLBs with `GLTFLoader` + `MeshoptDecoder` (`three/examples/jsm/libs/meshopt_decoder.module.js`).
- On removing anything: `geometry.dispose()`, `material.dispose()`, `texture.dispose()`.
- Check `renderer.info.render.calls` and `.triangles` in `#debug` mode.

## Structure
- Logic (positions, state, input) in `State/`; meshes, materials, and camera in `View/`.
- Planet layout lives in `sources/Game/config/planets.js` (center, radius, color, landing point, launch pad, content points as lat/long).
- Game → UI only via UIBridge events: `panel:open {type,id}`, `state:change`, `location:change`.
