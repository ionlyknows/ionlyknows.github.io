# M6b — Orbital Space Station

**Goal:** the museum becomes a real space station orbiting Earth, reached by ship. Visitors start docked in its hangar. The old Home Station planetoid stays as a small moon with About and Contact.
**Branch:** `m6b-orbital`, created from `m6-station`
**Model / effort:** Opus, **high**
**References:** `docs/roadmap-v2.md`, M3 flight, M5 travel/map, M6 interior · Skills: `apeiron-3d-world`, `apeiron-ui`
**Rules:** single writer, fixed step, floating origin, no shaking, cinematic style, quality levels, performance budget, empty fields hidden, never invent content.

## Decisions (CONFIRMED by Jefferson, 2026-11-11)
- The station **orbits Earth** like the ISS: Earth fills its windows, the Santa Josefa beacon below. For simplicity the station is fixed relative to Earth; Earth rotates slowly beneath it.
- Visitors **start inside the station hangar** after the intro.
- The old Home Station planetoid **stays as a small walkable moon** with the About and Contact beacons, its launch pad and the "Signal from home" easter-egg dish. Its airlock/dock module and museum entrance are removed.
- Names (Jefferson may change them in `content/locations.js`): station = **"Apeiron Station"**, moon = **"Signal Moon"** (it holds the contact signal tower and the radio-dish easter egg).

## 1. Station exterior
- Code-built PBR station (reuse the metal texture set): a central hub module, a ring or cross of habitat modules, truss with large solar arrays, radiators, antennas, docking lights, windows glowing softly, and a **hangar bay** with a big door and guide lights. Merge static parts to keep draw calls low.
- Placed in low orbit above Earth so Earth fills a large part of the view; slow solar-array rotation and blinking nav lights only (no physics).
- Appears on the map as a location with "You are here" when inside.

## 2. Hangar + docking
- New interior room **Hangar** connected to the M6 rotunda (the M6 interior moves into the station; same rooms, hologram and crew). The ship parks in the hangar.
- **Leaving:** a hangar console (E) opens the destination picker (Autopilot / Fly it yourself); the astronaut boards, the bay door opens, the ship flies out.
- **Arriving:** any trip to the station ends with an **automatic docking sequence** (≈ 5 s, cinematic: approach, alignment, guide lights, bay door, landing in the hangar), then the astronaut steps out on foot inside. "Fly it yourself" hands over to autopilot docking near the station.
- Inside, the station uses the M6 planar walking mode everywhere.

## 3. Intro update
- Opening sequence: stars → "APEIRON" title → Earth pass with the name/role titles → the camera follows the ship approaching **Apeiron Station** → docking → the astronaut steps out into the hangar → control hints. Short version for returning visitors / reduced motion.

## 4. Signal Moon (the old planetoid)
- Keep: walking, About and Contact beacons, launch pad and parked ship, the easter-egg dish (it still flashes the Earth beacon).
- Remove: the airlock/docking module and the museum entrance.
- It's no longer the spawn; reachable by ship like the other places.

## 5. Routes, map, picker
- Locations: Apeiron Station, Signal Moon, The Forge, The Observatory → 12 routes. Station routes end in the docking sequence and start from the hangar.
- Map, destination picker, hologram (add the station and Signal Moon), analytics ids and quick-view/phone view updated. The hologram's "Travel" from inside the station starts from the hangar.
- Re-run the M3 route check for all 12 routes (corridor, no jitter, correct arrival/docking), with a temporary Node script deleted afterwards.

## 6. Housekeeping
- CREDITS.md if anything new; `docs/audit.md` change-log row; CLAUDE.md current milestone = M6b; update `roadmap-v2.md`'s "Where content lives" table.

## Acceptance criteria
- [x] After Launch, the intro ends with docking and the astronaut on foot in the hangar
- [ ] The station looks like a real orbital station with Earth large in view; ≥ 50 fps on Medium near it (built; look and fps to be checked by Jefferson on localhost)
- [x] Leaving from the hangar and arriving with automatic docking both work, with no shaking
- [x] The museum rooms, hologram and crew all work inside the orbital station
- [x] Signal Moon keeps About, Contact, its pad and the easter-egg dish; no airlock remains there
- [x] All 12 routes pass the route check; map, picker and hologram list the 4 places
- [x] Quick-view, phone view and "Skip the adventure" unchanged
- [x] `npm run build` passes; `npx vite preview` works
- [ ] Jefferson has tested on localhost and committed it himself

## Station realism pass (roadmap-v2 "Station realism", confirmed 2026-11-12)
- [x] ISS-inspired exterior, code-built: truss with four sun-tracking solar wings (blue cells, gold grid), radiators, MLI-wrapped cylindrical modules with seams, handrails, antennas, docking ports with lights, robotic arm, Cupola dome facing Earth; the hangar is a large docking module; no agency logos
- [x] Hard sunlight with shadows on the exterior, soft Earth-shine from below, blinking nav lights; bloom unchanged
- [x] Interior rebuilt as cylindrical modules (4.8 m, flat deck) joined by round hatches to an octagonal Node with the hologram: Projects, Certificates, Photos (closed while photos.js is empty), Skills, Hangar, walk-in Cupola
- [x] Exhibits along the modules' racks (project screens, certificate frames, photo screens, skill consoles); padded panels, racks, handrails, cables, stowage bags, LED strips, laptops, generic labels
- [x] Crew walk the modules, step aside in the tubes, never stop in a hatch
- [x] Walk check (real planar physics): every module, both walls, every hatch at −0.9…+0.9 m, the Cupola, round the crew: 0 problems
- [x] Only the intro's first shots load before Launch; the station interior, crew and 4K Earth load during the intro, the hangar shows once ready; full intro 12–15 s
- [x] Headless smoke test on the production build: 0 console errors
- [ ] Look and fps checked by Jefferson on localhost
