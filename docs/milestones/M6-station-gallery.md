# M6 — Space Station Gallery & Planet Stories

**Goal:** the Home Station becomes a walkable museum with everything quick to find; The Forge tells *How I build*; The Observatory tells *Where I'm going*; the Trophy Moon is removed.
**Branch:** `m6-station`, created from `m5-universe`
**Model / effort:** Opus, **high** (biggest build: a new interior and a new walking mode)
**References:** `docs/roadmap-v2.md` (all M6 decisions), BR-03, BR-04, BR-07, BR-08, FR-15, FR-16 · Skills: `apeiron-3d-world`, `apeiron-ui`
**Content rule:** nothing in this milestone invents text or photos. Everything comes from `sources/content/`. Empty content stays hidden (BR-07). Jefferson fills in new content files later; that must be a data-only change.

## New content files (create with empty/TBD values; Jefferson fills them)
- `content/photos.js`: `[{ id, src, caption, alt }]`, empty array for now.
- `content/goals.js`: `{ currentlyLearning: [], next: [], goal: '' }`. Seed `currentlyLearning` only from data that already exists in `profile.js`; leave `next` and `goal` empty.
- `content/forge.js`: `{ featuredProjectId: '3d-portfolio' }` (default: Apeiron itself, until Jefferson picks his best build). Extend the project schema with optional fields: `problem`, `outcome`, `architecture: { frontend, backend, database, deployment }`. Fill them only from data already in `projects.js` (e.g. stack); the rest stays empty and hidden.

## Part A: the station interior
**Entering:** a docking module with an airlock door is added on the Home Station planetoid near the landing point (About and Contact beacons stay outside). Walk up + E → airlock animation + short fade → inside. An "Exit" airlock inside takes you back out.
**Interior layout** (compact, ~40 × 40 m, flat floor, normal "down" gravity):
- **Central rotunda** with the **Apeiron hologram** on a projector, big windows to space and Earth.
- Four rooms off the rotunda, each with a lit sign: **Projects**, **Certificates**, **Photos**, **Skills**.
**Walking mode:** add a **planar** mode to the player physics (flat floor, gravity −Y, wall colliders from the interior meshes) beside the existing spherical mode. Same controls, same single-writer / fixed-step rules, same camera (with camera-wall avoidance indoors). The interior loads only when entering (lazy), and the outside planets stop updating while inside.
**Look:** cinematic sci-fi interior, PBR metal panels (reuse the CC0 metal set), soft light strips, a few practical lights (≤ 6 real lights, the rest emissive), light fog. Quality levels apply.

**Rooms:**
| Room | What's there | Interaction |
|---|---|---|
| **Projects showroom** | Every project as a large wall screen (its image/poster); featured ones larger, in `order` | Walk up + E → Work panel opened on that project |
| **Certificates** | Each certificate as a solid framed panel with a small spotlight | E → certificate viewer with credential link |
| **Photos** | **Hologram screens** exactly as in `roadmap-v2.md` (projected, glowing edges, clear true-colour photo, gentle hover/flicker-on, no harsh scanlines) | E → full-size photo + caption. **If `photos.js` is empty, the Photos doorway is a closed wall panel with no sign** (no "coming soon"); adding photos opens it automatically |
| **Skills lab** | Skill groups as glowing consoles/displays (one per group from `skills.js`) | E → Skills panel |

**Hologram (centre):** a miniature Apeiron system (Sun, Home Station, The Forge, The Observatory, Earth, orbit lines) slowly rotating above the projector. E → **orbit mode**: drag to rotate, scroll to zoom, hovering a body shows its name and one-line description; a "Travel" button on a hovered location starts the normal ship trip (exit station → autopilot / fly it yourself). Esc leaves orbit mode.

**Crew NPCs (ambient, no talking):** 2–4 CC0 characters (Quaternius astronaut/robot recoloured) walking between waypoints, pausing at consoles, waving when the visitor passes; they step aside, never block doors or exhibits. Only animate while inside.

## Part B: The Forge — *How I build*
- Remove the Work beacon (projects now live in the station).
- **Featured build exhibit:** a large monument/screen near the landing point showing the project `forge.featuredProjectId`: title, role, problem, outcome, media, and an **architecture display** (frontend → backend → database → deployment as glowing connected nodes). Every empty field is hidden. E → Work panel on that project.
- **School activities:** one monument/banner per activity from `activities.js`; E → Activities panel at that activity.
- 2–3 ambient **worker NPCs/robots** at the forge.
- Update `content/locations.js` description for The Forge to reflect "How I build" (short, factual: e.g. "How I build: featured project and school activities") — Jefferson may edit.

## Part C: The Observatory — *Where I'm going*
- Remove the Skills beacon (skills now live in the station).
- **Goals console:** a telescope-side console showing `goals.js` (currently learning, next, goal). Empty parts hidden; if all are empty, the console is hidden.
- Leave clear, flat spots for the M7 exploration stations (Telescope, Rover, Science lab, Radio dish); don't build them yet.
- Update its `locations.js` description ("Where I'm going: learning and goals") — Jefferson may edit.

## Part D: remove the Trophy Moon
- Remove its config, meshes, colliders, launch pad, map entry, routes and flight corridors (routes go from 12 to 6). Achievements now in the station Certificates room; Activities on The Forge.
- Map, destination picker, HUD, analytics `location_visit` ids, quick-view and phone view all updated. Nothing references `trophy` anymore.

## Part E: housekeeping
- CREDITS.md for any new asset (NPC models, interior textures).
- `docs/audit.md` change-log row; CLAUDE.md current milestone = M6.

## Acceptance criteria
- [x] Airlock in/out works; the interior loads only on entry; planar walking has no shaking or sticking on walls; the camera never clips through walls
- [x] Projects, Certificates and Skills rooms open the right panels; featured projects are larger
- [x] Photos room: hidden behind a closed panel while `photos.js` is empty; with a test entry added locally it shows a hologram screen with a clear photo (remove the test entry afterwards)
- [x] Hologram orbit mode: rotate, zoom, names on hover, Travel works, Esc exits
- [x] The Forge shows the featured-build exhibit (empty fields hidden) and every activity; no Work beacon
- [x] The Observatory shows the goals console (or hides it when empty); no Skills beacon; space left for M7
- [x] Trophy Moon fully gone (map, picker, routes, analytics, quick-view)
- [x] Ambient NPCs move, wave, step aside, never block
- [x] ≥ 50 fps on Medium inside and outside; first load still ≤ 5 s (interior lazy-loaded) (preview, this machine: outside 72 idle / 61 walking vs M5 77 / 69; inside 90+; Launch ready 3.7–4.3 s; interior chunk 14 kB loads on entry)
- [x] Quick-view, phone view and "Skip the adventure" still show all content
- [x] `npm run build` passes; `npx vite preview` works
- [ ] Jefferson has tested on localhost and committed it himself
