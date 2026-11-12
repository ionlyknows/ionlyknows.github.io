import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// Prop geometry shared by the meshes (View/Planet.js) and the colliders (State/Planets.js),
// so every collider comes from the mesh that is actually drawn. Origin on the ground,
// +Y = planet up. Pure data (no rendering): also used by the Node jitter check.

export const HEAD_HEIGHT = 1.9 // anything entirely above this never collides

const _matrix = new THREE.Matrix4()
const _position = new THREE.Vector3()
const _quaternion = new THREE.Quaternion()
const _scale = new THREE.Vector3()
const _euler = new THREE.Euler()
const _yAxis = new THREE.Vector3(0, 1, 0)

export const random = (i, k) =>
{
    const value = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453
    return value - Math.floor(value)
}

// One vertex-colored piece of a prop, drawn with material `mat`
export function part(geometry, color, mat, { position = [ 0, 0, 0 ], rotation = [ 0, 0, 0 ], scale = [ 1, 1, 1 ] } = {})
{
    _matrix.compose(_position.fromArray(position), _quaternion.setFromEuler(_euler.set(...rotation)), _scale.fromArray(scale))
    geometry.applyMatrix4(_matrix)

    const tint = new THREE.Color(color)
    const colors = new Float32Array(geometry.attributes.position.count * 3)
    for(let i = 0; i < colors.length; i += 3)
        tint.toArray(colors, i)
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    return { geometry, mat }
}

// Displaced icosphere, half-buried (origin on the ground)
function rockGeometry()
{
    let geometry = new THREE.IcosahedronGeometry(1, 3)
    geometry.deleteAttribute('uv')
    geometry.deleteAttribute('normal')
    geometry = mergeVertices(geometry)

    const positions = geometry.attributes.position
    const v = new THREE.Vector3()
    for(let i = 0; i < positions.count; i++)
    {
        v.fromBufferAttribute(positions, i).normalize()
        const d = 1
            + 0.2 * Math.sin(v.x * 5.1 + 1.7) * Math.sin(v.y * 4.3 + 0.4) * Math.sin(v.z * 6.2 + 2.1)
            + 0.08 * Math.sin(v.x * 11 + v.z * 9)
            + 0.05 * Math.sin(v.y * 17 + v.x * 13)
        v.multiplyScalar(d)
        v.y *= 0.75
        positions.setXYZ(i, v.x, v.y - 0.25, v.z)
    }

    geometry.computeVertexNormals()
    return geometry
}

// M7 telescope: pivot (top of the fork) and the tube's axis (up and away from the visitor), local
export const TELESCOPE = { pivot: [ 0, 2.05, 0 ], elevation: 55 * Math.PI / 180, top: 2.3 }
TELESCOPE.axis = [ 0, Math.sin(TELESCOPE.elevation), - Math.cos(TELESCOPE.elevation) ]

// A part along the tube: `along` from the pivot, lifted `lift` above the tube's axis
function telescopeTube(along, lift)
{
    const [ px, py, pz ] = TELESCOPE.pivot
    const [ ax, ay, az ] = TELESCOPE.axis
    // above the tube, perpendicular to its axis, toward local +Y
    const ux = 0
    const uy = Math.cos(TELESCOPE.elevation)
    const uz = Math.sin(TELESCOPE.elevation)
    return { position: [ px + ax * along + ux * lift, py + ay * along + uy * lift, pz + az * along + uz * lift ], rotation: [ - (Math.PI / 2 - TELESCOPE.elevation), 0, 0 ] }
}

// M7 science lab: a sample stand's pedestal (the sample sits at about 1.2 m)
export const SAMPLE_HEIGHT = 1.22
function samplePedestal()
{
    return [
        part(new THREE.CylinderGeometry(0.34, 0.4, 0.12, 20), '#9aa0a8', 'metal', { position: [ 0, 0.06, 0 ] }),
        part(new THREE.CylinderGeometry(0.12, 0.16, 0.9, 14), '#eef1f4', 'paint', { position: [ 0, 0.55, 0 ] }),
        part(new THREE.CylinderGeometry(0.3, 0.26, 0.08, 20), '#3d434c', 'metal', { position: [ 0, 1.02, 0 ] }),
        part(new THREE.TorusGeometry(0.29, 0.015, 6, 28), '#5ff2e0', 'glow', { position: [ 0, 1.06, 0 ], rotation: [ Math.PI / 2, 0, 0 ] })
    ]
}

