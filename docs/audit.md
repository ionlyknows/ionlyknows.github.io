# Codebase Audit — Apeiron (repo `ionlyknows/ionlyknows.github.io`)

**Audited:** 2026-11-10 · **Commit:** `8110261` ("Add compressed project videos") · **By:** Claude (planning session)

> **Agents: do not re-audit the codebase.** This file is the audit. Trust it, and **update it** whenever a milestone changes something listed here: tick the finding, add the commit, and note new findings. Re-audit only if Jefferson asks, or if the repo has changed in ways this file doesn't cover.

---

## 1. Snapshot at audit time
- **Stack:** Three.js r0.184 (WebGL), Vue 3.5, GSAP 3, Vite 4, GLSL via `vite-plugin-glsl`, `@pixiv/three-vrm` 3 (removed M1), `simplex-noise`, `seedrandom`, `gl-matrix`, `lil-gui`, `stats.js`, `events`
- **Size:** ~210 MB, 120 files (excluding `node_modules`)
- **Origin:** built on Bruno Simon's *Infinite World* (procedural terrain, chunks, grass, water, sky, day cycle, terrain web workers)
- **Architecture:** `sources/Game/State` (logic) / `sources/Game/View` (rendering) / `sources/UI` (Vue), connected by `sources/UI/UIBridge.js`
- **Deploy:** Vercel (primary) + GitHub Pages workflow (`.github/workflows/deploy.yml`)

## 2. Module inventory and verdict
| Area | Files | Verdict |
|---|---|---|
| Terrain/world | `State/Chunks, Chunk, Terrains, Terrain, DayCycle, Sun, Teleporter`; `View/Chunks, Chunk, ChunkHelper, Terrains, Terrain, TerrainGradient, Grass, Water, Noises`; `Workers/*`; terrain/grass/noises shaders | **Remove** (M0) |
| Billboards | `View/Billboard.js` (774 lines), `View/CertificateBillboards.js` | **Remove** (M0); replaced by planet content points |
| Player | `State/Player.js`, `View/Player.js`, `View/PlayerModel.js`, `loadMixamoAnimationForVRM.js`, `mixamoVRMRigMap.js` | **Done (M1)**: `State/Player.js` rewritten for spherical gravity; `View/Player.js` + VRM/Mixamo helpers deleted; code-built astronaut in `View/PlayerModel.js` |
| Camera | `State/Camera.js`, `CameraThirdPerson.js`, `CameraFly.js`, `View/Camera.js` | **Done (M1)**: `CameraThirdPerson` follows the player's up; `CameraFly` kept behind `#debug` |
| Core | `Game.js`, `Settings.js`, `State/Controls, Viewport, Time, State.js`, `View/Renderer, View.js` | **Keep / refactor** |
| Sky | `View/Sky.js`, sky + stars shaders | **Keep the stars shader**, replace the sky (M2) |
| Debug | `Debug/*` | **Keep** |
| UI | `UI/App.vue`, `UIBridge.js`, `components/*`, `panels/*`, `composables/*`, `styles/tokens.css` | **Keep + extend** |
| Content | `UI/data/about.js`, `UI/data/projects.js` | **Move** to `sources/content/` (M0) |
| Extras | `public/Prelim/*` (Fashion Blog, Wine Festival, Davies Burger: class pages linked from Activities) | **Keep** (linked content) |

