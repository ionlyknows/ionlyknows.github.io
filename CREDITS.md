# Credits

## Code foundation
Apeiron started from [**Infinite World**](https://github.com/brunosimon/infinite-world) by [Bruno Simon](https://bruno-simon.com/). Its State/View architecture, camera, controls, debug tools and stars shader are still in use. The procedural terrain, grass, water, sky and terrain workers were removed in M0.

## Assets
Every 3D model, texture, sound, and font used on the site is listed here. CC-BY assets must also be credited in the site footer and the quick-view.

| Asset | Type | Author | Source URL | License |
|---|---|---|---|---|
| Project videos, screenshots, certificate images, avatar | Media | Jefferson F. Laspiñas | this repo | Own work |
| Favicon (`public/favicon.svg`, low-poly ringed planet) | Image (SVG) | Jefferson F. Laspiñas | this repo | Own work |
| Rock 030 → `public/textures/surfaces/regolith/` (Home Station ground and rocks) | Texture (albedo, normal, roughness) | ambientCG (Lennart Demes) | https://ambientcg.com/view?id=Rock030 | CC0 1.0 |
| Rock 035 → `public/textures/surfaces/volcanic/` (The Forge ground and rocks) | Texture (albedo, normal, roughness) | ambientCG (Lennart Demes) | https://ambientcg.com/view?id=Rock035 | CC0 1.0 |
| Rock 020 → `public/textures/surfaces/ice/` (The Observatory ground and rocks) | Texture (albedo, normal, roughness) | ambientCG (Lennart Demes) | https://ambientcg.com/view?id=Rock020 | CC0 1.0 |
| Ground 080 → `public/textures/surfaces/sand/` (The Trophy Moon ground and rocks) | Texture (albedo, normal, roughness) | ambientCG (Lennart Demes) | https://ambientcg.com/view?id=Ground080 | CC0 1.0 |
| Metal Plates 006 → `public/textures/surfaces/metal/` (station structures, beacon bases) | Texture (albedo, normal, roughness) | ambientCG (Lennart Demes) | https://ambientcg.com/view?id=MetalPlates006 | CC0 1.0 |
| Blue Marble Next Generation, June 2004 → `public/textures/earth/day.webp` (2048 × 1024) and `day-4k.webp` (4096 × 2048, High quality only) | Texture (Earth day map) | NASA Earth Observatory (Reto Stöckli) | https://visibleearth.nasa.gov/images/74218/december-blue-marble-next-generation (file: `bmng-base/june/world.200406.3x5400x2700.jpg`, from https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-base/june/world.200406.3x5400x2700.jpg) | Public domain (NASA) |
| Black Marble 2012 → `public/textures/earth/night.webp` | Texture (Earth city lights) | NASA Earth Observatory / Suomi NPP | https://visibleearth.nasa.gov/images/144898/earth-at-night-black-marble-2016-color-maps (file: `BlackMarble_2012_01deg.jpg`) | Public domain (NASA) |
| Blue Marble 2002 (land + clouds), cloud cover extracted against the cloud-free map above → `public/textures/earth/clouds.webp` | Texture (Earth clouds) | NASA Goddard Space Flight Center (MODIS) | https://commons.wikimedia.org/wiki/File:BlueMarble-2001-2002.jpg | Public domain (NASA) |
| “Outer Space Loop” → `public/audio/ambient.mp3` (ambient music, re-encoded to 128 kbps) | Music | wipics | https://opengameart.org/content/outer-space-loop | CC0 1.0 |
| “Air Woosh Move” (`air_move.wav`) → `public/audio/warp.mp3` (launch / travel whoosh; slowed to 2.2 s without pitch change, band-limited 70 Hz–7 kHz, faded in/out, mono 96 kbps) | Sound effect | Almitory | https://opengameart.org/content/air-woosh-move | CC0 1.0 |
| `maximize_001` → `public/audio/panel.mp3` (panel open; low-passed at 4.5 kHz and faded so it isn't harsh) | Sound effect | Kenney (Interface Sounds) | https://opengameart.org/content/interface-sounds | CC0 1.0 |
| `confirmation_001` → `public/audio/beacon.mp3` (beacon in range) | Sound effect | Kenney (Interface Sounds) | https://opengameart.org/content/interface-sounds | CC0 1.0 |
| “Astronaut” (model + animations Idle, Walk, Run, Wave, Interact) → `public/models/astronaut.glb` (meshopt-compressed with gltf-transform; recoloured in code to the Apeiron palette; source kept in `art/astronaut/astronaut-quaternius-source.glb`) | 3D model + animations | Quaternius | https://poly.pizza/m/3hC2i0CTuO | CC0 1.0 |
| “Astronaut” helmet split (M5): the front visor separated from the ear rings / tubes by vertex selection, own helmet-shell material (same GLB, re-compressed) | 3D model edit | Jefferson F. Laspiñas | this repo | Own work (of a CC0 model) |
| “Spaceship” (Rae the Red Panda) → `public/models/ship.glb` (atlas colours split into hull / trim / canopy / accent groups, scaled to 5.1 m, no texture, meshopt-compressed; recoloured in code; source kept in `art/ship/ship-quaternius-source.glb`) | 3D model | Quaternius | https://poly.pizza/m/uCeLfsdmNP | CC0 1.0 |
| Fabric 048 → `public/textures/suit/fabric-normal.webp` (astronaut suit fabric detail; normal map only, 512 px WebP) | Texture (normal) | ambientCG (Lennart Demes) | https://ambientcg.com/view?id=Fabric048 | CC0 1.0 |
| Star positions and magnitudes of the 10 constellations (`sources/Game/config/constellations.js`, J2000, rounded) | Data | Yale Bright Star Catalogue, 5th revised ed. (Hoffleit & Warren 1991), distributed by NASA HEASARC / CDS | https://heasarc.gsfc.nasa.gov/W3Browse/star-catalog/bsc5p.html | Public domain (factual data, freely distributed) |
| 8 space facts (`sources/content/facts.js`, science lab, M7): each worded from the NASA Science page in its `source` field (Moon, Mars, Sun, Venus, Jupiter and Saturn facts pages) | Text (facts) | NASA Science | https://science.nasa.gov | Public domain (NASA; facts) |
| `public/audio/radio/sputnik.mp3` (70 KB) — "Sputnik: Beep" | Sound (radio tuner, M7) | NASA | https://www.nasa.gov/wp-content/uploads/2015/01/578626main_sputnik-beep.mp3 (listed on https://www.nasa.gov/historical-sounds/) | Public domain (NASA media) |
| `public/audio/radio/jupiter-lightning.mp3` (126 KB) — "Voyager: Lightning on Jupiter" | Sound (radio tuner, M7) | NASA / JPL | https://www.nasa.gov/wp-content/uploads/2015/01/603921main_voyager_jupiter_lightning.mp3 | Public domain (NASA media) |
| `public/audio/radio/saturn-radio.mp3` (208 KB) — "Cassini: Saturn Radio Emissions #2" | Sound (radio tuner, M7) | NASA / JPL | https://www.nasa.gov/wp-content/uploads/2015/01/584795main_saturn_radio_waves.mp3 | Public domain (NASA media) |
| `public/audio/radio/enceladus.mp3` (169 KB) — "Cassini: Enceladus Sound" | Sound (radio tuner, M7) | NASA / JPL | https://www.nasa.gov/wp-content/uploads/2015/01/584796main_enceladus.mp3 | Public domain (NASA media) |
| `public/audio/radio/kepler-star.mp3` (71 KB) — "Kepler: Star KIC12268220C Light Curve Waves to Sound" | Sound (radio tuner, M7) | NASA | https://www.nasa.gov/wp-content/uploads/2015/01/578358main_kepler_star_KIC12268220C.mp3 | Public domain (NASA media) |
| Code-built ship (fallback if the ship model fails), rubber duck, antenna dish, beacons, launch pads, astronaut backpack and chest light (built in code: `sources/Game/State/PropShapes.js`, `View/PlayerModel.js`) | 3D models | Jefferson F. Laspiñas | this repo | Own work |
| Milky Way, galaxies, meteors, nebula (procedural shaders, no images) | Shaders | Jefferson F. Laspiñas | this repo | Own work |
| Apeiron Station, ISS-inspired (code-built: `View/Station.js`, `View/StationInterior.js`, `View/StationParts.js`): modules, Node, hangar, Cupola dome, truss, solar wings, radiators, robotic arm, racks, hatches, fittings; canvas-drawn MLI blanket, solar-cell, padded-panel, rack, laptop-screen and label textures (no images; NASA models used only as visual reference, no agency logos or names) | 3D models, textures | Jefferson F. Laspiñas | this repo | Own work |
| The Observatory's exploration stations (M7, code-built in `State/PropShapes.js`): telescope, rover, science lab hut, sample stands; scan sound synthesized in `Audio.js` | 3D models, sound | Jefferson F. Laspiñas | this repo | Own work |
| Apeiron Station exterior (modules, dome, truss, solar arrays and their cell texture, radiators, nav and docking guide lights, bay door) and interior with the Hangar, featured-build board, activity banners, goals console (built in code: `View/Station.js`, `State/InteriorLayout.js`, `State/PropShapes.js`, `View/StationInterior.js`, `View/ExhibitScreens.js`; walls, floors and the far-away hull reuse the Metal Plates 006 set above) | 3D models | Jefferson F. Laspiñas | this repo | Own work |
| Station crew and Forge workers: recoloured clones of the Quaternius “Astronaut” above (no new file) | 3D model reuse | Quaternius | https://poly.pizza/m/3hC2i0CTuO | CC0 1.0 |
| Rubber-duck squeak (synthesized in `sources/Game/Audio.js`, no file) | Sound effect | Jefferson F. Laspiñas | this repo | Own work |
| Share image `public/media/og-image.webp` (render of the site itself + title text) | Image | Jefferson F. Laspiñas | this repo | Own work |
| Inter (loaded from Google Fonts) | Font | Rasmus Andersson | https://fonts.google.com/specimen/Inter | SIL Open Font License 1.1 |
| JetBrains Mono (loaded from Google Fonts) | Font | JetBrains | https://fonts.google.com/specimen/JetBrains+Mono | SIL Open Font License 1.1 |

All textures were resized to 1K/2K and converted to WebP for the site; the surface sets pack the normal map (R, G) and roughness (B) into one file.
Sounds were converted from OGG to MP3 (mono, 96 kbps) for the site.

No asset needs CC-BY attribution today. The quick-view / phone footer lists the main sources anyway (`sources/content/credits.js`); any future CC-BY asset must be added there too.