// `scaled` props scale with size; `varied` props get a per-instance non-uniform scale
export const PROP_BUILDERS = {
    rock: { scaled: true, varied: true, build: () => [ { geometry: rockGeometry(), mat: 'rock' } ] },
    crystal: { scaled: true, build: () => [
        part(new THREE.OctahedronGeometry(1, 0), '#ffffff', 'crystal', { position: [ 0, 1.1, 0 ], scale: [ 0.55, 1.8, 0.55 ] }),
        part(new THREE.OctahedronGeometry(0.5, 0), '#ffffff', 'crystal', { position: [ 0.55, 0.4, 0.2 ], rotation: [ 0, 0, - 0.5 ], scale: [ 0.6, 1.4, 0.6 ] }),
        part(new THREE.OctahedronGeometry(0.4, 0), '#ffffff', 'crystal', { position: [ - 0.45, 0.3, - 0.25 ], rotation: [ 0.3, 0, 0.6 ], scale: [ 0.6, 1.3, 0.6 ] })
    ] },
    // Floats above head height, so it never collides
    floatingCrystal: { scaled: true, build: () => [
        part(new THREE.OctahedronGeometry(1, 0), '#ffffff', 'crystal', { position: [ 0, 3.9, 0 ], scale: [ 0.6, 1.5, 0.6 ] }),
        part(new THREE.OctahedronGeometry(0.35, 0), '#ffffff', 'crystal', { position: [ 1, 3, 0.3 ] })
    ] },
    antenna: { build: () => [
        part(new THREE.BoxGeometry(0.9, 0.25, 0.9), '#6b7079', 'metal', { position: [ 0, 0.125, 0 ] }),
        part(new THREE.CylinderGeometry(0.1, 0.14, 3.2, 12), '#d9dde3', 'paint', { position: [ 0, 1.6, 0 ] }),
        part(new THREE.CylinderGeometry(0.9, 0.2, 0.3, 24), '#e8ebef', 'paint', { position: [ 0, 3.1, 0.2 ], rotation: [ - 0.6, 0, 0 ] }),
        part(new THREE.SphereGeometry(0.1, 12, 8), '#ff3b3b', 'glow', { position: [ 0, 3.45, 0 ] })
    ] },
    panel: { build: () => [
        part(new THREE.CylinderGeometry(0.07, 0.07, 1, 10), '#9aa0a8', 'metal', { position: [ 0, 0.5, 0 ] }),
        part(new THREE.BoxGeometry(2.1, 0.06, 1.2), '#8a9098', 'metal', { position: [ 0, 1.02, 0 ], rotation: [ 0.5, 0, 0 ] }),
        part(new THREE.BoxGeometry(2, 0.04, 1.1), '#1a2f5c', 'panel', { position: [ 0, 1.06, 0.02 ], rotation: [ 0.5, 0, 0 ] }),
        part(new THREE.SphereGeometry(0.05, 8, 6), '#7ff9ff', 'glow', { position: [ 0.95, 1.1, 0.5 ] })
    ] },
    telescope: { build: () => [
        part(new THREE.CylinderGeometry(0.5, 0.6, 0.4, 20), '#e8ebef', 'paint', { position: [ 0, 0.2, 0 ] }),
        part(new THREE.CylinderGeometry(0.15, 0.15, 0.9, 12), '#9aa0a8', 'metal', { position: [ 0, 0.8, 0 ] }),
        part(new THREE.CylinderGeometry(0.28, 0.36, 2, 20), '#f4f1ea', 'paint', { position: [ 0, 1.5, 0.4 ], rotation: [ - 0.9, 0, 0 ] }),
        part(new THREE.CylinderGeometry(0.27, 0.27, 0.04, 20), '#2fbfae', 'glow', { position: [ 0, 2.12, - 0.38 ], rotation: [ - 0.9, 0, 0 ] })
    ] },
    monument: { build: () => [
        part(new THREE.BoxGeometry(1.6, 0.4, 1.6), '#5c4a2c', 'polished', { position: [ 0, 0.2, 0 ] }),
        part(new THREE.CylinderGeometry(0.35, 0.55, 2.6, 4), '#e0b04a', 'polished', { position: [ 0, 1.7, 0 ], rotation: [ 0, Math.PI / 4, 0 ] }),
        part(new THREE.ConeGeometry(0.35, 0.5, 4), '#fff0c0', 'polished', { position: [ 0, 3.25, 0 ], rotation: [ 0, Math.PI / 4, 0 ] })
    ] },
    // Easter egg 1 (The Forge): a small rubber duck, below knee height
    duck: { build: () => [
        part(new THREE.SphereGeometry(0.2, 16, 12), '#ffd23f', 'paint', { position: [ 0, 0.17, 0 ], scale: [ 1, 0.8, 1.25 ] }),
        part(new THREE.SphereGeometry(0.13, 16, 12), '#ffd23f', 'paint', { position: [ 0, 0.37, 0.14 ] }),
        part(new THREE.ConeGeometry(0.055, 0.13, 12), '#ff8a1f', 'paint', { position: [ 0, 0.35, 0.3 ], rotation: [ Math.PI / 2, 0, 0 ] }),
        part(new THREE.SphereGeometry(0.022, 8, 6), '#15171a', 'paint', { position: [ 0.065, 0.4, 0.24 ] }),
        part(new THREE.SphereGeometry(0.022, 8, 6), '#15171a', 'paint', { position: [ - 0.065, 0.4, 0.24 ] }),
        part(new THREE.ConeGeometry(0.09, 0.16, 12), '#ffd23f', 'paint', { position: [ 0, 0.24, - 0.25 ], rotation: [ - 1.1, 0, 0 ] })
    ] },
    // Easter egg 2 (Signal Moon): a small antenna dish
    dish: { build: () => [
        part(new THREE.BoxGeometry(0.5, 0.12, 0.5), '#6b7079', 'metal', { position: [ 0, 0.06, 0 ] }),
        part(new THREE.CylinderGeometry(0.06, 0.08, 0.9, 10), '#9aa0a8', 'metal', { position: [ 0, 0.55, 0 ] }),
        part(new THREE.CylinderGeometry(0.5, 0.1, 0.16, 28), '#e8ebef', 'paint', { position: [ 0, 1.05, 0.08 ], rotation: [ - 0.8, 0, 0 ] }),
        part(new THREE.CylinderGeometry(0.02, 0.02, 0.38, 6), '#9aa0a8', 'metal', { position: [ 0, 1.17, 0.21 ], rotation: [ - 0.8, 0, 0 ] }),
        part(new THREE.SphereGeometry(0.05, 10, 8), '#7ff9ff', 'glow', { position: [ 0, 1.3, 0.34 ] })
    ] },
    // M6, The Forge: frame of the featured-build board (the screen is View/ExhibitScreens.js)
    exhibit: { build: () => [
        part(new THREE.BoxGeometry(6.4, 3.8, 0.22), '#3d434c', 'metal', { position: [ 0, 2.75, 0 ] }),
        part(new THREE.BoxGeometry(0.3, 1.3, 0.3), '#2f343b', 'metal', { position: [ - 2.6, 0.35, 0 ] }),
        part(new THREE.BoxGeometry(0.3, 1.3, 0.3), '#2f343b', 'metal', { position: [ 2.6, 0.35, 0 ] }),
        part(new THREE.BoxGeometry(6.2, 0.06, 0.08), '#ff9d5c', 'glow', { position: [ 0, 0.82, 0.12 ] })
    ] },
    // M6, The Observatory: the goals console (the screen is View/ExhibitScreens.js)
    console: { build: () => [
        part(new THREE.BoxGeometry(1.8, 0.95, 0.75), '#e8ebef', 'paint', { position: [ 0, 0.47, 0 ] }),
        part(new THREE.BoxGeometry(1.9, 1.15, 0.12), '#3d434c', 'metal', { position: [ 0, 1.45, - 0.1 ], rotation: [ - 0.35, 0, 0 ] }),
        part(new THREE.BoxGeometry(1.7, 0.05, 0.05), '#7ff9ec', 'glow', { position: [ 0, 0.96, 0.36 ] })
    ] },
    // M7, The Observatory: the big telescope. Local +Z faces the visitor; the tube points up and
    // away (−Z) along TELESCOPE.axis from the fork's pivot; the telescope view looks out of its top end
    observatoryTelescope: { build: () => [
        part(new THREE.CylinderGeometry(0.95, 1.1, 0.5, 28), '#c9ced6', 'paint', { position: [ 0, 0.25, 0 ] }),
        part(new THREE.CylinderGeometry(0.32, 0.42, 1.1, 18), '#e8ebef', 'paint', { position: [ 0, 1.05, 0 ] }),
        part(new THREE.BoxGeometry(1.5, 0.18, 0.5), '#9aa0a8', 'metal', { position: [ 0, 1.6, 0 ] }),
        part(new THREE.BoxGeometry(0.14, 0.75, 0.42), '#9aa0a8', 'metal', { position: [ 0.68, 1.95, 0 ] }),
        part(new THREE.BoxGeometry(0.14, 0.75, 0.42), '#9aa0a8', 'metal', { position: [ - 0.68, 1.95, 0 ] }),
        part(new THREE.CylinderGeometry(0.5, 0.5, 3.4, 28), '#f4f1ea', 'paint', telescopeTube(0.5, 0)),
        part(new THREE.CylinderGeometry(0.56, 0.56, 0.22, 28), '#2a9d8f', 'paint', telescopeTube(1.95, 0)),
        part(new THREE.CylinderGeometry(0.47, 0.47, 0.03, 28), '#5ff2e0', 'glow', telescopeTube(2.21, 0)),
        part(new THREE.CylinderGeometry(0.09, 0.09, 1.1, 10), '#3d434c', 'metal', telescopeTube(0.9, 0.62)),
        part(new THREE.CylinderGeometry(0.06, 0.06, 0.35, 10), '#3d434c', 'metal', telescopeTube(- 1.25, 0))
    ] },
    // M7, The Observatory: the science lab hut (closed; +Z faces the sample stands) with the scanner
    // on its front
    labHut: { build: () => [
        part(new THREE.BoxGeometry(4, 0.2, 3), '#9aa0a8', 'metal', { position: [ 0, 0.1, 0 ] }),
        part(new THREE.BoxGeometry(3.8, 2.4, 2.8), '#eef1f4', 'paint', { position: [ 0, 1.4, 0 ] }),
        part(new THREE.BoxGeometry(4.1, 0.18, 3.2), '#2a9d8f', 'paint', { position: [ 0, 2.69, 0 ] }),
        part(new THREE.BoxGeometry(1.0, 1.9, 0.06), '#3d434c', 'metal', { position: [ - 1.1, 1.15, 1.42 ] }), // door
        part(new THREE.BoxGeometry(1.5, 0.6, 0.05), '#5ff2e0', 'glow', { position: [ 0.75, 1.75, 1.42 ] }), // window
        part(new THREE.BoxGeometry(1.1, 0.9, 0.5), '#3d434c', 'metal', { position: [ 0.75, 0.65, 1.62 ] }), // scanner
        part(new THREE.BoxGeometry(0.8, 0.04, 0.05), '#5ff2e0', 'glow', { position: [ 0.75, 0.95, 1.88 ] }), // scanner slot
        part(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8), '#c9ced6', 'metal', { position: [ 1.5, 3.35, - 0.8 ] }),
        part(new THREE.SphereGeometry(0.07, 10, 8), '#ff3b3b', 'glow', { position: [ 1.5, 3.98, - 0.8 ] })
    ] },
    // M7, The Observatory: the radio dish (+Z faces the visitor; the dish looks up and away) with its
    // tuner console in front
    radioDish: { build: () => [
        part(new THREE.CylinderGeometry(0.8, 1.0, 0.4, 24), '#9aa0a8', 'metal', { position: [ 0, 0.2, - 0.6 ] }),
        part(new THREE.CylinderGeometry(0.22, 0.3, 2.6, 14), '#e8ebef', 'paint', { position: [ 0, 1.6, - 0.6 ] }),
        part(new THREE.BoxGeometry(0.9, 0.3, 0.5), '#9aa0a8', 'metal', { position: [ 0, 2.95, - 0.6 ] }),
        // Bowl (the bottom cap of a 1.9 m sphere, 2.6 m across), its lowest point on the mount, open
        // up and away along (0, 0.73, −0.68); double-sided (seen from below and from above)
        part(new THREE.SphereGeometry(1.9, 32, 10, 0, Math.PI * 2, Math.PI - 0.75, 0.75), '#f4f1ea', 'cloth', { position: [ 0, 4.39, - 1.9 ], rotation: [ - 0.75, 0, 0 ] }),
        part(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8), '#9aa0a8', 'metal', { position: [ 0, 3.55, - 1.11 ], rotation: [ - 0.75, 0, 0 ] }), // feed
        part(new THREE.SphereGeometry(0.1, 12, 8), '#5ff2e0', 'glow', { position: [ 0, 4.1, - 1.62 ] }),
        part(new THREE.BoxGeometry(1.2, 0.9, 0.6), '#eef1f4', 'paint', { position: [ 0, 0.45, 0.9 ] }),
        part(new THREE.BoxGeometry(1.25, 0.6, 0.1), '#3d434c', 'metal', { position: [ 0, 1.15, 0.78 ], rotation: [ - 0.4, 0, 0 ] }),
        part(new THREE.BoxGeometry(0.9, 0.05, 0.05), '#5ff2e0', 'glow', { position: [ 0, 0.92, 1.21 ] })
    ] },
    // M7 sample stands (rock / crystal on a pedestal); the planet's own rock and crystal materials
    sampleRock: { build: () => [ ...samplePedestal(), part(new THREE.DodecahedronGeometry(0.22, 0), '#ffffff', 'rock', { position: [ 0, 1.2, 0 ], rotation: [ 0.4, 0.7, 0.2 ], scale: [ 1.2, 0.8, 1 ] }) ] },
    sampleCrystal: { build: () => [ ...samplePedestal(), part(new THREE.OctahedronGeometry(0.2, 0), '#ffffff', 'crystal', { position: [ 0, 1.3, 0 ], scale: [ 0.7, 1.5, 0.7 ] }) ] },
    // M6: where a worker stands (collider only; the worker is drawn by View/CrewModels.js)
    worker: { build: () => [
        part(new THREE.CylinderGeometry(0.4, 0.4, 1.8, 12), '#000000', 'hidden', { position: [ 0, 0.9, 0 ] })
    ] },
    banner: { build: () => [
        part(new THREE.CylinderGeometry(0.05, 0.05, 3, 10), '#c9ced6', 'metal', { position: [ 0, 1.5, 0 ] }),
        part(new THREE.BoxGeometry(1.2, 0.7, 0.03), '#b3263f', 'cloth', { position: [ 0.62, 2.5, 0 ] }),
        part(new THREE.SphereGeometry(0.08, 12, 8), '#ffcf5a', 'polished', { position: [ 0, 3.05, 0 ] }) // gold finial, not emissive
    ] }
}

