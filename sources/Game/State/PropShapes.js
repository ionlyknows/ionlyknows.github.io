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
function part(geometry, color, mat, { position = [ 0, 0, 0 ], rotation = [ 0, 0, 0 ], scale = [ 1, 1, 1 ] } = {})
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

// Placement of one prop, relative to its planet's center (identical for mesh and collider)
export function propMatrix(prop, index, planetRadius, target = new THREE.Matrix4())
{
    const builder = PROP_BUILDERS[prop.type]
    _quaternion.setFromUnitVectors(_yAxis, prop.up)
    _quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(_yAxis, index * 2.4 + planetRadius))

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
