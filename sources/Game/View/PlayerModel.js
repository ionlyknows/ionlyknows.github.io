import * as THREE from 'three'

import View from '@/View/View.js'
import State from '@/State/State.js'
import { toonMaterial, flat } from './Materials/toon.js'

const _right = new THREE.Vector3()
const _matrix = new THREE.Matrix4()

function damp(current, target, speed, delta)
{
    return current + (target - current) * (1 - Math.exp(- speed * delta))
}

// Placeholder astronaut built in code (the rigged mascot comes in M4).
// Feet at the origin, facing +Z. Procedural idle / run / jump animation.
export default class PlayerModel
{
    constructor()
    {
        this.view = View.getInstance()
        this.state = State.getInstance()
        this.scene = this.view.scene

        this.moveBlend = 0
        this.phase = 0
        this.airBlend = 0
        this.squash = 0
        this.wasGrounded = true

        this.setModel()
    }

    setModel()
    {
        const suit = toonMaterial({ color: '#f4f1ea' })
        const accent = toonMaterial({ color: '#ff8a3d' })
        const visor = toonMaterial({ color: '#1b2a4a', emissive: '#0b3a5a' })

        const part = (geometry, material, x, y, z, parent) =>
        {
            const mesh = new THREE.Mesh(flat(geometry), material)
            mesh.position.set(x, y, z)
            mesh.castShadow = true
            parent.add(mesh)
            return mesh
        }

        const limb = (x, y, length, radius, material, parent) =>
        {
            const pivot = new THREE.Group()
            pivot.position.set(x, y, 0)
            part(new THREE.CapsuleGeometry(radius, length, 2, 6), material, 0, - (length * 0.5 + radius), 0, pivot)
            parent.add(pivot)
            return pivot
        }

        this.group = new THREE.Group()
        this.scene.add(this.group)

        // Body pivot at the feet: bob, lean and squash/stretch happen here
        this.body = new THREE.Group()
        this.group.add(this.body)

        this.legLeft = limb(0.16, 0.5, 0.24, 0.13, suit, this.body)
        this.legRight = limb(- 0.16, 0.5, 0.24, 0.13, suit, this.body)

        part(new THREE.CapsuleGeometry(0.32, 0.3, 3, 8), suit, 0, 0.85, 0, this.body)
        part(new THREE.CylinderGeometry(0.34, 0.34, 0.1, 8), accent, 0, 0.72, 0, this.body) // belt
        part(new THREE.BoxGeometry(0.46, 0.5, 0.22), accent, 0, 0.95, - 0.32, this.body) // backpack

        this.armLeft = limb(0.4, 1.12, 0.22, 0.1, suit, this.body)
        this.armRight = limb(- 0.4, 1.12, 0.22, 0.1, suit, this.body)

        part(new THREE.SphereGeometry(0.42, 10, 8), suit, 0, 1.45, 0, this.body) // helmet
        const visorMesh = part(new THREE.SphereGeometry(0.3, 10, 8), visor, 0, 1.47, 0.22, this.body)
        visorMesh.scale.set(1, 0.72, 0.62)
    }

    update()
    {
        const player = this.state.player
        const delta = this.state.time.delta
        const elapsed = this.state.time.elapsed

        // Align up to the player's up, face the movement direction (+Z = facing)
        _right.crossVectors(player.up, player.facing)
        _matrix.makeBasis(_right, player.up, player.facing)
        this.group.quaternion.setFromRotationMatrix(_matrix)
        this.group.position.copy(player.position)

        // Blends
        this.moveBlend = damp(this.moveBlend, player.isMoving ? (player.isRunning ? 1 : 0.6) : 0, 10, delta)
        this.airBlend = damp(this.airBlend, player.isGrounded ? 0 : 1, 14, delta)
        this.phase += delta * (player.isRunning ? 14 : 9) * (player.isMoving ? 1 : 0)

        if(player.isGrounded && !this.wasGrounded)
            this.squash = 1
        this.wasGrounded = player.isGrounded
        this.squash = damp(this.squash, 0, 10, delta)

        // Run: leg/arm swing + forward lean. Idle: gentle bob.
        const swing = Math.sin(this.phase) * 0.9 * this.moveBlend * (1 - this.airBlend)
        this.legLeft.rotation.x = swing - this.airBlend * 0.6
        this.legRight.rotation.x = - swing + this.airBlend * 0.3
        this.armLeft.rotation.x = - swing * 0.8
        this.armRight.rotation.x = swing * 0.8
        this.armLeft.rotation.z = this.airBlend * 0.9
        this.armRight.rotation.z = - this.airBlend * 0.9

        this.body.rotation.x = this.moveBlend * 0.22
        this.body.position.y = (1 - this.moveBlend) * Math.sin(elapsed * 2.2) * 0.03 + this.moveBlend * Math.abs(Math.sin(this.phase)) * 0.08 * (1 - this.airBlend)

        // Jump: stretch while rising/falling, squash on landing
        const stretch = player.isGrounded ? 0 : THREE.MathUtils.clamp(Math.abs(player.verticalVelocity) / 9, 0, 1) * 0.15
        const scaleY = 1 + stretch - this.squash * 0.28
        const scaleXZ = 1 / Math.sqrt(scaleY)
        this.body.scale.set(scaleXZ, scaleY, scaleXZ)
    }
}
