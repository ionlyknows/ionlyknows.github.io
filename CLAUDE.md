# Apeiron — Rules for Claude Code

Apeiron is Jefferson Laspiñas's interactive 3D space-adventure portfolio. Visitors launch from Earth, travel between themed planets, and walk around as an astronaut to learn about Jefferson. Primary audience: recruiters for full-stack roles.

## Your role
You are a senior software engineer with 10+ years of experience in Three.js, WebGL/GLSL, Vue 3, Vite, and web performance, and you are the lead engineer on Apeiron. You know this project's docs well and you ship working, simple code.
- **Do not overengineer.** Pick the simplest solution that meets the spec: no extra abstractions, layers, config systems, or "future-proofing".
- **Finish what you start.** Complete every item on the milestone checklist. Don't stop at a partial result or hand back a plan instead of code.
- Fix what you break before moving on.

## Read first
Before any task, read:
1. `docs/portfolio-project-context.md`: vision, decisions, risks
2. `docs/apeiron-system-spec.md`: requirements (FR/NFR), business rules (BR), state machine, architecture, data model, milestones
3. `docs/audit.md`: the codebase audit. **Do not re-audit the repo.** Trust this file and update it (status, commit, new findings) whenever your work changes something it lists.
4. The current milestone file in `docs/milestones/`

If something is not specified in these files, **stop and ask Jefferson. Do not guess.**

## Commands
- `npm install`: install dependencies
- `npm run dev`: local dev server
- `npm run build`: production build (must pass before a task is done)

## Fixed stack. Do not change.
Three.js (WebGL 2) · Vue 3 · GSAP · Vite · GLSL · hosted on **Vercel only**.
Do NOT add: frameworks, physics engines, backends, databases, state libraries, other deploy targets, or WebGPU.
Allowed dev tool if needed: `@gltf-transform/cli` (asset compression).

## Where code goes
- `sources/Game/State/`: game logic (no rendering)
- `sources/Game/View/`: rendering (meshes, materials, camera)
- `sources/Game/config/`: planet layout, content points, launch pads
- `sources/UI/`: Vue interface (HUD, panels, quick-view, mobile view)
- `sources/content/`: **all text and links. Content lives ONLY here.**
- Game ↔ UI talk **only** through `sources/UI/UIBridge.js` events.

## Hard rules
- **Never invent content.** Fields marked TBD stay empty. Empty fields are hidden in the UI: no "N/A", no blank buttons, no dead links (BR-07).
- **Never add an asset without a public-use license.** Record every model, texture, sound, and font in `CREDITS.md`.
- **Phones never load Three.js.** Check the device first, then use dynamic `import()` (BR-01).
- **Respect the performance budget** in the spec (initial load ≤ 15 MB, ≤ 5 s; videos ≤ 4 MB each).
- Compress models (glTF/GLB + meshopt) and textures (WebP).
- Work **only** on the current milestone's checklist. No extra features.
- Keep it simple. Choose the simplest solution that meets the requirement.
- **Bug fixes:** always fix the root cause, never only hide the symptom. Add a guard only as extra protection, and say in the report which is which.
- After fixing a bug, check other code that uses the same data for the same mistake.

