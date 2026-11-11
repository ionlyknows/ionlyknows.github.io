# M2a — The Full World

**Goal:** all four locations exist and are walkable, every section of content is reachable in-world, and the visitor can travel between locations with a cinematic launch. Starts with a Loading screen, a Launch button and an intro fly-in.
**Branch:** `m2a-world`, created from `m1-planet`
**Model / effort:** Opus, **high**
**Spec references:** FR-01, FR-02, FR-05–FR-07, FR-15, FR-16, BR-03–BR-05, BR-08, spec §5 state machine, §6 screens S1–S4 · Skills: `apeiron-3d-world`, `apeiron-ui`
**Not in M2a (comes in M2b):** quick-view, the phone 2D view, sound, final settings, analytics, Vite upgrade, merge to main.

## Decisions for this milestone
- **Home Station = a small walkable planetoid** (radius ~14) with station props (antenna, panels, a landing pad), reusing the M1 sphere walking. **Earth** is a big, non-walkable low-poly globe in the background near the station, with a small glowing beacon on the Philippines.
- All four locations reuse the same `Planet` + `Player` code; only config (radius, color, props, content points) differs.
- Only the planet the player is on runs updates; the others are just visible meshes.
- Props are built in code (as in M1). No downloaded models yet.

## Locations (config in `sources/Game/config/planets.js`)
| id | Name | Look | Content points → panel |
|---|---|---|---|
| `station` | Home Station | small grey/white planetoid, antenna, solar panels, Earth nearby | `about` → About, `contact` → Contact (beacon/signal tower) |
| `forge` | The Forge | orange volcanic planet, rocks and crystals (from M1) | `work` → Work |
| `observatory` | The Observatory | teal planet, telescopes, floating crystals | `skills` → Skills |
| `trophy` | The Trophy Moon | small gold moon, monuments, banners | `achievements` → Achievements, `activities` → Activities |

Spawn: the visitor starts at the Home Station.

## Cinematic direction (approved by Jefferson: camera, effects, transitions, story & pacing)
Inspired by the *techniques* of samsy.ninja, never its look. Do **not** copy: red neon/cyberpunk city, CRT scanlines, Japanese UI text, his character, his layout. Apeiron stays cute, low-poly and colorful (deep navy space, warm planet accents).

**Story & pacing (opening sequence, ~12–15 s, skippable at any moment with a visible "Skip" button and Esc):**
1. Black → stars fade in → title card "APEIRON" with a small subtitle "the boundless".
2. Camera drifts past Earth (Philippines beacon pulsing) → second title: "Jefferson Laspiñas" + role from `sources/content/profile.js` (no hard-coded text).
3. Camera swoops down to the Home Station and settles behind the astronaut → titles fade → **in-world control hints**: soft glowing key icons (WASD, Shift, Space, E) floating near the astronaut, which fade out once the player has moved for ~2 s.
Returning visitors (`apeiron.introSeen` in localStorage) and `prefers-reduced-motion` get a 3 s short version.
The title "APEIRON" and subtitle "the boundless" go into `sources/content/profile.js` as `site: { title, subtitle }`; this is approved content.

**Camera moves:**
- Intro: one GSAP timeline on a `CatmullRomCurve3`, eased, with a slight FOV change (wider during the swoop).
- Arrival on a planet: a short orbiting "establishing shot" (≈2 s) of the planet before settling behind the astronaut.
- Focus shot: when a content point is used, the camera eases toward the beacon (0.6 s) before the panel opens; it eases back on close.
- Idle: after 8 s without input, a very slow camera drift around the astronaut. Any input cancels it.

**Transitions:**
- Loading → Launch: the Launch button fades in; clicking it fades the UI out and starts the opening sequence (no hard cut).
- Travel: lift-off → **warp effect** (stars stretch into streaks: scale the star points along the view direction + FOV kick) → arrival flash fade → establishing shot.
- Panels: GSAP fade/rise (apeiron-ui skill) while the 3D scene dims behind them.

