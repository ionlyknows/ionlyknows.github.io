# M4 — Character & Polish

**Goal:** replace the code-built placeholder with a real astronaut mascot that fits the cinematic look, add the 3 easter eggs, and finish the remaining polish (share image, GDG video).
**Branch:** `m4-polish`, created from `m3-flight`
**Model / effort:** Opus, **high**
**Spec references:** G5, FR-19, BR-07, BR-10, BR-11, NFR-08 · Skills: `lowpoly-asset-pipeline` (sourcing, rig, export, compression; ignore its "cute low-poly" look notes, the style is cinematic), `apeiron-3d-world`, `apeiron-ui`

## Part A: the astronaut mascot
**Look:** a stylized, appealing astronaut that matches the cinematic PBR world: slightly chunky proportions (bigger helmet, shorter body) but realistic materials (off-white fabric suit with seams, orange accents, backpack, reflective dark-gold visor). Height ≈ 1.9 m. ≤ 15k triangles. One `.glb`, ≤ 2.5 MB after compression, textures ≤ 1K WebP.

**How to get it (in this order, stop at the first that works):**
1. **CC0 model:** search CC0 sources (Quaternius, Kenney, Poly Pizza items marked CC0) for an astronaut that fits the look after recolouring. Verify the license on the asset's own page. If none fits, go to 2.
2. **Build it in Blender with Python** (`tools/blender/make_astronaut.py`, run headless: `blender --background --python ...`, or through the Blender MCP if Jefferson has it connected). Save the source as `art/astronaut.blend`. If Blender isn't installed, **stop and ask Jefferson** to install it (blender.org, free).
3. **Rig + animations:** a humanoid skeleton with Mixamo bone names. Animations: `idle`, `walk`, `run`, `jump`, `emote` (a short wave or dance), `board` (step up into the ship).
   - Preferred: Jefferson uploads the model to Mixamo (free Adobe account, manual, ~10 min). Give him exact step-by-step instructions (which animations, "In Place" ticked, "Without Skin" for the extra clips, FBX settings), wait for the files, then combine everything in Blender into **one** GLB with the actions named as above.
   - Fallback if Jefferson prefers not to use Mixamo: keyframe simple versions of the animations with the Blender script.
   - Raw Mixamo `.fbx` files never go into `public/`. Keep them in `art/` and add `art/*.fbx` to `.gitignore`.
4. **In-game:** replace the placeholder in `View/PlayerModel.js` with the GLB (`GLTFLoader` + `MeshoptDecoder`), an `AnimationMixer` with crossfades (0.2 s) driven by real speed (idle → walk → run), jump, emote, and board (used at ship boarding). Keep the visor reflection (PMREM env) and the soft contact shadow. Load the GLB during the loading screen; if it fails, fall back to the code-built placeholder (no broken screen).
5. Record the model/animations in `CREDITS.md` (own work, CC0 source, or "Mixamo — Adobe, royalty-free use in projects").

## Part B: the 3 easter eggs (BR-11) — Jefferson can swap any of these
| # | Easter egg | Where / how | Reward |
|---|---|---|---|
| 1 | **Debugging duck** | A small rubber duck hidden on the dark side of The Forge (nod to Jefferson's QA work) | Walk up and press E: the duck squeaks, a short "Bug found!" toast |
| 2 | **Signal from home** | A small antenna dish on the far side of the Home Station; press E | The Philippines beacon on Earth flashes and a toast shows Jefferson's location from `profile.js` |
| 3 | **Secret dance** | Type the Konami code (↑↑↓↓←→←→BA) anywhere on foot | The astronaut plays `emote`, a burst of confetti stars |
- Found state saved in `apeiron.eggs`; a small "x/3" counter appears in the HUD after the first find; finding all 3 shows a short "All secrets found" toast.
- Analytics: `easter_egg_found` with the egg id (BR-10).
- Toast text lives in `sources/content/` (new `eggs.js`); the eggs never show on the phone 2D view.

## Part C: polish
1. **Share image:** a 1200×630 Open Graph image: a render of the Home Station with Earth and the astronaut, with "Jefferson Laspiñas — Full-Stack Developer" (role from `profile.js`) and "Apeiron". Save as `public/media/og-image.webp` (≤ 200 KB) and point the OG/Twitter tags to it. Keep absolute URLs on the current Vercel address (F16).
2. **GDG QA video (F14):** only if Jefferson has given trim timestamps in this session; otherwise leave it.
3. Update `docs/audit.md` and set "Current milestone" in CLAUDE.md to M4.

## Acceptance criteria
- [x] The new astronaut shows everywhere the placeholder was (on foot, intro, boarding), matches the cinematic look, and is ≤ 2.5 MB (Quaternius CC0 astronaut, 10.5k triangles, 509 KB)
- [ ] Idle/walk/run blend smoothly by speed; jump, emote and board play; no foot sliding that's obvious at normal speed (wired and timed to the measured clip ground speeds; the look needs Jefferson's eyes)
- [x] If the GLB fails to load, the placeholder appears instead
- [x] No raw Mixamo/FBX files in `public/`; every asset is in `CREDITS.md`
- [x] All 3 easter eggs work, are remembered after reload, show the x/3 counter, and send analytics (analytics only fires once VITE_GOATCOUNTER_CODE is set)
- [ ] The share image works (check with a link preview, e.g. pasting the URL into Messenger or LinkedIn after publishing)
- [x] ≥ 50 fps on Medium; initial download still ≤ 15 MB (64.8 fps walking; +0.5 MB for the astronaut)
- [x] `npm run build` passes; `npx vite preview` works
- [ ] Jefferson has tested on localhost and committed it himself
