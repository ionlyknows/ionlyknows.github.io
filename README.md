# Apeiron

**Jefferson Laspiñas's interactive 3D space-adventure portfolio.**

*Apeiron* (Greek: "the boundless") is a small universe you explore: launch from Earth, travel between themed planets, and walk around as an astronaut to learn who Jefferson is, what he has built, and what he has achieved. A quick-view overlay keeps projects and contact details two clicks away for recruiters.

[**Live site**](https://field-notes-xi-eight.vercel.app/)

> Status: in development. Milestone M0 (cleanup) leaves an empty space scene with a starfield, a placeholder capsule player, and the About / Work / Settings panels. Planets, travel and the astronaut arrive in later milestones.

## Tech stack
Three.js (WebGL 2) · Vue 3 · GSAP · Vite · GLSL · hosted on Vercel

## Run locally
```powershell
npm install
npm run dev        # http://localhost:5173
```

Production build:
```powershell
npm run build
npx vite preview   # http://localhost:4173
```

Add `#debug` to the URL for the debug panel, stats, and the fly camera (`V`).

## Project structure
```
sources/
  index.js        # boot
  content/        # ALL editable text and links (profile, projects, skills, achievements, activities, contact)
  Game/           # Three.js: State (logic) / View (rendering) / Debug
  UI/             # Vue: App, UIBridge, components, panels
public/
  media/          # project videos + posters, certificates, social images
  Prelim/         # class web pages linked from Activities
```

To update content, edit the files in `sources/content/`. Empty fields are hidden automatically.

## Deployment
Vercel only: every push to `main` deploys to production, and every branch gets a preview URL.

## Credits
Built on [Infinite World](https://github.com/brunosimon/infinite-world) by Bruno Simon. See [CREDITS.md](CREDITS.md).

## License
[MIT](LICENSE) © Jefferson F. Laspiñas
