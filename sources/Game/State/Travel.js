import * as THREE from 'three'
import gsap from 'gsap'

import Game from '@/Game.js'
import State from '@/State/State.js'
import StateMachine from '@/StateMachine.js'
import UIBridge from '../../UI/UIBridge.js'

const LIFT_HEIGHT = 6
const DURATIONS = { lift: 0.7, flight: 2.6, land: 0.7, establish: 1.6 } // 5.6 s (BR-05: 4–6 s)
const REDUCED_DURATIONS = { lift: 0.3, flight: 0.9, land: 0.3, establish: 0 } // 1.5 s

const _up = new THREE.Vector3()

// One uninterruptible GSAP timeline per trip: lift-off → curved flight → landing
// → establishing shot (camera only). Input is locked the whole time (TRAVELING).
export default class Travel
{
    constructor()
    {
        this.game = Game.getInstance()
        this.state = State.getInstance()
        this.bridge = UIBridge.getInstance()

        this.phase = null // 'lift' | 'flight' | 'land' | 'establish' | null
        this.phaseT = 0
        this.from = null
        this.to = null
        this.curve = null
        this.tangent = new THREE.Vector3()
        this.durations = DURATIONS
        this.path = null
        this.timeline = null
        this.arrival = null // destination waiting for Player.update to finish the arrival

        this.bridge.on('travel:request', ({ to }) => this.start(to))
    }

    start(toId)
    {
        const stateMachine = this.game.stateMachine
        const planets = this.state.planets
        const player = this.state.player
        const to = planets.get(toId)

        if(!stateMachine.is(StateMachine.ON_FOOT) || !to || to === planets.current)
            return

        this.from = planets.current
        this.to = to
        this.durations = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? REDUCED_DURATIONS : DURATIONS

        stateMachine.set(StateMachine.TRAVELING)
        this.bridge.emit('prompt:hide')

        const liftStart = player.position.clone()
        const fromUp = player.up.clone()
        const toUp = new THREE.Vector3().subVectors(to.landingPoint, to.center).normalize()
        const liftEnd = liftStart.clone().addScaledVector(fromUp, LIFT_HEIGHT)
        const landStart = to.landingPoint.clone().addScaledVector(toUp, LIFT_HEIGHT)

        this.curve = this.buildCurve(liftEnd, fromUp, landStart, toUp)

        this.path = { liftStart, liftEnd, landStart, landEnd: to.landingPoint.clone(), fromUp, toUp, facing: player.facing.clone() }

        const phase = (name, duration, ease) => gsap.fromTo(
            this,
            { phaseT: 0 },
            {
                phaseT: 1,
                duration,
                ease,
                immediateRender: false,
                onStart: () => { this.phase = name }
            }
        )

        this.timeline = gsap.timeline({ onComplete: () => this.finish() })
        this.timeline.add(phase('lift', this.durations.lift, 'power2.in'))
        this.timeline.add(phase('flight', this.durations.flight, 'power1.inOut'))
        this.timeline.add(phase('land', this.durations.land, 'power2.out'))
        this.timeline.add(phase('establish', this.durations.establish, 'none'))
    }

    // Where the astronaut is right now. Called only by Player.update (the single writer).
    sample(player)
    {
        const path = this.path
        const t = this.phaseT

        if(this.phase === 'flight')
        {
            this.curve.getPointAt(t, player.position)
            this.curve.getTangentAt(t, this.tangent)

            // Face along the path; up blends from the old planet's to the new one's
            player.facing.copy(this.tangent)
            _up.lerpVectors(path.fromUp, path.toUp, t).projectOnPlane(player.facing)
            if(_up.lengthSq() > 1e-4)
                player.up.copy(_up.normalize())
            else
                player.up.projectOnPlane(player.facing).normalize()
            player.speed = 10
            player.isMoving = true
            player.isRunning = true
        }
        else if(this.phase === 'land')
        {
            player.position.lerpVectors(path.landStart, path.landEnd, t)
            player.speed = 0
            player.isMoving = false
            player.isRunning = false
        }
        else if(this.phase === 'establish')
        {
            player.position.copy(path.landEnd)
        }
        else
        {
            // Lift-off (also before the first tick)
            player.position.lerpVectors(path.liftStart, path.liftEnd, this.phase === 'lift' ? t : 0)
            player.up.copy(path.fromUp)
            player.facing.copy(path.facing)
        }
    }

    // Lift point → out over the source planet → mid-way (kept clear of other
    // planets) → over the destination → above its landing point
    buildCurve(start, fromUp, end, toUp)
    {
        const planets = this.state.planets
        const toDestination = new THREE.Vector3().subVectors(this.to.center, this.from.center).normalize()
        const outward = (center, radius, up, direction) =>
        {
            const dir = up.clone().add(direction)
            if(dir.lengthSq() < 0.1)
                dir.crossVectors(up, Math.abs(up.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0))
            return center.clone().addScaledVector(dir.normalize(), radius + 12)
        }

        const departure = outward(this.from.center, this.from.radius, fromUp, toDestination)
        const approach = outward(this.to.center, this.to.radius, toUp, toDestination.clone().negate())

        const mid = new THREE.Vector3().addVectors(departure, approach).multiplyScalar(0.5)
        const side = new THREE.Vector3().crossVectors(toDestination, new THREE.Vector3(0, 1, 0))
        if(side.lengthSq() < 1e-4)
            side.set(1, 0, 0)
        mid.addScaledVector(side.normalize(), departure.distanceTo(approach) * 0.15)

        const obstacles = [ ...planets.items.filter((p) => p !== this.from && p !== this.to), planets.earth ]
        for(const obstacle of obstacles)
        {
            const clearance = obstacle.radius * 2.5 + 10
            const offset = mid.clone().sub(obstacle.center)
            if(offset.length() < clearance)
                mid.copy(obstacle.center).addScaledVector(offset.normalize(), clearance)
        }

        return new THREE.CatmullRomCurve3([ start, departure, mid, approach, end ], false, 'centripetal')
    }

    // Kill every tween/callback of this trip so nothing keeps writing after control returns.
    // Player.update then shifts the floating origin to the destination and resets physics.
    finish()
    {
        this.timeline?.kill()
        this.timeline = null
        gsap.killTweensOf(this)
        this.phase = null
        this.phaseT = 0
        this.arrival = this.to
        this.game.stateMachine.set(StateMachine.ON_FOOT)
        this.bridge.emit('location:change', { id: this.to.id, name: this.to.name })
    }
}
