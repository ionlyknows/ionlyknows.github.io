# Apeiron Roadmap v2 (after M4)
Decided with Jefferson on 2026-11-11. M5–M8 (incl. M6b) are new features; M9 is the old "M5 Final launch".

| Milestone | Content |
|---|---|
| **M5 Universe & Navigation** | 2D map on **M** (click a place → travel) · **all travel by ship** (autopilot ship replaces the flying-astronaut cinematic) · galaxies, Milky Way and real constellations · meteors and drifting rocks (scenery) |
| **M6 Space Station Gallery & content move** | The Home Station becomes enterable and walkable inside. Rooms: **Projects showroom, Certificates, Photos, Skills lab**. Centre: a **hologram of the Apeiron universe** you can orbit (rotate/zoom). **The Forge** becomes *How I build* (best-project deep dive + school activities). **The Observatory** becomes *Where I'm going* (learning & goals). **The Trophy Moon is removed.** |
| **M6b Orbital Space Station** | The museum moves into **Apeiron Station**, a real station orbiting Earth, reached by ship with automatic docking. Visitors start in its hangar. The old planetoid stays as **Signal Moon** (About, Contact, easter-egg dish). |
| **M7 Observatory Exploration** | Four interactive exploration stations on the Observatory: **Telescope** ("looking ahead"), **Rover**, **Science lab**, **Radio dish** |
| **M8 Earth, Sun & Free Flight** | Earth orbit flight + a cinematic dive to **Santa Josefa, Agusan del Sur** + a Home card · **visit the Sun** (close flyby, no landing) · **free flight mode** around the whole Apeiron (not just set routes), with a Return button |
| **M9 Final launch** | Payroll project, Vercel rename (F16), final performance/license check, docs sync |

## Where content lives (CONFIRMED 2026-11-11)
| Place | Shows |
|---|---|
| Apeiron Station — *the museum* (orbiting Earth, spawn in the hangar) | Projects showroom, Certificates, Photos, Skills lab, Apeiron hologram |
| Signal Moon (old Home Station planetoid) | About + Contact beacons, "Signal from home" easter egg |
| The Forge — *How I build* | Deep dive into Jefferson's best project (giant exhibit, architecture frontend → backend → database, demo, role) + school activities |
| The Observatory — *Where I'm going* | What Jefferson is learning now and his goals + exploration stations (Telescope, Rover, Science lab, Radio dish) |
| Earth — *Where I'm from* | Hometown: free exploring + Home card |
| Sun | Flyby destination |
| Trophy Moon | Removed (M6) |

## Decisions (CONFIRMED by Jefferson, 2026-11-11)
- Earth: option B (orbit flight + Philippines dive). Free exploring; a Home card opens at the hometown.
- **Real Philippine geography** for the dive (CONFIRMED): islands, coastlines and terrain from **public-domain / openly licensed data only**: NASA Blue Marble imagery, NASA SRTM elevation (terrain relief: Mindanao's mountains, the Agusan valley and river), Natural Earth coastlines/boundaries. OpenStreetMap only with its required attribution. **Never copy Google Maps** imagery, tiles or data (their terms forbid it).
- The hometown pin sits on the **Santa Josefa town centre** (public municipality coordinates), **not** Jefferson's house, barangay or purok (privacy).
- Home card text: "Home: Santa Josefa, Agusan del Sur, Philippines" + "My hometown, with many rice fields." (CONFIRMED). Purok and barangay are **not** shown publicly (privacy).
- "Fly around the Apeiron" = **both**: orbit the hologram inside the station, and a separate free-flight mode outside.
- Trophy Moon removed in M6 (not before, so its content is never orphaned).
- The station has no Activities room; activities live on The Forge.
- Planets are **stories**: the station is the museum (everything quick to find); The Forge = *How I build*; The Observatory = *Where I'm going*; Earth = *Where I'm from*.
- The Forge keeps its name and volcanic look.
- Forge deep-dive project: [UNRESOLVED — Jefferson decides before M6; the exhibit is built from content so the project can be swapped].
- Observatory "learning & goals" text: [UNRESOLVED — Jefferson writes it; current `currentlyLearning` data can seed it].
- Observatory exploration stations: Telescope, Rover, Science lab, Radio dish.
- **Ambient NPCs** (CONFIRMED; no talking NPCs, no AI chatbot): a few CC0 characters (astronauts, robots, drones) that walk around, work and wave when the visitor passes. No dialogue. ≤ 4 per location, only the current location animates, they step aside instead of blocking the player, never in the way of beacons or pads. Added per location: station interior crew + The Forge (M6), The Observatory scientists near the exploration stations (M7). If talking NPCs are ever added: the agent drafts lines only from existing content and Jefferson approves them.
- Map: **2D overlay** on the M key.
- Travel: always **by ship**. The launch-pad picker offers "Fly it yourself" or "Autopilot".
- **Photos room = hologram screens** (CONFIRMED): each photo floats as a translucent, softly glowing holographic screen projected from an emitter on the floor/wall (cyan-tinted edges, gentle flicker on appear, slow hover, a faint light cone from the projector). Readable: the photo itself stays clear and correctly coloured; the hologram effect is on the frame/edges, not over the image. Walk up + E (or click) → the photo opens full-size in the normal 2D viewer with its caption. No harsh scanlines. Certificates stay as solid framed panels (sharper to read) unless Jefferson asks otherwise.
- Photos: Jefferson provides his own photos (only ones he took or has permission to use, people in them OK with being public), ~6–12, with captions. UNRESOLVED until he sends them.
- **Orbital station** (CONFIRMED 2026-11-11): the museum is a real space station orbiting Earth (ISS-like), reached by ship, automatic docking into a hangar; visitors start in the hangar. The planetoid stays as a small moon (names proposed: Apeiron Station, Signal Moon — Jefferson may rename).
- **Station realism** (CONFIRMED 2026-11-12): ISS-inspired exterior (truss, solar array wings, radiators, MLI-wrapped modules, robotic arm, docking ports), code-built with CC0 textures; NASA models only as visual reference; no NASA/agency logos. **Interior = real cylindrical module tubes with walking** (round hatches between modules, exhibits along curved walls, the hologram in a larger central node module) plus a **walk-in Cupola** dome looking down at Earth and the Philippines beacon. No zero-g floating. Earth made ~2–3× bigger and the station moved to a higher orbit with clearance from every Earth layer.

## Rules that still apply
Quick-view and "Skip the adventure" stay unchanged for recruiters · new areas load only when visited (first load ≤ 5 s, ≤ 15 MB) · ≥ 50 fps on Medium · CC0 / public-domain / own assets only · no backend.
