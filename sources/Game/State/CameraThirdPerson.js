import * as THREE from 'three'

import State from '@/State/State.js'

const DEG = Math.PI / 180
const UP_FOLLOW_SPEED = 6 // ≈ 0.1 per frame at 60 fps

const _target = new THREE.Vector3()
const _matrix = new THREE.Matrix4()

// Follow camera for small planets. Its up vector eases toward the player's up,
// and its horizontal forward is kept tangent to the surface, so nothing depends
// on world Y and there are no flips at the poles.
export default class CameraThirdPerson
{
    constructor(player)
    {
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
        this.distance = 10
        this.distanceLimits = { min: 4, max: 18 }
        this.pitch = 25 * DEG
        this.pitchLimits = { min: 10 * DEG, max: 70 * DEG }
        this.targetOffset = 1.2
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

        this.up.lerp(this.player.up, 1 - Math.exp(- UP_FOLLOW_SPEED * this.time.delta)).normalize()

        // Mouse drag orbits around `up`; pitch is clamped
        if(this.controls.inputEnabled && (this.controls.pointer.down || this.viewport.pointerLock.active))
        {
            const normalisedPointer = this.viewport.normalise(this.controls.pointer.delta)
            this.forward.applyAxisAngle(this.up, - normalisedPointer.x * 2)
            this.pitch = THREE.MathUtils.clamp(this.pitch + normalisedPointer.y * 2, this.pitchLimits.min, this.pitchLimits.max)
        }

        // Scroll zoom
        if(this.controls.inputEnabled && this.controls.pointer.wheel)
            this.distance = THREE.MathUtils.clamp(this.distance + this.controls.pointer.wheel * 0.01, this.distanceLimits.min, this.distanceLimits.max)

        // Keep forward tangent to the current up
        this.forward.projectOnPlane(this.up)
        if(this.forward.lengthSq() < 1e-6)
            this.forward.copy(this.player.facing)
        this.forward.normalize()

        // Behind and above the player, in the player's local frame
        _target.copy(this.player.position).addScaledVector(this.player.up, this.targetOffset)
        this.position
            .copy(_target)
            .addScaledVector(this.forward, - Math.cos(this.pitch) * this.distance)
            .addScaledVector(this.up, Math.sin(this.pitch) * this.distance)

        _matrix.lookAt(this.position, _target, this.up)
        this.quaternion.setFromRotationMatrix(_matrix)
    }
}
