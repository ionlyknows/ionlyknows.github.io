import * as THREE from 'three'

import View from '@/View/View.js'
import State from '@/State/State.js'
import { PROP_BUILDERS, random } from '@/State/PropShapes.js'
import { CORRIDOR_RADIUS, SHIP_RADIUS, frameAt, pointAt } from '@/State/FlightPhysics.js'
import { createSurfaceMaterial } from './Materials/surface.js'

const COUNT = 220
const MIN_DISTANCE = CORRIDOR_RADIUS + SHIP_RADIUS + 2 // from the route: never inside the corridor
const SPREAD = 70
const PLANET_GAP = 10

const _tangent = new THREE.Vector3()
const _up = new THREE.Vector3()
const _right = new THREE.Vector3()
const _position = new THREE.Vector3()
const _quaternion = new THREE.Quaternion()
const _spin = new THREE.Quaternion()
const _scale = new THREE.Vector3()
const _matrix = new THREE.Matrix4()

// Scenery along the flight route (M3): one InstancedMesh of PBR rocks, slowly tumbling, all
// outside the corridor (no collision: nothing to crash into). Lives in view.world (layout
// space), so the floating origin moves it like the planets.
export default class Asteroids
{
    constructor()
    {
        this.view = View.getInstance()
        this.state = State.getInstance()

        const geometry = PROP_BUILDERS.rock.build()[0].geometry.clone()
        geometry.center()

        // Same material setup as the planets' rocks (same shader program: no compile stall)
        const material = createSurfaceMaterial({ set: 'regolith', color: '#7d776f', scale: 0.7, variation: 0.15, roughness: 1 })
        this.mesh = new THREE.InstancedMesh(geometry, material, COUNT)
        this.mesh.receiveShadow = true
        this.mesh.frustumCulled = false
        this.mesh.visible = false
        this.view.world.add(this.mesh)

        this.items = Array.from({ length: COUNT }, () => ({ position: new THREE.Vector3(), rotation: new THREE.Quaternion(), axis: new THREE.Vector3(), speed: 0, scale: 1 }))
        this.route = null
    }

    // New field for this route (layout space), deterministic per route
    generate(route)
    {
        const origin = this.state.planets.origin
        const bodies = [ ...this.state.planets.items, this.state.planets.earth ]
        const seed = route.length

        let placed = 0
        for(let attempt = 0; placed < COUNT && attempt < COUNT * 4; attempt++)
        {
            const r = (k) => random(attempt + seed, k)
            const item = this.items[placed]
            item.scale = 0.5 + Math.pow(r(1), 3) * 4.5
            const distance = MIN_DISTANCE + item.scale * 1.3 + Math.pow(r(2), 1.6) * SPREAD
            const angle = r(3) * Math.PI * 2
            const s = (0.08 + r(4) * 0.84) * route.length

            frameAt(route, s, _tangent, _up, _right)
            pointAt(route, s, _position).addScaledVector(_right, Math.cos(angle) * distance).addScaledVector(_up, Math.sin(angle) * distance)
            if(bodies.some((body) => _position.distanceTo(body.center) < body.radius + item.scale * 1.3 + PLANET_GAP))
                continue

            item.position.copy(_position).add(origin)
            item.rotation.setFromAxisAngle(_up.set(r(5) - 0.5, r(6) - 0.5, r(7) - 0.5).normalize(), r(8) * Math.PI * 2)
            item.axis.set(r(9) - 0.5, r(10) - 0.5, r(11) - 0.5).normalize()
            item.speed = 0.05 + r(12) * 0.25
            placed++
        }
        this.mesh.count = placed
        this.route = route
    }

    update()
    {
        // Only along a real corridor route: the intro's docking arrival (M6b) has no curve or frames
        const flight = this.state.flight
        const visible = flight.active && flight.phase !== 'establish' && !!flight.route?.curve
        this.mesh.visible = visible
        if(!visible)
            return

        if(this.route !== flight.route)
            this.generate(flight.route)

        const elapsed = this.state.time.elapsed
        for(let i = 0; i < this.mesh.count; i++)
        {
            const item = this.items[i]
            _quaternion.copy(item.rotation).multiply(_spin.setFromAxisAngle(item.axis, item.speed * elapsed))
            _matrix.compose(item.position, _quaternion, _scale.setScalar(item.scale))
            this.mesh.setMatrixAt(i, _matrix)
        }
        this.mesh.instanceMatrix.needsUpdate = true
    }
}
