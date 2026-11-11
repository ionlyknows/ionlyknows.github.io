# M3 — Flight

**Goal:** travelling between planets becomes a short, playable flight. The visitor boards a ship at a launch pad, it takes off, they steer it along a set route with a little freedom, and it lands automatically at the destination. Never blocks a recruiter: the flight can always be skipped.
**Branch:** `m3-flight`, created from `m2b-launch`
**Model / effort:** **Fable, high** (flight feel and camera are the hardest part of the project)
**Spec references:** FR-06, FR-18, BR-04, BR-05, spec §5 state machine (`FLYING`) · Skills: `apeiron-3d-world`, `apeiron-ui`
**Style:** cinematic space (M2a-revision). Keep every M2a/M2b rule: single writer, floating origin, fixed-step physics, quality levels, the performance budget.

## Decisions for this milestone
- **Where flight is used:** launch pad → destination picker → **flight**. The HUD Locations list, `prefers-reduced-motion`, and the "Skip flight" button still use the M2a **cinematic travel**.
- **Set route with a little freedom:** the ship follows a curved route (`CatmullRomCurve3`) between the two planets. The player can drift inside a **corridor** around the route (radius 25 units). Near the corridor edge a soft force eases the ship back; it can never leave the corridor or get lost.
- **No crashes and no fail state.** Asteroids along the route are scenery only (outside the corridor centre, no collision). This is a portfolio, not a game to lose.
- **Length:** about 15–20 s at normal speed.
- **Ship:** built in code with PBR materials in the Apeiron palette (off-white hull, orange accents, glowing engine). No downloaded model.
- **Sound:** no engine hum (Jefferson disliked the buzzing). A very soft airy wind loop at most (CC0), or nothing; the existing whoosh on take-off and boost.

## Flow and states
```
ON_FOOT ──(E at launch pad → pick destination)──► BOARDING (1 s: astronaut fades into ship)
BOARDING ──► TAKEOFF (2 s, automatic lift-off from the pad)
TAKEOFF ──► FLYING (player steers)
FLYING ──(near destination, ~60 units)──► LANDING (3 s, automatic, controls off)
LANDING ──► ON_FOOT (astronaut appears at the landing point facing the main beacon)
Any of BOARDING/TAKEOFF/FLYING ──(Skip flight button or Esc)──► cinematic travel to the destination
```
Input on foot is locked during all flight states (BR-04). Only the flight system writes the ship and player position during flight; only the camera system writes the camera.

## Controls (shown as in-world hints at take-off, same style as M2a hints)
- **Mouse / A–D:** steer left/right; **W/S or mouse up/down:** steer up/down (all within the corridor)
- **Shift:** boost (1.6× speed, warp streaks, FOV wider) · **Ctrl:** slow down (0.7×)
- **Esc or the "Skip flight" button:** skip to the cinematic travel

## Tasks
1. **Ship:** `View/Ship.js` (code-built PBR ship, engine glow, small lights) and a parked ship on every launch pad.
2. **Flight logic:** `State/Flight.js`: route curve per planet pair (gentle arc, passing near Earth or another planet for a nice view), progress along the curve, corridor offset with soft edge, speed/boost/slow, fixed-step like the player.
3. **States:** add `BOARDING`, `TAKEOFF`, `FLYING`, `LANDING` to the state machine.
4. **Camera:** chase camera behind and slightly above the ship, banking a little with turns, FOV 60 → 72 when boosting; smooth (damped target, frame-rate independent). Short cinematic angles for take-off and landing.
5. **Floating origin in flight:** rebase the world whenever the ship is more than 500 units from the origin, so nothing wobbles.
6. **Scenery:** an asteroid field along each route (`InstancedMesh`, PBR rock material, slow rotation), outside the corridor centre, no collision. Warp streaks while boosting.
7. **HUD (flight):** destination name, distance, a small arrow pointing to the destination when it's off-screen, speed bar, "Skip flight" button. The normal HUD (Work/About/Settings/Skip the adventure) stays.
8. **Landing:** the ship descends to the destination pad, the astronaut appears at the landing point, M2a establishing shot, then `ON_FOOT`.
9. **Sound:** whoosh on take-off and on boost start; music ducks −3 dB during flight; optional very soft CC0 wind loop (no hum). Credit any new file.
10. Update `docs/audit.md` (change-log row) and set "Current milestone" in CLAUDE.md to M3.

## Acceptance criteria
- [x] Every launch pad → picker → boarding → take-off → steerable flight → automatic landing, for all 12 planet-to-planet routes (all 12 flown by a temporary Node check with the real flight code; picker → flight checked in the browser)
- [ ] The ship can't leave the corridor; easing back at the edge feels soft, not like hitting a wall (can't leave: verified, max 91% of the corridor, never clamped; the feel is Jefferson's call)
- [ ] Boost and slow work; boosting shows warp streaks and a wider FOV (speeds verified; the look is Jefferson's call)
- [ ] No shaking of the ship or camera during flight, take-off or landing (single writer, floating origin) (ship path: no jitter or flips in the Node check; the camera needs eyes)
- [x] "Skip flight" and Esc always work and fall back to the cinematic travel
- [x] The HUD Locations list and reduced motion still use the cinematic travel
- [x] No engine hum or buzzing sound (no engine sound at all; the existing whoosh on take-off and boost)
- [x] ≥ 50 fps on Medium during flight (72 fps flying, 71.5 fps boosting; AMD Radeon integrated, 1600×900)
- [x] `npm run build` passes; `npx vite preview` works
- [ ] Jefferson has tested on localhost and committed it himself
