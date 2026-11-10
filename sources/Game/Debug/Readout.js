import * as THREE from 'three'

// #debug only: per-frame readout (top-left, under the stats panel). Writers must always be 1.
export default class Readout
{
    constructor(game)
    {
        this.game = game
        this.lastPlayer = new THREE.Vector3()
        this.lastCamera = new THREE.Vector3()
        this.frame = 0

        this.element = document.createElement('pre')
        Object.assign(this.element.style, {
            position: 'fixed', top: '56px', left: '8px', zIndex: 9999, margin: 0, padding: '6px 8px',
            background: 'rgba(0, 0, 0, 0.7)', color: '#7ff9ff', font: '11px/1.45 monospace', pointerEvents: 'none'
        })
        document.body.appendChild(this.element)
    }

    update()
    {
        const { state, view } = this.game
        const player = state.player
        const camera = view.camera
        const planets = state.planets

        const playerDelta = player.renderPosition.distanceTo(this.lastPlayer)
        const cameraDelta = camera.instance.position.distanceTo(this.lastCamera)
        this.lastPlayer.copy(player.renderPosition)
        this.lastCamera.copy(camera.instance.position)

        // Text every 4th frame (cheap), values are this frame's
        if(this.frame++ % 4)
            return

        const v = (vector) => `${vector.x.toFixed(2)}, ${vector.y.toFixed(2)}, ${vector.z.toFixed(2)}`
        this.element.textContent = [
            `player Δ/frame   ${playerDelta.toFixed(4)}`,
            `camera Δ/frame   ${cameraDelta.toFixed(4)}`,
            `planet           ${planets.current.id}`,
            `planet center    ${v(planets.current.center)}`,
            `origin offset    ${v(planets.origin)}`,
            `grounded         ${player.isGrounded}`,
            `player writers   ${player.writers}`,
            `camera writers   ${camera.writers}`,
            `colliders        ${planets.current.colliders.length}  (C: show)`
        ].join('\n')
    }
}
