import * as THREE from 'three'

import { moduleFrame, HATCH, HATCH_HALF } from '@/State/InteriorLayout.js'

// Geometry helpers shared by the station's exterior (View/Station.js) and interior
// (View/StationInterior.js). "Module space": x = −u, y = height, z = v along the module's axis
// (State/InteriorLayout.js frames); moduleMatrix() turns it into the layout frame (a rotation about Y).

const UP = new THREE.Vector3(0, 1, 0)

export function moduleMatrix(angle)
{
    const f = moduleFrame(angle)
    return new THREE.Matrix4().makeBasis(new THREE.Vector3(- f.e[0], 0, - f.e[1]), UP, new THREE.Vector3(f.d[0], 0, f.d[1]))
}

// One vertex colour on every vertex (merged per material, coloured per part)
export function paint(geometry, color)
{
    const tint = new THREE.Color(color)
    const colors = new Float32Array(geometry.attributes.position.count * 3)
    for(let i = 0; i < colors.length; i += 3)
        tint.toArray(colors, i)
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geometry
}

// Non-indexed, with uv: every part can be merged with every other
export function finish(geometry)
{
    const result = geometry.index ? geometry.toNonIndexed() : geometry
    if(!result.attributes.uv)
        result.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(result.attributes.position.count * 2), 2))
    if(!result.attributes.normal)
        result.computeVertexNormals()
    return result
}

// Box from u / y / v ranges (module space). uvScale: texture metres per repeat (0: one per face)
export function moduleBox(u0, y0, v0, u1, y1, v1, { color = null, uvScale = 0 } = {})
{
    const w = Math.max(1e-3, Math.abs(u1 - u0))
    const h = Math.max(1e-3, Math.abs(y1 - y0))
    const d = Math.max(1e-3, Math.abs(v1 - v0))
    const geometry = new THREE.BoxGeometry(w, h, d)
    if(uvScale)
    {
        // Faces: +x, −x, +y, −y, +z, −z (4 vertices each)
        const sizes = [ [ d, h ], [ d, h ], [ w, d ], [ w, d ], [ w, h ], [ w, h ] ]
        const uv = geometry.attributes.uv
        for(let f = 0; f < 6; f++)
            for(let i = 0; i < 4; i++)
                uv.setXY(f * 4 + i, uv.getX(f * 4 + i) * sizes[f][0] / uvScale, uv.getY(f * 4 + i) * sizes[f][1] / uvScale)
    }
    geometry.translate(- (u0 + u1) / 2, (y0 + y1) / 2, (v0 + v1) / 2)
    return color ? paint(geometry, color) : geometry
}

// Arc of a cylinder along the module axis (centre height `axis`), the part above height yMin
export function tubeArc(radius, axis, v0, v1, { yMin = - Infinity, segments = 48, uvScale = 0 } = {})
{
    const start = Math.acos(THREE.MathUtils.clamp((axis - yMin) / radius, - 1, 1))
    const length = Math.PI * 2 - start * 2
    const geometry = new THREE.CylinderGeometry(radius, radius, Math.abs(v1 - v0), segments, 1, true, start, length)
    if(uvScale)
    {
        const uv = geometry.attributes.uv
        for(let i = 0; i < uv.count; i++)
            uv.setXY(i, uv.getX(i) * length * radius / uvScale, uv.getY(i) * Math.abs(v1 - v0) / uvScale)
    }
    geometry.rotateX(Math.PI / 2) // (r sin θ, −r cos θ, along): θ = π is the top
    geometry.translate(0, axis, (v0 + v1) / 2)
    return geometry
}

// Ring round the module axis at v (a partial ring above height yMin)
export function hoop(radius, tube, axis, v, { yMin = - Infinity, segments = 48 } = {})
{
    const below = THREE.MathUtils.clamp((axis - yMin) / radius, - 1, 1)
    const lift = Math.asin(below)
    const arc = yMin === - Infinity ? Math.PI * 2 : Math.PI + lift * 2
    const geometry = new THREE.TorusGeometry(radius, tube, 6, segments, arc)
    if(yMin !== - Infinity)
        geometry.rotateZ(- lift)
    geometry.translate(0, axis, v)
    return geometry
}