**Visual effects (keep the budget):**
- Post-processing with `EffectComposer` from `three/examples/jsm`: `UnrealBloomPass` (glow on beacons, stars, the Earth beacon, crystals; run at half resolution), plus one final custom pass for vignette + subtle film grain + color grading (warm highlights, cool shadows). ACES tone mapping.
- Planet atmospheres: a slightly larger back-face sphere with a fresnel rim shader in each planet's accent color.
- Light distance fog so far planets feel deep.
- **No** depth of field (too expensive), **no** scanlines.
- Quality setting: Low = no post-processing, Medium = bloom only, High = all. If fps < 45 for 3 s, drop one quality level automatically.

All cinematic code lives in `View/` (post-processing in `View/PostProcessing.js`, sequences in `View/Cinematics.js`). Text shown in titles comes only from `sources/content/`.

## Tasks
1. **Locations:** add station, observatory and trophy to the config, keep forge. Space them far enough apart that each feels like its own world but neighbours are visible in the sky. Earth as a non-walkable background globe with the Philippines beacon.
2. **Panels:** use the existing About and Work panels. Add **Skills**, **Achievements** (with the certificate viewer and credential link, FR-16), **Activities** and **Contact** panels built on `PanelShell.vue`, reading only from `sources/content/`. Apply the empty-field rule (BR-07).
3. **Launch pads:** one per location. Interacting (E/click within 3 units) opens the **Destination picker** (S3): cards for the other locations with a one-line description.
4. **Travel (BR-05):** a `State/Travel.js` + `View/TravelCinematic.js` GSAP timeline: lift-off → curved flight between planets → landing, 4–6 s total (1.5 s with `prefers-reduced-motion`). Can't be interrupted. Ends at the destination's landing point facing its main content point. State `TRAVELING`, input locked.
5. **HUD (S2):** location name top-left, a collapsible location list (left) that travels with the same animation (FR-07), controls hint bottom-left that fades after 10 s, and the interaction prompt.
6. **Loading → Launch → Intro (S1, FR-01, FR-02):** a loading screen with an Apeiron title and real progress; when assets are ready, a **Launch** button; clicking it plays a short camera fly-in to the Home Station, then `ON_FOOT`. States `LOADING`, `READY`, `INTRO` added to the state machine.
7. **Featured projects (BR-08):** the Work panel lists `featured: true` projects first, in `order`.
8. **Performance:** keep the spec §10 budget. Distant planets use lower-detail geometry, shadows only on the current planet. Check `#debug` stats.
9. **Cinematics:** implement everything in "Cinematic direction" above.
10. Update `docs/audit.md` (change-log row, new findings if any) and set "Current milestone" in CLAUDE.md to M2a.

## Acceptance criteria
- [ ] The opening sequence plays (titles, Earth pass, swoop to the station, in-world control hints) and can be skipped any time; returning visitors get the short version
- [ ] Travel shows the warp effect and an establishing shot on arrival; content points use the focus shot; idle drift starts after 8 s
- [ ] Bloom, vignette, grain, color grading and planet atmospheres are visible on High; Low turns post-processing off; auto quality drop works
- [ ] The site opens on the loading screen; Launch appears when ready; the intro ends with the astronaut on the Home Station
- [ ] All four locations are walkable all the way around; Earth is visible from the station with the Philippines beacon
- [ ] Every content point opens the right panel: About, Contact, Work, Skills, Achievements (certificates open with a credential link), Activities
- [ ] Empty fields are hidden in every new panel
- [ ] Launch pads open the destination picker; travel plays smoothly and lands at the right spot; input is locked during travel
- [ ] The HUD location list travels to any location; the location name updates
- [ ] With reduced motion turned on in the OS, travel is short
- [ ] ≥ 50 fps on Jefferson's laptop during a full tour
- [x] `npm run build` passes; `npx vite preview` works
- [ ] Jefferson has tested on localhost and committed it himself
