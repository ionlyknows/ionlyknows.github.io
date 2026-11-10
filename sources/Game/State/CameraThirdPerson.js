import { vec3, quat2, mat4 } from 'gl-matrix'

import State from '@/State/State.js'

export default class CameraThirdPerson
{
    constructor(player)
    {
        this.state = State.getInstance()
        this.viewport = this.state.viewport
        this.controls = this.state.controls

        this.player = player

        this.active = false
        this.gameUp = vec3.fromValues(0, 1, 0)
        this.position = vec3.create()
        this.quaternion = quat2.create()
        this.distance = 15
        this.distanceLimits = { min: 4, max: 24 }
        this.phi = Math.PI * 0.45
        this.theta = - Math.PI * 0.25
        this.aboveOffset = 2
        this.phiLimits = { min: 0.1, max: Math.PI - 0.1 }
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

        // Phi and theta. Gated by controls.inputEnabled (the UI flips it off
        // while a panel is open); pointer.delta keeps accumulating from raw
        // window events regardless (see Controls.setPointer()).
        if(this.controls.inputEnabled && (this.controls.pointer.down || this.viewport.pointerLock.active))
        {
            const normalisedPointer = this.viewport.normalise(this.controls.pointer.delta)
            this.phi -= normalisedPointer.y * 2
            this.theta -= normalisedPointer.x * 2

            if(this.phi < this.phiLimits.min)
                this.phi = this.phiLimits.min
            if(this.phi > this.phiLimits.max)
                this.phi = this.phiLimits.max
        }

        // Scroll toward the character to zoom in and away to zoom out.
        // Limits preserve a useful third-person view and avoid camera clipping.
        if(this.controls.inputEnabled && this.controls.pointer.wheel)
        {
            this.distance += this.controls.pointer.wheel * 0.01
            this.distance = Math.min(this.distanceLimits.max, Math.max(this.distanceLimits.min, this.distance))
        }
        
        // Position
        const sinPhiRadius = Math.sin(this.phi) * this.distance
        const sphericalPosition = vec3.fromValues(
            sinPhiRadius * Math.sin(this.theta),
            Math.cos(this.phi) * this.distance,
            sinPhiRadius * Math.cos(this.theta)
        )
        vec3.add(this.position, this.player.position.current, sphericalPosition)

        // Target
        const target = vec3.fromValues(
            this.player.position.current[0],
            this.player.position.current[1] + this.aboveOffset,
            this.player.position.current[2]
        )

        // Quaternion
        const toTargetMatrix = mat4.create()
        mat4.targetTo(toTargetMatrix, this.position, target, this.gameUp)
        quat2.fromMat4(this.quaternion, toTargetMatrix)
    }
}
