import * as THREE from 'three'

import { SHIP_SHAPE, shipRestPose } from './PropShapes.js'

// Flight between two planets (M3), as pure data + fixed steps: no rendering, no singletons
// (State/Flight.js runs it in the game; the Node route check runs the same code).
//
// Phases: boarding (1 s) → takeoff (2 s) → flying (steerable) → landing (3 s) → establish (1.6 s).
// M6b Apeiron Station: routes start and end at a gate on the hangar's bay axis. Take-off lifts off
// the hangar pad and glides out through the bay door; the landing is the automatic docking
// sequence (approach along the route's last part onto the bay axis, 1.6–5 s by speed, then ≈ 3.4 s
// straight in through the door, a 180° turn above the pad, touchdown nose to the door). "Fly it yourself" hands over to it like any
// landing. The intro's arrival (createArrival) is the same docking from a point in space.
// Autopilot (M5): the same route and phases, no steering, a faster cruise (≈ 8 s from take-off to
// touchdown) that slows down before the landing so the landing starts at its own speed.
// The ship follows a route curve; the player moves inside a corridor around it. The offset is
// stored in corridor units (`n`, inside the unit disk) and scaled by the corridor radius at the
// current distance, so the corridor can widen after take-off and close before landing without
// ever clamping the ship (no kinks, no wall).

export const FIXED_STEP = 1 / 120
export const MAX_STEPS = 12
export const CORRIDOR_RADIUS = 25
export const LANDING_DISTANCE = 60 // route distance left when the automatic landing starts
export const DURATIONS = { boarding: 1, takeoff: 2, landing: 3, establish: 1.6 }
export const BOOST = 1.6
export const SLOW = 0.7
export const SHIP_RADIUS = 2.2

const FLIGHT_TIME = 13 // s of steering at normal speed (+ 2 s take-off + 3 s landing ≈ 18 s)
const AUTO_FLIGHT_TIME = 3.2 // s of cruise on autopilot (+ accel/decel + 2 s take-off + 3 s landing ≈ 8.5 s)
const AUTO_ACCEL = 90 // units/s²
const AUTO_DECEL = 80 // units/s²
export const AUTO_LANDING_SPEED = 40 // units/s when the landing starts (below its cap: no speed jump)
const TAKEOFF_HEIGHT = 12
const CLIMB = { up: 20, out: 35 } // route leaves the pad climbing at ~30°
// Station: leave out along the bay axis, then a gentle turn; arrive straight along the axis (the
// docking then starts on it, not beside the station)
const GATE = { height: 10, climb: { up: 40, out: 15 }, arrive: { up: 40, out: 0 } }
export const DOCKING = { approach: 2.2, approachMin: 1.6, approachMax: 5, glide: 1.9, settle: 1.5, alignSpeed: 9 } // s, units/s
const CORRIDOR_RAMP_IN = 70 // corridor widens over the first 70 units
const CORRIDOR_RAMP_OUT = 90 // and closes over the 90 units before the landing starts
const STEER_SPEED = 14 // units/s of sideways motion at full input
const STEER_RESPONSE = 3.5 // 1/s
const EDGE_START = 0.6 // soft edge from 60% of the corridor
const EDGE_PULL = 0.45 // corridor units/s pulled back at the edge
const SPEED_RESPONSE = 1.8 // 1/s
const BANK = 0.5 // rad at full sideways speed
const FRAME_SAMPLES = 1024
const FRAME_SMOOTHING = 48 // samples each side (triangle filter)
const SCENIC_RANGE = 120 // a planet/Earth within this of the straight path gets a close pass
const SCENIC_GAP = 30 // corridor edge ↔ scenic surface
const SCENIC_SPAN = 0.2 // a scenic body's closest point must lie in the middle 60% of the way
const CLEARANCE = 15 // corridor edge ↔ any other surface
const HANDLE = 0.4 // Bézier handle length × segment chord

const _a = new THREE.Vector3()
const _b = new THREE.Vector3()
const _c = new THREE.Vector3()
const _d = new THREE.Vector3()
const _matrix = new THREE.Matrix4()
const _quaternion = new THREE.Quaternion()
const _yAxis = new THREE.Vector3(0, 1, 0)
const _zAxis = new THREE.Vector3(0, 0, 1)

const smoothstep = (edge0, edge1, x) =>
{
    const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
    return t * t * (3 - 2 * t)
}

