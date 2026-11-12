import * as THREE from 'three'

import Game from '@/Game.js'
import State from '@/State/State.js'
import StateMachine from '@/StateMachine.js'
import UIBridge from '../../UI/UIBridge.js'
import { TELESCOPE } from './PropShapes.js'
import { track } from '../Analytics.js'

const DEG = Math.PI / 180
export const TELESCOPE_FOV = 40 // at 1×; zoom 1×–6× divides it
const ZOOM = { min: 1, max: 6 }
const PITCH = { min: 12 * DEG, max: 88 * DEG }
const RESPONSE = 10 // pan / zoom smoothing, 1 - exp(-k·dt)

const _matrix = new THREE.Matrix4()
const _x = new THREE.Vector3()
const _y = new THREE.Vector3()
const _z = new THREE.Vector3()
const _forward = new THREE.Vector3()

// M7 telescope view (The Observatory): the camera looks out of the big telescope's top end. Drag
// pans the sky, scroll zooms 1×–6×. A camera source of State/Camera.js (position, quaternion, fov);
// it writes nothing else. Esc or E goes back on foot.
export default class Telescope
{
    constructor()
    {
        this.game = Game.getInstance()
        this.state = State.getInstance()
        this.bridge = UIBridge.getInstance()
        this.controls = this.state.controls

        this.position = new THREE.Vector3()
        this.quaternion = new THREE.Quaternion()
        this.direction = new THREE.Vector3(0, 0, 1) // where it looks (world), for the sky highlight
        this.fov = TELESCOPE_FOV
        this.zoom = 1
        this.look = { yaw: 0, pitch: TELESCOPE.elevation, zoom: 1 } // targets
        this.current = { yaw: 0, pitch: TELESCOPE.elevation }
        this.prop = null

        this.controls.events.on('escapeDown', () => this.leave())
        this.controls.events.on('interactDown', () =>
        {
            // E leaves (the same key press that entered is handled by Player first, in ON_FOOT)
            if(this.active && this.entered)
                this.leave()
        })
        this.bridge.on('telescope:exit', () => this.leave())
    }

    get active()
    {
        return this.game.stateMachine.is(StateMachine.TELESCOPE)
    }

    enter(station)
    {
        if(!station || !this.game.stateMachine.is(StateMachine.ON_FOOT))
            return
        this.prop = station.prop
        this.look.yaw = 0
        this.look.pitch = TELESCOPE.elevation
        this.look.zoom = 1
        this.current.yaw = 0
        this.current.pitch = TELESCOPE.elevation
        this.zoom = 1
        this.entered = false
        this.game.stateMachine.set(StateMachine.TELESCOPE)
        this.bridge.emit('prompt:hide')
        this.pose()
        track('explore_use', { id: 'telescope' })
    }

    leave()
    {
        if(this.active)
            this.game.stateMachine.set(StateMachine.ON_FOOT)
    }

    // Eyepiece pose from the telescope's frame (prop matrix, relative to the planet centre)
    pose()
    {
        const planet = this.state.planets.current
        this.prop.matrix.extractBasis(_x, _y, _z)
        _x.normalize()
        _y.normalize()
        _z.normalize()

        // Look direction: yaw about the telescope's up, from its −Z (where the tube points)
        const { yaw, pitch } = this.current
        _forward.copy(_z).multiplyScalar(- Math.cos(pitch) * Math.cos(yaw)).addScaledVector(_x, - Math.cos(pitch) * Math.sin(yaw)).addScaledVector(_y, Math.sin(pitch)).normalize()
        this.direction.copy(_forward)

        // Just past the top end of the tube in its resting direction (the tube stays behind the lens)
        this.position.fromArray(TELESCOPE.pivot).applyMatrix4(this.prop.matrix).add(planet.center)
        this.position.addScaledVector(_y, Math.sin(TELESCOPE.elevation) * TELESCOPE.top).addScaledVector(_z, - Math.cos(TELESCOPE.elevation) * TELESCOPE.top)

        _matrix.lookAt(this.position, _forward.add(this.position), _y)
        this.quaternion.setFromRotationMatrix(_matrix)
        this.fov = TELESCOPE_FOV / this.zoom
    }

    update()
    {
        if(!this.active)
            return
        const delta = this.state.time.delta
        const pointer = this.controls.pointer

        // Slower pans when zoomed in, so the sky moves the same on screen
        if(pointer.down || this.state.viewport.pointerLock.active)
        {
            const normalised = this.state.viewport.normalise(pointer.delta)
            this.look.yaw += normalised.x * 1.6 / this.look.zoom
            this.look.pitch = THREE.MathUtils.clamp(this.look.pitch + normalised.y * 1.6 / this.look.zoom, PITCH.min, PITCH.max)
        }
        if(pointer.wheel)
            this.look.zoom = THREE.MathUtils.clamp(this.look.zoom * Math.exp(- pointer.wheel * 0.002), ZOOM.min, ZOOM.max)

        const k = 1 - Math.exp(- RESPONSE * delta)
        this.current.yaw += (this.look.yaw - this.current.yaw) * k
        this.current.pitch += (this.look.pitch - this.current.pitch) * k
        this.zoom += (this.look.zoom - this.zoom) * k
        this.pose()
        this.entered = true
    }
}