// Beacon / launch pad meshes. Only the beacon base collides (launch pads are flat).
export const MARKER_SHAPES = {
    base: () => new THREE.CylinderGeometry(1.1, 1.3, 0.3, 32),
    pad: () => new THREE.CylinderGeometry(1.9, 2, 0.16, 48)
}

// The ship (M3): built in code, +Z = nose, +Y = up, origin under the belly on the pad.
// Materials: paint (hull + orange accents), metal, glass (canopy), glow (engine + nav lights).
// Shared by View/Ship.js (meshes) and State/Planets.js (the parked ship's collider).
const HULL = '#eeeae2'
const ACCENT = '#ff7a2e'
const STEEL = '#5b616b'
export const SHIP_SHAPE = {
    hatch: [ 0, 1.0, 0.3 ], // where the astronaut boards (local)
    engine: [ 0, 0.95, - 2.15 ], // engine exit (local)
    build: () => [
        // Landing skids and struts
        part(new THREE.BoxGeometry(0.12, 0.1, 2.4), STEEL, 'metal', { position: [ 0.75, 0.05, - 0.1 ] }),
        part(new THREE.BoxGeometry(0.12, 0.1, 2.4), STEEL, 'metal', { position: [ - 0.75, 0.05, - 0.1 ] }),
        part(new THREE.BoxGeometry(0.08, 0.5, 0.08), STEEL, 'metal', { position: [ 0.62, 0.32, 0.6 ], rotation: [ 0, 0, - 0.35 ] }),
        part(new THREE.BoxGeometry(0.08, 0.5, 0.08), STEEL, 'metal', { position: [ - 0.62, 0.32, 0.6 ], rotation: [ 0, 0, 0.35 ] }),
        part(new THREE.BoxGeometry(0.08, 0.5, 0.08), STEEL, 'metal', { position: [ 0.62, 0.32, - 0.8 ], rotation: [ 0, 0, - 0.35 ] }),
        part(new THREE.BoxGeometry(0.08, 0.5, 0.08), STEEL, 'metal', { position: [ - 0.62, 0.32, - 0.8 ], rotation: [ 0, 0, 0.35 ] }),
        // Fuselage (capsule along Z, a little flattened) with an orange band
        part(new THREE.CapsuleGeometry(0.55, 2.4, 8, 24), HULL, 'paint', { position: [ 0, 0.95, 0 ], rotation: [ Math.PI / 2, 0, 0 ], scale: [ 1, 1, 0.82 ] }),
        part(new THREE.CylinderGeometry(0.565, 0.565, 0.2, 32), ACCENT, 'paint', { position: [ 0, 0.95, - 0.55 ], rotation: [ Math.PI / 2, 0, 0 ], scale: [ 1, 1, 0.83 ] }),
        // Canopy
        part(new THREE.SphereGeometry(0.42, 28, 16), '#1b2230', 'glass', { position: [ 0, 1.27, 0.8 ], scale: [ 0.82, 0.6, 1.5 ] }),
        // Swept wings with orange tips
        part(new THREE.BoxGeometry(1.7, 0.08, 1.0), '#e6e2da', 'paint', { position: [ 1.15, 0.82, - 0.45 ], rotation: [ 0, 0.25, - 0.06 ] }),
        part(new THREE.BoxGeometry(1.7, 0.08, 1.0), '#e6e2da', 'paint', { position: [ - 1.15, 0.82, - 0.45 ], rotation: [ 0, - 0.25, 0.06 ] }),
        part(new THREE.BoxGeometry(0.16, 0.14, 0.9), ACCENT, 'paint', { position: [ 1.98, 0.77, - 0.68 ], rotation: [ 0, 0.25, 0 ] }),
        part(new THREE.BoxGeometry(0.16, 0.14, 0.9), ACCENT, 'paint', { position: [ - 1.98, 0.77, - 0.68 ], rotation: [ 0, - 0.25, 0 ] }),
        // Tail fin
        part(new THREE.BoxGeometry(0.08, 0.72, 0.85), ACCENT, 'paint', { position: [ 0, 1.5, - 1.3 ], rotation: [ - 0.35, 0, 0 ] }),
        // Engine housing + glowing exit
        part(new THREE.CylinderGeometry(0.42, 0.5, 0.55, 28), STEEL, 'metal', { position: [ 0, 0.95, - 1.86 ], rotation: [ Math.PI / 2, 0, 0 ] }),
        part(new THREE.CylinderGeometry(0.34, 0.34, 0.04, 28), '#ffb46b', 'glow', { position: [ 0, 0.95, - 2.14 ], rotation: [ Math.PI / 2, 0, 0 ] }),
        // Nav lights: red on the port wing (+X), green on starboard (-X)
        part(new THREE.SphereGeometry(0.07, 10, 8), '#ff3b3b', 'glow', { position: [ 2.08, 0.8, - 0.7 ] }),
        part(new THREE.SphereGeometry(0.07, 10, 8), '#3bff7a', 'glow', { position: [ - 2.08, 0.8, - 0.7 ] })
    ]
}