// Quintic Hermite with zero acceleration at both ends: distance travelled at τ ∈ [0, 1] for a
// path of `length`, start/end speeds given as distance per phase (speed × duration)
function quintic(tau, length, startSpeed, endSpeed)
{
    const t2 = tau * tau
    const t3 = t2 * tau
    const t4 = t3 * tau
    const t5 = t4 * tau
    return startSpeed * (tau - 6 * t3 + 8 * t4 - 3 * t5) + length * (10 * t3 - 15 * t4 + 6 * t5) + endSpeed * (- 4 * t3 + 7 * t4 - 3 * t5)
}

// Ship orientation from its nose and an up hint (+Z = nose, +Y = up)
export function orient(target, forward, up)
{
    _c.copy(up).addScaledVector(forward, - up.dot(forward))
    if(_c.lengthSq() < 1e-8)
        _c.set(0, 1, 0).addScaledVector(forward, - forward.y)
    _c.normalize()
    _d.crossVectors(_c, forward)
    _matrix.makeBasis(_d, _c, forward)
    return target.setFromRotationMatrix(_matrix)
}

// Corridor radius at route distance s: 0 at take-off, full in the middle, 0 when landing starts
export function corridorRadius(route, s)
{
    return CORRIDOR_RADIUS * smoothstep(0, CORRIDOR_RAMP_IN, s) * smoothstep(LANDING_DISTANCE, LANDING_DISTANCE + CORRIDOR_RAMP_OUT, route.length - s)
}

// Tangent / up / right of the route at distance s (parallel-transported, so it never flips)
// Guard: a route without frames (the intro's arrival) or a non-finite s gives a fixed frame, never a crash.
export function frameAt(route, s, tangent, up, right)
{
    if(!route?.tangents || !(route.length > 0))
    {
        tangent.set(0, 0, 1)
        up.set(0, 1, 0)
        right.crossVectors(tangent, up)
        return
    }
    const f = (Number.isFinite(s) ? THREE.MathUtils.clamp(s / route.length, 0, 1) : 0) * FRAME_SAMPLES
    const i = Math.min(FRAME_SAMPLES - 1, Math.floor(f))
    const k = f - i
    tangent.lerpVectors(route.tangents[i], route.tangents[i + 1], k).normalize()
    up.lerpVectors(route.ups[i], route.ups[i + 1], k)
    up.addScaledVector(tangent, - up.dot(tangent)).normalize()
    right.crossVectors(tangent, up)
}

export function pointAt(route, s, target)
{
    if(!route?.curve || !(route.length > 0)) // guard, as in frameAt: the route's end pad, or the origin
        return route?.endPad ? target.copy(route.endPad.position) : target.set(0, 0, 0)
    return route.curve.getPointAt(Number.isFinite(s) ? THREE.MathUtils.clamp(s / route.length, 0, 1) : 0, target)
}

const closestOnSegment = (p, a, b, target) =>
{
    _a.subVectors(b, a)
    const t = THREE.MathUtils.clamp(_b.subVectors(p, a).dot(_a) / _a.lengthSq(), 0, 1)
    return target.copy(a).addScaledVector(_a, t)
}

// Where a route starts or ends: a planet's launch pad (the ship climbs off it along its up) or the
// station's hangar (the ship flies out along the bay axis from a gate outside the door). Copies:
// the route owns (and shifts) its own vectors.
function routeEnd(location, arriving)
{
    if(location.hangar)
    {
        const { rest, gate, axis } = location.hangar
        const pad = { position: rest.position.clone(), quaternion: rest.quaternion.clone(), up: rest.up.clone(), forward: rest.forward.clone(), hangar: true }
        return { pad, origin: gate.clone(), lift: axis.clone(), height: GATE.height, climb: arriving ? GATE.arrive : GATE.climb }
    }
    const pad = shipRestPose(location.launchPad, location.landingPoint)
    return { pad, origin: pad.position, lift: pad.up, height: TAKEOFF_HEIGHT, climb: CLIMB }
}

