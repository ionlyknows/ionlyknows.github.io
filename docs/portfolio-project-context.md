# Apeiron — Jefferson Laspiñas's Space Adventure Portfolio
**Project Context Document (source of truth)**
Status: Phase 1 — Project Discovery **complete, pending Jefferson's sign-off** (v0.5, 2026-11-10)
Legend: **[CONFIRMED]** decided by Jefferson · **[PROPOSED]** Claude's recommendation, awaiting approval · **[ASSUMED]** working assumption, needs checking · **[UNRESOLVED]** open question · **[TBD]** intentionally left empty, Jefferson fills in later

---

## 1. Vision
**Apeiron** (Greek: "the boundless") is an interactive 3D space adventure where visitors explore Jefferson's personal universe — launching from Earth, travelling set routes between themed planets, landing, and walking around as an astronaut mascot — to learn who he is, what he has built, and what he has achieved. [CONFIRMED name]

**One-line goal:** *Get Jefferson full-stack internships and jobs by making his portfolio memorable, while never making a recruiter work to find the important information.*

## 2. Goal & success criteria
| # | Criterion | Status |
|---|---|---|
| G1 | Primary goal: internships/jobs; primary audience: recruiters and hiring managers | [CONFIRMED] |
| G1a | Target role: **full-stack developer** | [CONFIRMED] |
| G2 | Quick-view "Skip the adventure" 2D overlay; projects and contact reachable in **≤ 2 clicks / ≤ 30 s** | [CONFIRMED] |
| G3 | First interactive frame in **≤ 5 s** on an average connection; initial download ≤ ~15 MB | [PROPOSED] |
| G4 | ~60 fps on a mid-range laptop | [PROPOSED] |
| G5 | All 3D assets/art original or licensed for public use (current character must be replaced) | [CONFIRMED need] |
| G6 | Finish ASAP; M2 is the first public version | [CONFIRMED: ASAP] / [PROPOSED: M2 = launch] |

## 3. Audience & team
- **Primary:** recruiters / hiring managers for full-stack roles. [CONFIRMED]
- **Secondary:** developers and the creative community. [ASSUMED]
- **Tertiary:** classmates, instructors, friends. [ASSUMED]
- **Team:** Jefferson alone, building with **Claude Code (main agent + subagents)** from a plan and goals. [CONFIRMED]

## 4. Experience concept
- **Theme:** space adventure. [CONFIRMED]
- **Hometown = Earth.** Earth is the home planet; the Home Station orbits it. [CONFIRMED] A pin/beacon on the Philippines (the location already shown in About). [PROPOSED]
- **Travel:** fly + land + walk. Cinematic launch between planets first (M2), pilotable ship later (M3). [CONFIRMED]
- **Flight style:** set routes with a little freedom (steer within a corridor, cannot get lost). [CONFIRMED]
- **Visual style:** cute, low-poly, colorful (toon shading). [CONFIRMED]
- **Planets:** themed. [CONFIRMED] Themes below. [PROPOSED]
- **Quick-view overlay:** always-visible button on desktop. [CONFIRMED]
- **Phones:** plain 2D quick-view only, plus a notice suggesting desktop for the full experience. [CONFIRMED]
- **Sound:** on by default with mute toggle. [CONFIRMED] Audio starts when the visitor clicks **Launch** on the loading screen (browsers block audio before any interaction). [PROPOSED]
- **Easter eggs:** 3 hidden secrets. [CONFIRMED] Scheduled for M4. [PROPOSED]

### Locations & sections — [PROPOSED]
| Location | Theme | Content |
|---|---|---|
| Earth + Home Station (spawn) | Low-poly Earth with an orbital station; Philippines beacon | About, education, GDG roles/experience, currently learning, contact beacon |
| The Forge | Volcanic workshop planet | Work: all projects; featured ones larger, the rest as an archive |
| The Observatory | Planet with telescopes and floating tech-stack crystals | Skills / tech stack |
| The Trophy Moon | Small moon with monuments and banners | Achievements (certificates) + Activities (class web pages) |

### Skills (from the repo) — [CONFIRMED source: repo]
Taken from `about.js` plus what the portfolio code itself uses:
- **Languages:** Java, JavaScript, HTML5, CSS3, SQL (basic), GLSL
- **Frameworks / libraries:** Vue 3, Three.js, GSAP, Java Swing
- **Tools:** Git, GitHub, VS Code, Vite, Figma, Canva, Photoshop
- **Networking & IT:** hardware servicing, LAN/WAN configuration, network troubleshooting, system maintenance, technical support
- **Professional:** UI/UX design, QA, responsive web design
- Current About headline: "Frontend-Backend Developer". [CONFIRMED in repo]

