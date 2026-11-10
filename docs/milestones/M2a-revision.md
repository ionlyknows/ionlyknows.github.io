# M2a Revision — Cinematic Look, Lighting and Collision Fix

**Branch:** stay on `m2a-world` (not committed yet)
**Model / effort:** Opus, **high**
**Why:** Jefferson tested M2a. The scene is far too bright, High/Medium don't look good, the planets should look like **cinematic space, not low-poly**, and the astronaut shakes when walking into rocks or props.

> **Style decision changed (approved by Jefferson, 2026-11-10):** the visual style is now **cinematic, polished space**, replacing "cute low-poly, toon shading". This overrides spec §6 "Visual direction", the context doc §4 "Visual style", and the "Look" section of the `apeiron-3d-world` skill (already updated). Everything else in the spec still applies, including the performance budget.

## 1. Fix the shaking (collision jitter), most important
Cause to look for: each frame the player moves into a prop collider and is then pushed back out, so movement and push-out fight each other (plus the model/camera follows that jitter).
- **Slide, don't bounce:** before applying movement, if the next position is inside a collider, remove the part of the velocity that points into the collider (project the velocity onto the tangent plane of the collider's surface normal, which is itself kept tangent to the planet). Resolve the overlap **once** per frame, after movement, with a tiny skin (0.02).
- Re-project onto the planet radius **after** collision resolution, not before.
- Never let collision change the player's facing direction; facing follows input only.
- Smooth the visual model and the camera target (position lerp ~0.25/frame at 60 fps, frame-rate independent) so tiny corrections don't show.
- Test: run straight into a rock at full speed, then hold the key: the astronaut must stop or slide smoothly with **zero** visible shake, also on the planet's underside.

## 2. Lighting and exposure (too bright)
- `renderer.toneMapping = ACESFilmicToneMapping`, exposure ≈ **0.75** (tune so the sunlit side isn't blown out).
- **Real space lighting:** one strong directional sun with a **real dark side** (the sun no longer follows the player). Fill light is a very weak cool hemisphere/ambient (≈ 0.05–0.1) so the night side stays readable but dark. To keep content readable, the landing point and every content point/launch pad sit on the **day side**, and beacons have their own small point light.
- Space background: near-black with subtle stars and one soft nebula (a large sphere with a procedural fbm noise shader, low intensity). Not bright navy.
- Bloom: threshold ≈ **0.85**, strength ≈ **0.5**, radius ≈ 0.4, so only beacons, the sun and emissive details glow. Beacons are less intense than now.

## 3. Cinematic planets (replace low-poly)
- High-detail spheres (`SphereGeometry` ~128×128 on High, 64×64 on Medium, 32×32 far away) with `MeshStandardMaterial` (PBR).
- Surface detail from **CC0 textures** (ambientCG or Poly Haven: rock, lava rock, regolith, metal) applied with triplanar mapping in an `onBeforeCompile` shader, so there's no UV seam at the poles. Albedo + normal + roughness, max 2K, WebP. Plus a noise-based color variation so the surface isn't repetitive.
- Per-location look:
  - **Home Station:** grey regolith moon with metal station structures (panels, antenna, lights).
  - **The Forge:** dark volcanic rock with glowing orange lava cracks (emissive mask from noise).
  - **The Observatory:** teal-tinted icy rock, crystal clusters with refraction-like glossy material.
  - **The Trophy Moon:** pale gold/sand moon, polished metal monuments.
- **Atmosphere:** keep the fresnel rim but make it a soft scattering glow (stronger at the limb, thin, accent-colored), plus a thin cloud layer on Earth.
- **Earth:** real continents from a **public-domain NASA Blue Marble** texture (day map + a night-lights map on the dark side + clouds), max 2K. Keep the Philippines beacon at its real coordinates. Record the source in CREDITS.md.
- **Props:** replace the flat purple rocks with textured PBR rocks (displaced icosphere with the same triplanar rock material), smaller and more varied, half-buried in the ground.
- **Walking surface:** the planet surface stays a smooth sphere for walking (visual detail via normal maps only), so movement stays simple.

## 4. Astronaut polish (still the code-built placeholder until M4)
- PBR materials: off-white fabric suit (roughness ~0.8), orange accents, **reflective dark gold visor** (metalness 1, roughness 0.1, reflects an environment map). Add soft contact shadow under the feet.
- Environment map: a small generated `PMREMGenerator` env from the space scene, so metals and the visor look real.

## 5. Quality levels (fix High and Medium)
| | Low | Medium | High |
|---|---|---|---|
| Pixel ratio | 1 | min(dpr, 1.5) | min(dpr, 2) |
| Planet detail | 32 seg | 64 seg | 128 seg |
| Textures | 1K | 1K | 2K |
| Shadows | off | 1024, PCF | 2048, PCFSoft |
| Post-processing | none | bloom (half res) + tone mapping | bloom + vignette + light grain + color grading |
| Anti-aliasing | renderer MSAA | MSAA render target (samples 4) | MSAA render target (samples 4) or SMAA pass |
| Nebula / clouds | off | on | on |
- With the EffectComposer, the default MSAA is lost, so use a `WebGLRenderTarget` with `samples: 4` (or an SMAA pass). No jagged edges on Medium or High.
- Keep the auto-drop (fps < 45 for 3 s → one level down).

## 6. Budget (unchanged)
Initial download ≤ 15 MB (textures count!), ≤ 5 s to interactive, ≥ 50 fps on Medium on Jefferson's laptop. Load the 2K textures for High lazily after Launch; start with 1K.

## 7. Housekeeping
- Update CREDITS.md with every texture (name, source URL, license).
- Update docs/audit.md (change-log row; note the style change).
- Do not touch content files except where needed.

## Acceptance criteria
- [ ] No shaking at all when running into or along rocks and props, on any part of any planet
- [ ] The scene is no longer overexposed; planets have a real day side and dark side; content and launch pads are on the day side
- [ ] Planets look like cinematic space (PBR, textured, atmospheric), not low-poly; Earth has real continents, night lights and clouds
- [ ] Bloom only on beacons, sun and emissive details
- [ ] Low/Medium/High look clearly different, with no jagged edges on Medium/High
- [ ] ≥ 50 fps on Medium; initial download ≤ 15 MB
- [x] `npm run build` passes; `npx vite preview` works
