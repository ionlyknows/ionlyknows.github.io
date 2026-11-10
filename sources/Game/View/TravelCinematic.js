import * as THREE from 'three'

import View from '@/View/View.js'
import State from '@/State/State.js'
import { BASE_FOV } from './Camera.js'
import { lookAtPose } from './Cinematics.js'

const WARP_FOV = 30 // extra FOV at the warp peak
const ORBIT_DISTANCE = 2.8 // × destination radius
const ORBIT_SWEEP = 0.9 // rad

const _position = new THREE.Vector3()
const _target = new THREE.Vector3()
const _offset = new THREE.Vector3()
const _up = new THREE.Vector3()

const smooth = (t) => t * t * (3 - 2 * t)

// Camera for State/Travel.js: chase cam on lift-off, warp streaks + FOV kick in
// flight, white flash on arrival, then an orbiting establishing shot that
// settles behind the astronaut.
export default class TravelCinematic
{
    constructor(cinematics)
    {
        this.view = View.getInstance()
        this.state = State.getInstance()
        this.cinematics = cinematics
        this.override = cinematics.override
        this.warp = this.view.space.warp
    }

    reset()
    {
        this.warp.amount = 0
        this.cinematics.screen.flash = 0
    }

    // Behind and above the astronaut, looking ahead
    chase(weight)
    {
        const player = this.state.player
        _position.copy(player.position).addScaledVector(player.facing, - 9).addScaledVector(player.up, 3.5)
        _target.copy(player.position).addScaledVector(player.facing, 6)
        lookAtPose(this.override, _position, _target, player.up)
        this.override.weight = weight
    }

    // Wide shot of the destination, sweeping around its landing point's up axis
    establish(progress, weight)
    {
        const travel = this.state.travel
        const planet = travel.to
        const player = this.state.player

        _up.subVectors(planet.landingPoint, planet.center).normalize()
        _offset.copy(_up).multiplyScalar(0.55).addScaledVector(player.facing, 0.85).normalize()
        _offset.applyAxisAngle(_up, - ORBIT_SWEEP * (1 - progress))

        _position.copy(planet.center).addScaledVector(_offset, planet.radius * ORBIT_DISTANCE)
        _target.copy(planet.center).addScaledVector(_up, planet.radius * 0.4)
        lookAtPose(this.override, _position, _target, _up)
        this.override.weight = weight
    }

    update()
    {
        const travel = this.state.travel
        const t = travel.phaseT
        const { land, establish } = travel.durations
        const screen = this.cinematics.screen

        this.override.fov = BASE_FOV
        this.warp.amount = 0

        if(travel.phase === 'lift')
        {
            this.chase(smooth(t))
            screen.flash = 0
        }
        else if(travel.phase === 'flight')
        {
            const peak = Math.sin(Math.PI * t)
            this.chase(1)
            this.override.fov = BASE_FOV + WARP_FOV * peak
            this.warp.amount = peak
            this.warp.direction.copy(travel.tangent)
            screen.flash = t > 0.85 ? (t - 0.85) / 0.15 : 0
        }
        else if(travel.phase === 'land' || travel.phase === 'establish')
        {
            const total = land + establish
            const elapsed = travel.phase === 'land' ? t * land : land + t * establish
            screen.flash = Math.max(0, 1 - elapsed / 0.5)

            if(establish === 0)
            {
                // Reduced motion: no establishing shot, blend straight back
                this.chase(1 - smooth(t))
                return
            }

            const progress = elapsed / total
            const settle = travel.phase === 'establish' ? smooth(THREE.MathUtils.clamp((t - 0.35) / 0.65, 0, 1)) : 0
            this.establish(progress, 1 - settle)
        }
    }
}
