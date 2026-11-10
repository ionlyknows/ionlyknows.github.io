---
name: apeiron-ui
description: Apeiron's Vue 3 + GSAP UI rules: HUD, panels, quick-view, mobile 2D view, settings, design tokens, empty-field hiding, and accessibility. Use for any work in sources/UI/ or sources/content/.
---

# Apeiron UI (Vue 3 Composition API, GSAP, plain CSS with tokens)

Project rules in CLAUDE.md win. No UI frameworks, no Tailwind, no state libraries.

## Who it's for
Recruiters first: they must reach projects and contact in ≤ 2 clicks / ≤ 30 s (O1). Every UI choice serves scanning speed: clear headings, short text, obvious buttons.

## Visual direction (spec §6)
- Cute low-poly space theme. Rounded "glass" panels over the 3D scene: `backdrop-filter: blur(12px)`, a semi-transparent deep navy background, 16–20 px radius.
- Accent per location: Earth/Station blue-green, Forge orange, Observatory teal, Trophy Moon gold. All colors and spacing come from `sources/UI/styles/tokens.css`; never hard-code a color in a component.
- One display font for headings and one readable sans for body text. Body ≥ 16 px.
- Text contrast WCAG AA (4.5:1) on top of the blur, including the 2D views.

## Components
- Every panel uses `PanelShell.vue` (title, close button, Esc to close, focus trap, returns focus on close).
- Screens: Loading (S1), HUD (S2), Destination picker (S3), Panels (S4), Quick-view (S5), Mobile 2D (S6), Settings (S7). See spec §6 for the contents of each.
- Quick-view (S5) and Mobile 2D (S6) share the same section components; Mobile just drops the "Back to the adventure" button and adds the desktop notice.
- Content comes only from `sources/content/*.js`. Components never contain hard-coded portfolio text.

## Empty fields (BR-07), the most important UI rule
Use one helper everywhere:
```js
export const has = (v) => Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && String(v).trim() !== ''
```
- `v-if="has(project.repoUrl)"` on every optional element, including its label and wrapper.
- A project without media shows the themed placeholder. A project without a title or summary is filtered out before rendering.
- Never show "N/A", "TBD", "Coming soon", an empty `href`, or an empty section header.

## Motion (GSAP)
- Panels: fade + 12 px rise, 0.25 s, `power2.out`. Close is 0.15 s.
- Quick-view open: 0.3 s. No bouncing, no long intros. UI must never block input longer than 0.3 s.
- `prefers-reduced-motion`: opacity-only transitions.
- Kill tweens in `onBeforeUnmount`.

## Game ↔ UI
- Listen and emit only through `UIBridge` (`panel:open`, `state:change`, `location:change`, `settings:change`).
- While a panel or quick-view is open, the game is in `PANEL_OPEN` / `QUICK_VIEW` and ignores movement input (BR-04). The UI emits the state change; it doesn't touch game objects.

## Accessibility (NFR-04, NFR-05)
- Every button is a `<button>` with a visible label or `aria-label`. Visible focus ring.
- Keyboard: Esc closes the top panel, Tab cycles inside the open panel, M toggles mute.
- Videos: `preload="none"`, a poster, `controls`, and no autoplay with sound.

## Phones (BR-01)
- `sources/index.js` decides phone vs. desktop **before** importing anything from `Game/`. The mobile path imports only the Vue 2D view.
