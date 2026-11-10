import * as THREE from 'three'

import View from '@/View/View.js'
import State from '@/State/State.js'

const _right = new THREE.Vector3()
const _facing = new THREE.Vector3()
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
        const suit = new THREE.MeshStandardMaterial({ color: '#ebe7df', roughness: 0.8, metalness: 0, envMapIntensity: 0.5, userData: { useEnvironment: true } })
        const accent = new THREE.MeshStandardMaterial({ color: '#ff7a2e', roughness: 0.6, metalness: 0, envMapIntensity: 0.5, userData: { useEnvironment: true } })
        // Reflective dark gold visor
        const visor = new THREE.MeshStandardMaterial({ color: '#8c6a24', roughness: 0.1, metalness: 1, envMapIntensity: 1.6, userData: { useEnvironment: true } })

        const part = (geometry, material, x, y, z, parent) =>
        {
            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.set(x, y, z)
            mesh.castShadow = true
            parent.add(mesh)
            return mesh
        }

        const limb = (x, y, length, radius, material, parent) =>
        {
            const pivot = new THREE.Group()
            pivot.position.set(x, y, 0)
            part(new THREE.CapsuleGeometry(radius, length, 4, 12), material, 0, - (length * 0.5 + radius), 0, pivot)
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

        part(new THREE.CapsuleGeometry(0.32, 0.3, 6, 20), suit, 0, 0.85, 0, this.body)
        part(new THREE.CylinderGeometry(0.34, 0.34, 0.1, 24), accent, 0, 0.72, 0, this.body) // belt
        part(new THREE.BoxGeometry(0.46, 0.5, 0.22), accent, 0, 0.95, - 0.32, this.body) // backpack

        this.armLeft = limb(0.4, 1.12, 0.22, 0.1, suit, this.body)
        this.armRight = limb(- 0.4, 1.12, 0.22, 0.1, suit, this.body)

        part(new THREE.SphereGeometry(0.42, 32, 24), suit, 0, 1.45, 0, this.body) // helmet
        const visorMesh = part(new THREE.SphereGeometry(0.3, 32, 24), visor, 0, 1.47, 0.22, this.body)
        visorMesh.scale.set(1, 0.72, 0.62)

        // Soft contact shadow under the feet (stays on the ground while jumping)
        const canvas = document.createElement('canvas')
        canvas.width = 64
        canvas.height = 64
        const context = canvas.getContext('2d')
        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)')
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        context.fillStyle = gradient
        context.fillRect(0, 0, 64, 64)

        this.contactShadow = new THREE.Mesh(
            new THREE.PlaneGeometry(1.4, 1.4),
            new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: - 2 })
        )
        this.contactShadow.rotation.x = - Math.PI / 2
        this.contactShadow.renderOrder = 1
        this.group.add(this.contactShadow)
    }

    update()
    {
        const player = this.state.player
        const delta = this.state.time.delta
        const elapsed = this.state.time.elapsed

        // Align up to the player's up, face the movement direction (+Z = facing)
        // Exactly the interpolated physics position (no extra smoothing here)
        _facing.copy(player.facing).projectOnPlane(player.renderUp).normalize()
        _right.crossVectors(player.renderUp, _facing)
        _matrix.makeBasis(_right, player.renderUp, _facing)
        this.group.quaternion.setFromRotationMatrix(_matrix)
        this.group.position.copy(player.renderPosition)

        const planet = this.state.planets.current
        const height = Math.max(0, player.renderPosition.distanceTo(planet.center) - planet.radius)
        this.contactShadow.position.y = - height + 0.03
        this.contactShadow.visible = height < 3
        this.contactShadow.material.opacity = 1 - THREE.MathUtils.clamp(height / 3, 0, 1)

        // Blends
        // Driven by the real speed (continuous), so sliding slowly along a rock never flickers
        this.moveBlend = damp(this.moveBlend, THREE.MathUtils.clamp(player.speed / 10, 0, 1), 10, delta)
        this.airBlend = damp(this.airBlend, player.isGrounded ? 0 : 1, 14, delta)
        this.phase += delta * (5 + player.speed * 0.9)

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
