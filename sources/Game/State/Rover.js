import * as THREE from 'three'

import Game from '@/Game.js'
import State from '@/State/State.js'
import StateMachine from '@/StateMachine.js'
import UIBridge from '../../UI/UIBridge.js'
import { latLongToDirection } from './Planets.js'
import { ROVER_SHAPE, buildCollider } from './PropShapes.js'
import { contact, resetBody, stepBody, RUN_SPEED } from './PlayerPhysics.js'
import { track } from '../Analytics.js'

// Driving (pure numbers, fixed step): speeds in m/s, rates in rad/s
export const ROVER_RADIUS = 1.25 // round footprint for its collisions (the body is 1.6 × 2.5, wheels out to 1.1)
const TOP_SPEED = 13
const BOOST_SPEED = RUN_SPEED * 2 // ≈ 2× running speed
const REVERSE_SPEED = 5
const ACCELERATION = 9
const BRAKE = 20
const COAST = 3
const HANDBRAKE = 28
const STEER_RATE = 1.7 // yaw rate at full lock, from STEER_FULL speed up
const STEER_FULL = 4
const STEER_RESPONSE = 6 // input → wheel angle, 1 - exp(-k·dt)
const SKIN = 0.02
const ITERATIONS = 3
const EXIT_SPEED = 0.6 // E gets out below this, anywhere
const EXIT_NEAR_SPOT = { distance: 5, speed: 3 } // or near the parking spot when slow (never at full speed passing by)
const EXIT_SIDE = 2.1 // the astronaut appears this far beside the rover

const _foot = new THREE.Vector3()
const _normal = new THREE.Vector3()
const _start = new THREE.Vector3()
const _right = new THREE.Vector3()
const _matrix = new THREE.Matrix4()
const _quaternion = new THREE.Quaternion()

function project(body, planet)
{
    body.position.sub(planet.center).setLength(planet.radius).add(planet.center)
    body.up.subVectors(body.position, planet.center).normalize()
    body.facing.projectOnPlane(body.up).normalize()
}

// Closest point outside every prop footprint (State/PlayerPhysics.js's slide, with the rover's radius)
function resolve(body, planet)
{
    for(let iteration = 0; iteration < ITERATIONS; iteration++)
    {
        let pushed = false
        for(const collider of planet.colliders)
        {
            for(let p = 0; p < collider.polygons.length; p++)
            {
                _foot.copy(body.position)
                const distance = contact(collider, _foot, body.up, _normal, p)
                if(distance < ROVER_RADIUS + SKIN - 1e-9)
                {
                    body.position.addScaledVector(_normal, ROVER_RADIUS + SKIN - distance)
                    project(body, planet)
                    pushed = true
                }
            }
        }
        // Scientists (planet.movers) never stop it: they keep out of its way (State/Scientists.js pushes
        // them out of its footprint). Both ways round, one yielding in front of it deadlocked
        if(!pushed)
            break
    }
}

// One fixed step on a small planet: gravity = toward the centre (always on the surface), heading
// turned by the steering, moved along it, then slid along props (never bounces). input = { throttle
// -1…1, steer -1…1, boost, handbrake }. Pure: also usable by a Node check.
export function stepRover(body, planet, input, dt)
{
    const top = input.boost ? BOOST_SPEED : TOP_SPEED

    // Throttle: forward accelerates; backward brakes, then reverses
    if(input.handbrake)
        body.speed -= Math.sign(body.speed) * Math.min(Math.abs(body.speed), HANDBRAKE * dt)
    else if(input.throttle > 0)
        body.speed = body.speed < 0 ? Math.min(0, body.speed + BRAKE * dt) : Math.min(top, body.speed + ACCELERATION * dt)
    else if(input.throttle < 0)
        body.speed = body.speed > 0 ? Math.max(0, body.speed - BRAKE * dt) : Math.max(- REVERSE_SPEED, body.speed - ACCELERATION * 0.6 * dt)
    else
        body.speed -= Math.sign(body.speed) * Math.min(Math.abs(body.speed), COAST * dt)
    if(body.speed > top) // boost released: ease back down
        body.speed = Math.max(top, body.speed - BRAKE * 0.5 * dt)

    // Steering: the wheels turn smoothly; the heading turns with speed (none when stopped)
    body.steer += (input.steer - body.steer) * (1 - Math.exp(- STEER_RESPONSE * dt))
    const yaw = - body.steer * STEER_RATE * Math.min(1, Math.abs(body.speed) / STEER_FULL) * Math.sign(body.speed) * dt
    body.facing.applyAxisAngle(body.up, yaw)

    _start.copy(body.position)
    body.position.addScaledVector(body.facing, body.speed * dt)
    project(body, planet)
    resolve(body, planet)

    // What it really moved along its heading (a prop in the way slows it, sliding keeps the rest)
    const moved = _start.sub(body.position).negate().dot(body.facing) / dt
    if(Math.abs(moved) < Math.abs(body.speed))
        body.speed = moved
    body.yawRate = yaw / dt
    body.wheel += body.speed * dt / ROVER_SHAPE.wheelRadius
}

