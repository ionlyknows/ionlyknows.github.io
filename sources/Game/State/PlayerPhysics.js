import * as THREE from 'three'
import { HEAD_HEIGHT } from './PropShapes.js'

// Pure small-planet physics for the astronaut (no rendering, no singletons), stepped at a
// fixed 1/120 s by State/Player.js and by the Node jitter check.
// Gravity points to the planet center; movement, slide and push-out all happen in the
// planet's tangent plane; the radius is restored after every change.

export const FIXED_STEP = 1 / 120
export const MAX_STEPS = 5
export const GRAVITY = 30
export const JUMP_SPEED = 9 // apex ≈ 1.35 m
export const WALK_SPEED = 5
export const RUN_SPEED = 10
export const PLAYER_RADIUS = 0.5
export const TURN_SPEED = 12
export const SKIN = 0.02
const ITERATIONS = 3

const _desired = new THREE.Vector3()
const _normal = new THREE.Vector3()
const _start = new THREE.Vector3()
const _foot = new THREE.Vector3()
const _d = new THREE.Vector3()
const _cross = new THREE.Vector3()
const _right = new THREE.Vector3()
const _toSphere = new THREE.Vector3()

export function createBody()
{
    return {
        position: new THREE.Vector3(),
        up: new THREE.Vector3(0, 1, 0),
        facing: new THREE.Vector3(0, 0, 1),
        velocity: new THREE.Vector3(),
        height: 0,
        verticalVelocity: 0,
        isGrounded: true,
        jumpRequested: false,
        speed: 0
    }
}

// Full physics reset on a planet (spawn and every arrival)
export function resetBody(body, planet, position)
{
    body.position.copy(position)
    body.up.subVectors(body.position, planet.center).normalize()
    body.position.copy(planet.center).addScaledVector(body.up, planet.radius)
    body.velocity.set(0, 0, 0)
    body.height = 0
    body.verticalVelocity = 0
    body.isGrounded = true
    body.jumpRequested = false
    body.speed = 0
}

export function footPoint(body, planet, target)
{
    return target.copy(body.up).multiplyScalar(planet.radius).add(planet.center)
}

function project(body, planet)
{
    body.position.sub(planet.center).setLength(planet.radius + body.height).add(planet.center)
    body.up.subVectors(body.position, planet.center).normalize()
}

// Signed distance from `position` to the collider's footprint (negative = inside) and the
// outward normal, kept in the tangent plane of `up`. Returns Infinity when far away.
// `only` = index of a single part polygon (each part is its own convex constraint).
export function contact(collider, position, up, outNormal, only = - 1)
{
    // Real 3D proximity first: a prop on the far side of the planet projects onto the same
    // tangent coordinates and must never block (this was the source of the invisible walls)
    _d.subVectors(position, collider.center)
    const reach = collider.bound + PLAYER_RADIUS + 1
    if(_d.lengthSq() > reach * reach + HEAD_HEIGHT * HEAD_HEIGHT * 4)
        return Infinity
    const h = _d.dot(collider.axisY)
    if(h < - 1 || h > HEAD_HEIGHT + 1)
        return Infinity

    const x = _d.dot(collider.axisX)
    const z = _d.dot(collider.axisZ)
    if(x * x + z * z > reach * reach)
        return Infinity

    let best = Infinity
    let bestX = 0
    let bestZ = 0

    for(let p = 0; p < collider.polygons.length; p++)
    {
        if(only >= 0 && p !== only)
            continue
        const polygon = collider.polygons[p]
        let inside = true
        let minDistance = Infinity
        let closestX = 0
        let closestZ = 0

        for(let i = 0; i < polygon.length; i++)
        {
            const a = polygon[i]
            const b = polygon[(i + 1) % polygon.length]
            const ex = b[0] - a[0]
            const ez = b[1] - a[1]
            if((ex * (z - a[1]) - ez * (x - a[0])) < 0)
                inside = false

            const t = Math.max(0, Math.min(1, ((x - a[0]) * ex + (z - a[1]) * ez) / (ex * ex + ez * ez)))
            const cx = a[0] + ex * t
            const cz = a[1] + ez * t
            const distance = Math.hypot(x - cx, z - cz)
            if(distance < minDistance)
            {
                minDistance = distance
                closestX = cx
                closestZ = cz
            }
        }

        const signed = inside ? - minDistance : minDistance
        if(signed < best)
        {
            best = signed
            // Outward direction in the prop's frame
            const nx = inside ? closestX - x : x - closestX
            const nz = inside ? closestZ - z : z - closestZ
            const length = Math.hypot(nx, nz)
            bestX = length > 1e-9 ? nx / length : x
            bestZ = length > 1e-9 ? nz / length : z
        }
    }

    outNormal.copy(collider.axisX).multiplyScalar(bestX).addScaledVector(collider.axisZ, bestZ).projectOnPlane(up)
    if(outNormal.lengthSq() < 1e-12)
        outNormal.copy(_d).projectOnPlane(up)
    outNormal.normalize()

    return best
}

