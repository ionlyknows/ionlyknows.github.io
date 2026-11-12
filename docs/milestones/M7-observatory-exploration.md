# M7 — Observatory Exploration

**Goal:** four fun, interactive exploration stations on The Observatory's reserved spots, plus a few ambient scientists. No portfolio content here except the goals console from M6.
**Branch:** `m7-observatory`, created from `main` (M6/M6b are merged)
**Model / effort:** Opus **medium**; raise to **high** only if the rover shakes or clips after one fix attempt
**Build order (one milestone, staged):** Telescope → Rover → Science lab → Radio dish → Scientists. Each stage finished and smoke-tested before the next. If quota runs low, stop at the end of a finished stage and write `docs/handoff.md` (done / in progress / files / left / how to test) so another agent can continue.
**References:** `docs/roadmap-v2.md`, M5 sky (constellations, galaxies), BR-04 · Skills: `apeiron-3d-world`, `apeiron-ui`
**Rules:** single writer, fixed step, floating origin, no shaking, quality levels, performance budget, CC0 / public-domain assets only. Every station is optional fun: Esc always exits, nothing blocks the visitor.

## 1. Telescope — "Looking ahead"
- A large observatory telescope on its spot. E → **telescope view**: the camera looks through the eyepiece (round vignette, slight lens edge), and the mouse pans the sky (scroll = zoom 1×–6×).
- The real constellations from M5 are highlighted with their names and lines when centred; galaxies and the Milky Way are visible in more detail.
- Small caption at the bottom: "Looking ahead", plus `goals.goal` if it isn't empty (BR-07).
- Esc or E exits back to on-foot.

## 2. Rover
- A small moon rover parked on its spot: CC0 model (Quaternius/Kenney space kits, licence checked) recoloured to the Apeiron palette, or code-built (body, 6 wheels, antenna, light bar) if none fits. ≤ 0.5 MB.
- E → **drive mode**: W/S accelerate/brake-reverse, A/D steer, Shift boost, Space handbrake. Drives on the spherical planet using the planet physics (up = from centre, re-projected to the surface, fixed step). Wheels spin, the body bobs and leans a little in turns (visual only).
- Collides with props using the existing mesh colliders (slide, never shake); can't leave the planet; top speed ~2× running speed.
- Chase camera behind the rover (same damped camera rules, no clipping).
- E near the parking spot or anywhere when stopped → exit; the astronaut appears next to the rover. If the visitor leaves the planet or the Observatory while driving, the rover returns to its spot.
- New states: `DRIVING` (input rules as BR-04).

## 3. Science lab
- A small lab hut with a scanner and 5–6 sample stands (rocks and crystals from the existing materials).
- E at a sample → a short scan animation (light sweep + sound) → a **fact card** with a short space fact.
- Facts live in `content/facts.js`: 6–8 short, accurate, general space facts (e.g. about the Moon, Mars, the Sun, the Milky Way), each with a source URL in a comment (NASA or another official source) so Jefferson can verify them. No facts about Jefferson. Jefferson may edit or replace them.

## 4. Radio dish
- A radio dish with a small console. E → **tuner UI**: a dial (← → or drag) across 4–5 frequencies with static between them.
- Each frequency plays a short **public-domain NASA space sound** (e.g. a Sputnik beep, Voyager/Cassini/Juno radio recordings converted to audio), ≤ 300 KB each, loaded only when the tuner opens, with a one-line label of what it is. Credit each in `content/credits.js`. No buzzing/harsh noise (Jefferson dislikes it): static is soft and quiet, everything goes through the master limiter.
- Esc or E exits.

## 5. Scientists (ambient NPCs)
- 2–3 recoloured astronaut clones (like the M6 crew) walking between the stations, pausing at them, waving, stepping aside. Only animate on The Observatory.

## 6. Housekeeping
- Each station gets a beacon-style prompt ("E — Look through the telescope", "E — Drive the rover", "E — Scan sample", "E — Tune the radio").
- Analytics: `explore_use` with the station id.
- Map description for The Observatory unchanged unless the stations need a mention.
- Credits updated, `docs/audit.md` change-log row per stage, CLAUDE.md current milestone = M7.
- No temp scripts left behind; headless smoke test (Launch → each station → exit) with 0 console errors.

## Acceptance criteria
- [x] Telescope view pans/zooms smoothly, highlights the constellations by name, shows the goal caption only if it exists, exits with Esc/E
- [x] Rover drives all around the planet with no shaking, slides along props, never leaves the planet, exits cleanly, returns to its spot when abandoned
- [x] Science lab: every sample scans and shows a fact; facts have source comments
- [x] Radio: every frequency plays its NASA sound with a label; static is soft; no buzzing; sounds load only when the tuner opens
- [x] Scientists move, wave, step aside, never block a station
- [ ] ≥ 50 fps on Medium (including while driving); first load still ≤ 5 s — first load ≤ 5 s measured (3.8–4.9 s cold, Fast 4G); fps ≥ 50 measured only in this machine's fast phase (62–79 at Medium, driving 72–79), its slow phase gives 24–42 for M6b `main` too: Jefferson confirms on localhost
- [x] `npm run build` passes; `npx vite preview` works
- [ ] Jefferson has tested on localhost and committed it himself
