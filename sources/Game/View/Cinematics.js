import * as THREE from 'three'
import gsap from 'gsap'

import Game from '@/Game.js'
import View from '@/View/View.js'
import State from '@/State/State.js'
import StateMachine from '@/StateMachine.js'
import UIBridge from '../../UI/UIBridge.js'
import { BASE_FOV } from './Camera.js'
import { ATMOSPHERE_SCALE } from './Materials/atmosphere.js'
import { DURATIONS as FLIGHT_DURATIONS } from '@/State/FlightPhysics.js'
import { HANGAR_SHOTS } from '@/State/CameraChase.js'

const INTRO_SEEN_KEY = 'apeiron.introSeen'
const FOCUS_SPEED = 6 // ≈ 0.6 s ease toward the beacon
const ORBIT_DISTANCE = 2.8 // × destination radius (arrival establishing shot)
const ORBIT_SWEEP = 0.9 // rad
// M6b intro (first visit): the ship starts its docking approach at SHIP s; the camera, after the
// title and the Earth pass, meets it behind the ship at HANDOVER s and hands over to the chase camera.
// Launch to on foot in the hangar: about 13 s (the docking takes about 6.4 s after SHIP, then the arrival shot)
const INTRO_TIMES = { ship: 4.8, handover: 6.2 }
const CHASE = { distance: 11, height: 3.2, ahead: 8 } // State/CameraChase.js pose
const INTRO_FOV = 60 // = the flight camera's FOV

const _target = new THREE.Vector3()
const _head = new THREE.Vector3()
const _direction = new THREE.Vector3()
const _matrix = new THREE.Matrix4()
const _position = new THREE.Vector3()
const _offset = new THREE.Vector3()
const _up = new THREE.Vector3()
const _worldUp = new THREE.Vector3(0, 1, 0)
const _right = new THREE.Vector3()

export function lookAtPose(override, position, target, up)
{
    override.position.copy(position)
    _matrix.lookAt(position, target, up)
    override.quaternion.setFromRotationMatrix(_matrix)
}

const smooth = (t) => t * t * (3 - 2 * t)
const damp = (current, target, speed, delta) => current + (target - current) * (1 - Math.exp(- speed * delta))

// Opening sequence (M6b: stars, title, Earth pass, the ship docking at Apeiron Station, the astronaut
// in the hangar), focus shot, arrival establishing shot and full-screen fades (black, flash, dim).
// Writes only into view.camera.override (an input of the camera system, never the camera
// itself); the gameplay camera is used when weight = 0. Idle drift lives in CameraThirdPerson.
export default class Cinematics
{
    constructor()
    {
        this.game = Game.getInstance()
        this.view = View.getInstance()
        this.state = State.getInstance()
        this.bridge = UIBridge.getInstance()

        this.override = this.view.camera.override
        this.focus = { weight: 0, point: null }
        this.intro = null

        this.setScreen()
        this.warp = this.view.space.warp

        this.game.stateMachine.events.on('change', (state, previous) => this.onStateChange(state, previous))
        this.state.controls.events.on('escapeDown', () => this.skipIntro())
        this.state.planets.events.on('originShift', (offset) => this.override.position.sub(offset))
        this.bridge.on('intro:skip', () => this.skipIntro())
    }