### Projects (The Forge)
- All projects are included. [CONFIRMED]
- Payroll System: **launch the portfolio first, add Payroll when it is finished.** [CONFIRMED — Claude's reading of "finish this first and add later"; correct if wrong]
- Missing project details are **left empty for now and filled in later by Jefferson.** [CONFIRMED]

| Project | Role | Stack | Links | Status |
|---|---|---|---|---|
| Onsite Event Registration System | Developer | Java, Swing, JSON (desktop) | repo + demo video | Completed [repo data] |
| GDG on Campus Website QA | QA Tester | Manual testing, Figma, DevTools | demo video | Live [repo data] |
| Interactive 3D Portfolio (Apeiron) | Creative Developer | Three.js, Vue, GSAP | [TBD] (current links point to old `Yknowjeff` account) | Live [repo data] |
| Sourcerer Crusade | [TBD] | [TBD] | [TBD] | [TBD] |
| Requisito | [TBD] | [TBD] | [TBD] | [TBD] |
| Payroll System | [TBD] | [TBD] | [TBD] | Unfinished — added after launch |

**Business rule — empty fields** [PROPOSED]
- An empty field is **hidden** in the UI: no "N/A", no "Coming soon", no blank button, no dead link.
- A project with an empty role/stack still shows its title and summary.
- A project with no media shows a themed placeholder image.
- A project with no title/summary is not shown at all (it stays in the data file, ready to be filled).
- Filling in a field later is a data-only change (`projects.js`); no code changes needed.

Data inconsistencies found: `projects.js` leaves the Onsite stack empty while `about.js` lists Java/Swing/JSON; "Guilds.png" is the GDG QA image, not a separate project. Project data should live in one file only. [PROPOSED]

### Contact
- Email, GitHub, LinkedIn, Facebook. [CONFIRMED]
- Personal professional email, not the school address. [PROPOSED]
- Resume: none yet; slot hidden until it exists (same empty-field rule). [CONFIRMED]

## 5. Scope
**In scope (v1)** — [PROPOSED]
- Earth + Home Station + 3 themed planets
- Cinematic launch travel (M2), then set-route flight + landing (M3)
- Walking on spherical planet surfaces
- Astronaut mascot: idle, run, jump, emote
- Interactive content points opening the Vue panels
- Quick-view overlay; phone 2D view with desktop notice
- Loading screen with Launch button, sound + mute, quality setting
- 3 easter eggs (M4)
- Analytics (free, privacy-friendly)

**Out of scope (v1)**
- Backend, database, CMS, accounts, multiplayer, AI chatbot [PROPOSED]
- 3D on phones [CONFIRMED]
- Resume download until a resume exists [CONFIRMED]
- Custom domain [CONFIRMED]
- GitHub Pages mirror — Vercel only [CONFIRMED]
- WebGPU — stay on WebGL for v1 [PROPOSED]

## 6. Delivery plan — [CONFIRMED order: cinematic first, flight later]
Milestones are gated by acceptance criteria, not calendar dates (build is done with Claude Code agents).

| Milestone | Outcome |
|---|---|
| M0 Cleanup | Remove infinite-world terrain code, placeholder character, fix asset weight, LICENSE/credits, remove GitHub Pages workflow, single project data file, new scene skeleton |
| M1 Walkable planet | One planet with spherical gravity, astronaut walking, one content point opening a panel |
| M2 Full system + launch travel | Earth/Station + 3 planets, all content, quick-view, phone 2D view, analytics → **first public version** |
| M3 Flight | Set-route ship flight, landing/takeoff |
| M4 Character & polish | Final astronaut mascot, toon shading, sound, 3 easter eggs |
| M5 Final launch | Performance budget verified, Payroll added when ready, final deploy |

**Speed strategy** — [PROPOSED]
- CC0 (public-domain) low-poly space assets for planets, props, ship; license checked per asset.
- CC0 or generated astronaut placeholder now; final mascot in M4.

**Agent build workflow** — [PROPOSED]
- Repo gets a `CLAUDE.md` summarizing this document: stack, folder rules, conventions, performance budget, do-not-touch list.
- Each milestone gets a short spec with acceptance criteria before any agent starts coding.
- One main Claude Code session per milestone; subagents only for independent tasks (e.g., asset optimization vs. UI panels).
- Agents must never invent project content; [TBD] fields stay empty.
- Jefferson reviews and tests in the browser at the end of every milestone; agents do not merge without that check.

## 7. Current codebase (repo `ionlyknows/ionlyknows.github.io`) — [CONFIRMED by code review]
- Stack: Three.js (WebGL), Vue 3, GSAP, Vite, GLSL; VRM character via `@pixiv/three-vrm` + Mixamo FBX animations. Keep this stack. [CONFIRMED]
- Hosting: Vercel only. [CONFIRMED]
- Built on Bruno Simon's *Infinite World*.
- **Reuse:** Vue UI layer, content data (`about.js`, `projects.js`), VRM/Mixamo retargeting (if the new character is humanoid-rigged), stars shader.
- **Replace:** infinite terrain, chunks, grass, water, terrain workers, day cycle.
- **Known issues:**
  - `character.vrm` ("おばけ" by だっすー), downloaded free [CONFIRMED]; license forbids redistribution → **must be replaced before public launch**. [CONFIRMED need]
  - No LICENSE file; Infinite World's license notice may be required. [UNRESOLVED]
  - Heavy assets: project videos 20–32 MB each; `Idle.fbx` 30 MB.
  - Stale links to the old `Yknowjeff` GitHub account.

## 8. Risks
| Risk | Mitigation |
|---|---|
| "ASAP" vs fly + land + walk + original character | M2 is the public launch; flight and final mascot follow |
| No finished full-stack project at launch | Show backend/QA roles clearly; add Payroll when done |
| Recruiters bounce | Quick-view overlay, always-visible button |
| Game gimmick overshadows skills | Observatory (skills) + architecture on project cards |
| Agents invent behavior or content | `CLAUDE.md` + milestone specs; [TBD] fields stay empty |
| Empty project fields look unfinished | Empty-field rule: hide, never show placeholders like "N/A" |
| Bottlenecks agents can't remove (art, content, testing) | CC0 assets; Jefferson's browser review per milestone |
| Performance | Asset budget, compressed glTF/KTX2, phones use 2D |
| Licensing | Replace character, add LICENSE, verify CC0 assets |

## 9. Decisions log
| Date | Decision | Status |
|---|---|---|
| 2026-11-10 | Personal portfolio ("Walking Gallery" name dropped) | CONFIRMED |
| 2026-11-10 | Theme: space adventure | CONFIRMED |
| 2026-11-10 | Goal: internships/jobs, target role full-stack | CONFIRMED |
| 2026-11-10 | Travel: fly + land + walk; cinematic launch first, ship later | CONFIRMED |
| 2026-11-10 | Flight: set routes with a little freedom | CONFIRMED |
| 2026-11-10 | Style: cute low-poly, colorful; themed planets | CONFIRMED |
| 2026-11-10 | Quick-view overlay + ≤ 2 clicks / 30 s rule | CONFIRMED |
| 2026-11-10 | Phones: plain 2D + desktop notice | CONFIRMED |
| 2026-11-10 | Sound on by default with mute; 3 easter eggs | CONFIRMED |
| 2026-11-10 | All projects included; Payroll added after launch | CONFIRMED |
| 2026-11-10 | Missing project details (Sourcerer Crusade, Requisito, Payroll, 3D Portfolio links) left empty, filled later | CONFIRMED |
| 2026-11-10 | Contact: email, GitHub, LinkedIn, Facebook; no resume yet | CONFIRMED |
| 2026-11-10 | Hometown = Earth | CONFIRMED |
| 2026-11-10 | Skills list taken from the repo | CONFIRMED |
| 2026-11-10 | Character: astronaut mascot; current VRM replaced | CONFIRMED |
| 2026-11-10 | Keep stack; Vercel only; no custom domain; analytics yes | CONFIRMED |
| 2026-11-10 | Name: **Apeiron** | CONFIRMED |
| 2026-11-10 | Build with Claude Code agents + subagents, goal-driven | CONFIRMED |

## 10. Open questions (carried into Phase 2)
1. Final mascot creation method (placeholder first is proposed).
2. Analytics tool that supports tracking which projects are opened.
3. LICENSE for Infinite World-derived code (largely removed in M0 anyway).
4. Approve the empty-field business rule.
