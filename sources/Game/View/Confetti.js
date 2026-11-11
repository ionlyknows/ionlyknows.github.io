import * as THREE from 'three'

import View from '@/View/View.js'
import State from '@/State/State.js'
import UIBridge from '../../UI/UIBridge.js'

const COUNT = 140
const DURATION = 2.2 // s
const GRAVITY = 6
const COLORS = [ '#ffd76a', '#7ff9ff', '#ff9d5c', '#ffffff', '#5ff2e0' ]

const _up = new THREE.Vector3()
const _a = new THREE.Vector3()
const _b = new THREE.Vector3()

// Secret dance (easter egg 3): the astronaut waves and a burst of little stars pops out
// around them, falls toward the planet and fades.
export default class Confetti
{
    constructor()
    {
        this.view = View.getInstance()
        this.state = State.getInstance()

        this.time = DURATION
        this.velocities = Array.from({ length: COUNT }, () => new THREE.Vector3())

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3))
        const colors = new Float32Array(COUNT * 3)
        const color = new THREE.Color()
        for(let i = 0; i < COUNT; i++)
            color.set(COLORS[i % COLORS.length]).toArray(colors, i * 3)
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        this.material = new THREE.PointsMaterial({ size: 0.22, map: this.createStar(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true })
        this.points = new THREE.Points(geometry, this.material)
        this.points.frustumCulled = false
        this.points.visible = false
        this.view.scene.add(this.points)

        UIBridge.getInstance().on('egg:found', ({ id }) =>
        {
            if(id !== 'dance')
                return
            this.view.player.playEmote()
            this.burst()
        })
        this.state.planets.events.on('originShift', (offset) =>
        {
            const positions = this.points.geometry.attributes.position
            for(let i = 0; i < COUNT; i++)
                positions.setXYZ(i, positions.getX(i) - offset.x, positions.getY(i) - offset.y, positions.getZ(i) - offset.z)
        })
    }

    createStar()
    {
        const canvas = document.createElement('canvas')
        canvas.width = 64
        canvas.height = 64
        const context = canvas.getContext('2d')
        context.fillStyle = '#ffffff'
        context.beginPath()
        for(let i = 0; i < 10; i++)
        {
            const radius = i % 2 ? 12 : 30
            const angle = i * Math.PI / 5 - Math.PI / 2
            context.lineTo(32 + Math.cos(angle) * radius, 32 + Math.sin(angle) * radius)
        }
        context.closePath()
        context.fill()
        const texture = new THREE.CanvasTexture(canvas)
        texture.colorSpace = THREE.SRGBColorSpace
        return texture
    }

    burst()
    {
        const player = this.state.player
        _up.copy(player.up)
        const positions = this.points.geometry.attributes.position
        for(let i = 0; i < COUNT; i++)
        {
            // Random direction in the upper hemisphere around the player's up
            _a.randomDirection()
            if(_a.dot(_up) < 0)
                _a.addScaledVector(_up, - 2 * _a.dot(_up))
            this.velocities[i].copy(_a).multiplyScalar(3 + Math.random() * 4).addScaledVector(_up, 3)
            _b.copy(player.position).addScaledVector(_up, 1.4)
            positions.setXYZ(i, _b.x, _b.y, _b.z)
        }
        positions.needsUpdate = true
        this.time = 0
        this.points.visible = true
    }

    update()
    {
        if(this.time >= DURATION)
            return

        const delta = this.state.time.delta
        this.time += delta
        const center = this.state.planets.current.center
        const positions = this.points.geometry.attributes.position
        for(let i = 0; i < COUNT; i++)
        {
            _a.fromBufferAttribute(positions, i)
            _b.subVectors(center, _a).normalize().multiplyScalar(GRAVITY * delta) // pulled toward the planet
            this.velocities[i].add(_b).multiplyScalar(1 - 0.6 * delta)
            _a.addScaledVector(this.velocities[i], delta)
            positions.setXYZ(i, _a.x, _a.y, _a.z)
        }
        positions.needsUpdate = true
        this.material.opacity = 1 - Math.max(0, (this.time - DURATION * 0.55) / (DURATION * 0.45))
        if(this.time >= DURATION)
            this.points.visible = false
    }
}
