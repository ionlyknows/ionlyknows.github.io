import * as THREE from 'three'
import { vec3, quat2 } from 'gl-matrix'

import Game from '@/Game.js'
import State from '@/State/State.js'
import StateMachine from '@/StateMachine.js'
import CameraThirdPerson from './CameraThirdPerson.js'
import CameraFly from './CameraFly.js'
import CameraChase from './CameraChase.js'

export const WALK_FOV = 45
const BLEND_TIME = 1 // s, when the source changes (walk ↔ flight)

const _position = new THREE.Vector3()
const _quaternion = new THREE.Quaternion()
const smooth = (t) => t * t * (3 - 2 * t)

export default class Camera
{
    static MODE_THIRDPERSON = 1
    static MODE_FLY = 2
    
    constructor(player)
    {
        this.game = Game.getInstance()
        this.state = State.getInstance()

        this.controls = this.state.controls

        this.player = player

        // Plain (double precision) arrays: gl-matrix's default Float32Array rounded the camera position
        this.position = [ 0, 0, 0 ]
        this.quaternion = [ 0, 0, 0, 1, 0, 0, 0, 0 ]
        this.mode = Camera.MODE_THIRDPERSON
        this.fov = WALK_FOV

        this.thirdPerson = new CameraThirdPerson(this.player)
        this.fly = new CameraFly(this.player)
        this.chase = new CameraChase()

        // Blend from the last pose whenever the source changes (third person ↔ chase)
        this.source = this.thirdPerson
        this.blend = { t: 1, position: new THREE.Vector3(), quaternion: new THREE.Quaternion(), fov: WALK_FOV }
        
        // Activate
        if(this.mode === Camera.MODE_THIRDPERSON)
            this.thirdPerson.activate()
        
        else if(this.mode === Camera.MODE_FLY)
            this.fly.activate()

        // The fly camera is a dev tool: reachable only with #debug
        this.controls.events.on('cameraModeDown', () =>
        {
            if(!this.game.debug.active)
                return

            this.setMode(this.mode === Camera.MODE_THIRDPERSON ? Camera.MODE_FLY : Camera.MODE_THIRDPERSON)
        })

        this.setDebug()
    }

    setMode(mode)
    {
        if(mode === this.mode || ![ Camera.MODE_THIRDPERSON, Camera.MODE_FLY ].includes(mode))
            return

        this.mode = mode
        if(this.mode === Camera.MODE_THIRDPERSON)
        {
            this.fly.deactivate()
            this.thirdPerson.activate()
        }
        else
        {
            this.fly.activate(this.position, this.quaternion)
            this.thirdPerson.deactivate()
        }
    }

    shift(offset)
    {
        this.thirdPerson.shift(offset)
        this.chase.shift(offset)
        this.blend.position.sub(offset)
        this.position[0] -= offset.x
        this.position[1] -= offset.y
        this.position[2] -= offset.z
    }

    // Chase camera while the ship is the subject (and while "Skip flight" leaves the air)
    usesChase()
    {
        const flight = this.state.flight
        const travel = this.state.travel
        if(flight.active)
            return flight.phase !== 'establish'
        return this.game.stateMachine.is(StateMachine.TRAVELING) && travel.fromFlight
    }

    update()
    {
        this.thirdPerson.update()
        this.fly.update()
        this.chase.update()

        if(this.mode === Camera.MODE_THIRDPERSON)
        {
            const source = this.usesChase() ? this.chase : this.thirdPerson
            if(source !== this.source)
            {
                this.source = source
                this.blend.t = 0
                this.blend.position.fromArray(this.position)
                this.blend.quaternion.fromArray(this.quaternion)
                this.blend.fov = this.fov
            }
            this.blend.t = Math.min(1, this.blend.t + this.state.time.delta / BLEND_TIME)

            const sourceFov = source === this.chase ? this.chase.fov : WALK_FOV
            const weight = smooth(this.blend.t)
            _position.copy(this.blend.position).lerp(source.position, weight)
            _quaternion.copy(this.blend.quaternion).slerp(source.quaternion, weight)
            this.fov = this.blend.fov + (sourceFov - this.blend.fov) * weight

            _position.toArray(this.position)
            _quaternion.toArray(this.quaternion)
        }

        else if(this.mode === Camera.MODE_FLY)
        {
            vec3.copy(this.position, this.fly.position)
            quat2.copy(this.quaternion, this.fly.quaternion)
        }
    }

    setDebug()
    {
        const debug = this.game.debug

        if(!debug.active)
            return

        const folder = debug.ui.getFolder('state/player/view')

        folder
            .add(
                this,
                'mode',
                {
                    'MODE_THIRDPERSON': Camera.MODE_THIRDPERSON,
                    'MODE_FLY': Camera.MODE_FLY
                }
            )
            .onChange(() =>
            {
                if(this.mode === Camera.MODE_THIRDPERSON)
                {
                    this.fly.deactivate()
                    this.thirdPerson.activate()
                }
                
                else if(this.mode === Camera.MODE_FLY)
                {
                    this.fly.activate(this.position, this.quaternion)
                    this.thirdPerson.deactivate()
                }
            })
    }
}
