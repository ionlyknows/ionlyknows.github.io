import * as THREE from 'three'

import Game from '@/Game.js'
import State from '@/State/State.js'
import StateMachine from '@/StateMachine.js'
import UIBridge from '../../UI/UIBridge.js'
import { FIXED_STEP, MAX_STEPS, BOOST, buildRoute, createBody, stepBody, shiftBody } from './FlightPhysics.js'

const REBASE_DISTANCE = 500 // floating origin: rebase when the ship is this far from (0, 0, 0)
const MOUSE_DEAD_ZONE = 0.2
const MOUSE_ARM_DISTANCE = 0.08 // the mouse steers once it has moved after take-off
const BOOST_SOUND_GAP = 1.2 // s between two boost whooshes

const PHASE_STATES = { takeoff: StateMachine.TAKEOFF, flying: StateMachine.FLYING, landing: StateMachine.LANDING }

const _input = { x: 0, y: 0, boost: false, slow: false }
const _zAxis = new THREE.Vector3(0, 0, 1)
const _yAxis = new THREE.Vector3(0, 1, 0)

const joystick = (value) => Math.sign(value) * Math.max(0, Math.abs(value) - MOUSE_DEAD_ZONE) / (1 - MOUSE_DEAD_ZONE)

// Launch pad → destination picker → flight (M3). Runs State/FlightPhysics.js in fixed steps;
// the only writer of the ship (and, through sample(), of the player) during flight.
// The HUD Locations list, reduced motion and "Skip flight" use the cinematic travel instead.
export default class Flight
{
    constructor()
    {
        this.game = Game.getInstance()
        this.state = State.getInstance()
        this.bridge = UIBridge.getInstance()
        this.controls = this.state.controls

        this.active = false
        this.paused = false // a panel is open: the flight waits
        this.body = null
        this.route = null
        this.accumulator = 0
        this.alpha = 0
        this.arrival = null // destination waiting for Player.update (origin shift + placement)
        this.boost = 0 // 0…1, for FOV and warp streaks
        this.wasBoosting = false
        this.lastBoostSound = - Infinity
        this.mouse = { armed: false, x: 0, y: 0 }

        // Render pose: the last two fixed steps interpolated
        this.render = {
            position: new THREE.Vector3(),
            quaternion: new THREE.Quaternion(),
            forward: new THREE.Vector3(0, 0, 1),
            up: new THREE.Vector3(0, 1, 0),
            frameUp: new THREE.Vector3(0, 1, 0),
            playerPosition: new THREE.Vector3(),
            playerVisibility: 1
        }

        this.bridge.on('flight:request', ({ to }) => this.start(to))
        this.bridge.on('flight:skip', () => this.skip())
        this.bridge.on('panel:open', () => { this.paused = this.active })
        this.bridge.on('panel:close', () => { this.paused = false })
    }

    get phase()
    {
        return this.active ? this.body.phase : null
    }

    start(toId)
    {
        const stateMachine = this.game.stateMachine
        const planets = this.state.planets
        const to = planets.get(toId)
        if(!stateMachine.is(StateMachine.ON_FOOT) || !to || to === planets.current)
            return

        // Reduced motion keeps the short cinematic travel
        if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        {
            this.state.travel.start(toId)
            return
        }

        this.route = buildRoute(planets.current, to, [ ...planets.items, planets.earth ])
        this.body = createBody(this.route, this.state.player.position)
        this.active = true
        this.paused = false
        this.accumulator = 0
        this.boost = 0
        this.wasBoosting = false
        this.mouse.armed = false
        this.updateRender()

        stateMachine.set(StateMachine.BOARDING)
        this.bridge.emit('prompt:hide')
    }

    input()
    {
        _input.x = 0
        _input.y = 0
        _input.boost = false
        _input.slow = false
        if(this.body.phase !== 'flying')
            return _input

        const keys = this.controls.keys.down
        const pointer = this.controls.pointer
        _input.x = (keys.strafeRight ? 1 : 0) - (keys.strafeLeft ? 1 : 0)
        _input.y = (keys.forward ? 1 : 0) - (keys.backward ? 1 : 0)
        _input.boost = keys.boost
        _input.slow = keys.crouch

        // Mouse as a joystick (offset from the screen center), once it has moved during the flight
        if(!this.mouse.armed && Math.hypot(pointer.x - this.mouse.x, pointer.y - this.mouse.y) > MOUSE_ARM_DISTANCE)
            this.mouse.armed = true
        if(this.mouse.armed && pointer.inside)
        {
            _input.x += joystick(pointer.x)
            _input.y += joystick(- pointer.y)
        }
        return _input
    }

