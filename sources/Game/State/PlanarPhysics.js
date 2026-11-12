import * as THREE from 'three'

import { GRAVITY, JUMP_SPEED, WALK_SPEED, RUN_SPEED, PLAYER_RADIUS, TURN_SPEED, SKIN } from './PlayerPhysics.js'
import { insideStation } from './InteriorLayout.js'

// Planar walking (M6, the station interior): flat floor at y = 0, gravity −Y, same speeds, jump,
// radius, skin and fixed step as the small-planet physics (State/PlayerPhysics.js). Pure: no
// rendering, no singletons (State/Player.js steps it; the Node walk check runs the same code).
//
// room = { center: Vector3 (scene position of the local origin),
//          segments: [{ ax, az, bx, bz, nx, nz }] (one-sided walls, n = the free side; any direction),
//          circles: [{ x, z, r }] (static), dynamic: [{ x, z, r }] (crew),
//          volumes (the free space, State/InteriorLayout.js: camera clearance) }
// Movement and push-out happen in the local (x, z) plane. Slide, don't bounce: after moving, the
// position is pushed to the closest point at PLAYER_RADIUS + SKIN outside every overlapping
// shape (3 passes, so concave corners between two walls settle exactly). A wall's face pushes along
// its normal; past its ends the end point pushes radially (round convex corners: hatch edges).

const ITERATIONS = 3
const BEHIND = 0.6 // a wall only acts on points in front of it or less than this behind (thin walls, any layout)
const CAMERA_STEP = 0.05
const UP = new THREE.Vector3(0, 1, 0)

const _desired = new THREE.Vector3()
const _right = new THREE.Vector3()
const _cross = new THREE.Vector3()
const _local = { x: 0, z: 0 }

// Push a point (local x, z) of radius `radius` out of every shape. Returns true if it moved.
export function resolvePoint(point, radius, room, { dynamic = true, ignore = null } = {})
{
    let movedAny = false
    const reach = radius + SKIN
    for(let iteration = 0; iteration < ITERATIONS; iteration++)
    {
        let moved = false
        for(const s of room.segments)
        {
            const signed = (point.x - s.ax) * s.nx + (point.z - s.az) * s.nz
            if(signed >= reach - 1e-9 || signed < - BEHIND)
                continue
            const ex = s.bx - s.ax
            const ez = s.bz - s.az
            const t = ((point.x - s.ax) * ex + (point.z - s.az) * ez) / (ex * ex + ez * ez)
            if(t > 0 && t < 1)
            {
                // In front of the face (or just through it): out along the normal
                point.x += s.nx * (reach - signed)
                point.z += s.nz * (reach - signed)
                moved = true
                continue
            }
            // Past an end: round the end point
            const qx = t <= 0 ? s.ax : s.bx
            const qz = t <= 0 ? s.az : s.bz
            const dx = point.x - qx
            const dz = point.z - qz
            const distanceSq = dx * dx + dz * dz
            if(distanceSq >= (reach - 1e-9) * (reach - 1e-9))
                continue
            if(distanceSq < 1e-18)
            {
                point.x = qx + s.nx * reach
                point.z = qz + s.nz * reach
            }
            else
            {
                const distance = Math.sqrt(distanceSq)
                point.x = qx + dx / distance * reach
                point.z = qz + dz / distance * reach
            }
            moved = true
        }
        const circles = dynamic && room.dynamic ? [ room.circles, room.dynamic ] : [ room.circles ]
        for(const list of circles)
        {
            for(const c of list)
            {
                if(c === ignore)
                    continue
                const dx = point.x - c.x
                const dz = point.z - c.z
                const limit = c.r + reach
                const distanceSq = dx * dx + dz * dz
                if(distanceSq >= (limit - 1e-9) * (limit - 1e-9))
                    continue
                const distance = Math.sqrt(distanceSq)
                if(distance < 1e-9)
                    point.x = c.x + limit
                else
                {
                    point.x = c.x + dx / distance * limit
                    point.z = c.z + dz / distance * limit
                }
                moved = true
            }
        }
        if(!moved)
            break
        movedAny = true
    }
    return movedAny
}