## 3. Findings
| # | Finding | Severity | Status |
|---|---|---|---|
| F1 | `character.vrm` ("おばけ" by だっすー), downloaded free. VRM license metadata: no redistribution, avatar use only by separately licensed persons, personal non-profit only. Public hosting is not permitted. | **High** | **Resolved (M0)**: deleted from `public/`; capsule placeholder until M1. History purge pending (F11) |
| F2 | Mixamo `.fbx` animations shipped as raw files in `public/` (Idle, Running, Fast_Run, Running_Jump, Silly_Dancing) | Medium | **Resolved (M0)**: deleted; bake animations into the character GLB in M1 |
| F3 | `Idle.fbx` is 30 MB (others ~0.3–0.5 MB); likely embedded mesh/textures | Medium | **Resolved (M0)** with F2 |
| F4 | Project videos are 20–32 MB each (`Onsite.mp4`, `QA TCI.mp4`, `World.mp4`) | **High** (perf) | **Resolved (M0)**: onsite 2.8 MB, gdg-qa 4.0 MB, world 3.9 MB (`public/media/projects/`) |
| F5 | No `LICENSE` file; `package.json` says ISC; Infinite World credit only in README | Medium | **Resolved (M0)**: MIT `LICENSE`, `package.json` license MIT, `CREDITS.md` added |
| F6 | Project data duplicated in `about.js` and `projects.js` with inconsistencies (Onsite stack empty in `projects.js`, Java/Swing/JSON in `about.js`) | Medium | **Resolved (M0)**: single `sources/content/projects.js`; Onsite stack = Java, Swing, JSON |
| F7 | `Guilds.png` is the GDG QA project image, not a separate project | Low | **Resolved (M0)**: now `media/projects/gdg-qa.webp` |
| F8 | 3D Portfolio links point to the old `Yknowjeff` GitHub account | Low | **Resolved (M0)**: repoUrl/demoUrl empty; Activities now link to local `/Prelim/...` pages instead of `yknowjeff.github.io` |
| F9 | localStorage key still `infinite-world-settings-v2` | Low | **Resolved (M0)** |
| F10 | GitHub Pages workflow present; decision is Vercel only | Low | **Resolved (M0)**: `.github/` removed |
| F11 | Old character and FBX files remain in git history even after deletion | Medium | **Purged locally (M0)**: `git filter-repo` removed `public/models/player/`, `public/Ghost.png`, `public/social/Ghost.png` from all history. Open: force-push `main` + `m0-cleanup` (Jefferson runs it). Note: purged `main` **fails `npm run build`** (`CertificateHint.vue` imports `/social/Ghost.png`), so Vercel deploys from `main` will fail and production stays on the last good deployment (which still serves the old files) until M2. Backup: `C:\dev\backup\pre-purge-backup.bundle` |
| F18 | `node_modules/` (4,760 files) was tracked in commits `7321553`/`17aeef4` until `ecdf98a`/`455a19c`; pack is still ~100 MB after the F11 purge | Low | Open → Jefferson runs the `git filter-repo --path node_modules/ --invert-paths` purge himself |
| F12 | Mobile currently gets the 3D world (only a notice) | Medium | Open → M2 (BR-01: phones never load Three.js) |
| F13 | `ghost.webp` (was `social/Ghost.png`, the "Ghosty" art, now the favicon) has no recorded source or license; it may come from the removed おばけ character | Medium | **Resolved (M0)**: treated as unlicensed and deleted; favicon replaced by an original SVG (`public/favicon.svg`, own work in `CREDITS.md`). History purge with F11 |
| F14 | `gdg-qa.mp4` is 10 min 13 s long, so fitting it under 4 MB needed ~50 kbps; it looks soft | Low | Open → waiting for Jefferson's trim timestamps, then re-encode |
| F15 | Email mismatch: contact uses `its.jeffersonlaspinas@gmail.com`, `package.json` author uses `its.laspinasjefferson@gmail.com` | Low | **Resolved (M0)**: confirmed `its.laspinasjefferson@gmail.com`; `contact.js` updated, old address removed everywhere |
| F16 | Live URL is still `field-notes-xi-eight.vercel.app` (old "Field Notes" name); used in README and OG tags | Low | Open → Jefferson renames the Vercel project later (e.g. `apeiron`), then update the links |
| F17 | `@pixiv/three-vrm`, `loadMixamoAnimationForVRM.js` and `mixamoVRMRigMap.js` are kept but unused after M0 | Info | **Resolved (M1)**: package uninstalled, both helpers deleted; astronaut is built in code |
| F19 | Main JS chunk is ~766 kB (Three.js + game + UI in one bundle) | Low | Open → M2 (BR-01 dynamic `import()` splits Three.js out for phones) |

## 4. Strengths worth keeping
- Clean State/View/UI separation, with one bridge between Game and UI
- Heavy animation clips already load after the world is usable (good loading pattern)
- Vue UI has design tokens, responsive panels, and Esc handling
- Credits to Infinite World already acknowledged

## 5. Change log
| Date | Milestone | Commit | Findings resolved / added |
|---|---|---|---|
| 2026-11-10 | — | `8110261` | Initial audit (F1–F12) |
| 2026-11-10 | M0 | uncommitted (`m0-cleanup`) | Resolved F1–F10; F11 decided (purge pending); added F13–F17 |
| 2026-11-10 | M0 follow-ups | uncommitted (`m0-cleanup`) | Resolved F13 (ghost image removed, new SVG favicon), F15 (email); F14, F16 still open |
| 2026-11-10 | M1 | uncommitted (`m1-planet`) | Resolved F17 (VRM package + helpers removed); added F19 (bundle size, M2). New: `config/planets.js`, `State/Planets.js`, `StateMachine.js`, `View/Planet.js`, `View/PlayerModel.js`, `View/Lights.js`, `UI/components/InteractionPrompt.vue` |
