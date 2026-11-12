import * as THREE from 'three'

import State from '@/State/State.js'
import { latLongToDirection } from './Planets.js'
import { createCrew, stepCrew, CREW_RADIUS } from './Crew.js'
import { FIXED_STEP, MAX_STEPS, PLAYER_RADIUS } from './PlayerPhysics.js'
import { ROVER_RADIUS } from './Rover.js'

const NO_STOP_RADIUS = 2.2 // m round every station's interaction point (and the beacons / pad)

const _d = new THREE.Vector3()
const _t = new THREE.Vector3()

// M7 ambient scientists (The Observatory): 2–3 recoloured astronauts walking between the exploration
// stations, pausing beside them, waving, stepping aside (View/Scientists.js draws them). They run the
// station crew's walking code (State/Crew.js) in a flat map of the planet around `anchor`
// (azimuthal equidistant: distances from the anchor are exact, sideways ≤ 9% long at 40°), with the
// props as circles and every station's interaction point as a no-stop zone, so they never block one.
// Each one is also a moving obstacle (`planet.movers`) for the astronaut; the rover pushes them out
// of its way instead (it never stops for them). Only on The
// Observatory, and only while the visitor is there.
export default class Scientists
{
    constructor()
    {
        this.state = State.getInstance()
        this.planet = this.state.planets.items.find((planet) => planet.scientists?.length)
        this.members = []
        if(!this.planet)
            return

        const planet = this.planet
        this.anchor = latLongToDirection(planet.scientistAnchor)
        this.east = new THREE.Vector3(0, 1, 0).cross(this.anchor).normalize()
        this.north = this.anchor.clone().cross(this.east).normalize()

        this.room = { segments: [], circles: [], dynamic: [], noStop: [] }
        this.members = planet.scientists.map((definition, index) =>
        {
            const member = createCrew({ id: `scientist-${index + 1}`, loop: definition.loop, path: definition.path.map((point) => ({ ...this.toMap(latLongToDirection(point)), pause: point.pause || 0 })) }, index)
            member.mover = { position: new THREE.Vector3(), r: CREW_RADIUS }
            member.up = new THREE.Vector3()
            member.forward = new THREE.Vector3()
            return member
        })
        planet.movers = this.members.map((member) => member.mover)
        this.accumulator = 0
        this.mapped = false
        this.state.planets.events.on('originShift', (offset) =>
        {
            for(const member of this.members)
                member.mover.position.sub(offset)
        })
    }

    // Unit direction (from the planet centre) → flat map (x east, z north), metres along the surface
    toMap(direction, target = {})
    {
        const radius = this.planet.radius
        const cos = THREE.MathUtils.clamp(direction.dot(this.anchor), - 1, 1)
        const angle = Math.acos(cos)
        _t.copy(direction).addScaledVector(this.anchor, - cos)
        const length = _t.length()
        if(length < 1e-9)
        {
            target.x = 0
            target.z = 0
            return target
        }
        target.x = _t.dot(this.east) / length * angle * radius
        target.z = _t.dot(this.north) / length * angle * radius
        return target
    }

    // Flat map → unit direction
    fromMap(x, z, target)
    {
        const distance = Math.hypot(x, z)
        const angle = distance / this.planet.radius
        if(distance < 1e-9)
            return target.copy(this.anchor)
        _t.copy(this.east).multiplyScalar(x / distance).addScaledVector(this.north, z / distance)
        return target.copy(this.anchor).multiplyScalar(Math.cos(angle)).addScaledVector(_t, Math.sin(angle))
    }

    // Props as circles (their footprint's reach) and the no-stop zones, on the map (once; the rover
    // is added each step, it moves)
    buildMap()
    {
        const planet = this.planet
        this.room.circles = planet.colliders.filter((collider) => !collider.rover).map((collider) =>
        {
            const point = this.toMap(_d.subVectors(collider.center, planet.center).normalize())
            return { x: point.x, z: point.z, r: collider.bound }
        })
        this.roverCircle = { x: 0, z: 0, r: 0 }
        this.room.circles.push(this.roverCircle)
        this.room.noStop = planet.interactives.filter((point) => point.id !== 'rover').map((point) =>
        {
            const p = this.toMap(_d.subVectors(point.position, planet.center).normalize())
            return { x: p.x, z: p.z, r: NO_STOP_RADIUS }
        })
        this.mapped = true
    }

    update()
    {
        if(!this.planet || this.state.planets.current !== this.planet || this.state.flight.active)
            return
        const planet = this.planet
        if(!this.mapped)
            this.buildMap()

        // The rover (parked, left anywhere, or driven) is a circle they walk round
        const rover = this.state.rover
        this.toMap(_d.subVectors(rover.body.position, planet.center).normalize(), this.roverCircle)

        // The visitor on the map; in the rover they keep the rover's clearance instead of an astronaut's
        // (the rover never drives into them, they never walk into it: no shoving)
        const player = this.toMap(_d.subVectors(this.state.player.position, planet.center).normalize())
        // The rover (parked or driven) is a hard circle for them: it pushes them out of its footprint, it
        // never stops for them (State/Rover.js)
        player.extra = rover.active ? ROVER_RADIUS - PLAYER_RADIUS + 0.1 : 0
        this.roverCircle.r = rover.planet === planet ? ROVER_RADIUS + 0.15 : 0

        this.accumulator += this.state.time.delta
        let steps = 0
        while(this.accumulator >= FIXED_STEP && steps < MAX_STEPS)
        {
            for(const member of this.members)
                stepCrew(member, player, this.room, FIXED_STEP)
            this.accumulator -= FIXED_STEP
            steps++
        }
        if(steps === MAX_STEPS)
            this.accumulator = Math.min(this.accumulator, FIXED_STEP * 0.999)

        // Back onto the planet: position, up and facing (for the model and the movers)
        for(const member of this.members)
        {
            this.fromMap(member.x, member.z, member.up)
            member.mover.position.copy(member.up).multiplyScalar(planet.radius).add(planet.center)
            this.fromMap(member.x + member.facingX * 0.1, member.z + member.facingZ * 0.1, _t)
            member.forward.copy(_t).sub(member.up).projectOnPlane(member.up).normalize()
        }
    }
}
