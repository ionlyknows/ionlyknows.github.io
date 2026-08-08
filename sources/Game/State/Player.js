import { vec3 } from 'gl-matrix'

import Game from '@/Game.js'
import State from '@/State/State.js'
import Camera from './Camera.js'

// Vertical/jump tuning. Values are in world units (meters) and seconds, matching
// the rest of the state layer (Time.delta is in seconds).
const GRAVITY = -30
const JUMP_STRENGTH = 9

export default class Player
{
    constructor()
    {
        this.game = Game.getInstance()
        this.state = State.getInstance()
        this.time = this.state.time
        this.controls = this.state.controls

        this.rotation = 0
        this.inputSpeed = 10
        this.inputBoostSpeed = 30
        this.speed = 0

        this.position = {}
        this.position.current = vec3.fromValues(10, 0, 1)
        this.position.previous = vec3.clone(this.position.current)
        this.position.delta = vec3.create()

        // Vertical physics: `groundOffset` is the height above the terrain-clamped
        // ground position, driven by gravity + a jump impulse. The final Y position
        // is always (terrain elevation + groundOffset), so terrain following keeps
        // working exactly as before while airborne.
        this.verticalVelocity = 0
        this.groundOffset = 0
        this.isGrounded = true

        // Animation-facing flags. Pure game-state booleans, consumed by the view
        // layer (PlayerModel) to pick idle/walk/run/jump clips. Kept here (not in
        // the view) so gameplay logic stays framerate/render agnostic.
        this.isMoving = false
        this.isRunning = false

        this.camera = new Camera(this)

        this.controls.events.on('jumpDown', () =>
        {
            if(this.isGrounded && this.camera.mode === Camera.MODE_THIRDPERSON)
            {
                this.verticalVelocity = JUMP_STRENGTH
                this.isGrounded = false
            }
        })
    }

    update()
    {
        const isMovementInputActive = this.camera.mode !== Camera.MODE_FLY && (this.controls.keys.down.forward || this.controls.keys.down.backward || this.controls.keys.down.strafeLeft || this.controls.keys.down.strafeRight)

        this.isMoving = isMovementInputActive
        this.isRunning = isMovementInputActive && this.controls.keys.down.boost

        if(isMovementInputActive)
        {
            this.rotation = this.camera.thirdPerson.theta

            if(this.controls.keys.down.forward)
            {
                if(this.controls.keys.down.strafeLeft)
                    this.rotation += Math.PI * 0.25
                else if(this.controls.keys.down.strafeRight)
                    this.rotation -= Math.PI * 0.25
            }
            else if(this.controls.keys.down.backward)
            {
                if(this.controls.keys.down.strafeLeft)
                    this.rotation += Math.PI * 0.75
                else if(this.controls.keys.down.strafeRight)
                    this.rotation -= Math.PI * 0.75
                else
                    this.rotation -= Math.PI
            }
            else if(this.controls.keys.down.strafeLeft)
            {
                this.rotation += Math.PI * 0.5
            }
            else if(this.controls.keys.down.strafeRight)
            {
                this.rotation -= Math.PI * 0.5
            }

            const speed = this.controls.keys.down.boost ? this.inputBoostSpeed : this.inputSpeed

            const x = Math.sin(this.rotation) * this.time.delta * speed
            const z = Math.cos(this.rotation) * this.time.delta * speed

            this.position.current[0] -= x
            this.position.current[2] -= z
        }

        vec3.sub(this.position.delta, this.position.current, this.position.previous)
        vec3.copy(this.position.previous, this.position.current)

        this.speed = vec3.len(this.position.delta)

        // Update view
        this.camera.update()

        // Ground elevation (unchanged existing terrain query)
        const chunks = this.state.chunks
        const elevation = chunks.getElevationForPosition(this.position.current[0], this.position.current[2])
        const groundHeight = elevation || 0

        // Vertical physics: while airborne, gravity pulls the ground offset back down.
        // Landing (offset <= 0) snaps back to the terrain surface and resets velocity.
        if(!this.isGrounded)
        {
            this.verticalVelocity += GRAVITY * this.time.delta
            this.groundOffset += this.verticalVelocity * this.time.delta

            if(this.groundOffset <= 0)
            {
                this.groundOffset = 0
                this.verticalVelocity = 0
                this.isGrounded = true
            }
        }

        this.position.current[1] = groundHeight + this.groundOffset
    }
}
