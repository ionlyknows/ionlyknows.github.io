import * as THREE from 'three'
import gsap from 'gsap'

import Game from '@/Game.js'
import State from '@/State/State.js'
import StateMachine from '@/StateMachine.js'
import UIBridge from '../../UI/UIBridge.js'
import Camera from './Camera.js'
import { FIXED_STEP, MAX_STEPS, WALK_SPEED, RUN_SPEED, resetBody, stepBody } from './PlayerPhysics.js'

const FOCUS_DURATION = 0.6 // camera eases to the beacon before the panel opens

const _input = { forward: new THREE.Vector3(), x: 0, z: 0, run: false }

// The astronaut. Player.update is the ONLY writer of the player position: walking runs in
// fixed 1/120 s steps (State/PlayerPhysics.js), travel is sampled from State/Travel.js.
// `renderPosition` interpolates the last two steps; the model draws exactly that.
export default class Player
{
    constructor()
    {
        this.game = Game.getInstance()
        this.state = State.getInstance()
        this.time = this.state.time
        this.controls = this.state.controls
        this.planets = this.state.planets
        this.bridge = UIBridge.getInstance()

        this.position = new THREE.Vector3()
        this.up = new THREE.Vector3(0, 1, 0)
        this.facing = new THREE.Vector3(0, 0, 1)
        this.velocity = new THREE.Vector3()
        this.height = 0
        this.verticalVelocity = 0
        this.isGrounded = true
        this.jumpRequested = false
        this.speed = 0
        this.isMoving = false
        this.isRunning = false

        this.previousPosition = new THREE.Vector3()
        this.renderPosition = new THREE.Vector3()
        this.renderUp = new THREE.Vector3(0, 1, 0)
        this.accumulator = 0

        // Debug: how many systems wrote the position this frame (must always be 1)
        this.writers = 0
        this.lastWritten = new THREE.Vector3()

        this.nearestPoint = null
        this.focusPoint = null // content point the camera focuses on (PANEL_OPEN)

        this.place(this.planets.current)
        this.camera = new Camera(this)

        // Input only queues a jump; the next fixed step applies it
        this.controls.events.on('jumpDown', () =>
        {
            if(this.camera.mode === Camera.MODE_THIRDPERSON)
                this.jumpRequested = true
        })

        this.controls.events.on('interactDown', () => this.interact())
    }

    // Stand at the planet's landing point, facing its main content point (BR-05).
    // Full physics reset and every smoothed position snapped (spawn and every arrival).
    place(planet)
    {
        this.planets.current = planet
        resetBody(this, planet, planet.landingPoint)

        this.facing.set(1, 0, 0)
        if(planet.contentPoints.length)
            this.facing.subVectors(planet.contentPoints[0].position, this.position)
        this.facing.projectOnPlane(this.up)
        if(this.facing.lengthSq() < 1e-6)
            this.facing.set(0, 0, 1).projectOnPlane(this.up)
        this.facing.normalize()

        this.snap()
        this.isMoving = false
        this.isRunning = false
        this.accumulator = 0

        if(this.nearestPoint)
            this.bridge.emit('prompt:hide')
        this.nearestPoint = null

        if(this.camera)
            this.camera.thirdPerson.reset()
    }

    snap()
    {
        this.previousPosition.copy(this.position)
        this.renderPosition.copy(this.position)
        this.renderUp.copy(this.up)
    }

    interact(pointId = null)
    {
        const point = this.nearestPoint
        const stateMachine = this.game.stateMachine
        if(!point || !stateMachine.is(StateMachine.ON_FOOT))
            return
        if(pointId !== null && pointId !== point.id)
            return

        // Launch pads open the destination picker right away
        if(point.opens === 'destinations')
        {
            this.bridge.emit('panel:open', { type: point.opens, id: point.id })
            return
        }

        // Content points: focus shot first, then the panel (input is locked from now on)
        this.focusPoint = point
        stateMachine.set(StateMachine.PANEL_OPEN)
        gsap.delayedCall(FOCUS_DURATION, () =>
        {
            if(stateMachine.is(StateMachine.PANEL_OPEN))
                this.bridge.emit('panel:open', { type: point.opens, id: point.id })
        })
    }

    updateTravel()
    {
        const travel = this.state.travel

        // Arrival: floating-origin shift + full physics reset, done here so that nothing
        // else ever writes the player position
        if(travel.arrival)
        {
            const planet = travel.arrival
            travel.arrival = null
            this.state.shiftOrigin(planet.center.clone())
            this.place(planet)
            return
        }

        if((travel.phase === 'land' || travel.phase === 'establish') && this.planets.current !== travel.to)
            this.place(travel.to)

        travel.sample(this)
        this.isGrounded = travel.phase === 'establish'
        this.snap()
    }

    update()
    {
        const stateMachine = this.game.stateMachine

        // Debug: anything that moved the player since our last write is another writer
        this.writers = this.position.equals(this.lastWritten) ? 0 : 1

        if(!stateMachine.is(StateMachine.PANEL_OPEN))
            this.focusPoint = null

        if(stateMachine.is(StateMachine.TRAVELING) || this.state.travel.arrival)
        {
            this.updateTravel()
        }
        else
        {
            const keys = this.controls.keys.down
            const canMove = this.camera.mode === Camera.MODE_THIRDPERSON
            _input.forward.copy(this.camera.thirdPerson.forward)
            _input.z = canMove ? (keys.forward ? 1 : 0) - (keys.backward ? 1 : 0) : 0
            _input.x = canMove ? (keys.strafeRight ? 1 : 0) - (keys.strafeLeft ? 1 : 0) : 0
            _input.run = keys.boost

            // Fixed timestep with an accumulator; the render position interpolates the last two steps
            const planet = this.planets.current
            this.accumulator += this.time.delta
            let steps = 0
            while(this.accumulator >= FIXED_STEP && steps < MAX_STEPS)
            {
                this.previousPosition.copy(this.position)
                stepBody(this, planet, _input, FIXED_STEP)
                this.accumulator -= FIXED_STEP
                steps++
            }
            if(steps === MAX_STEPS)
                this.accumulator = Math.min(this.accumulator, FIXED_STEP * 0.999)

            this.renderPosition.lerpVectors(this.previousPosition, this.position, this.accumulator / FIXED_STEP)
            this.renderUp.subVectors(this.renderPosition, planet.center).normalize()

            // Hysteresis so the walk animation never flickers while sliding slowly
            this.isMoving = this.isMoving ? this.speed > 0.3 : this.speed > 0.8
            this.isRunning = this.isMoving && this.speed > (WALK_SPEED + RUN_SPEED) * 0.5

            // Interaction prompt (BR-03): only the nearest in-range point
            const nearest = this.planets.findNearest(this.position)
            if(nearest !== this.nearestPoint)
            {
                this.nearestPoint = nearest
                if(nearest)
                    this.bridge.emit('prompt:show', { type: nearest.opens, id: nearest.id })
                else
                    this.bridge.emit('prompt:hide')
            }
        }

        this.writers++
        this.lastWritten.copy(this.position)
    }
}
