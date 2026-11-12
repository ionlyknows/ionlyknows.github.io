import { resolvePoint } from './PlanarPhysics.js'

// Ambient crew (M6, station interior), pure: no rendering, no singletons (stepped by
// State/Interior.js; the Node walk check runs the same code). No talking.
// Each member walks its waypoint path (loop or back and forth), pauses where the path says, waves
// when the visitor comes near, and steps aside when the visitor is in its way. Never stops in a
// `noStop` zone (doorways, exhibits' interaction spots), never walks into the visitor.

export const CREW_RADIUS = 0.45
const WALK_SPEED = 1.3
const YIELD_DISTANCE = 2.4 // visitor ahead and this close: stop and step aside
const CLEAR_DISTANCE = 3.2 // then wait until the visitor is this far (or behind)
const SIDESTEP = 1.1
const PERSONAL_SPACE = 1.5 // closer than this (any direction): make room even while pausing
const SIDESTEP_SPEED = 1.4
const CONTACT = 0.5 + CREW_RADIUS + 0.1 // never advance closer than this to the visitor
const WAVE_DISTANCE = 4.5
const WAVE_TIME = 2.6
const WAVE_COOLDOWN = 14

export function createCrew(definition, index = 0)
{
    const start = definition.path[0]
    return {
        id: definition.id,
        path: definition.path,
        loop: definition.loop,
        index: 1,
        step: 1,
        baseX: start.x,
        baseZ: start.z,
        x: start.x,
        z: start.z,
        facingX: 0,
        facingZ: 1,
        state: start.pause ? 'pause' : 'walk',
        timer: start.pause || 0,
        side: 0,
        sideTarget: 0,
        yielding: false,
        waveTimer: 0,
        waveCooldown: 3 + index * 2,
        anim: 'idle',
        circle: { x: start.x, z: start.z, r: CREW_RADIUS }
    }
}

const inside = (zones, x, z) => zones.some((zone) => (x - zone.x) * (x - zone.x) + (z - zone.z) * (z - zone.z) < zone.r * zone.r)

function nextIndex(member)
{
    const count = member.path.length
    if(member.loop)
        return (member.index + 1) % count
    let next = member.index + member.step
    if(next >= count || next < 0)
    {
        member.step = - member.step
        next = member.index + member.step
    }
    return next
}