// Route between two places: pad (or hangar gate) → climb out → (close pass by Earth or another
// planet when one is near the way, else a gentle side arc) → approach from above (or along the
// bay axis) → over the destination pad (or the gate). `bodies` = every location + Earth ({ center, radius }).
export function buildRoute(from, to, bodies, { autopilot = false } = {})
{
    const startEnd = routeEnd(from, false)
    const endEnd = routeEnd(to, true)
    const startPad = startEnd.pad
    const endPad = endEnd.pad
    const startLift = startEnd.lift
    const endLift = endEnd.lift

    const start = startEnd.origin.clone().addScaledVector(startLift, startEnd.height)
    const end = endEnd.origin.clone().addScaledVector(endLift, endEnd.height)

    const out = new THREE.Vector3().subVectors(to.center, from.center).projectOnPlane(startLift)
    if(out.lengthSq() < 1e-4)
        out.copy(startPad.forward).projectOnPlane(startLift)
    if(out.lengthSq() < 1e-4)
        out.copy(startPad.up).projectOnPlane(startLift)
    out.normalize()
    const back = new THREE.Vector3().subVectors(from.center, to.center).projectOnPlane(endLift)
    if(back.lengthSq() < 1e-4)
        back.copy(endPad.forward).projectOnPlane(endLift)
    if(back.lengthSq() < 1e-4)
        back.copy(endPad.up).projectOnPlane(endLift)
    back.normalize()

    const climb = start.clone().addScaledVector(startLift, startEnd.climb.up).addScaledVector(out, startEnd.climb.out)
    const approach = end.clone().addScaledVector(endLift, endEnd.climb.up).addScaledVector(back, endEnd.climb.out)

    // Middle point: close pass by the nearest scenic body, otherwise a side arc. Only bodies beside
    // the way count (closest point in the middle part of it): one behind the start or the end made
    // a hairpin there (M6b: the station sits behind Signal Moon on the way to The Forge)
    const others = bodies.filter((body) => body !== from && body !== to)
    const middle = new THREE.Vector3().addVectors(climb, approach).multiplyScalar(0.5)
    let scenic = null
    let scenicDistance = Infinity
    const span = _d.subVectors(approach, climb).lengthSq()
    for(const body of others)
    {
        const distance = closestOnSegment(body.center, climb, approach, _c).distanceTo(body.center) - body.radius
        const along = _b.subVectors(body.center, climb).dot(_a.subVectors(approach, climb)) / span
        if(along > SCENIC_SPAN && along < 1 - SCENIC_SPAN && distance < SCENIC_RANGE && distance < scenicDistance)
        {
            scenic = body
            scenicDistance = distance
        }
    }
    const direction = new THREE.Vector3().subVectors(approach, climb)
    const side = new THREE.Vector3().crossVectors(direction, _yAxis)
    if(side.lengthSq() < 1e-4)
        side.set(1, 0, 0)
    side.normalize()

    if(scenic)
    {
        closestOnSegment(scenic.center, climb, approach, middle)
        const away = middle.clone().sub(scenic.center)
        if(away.lengthSq() < 1)
            away.copy(side)
        middle.copy(scenic.center).addScaledVector(away.normalize(), scenic.radius + CORRIDOR_RADIUS + SCENIC_GAP)
    }
    else
        middle.addScaledVector(side, direction.length() * 0.12)

    // Two tangent-continuous cubic Béziers (pad → middle → pad) with long handles: wide,
    // gentle bends everywhere (a CatmullRom through the climb points bent tighter than the corridor)
    const startDirection = new THREE.Vector3().copy(startLift).multiplyScalar(startEnd.climb.up).addScaledVector(out, startEnd.climb.out).normalize()
    const endDirection = new THREE.Vector3().copy(endLift).multiplyScalar(- endEnd.climb.up).addScaledVector(back, - endEnd.climb.out).normalize()
    const points = [ start, middle, end ]
    const route = { from, to, startPad, endPad, scenic, points, startDirection, endDirection, autopilot }

    // Keep the whole corridor clear of every surface: push the middle point away, re-check
    for(let attempt = 0; attempt < 12; attempt++)
    {
        createCurve(route)
        const hit = findIntrusion(route, bodies)
        if(!hit)
            break
        const away = middle.clone().sub(hit.body.center)
        if(away.lengthSq() < 1)
            away.copy(side)
        middle.addScaledVector(away.normalize(), hit.depth + 5)
    }

    route.baseSpeed = (route.length - LANDING_DISTANCE) / (autopilot ? AUTO_FLIGHT_TIME : FLIGHT_TIME)
    if(autopilot)
        route.baseSpeed = Math.max(route.baseSpeed, AUTO_LANDING_SPEED * 1.5)

    // Take-off: straight up off the pad, then into the route's first tangent. From the hangar: lift
    // off the pad, glide out through the bay door along its axis, then into the route. The take-off
    // ends on the curve's own start direction (where the flight really moves next), not the smoothed
    // corridor tangent: they differ where the route bends early (the hangar's climb out, M6b)
    const startTangent = route.startDirection
    if(from.hangar)
    {
        const door = from.hangar.door.clone()
        const axis = startLift
        route.takeoff = new THREE.CurvePath()
        route.takeoff.add(new THREE.CubicBezierCurve3(startPad.position.clone(), startPad.position.clone().addScaledVector(startPad.up, 2), door.clone().addScaledVector(axis, - 6), door.clone()))
        route.takeoff.add(new THREE.CubicBezierCurve3(door.clone(), door.clone().addScaledVector(axis, 5), start.clone().addScaledVector(startTangent, - 6), start.clone()))
        for(const curve of route.takeoff.curves)
            curve.arcLengthDivisions = 300
    }
    else
    {
        route.takeoff = new THREE.CubicBezierCurve3(
            startPad.position.clone(),
            startPad.position.clone().addScaledVector(startPad.up, 6),
            start.clone().addScaledVector(startTangent, - 8),
            start.clone()
        )
    }
    route.takeoff.arcLengthDivisions = 400
    route.takeoffLength = route.takeoff.getLength()
    route.startQuaternion = orient(new THREE.Quaternion(), startTangent, route.ups[0])

    return route
}