// M7 rover (The Observatory), built in code: +Z = front, +Y = up, origin on the ground under its
// middle. `body` = everything that rides on the suspension (View/Rover.js bobs and leans it), the six
// `wheels` spin (local centres). Shared by the meshes and the parked rover's collider.
const ROVER_WHITE = '#eef1f4'
const ROVER_TEAL = '#2a9d8f'
const ROVER_DARK = '#3d434c'
export const ROVER_SHAPE = {
    wheelRadius: 0.38,
    wheels: [ - 0.95, 0.95 ].flatMap((x) => [ - 0.95, 0, 0.95 ].map((z) => [ x, 0.38, z ])),
    seat: [ 0, 1.05, - 0.2 ], // where the driver sits (local)
    body: () => [
        part(new THREE.BoxGeometry(1.6, 0.42, 2.5), ROVER_WHITE, 'paint', { position: [ 0, 0.78, 0 ] }),
        part(new THREE.BoxGeometry(1.64, 0.08, 2.54), ROVER_TEAL, 'paint', { position: [ 0, 0.6, 0 ] }),
        part(new THREE.BoxGeometry(1.2, 0.08, 0.5), ROVER_DARK, 'metal', { position: [ 0, 1.03, - 0.2 ] }), // seat
        part(new THREE.BoxGeometry(1.2, 0.5, 0.08), ROVER_DARK, 'metal', { position: [ 0, 1.28, - 0.47 ] }), // seat back
        part(new THREE.BoxGeometry(0.9, 0.35, 0.35), ROVER_DARK, 'metal', { position: [ 0, 1.15, 0.85 ], rotation: [ - 0.4, 0, 0 ] }), // console
        part(new THREE.BoxGeometry(1.5, 0.08, 0.08), ROVER_DARK, 'metal', { position: [ 0, 1.0, 1.25 ] }), // light bar
        part(new THREE.BoxGeometry(1.3, 0.05, 0.05), '#fff1cf', 'glow', { position: [ 0, 1.0, 1.3 ] }),
        part(new THREE.CylinderGeometry(0.025, 0.025, 1.4, 8), '#c9ced6', 'metal', { position: [ 0.6, 1.7, - 1.0 ] }), // antenna mast
        part(new THREE.CylinderGeometry(0.3, 0.06, 0.08, 18), ROVER_WHITE, 'paint', { position: [ 0.6, 2.45, - 1.0 ], rotation: [ - 0.5, 0, 0 ] }), // dish
        part(new THREE.SphereGeometry(0.05, 8, 6), '#ff3b3b', 'glow', { position: [ - 0.65, 1.05, - 1.22 ] }),
        ...[ - 0.95, 0.95 ].map((x) => part(new THREE.BoxGeometry(0.12, 0.1, 2.3), ROVER_DARK, 'metal', { position: [ x * 0.86, 0.5, 0 ] })) // suspension rails
    ],
    wheel: () => [
        // one material (vertex colours): one draw per wheel
        part(new THREE.CylinderGeometry(0.38, 0.38, 0.3, 18), '#2b2f36', 'paint', { rotation: [ 0, 0, Math.PI / 2 ] }),
        part(new THREE.CylinderGeometry(0.2, 0.2, 0.32, 6), ROVER_TEAL, 'paint', { rotation: [ 0, 0, Math.PI / 2 ] })
    ],
    // Everything at rest, for the parked rover's collider
    build: () => [ ...ROVER_SHAPE.body(), ...ROVER_SHAPE.wheels.flatMap((centre) => ROVER_SHAPE.wheel().map((item) => { item.geometry.translate(...centre); return item })) ]
}

