import * as THREE from 'three'

import Game from '@/Game.js'
import State from '@/State/State.js'
import StateMachine from '@/StateMachine.js'
import UIBridge from '../../UI/UIBridge.js'
import { FIXED_STEP, MAX_STEPS, BOOST, DURATIONS, AUTO_LANDING_SPEED, buildRoute, createBody, createArrival, stepBody, shiftBody, jumpToEnd } from './FlightPhysics.js'

const REBASE_DISTANCE = 500 // floating origin: rebase when the ship is this far from (0, 0, 0)
const MOUSE_DEAD_ZONE = 0.2
const MOUSE_ARM_DISTANCE = 0.08 // the mouse steers once it has moved after take-off
const BOOST_SOUND_GAP = 1.2 // s between two boost whooshes
const CUT_FADE_IN = 0.6 // map trips: from black, already in the ship
const SKIP_FADE = { out: 0.8, in: 1.2 } // "Skip flight": 2 s of fade around the jump to the landing
const QUICK_FADE = { out: 0.6, in: 0.8 } // reduced motion: the whole trip is this fade (about 1.4 s)
// M6b intro: where the ship starts its docking approach (from the alignment point: out along the bay
// axis, to the side, up), its speed and the approach time. Long = first visit, short = returning.
// The intro's arrival: first visit = a docking approach from space; returning visitors = the ship
// already above the pad, turning and settling (1.5 s)
const INTRO = {
    long: { out: 70, side: 18, up: 10, speed: 30, approach: 3 }
}

const PHASE_STATES = { takeoff: 'TAKEOFF', flying: 'FLYING', landing: 'LANDING' } // StateMachine names (no import-time read: module order)

const _input = { x: 0, y: 0, boost: false, slow: false }
const _zAxis = new THREE.Vector3(0, 0, 1)
const _yAxis = new THREE.Vector3(0, 1, 0)

const joystick = (value) => Math.sign(value) * Math.max(0, Math.abs(value) - MOUSE_DEAD_ZONE) / (1 - MOUSE_DEAD_ZONE)