function createCurve(route)
{
    const [ start, middle, end ] = route.points
    const middleDirection = new THREE.Vector3().subVectors(end, start)
    if(route.scenic)
    {
        // Pass the scenic body tangentially
        const away = _a.subVectors(middle, route.scenic.center).normalize()
        middleDirection.addScaledVector(away, - middleDirection.dot(away))
    }
    middleDirection.normalize()

    const handleA = start.distanceTo(middle) * HANDLE
    const handleB = middle.distanceTo(end) * HANDLE
    const first = new THREE.CubicBezierCurve3(start.clone(), start.clone().addScaledVector(route.startDirection, handleA), middle.clone().addScaledVector(middleDirection, - handleA), middle.clone())
    const second = new THREE.CubicBezierCurve3(middle.clone(), middle.clone().addScaledVector(middleDirection, handleB), end.clone().addScaledVector(route.endDirection, - handleB), end.clone())
    first.arcLengthDivisions = 1000
    second.arcLengthDivisions = 1000
    route.curve = new THREE.CurvePath()
    route.curve.add(first)
    route.curve.add(second)
    route.curve.arcLengthDivisions = 2000
    route.length = route.curve.getLength()

    // Corridor frames: parallel-transported from the take-off pad's up along a smoothed tangent
    // field, so the frame turns gradually through the Bézier joint (its curvature jumps there,
    // which made offset positions kick)
    const raw = []
    for(let i = 0; i <= FRAME_SAMPLES; i++)
        raw.push(route.curve.getTangentAt(i / FRAME_SAMPLES).normalize())
    route.tangents = []
    route.ups = []
    const up = route.startPad.up.clone()
    for(let i = 0; i <= FRAME_SAMPLES; i++)
    {
        const tangent = new THREE.Vector3()
        for(let j = - FRAME_SMOOTHING; j <= FRAME_SMOOTHING; j++)
            tangent.addScaledVector(raw[THREE.MathUtils.clamp(i + j, 0, FRAME_SAMPLES)], FRAME_SMOOTHING + 1 - Math.abs(j))
        tangent.normalize()
        up.addScaledVector(tangent, - up.dot(tangent)).normalize()
        route.tangents.push(tangent)
        route.ups.push(up.clone())
    }
}

// Deepest point where the corridor (plus the ship) comes closer than CLEARANCE to a surface
function findIntrusion(route, bodies)
{
    let worst = null
    for(let s = 0; s <= route.length; s += 2)
    {
        pointAt(route, s, _a)
        const reach = corridorRadius(route, s) + SHIP_RADIUS
        for(const body of bodies)
        {
            const endpoint = body === route.from || body === route.to
            // Near its own pad the route starts/ends just above the surface on purpose
            const needed = body.radius + reach + (endpoint ? 4 : CLEARANCE)
            const depth = needed - _a.distanceTo(body.center)
            if(depth > 0 && !(endpoint && reach < SHIP_RADIUS + 1) && (!worst || depth > worst.depth))
                worst = { body, depth, s }
        }
    }
    return worst
}