const PAD_TOP = 0.16 // pad thickness (MARKER_SHAPES.pad)

// Where a ship rests on a launch pad: on top of the pad, nose toward the landing point
export function shipRestPose(launchPad, landingPoint, target = { position: new THREE.Vector3(), quaternion: new THREE.Quaternion(), up: new THREE.Vector3(), forward: new THREE.Vector3() })
{
    target.up.copy(launchPad.up)
    target.position.copy(launchPad.position).addScaledVector(target.up, PAD_TOP)
    target.forward.subVectors(landingPoint, launchPad.position).projectOnPlane(target.up)
    if(target.forward.lengthSq() < 1e-6)
        target.forward.set(1, 0, 0).projectOnPlane(target.up)
    target.forward.normalize()
    _matrix.makeBasis(_right.crossVectors(target.up, target.forward), target.up, target.forward)
    target.quaternion.setFromRotationMatrix(_matrix)
    return target
}
const _right = new THREE.Vector3()
const _faceX = new THREE.Vector3()
const _faceZ = new THREE.Vector3()
const _faceMatrix = new THREE.Matrix4()

// Placement of one prop, relative to its planet's center (identical for mesh and collider)
export function propMatrix(prop, index, planetRadius, target = new THREE.Matrix4())
{
    const builder = PROP_BUILDERS[prop.type]
    if(prop.face)
    {
        // Turned so local +Z points along `face` (a tangent direction)
        _faceZ.copy(prop.face).projectOnPlane(prop.up).normalize()
        _faceX.crossVectors(prop.up, _faceZ).normalize()
        _quaternion.setFromRotationMatrix(_faceMatrix.makeBasis(_faceX, prop.up, _faceZ))
    }
    else
    {
        _quaternion.setFromUnitVectors(_yAxis, prop.up)
        _quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(_yAxis, index * 2.4 + planetRadius))
    }

    const size = builder.scaled ? prop.size : 1
    if(builder.varied)
        _scale.set(size * (0.85 + 0.3 * random(index, 1)), size * (0.65 + 0.35 * random(index, 2)), size * (0.85 + 0.3 * random(index, 3)))
    else
        _scale.setScalar(size)

    _position.copy(prop.up).multiplyScalar(planetRadius)
    return target.compose(_position, _quaternion, _scale)
}

