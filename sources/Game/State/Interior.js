import * as THREE from 'three'

import Game from '@/Game.js'
import State from '@/State/State.js'
import StateMachine from '@/StateMachine.js'
import UIBridge from '../../UI/UIBridge.js'
import { buildInterior } from './InteriorLayout.js'
import { createCrew, stepCrew } from './Crew.js'
import { FIXED_STEP, MAX_STEPS } from './PlayerPhysics.js'
import { visibleProjects } from '../../UI/visibleContent.js'
import achievements from '../../content/achievements.js'
import skills from '../../content/skills.js'
import photos from '../../content/photos.js'

const has = (value) => Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && String(value).trim() !== ''

const ORBIT = { distance: 5.5, min: 3, max: 8.5, pitchMin: - 0.2, pitchMax: 1.2, response: 5 }

// Apeiron Station's interior (M6, orbital since M6b): the planar walking room for State/Player.js,
// the crew, and the hologram's orbit mode. Reached by ship: you arrive docked in the hangar and leave
// from it (State/Flight.js). The meshes live in View/StationInterior.js (its own chunk, loaded
// during the intro, after Launch).
export default class Interior
{
    constructor()
    {
        this.game = Game.getInstance()
        this.state = State.getInstance()
        this.bridge = UIBridge.getInstance()
        this.controls = this.state.controls

        const planets = this.state.planets
        this.station = planets.items.find((planet) => planet.kind === 'station')
        this.center = this.station.center.clone() // scene position of the local origin
        this.crewAccumulator = 0
        this.orbit = { yaw: 0.7, pitch: 0.35, distance: ORBIT.distance, weight: 0, hover: null }

        this.layout = buildInterior({
            projects: visibleProjects,
            certificates: achievements.filter((item) => has(item.title)),
            photos: photos.filter((photo) => has(photo.src)),
            skillGroups: skills.filter((group) => has(group.group) && has(group.items))
        })
        this.room = { center: this.center, segments: this.layout.segments, circles: this.layout.circles, volumes: this.layout.volumes, dynamic: [], noStop: this.layout.noStop }
        this.interactives = this.layout.interactives.map((point) => ({
            id: point.id,
            opens: point.opens,
            kind: point.kind,
            position: new THREE.Vector3(this.center.x + point.x, this.center.y, this.center.z + point.z),
            up: new THREE.Vector3(0, 1, 0)
        }))
        this.crew = this.layout.crew.map((definition, index) => createCrew(definition, index))
        this.room.dynamic = this.crew.map((member) => member.circle)

        planets.events.on('originShift', (offset) =>
        {
            this.center.sub(offset)
            for(const point of this.interactives)
                point.position.sub(offset)
        })

        // Map or hologram trips from inside start in the ship in the hangar (State/Flight.js); orbit
        // mode hands back to walking first so the trip can start
        this.bridge.on('flight:request', () => this.leaveHologram())
        this.bridge.on('hologram:exit', () => this.leaveHologram())
        this.controls.events.on('escapeDown', () => this.leaveHologram())
    }

    // At the station (on foot, or boarding / arriving there): the planar room is the floor
    get active()
    {
        return this.state.planets.current === this.station
    }

    enterHologram()
    {
        if(!this.active || !this.game.stateMachine.is(StateMachine.ON_FOOT))
            return
        this.orbit.yaw = Math.atan2(this.state.player.position.x - this.center.x, this.state.player.position.z - this.center.z)
        this.orbit.hover = null
        this.game.stateMachine.set(StateMachine.HOLOGRAM)
        this.bridge.emit('prompt:hide')
    }

    leaveHologram()
    {
        if(this.game.stateMachine.is(StateMachine.HOLOGRAM))
            this.game.stateMachine.set(StateMachine.ON_FOOT)
    }

    // Nearest interactive point inside (BR-03: in range, only the nearest)
    findNearest(position, range)
    {
        let nearest = null
        let nearestDistance = range
        for(const point of this.interactives)
        {
            const distance = point.position.distanceTo(position)
            if(distance <= nearestDistance)
            {
                nearest = point
                nearestDistance = distance
            }
        }
        return nearest
    }

    // Orbit mode: drag rotates, scroll zooms (input is enabled in HOLOGRAM, walking is not)
    updateOrbit(delta)
    {
        const orbit = this.orbit
        const inOrbit = this.game.stateMachine.is(StateMachine.HOLOGRAM)
        orbit.weight += ((inOrbit ? 1 : 0) - orbit.weight) * (1 - Math.exp(- ORBIT.response * delta))
        if(!inOrbit)
            return

        const pointer = this.controls.pointer
        if(pointer.down)
        {
            const normalised = this.state.viewport.normalise(pointer.delta)
            orbit.yaw -= normalised.x * 3
            orbit.pitch = THREE.MathUtils.clamp(orbit.pitch + normalised.y * 2, ORBIT.pitchMin, ORBIT.pitchMax)
        }
        if(pointer.wheel)
            orbit.distance = THREE.MathUtils.clamp(orbit.distance + pointer.wheel * 0.005, ORBIT.min, ORBIT.max)
    }

    update()
    {
        const delta = this.state.time.delta
        this.updateOrbit(delta)

        // The crew walk while the station is where you are or where you are flying to
        if(!this.active && this.state.flight.route?.to !== this.station)
            return

        // Crew in fixed steps, like the player (the same code the walk check runs)
        const player = this.state.player.position
        const local = { x: player.x - this.center.x, z: player.z - this.center.z }
        this.crewAccumulator += delta
        let steps = 0
        while(this.crewAccumulator >= FIXED_STEP && steps < MAX_STEPS)
        {
            for(const member of this.crew)
                stepCrew(member, local, this.room, FIXED_STEP)
            this.crewAccumulator -= FIXED_STEP
            steps++
        }
        if(steps === MAX_STEPS)
            this.crewAccumulator = Math.min(this.crewAccumulator, FIXED_STEP * 0.999)
    }
}