// hatch: where the astronaut boards (ship-local). cut: start in the take-off (the astronaut is
// already inside: map trips)
export function createBody(route, playerPosition, { hatch = SHIP_SHAPE.hatch, cut = false } = {})
{
    const pad = route.startPad
    const body = {
        route,
        phase: cut ? 'takeoff' : 'boarding',
        time: 0,
        s: 0,
        speed: 0,
        multiplier: 1,
        n: new THREE.Vector2(), // corridor offset, unit disk
        offset: new THREE.Vector2(), // corridor offset, units (n × corridor radius)
        lateral: new THREE.Vector2(), // steering velocity, units/s
        position: pad.position.clone(),
        previousPosition: pad.position.clone(),
        quaternion: pad.quaternion.clone(),
        previousQuaternion: pad.quaternion.clone(),
        frameUp: pad.up.clone(), // route up (camera roll reference)
        previousFrameUp: pad.up.clone(),
        forward: pad.forward.clone(),
        thrust: 0,
        steering: false,
        landing: null,
        events: [],
        // Boarding: the astronaut walks into the hatch and fades
        playerStart: playerPosition.clone(),
        playerPosition: playerPosition.clone(),
        previousPlayerPosition: playerPosition.clone(),
        hatch: new THREE.Vector3().fromArray(hatch).applyQuaternion(pad.quaternion).add(pad.position),
        playerVisibility: cut ? 0 : 1,
        previousPlayerVisibility: cut ? 0 : 1
    }
    return body
}

// Docking into the station's hangar (the station's landing phase), from `position` moving along
// `forward` at `speed`: the approach (arriving at the align speed on the bay axis), straight in to the
// hover point above the pad, then a 180° turn while settling on the pad (nose to the door, ready to
// leave). On a route the approach is the rest of the route itself, from distance `s` (the corridor is
// closed there, so the ship is on it, and the route ends straight along the bay axis); its time
// follows the speeds. The intro's arrival from space (no route) curves to the alignment point
// in `approachTime`.
// settleOnly: start above the pad (the returning visitor's short intro): only the 180° turn and touchdown
export function createDocking(station, { position, forward, up, speed, quaternion = null, route = null, s = 0, approachTime = DOCKING.approach, settleOnly = false })
{
    const { rest, hover, approach, axis } = station.hangar
    const inward = axis.clone().negate()
    let curve
    let alignPoint
    if(route)
    {
        const length = route.length - s
        curve = {
            getLength: () => length,
            getPointAt: (u, target) => pointAt(route, s + u * length, target),
            getTangentAt: (u, target) => route.curve.getTangentAt(THREE.MathUtils.clamp((s + u * length) / route.length, 0, 1), target)
        }
        alignPoint = pointAt(route, route.length, new THREE.Vector3())
        approachTime = THREE.MathUtils.clamp(2 * length / (speed + DOCKING.alignSpeed), DOCKING.approachMin, DOCKING.approachMax)
    }
    else
    {
        const handle = Math.max(4, position.distanceTo(approach) * 0.38)
        curve = new THREE.CubicBezierCurve3(position.clone(), position.clone().addScaledVector(forward, handle), approach.clone().addScaledVector(axis, handle), approach.clone())
        curve.arcLengthDivisions = 400
        alignPoint = approach.clone()
    }
    const glide = new THREE.LineCurve3(alignPoint, hover.clone())
    const settle = new THREE.LineCurve3(hover.clone(), rest.position.clone())
    const segment = (kind, path, duration, startSpeed, endSpeed) => ({ kind, curve: path, length: path.getLength(), duration, startSpeed, endSpeed })
    const segments = [
        segment('approach', curve, approachTime, 0, DOCKING.alignSpeed),
        segment('glide', glide, DOCKING.glide, DOCKING.alignSpeed, 0),
        segment('settle', settle, DOCKING.settle, 0, 0)
    ]
    segments[0].startSpeed = Math.min(speed, 2 * segments[0].length / approachTime) // the profile never reverses
    if(settleOnly)
        segments.splice(0, 2)
    return {
        docking: true,
        segments,
        duration: segments.reduce((total, s) => total + s.duration, 0),
        startQuaternion: quaternion ? quaternion.clone() : orient(new THREE.Quaternion(), forward, up),
        inward,
        up: rest.up.clone(),
        segment: 0
    }
}