// Andrew's monotone chain, counter-clockwise, in the prop's (x, z) plane
function convexHull(points)
{
    if(points.length < 3)
        return null

    const sorted = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1])
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    const lower = []
    for(const p of sorted)
    {
        while(lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 1e-9)
            lower.pop()
        lower.push(p)
    }
    const upper = []
    for(let i = sorted.length - 1; i >= 0; i--)
    {
        const p = sorted[i]
        while(upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 1e-9)
            upper.pop()
        upper.push(p)
    }
    const hull = lower.slice(0, - 1).concat(upper.slice(0, - 1))
    return hull.length >= 3 ? hull : null
}

// Collider from the real mesh: the convex footprint of all the geometry that lies between the
// walking surface (h = 0) and head height, in the prop's tangent frame. One hull per prop:
// separate per-part hulls left small concave creases the player could rattle in.
// Returns null when nothing is in that band (decorative or above head height).
// `keepTriangles` also returns the clipped triangles (used to verify "no invisible walls").
export function buildCollider(parts, matrix, center, { keepTriangles = false } = {})
{
    const origin = new THREE.Vector3().setFromMatrixPosition(matrix)
    const quaternion = new THREE.Quaternion()
    matrix.decompose(new THREE.Vector3(), quaternion, new THREE.Vector3())
    const axisX = new THREE.Vector3(1, 0, 0).applyQuaternion(quaternion)
    const axisY = new THREE.Vector3(0, 1, 0).applyQuaternion(quaternion)
    const axisZ = new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion)

    const polygons = []
    const triangles = []
    const v = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ]
    const local = [ [ 0, 0, 0 ], [ 0, 0, 0 ], [ 0, 0, 0 ] ] // x, h, z
    const all = new THREE.Box3()

    const points = []
    for(const { geometry } of parts)
    {
        const positions = geometry.attributes.position
        const index = geometry.index
        const count = index ? index.count : positions.count

        for(let i = 0; i < count; i += 3)
        {
            for(let k = 0; k < 3; k++)
            {
                v[k].fromBufferAttribute(positions, index ? index.getX(i + k) : i + k).applyMatrix4(matrix)
                all.expandByPoint(v[k])
                v[k].sub(origin)
                local[k][0] = v[k].dot(axisX)
                local[k][1] = v[k].dot(axisY)
                local[k][2] = v[k].dot(axisZ)
            }

            let inBand = false
            for(let k = 0; k < 3; k++)
            {
                const a = local[k]
                const b = local[(k + 1) % 3]
                if(a[1] >= - 1e-3 && a[1] <= HEAD_HEIGHT)
                {
                    points.push([ a[0], a[2] ])
                    inBand = true
                }
                for(const plane of [ 0, HEAD_HEIGHT ])
                {
                    if((a[1] - plane) * (b[1] - plane) < 0)
                    {
                        const t = (plane - a[1]) / (b[1] - a[1])
                        points.push([ a[0] + (b[0] - a[0]) * t, a[2] + (b[2] - a[2]) * t ])
                        inBand = true
                    }
                }
            }

            if(keepTriangles && inBand)
                triangles.push(local.map((p) => [ p[0], p[2] ]))
        }
    }

    const hull = convexHull(points)
    if(hull)
        polygons.push(hull)

    if(!polygons.length)
        return null

    let bound = 0
    for(const polygon of polygons)
        for(const p of polygon)
            bound = Math.max(bound, Math.hypot(p[0], p[1]))

    // Camera keeps out of this sphere (covers the whole prop, not just the walking band)
    const sphere = all.getBoundingSphere(new THREE.Sphere())

    return {
        center: origin.clone().add(center), // scene space (moves with the floating origin)
        axisX,
        axisY,
        axisZ,
        polygons,
        bound,
        camera: { center: sphere.center.add(center), radius: sphere.radius },
        triangles: keepTriangles ? triangles : null
    }
}
