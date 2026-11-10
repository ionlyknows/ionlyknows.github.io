import * as THREE from 'three'
import gsap from 'gsap'

import Game from '@/Game.js'
import View from '@/View/View.js'
import State from '@/State/State.js'
import StateMachine from '@/StateMachine.js'

const MOVE_TIME_TO_HIDE = 2 // s of movement before the hints fade out
const HINTS = [
    { keys: [ 'W', 'A', 'S', 'D' ], label: 'move' },
    { keys: [ 'Shift' ], label: 'run' },
    { keys: [ 'Space' ], label: 'jump' },
    { keys: [ 'E' ], label: 'interact' }
]

// Soft glowing key icons floating near the astronaut after the intro
export default class ControlHints
{
    constructor()
    {
        this.game = Game.getInstance()
        this.view = View.getInstance()
        this.state = State.getInstance()

        this.opacity = 0
        this.movedTime = 0
        this.done = false

        this.material = new THREE.SpriteMaterial({ map: this.createTexture(), transparent: true, opacity: 0, depthWrite: false, fog: false, toneMapped: false })
        this.material.color.setScalar(1.4) // a little over 1 so bloom softens it
        this.sprite = new THREE.Sprite(this.material)
        this.sprite.scale.set(3.6, 1.8, 1)
        this.sprite.visible = false
        this.view.scene.add(this.sprite)
    }

    createTexture()
    {
        const canvas = document.createElement('canvas')
        canvas.width = 512
        canvas.height = 256
        const context = canvas.getContext('2d')

        context.font = '600 26px Helvetica, Arial, sans-serif'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.shadowColor = 'rgba(127, 249, 255, 0.9)'
        context.shadowBlur = 14

        HINTS.forEach((hint, index) =>
        {
            const cx = 128 + (index % 2) * 256
            const cy = 70 + Math.floor(index / 2) * 120
            const widths = hint.keys.map((key) => Math.max(44, context.measureText(key).width + 24))
            const total = widths.reduce((sum, width) => sum + width, 0) + (widths.length - 1) * 6
            let x = cx - total / 2

            hint.keys.forEach((key, keyIndex) =>
            {
                const width = widths[keyIndex]
                context.strokeStyle = 'rgba(190, 252, 255, 0.95)'
                context.lineWidth = 3
                context.beginPath()
                context.roundRect(x, cy - 26, width, 44, 10)
                context.stroke()
                context.fillStyle = '#e9feff'
                context.fillText(key, x + width / 2, cy - 4)
                x += width + 6
            })

            context.fillStyle = 'rgba(233, 254, 255, 0.85)'
            context.font = '500 20px Helvetica, Arial, sans-serif'
            context.fillText(hint.label, cx, cy + 38)
            context.font = '600 26px Helvetica, Arial, sans-serif'
        })

        const texture = new THREE.CanvasTexture(canvas)
        texture.colorSpace = THREE.SRGBColorSpace
        return texture
    }

    show()
    {
        if(this.done)
            return

        this.sprite.visible = true
        gsap.to(this, { opacity: 1, duration: 0.8, ease: 'power2.out' })
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

        this.sprite.position.copy(player.renderPosition).addScaledVector(player.renderUp, 3.2)
        this.material.opacity = onFoot ? this.opacity : 0
    }
}