// M7 rover (The Observatory): parked on its spot; E → DRIVING (State/Player.js steps it in its fixed
// steps and rides it, so the player stays the single writer of its own position); E when stopped or
// near the spot, or Esc, gets out beside it. While parked it is a collider (its mesh footprint) and an
// interaction point. Left anywhere, it goes back to its spot once the visitor leaves the planet.
export default class Rover
{
    constructor()
    {
        this.game = Game.getInstance()
        this.state = State.getInstance()
        this.bridge = UIBridge.getInstance()
        this.planets = this.state.planets

        this.planet = this.planets.items.find((planet) => planet.stations?.rover)
        this.body = { position: new THREE.Vector3(), up: new THREE.Vector3(), facing: new THREE.Vector3(), speed: 0, steer: 0, yawRate: 0, wheel: 0 }
        this.parts = ROVER_SHAPE.build()
        this.collider = null
        this.point = null
        this.atSpot = true
        if(!this.planet)
            return

        this.point = { id: 'rover', opens: 'rover', marker: false, position: new THREE.Vector3(), up: new THREE.Vector3() }
        this.planet.interactives.push(this.point)
        this.park()

        this.planets.events.on('originShift', (offset) => this.body.position.sub(offset))
        this.state.controls.events.on('escapeDown', () => this.leave())
        this.bridge.on('rover:exit', () => this.leave())
        this.state.controls.events.on('interactDown', () =>
        {
            if(this.active && this.entered)
                this.leave(true)
        })
    }

    get active()
    {
        return this.game.stateMachine.is(StateMachine.DRIVING)
    }

    // Back on its parking spot, facing along it
    park()
    {
        const spot = this.planet.stations.rover
        const up = latLongToDirection(spot.position)
        const toward = latLongToDirection(spot.facing)
        this.body.position.copy(up).multiplyScalar(this.planet.radius).add(this.planet.center)
        this.body.up.copy(up)
        this.body.facing.copy(toward).addScaledVector(up, - toward.dot(up)).normalize()
        this.body.speed = 0
        this.body.steer = 0
        this.atSpot = true
        this.setCollider()
    }

    // Parked (or left) where it is: its mesh footprint collides, and the point to get in follows it
    setCollider()
    {
        const planet = this.planet
        this.removeCollider()
        _right.crossVectors(this.body.up, this.body.facing).normalize()
        _quaternion.setFromRotationMatrix(_matrix.makeBasis(_right, this.body.up, this.body.facing))
        _matrix.compose(_foot.subVectors(this.body.position, planet.center), _quaternion, _normal.set(1, 1, 1))
        this.collider = buildCollider(this.parts, _matrix, planet.center)
        if(this.collider)
        {
            this.collider.rover = true
            planet.colliders.push(this.collider)
        }
        this.point.position.copy(this.body.position)
        this.point.up.copy(this.body.up)
    }

    removeCollider()
    {
        if(!this.collider)
            return
        const index = this.planet.colliders.indexOf(this.collider)
        if(index >= 0)
            this.planet.colliders.splice(index, 1)
        this.collider = null
    }

    enter()
    {
        if(!this.planet || this.planets.current !== this.planet || !this.game.stateMachine.is(StateMachine.ON_FOOT))
            return
        this.removeCollider() // it never collides with itself
        this.body.speed = 0
        this.body.steer = 0
        this.entered = false
        this.atSpot = false
        this.game.stateMachine.set(StateMachine.DRIVING)
        this.bridge.emit('prompt:hide')
        track('explore_use', { id: 'rover' })
    }

    // Get out: with E only when (almost) stopped or near the parking spot; Esc always. The astronaut
    // appears beside the rover (the other side if a prop is there), on the surface
    leave(byKey = false)
    {
        if(!this.active)
            return
        const spot = latLongToDirection(this.planet.stations.rover.position).multiplyScalar(this.planet.radius).add(this.planet.center)
        const speed = Math.abs(this.body.speed)
        const nearSpot = this.body.position.distanceTo(spot) < EXIT_NEAR_SPOT.distance && speed < EXIT_NEAR_SPOT.speed
        if(byKey && speed > EXIT_SPEED && !nearSpot)
            return
        this.body.speed = 0
        this.body.steer = 0
        this.setCollider()
        this.exit = true // State/Player.js places the astronaut beside it (getOut) on its next update
        this.game.stateMachine.set(StateMachine.ON_FOOT)
    }

    // Where the astronaut gets out: beside the rover, the side with nothing in the way (pure: the
    // body is slid out of any prop by one physics step and the side that moved it least wins)
    exitPosition(body)
    {
        _right.crossVectors(this.body.up, this.body.facing).normalize()
        let best = null
        for(const side of [ - 1, 1 ])
        {
            _start.copy(this.body.position).addScaledVector(_right, side * EXIT_SIDE)
            resetBody(body, this.planet, _start)
            _foot.copy(body.position)
            stepBody(body, this.planet, { forward: this.body.facing, x: 0, z: 0, run: false }, 1 / 120)
            const error = body.position.distanceTo(_foot)
            if(!best || error < best.error)
                best = { error, position: body.position.clone() }
            if(error < 1e-3)
                break
        }
        return best.position
    }

    update()
    {
        if(!this.planet)
            return
        // Left somewhere else: back on its spot once the visitor is on another planet
        if(!this.atSpot && this.planets.current !== this.planet && !this.active)
            this.park()
        if(this.active)
            this.entered = true
    }
}

