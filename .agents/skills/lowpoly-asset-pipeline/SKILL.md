---
name: lowpoly-asset-pipeline
description: How to get, make, rig, export, and compress Apeiron's cute low-poly 3D assets (planets, props, ship, astronaut) using CC0 asset packs, Blender (via the Blender MCP or Blender Python scripts), and gltf-transform. Use when adding or creating any 3D model or animation.
---

# Low-poly asset pipeline

## 1. Source order (fastest first)
1. **CC0 packs:** check these first for planets, rocks, props, ships, and characters: Kenney (kenney.nl), Quaternius (quaternius.com), Poly Pizza (poly.pizza; check each model's own license), and Poly Haven (polyhaven.com, textures/HDRIs). Confirm the license on the asset's own page before using it.
2. **Modify a CC0 asset** in Blender (recolor, combine, simplify) to fit the palette.
3. **Model from scratch** in Blender only when 1–2 don't fit (e.g. the final astronaut mascot, the themed planets).

Never use: Sketchfab or other models without a clear license that allows redistribution, AI-generated 3D models (license and quality are unclear), or anything "free for personal use only".
Record every asset in `CREDITS.md`: name, author, source URL, license.

## 2. Modeling rules (cute low-poly style)
- Triangle budgets: astronaut ≤ 5k, ship ≤ 3k, planet ≤ 8k, small prop ≤ 500, large prop ≤ 1.5k.
- Flat shading, chunky shapes, rounded silhouettes. Exaggerated proportions for the astronaut (big helmet, short body).
- Color with vertex colors or one shared palette texture (e.g. 256×256). No PBR texture sets, no normal maps.
- Real-world scale: 1 unit = 1 m. Origin at the base (props) or at the center (planets).
- Apply all transforms before exporting.

## 3. Astronaut rig
- Humanoid skeleton named like Mixamo (`mixamorig:Hips`, `Spine`, `Head`, `LeftArm`…) so Mixamo animations retarget cleanly.
- Fastest route: model in Blender → upload to Mixamo for auto-rig → download the animations "Without Skin", in place (Idle, Run, Jump, one emote) → combine everything in Blender into **one** GLB, with each action named `idle`, `run`, `jump`, `emote`.
- Ship only the final combined GLB. Never put raw Mixamo `.fbx` files in `public/`.

## 4. Using Blender from Claude Code
- **Blender MCP** (optional, `.mcp.json` in the repo): Jefferson runs Blender with the BlenderMCP addon connected; then the agent can create and modify objects and run Blender Python. Keep the Poly Haven toggle on if needed; leave the Sketchfab and Hyper3D (AI generation) features off.
- **Without the MCP:** write a Blender Python script in `tools/blender/` and run it headless: `blender --background --python tools/blender/make_planet.py`.
- Always save the `.blend` source in `art/` (outside `public/`) so models can be edited later.

## 5. Export and compress
1. Blender → File → Export → glTF 2.0 (`.glb`): include selected objects, apply modifiers, +Y up, compression off (gltf-transform handles it), animations on only for the astronaut and ship.
2. Compress:
   `npx @gltf-transform/cli optimize in.glb public/models/out.glb --compress meshopt --texture-compress webp`
3. Check the size (`ls -lh`) against the budget: all initial 3D assets together ≤ 8 MB.
4. Load in Three.js with `GLTFLoader` + `MeshoptDecoder`.
