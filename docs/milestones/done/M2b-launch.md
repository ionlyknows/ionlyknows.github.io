# M2b — Launch-Ready

**Goal:** make Apeiron ready to replace the live site: the recruiter quick-view, the phone 2D view, sound, final settings, analytics, a Vite upgrade, and a final performance and license check. After this, Jefferson merges into `main` himself and Vercel publishes Apeiron.
**Branch:** `m2b-launch`, created from `m2a-world`
**Model / effort:** Opus, **medium**
**Spec references:** FR-08–FR-14, FR-17, BR-01, BR-02, BR-07, BR-09, BR-10, NFR-02–NFR-06, NFR-08, O1–O5, spec §6 S5–S7 · Skill: `apeiron-ui`

## Tasks
1. **Phone and no-WebGL boot (BR-01, NFR-03):** `sources/index.js` checks the device first. Phones/tablets (`pointer: coarse` AND `hover: none`) and browsers without WebGL 2 load **only** the Vue 2D view; Three.js and everything in `sources/Game/` are loaded with dynamic `import()` on desktop only. Verify in the build output that the phone path doesn't download the Three.js chunk.
2. **Quick-view (S5, FR-08–FR-10):** an always-visible "Skip the adventure" button on desktop (HUD top-right and on the loading screen). It opens one scrollable page: header (name, role, contact buttons) → featured projects → project archive → skills → achievements → activities → about → footer with credits. The 3D scene pauses (not destroyed) while it's open; "Back to the adventure" returns to the previous state (or READY if never launched). `/#quick` opens it directly.
3. **Mobile 2D view (S6):** the same sections as quick-view without the back button, plus a dismissible notice: "For the full space adventure, visit on a desktop."
4. **Sound (FR-12, BR-02):** one ambient music loop (≤ 1.5 MB, `.mp3`) and a few small SFX (launch/warp, panel open, beacon). **CC0 only** (e.g. Kenney, OpenGameArt or Freesound filtered to CC0); record each in `CREDITS.md`. Nothing plays before the Launch click. On by default, mute toggle always visible, `M` key, choice saved in `apeiron.settings`. Audio files load after Launch, not during the initial load.
5. **Settings (S7, FR-13):** Quality (Low/Medium/High), Sound volume, Mute, and "Replay intro" (clears `apeiron.introSeen`). Keep the M2a auto-drop behaviour.
6. **Analytics (FR-17, BR-10):** a small `Game/Analytics.js` wrapper `track(event, data)`. Tool: **GoatCounter** (free, privacy-friendly, supports custom events). The site code comes from `VITE_GOATCOUNTER_CODE`; if it's empty, analytics does nothing (no errors). Events: `launch`, `quickview_open` (button/url/mobile), `location_visit`, `project_open`, `contact_click`, `certificate_open`. No personal data.
7. **Vite upgrade (F-audit vulnerabilities):** upgrade Vite and its plugins (`@vitejs/plugin-vue`, `vite-plugin-glsl`) to the latest stable versions that work together. Fix anything the upgrade breaks. Then `npm audit` should show no high-severity issues in production dependencies.
8. **Meta and sharing:** page title "Apeiron — Jefferson Laspiñas", description from `profile.js`, Open Graph image = `3d-portfolio.webp` until Jefferson provides a new one. Favicon stays.
9. **Credits and license check (O4, NFR-08):** `CREDITS.md` lists every asset, sound and font with source and license; any CC-BY credit also appears in the quick-view footer.
10. **Final performance pass (O2, O3):** initial download ≤ 15 MB, interactive ≤ 5 s on "Fast 4G" throttling, ≥ 50 fps on Jefferson's laptop. Report the measured numbers.
11. **GDG QA video (F14):** only if Jefferson has given trim timestamps in this session, trim and re-encode it (≤ 4 MB). Otherwise leave it.
12. Update `docs/audit.md` and set "Current milestone" in CLAUDE.md to M2b.

## Acceptance criteria
- [x] On a phone (or DevTools mobile emulation + reload) only the 2D view loads, with the desktop notice; the Three.js chunk is not requested
- [x] With WebGL disabled, the 2D view loads automatically
- [x] "Skip the adventure" opens quick-view from the loading screen and from the world; projects and contact are reachable in ≤ 2 clicks; `/#quick` works; "Back" returns to the right place
- [ ] Sound starts only after Launch; mute and volume work and persist; `M` toggles mute
- [ ] Settings: quality, volume, mute, replay intro all work and persist
- [x] Analytics events appear in GoatCounter (or do nothing silently if no code is set)
- [x] Vite upgraded; `npm audit --omit=dev` shows no high-severity issues
- [x] `CREDITS.md` complete; empty fields hidden everywhere (BR-07)
- [x] O1–O5 pass, with measured numbers reported
- [x] `npm run build` passes; `npx vite preview` works
- [ ] Jefferson has tested on localhost, committed, and merged into `main` himself