// Full reset at a local floor position (entering the interior)
export function resetPlanar(body, room, x, z, facingX = 0, facingZ = 1)
{
    body.position.set(room.center.x + x, room.center.y, room.center.z + z)
    body.up.copy(UP)
    body.facing.set(facingX, 0, facingZ).normalize()
    body.velocity.set(0, 0, 0)
    body.height = 0
    body.verticalVelocity = 0
    body.isGrounded = true
    body.jumpRequested = false
    body.speed = 0
}

function resolveBody(body, room)
{
    _local.x = body.position.x - room.center.x
    _local.z = body.position.z - room.center.z
    resolvePoint(_local, PLAYER_RADIUS, room)
    body.position.x = room.center.x + _local.x
    body.position.z = room.center.z + _local.z
}

// One fixed step. input = { forward: Vector3 (camera forward), x, z, run }
export function stepPlanar(body, room, input, dt)
{
    body.up.copy(UP)
    body.velocity.set(0, 0, 0)
    const startX = body.position.x
    const startZ = body.position.z

    const hasInput = input.x !== 0 || input.z !== 0
    if(hasInput)
    {
        _desired.copy(input.forward).projectOnPlane(UP)
        if(_desired.lengthSq() < 1e-8)
            _desired.copy(body.facing)
        _desired.normalize()
        _right.crossVectors(_desired, UP).normalize()
        _desired.multiplyScalar(input.z).addScaledVector(_right, input.x).normalize()
        const speed = input.run ? RUN_SPEED : WALK_SPEED
        body.position.x += _desired.x * speed * dt
        body.position.z += _desired.z * speed * dt
        resolveBody(body, room)

        // The real displacement drives speed and animation (sliding along a wall is slower)
        body.velocity.set((body.position.x - startX) / dt, 0, (body.position.z - startZ) / dt)

        // Facing follows input only, never the collision response
        _cross.crossVectors(body.facing, _desired)
        const angle = Math.atan2(_cross.dot(UP), body.facing.dot(_desired))
        body.facing.applyAxisAngle(UP, angle * (1 - Math.exp(- TURN_SPEED * dt)))
    }
    else
        resolveBody(body, room) // a crew member may walk into the player: get out of the way

    // Jump / gravity on the height above the floor
    if(body.jumpRequested && body.isGrounded)
    {
        body.verticalVelocity = JUMP_SPEED
        body.isGrounded = false
    }
    body.jumpRequested = false

    if(!body.isGrounded)
    {
        body.verticalVelocity -= GRAVITY * dt
        body.height += body.verticalVelocity * dt
        if(body.height <= 0 && body.verticalVelocity <= 0)
        {
            body.height = 0
            body.verticalVelocity = 0
            body.isGrounded = true
        }
    }

    body.position.y = room.center.y + body.height
    body.facing.y = 0
    body.facing.normalize()
    body.speed = body.velocity.length()
}

// Distance the camera may sit from `from` (scene) along `direction` without leaving the free space
// (the module tubes, the Node, the round hatches: State/InteriorLayout.js), `margin` from every surface
export function planarCameraClearance(room, from, direction, distance, margin = 0.3)
{
    const ox = from.x - room.center.x
    const oy = from.y - room.center.y
    const oz = from.z - room.center.z
    let allowed = distance
    for(let t = CAMERA_STEP; t <= distance; t += CAMERA_STEP)
    {
        if(!insideStation(room.volumes, ox + direction.x * t, oy + direction.y * t, oz + direction.z * t, margin))
        {
            allowed = t - CAMERA_STEP
            break
        }
    }
    return Math.max(0.6, allowed)
}
