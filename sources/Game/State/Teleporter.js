import gsap from 'gsap'

import State from '@/State/State.js'
import { BILLBOARD } from '@/View/Billboard.js'

export default class Teleporter
{
    constructor()
    {
        this.state = State.getInstance()

        // Plain tween target -- never touch player.position.current directly
        // from GSAP's own ticker except inside onUpdate, so there's exactly
        // one place that writes to game state each tick.
        this.tween = { x: 0, z: 0, rotation: 0, theta: 0, phi: 0, distance: 0 }
        this.activeTween = null
        this.origin = null // where to fly back to on close
    }

    isBusy()
    {
        return !!this.activeTween
    }

    flyToWork(duration = 1.6)
    {
        return this._flyTo(
            {
                x: BILLBOARD.viewpoint.x,
                z: BILLBOARD.viewpoint.z,
                rotation: BILLBOARD.viewpoint.rotation,
                theta: BILLBOARD.viewpoint.theta,
                phi: BILLBOARD.viewpoint.phi,
                distance: BILLBOARD.viewpoint.distance
            },
            duration
        )
    }

    flyBack(duration = 1.2)
    {
        if(!this.origin)
            return Promise.resolve()

        const target = this.origin
        this.origin = null

        return this._flyTo(target, duration)
    }

    _flyTo(target, duration)
    {
        const player = this.state.player
        const camera = player.camera.thirdPerson

        // Releasing pointer lock stops residual mouse movement from fighting
        // the scripted camera framing while it's mid-tween or a panel is open.
        this.state.viewport.pointerLock.deactivate()

        if(!this.origin)
        {
            this.origin = {
                x: player.position.current[0],
                z: player.position.current[2],
                rotation: player.rotation,
                theta: camera.theta,
                phi: camera.phi,
                distance: camera.distance
            }
        }

        this.tween.x = player.position.current[0]
        this.tween.z = player.position.current[2]
        this.tween.rotation = player.rotation
        this.tween.theta = camera.theta
        this.tween.phi = camera.phi
        this.tween.distance = camera.distance

        if(this.activeTween)
            this.activeTween.kill()

        return new Promise((resolve) =>
        {
            this.activeTween = gsap.to(this.tween, {
                x: target.x,
                z: target.z,
                rotation: target.rotation,
                theta: target.theta,
                phi: target.phi,
                distance: target.distance,
                duration,
                ease: 'power3.inOut',
                onUpdate: () =>
                {
                    player.position.current[0] = this.tween.x
                    player.position.current[2] = this.tween.z
                    player.rotation = this.tween.rotation
                    camera.theta = this.tween.theta
                    camera.phi = this.tween.phi
                    camera.distance = this.tween.distance
                },
                onComplete: () =>
                {
                    this.activeTween = null
                    resolve()
                }
            })
        })
    }
}