// Moving obstacles (M7 scientists, `planet.movers`: { position, r }): out to touching, in the tangent
// plane, like a footprint. Returns whether it moved.
export function resolveMovers(body, planet, radius, foot)
{
    let pushed = false
    for(const mover of planet.movers || [])
    {
        _d.subVectors(foot, mover.position).projectOnPlane(body.up)
        const limit = radius + mover.r + SKIN
        const distance = _d.length()
        if(distance >= limit - 1e-9)
            continue
        if(distance < 1e-9)
            _d.copy(body.facing)
        else
            _d.divideScalar(distance)
        body.position.addScaledVector(_d, limit - distance)
        body.position.sub(planet.center).setLength(planet.radius + body.height).add(planet.center)
        body.up.subVectors(body.position, planet.center).normalize()
        foot.copy(body.up).multiplyScalar(planet.radius).add(planet.center)
        pushed = true
    }
    return pushed
}

// Push the position out of every overlapping footprint (all colliders, up to 3 passes) to
// exactly PLAYER_RADIUS + SKIN. Push-out is in the tangent plane and the radius is restored
// right after, so it never changes the height. For one convex footprint this is the exact
// closest point (smooth sliding, no sawtooth).
function resolve(body, planet)
{
    for(let iteration = 0; iteration < ITERATIONS; iteration++)
    {
        let pushed = false
        for(const collider of planet.colliders)
        {
            for(let p = 0; p < collider.polygons.length; p++)
            {
                // Footprints live on the walking surface: measure from the foot point, so the
                // jump height never leaks into the distance (it used to push the player mid-air)
                footPoint(body, planet, _foot)
                const distance = contact(collider, _foot, body.up, _normal, p)
                if(distance < PLAYER_RADIUS + SKIN - 1e-9)
                {
                    body.position.addScaledVector(_normal, PLAYER_RADIUS + SKIN - distance)
                    project(body, planet)
                    pushed = true
                }
            }
        }
        if(resolveMovers(body, planet, PLAYER_RADIUS, footPoint(body, planet, _foot)))
            pushed = true
        if(!pushed)
            break
    }
}

// One fixed step. input = { forward: Vector3 (camera forward), x, z, run }
export function stepBody(body, planet, input, dt)
{
    body.up.subVectors(body.position, planet.center).normalize()
    body.velocity.set(0, 0, 0)

    const hasInput = input.x !== 0 || input.z !== 0
    if(hasInput)
    {
        _desired.copy(input.forward).projectOnPlane(body.up).normalize()
        _right.crossVectors(_desired, body.up).normalize()
        _desired.multiplyScalar(input.z).addScaledVector(_right, input.x).normalize()
        body.velocity.copy(_desired).multiplyScalar(input.run ? RUN_SPEED : WALK_SPEED)

        _start.copy(body.position)
        body.position.addScaledVector(body.velocity, dt)
        project(body, planet)
        resolve(body, planet)

        // Slide, don't bounce: the resolved position is the closest point outside every prop
        // footprint, so pushing into a prop slides along it (or stops head-on) and never
        // springs back. The real displacement drives speed and animation.
        body.velocity.subVectors(body.position, _start).divideScalar(dt)

        // Facing follows input only, never the collision response
        _cross.crossVectors(body.facing, _desired)
        const angle = Math.atan2(_cross.dot(body.up), body.facing.dot(_desired))
        body.facing.applyAxisAngle(body.up, angle * (1 - Math.exp(- TURN_SPEED * dt)))
    }
    else
    {
        resolve(body, planet)
    }

    // Jump / gravity on the scalar height above the surface (BR-06)
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

        // Grounded hysteresis: land only when coming down and at the surface
        if(body.height <= 0 && body.verticalVelocity <= 0)
        {
            body.height = 0
            body.verticalVelocity = 0
            body.isGrounded = true
        }
    }

    project(body, planet)
    body.facing.projectOnPlane(body.up).normalize()
    body.speed = body.velocity.length()
}

// Distance the camera may sit from `from` along `direction` without entering a prop
export function cameraClearance(planet, from, direction, distance, margin = 0.4)
{
    let allowed = distance
    for(const collider of planet.colliders)
    {
        const { center, radius } = collider.camera
        const r = radius + margin
        _toSphere.subVectors(center, from)
        const along = _toSphere.dot(direction)
        if(along < 0 || along - r > allowed)
            continue
        const perpendicular = _toSphere.lengthSq() - along * along
        if(perpendicular > r * r)
            continue
        if(_toSphere.lengthSq() < r * r)
            continue // the player itself is inside this sphere: ignore it
        const hit = along - Math.sqrt(r * r - perpendicular)
        if(hit < allowed)
            allowed = Math.max(1.5, hit)
    }
    return allowed
}
