# M0 — Cleanup

**Goal:** turn the old Infinite World portfolio into a clean, light foundation for Apeiron, without breaking the build or the Vue panels.
**Branch:** `m0-cleanup`
**Spec references:** §7 (modules), §8 (architecture and folder structure), §9 (data model), §10 (budget)

## Execution plan (parallel tracks)
| Track | Who | Tasks | Files touched |
|---|---|---|---|
| A | **Lead** | 1 (remove old code) + the capsule player from 2 → 3 (content) → 5 (housekeeping) → 6 (scene check) | `sources/`, repo root |
| B | **`asset-optimizer` subagent**, started at the same time as A | File deletions from 2 (`.vrm`/`.fbx`) + 4 (shrink media, move to `public/media/`) | `public/` only |

- Start Track B first, then work on Track A while it runs.
- When B reports its old → new path map, the lead updates the paths in `sources/content/` (the content files are created in task 3).
- Then run the loop from CLAUDE.md: build → fix (max 3 attempts per error) → report.

## Tasks

### 1. Remove old world code
Delete these and every import of them:
- `sources/Game/State/`: `Chunks.js`, `Chunk.js`, `Terrains.js`, `Terrain.js`, `DayCycle.js`, `Sun.js`, `Teleporter.js`
- `sources/Game/View/`: `Chunks.js`, `Chunk.js`, `ChunkHelper.js`, `Terrains.js`, `Terrain.js`, `TerrainGradient.js`, `Grass.js`, `Water.js`, `Noises.js`, `CertificateBillboards.js`, `Billboard.js`
- `sources/Game/Workers/` (whole folder)
- Shaders/materials used only by the removed files (terrain, grass, noises)
- **Keep:** the stars shader, `Renderer`, `Camera`, `Controls`, `Viewport`, `Time`, `Debug`, and the whole `sources/UI/` folder
- Keep `CameraFly.js`, reachable only with `#debug`

### 2. Remove assets that can't be published
- Delete `public/models/player/character.vrm` (license forbids redistribution)
- Delete the Mixamo `.fbx` files from `public/` (raw animation files must not be shipped). They are replaced in M1.
- Temporary player = a simple colored capsule mesh

### 3. Consolidate content into `sources/content/`
Create `profile.js`, `projects.js`, `skills.js`, `achievements.js`, `activities.js`, `contact.js` using the schemas in spec §9.
- Merge the data from `sources/UI/data/about.js` and `sources/UI/data/projects.js`. **Project data lives in one place only.**
- Onsite Event Registration stack = Java, Swing, JSON (from `about.js`)
- Add entries for **Sourcerer Crusade, Requisito, Payroll System** with only `id` set. Everything else stays empty (TBD).
- 3D Portfolio `repoUrl`/`demoUrl` = empty (old `Yknowjeff` links removed)
- `resumeUrl` = empty
- Contact links: email, GitHub, LinkedIn, Facebook. Leave a URL empty if it isn't in the repo; **do not invent it**.
- Update the UI components to read from `sources/content/`, then delete `sources/UI/data/`
- Apply BR-07: empty fields are hidden

### 4. Shrink media
- Re-encode `public/projects/*.mp4` to ≤ 4 MB each (H.264, 720p, e.g. `ffmpeg -crf 28 -preset veryfast -vf scale=-2:720 -an`), and keep the audio only if the video needs it
- Make a poster image (`.webp`) for each video
- Videos use `preload="none"` and load only when the panel opens
- Convert certificate images to `.webp`
- Move everything into `public/media/` as in spec §8

### 5. Repo housekeeping
- Delete `.github/workflows/deploy.yml` (Vercel only)
- Add `LICENSE` (license type: **ask Jefferson**)
- Add `CREDITS.md` with a credit to Bruno Simon's *Infinite World* for the original foundation, plus the table format from spec §10
- Rename the localStorage key `infinite-world-settings-v2` → `apeiron.settings`
- Update `README.md`: Apeiron name, new description, Vercel link only
- Confirm `vercel.json` isn't needed; Vite defaults work on Vercel

### 6. Empty-scene check
- The site loads to an empty space scene with the starfield and the capsule player
- The HUD still opens every Vue panel with the new content data

## Acceptance criteria
- [ ] No imports or references to removed files; no console errors *(imports: verified by `npm run build`; console: check during Jefferson's localhost test)*
- [x] No `.vrm` or `.fbx` files in `public/`
- [x] All content comes from `sources/content/`; `sources/UI/data/` is gone
- [x] Every video ≤ 4 MB, with a poster
- [x] `LICENSE`, `CREDITS.md`, `CLAUDE.md` present; GitHub Pages workflow gone
- [x] `npm run build` passes; `npx vite preview` runs the built site on localhost without errors
- [ ] Jefferson has tested on localhost (`npm run dev`) and approved

## Ask Jefferson before doing
- ~~Which license to use for `LICENSE` (e.g. MIT)~~ → **MIT** (Jefferson, 2026-11-10)
- Whether to purge the old character and Mixamo files from **git history** too. Deleting them now still leaves them in older commits. A purge (`git filter-repo`) rewrites history and needs a force-push, so it's his call. → **Purge** (Jefferson, 2026-11-10); runs after he approves the M0 commit.
