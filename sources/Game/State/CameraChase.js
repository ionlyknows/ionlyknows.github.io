import * as THREE from 'three'

import State from '@/State/State.js'

const FLY_FOV = 60
const BOOST_FOV = 72
const SHOT_FOV = 50 // take-off / landing angles
const DISTANCE = 11
const HEIGHT = 3.2
const LOOK_AHEAD = 8
const POSITION_DAMPING = 5 // 1 - exp(-k·dt): frame-rate independent
const UP_DAMPING = 4
const BANK_FOLLOW = 0.4 // share of the ship's bank the camera takes
const ORBIT_DISTANCE = 9 // autopilot orbit shot

const _desired = new THREE.Vector3()
const _target = new THREE.Vector3()
const _up = new THREE.Vector3()
const _right = new THREE.Vector3()
const _shotPosition = new THREE.Vector3()
const _shotTarget = new THREE.Vector3()
const _matrix = new THREE.Matrix4()
const _quaternion = new THREE.Quaternion()

const smoothstep = (edge0, edge1, x) =>
{
    const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1)
    return t * t * (3 - 2 * t)
}

// Flight camera: behind and slightly above the ship, banking a little with it, wider FOV when
// boosting. It follows the ship's interpolated render pose; only its position and up are damped.
// Take-off and landing get short cinematic angles from beside the pad, blended in and out.
// Autopilot (M5): during the cruise the camera also swings round the ship (front 3/4 → side).
export default class CameraChase
{
    constructor()
    {
        this.state = State.getInstance()
        this.time = this.state.time

        this.position = new THREE.Vector3()
        this.quaternion = new THREE.Quaternion()
        this.fov = FLY_FOV
        this.chasePosition = new THREE.Vector3()
        this.chaseUp = new THREE.Vector3(0, 1, 0)
        this.tracking = false
    }

    shift(offset)
    {
        this.position.sub(offset)
        this.chasePosition.sub(offset)
    }

    // Pose beside a pad, looking at the ship
    shot(pad, side, ahead, height, target)
    {
        _right.crossVectors(pad.forward, pad.up)
        _shotPosition.copy(pad.position).addScaledVector(pad.up, height).addScaledVector(_right, side).addScaledVector(pad.forward, ahead)
        _shotTarget.copy(target).addScaledVector(pad.up, 1)
        _matrix.lookAt(_shotPosition, _shotTarget, pad.up)
        _quaternion.setFromRotationMatrix(_matrix)
    }

    update()
    {
        const flight = this.state.flight
        if(!flight.body)
            return

        const delta = this.time.delta
        const render = flight.render
        const phase = flight.phase // null after "Skip flight": keep chasing the last pose

        // Chase pose (damped)
        _desired.copy(render.position).addScaledVector(render.forward, - DISTANCE).addScaledVector(render.frameUp, HEIGHT)
        _up.copy(render.frameUp).lerp(render.up, BANK_FOLLOW).normalize()
        if(!this.tracking || phase === 'boarding')
        {
            this.chasePosition.copy(_desired)
            this.chaseUp.copy(_up)
            this.tracking = true
        }
        else
        {
            this.chasePosition.lerp(_desired, 1 - Math.exp(- POSITION_DAMPING * delta))
            this.chaseUp.lerp(_up, 1 - Math.exp(- UP_DAMPING * delta)).normalize()
        }
        _target.copy(render.position).addScaledVector(render.forward, LOOK_AHEAD).addScaledVector(render.frameUp, 1)
        this.position.copy(this.chasePosition)
        _matrix.lookAt(this.position, _target, this.chaseUp)
        this.quaternion.setFromRotationMatrix(_matrix)
        this.fov = FLY_FOV + (BOOST_FOV - FLY_FOV) * flight.boost

        // Cinematic angles: take-off seen from beside the pad, landing from beside the destination pad
        let shot = 0
        const tau = flight.body.time
        if(phase === 'boarding')
        {
            this.shot(flight.route.startPad, 12, - 6, 4, render.position)
            shot = 1
        }
        else if(phase === 'takeoff')
        {
            this.shot(flight.route.startPad, 12, - 6, 4, render.position)
            shot = 1 - smoothstep(0.9, 2, tau)
        }
        else if(phase === 'landing')
        {
            this.shot(flight.route.endPad, 15, 5, 6, render.position)
            shot = smoothstep(0, 1.1, tau)
        }
        else if(phase === 'flying' && flight.route.autopilot)
        {
            // Orbit shot in the ship's frame: from ahead-right to beside it, then back to the chase
            const angle = 0.75 + 1.1 * smoothstep(0.4, 3, tau)
            _right.crossVectors(render.forward, render.frameUp)
            _shotPosition.copy(render.position)
                .addScaledVector(render.forward, Math.cos(angle) * ORBIT_DISTANCE)
                .addScaledVector(_right, Math.sin(angle) * ORBIT_DISTANCE)
                .addScaledVector(render.frameUp, 2)
            _matrix.lookAt(_shotPosition, render.position, render.frameUp)
            _quaternion.setFromRotationMatrix(_matrix)
            shot = smoothstep(0.3, 0.9, tau) * (1 - smoothstep(2.4, 3.1, tau))
        }

        if(shot > 0)
        {
            this.position.lerp(_shotPosition, shot)
            this.quaternion.slerp(_quaternion, shot)
            this.fov += (SHOT_FOV - this.fov) * shot
        }

        if(phase === null)
            this.tracking = false
    }

    // The next flight starts by snapping behind the ship again
    reset()
    {
        this.tracking = false
    }
}
