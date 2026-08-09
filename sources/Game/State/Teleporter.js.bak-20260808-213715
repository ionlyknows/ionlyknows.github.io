import gsap from 'gsap'

import Game from '@/Game.js'
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
        this.tween = { x: 0, z: 0, rotation: 0, theta: 0, phi: 0, distance: 0, aboveOffset: 0 }
        this.activeTween = null
        this.origin = null // where to fly back to on close
    }

    isBusy()
    {
        return !!this.activeTween
    }

    flyToWork(duration = 1.6)
    {
        return this._flyTo(this._computeWorkViewpoint(), duration)
    }

    // Solves the player standoff position + camera look-height offset that
    // puts the billboard screen centred and fully framed, sized to the
    // *current* viewport aspect ratio and live camera FOV -- rather than a
    // single hand-tuned (x, z, theta, phi, distance) baked in for one window
    // size. This has to be recomputed on every call (not cached once) because
    // it depends on:
    //  - the billboard's terrain-resolved ground height (only known once the
    //    surrounding chunk's terrain worker has finished), and
    //  - the live window aspect ratio (the player can resize the window or
    //    rotate their device between visits to the billboard).
    _computeWorkViewpoint()
    {
        const game = Game.getInstance()
        const billboard = game.view.billboard
        const cameraInstance = game.view.camera.instance
        const chunks = this.state.chunks
        const config = BILLBOARD.viewpoint

        const billboardX = BILLBOARD.structurePosition[0]
        const billboardZ = BILLBOARD.structurePosition[2]
        const screenCenterY = billboard.screenCenterY
        const billboardGroundElevation = billboard.groundElevation

        // Distance needed for the full screen (width AND height, since on a
        // narrow/portrait viewport the horizontal FOV is the tighter
        // constraint even though the screen itself is wider than it is tall)
        // to fit inside the camera's FOV, with a comfortable margin.
        const aspect = Number.isFinite(cameraInstance.aspect) && cameraInstance.aspect > 0
            ? cameraInstance.aspect
            : 16 / 9
        const verticalFov = cameraInstance.fov * Math.PI / 180
        const horizontalFov = 2 * Math.atan(Math.tan(verticalFov * 0.5) * aspect)

        const halfHeight = (BILLBOARD.screenHeight * 0.5) * config.framingPadding
        const halfWidth = (BILLBOARD.screenWidth * 0.5) * config.framingPadding

        const distanceForHeight = halfHeight / Math.tan(verticalFov * 0.5)
        const distanceForWidth = halfWidth / Math.tan(horizontalFov * 0.5)
        const requiredDistance = Math.min(
            Math.max(distanceForHeight, distanceForWidth),
            config.maxStandoffDistance
        )

        // Split that straight-line distance into a horizontal (Z) run and the
        // screen's own vertical offset above the ground, Pythagorean-style.
        // The ground elevation at the player's *future* spot isn't known yet
        // here (it depends on where we're about to place them), so this step
        // approximates it with the billboard's own ground height -- over the
        // handful of metres involved that's well inside the framing padding's
        // margin. The exact vertical aim below does not rely on this
        // approximation, only the standoff distance's rough sizing does.
        const approxVerticalGap = screenCenterY - billboardGroundElevation
        const minZGap = config.orbitDistance * 2
        const zGap = approxVerticalGap < requiredDistance
            ? Math.max(Math.sqrt(requiredDistance ** 2 - approxVerticalGap ** 2), minZGap)
            : Math.max(requiredDistance, minZGap)

        const viewpointZ = billboardZ + zGap - config.orbitDistance

        const rawElevation = chunks.getElevationForPosition(billboardX, viewpointZ)
        const playerGroundElevation = typeof rawElevation === 'number' ? rawElevation : billboardGroundElevation

        // Exact vertical aim. CameraThirdPerson always looks at
        // (player.x, player.y + aboveOffset, player.z) -- never at an
        // arbitrary world point -- so precise framing has to work within that
        // constraint rather than around it. With phi locked to Math.PI * 0.5,
        // the camera sits exactly `orbitDistance` beyond the player along Z at
        // the player's own ground height (no vertical component from the
        // orbit itself). That makes the player-to-target rise and the
        // player-to-screen rise similar triangles sharing the same camera apex,
        // so aboveOffset solves out exactly -- the screen lands centred
        // regardless of any terrain-height mismatch between the player's spot
        // and the billboard's.
        const cameraToScreenZGap = zGap
        const triangleRatio = cameraToScreenZGap / config.orbitDistance
        const aboveOffset = Math.max((screenCenterY - playerGroundElevation) / triangleRatio, 1)

        return {
            x: billboardX,
            z: viewpointZ,
            rotation: config.rotation,
            theta: config.theta,
            phi: config.phi,
            distance: config.orbitDistance,
            aboveOffset
        }
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
                distance: camera.distance,
                aboveOffset: camera.aboveOffset
            }
        }

        this.tween.x = player.position.current[0]
        this.tween.z = player.position.current[2]
        this.tween.rotation = player.rotation
        this.tween.theta = camera.theta
        this.tween.phi = camera.phi
        this.tween.distance = camera.distance
        this.tween.aboveOffset = camera.aboveOffset

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
                aboveOffset: target.aboveOffset,
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
                    camera.aboveOffset = this.tween.aboveOffset
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