    update()
    {
        if(!this.active || this.paused)
            return

        const body = this.body
        const input = this.input()

        if(body.phase === 'flying' && input.boost && !this.wasBoosting && performance.now() / 1000 - this.lastBoostSound > BOOST_SOUND_GAP)
        {
            this.lastBoostSound = performance.now() / 1000
            this.bridge.emit('flight:boost')
        }
        this.wasBoosting = body.phase === 'flying' && input.boost

        this.accumulator += this.state.time.delta
        let steps = 0
        while(this.accumulator >= FIXED_STEP && steps < MAX_STEPS && this.active)
        {
            stepBody(body, input, FIXED_STEP)
            this.accumulator -= FIXED_STEP
            steps++
            this.handleEvents()
        }
        if(steps === MAX_STEPS)
            this.accumulator = Math.min(this.accumulator, FIXED_STEP * 0.999)

        if(!this.active)
            return

        // Floating origin in flight: nothing far from (0, 0, 0) ever wobbles
        if(!this.arrival && body.phase !== 'establish' && body.position.length() > REBASE_DISTANCE)
            this.state.shiftOrigin(body.position.clone())

        this.alpha = this.accumulator / FIXED_STEP
        this.boost = THREE.MathUtils.clamp((body.multiplier - 1) / (BOOST - 1), 0, 1)
        this.updateRender()
    }

    handleEvents()
    {
        const events = this.body.events
        while(events.length)
        {
            const phase = events.shift()
            if(PHASE_STATES[phase])
                this.game.stateMachine.set(PHASE_STATES[phase])
            if(phase === 'flying')
            {
                this.mouse.x = this.controls.pointer.x
                this.mouse.y = this.controls.pointer.y
            }
            if(phase === 'establish')
                this.arrival = this.route.to
            if(phase === 'done')
                this.finish()
        }
    }

    updateRender()
    {
        const body = this.body
        const render = this.render
        render.position.lerpVectors(body.previousPosition, body.position, this.alpha)
        render.quaternion.slerpQuaternions(body.previousQuaternion, body.quaternion, this.alpha)
        render.forward.copy(_zAxis).applyQuaternion(render.quaternion)
        render.up.copy(_yAxis).applyQuaternion(render.quaternion)
        render.frameUp.lerpVectors(body.previousFrameUp, body.frameUp, this.alpha).normalize()
        render.playerPosition.lerpVectors(body.previousPlayerPosition, body.playerPosition, this.alpha)
        render.playerVisibility = body.previousPlayerVisibility + (body.playerVisibility - body.previousPlayerVisibility) * this.alpha
    }

    // Where the astronaut is. Called only by Player.update (the single writer of the player).
    sample(player)
    {
        const phase = this.body.phase
        const render = this.render
        if(phase === 'boarding')
        {
            player.position.copy(this.body.playerPosition)
            player.renderPosition.copy(render.playerPosition)
            player.renderUp.copy(player.up)
            player.visibility = render.playerVisibility
        }
        else if(phase === 'takeoff' || phase === 'flying' || phase === 'landing')
        {
            // Inside the ship: follow it (camera hints, sound, space backdrop use the player)
            player.position.copy(this.body.position)
            player.renderPosition.copy(render.position)
            player.up.copy(render.up)
            player.renderUp.copy(render.up)
            player.facing.copy(render.forward)
            player.visibility = 0
        }
        player.previousPosition.copy(player.position)
        player.speed = 0
        player.isMoving = false
        player.isRunning = false
    }

    // Esc / "Skip flight": the cinematic travel takes over from wherever the ship is
    skip()
    {
        const phase = this.phase
        if(phase !== 'boarding' && phase !== 'takeoff' && phase !== 'flying')
            return

        const to = this.route.to.id
        this.stop()
        this.state.player.visibility = 1
        this.state.travel.start(to, { force: true, fromFlight: phase !== 'boarding' })
    }

    finish()
    {
        const to = this.route.to
        this.stop()
        this.game.stateMachine.set(StateMachine.ON_FOOT)
        this.bridge.emit('location:change', { id: to.id, name: to.name })
    }

    stop()
    {
        this.active = false
        this.paused = false
        this.boost = 0
        this.bridge.emit('flight:hud', null)
    }

    shift(offset)
    {
        if(!this.body)
            return
        shiftBody(this.body, offset)
        this.render.position.sub(offset)
        this.render.playerPosition.sub(offset)
    }
}