// The intro (M6b): the ship arrives from space already on its docking approach. `route` only needs
// `to` (the station) and `endPad` (its hangar rest pose); the body starts in the landing phase.
// settleOnly: it starts above the pad instead, nose inward (the short intro)
export function createArrival(route, position, speed, approachTime, settleOnly = false)
{
    const pad = route.endPad
    const forward = settleOnly
        ? route.to.hangar.axis.clone().negate()
        : new THREE.Vector3().subVectors(route.to.hangar.approach, position).normalize()
    const quaternion = orient(new THREE.Quaternion(), forward, pad.up)
    const body = {
        route,
        phase: 'landing',
        time: 0,
        s: 0,
        speed,
        multiplier: 1,
        n: new THREE.Vector2(),
        offset: new THREE.Vector2(),
        lateral: new THREE.Vector2(),
        position: position.clone(),
        previousPosition: position.clone(),
        quaternion: quaternion.clone(),
        previousQuaternion: quaternion.clone(),
        frameUp: pad.up.clone(),
        previousFrameUp: pad.up.clone(),
        forward: forward.clone(),
        thrust: 0.35,
        steering: false,
        landing: createDocking(route.to, { position, forward, up: pad.up, speed, approachTime, settleOnly }),
        events: [],
        playerStart: position.clone(),
        playerPosition: position.clone(),
        previousPlayerPosition: position.clone(),
        hatch: position.clone(),
        playerVisibility: 0,
        previousPlayerVisibility: 0
    }
    return body
}

// One step of the docking sequence (time-based segments, each with its own quintic speed profile)
function stepDocking(body)
{
    const docking = body.landing
    let time = body.time
    let index = 0
    while(index < docking.segments.length - 1 && time > docking.segments[index].duration)
    {
        time -= docking.segments[index].duration
        index++
    }
    const segment = docking.segments[index]
    docking.segment = index
    const tau = Math.min(1, time / segment.duration + 1e-9)
    const distance = quintic(tau, segment.length, segment.startSpeed * segment.duration, segment.endSpeed * segment.duration)
    segment.curve.getPointAt(THREE.MathUtils.clamp(distance / segment.length, 0, 1), body.position)

    if(segment.kind === 'approach')
    {
        // From the ship's pose at the hand-over (bank included) to nose along the path, station up.
        // The target moves, so its sign is kept continuous step to step and the blend is a plain
        // normalised lerp: a shortest-path slerp switched sides (a flip) when the route's up arrived
        // almost opposite the station's. The camera's up follows the ship's.
        segment.curve.getTangentAt(THREE.MathUtils.clamp(distance / segment.length, 0, 1), _forward).normalize()
        orient(_quaternion, _forward, docking.up)
        const reference = docking.target || docking.startQuaternion
        if(_quaternion.dot(reference) < 0)
            _quaternion.set(- _quaternion.x, - _quaternion.y, - _quaternion.z, - _quaternion.w)
        docking.target = (docking.target || new THREE.Quaternion()).copy(_quaternion)
        const w = smoothstep(0, 0.6, tau)
        const start = docking.startQuaternion
        body.quaternion.set(start.x + (_quaternion.x - start.x) * w, start.y + (_quaternion.y - start.y) * w, start.z + (_quaternion.z - start.z) * w, start.w + (_quaternion.w - start.w) * w).normalize()
        body.frameUp.copy(_yAxis).applyQuaternion(body.quaternion)
        body.thrust = 0.35
    }
    else if(segment.kind === 'glide')
    {
        orient(body.quaternion, docking.inward, docking.up)
        body.frameUp.copy(docking.up)
        body.thrust = 0.25 * (1 - tau)
    }
    else
    {
        // Turn round above the pad while settling (yaw 180° about the station's up)
        _forward.copy(docking.inward).applyAxisAngle(docking.up, Math.PI * smoothstep(0, 1, tau))
        orient(body.quaternion, _forward, docking.up)
        body.frameUp.copy(docking.up)
        body.thrust = 0.12 * (1 - smoothstep(0.6, 1, tau))
    }

    if(body.time >= docking.duration - 1e-9)
    {
        body.position.copy(body.route.endPad.position)
        body.quaternion.copy(body.route.endPad.quaternion)
        body.thrust = 0
        setPhase(body, 'establish')
    }
}

// "Skip flight" / reduced motion: straight to the touchdown at the destination pad (the caller
// fades to black first). `time` = how far into the establishing shot to start.
export function jumpToEnd(body, time = 0)
{
    const pad = body.route.endPad
    for(const [ current, previous, value ] of [ [ body.position, body.previousPosition, pad.position ], [ body.frameUp, body.previousFrameUp, pad.up ] ])
    {
        current.copy(value)
        previous.copy(value)
    }
    body.quaternion.copy(pad.quaternion)
    body.previousQuaternion.copy(pad.quaternion)
    body.forward.copy(pad.forward)
    body.thrust = 0
    body.speed = 0
    body.landing = null
    body.playerVisibility = 0
    body.previousPlayerVisibility = 0
    setPhase(body, 'establish')
    body.time = time
}

function setPhase(body, phase)
{
    body.phase = phase
    body.time = 0
    body.events.push(phase)
}