// Cross-section outline (module space, seen from +v): a circle round height `axis`, cut by the deck,
// with an opening at the bottom: 'hatch' (the round hatch) or { half, height } (the bay door)
export function bulkheadShape(radius, axis, opening = null)
{
    const deck = Math.sqrt(radius * radius - axis * axis)
    const shape = new THREE.Shape()
    shape.moveTo(deck, 0)
    shape.absarc(0, axis, radius, Math.atan2(- axis, deck), Math.atan2(- axis, - deck), false)
    addOpening(shape, opening)
    shape.lineTo(deck, 0)
    return shape
}

// A flat wall panel (half width, height) standing on the deck, with an optional round hatch
export function faceShape(half, height, hatch = false)
{
    const shape = new THREE.Shape()
    shape.moveTo(- half, 0)
    addOpening(shape, hatch ? 'hatch' : null)
    shape.lineTo(half, 0)
    shape.lineTo(half, height)
    shape.lineTo(- half, height)
    shape.lineTo(- half, 0)
    return shape
}

function addOpening(shape, opening)
{
    if(opening === 'hatch')
    {
        shape.lineTo(- HATCH_HALF, 0)
        shape.absarc(0, HATCH.centre, HATCH.radius, Math.atan2(- HATCH.centre, - HATCH_HALF), Math.atan2(- HATCH.centre, HATCH_HALF), true)
    }
    else if(opening)
    {
        shape.lineTo(- opening.half, 0)
        shape.lineTo(- opening.half, opening.height)
        shape.lineTo(opening.half, opening.height)
        shape.lineTo(opening.half, 0)
    }
}

// Shape → geometry at v, facing +v (or −v), with uvs in metres / uvScale
export function shapeAt(shape, v, { facing = 1, uvScale = 1, curveSegments = 32 } = {})
{
    const geometry = new THREE.ShapeGeometry(shape, curveSegments)
    const uv = geometry.attributes.uv
    for(let i = 0; i < uv.count; i++)
        uv.setXY(i, uv.getX(i) / uvScale, uv.getY(i) / uvScale)
    if(facing < 0)
        geometry.rotateY(Math.PI)
    geometry.translate(0, 0, v)
    return geometry
}

// Rails / cables along a module: a thin cylinder from v0 to v1 at (u, y)
export function rod(u, y, v0, v1, radius, color, segments = 6)
{
    const geometry = new THREE.CylinderGeometry(radius, radius, Math.abs(v1 - v0), segments, 1, true)
    geometry.rotateX(Math.PI / 2)
    geometry.translate(- u, y, (v0 + v1) / 2)
    return paint(geometry, color)
}

// Turn a surface inside out (a cylinder you stand in): reversed winding, normals flipped, so a
// FrontSide material draws it from inside (no DoubleSide program)
export function inward(geometry)
{
    const result = geometry.index ? geometry.toNonIndexed() : geometry
    for(const name of Object.keys(result.attributes))
    {
        const attribute = result.attributes[name]
        const size = attribute.itemSize
        const array = attribute.array
        for(let i = 0; i < attribute.count; i += 3)
            for(let k = 0; k < size; k++)
            {
                const a = (i + 1) * size + k
                const b = (i + 2) * size + k
                const swap = array[a]
                array[a] = array[b]
                array[b] = swap
            }
    }
    const normal = result.attributes.normal
    if(normal)
        for(let i = 0; i < normal.array.length; i++)
            normal.array[i] = - normal.array[i]
    return result
}

// Into the layout frame
export function place(geometry, angle)
{
    return geometry.applyMatrix4(moduleMatrix(angle))
}

// Canvas texture helper
export function canvasMap(canvas, { repeat = true, colorSpace = THREE.SRGBColorSpace } = {})
{
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = colorSpace
    if(repeat)
    {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
    }
    texture.anisotropy = 8
    return texture
}
