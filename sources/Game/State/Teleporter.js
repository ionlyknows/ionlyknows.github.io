import gsap from 'gsap'

import Game from '@/Game.js'
import * as THREE from 'three'
import State from '@/State/State.js'
import Camera from './Camera.js'
import { BILLBOARD } from '@/View/Billboard.js'

export default class Teleporter
{
    constructor()
    {
        this.state = State.getInstance()

        // Plain tween target -- never touch player.position.current directly
        // from GSAP's own ticker except inside onUpdate, so there's exactly
        // one place that writes to game state each tick.
        this.tween = { x: 0, z: 0, rotation: 0, theta: 0, phi: 0, distance: 0, aboveOffset: 0, heightOffset: 0 }
        this.activeTween = null
        this.origin = null // where to fly back to on close
    }

    isBusy()
    {
        return !!this.activeTween
    }

    flyToWork(duration = 1.6)
    {
        const player = this.state.player

        // The Work shot is only ever scripted through CameraThirdPerson's
        // theta/phi/distance/aboveOffset/heightOffset. If the player happens
        // to be in fly-cam mode (V), Camera#update() would keep rendering
        // CameraFly's position instead and the framing below would silently
        // have no visible effect.
        if(player.camera.mode !== Camera.MODE_THIRDPERSON)
        {
            player.camera.fly.deactivate()
            player.camera.thirdPerson.activate()
            player.camera.mode = Camera.MODE_THIRDPERSON
        }

        // Snapshot exactly what "restore on ESC" means, captured fresh on
        // every visit (not just the first -- see the note on _flyTo() about
        // why this can no longer be left to an implicit null-check there).
        const camera = player.camera.thirdPerson
        this.origin = {
            x: player.position.current[0],
            z: player.position.current[2],
            rotation: player.rotation,
            theta: camera.theta,
            phi: camera.phi,
            distance: camera.distance,
            aboveOffset: camera.aboveOffset,
            heightOffset: camera.heightOffset
        }

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

        // Distance needed for the full housing -- frame + beacons, not just
        // the inner screen plane -- (width AND height, since on a
        // narrow/portrait viewport the horizontal FOV is the tighter
        // constraint even though the structure is wider than it is tall) to
        // fit inside the camera's FOV, with a comfortable margin.
        const aspect = Number.isFinite(cameraInstance.aspect) && cameraInstance.aspect > 0
            ? cameraInstance.aspect
            : 16 / 9
        const verticalFov = cameraInstance.fov * Math.PI / 180
        const horizontalFov = 2 * Math.atan(Math.tan(verticalFov * 0.5) * aspect)

        const halfHeight = (BILLBOARD.frameHeight * 0.5) * config.framingPadding
        const halfWidth = (BILLBOARD.frameWidth * 0.5) * config.framingPadding

        const distanceForHeight = halfHeight / Math.tan(verticalFov * 0.5)
        const distanceForWidth = halfWidth / Math.tan(horizontalFov * 0.5)
        const requiredDistance = Math.min(
            Math.max(distanceForHeight, distanceForWidth),
            config.maxStandoffDistance
        )

        // The player stands back far enough that, combined with the camera's
        // own orbitDistance behind them, the total camera-to-billboard
        // distance equals requiredDistance.
        const minZGap = config.orbitDistance * 2
        const zGap = Math.max(requiredDistance, minZGap)
        const viewpointZ = billboardZ + zGap - config.orbitDistance

        const rawElevation = chunks.getElevationForPosition(billboardX, viewpointZ)
        const playerGroundElevation = typeof rawElevation === 'number' ? rawElevation : billboard.groundElevation

        // Vertical aim. CameraThirdPerson always looks at
        // (player.x, player.y + aboveOffset, player.z) and positions the
        // camera at (player position + orbit offset + heightOffset) -- so
        // rather than leaving the camera at the player's ground height and
        // tilting the look target way up (which distorts the FOV-based
        // requiredDistance above, since that math assumes a level shot), the
        // camera itself is raised to the target's height too. aboveOffset and
        // heightOffset therefore end up equal: both the camera and its look
        // target sit at the screen's own centre height, giving a level,
        // fully-framed shot at (roughly) the requested camera height.
        const aboveOffset = Math.max(screenCenterY - playerGroundElevation, 1)

        return {
            x: billboardX,
            z: viewpointZ,
            rotation: config.rotation,
            theta: config.theta,
            phi: config.phi,
            distance: config.orbitDistance,
            aboveOffset,
            heightOffset: aboveOffset
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

    flyToCertificate(board, duration = 1.35)
    {
        const player = this.state.player
        if(player.camera.mode !== Camera.MODE_THIRDPERSON)
        {
            player.camera.fly.deactivate()
            player.camera.thirdPerson.activate()
            player.camera.mode = Camera.MODE_THIRDPERSON
        }

        const camera = player.camera.thirdPerson
        this.origin = {
            x: player.position.current[0], z: player.position.current[2], rotation: player.rotation,
            theta: camera.theta, phi: camera.phi, distance: camera.distance,
            aboveOffset: camera.aboveOffset, heightOffset: camera.heightOffset
        }

        const game = Game.getInstance()
        const cameraInstance = game.view.camera.instance
        const screenPosition = board.screen.getWorldPosition(new THREE.Vector3())
        const front = board.root.getWorldDirection(new THREE.Vector3()).normalize()
        const aspect = cameraInstance.aspect > 0 ? cameraInstance.aspect : 16 / 9
        const verticalFov = cameraInstance.fov * Math.PI / 180
        const horizontalFov = 2 * Math.atan(Math.tan(verticalFov * 0.5) * aspect)
        const halfHeight = 15 * 0.58
        const halfWidth = board.screen.geometry.parameters.width * 0.58
        const viewDistance = Math.max(
            halfHeight / Math.tan(verticalFov * 0.5),
            halfWidth / Math.tan(horizontalFov * 0.5),
            10
        )
        const orbitDistance = 6
        const playerDistance = Math.max(viewDistance - orbitDistance, 2)
        const x = screenPosition.x + front.x * playerDistance
        const z = screenPosition.z + front.z * playerDistance
        const ground = this.state.chunks.getElevationForPosition(x, z)
        const groundY = typeof ground === 'number' ? ground : player.position.current[1]
        const aboveOffset = Math.max(screenPosition.y - groundY, 1)

        return this._flyTo({
            x,
            z,
            rotation: Math.atan2(front.x, front.z),
            theta: Math.atan2(front.x, front.z),
            phi: Math.PI * 0.5,
            distance: orbitDistance,
            aboveOffset,
            heightOffset: aboveOffset
        }, duration)
    }

    returnToSpawn(duration = 0.8)
    {
        const player = this.state.player

        if(player.camera.mode !== Camera.MODE_THIRDPERSON)
        {
            player.camera.fly.deactivate()
            player.camera.thirdPerson.activate()
            player.camera.mode = Camera.MODE_THIRDPERSON
        }

        return this._flyTo({
            x: 10,
            z: 1,
            rotation: 0,
            theta: -Math.PI * 0.25,
            phi: Math.PI * 0.45,
            distance: 15,
            aboveOffset: 2,
            heightOffset: 0
        }, duration)
    }

    _flyTo(target, duration)
    {
        const player = this.state.player
        const camera = player.camera.thirdPerson

        // Releasing pointer lock stops residual mouse movement from fighting
        // the scripted camera framing while it's mid-tween or a panel is open.
        this.state.viewport.pointerLock.deactivate()

        this.tween.x = player.position.current[0]
        this.tween.z = player.position.current[2]
        this.tween.rotation = player.rotation
        this.tween.theta = camera.theta
        this.tween.phi = camera.phi
        this.tween.distance = camera.distance
        this.tween.aboveOffset = camera.aboveOffset
        this.tween.heightOffset = camera.heightOffset

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
                heightOffset: target.heightOffset ?? 0,
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
                    camera.heightOffset = this.tween.heightOffset
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