const _tangent = new THREE.Vector3()
const _up = new THREE.Vector3()
const _right = new THREE.Vector3()
const _forward = new THREE.Vector3()

// One fixed step. input = { x, y (−1…1, right / up), boost, slow } (used only while flying)
export function stepBody(body, input, dt)
{
    const route = body.route
    body.previousPosition.copy(body.position)
    body.previousQuaternion.copy(body.quaternion)
    body.previousFrameUp.copy(body.frameUp)
    body.previousPlayerPosition.copy(body.playerPosition)
    body.previousPlayerVisibility = body.playerVisibility
    body.time += dt
    body.steering = false

    if(body.phase === 'boarding')
    {
        const tau = Math.min(1, body.time / DURATIONS.boarding + 1e-9)
        body.playerPosition.lerpVectors(body.playerStart, body.hatch, smoothstep(0, 1, tau))
        body.playerVisibility = 1 - smoothstep(0.35, 1, tau)
        if(tau >= 1)
            setPhase(body, 'takeoff')
    }
    else if(body.phase === 'takeoff')
    {
        // Lift off from rest; leave at the route's speed (capped so the profile never reverses)
        const tau = Math.min(1, body.time / DURATIONS.takeoff + 1e-9)
        const endSpeed = Math.min(route.baseSpeed, 2.2 * route.takeoffLength / DURATIONS.takeoff)
        const distance = quintic(tau, route.takeoffLength, 0, endSpeed * DURATIONS.takeoff)
        route.takeoff.getPointAt(THREE.MathUtils.clamp(distance / route.takeoffLength, 0, 1), body.position)
        body.quaternion.slerpQuaternions(route.startPad.quaternion, route.startQuaternion, smoothstep(0, 1, tau))
        body.frameUp.copy(route.startPad.up).lerp(route.ups[0], smoothstep(0, 1, tau)).normalize()
        body.thrust = smoothstep(0, 0.4, tau)
        if(tau >= 1)
        {
            body.position.copy(route.points[0])
            body.quaternion.copy(route.startQuaternion)
            body.speed = endSpeed
            body.s = 0
            setPhase(body, 'flying')
        }
    }
    else if(body.phase === 'flying')
        stepFlying(body, input, dt)
    else if(body.phase === 'landing' && body.landing.docking)
        stepDocking(body)
    else if(body.phase === 'landing')
    {
        const landing = body.landing
        const tau = Math.min(1, body.time / DURATIONS.landing + 1e-9)
        const distance = quintic(tau, landing.length, landing.startSpeed * DURATIONS.landing, 0)
        landing.curve.getPointAt(THREE.MathUtils.clamp(distance / landing.length, 0, 1), body.position)
        body.quaternion.slerpQuaternions(landing.startQuaternion, route.endPad.quaternion, smoothstep(0.1, 1, tau))
        body.frameUp.copy(landing.startUp).lerp(route.endPad.up, smoothstep(0, 1, tau)).normalize()
        body.thrust = 0.35 * (1 - smoothstep(0.7, 1, tau))
        if(tau >= 1)
        {
            body.position.copy(route.endPad.position)
            body.quaternion.copy(route.endPad.quaternion)
            body.thrust = 0
            setPhase(body, 'establish')
        }
    }
    else if(body.phase === 'establish')
    {
        if(body.time >= DURATIONS.establish - 1e-9)
            setPhase(body, 'done')
    }

    _forward.copy(_zAxis).applyQuaternion(body.quaternion)
    body.forward.copy(_forward)
}