// player = { x, z } in the same local frame (+ `extra`: how much bigger than an astronaut the visitor
// is, M7: the rover); room = interior collision data (+ noStop zones)
export function stepCrew(member, player, room, dt)
{
    const extra = player.extra || 0
    const contact = CONTACT + extra
    const yieldDistance = YIELD_DISTANCE + extra * 2
    const clearDistance = CLEAR_DISTANCE + extra * 2
    const personalSpace = PERSONAL_SPACE + extra
    const target = member.path[member.index]
    let dirX = target.x - member.baseX
    let dirZ = target.z - member.baseZ
    const remaining = Math.hypot(dirX, dirZ)
    if(remaining > 1e-6)
    {
        dirX /= remaining
        dirZ /= remaining
    }
    else
    {
        dirX = member.facingX
        dirZ = member.facingZ
    }

    // The sidestep is relative to the walking direction: when that changes (the next segment, the
    // turnaround at a path's end), carry the offset over so the member stays where it is in the world
    // (it used to jump to the mirrored side, into a visitor standing there)
    if(member.dirX !== undefined && member.dirX * dirX + member.dirZ * dirZ < 0.9999 && Math.abs(member.side) > 1e-6)
    {
        const offsetX = - member.dirZ * member.side
        const offsetZ = member.dirX * member.side
        const side = offsetX * - dirZ + offsetZ * dirX
        const along = offsetX * dirX + offsetZ * dirZ
        member.baseX += dirX * along
        member.baseZ += dirZ * along
        if(Math.sign(side) !== Math.sign(member.side))
            member.sideTarget = - member.sideTarget
        member.side = side
    }
    member.dirX = dirX
    member.dirZ = dirZ

    const toX = player.x - member.x
    const toZ = player.z - member.z
    const distance = Math.hypot(toX, toZ)
    const ahead = distance > 1e-6 ? (toX * dirX + toZ * dirZ) / distance : 1
    const blocked = inside(room.noStop || [], member.x, member.z) // may not stand still here
    member.waveCooldown -= dt

    // Make room: step aside when the visitor is ahead and close, or very close from any side
    // (also while pausing or waving). In a doorway or in front of an exhibit it never stops: it
    // keeps walking while it steps aside.
    const inWay = (member.state === 'walk' && distance < yieldDistance && ahead > 0.3) || distance < personalSpace
    if(inWay && !member.yielding)
    {
        member.yielding = true
        const cross = dirX * toZ - dirZ * toX // > 0: visitor on the left
        member.sideTarget = cross > 0 ? - SIDESTEP : SIDESTEP
        if(member.waveCooldown <= 0 && member.state !== 'wave' && !blocked)
            startWave(member)
    }
    // Keep to the side away from the visitor, even when the visitor walks round (hysteresis 0.4 m)
    if(member.yielding)
    {
        const lateral = dirX * toZ - dirZ * toX
        if(lateral > 0.4)
            member.sideTarget = - SIDESTEP
        else if(lateral < - 0.4)
            member.sideTarget = SIDESTEP
    }
    if(member.yielding && distance > clearDistance)
    {
        member.yielding = false
        member.sideTarget = 0
    }

    let moved = 0
    if(member.state === 'wave')
    {
        member.waveTimer -= dt
        if(member.waveTimer <= 0)
            member.state = member.resume
    }
    else if(member.state === 'pause')
    {
        member.timer -= dt
        if(distance < WAVE_DISTANCE && member.waveCooldown <= 0)
            startWave(member)
        else if(member.timer <= 0)
            member.state = 'walk'
    }
    else if(!member.yielding || blocked)
    {
        // Walk on, but never into the visitor
        const step = Math.min(WALK_SPEED * dt, remaining)
        const nextX = member.baseX + dirX * step + (- dirZ) * member.side
        const nextZ = member.baseZ + dirZ * step + dirX * member.side
        if(Math.hypot(player.x - nextX, player.z - nextZ) > contact || Math.hypot(player.x - nextX, player.z - nextZ) > distance)
        {
            member.baseX += dirX * step
            member.baseZ += dirZ * step
            moved = step
            if(remaining - step < 1e-6)
            {
                member.baseX = target.x
                member.baseZ = target.z
                if(target.pause && !inside(room.noStop || [], target.x, target.z))
                {
                    member.state = 'pause'
                    member.timer = target.pause
                }
                member.index = nextIndex(member)
            }
        }
    }

    // Lateral offset (step aside / back), perpendicular to the current segment. Like walking on, it
    // never moves closer than CONTACT to the visitor (the visitor can cross the centre line while it
    // steps aside: its side then points at them)
    const sideStep = Math.max(- SIDESTEP_SPEED * dt, Math.min(SIDESTEP_SPEED * dt, member.sideTarget - member.side))
    const at = (side) => ({ x: member.baseX + (- dirZ) * side, z: member.baseZ + dirX * side })
    const tooClose = (p) => { const d = Math.hypot(player.x - p.x, player.z - p.z); return d < contact && d < distance }
    if(!tooClose(at(member.side + sideStep)))
        member.side += sideStep
    const point = at(member.side)
    resolvePoint(point, CREW_RADIUS, room, { dynamic: false })
    const travelled = Math.hypot(point.x - member.x, point.z - member.z)
    member.x = point.x
    member.z = point.z
    member.circle.x = point.x
    member.circle.z = point.z

    // Facing: the visitor while waving, else the way it moves
    if(member.state === 'wave' && distance > 1e-6)
    {
        member.facingX = toX / distance
        member.facingZ = toZ / distance
    }
    else if(moved > 0)
    {
        member.facingX = dirX
        member.facingZ = dirZ
    }

    member.anim = member.state === 'wave' ? 'wave' : (moved > 0 || travelled > 0.2 * dt) ? 'walk' : 'idle'
    return member
}

function startWave(member)
{
    member.resume = member.state === 'wave' ? member.resume : member.state
    member.state = 'wave'
    member.waveTimer = WAVE_TIME
    member.waveCooldown = WAVE_COOLDOWN
}