    // Camera-attached quad for fade-from-black, arrival flash and panel dim
    setScreen()
    {
        this.screen = { black: 1, flash: 0, dim: 0 }
        this.screen.material = new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 1, depthTest: false, depthWrite: false, fog: false, toneMapped: false })
        this.screen.mesh = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), this.screen.material)
        this.screen.mesh.position.z = - 0.2
        this.screen.mesh.renderOrder = 9999
        this.screen.mesh.frustumCulled = false
        this.view.camera.instance.add(this.screen.mesh)
    }

    onStateChange(state, previous)
    {
        if(state === StateMachine.INTRO)
            this.playIntro()

        // The intro's docking finished (State/Flight.js): on foot in the hangar
        if(state === StateMachine.ON_FOOT && previous === StateMachine.INTRO && this.intro)
            this.finishIntro()

        if(state === StateMachine.ON_FOOT)
        {
            // Control is back: nothing cinematic may keep writing
            gsap.killTweensOf(this.override)
            this.resetFlight()
            if(previous === StateMachine.INTRO || previous === StateMachine.LANDING)
                this.override.weight = 0
            this.state.controls.lastInputTime = performance.now()
            if(this.screen.black > 0 && !this.intro)
                gsap.to(this.screen, { black: 0, duration: 0.5 })
        }

        if(state === StateMachine.PANEL_OPEN || previous === StateMachine.PANEL_OPEN)
            gsap.to(this.screen, { dim: state === StateMachine.PANEL_OPEN ? 1 : 0, duration: 0.3, ease: 'power2.out', overwrite: true })
    }

    // First visit: stars → APEIRON title → Earth pass with the name and role → the camera meets the
    // ship on its approach → automatic docking (State/Flight.js) → the astronaut in the hangar → hints.
    // Returning visitors: the title over the docking only. Reduced motion: no flight, a fade into the
    // hangar with the title.
    playIntro()
    {
        let seen = false
        try { seen = window.localStorage.getItem(INTRO_SEEN_KEY) === '1' }
        catch {}
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const flight = this.state.flight

        this.intro = { u: 0, fov: BASE_FOV, weight: 0, up: _worldUp.clone(), camera: null, target: null }
        const intro = this.intro
        const beat = (name) => () => this.bridge.emit('intro:beat', { beat: name })
        const timeline = gsap.timeline()
        intro.timeline = timeline
        this.screen.black = 1

        // The hangar is shown only once the station interior has loaded (View.loadDeferred): the
        // timeline holds (on black, or on the shot over the station) until then
        const hold = () =>
        {
            if(this.view.stationInterior)
                return
            timeline.pause()
            this.view.loadDeferred().then(() => { if(this.intro?.timeline === timeline) timeline.resume() })
        }

        if(reduced)
        {
            timeline.call(hold, null, 0)
            timeline.to(this.screen, { black: 0, duration: 0.6 }, 0)
            timeline.call(beat('title'), null, 0.2)
            timeline.call(beat(null), null, 2.2)
            timeline.call(() => this.finishIntro(), null, 2.4)
            return
        }
        if(seen)
        {
            // Returning visitors (about 3 s): the title over the ship settling on the pad
            timeline.call(hold, null, 0)
            timeline.call(() => flight.arriveIntro(true), null, 0.01)
            timeline.to(this.screen, { black: 0, duration: 0.6 }, 0.01)
            timeline.call(beat('title'), null, 0.2)
            timeline.call(beat(null), null, 2.6)
            return
        }

        const { cameraPoints, targetPoints } = this.introPath(flight.previewIntro(false, INTRO_TIMES.handover - INTRO_TIMES.ship))
        intro.camera = new THREE.CatmullRomCurve3(cameraPoints)
        intro.target = new THREE.CatmullRomCurve3(targetPoints)
        intro.weight = 1

        const { ship, handover } = INTRO_TIMES
        const pass = 2.2 // end of the slow opening (stars, title), start of the Earth pass
        const meet = 4.6 // the Earth pass ends over the station; the camera goes to meet the ship
        timeline.to(this.screen, { black: 0, duration: 1.2, ease: 'power1.out' }, 0)
        timeline.call(beat('title'), null, 0.6)
        timeline.to(intro, { u: 0.15, duration: pass, ease: 'none' }, 0)
        timeline.to(intro, { u: 0.62, duration: meet - pass, ease: 'power1.inOut' }, pass)
        timeline.call(beat('name'), null, 2.6)
        timeline.call(hold, null, ship - 0.05)
        timeline.call(beat(null), null, 5.8)
        timeline.to(intro, { u: 1, duration: handover - meet, ease: 'power2.inOut' }, meet)
        timeline.to(intro, { fov: INTRO_FOV, duration: handover - meet, ease: 'sine.inOut' }, meet)
        timeline.call(() => flight.arriveIntro(false), null, ship)
        timeline.to(intro, { weight: 0, duration: 1.0, ease: 'sine.inOut' }, handover)
    }

    // Camera path of the first-visit intro (scene space): far out with Earth ahead, a low pass over
    // Earth toward the Philippines beacon, over Apeiron Station, then behind the arriving ship
    // (where the chase camera will be at the handover)
    introPath(ship)
    {
        const station = this.state.interior.center
        const earth = this.state.planets.earth
        const beacon = this.view.earth.beaconPosition
        const up = _worldUp
        const toEarth = new THREE.Vector3().subVectors(earth.center, station).normalize()
        const around = (angle, distance, height) => toEarth.clone().negate().applyAxisAngle(up, angle).multiplyScalar(distance).add(earth.center).addScaledVector(up, height)

        const far = around(1.4, earth.radius + 130, 45)
        const pass = around(0.85, earth.radius * ATMOSPHERE_SCALE + 15, 7) // 15 above the atmosphere shell
        const over = station.clone().addScaledVector(up, 34).addScaledVector(toEarth, 6)
        const behind = ship.position.clone().addScaledVector(ship.forward, - CHASE.distance).addScaledVector(ship.up, CHASE.height)
        const ahead = ship.position.clone().addScaledVector(ship.forward, CHASE.ahead).addScaledVector(ship.up, 1)

        return {
            cameraPoints: [ far, pass, over, behind ],
            targetPoints: [ earth.center.clone().addScaledVector(up, 20), beacon.clone(), station.clone(), ahead ]
        }
    }

    // Esc / Skip: straight into the hangar (once the interior has loaded)
    skipIntro()
    {
        if(!this.intro || !this.game.stateMachine.is(StateMachine.INTRO))
            return
        if(this.view.stationInterior)
            return this.finishIntro(true)
        const intro = this.intro
        intro.timeline.pause()
        gsap.to(this.screen, { black: 1, duration: 0.3 })
        this.view.loadDeferred().then(() => { if(this.intro === intro) this.finishIntro(true) })
    }

    // skipped: Esc / Skip (straight to standing in the hangar, from black)
    finishIntro(skipped = false)
    {
        if(!this.intro)
            return
        this.intro.timeline.kill()
        this.intro = null

        gsap.killTweensOf(this.screen)
        this.override.weight = 0
        this.override.fov = BASE_FOV
        this.bridge.emit('intro:beat', { beat: null })

        try { window.localStorage.setItem(INTRO_SEEN_KEY, '1') }
        catch {}

        this.state.flight.endIntro()
        this.screen.black = skipped ? 1 : 0 // fades in on ON_FOOT
        this.game.stateMachine.set(StateMachine.ON_FOOT)
        this.view.hints.show()
    }

    updateIntro()
    {
        const intro = this.intro
        intro.camera.getPoint(intro.u, this.override.position)
        intro.target.getPoint(intro.u, _target)
        lookAtPose(this.override, this.override.position, _target, intro.up)
        this.override.fov = intro.fov
        this.override.weight = smooth(intro.weight)
    }

    // Ease toward the beacon before a panel opens, ease back on close
    updateFocus(delta)
    {
        const player = this.state.player
        if(player.focusPoint)
            this.focus.point = player.focusPoint

        this.focus.weight = damp(this.focus.weight, player.focusPoint ? 1 : 0, FOCUS_SPEED, delta)
        if(this.focus.weight < 0.001 || !this.focus.point)
        {
            this.override.weight = 0
            return
        }

        const point = this.focus.point
        _target.copy(point.position).addScaledVector(point.up, 2.2)
        _head.copy(player.renderPosition).addScaledVector(player.renderUp, 1.6)
        _direction.subVectors(_target, _head).normalize()
        _head.addScaledVector(_direction, - 3.5).addScaledVector(player.up, 1.2)

        lookAtPose(this.override, _head, _target, player.renderUp)
        this.override.fov = BASE_FOV
        this.override.weight = smooth(this.focus.weight)
    }

    // Arrival (after touchdown): a wide shot of the destination sweeping around its landing point,
    // a white flash, then it settles behind the astronaut. Reduced motion / skip: no flash.
    updateFlightEstablish(flight)
    {
        const t = THREE.MathUtils.clamp(flight.body.time / FLIGHT_DURATIONS.establish, 0, 1)
        this.screen.flash = flight.skipped ? 0 : Math.max(0, 1 - flight.body.time / 0.5)
        this.override.fov = BASE_FOV
        if(flight.quick)
        {
            this.override.weight = 0
            return
        }

        const planet = flight.route.to
        const player = this.state.player
        const progress = t

        // Apeiron Station: the docking shot inside the hangar, then behind the astronaut (no flash)
        if(planet.hangar)
        {
            const pad = flight.route.endPad
            const [ side, ahead, height ] = HANGAR_SHOTS.dock
            this.screen.flash = 0
            _right.crossVectors(pad.forward, pad.up)
            _position.copy(pad.position).addScaledVector(pad.up, height).addScaledVector(_right, side).addScaledVector(pad.forward, ahead)
            _target.copy(pad.position).addScaledVector(pad.up, 1.4)
            lookAtPose(this.override, _position, _target, pad.up)
            this.override.weight = 1 - smooth(THREE.MathUtils.clamp((t - 0.35) / 0.65, 0, 1))
            return
        }
        _up.subVectors(planet.landingPoint, planet.center).normalize()
        _offset.copy(_up).multiplyScalar(0.55).addScaledVector(player.facing, 0.85).normalize()
        _offset.applyAxisAngle(_up, - ORBIT_SWEEP * (1 - progress))
        _position.copy(planet.center).addScaledVector(_offset, planet.radius * ORBIT_DISTANCE)
        _target.copy(planet.center).addScaledVector(_up, planet.radius * 0.4)
        lookAtPose(this.override, _position, _target, _up)
        this.override.weight = 1 - smooth(THREE.MathUtils.clamp((t - 0.35) / 0.65, 0, 1))
    }

    // M6 hologram orbit mode: around the miniature system above the station projector
    updateOrbit()
    {
        const interior = this.state.interior
        const orbit = interior.orbit
        _target.copy(interior.center).y += 2.6
        _position.set(Math.sin(orbit.yaw) * Math.cos(orbit.pitch), Math.sin(orbit.pitch), Math.cos(orbit.yaw) * Math.cos(orbit.pitch)).multiplyScalar(orbit.distance).add(_target)
        lookAtPose(this.override, _position, _target, _worldUp)
        this.override.fov = BASE_FOV
        this.override.weight = smooth(Math.min(1, orbit.weight))
    }

    resetFlight()
    {
        this.warp.amount = 0
        this.screen.flash = 0
    }

    updateScreen()
    {
        const { flash, dim } = this.screen
        const black = Math.max(this.screen.black, this.state.flight.fade)
        const opacity = Math.max(black, flash, dim * 0.35)

        this.screen.mesh.visible = opacity > 0.001
        this.screen.material.opacity = opacity
        this.screen.material.color.set(flash > black && flash > dim * 0.35 ? '#ffffff' : '#000000')
    }

    update()
    {
        const stateMachine = this.game.stateMachine
        const delta = this.state.time.delta

        if(this.state.flight.phase === 'establish')
        {
            this.focus.weight = 0
            this.resetFlight()
            this.updateFlightEstablish(this.state.flight)
        }
        else if(stateMachine.is(StateMachine.INTRO) && this.intro?.camera && this.intro.weight > 0.001)
        {
            this.resetFlight()
            this.updateIntro()
        }
        else if(this.state.interior.orbit.weight > 0.001)
        {
            this.focus.weight = 0
            this.resetFlight()
            this.updateOrbit()
        }
        else
        {
            this.resetFlight()
            this.updateFocus(delta)
        }

        // Boost (M3): warp streaks along the ship's heading
        const flight = this.state.flight
        if(flight.active && flight.boost > 0.01)
        {
            this.view.space.warp.amount = flight.boost
            this.view.space.warp.direction.copy(flight.render.forward)
        }

        this.updateScreen()
    }
}
