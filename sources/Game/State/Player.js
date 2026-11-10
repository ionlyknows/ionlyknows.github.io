import * as THREE from 'three'

import Game from '@/Game.js'
import State from '@/State/State.js'
import StateMachine from '@/StateMachine.js'
import UIBridge from '../../UI/UIBridge.js'
import Camera from './Camera.js'

// World units (meters) and seconds
const GRAVITY = 30
const JUMP_SPEED = 9 // apex ≈ 1.35 m
const WALK_SPEED = 5
const RUN_SPEED = 10
const PLAYER_RADIUS = 0.5
const TURN_SPEED = 12

// Frame-loop temporaries (no allocations per frame)
const _forward = new THREE.Vector3()
const _right = new THREE.Vector3()
const _push = new THREE.Vector3()
const _cross = new THREE.Vector3()

// Small-planet player: gravity points to the planet center, movement happens
// in the tangent plane and the position is re-projected onto the sphere.
export default class Player
{
    constructor()
    {
        this.game = Game.getInstance()
        this.state = State.getInstance()
        this.time = this.state.time
        this.controls = this.state.controls
        this.planets = this.state.planets
        this.bridge = UIBridge.getInstance()

        const planet = this.planets.current

        this.position = planet.landingPoint.clone()
        this.up = new THREE.Vector3().subVectors(this.position, planet.center).normalize()
        this.velocity = new THREE.Vector3()

        // Model forward, always tangent to the surface. Starts facing the main content point.
        this.facing = new THREE.Vector3(1, 0, 0)
        if(planet.contentPoints.length)
            this.facing.subVectors(planet.contentPoints[0].position, this.position)
        this.facing.projectOnPlane(this.up)
        if(this.facing.lengthSq() < 1e-6)
            this.facing.set(0, 0, 1).projectOnPlane(this.up)
        this.facing.normalize()

        this.height = 0
        this.verticalVelocity = 0
        this.isGrounded = true
        this.isMoving = false
        this.isRunning = false

        this.nearestPoint = null

        this.camera = new Camera(this)

        this.controls.events.on('jumpDown', () =>
        {
            if(this.isGrounded && this.camera.mode === Camera.MODE_THIRDPERSON)
            {
                this.verticalVelocity = JUMP_SPEED
                this.isGrounded = false
            }
        })

        this.controls.events.on('interactDown', () => this.interact())
    }

    interact(pointId = null)
    {
        const point = this.nearestPoint
        if(!point || !this.game.stateMachine.is(StateMachine.ON_FOOT))
            return
        if(pointId !== null && pointId !== point.id)
            return

        this.bridge.emit('panel:open', { type: point.opens, id: point.id })
    }

    update()
    {
        const planet = this.planets.current
        const delta = this.time.delta
        const keys = this.controls.keys.down
        const canMove = this.camera.mode === Camera.MODE_THIRDPERSON

        const inputZ = canMove ? (keys.forward ? 1 : 0) - (keys.backward ? 1 : 0) : 0
        const inputX = canMove ? (keys.strafeRight ? 1 : 0) - (keys.strafeLeft ? 1 : 0) : 0

        this.isMoving = inputZ !== 0 || inputX !== 0
        this.isRunning = this.isMoving && keys.boost

        this.up.subVectors(this.position, planet.center).normalize()

        // Move in the tangent plane, relative to the camera
        if(this.isMoving)
        {
            _forward.copy(this.camera.thirdPerson.forward).projectOnPlane(this.up).normalize()
            _right.crossVectors(_forward, this.up).normalize()

            this.velocity
                .copy(_forward).multiplyScalar(inputZ)
                .addScaledVector(_right, inputX)
                .normalize()
                .multiplyScalar(this.isRunning ? RUN_SPEED : WALK_SPEED)

            this.position.addScaledVector(this.velocity, delta)

            // Turn toward the movement direction around `up`
            _forward.copy(this.velocity).normalize()
            _cross.crossVectors(this.facing, _forward)
            const angle = Math.atan2(_cross.dot(this.up), this.facing.dot(_forward))
            this.facing.applyAxisAngle(this.up, angle * (1 - Math.exp(- TURN_SPEED * delta)))
        }
        else
        {
            this.velocity.set(0, 0, 0)
        }

        // Props: push out of sphere colliders along the tangent plane
        for(const collider of planet.colliders)
        {
            _push.subVectors(this.position, collider.center).projectOnPlane(this.up)
            const distance = _push.length()
            const minDistance = collider.radius + PLAYER_RADIUS

            if(distance < minDistance && distance > 1e-5)
                this.position.addScaledVector(_push, (minDistance - distance) / distance)
        }

        // Jump: scalar height above the surface, pulled back by gravity (BR-06)
        if(!this.isGrounded)
        {
            this.verticalVelocity -= GRAVITY * delta
            this.height += this.verticalVelocity * delta

            if(this.height <= 0)
            {
                this.height = 0
                this.verticalVelocity = 0
                this.isGrounded = true
            }
        }

        // Re-project onto the sphere and keep the frame orthonormal
        this.position.sub(planet.center).setLength(planet.radius + this.height).add(planet.center)
        this.up.subVectors(this.position, planet.center).normalize()
        this.facing.projectOnPlane(this.up).normalize()

        this.camera.update()

        // Interaction prompt (BR-03): only the nearest in-range point
        const nearest = this.planets.findNearest(this.position)
        if(nearest !== this.nearestPoint)
        {
            this.nearestPoint = nearest
            if(nearest)
                this.bridge.emit('prompt:show', { type: nearest.opens, id: nearest.id })
            else
                this.bridge.emit('prompt:hide')
        }
    }
}
