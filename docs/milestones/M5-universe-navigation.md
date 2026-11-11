# M5 — Universe & Navigation

**Goal:** a map to get anywhere, every trip made by ship, and a much richer sky.
**Branch:** `m5-universe`, created from `m4-polish`
**Model / effort:** Opus, **medium**
**References:** `docs/roadmap-v2.md`, M3 flight, BR-04, BR-05, NFR-04, NFR-06 · Skills: `apeiron-3d-world`, `apeiron-ui`
**Not in M5:** station interior, planet stories, Trophy Moon removal (M6), Observatory exploration stations (M7), Earth/Sun/free flight (M8).

## 1. Map (M key) — 2D overlay
- **M** (or a "Map" button replacing the HUD Locations list) opens a full-screen 2D overlay: a stylised top-down drawing of the system with the Sun, every visitable location, its name and a one-line description (from `content/locations.js`), and a "You are here" marker.
- Only locations that exist are shown. Places added later (Earth flight, Sun) appear automatically when their config exists; nothing says "coming soon".
- Click a location (or Tab/Enter) → a small confirm: **"Autopilot"** or **"Fly it yourself"** → travel starts. Clicking the current location does nothing.
- Esc or M closes it. The game is paused while it's open (like panels). Hidden on the phone view.
- Analytics: `map_open`, `location_visit` as before.

## 2. All travel by ship
- Remove the flying-astronaut cinematic travel completely. Every trip uses the ship:
  - **Fly it yourself:** the M3 flight.
  - **Autopilot:** board → take-off → the ship flies the same route by itself (cinematic camera angles, ≈ 8 s, input locked except Skip) → landing.
- The launch-pad picker gets the same two buttons.
- Map trips start with a short walk-free cut: the astronaut appears in the ship at the current pad, then take-off.
- "Skip flight" / Esc during any trip: fast-forward the autopilot (2 s fade) to the landing.
- `prefers-reduced-motion`: autopilot with fades instead of long camera moves, ≤ 3 s total.
- Keep every M3 rule: single writer, floating origin, fixed step, no shaking.

## 3. Sky: galaxies, Milky Way, constellations
- **Milky Way:** a soft procedural band across the sky (fbm noise in the background shader, low intensity, dust lanes darker).
- **Galaxies:** 6–10 distant galaxies (spiral and elliptical) drawn procedurally in a shader on camera-facing quads, small and subtle, some tilted. No photos.
- **Real constellations:** ~10 well-known ones with real star positions (right ascension / declination from public-domain star data, converted to directions on the sky sphere) and correct relative brightness: **Crux (Southern Cross)**, Orion, Ursa Major (Big Dipper), Cassiopeia, Scorpius, Leo, Cygnus, Taurus, Gemini, Centaurus. Brighter, slightly larger stars than the background field. Faint thin connecting lines.
- Settings: a "Constellation lines" toggle (default on) and their names shown only on the map's sky legend or on hover (no clutter in the world).
- Must not tint the sky or cross the bloom threshold except the brightest few stars.

## 4. Meteors and drifting rocks (scenery, no collision)
- **Meteors:** every 8–20 s a short bright streak crosses part of the sky (fades in/out, ≤ 1 s); rarely (every ~2 min) a small shower of 5–8.
- **Drifting rocks:** small groups of asteroids slowly drift past each planet at a safe distance and recycle when far away (`InstancedMesh`, PBR rock material, slow tumble). Never inside the walkable area or flight corridor centre; never collide.
- Off on Low quality (meteors stay, rocks off).

## 5. Polish requested by Jefferson
**Astronaut (the Quaternius model from M4):**
- Helmet: **white shell with a gold visor only** (not the whole helmet gold). The model's helmet is one mesh, so add a separate curved visor mesh on the front of the helmet (or split it by vertex selection), with the reflective dark-gold material; the shell becomes the off-white suit material.
- Polish: subtle fabric detail (CC0 fabric normal map, low strength), soft seams/panel contrast, a small glowing chest light, backpack details, and a faint rim light so the astronaut reads well against dark space. Keep ≤ 2.5 MB and the fallback.

**Spaceship (the code-built M3 ship):** make it look like a real spaceship.
- First choice: a **CC0 spaceship model** (Quaternius or Kenney space kits, license checked on the asset's page), recoloured in PBR to the Apeiron palette (off-white hull, orange accents, dark glass cockpit), ≤ 1.5 MB, ≤ 20k triangles.
- If none fits: rebuild in code with a clear spaceship silhouette: pointed nose, cockpit canopy, swept wings or side pods, tail fins, 2 engine nozzles with glow and flame, panel lines (normal detail), nav lights.
- Same scale, pad position, boarding point and flight behaviour as now; update the parked ships too.

**Job title:** change `role` in `sources/content/profile.js` to **"Full-Stack Developer"**, then re-render the share image (`og-image.webp`) so it matches, and check the page description.

**three.js version:** make sure `package.json` pins `"three"` to the exact installed version (no `^` or `~`), because the PMREM loading fix uses internal r184 functions (F35).

## 6. Housekeeping
- Update CREDITS.md if any data source needs credit (star data source and license).
- Update `docs/audit.md` and set "Current milestone" in CLAUDE.md to M5.

## Acceptance criteria
- [x] M opens the 2D map; every location is shown with "You are here"; clicking one offers Autopilot / Fly it yourself and travels there; Esc/M closes; keyboard works
- [x] No flying-astronaut travel remains anywhere; every trip is by ship; Skip works; reduced motion is short
- [x] Milky Way, galaxies and the 10 constellations (Southern Cross included) are visible but subtle; the lines toggle works
- [x] Meteors and drifting rocks appear, never collide, and never enter the walking area or corridor centre
- [ ] No shaking during any trip; ≥ 50 fps on Medium; first load still ≤ 5 s (needs Jefferson's eyes and machine; +0.06 MB initial download)
- [x] The astronaut has a white helmet with a gold visor and looks polished; the ship clearly looks like a spaceship; parked ships match; flight unchanged
- [x] Role reads "Full-Stack Developer" on the site, page description and share image; three.js is pinned
- [x] Quick-view, phone view and "Skip the adventure" unchanged
- [x] `npm run build` passes; `npx vite preview` works
- [ ] Jefferson has tested on localhost and committed it himself
