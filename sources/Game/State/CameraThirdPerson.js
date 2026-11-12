import * as THREE from 'three'

import Game from '@/Game.js'
import State from '@/State/State.js'
import StateMachine from '@/StateMachine.js'
import { cameraClearance } from './PlayerPhysics.js'
import { planarCameraClearance } from './PlanarPhysics.js'

const DEG = Math.PI / 180
const UP_FOLLOW_SPEED = 6 // ≈ 0.1 per frame at 60 fps
const TARGET_DAMPING = 18 // camera target: 1 - exp(-k·dt) (the only smoothing in the chain)
const DISTANCE_RECOVERY = 4 // how fast the camera moves back out after a prop
const IDLE_DELAY = 8 // s without input before the camera drifts
const IDLE_SPEED = 0.06 // rad/s
const DRIVE = { distance: 8.5, pitch: 17 * Math.PI / 180, follow: 3, pullIn: 23 } // M7 rover: behind it, turning with it

const _desired = new THREE.Vector3()
const _direction = new THREE.Vector3()
const _matrix = new THREE.Matrix4()

// Follow camera for small planets. Its up vector eases toward the player's up and its
// forward is kept tangent to the surface, so nothing depends on world Y (no pole flips).
// It follows the player's interpolated render position from this frame; only the target is
// damped. It never enters a prop: the distance shrinks to stay outside it.
export default class CameraThirdPerson
{
    constructor(player)
    {
        this.game = Game.getInstance()
        this.state = State.getInstance()
        this.viewport = this.state.viewport
        this.controls = this.state.controls
        this.time = this.state.time

        this.player = player

        this.active = false
        this.position = new THREE.Vector3()
        this.quaternion = new THREE.Quaternion()
        this.up = player.up.clone()
        this.forward = player.facing.clone()
        this.target = new THREE.Vector3()
        this.distance = 10
        this.currentDistance = 10
        this.distanceLimits = { min: 4, max: 18 }
        this.indoorDistance = 6 // M6 station interior: closer, and never through a wall
        this.indoorLimits = { min: 2.5, max: 9 }
        this.pitch = 25 * DEG
        this.pitchLimits = { min: 10 * DEG, max: 70 * DEG }
        this.targetOffset = 1.2

        this.reset()
    }

    // Snap behind the player (spawn / landing): no lerp from the old pose
    reset()
    {
        this.up.copy(this.player.renderUp)
        this.forward.copy(this.player.facing)
        this.target.copy(this.player.renderPosition).addScaledVector(this.player.renderUp, this.targetOffset)
        this.currentDistance = this.state.interior?.active ? this.indoorDistance : this.distance
        this.driveBlend = 0
    }

    shift(offset)
    {
        this.position.sub(offset)
        this.target.sub(offset)
    }

    activate()
    {
        this.active = true
    }

    deactivate()
    {
        this.active = false
    }

    update()
    {
        if(!this.active)
            return

        // A panel is open: the camera holds its pose exactly (only the scene dims, View/Cinematics.js)
        if(this.game.stateMachine.is(StateMachine.PANEL_OPEN))
            return

        const delta = this.time.delta
        const player = this.player

        this.up.lerp(player.renderUp, 1 - Math.exp(- UP_FOLLOW_SPEED * delta)).normalize()

        // Idle drift: after 8 s without input, slowly orbit around the astronaut
        if(this.game.stateMachine.is(StateMachine.ON_FOOT))
        {
            const idle = (performance.now() - this.controls.lastInputTime) / 1000 - IDLE_DELAY
            if(idle > 0)
                this.forward.applyAxisAngle(this.up, IDLE_SPEED * Math.min(1, idle / 2) * delta)
        }

        const onFoot = this.game.stateMachine.is(StateMachine.ON_FOOT)
        const indoor = this.state.interior.active

        // Mouse drag orbits around `up`; pitch is clamped
        if(this.controls.inputEnabled && onFoot && (this.controls.pointer.down || this.viewport.pointerLock.active))
        {
            const normalisedPointer = this.viewport.normalise(this.controls.pointer.delta)
            this.forward.applyAxisAngle(this.up, - normalisedPointer.x * 2)
            this.pitch = THREE.MathUtils.clamp(this.pitch + normalisedPointer.y * 2, this.pitchLimits.min, this.pitchLimits.max)
        }

        // Scroll zoom
        if(this.controls.inputEnabled && onFoot && this.controls.pointer.wheel)
        {
            if(indoor)
                this.indoorDistance = THREE.MathUtils.clamp(this.indoorDistance + this.controls.pointer.wheel * 0.01, this.indoorLimits.min, this.indoorLimits.max)
            else
                this.distance = THREE.MathUtils.clamp(this.distance + this.controls.pointer.wheel * 0.01, this.distanceLimits.min, this.distanceLimits.max)
        }
        // Driving (M7): the camera swings in behind the rover (damped), at a fixed distance and pitch
        const driving = this.game.stateMachine.is(StateMachine.DRIVING)
        if(driving)
            this.forward.lerp(player.facing, 1 - Math.exp(- DRIVE.follow * delta))
        // Distance and pitch ease between walking and driving (no jump getting in or out; walking
        // itself is unchanged: blend 0)
        this.driveBlend += ((driving ? 1 : 0) - this.driveBlend) * (1 - Math.exp(- 4 * delta))
        const walkDistance = indoor ? this.indoorDistance : this.distance
        const distance = walkDistance + (DRIVE.distance - walkDistance) * this.driveBlend
        const pitch = this.pitch + (DRIVE.pitch - this.pitch) * this.driveBlend

        // Keep forward tangent to the current up
        this.forward.projectOnPlane(this.up)
        if(this.forward.lengthSq() < 1e-6)
            this.forward.copy(player.facing)
        this.forward.normalize()

        // Damped target on this frame's interpolated player position
        _desired.copy(player.renderPosition).addScaledVector(player.renderUp, this.targetOffset)
        this.target.lerp(_desired, 1 - Math.exp(- TARGET_DAMPING * delta))

        // Behind and above the player; pulled in (immediately) if a prop is in the way,
        // eased back out once it's clear
        _direction.copy(this.forward).multiplyScalar(- Math.cos(pitch)).addScaledVector(this.up, Math.sin(pitch)).normalize()
        // Indoors the ray is tested against every wall and the ceiling, so it never clips through
        const allowed = indoor
            ? planarCameraClearance(this.state.interior.room, this.target, _direction, distance)
            : cameraClearance(this.state.planets.current, this.target, _direction, distance)
        // Walking: pulled in at once. Driving (M7): a prop the rover passes would snap the camera from
        // 8.5 to 1.5 m in one frame, so it is pulled in very fast instead (90% in 0.1 s; the camera
        // spheres are larger than the props, so it stays clear of them)
        if(allowed < this.currentDistance)
            this.currentDistance = this.driveBlend > 0.5 ? this.currentDistance + (allowed - this.currentDistance) * (1 - Math.exp(- DRIVE.pullIn * delta)) : allowed
        else
            this.currentDistance += (Math.min(allowed, distance) - this.currentDistance) * (1 - Math.exp(- DISTANCE_RECOVERY * delta))

        this.position.copy(this.target).addScaledVector(_direction, this.currentDistance)

        _matrix.lookAt(this.position, this.target, this.up)
        this.quaternion.setFromRotationMatrix(_matrix)
    }
}
