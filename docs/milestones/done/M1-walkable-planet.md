# M1 — Walkable Planet

**Goal:** one small round planet the player can walk all the way around, with a placeholder astronaut, a working follow camera, and one content point that opens the Work panel.
**Branch:** `m1-planet`, created from `m0-cleanup`
**Model / effort:** Opus, **high** (the 3D math and camera are the hard part)
**Spec references:** FR-03, FR-04, FR-05, BR-03, BR-04, BR-06, spec §7–§8 · Skill: `apeiron-3d-world`

## Decisions for this milestone
- **Placeholder astronaut = built in code**, not a downloaded model: low-poly body (capsule), round helmet, visor, small backpack, in the Apeiron palette. Simple **procedural** animation: idle bob, lean and leg-swing while running, squash/stretch on jump. No rig, no Mixamo, no license questions. The final rigged mascot comes in M4.
- **No subagents** in this milestone. It's one connected piece of code, so the lead does it alone.
- Remove `@pixiv/three-vrm` and the leftover VRM/Mixamo helpers (audit F17).

## Tasks
1. **Config:** `sources/Game/config/planets.js` with ONE planet: `{ id: 'forge', name: 'The Forge', center: [0,0,0], radius: 20, color, landingPoint (lat/long), contentPoints: [{ id: 'work', position (lat/long), opens: 'work' }], props: [...] }`.
2. **State:** `State/Planets.js` (reads config), rewrite `State/Player.js` for spherical gravity as in the `apeiron-3d-world` skill: up = from the center, movement in the tangent plane, re-projected onto the radius every frame, jump height with gravity, no allocations in the frame loop.
3. **Minimal state machine:** `Game/StateMachine.js` with only `ON_FOOT` and `PANEL_OPEN` for now. Input is ignored in `PANEL_OPEN` (BR-04).
4. **View:** `View/Planet.js`: a low-poly sphere (`IcosahedronGeometry`, flat shading, toon material) plus 5–8 simple props (rocks or crystals made in code, using `InstancedMesh` where repeated) with sphere colliders. One visible content-point marker (a glowing pillar or beacon).
5. **Astronaut:** `View/PlayerModel.js`: the code-built astronaut and its procedural animations, aligned to the player's `up` and facing the movement direction.
6. **Camera:** adapt the third-person camera so its up vector slerps toward the player's up (no flips at the poles); mouse drag orbits; pitch clamped 10°–70°; scroll zooms.
7. **Interaction:** within 3 units of the content point, emit a prompt through UIBridge ("E — View projects"); pressing E (or clicking the marker) emits `panel:open {type:'work'}` and sets `PANEL_OPEN`; closing the panel (Esc) returns to `ON_FOOT`.
8. **Lighting/look:** one directional "sun" + hemisphere light; shadows only on this planet (map ≤ 1024); keep the M0 starfield.
9. **Cleanup:** remove `@pixiv/three-vrm` from package.json, delete leftover VRM/Mixamo helper files and references, update `docs/audit.md` (F17 resolved + change-log row), and set "Current milestone" in CLAUDE.md to M1.

## Acceptance criteria
- [ ] The astronaut walks all the way around the planet, including the "bottom", with no jitter, sliding, or camera flips
- [ ] WASD/arrows move, Shift runs, Space jumps and lands back on the surface; can't leave the planet
- [ ] Idle, run and jump animations visibly play
- [ ] Props block the player (no walking through them)
- [ ] The prompt appears within 3 units of the content point; E opens the Work panel; movement is locked while it's open; Esc closes it and movement resumes
- [ ] ≥ 50 fps on Jefferson's laptop (check with `#debug` stats)
- [x] No references to VRM, Mixamo or `@pixiv/three-vrm` remain (in code/deps; planning docs keep the history)
- [x] `npm run build` passes; `npx vite preview` works
- [ ] Jefferson has tested on localhost and committed it himself
