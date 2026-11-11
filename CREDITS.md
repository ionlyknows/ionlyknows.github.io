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
| Blue Marble Next Generation, June 2004 → `public/textures/earth/day.webp` | Texture (Earth day map) | NASA Earth Observatory (Reto Stöckli) | https://visibleearth.nasa.gov/images/74218/december-blue-marble-next-generation (file: `bmng-base/june/world.200406.3x5400x2700.jpg`) | Public domain (NASA) |
| Black Marble 2012 → `public/textures/earth/night.webp` | Texture (Earth city lights) | NASA Earth Observatory / Suomi NPP | https://visibleearth.nasa.gov/images/144898/earth-at-night-black-marble-2016-color-maps (file: `BlackMarble_2012_01deg.jpg`) | Public domain (NASA) |
| Blue Marble 2002 (land + clouds), cloud cover extracted against the cloud-free map above → `public/textures/earth/clouds.webp` | Texture (Earth clouds) | NASA Goddard Space Flight Center (MODIS) | https://commons.wikimedia.org/wiki/File:BlueMarble-2001-2002.jpg | Public domain (NASA) |
| “Outer Space Loop” → `public/audio/ambient.mp3` (ambient music, re-encoded to 128 kbps) | Music | wipics | https://opengameart.org/content/outer-space-loop | CC0 1.0 |
| “Air Woosh Move” (`air_move.wav`) → `public/audio/warp.mp3` (launch / travel whoosh; slowed to 2.2 s without pitch change, band-limited 70 Hz–7 kHz, faded in/out, mono 96 kbps) | Sound effect | Almitory | https://opengameart.org/content/air-woosh-move | CC0 1.0 |
| `maximize_001` → `public/audio/panel.mp3` (panel open; low-passed at 4.5 kHz and faded so it isn't harsh) | Sound effect | Kenney (Interface Sounds) | https://opengameart.org/content/interface-sounds | CC0 1.0 |
| `confirmation_001` → `public/audio/beacon.mp3` (beacon in range) | Sound effect | Kenney (Interface Sounds) | https://opengameart.org/content/interface-sounds | CC0 1.0 |
| Inter (loaded from Google Fonts) | Font | Rasmus Andersson | https://fonts.google.com/specimen/Inter | SIL Open Font License 1.1 |
| JetBrains Mono (loaded from Google Fonts) | Font | JetBrains | https://fonts.google.com/specimen/JetBrains+Mono | SIL Open Font License 1.1 |

All textures were resized to 1K/2K and converted to WebP for the site; the surface sets pack the normal map (R, G) and roughness (B) into one file.
Sounds were converted from OGG to MP3 (mono, 96 kbps) for the site.

No asset needs CC-BY attribution today. The quick-view / phone footer lists the main sources anyway (`sources/content/credits.js`); any future CC-BY asset must be added there too.
