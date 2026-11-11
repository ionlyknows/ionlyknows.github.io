import * as THREE from 'three'
import gsap from 'gsap'

import Game from '@/Game.js'
import View from '@/View/View.js'
import State from '@/State/State.js'
import StateMachine from '@/StateMachine.js'

const MOVE_TIME_TO_HIDE = 2 // s of movement before the hints fade out
const OPACITY = 0.85
const SIZE = { width: 3.6, height: 1.8 }
const HEIGHT = 2.8 // center above the astronaut's feet
const SIDE = 2.5 // center to the side of the astronaut (screen space)
const MARGIN = 0.04 // NDC padding around beacons and pads
const MARKER_SAMPLES = [ 0, 1.2, 2.4, 3.4 ] // heights along a beacon (base → diamond)
const HINTS = [
    { keys: [ 'W', 'A', 'S', 'D' ], label: 'move' },
    { keys: [ 'Shift' ], label: 'run' },
    { keys: [ 'Space' ], label: 'jump' },
    { keys: [ 'E' ], label: 'interact' }
]

const _base = new THREE.Vector3()
const _right = new THREE.Vector3()
const _up = new THREE.Vector3()
const _center = new THREE.Vector3()
const _edge = new THREE.Vector3()
const _point = new THREE.Vector3()

// Key icons next to the astronaut after the intro. They live in their own scene, rendered
// after bloom (PostProcessing), so they stay crisp. Placed above-left of the astronaut on
// screen; they switch to the right when a beacon or launch pad would be behind them.
export default class ControlHints
{
    constructor()
    {
        this.game = Game.getInstance()
        this.view = View.getInstance()
        this.state = State.getInstance()

        this.scene = new THREE.Scene()
        this.opacity = 0
        this.movedTime = 0
        this.done = false
        this.side = - 1 // -1 left, 1 right
        this.offset = - 1

        this.material = new THREE.SpriteMaterial({ map: this.createTexture(), transparent: true, opacity: 0, depthTest: false, depthWrite: false, fog: false })
        this.sprite = new THREE.Sprite(this.material)
        this.sprite.scale.set(SIZE.width, SIZE.height, 1)
        this.sprite.visible = false
        this.scene.add(this.sprite)
    }

    createTexture()
    {
        const canvas = document.createElement('canvas')
        canvas.width = 1024
        canvas.height = 512
        const context = canvas.getContext('2d')
        context.scale(2, 2) // drawn at 2× for crisp text

        // Dark backdrop so the text reads on bright ground
        context.fillStyle = 'rgba(4, 8, 20, 0.5)'
        context.beginPath()
        context.roundRect(8, 8, 496, 240, 24)
        context.fill()

        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.shadowColor = 'rgba(0, 0, 0, 0.6)'
        context.shadowBlur = 3

        HINTS.forEach((hint, index) =>
        {
            const cx = 128 + (index % 2) * 256
            const cy = 70 + Math.floor(index / 2) * 120
            context.font = '600 26px Helvetica, Arial, sans-serif'
            const widths = hint.keys.map((key) => Math.max(44, context.measureText(key).width + 24))
            const total = widths.reduce((sum, width) => sum + width, 0) + (widths.length - 1) * 6
            let x = cx - total / 2

            hint.keys.forEach((key, keyIndex) =>
            {
                const width = widths[keyIndex]
                context.strokeStyle = 'rgba(190, 252, 255, 0.95)'
                context.lineWidth = 2.5
                context.beginPath()
                context.roundRect(x, cy - 26, width, 44, 10)
                context.stroke()
                context.fillStyle = '#ffffff'
                context.fillText(key, x + width / 2, cy - 4)
                x += width + 6
            })

            context.fillStyle = 'rgba(233, 254, 255, 0.92)'
            context.font = '500 20px Helvetica, Arial, sans-serif'
            context.fillText(hint.label, cx, cy + 38)
        })

        const texture = new THREE.CanvasTexture(canvas)
        texture.colorSpace = THREE.SRGBColorSpace
        texture.anisotropy = 4
        return texture
    }

    show()
    {
        if(this.done)
            return

        this.sprite.visible = true
        gsap.to(this, { opacity: OPACITY, duration: 0.8, ease: 'power2.out' })
    }

    hide()
    {
        this.done = true
        gsap.to(this, { opacity: 0, duration: 0.8, ease: 'power2.in', overwrite: true, onComplete: () =>
        {
            this.sprite.visible = false
            this.material.map.dispose()
        } })
    }

    // Would the hints, on `side`, cover a beacon or launch pad of the current planet?
    overlaps(side)
    {
        const camera = this.view.camera.instance
        _center.copy(_base).addScaledVector(_right, side * SIDE).project(camera)
        const halfWidth = Math.abs(_edge.copy(_base).addScaledVector(_right, side * SIDE + SIZE.width / 2).project(camera).x - _center.x) + MARGIN
        const halfHeight = Math.abs(_edge.copy(_base).addScaledVector(_right, side * SIDE).addScaledVector(_up, SIZE.height / 2).project(camera).y - _center.y) + MARGIN

        for(const marker of this.view.planets.current?.markers ?? [])
        {
            for(const height of MARKER_SAMPLES)
            {
                marker.localToWorld(_point.set(0, height, 0)).project(camera)
                if(_point.z < 1 && Math.abs(_point.x - _center.x) < halfWidth && Math.abs(_point.y - _center.y) < halfHeight)
                    return true
            }
        }
        return false
    }

    update()
    {
        if(!this.sprite.visible)
            return

        const player = this.state.player
        const onFoot = this.game.stateMachine.is(StateMachine.ON_FOOT)

        if(!this.done && onFoot && player.isMoving)
        {
            this.movedTime += this.state.time.delta
            if(this.movedTime >= MOVE_TIME_TO_HIDE)
                this.hide()
        }

        const camera = this.view.camera.instance
        _right.setFromMatrixColumn(camera.matrixWorld, 0)
        _up.setFromMatrixColumn(camera.matrixWorld, 1)
        _base.copy(player.renderPosition).addScaledVector(player.renderUp, HEIGHT)

        // Switch sides only when the current one is blocked and the other is free
        if(this.overlaps(this.side) && !this.overlaps(- this.side))
            this.side = - this.side
        this.offset += (this.side - this.offset) * Math.min(1, this.state.time.delta * 6)

        this.sprite.position.copy(_base).addScaledVector(_right, this.offset * SIDE)
        this.material.opacity = onFoot ? this.opacity : 0
    }
}