// Every trip is by ship (M5). Launch pad or map → "Fly it yourself" (M3 steering) or "Autopilot"
// (same route, no steering, cinematic angles). Map trips start already inside the ship.
// "Skip flight" fades to black and jumps to the touchdown; reduced motion is only that fade.
// Runs State/FlightPhysics.js in fixed steps: the only writer of the ship (and, through
// sample(), of the player) during flight.
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
        this.fade = 0 // 0…1 black screen (View/Cinematics.js shows it)
        this.fadeTarget = 0
        this.fadeSpeed = 1
        this.skipping = null // { in, quick } while fading out before the jump to the landing
        this.skipped = false // the landing was skipped: no arrival flash
        this.quick = false // reduced motion: no establishing shot either
        this.cameraCut = false // View camera cuts instead of blending (read and cleared by State/Camera.js)
        this.intro = false // M6b: the intro's arrival at the station (the state stays INTRO)

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

        this.bridge.on('flight:request', ({ to, autopilot, cut }) => this.start(to, { autopilot, cut }))
        this.bridge.on('flight:skip', () => this.skip())
        this.bridge.on('panel:open', () => { this.paused = this.active })
        this.bridge.on('panel:close', () => { this.paused = false })
    }

    get phase()
    {
        return this.active ? this.body.phase : null
    }

    // autopilot: no steering. cut: start inside the ship, from black (map trips)
    start(toId, { autopilot = false, cut = false } = {})
    {
        const stateMachine = this.game.stateMachine
        const planets = this.state.planets
        const from = planets.current
        const to = planets.get(toId)
        if(!stateMachine.is(StateMachine.ON_FOOT) || !to || to === from)
            return

        const quick = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        this.route = buildRoute(from, to, [ ...planets.items, planets.earth ], { autopilot: autopilot || quick })
        this.body = createBody(this.route, this.state.player.position, { hatch: from.shipHatch, cut })
        this.active = true
        this.paused = false
        this.accumulator = 0
        this.boost = 0
        this.wasBoosting = false
        this.mouse.armed = false
        this.skipping = null
        this.skipped = false
        this.quick = quick
        this.cameraCut = cut
        this.fade = cut ? 1 : 0
        this.fadeTo(0, CUT_FADE_IN)
        this.updateRender()

        stateMachine.set(cut ? StateMachine.TAKEOFF : StateMachine.BOARDING)
        this.bridge.emit('prompt:hide')

        if(quick)
            this.fastForward(QUICK_FADE, true)
    }

    // M6b intro: the ship's docking approach from space, as pure data (also used to preview it)
    introBody(short)
    {
        const station = this.state.interior.station
        const { rest, approach, axis, up } = station.hangar
        const endPad = { position: rest.position.clone(), quaternion: rest.quaternion.clone(), up: rest.up.clone(), forward: rest.forward.clone(), hangar: true }
        if(short)
            return createArrival({ from: null, to: station, endPad, autopilot: true, baseSpeed: 1, length: 0 }, station.hangar.hover.clone(), 0, 0, true)
        const config = INTRO.long
        const side = new THREE.Vector3().crossVectors(axis, up).normalize()
        const position = approach.clone().addScaledVector(axis, config.out).addScaledVector(side, config.side).addScaledVector(up, config.up)
        const route = { from: null, to: station, endPad, autopilot: true, baseSpeed: config.speed, length: 0 }
        return createArrival(route, position, config.speed, config.approach)
    }

    // The intro: the ship arrives and docks in the hangar; on touchdown the astronaut steps out
    arriveIntro(short)
    {
        this.body = this.introBody(short)
        this.route = this.body.route
        this.active = true
        this.intro = true
        this.paused = false
        this.accumulator = 0
        this.boost = 0
        this.wasBoosting = false
        this.skipping = null
        this.skipped = false
        this.quick = false
        this.cameraCut = true
        this.updateRender()
    }

    // Where the intro ship will be `time` s after arriveIntro (the intro camera meets it there)
    previewIntro(short, time)
    {
        const body = this.introBody(short)
        for(let t = 0; t < time; t += FIXED_STEP)
            stepBody(body, _input, FIXED_STEP)
        return { position: body.position.clone(), forward: body.forward.clone(), up: body.frameUp.clone() }
    }

    // Skip during the intro's arrival: straight to standing in the hangar (Player.update places)
    endIntro()
    {
        if(!this.intro)
            return
        this.intro = false
        this.stop()
        this.skipped = true
        this.arrival = this.route.to
    }

    fadeTo(target, duration)
    {
        this.fadeTarget = target
        this.fadeSpeed = 1 / Math.max(duration, 0.01)
    }

    updateFade(delta)
    {
        const step = this.fadeSpeed * delta
        this.fade = this.fade < this.fadeTarget ? Math.min(this.fadeTarget, this.fade + step) : Math.max(this.fadeTarget, this.fade - step)
    }

    input()
    {
        _input.x = 0
        _input.y = 0
        _input.boost = false
        _input.slow = false
        if(this.body.phase !== 'flying' || this.route.autopilot)
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
        if(!this.active)
        {
            this.updateFade(this.state.time.delta)
            return
        }
        if(this.paused)
            return

        const body = this.body
        this.updateFade(this.state.time.delta)

        // Skip / reduced motion: once the screen is black, jump to the touchdown and fade back in
        if(this.skipping && this.fade >= 1)
        {
            const { quick } = this.skipping
            jumpToEnd(body, quick ? Math.max(0, DURATIONS.establish - this.skipping.in) : 0)
            this.fadeTo(0, this.skipping.in)
            this.skipping = null
            this.skipped = true
            this.cameraCut = true
            this.accumulator = 0
            this.game.stateMachine.set(StateMachine.LANDING)
            this.bridge.emit('flight:hud', null)
            this.handleEvents()
        }

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
        // Autopilot: the cruise reads like a boost (wider FOV, warp streaks)
        this.boost = this.route.autopilot
            ? THREE.MathUtils.clamp((body.speed - AUTO_LANDING_SPEED) / (this.route.baseSpeed - AUTO_LANDING_SPEED), 0, 1) * (body.phase === 'flying' ? 0.7 : 0)
            : THREE.MathUtils.clamp((body.multiplier - 1) / (BOOST - 1), 0, 1)
        this.updateRender()
    }

    handleEvents()
    {
        const events = this.body.events
        while(events.length)
        {
            const phase = events.shift()
            if(PHASE_STATES[phase] && !this.intro)
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

    // Esc / "Skip flight": fade to black, jump to the touchdown, fade in on the establishing shot
    skip()
    {
        const phase = this.phase
        if(this.skipping || (phase !== 'boarding' && phase !== 'takeoff' && phase !== 'flying'))
            return
        this.fastForward(SKIP_FADE, false)
    }

    fastForward(fade, quick)
    {
        this.skipping = { in: fade.in, quick }
        this.fadeTo(1, fade.out)
    }

    finish()
    {
        const to = this.route.to
        const intro = this.intro
        this.intro = false
        this.stop()
        this.game.stateMachine.set(StateMachine.ON_FOOT)
        if(!intro) // the intro starts at the station: its visit is already counted at Launch
            this.bridge.emit('location:change', { id: to.id, name: to.name })
    }

    stop()
    {
        this.active = false
        this.paused = false
        this.skipping = null
        this.fadeTo(0, 0.3)
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