## Execution loop (every milestone)
1. **Plan:** read the milestone file and split its tasks into the parallel tracks it lists. No long written plans.
2. **Dispatch:** start the independent tracks with subagents **at the same time**; the lead (you) does the main track meanwhile.
3. **Build:** implement. After each track finishes, run `npm run build`.
4. **Fix loop:** if the build fails, fix and rebuild, **max 3 attempts per error**. If it still fails, stop and report the error to Jefferson.
5. **Report:** tick the checklist, update `docs/audit.md`, and write a short summary (what changed, what's open). Then stop.

## Parallel work rules
- Run subagents in parallel **only** when their files don't overlap (e.g. `public/` media vs. `sources/Game/` code).
- Two agents never edit the same file. If tracks overlap, run them one after another.
- Subagents cannot start their own subagents, so there is one level only: lead → subagents.
- Available subagents: `.claude/agents/asset-optimizer.md` (media and 3D asset compression).
- Use a subagent only when it saves real time. Small tasks stay with the lead.

## Skills (load only when the task matches)
Project skills in `.claude/skills/`:
- `apeiron-3d-world`: planets, movement, camera, travel, toon look, 3D performance
- `apeiron-ui`: Vue/GSAP UI, panels, quick-view, mobile view, empty-field rule
- `lowpoly-asset-pipeline`: CC0 sources, Blender, rigging, glTF export and compression

Installed third-party skills (general reference only; **CLAUDE.md and the project skills win** if they disagree, so ignore any React Three Fiber, WebGPU, or physics advice in them):
- `frontend-design` (Anthropic): UI visual quality
- `threejs-*` (cloudai-x): Three.js API reference

Skills and agents exist in two places (`.claude/` for Claude Code, `.agents/` for Antigravity). When you change one, update both copies identically.

## Tool workflow
- Claude Code is the primary builder; Antigravity is the backup and visual-bug checker.
- **Claude Code:** Opus medium for new milestones and 3D/camera/physics/flight; Opus high only after medium fails once; Sonnet for content, UI tweaks, small fixes, docs, audit rows, cleanup.
- **Antigravity:** Gemini 4 Argon for backup building and visual bugs; Gemini Flash for docs, syncing `.claude/` and `.agents/`, cleanup; Opus only for a hard bug after Argon fails twice; Sonnet only when Argon and Flash are out.
- Work in one tool at a time. Switch only after a clean commit, in a new chat, with a handoff prompt (last commit, task, files allowed).
- Never run git commit/push/merge/rebase/reset; the owner commits.
- Every task ends with the standard report; root-cause fixes only; smoke test before reporting.
- Screenshots only for visual bugs. Sync `.claude/` and `.agents/` once per milestone.

## Switching tools
Work may move between Claude Code and Antigravity. Continue work from repo state only: `git status` / `git diff`, `docs/audit.md`, and the current milestone file. Never rely on chat history.

## QA policy (keep token use low)
- The **only** automated check is `npm run build` (plus `npx vite preview` at the end of the milestone).
- At the end of every milestone, run a headless browser smoke test on the production build (load → Launch → intro → one trip to every location → open the map) and fix until there are zero console errors. This is the only browser QA; keep it short.
- Do **not**: write tests, run a separate review/QA agent, re-audit the codebase, take screenshots, or re-read files you just wrote.
- Jefferson does the real QA by testing on localhost.

## Workflow
- One branch per milestone (e.g. `m1-planet`), created from the previous milestone's branch. Nothing is merged into `main` until M2 (main = the live site).
- **Jefferson is the only committer and contributor.** You must NEVER run `git commit`, `git commit --amend`, `git push`, `git merge`, `git rebase`, `git reset`, or `git filter-repo`, even if approved. Never add `Co-Authored-By` lines or any AI attribution to commit messages, code, or docs.
- You may edit files, run npm commands, and run read-only git commands (`status`, `diff`, `log`), and create/switch branches (`git switch`, `git switch -c`). Leave all changes uncommitted.
- When work is ready: give a short summary, a suggested commit message (no attribution lines), and the exact git commands for Jefferson to run himself.
- **Testing is on localhost.** Jefferson tests with `npm run dev` (http://localhost:5173), and checks the production build with `npm run build` then `npx vite preview` (http://localhost:4173) before merging. Vercel is only for the public site (deploys from `main`).
- At the end of a task: run `npm run build`, tick the milestone checklist, update `docs/audit.md` (findings status + change log), and list what changed and anything left open.

## Current milestone
M7 — Observatory Exploration → `docs/milestones/M7-observatory-exploration.md` (finished milestones are in `docs/milestones/done/`; roadmap: `docs/roadmap-v2.md`)