function stepFlying(body, input, dt)
{
    const route = body.route

    if(route.autopilot)
    {
        // Accelerate to the cruise, then brake so the landing starts at AUTO_LANDING_SPEED
        const remaining = Math.max(0, route.length - LANDING_DISTANCE - body.s)
        const braking = Math.sqrt(AUTO_LANDING_SPEED * AUTO_LANDING_SPEED + 2 * AUTO_DECEL * remaining)
        body.speed = Math.min(route.baseSpeed, braking, body.speed + AUTO_ACCEL * dt)
        body.multiplier = 1
    }
    else
    {
        // Speed: normal / boost (Shift) / slow (Ctrl), eased
        body.multiplier += ((input.boost ? BOOST : input.slow ? SLOW : 1) - body.multiplier) * (1 - Math.exp(- SPEED_RESPONSE * dt))
        body.speed += (route.baseSpeed * body.multiplier - body.speed) * (1 - Math.exp(- SPEED_RESPONSE * dt))
    }

    // Steering → sideways velocity; near the edge the outward part fades and a soft pull eases
    // the ship back (corridor units, so it scales with the corridor radius)
    const ix = THREE.MathUtils.clamp(input.x, - 1, 1)
    const iy = THREE.MathUtils.clamp(input.y, - 1, 1)
    body.steering = Math.abs(ix) > 0.1 || Math.abs(iy) > 0.1
    let targetX = ix * STEER_SPEED
    let targetY = iy * STEER_SPEED
    const n = body.n
    const length = n.length()
    if(length > 1e-6)
    {
        const nx = n.x / length
        const ny = n.y / length
        const edge = smoothstep(EDGE_START, 1, length)
        const outward = targetX * nx + targetY * ny
        if(outward > 0)
        {
            targetX -= nx * outward * edge
            targetY -= ny * outward * edge
        }
        targetX -= nx * EDGE_PULL * CORRIDOR_RADIUS * edge
        targetY -= ny * EDGE_PULL * CORRIDOR_RADIUS * edge
    }
    const response = 1 - Math.exp(- STEER_RESPONSE * dt)
    body.lateral.x += (targetX - body.lateral.x) * response
    body.lateral.y += (targetY - body.lateral.y) * response
    n.x += body.lateral.x / CORRIDOR_RADIUS * dt
    n.y += body.lateral.y / CORRIDOR_RADIUS * dt
    if(n.length() > 1)
    {
        n.normalize() // safety net, never reached with the soft edge (see the route check)
        body.edgeClamps = (body.edgeClamps || 0) + 1
    }

    body.s = Math.min(route.length, body.s + body.speed * dt)
    const radius = corridorRadius(route, body.s)
    body.offset.copy(n).multiplyScalar(radius)

    frameAt(route, body.s, _tangent, _up, _right)
    pointAt(route, body.s, body.position).addScaledVector(_right, body.offset.x).addScaledVector(_up, body.offset.y)
    body.frameUp.copy(_up)

    // Nose along the real motion, banked into sideways motion
    _forward.subVectors(body.position, body.previousPosition)
    if(_forward.lengthSq() < 1e-10)
        _forward.copy(_tangent)
    _forward.normalize()
    orient(body.quaternion, _forward, _up)
    const bank = - THREE.MathUtils.clamp(body.lateral.x / STEER_SPEED, - 1, 1) * BANK
    body.quaternion.multiply(_quaternion.setFromAxisAngle(_zAxis, bank))
    body.thrust = body.multiplier

    // Automatic landing: the corridor is closed here, so the ship is on the route (the station:
    // the docking sequence)
    if(route.length - body.s <= LANDING_DISTANCE && route.to.hangar)
    {
        body.landing = createDocking(route.to, { position: body.position, forward: _forward, up: _up, speed: body.speed, quaternion: body.quaternion, route, s: body.s })
        setPhase(body, 'landing')
    }
    else if(route.length - body.s <= LANDING_DISTANCE)
    {
        const pad = route.endPad
        const landingCurve = new THREE.CubicBezierCurve3(
            body.position.clone(),
            body.position.clone().addScaledVector(_forward, 25),
            pad.position.clone().addScaledVector(pad.up, 18),
            pad.position.clone()
        )
        landingCurve.arcLengthDivisions = 400
        const landingLength = landingCurve.getLength()
        body.landing = {
            curve: landingCurve,
            length: landingLength,
            startSpeed: Math.min(body.speed, 2.4 * landingLength / DURATIONS.landing),
            startQuaternion: body.quaternion.clone(),
            startUp: _up.clone()
        }
        setPhase(body, 'landing')
    }
}

// Control points of a curve (Bézier, line, or a path of them)
const curvePoints = (curve) => curve ? (curve.curves ? curve.curves.flatMap(curvePoints) : [ curve.v0, curve.v1, curve.v2, curve.v3 ].filter(Boolean)) : []

// Floating origin: move everything the flight stores by -offset
export function shiftBody(body, offset)
{
    const route = body.route
    const landing = body.landing
    for(const vector of [
        body.position, body.previousPosition, body.playerStart, body.playerPosition, body.previousPlayerPosition, body.hatch,
        route.startPad?.position, route.endPad.position, ...(route.points || []),
        ...curvePoints(route.curve), ...curvePoints(route.takeoff),
        ...(landing ? (landing.segments ? landing.segments.flatMap((segment) => curvePoints(segment.curve)) : curvePoints(landing.curve)) : [])
    ])
        vector?.sub(offset)
}

