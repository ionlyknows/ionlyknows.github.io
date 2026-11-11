import * as THREE from 'three'
import gsap from 'gsap'

import Game from '@/Game.js'
import View from '@/View/View.js'
import State from '@/State/State.js'
import StateMachine from '@/StateMachine.js'
import UIBridge from '../../UI/UIBridge.js'
import { BASE_FOV } from './Camera.js'
import { DURATIONS as FLIGHT_DURATIONS } from '@/State/FlightPhysics.js'

const INTRO_SEEN_KEY = 'apeiron.introSeen'
const FOCUS_SPEED = 6 // ≈ 0.6 s ease toward the beacon
const ORBIT_DISTANCE = 2.8 // × destination radius (arrival establishing shot)
const ORBIT_SWEEP = 0.9 // rad

const _target = new THREE.Vector3()
const _head = new THREE.Vector3()
const _direction = new THREE.Vector3()
const _matrix = new THREE.Matrix4()
const _position = new THREE.Vector3()
const _offset = new THREE.Vector3()
const _up = new THREE.Vector3()

export function lookAtPose(override, position, target, up)
{
    override.position.copy(position)
    _matrix.lookAt(position, target, up)
    override.quaternion.setFromRotationMatrix(_matrix)
}

const smooth = (t) => t * t * (3 - 2 * t)
const damp = (current, target, speed, delta) => current + (target - current) * (1 - Math.exp(- speed * delta))

// Opening sequence, focus shot, arrival establishing shot and full-screen fades (black, flash, dim).
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

    playIntro()
    {
        let seen = false
        try { seen = window.localStorage.getItem(INTRO_SEEN_KEY) === '1' }
        catch {}
        const short = seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches

        const player = this.state.player
        const up = player.up.clone()
        const station = this.state.planets.current
        const earth = this.state.planets.earth
        const beacon = this.view.earth.beaconPosition

        const endPosition = player.camera.thirdPerson.position.clone()
        const endTarget = player.position.clone().addScaledVector(up, player.camera.thirdPerson.targetOffset)
        const behindHigh = endTarget.clone().addScaledVector(up, 22).addScaledVector(player.facing, - 18)

        const toEarth = new THREE.Vector3().subVectors(earth.center, station.center).normalize()
        const side = new THREE.Vector3().crossVectors(toEarth, up).normalize()
        const middle = new THREE.Vector3().addVectors(station.center, earth.center).multiplyScalar(0.5)

        let cameraPoints
        let targetPoints
        if(short)
        {
            cameraPoints = [ behindHigh.clone().addScaledVector(up, 25).addScaledVector(player.facing, - 15), behindHigh, endPosition ]
            targetPoints = [ station.center, endTarget, endTarget ]
        }
        else
        {
            const start = middle.clone().addScaledVector(side, 150).addScaledVector(up, 40)
            cameraPoints = [
                start,
                earth.center.clone().addScaledVector(toEarth, - (earth.radius + 30)).addScaledVector(side, 30).addScaledVector(up, 10),
                earth.center.clone().addScaledVector(toEarth, - (earth.radius + 55)).addScaledVector(side, - 15).addScaledVector(up, - 5),
                behindHigh,
                endPosition
            ]
            targetPoints = [ start.clone().addScaledVector(side, 200).addScaledVector(up, 30), beacon, beacon, endTarget, endTarget ]
        }

        this.intro = {
            u: 0,
            fov: BASE_FOV,
            up,
            camera: new THREE.CatmullRomCurve3(cameraPoints),
            target: new THREE.CatmullRomCurve3(targetPoints)
        }

        const intro = this.intro
        const beat = (name) => () => this.bridge.emit('intro:beat', { beat: name })
        const timeline = gsap.timeline({ onComplete: () => this.finishIntro() })

        this.screen.black = 1
        if(short)
        {
            timeline.to(this.screen, { black: 0, duration: 0.4 }, 0)
            timeline.call(beat('title'), null, 0.1)
            timeline.call(beat(null), null, 2.2)
            timeline.to(intro, { u: 1, duration: 3, ease: 'power2.inOut' }, 0)
        }
        else
        {
            timeline.to(this.screen, { black: 0, duration: 1.6, ease: 'power1.out' }, 0)
            timeline.call(beat('title'), null, 1.2)
            timeline.to(intro, { u: 0.12, duration: 3.8, ease: 'none' }, 0)
            timeline.to(intro, { u: 0.55, duration: 4.4, ease: 'power1.inOut' }, 3.8)
            timeline.call(beat('name'), null, 4.6)
            timeline.call(beat(null), null, 8.6)
            timeline.to(intro, { u: 1, duration: 4.2, ease: 'power2.inOut' }, 8.2)
            timeline.to(intro, { fov: 62, duration: 2, ease: 'sine.inOut' }, 8.2)
            timeline.to(intro, { fov: BASE_FOV, duration: 2.2, ease: 'sine.inOut' }, 10.2)
        }

        this.intro.timeline = timeline
    }

    skipIntro()
    {
        if(this.intro && this.game.stateMachine.is(StateMachine.INTRO))
            this.finishIntro()
    }

    finishIntro()
    {
        this.intro?.timeline.kill()
        this.intro = null

        gsap.killTweensOf(this.screen)
        this.screen.black = 0
        this.override.weight = 0
        this.override.fov = BASE_FOV
        this.bridge.emit('intro:beat', { beat: null })

        try { window.localStorage.setItem(INTRO_SEEN_KEY, '1') }
        catch {}

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
        this.override.weight = 1
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
        _up.subVectors(planet.landingPoint, planet.center).normalize()
        _offset.copy(_up).multiplyScalar(0.55).addScaledVector(player.facing, 0.85).normalize()
        _offset.applyAxisAngle(_up, - ORBIT_SWEEP * (1 - progress))
        _position.copy(planet.center).addScaledVector(_offset, planet.radius * ORBIT_DISTANCE)
        _target.copy(planet.center).addScaledVector(_up, planet.radius * 0.4)
        lookAtPose(this.override, _position, _target, _up)
        this.override.weight = 1 - smooth(THREE.MathUtils.clamp((t - 0.35) / 0.65, 0, 1))
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

        if(stateMachine.is(StateMachine.INTRO) && this.intro)
            this.updateIntro()
        else if(this.state.flight.phase === 'establish')
        {
            this.focus.weight = 0
            this.resetFlight()
            this.updateFlightEstablish(this.state.flight)
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
