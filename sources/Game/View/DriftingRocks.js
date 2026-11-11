import * as THREE from 'three'

import View from '@/View/View.js'
import State from '@/State/State.js'
import { PROP_BUILDERS } from '@/State/PropShapes.js'
import { CORRIDOR_RADIUS, pointAt } from '@/State/FlightPhysics.js'
import { createSurfaceMaterial } from './Materials/surface.js'

const GROUPS = 4
const PER_GROUP = 6
const PASS_DISTANCE = [ 38, 75 ] // closest pass, above the planet's surface (walking area: 0–3 m)
const HALF_PATH = 110 // units before / after the closest pass, then the group recycles
const SPEED = [ 1.2, 2.6 ] // units/s
const CORRIDOR_GAP = CORRIDOR_RADIUS + 14 // never closer than this to a flight route's centre line
const ROUTE_REACH = 200 // only the route's part near this planet matters

const _offset = new THREE.Vector3()
const _position = new THREE.Vector3()
const _quaternion = new THREE.Quaternion()
const _spin = new THREE.Quaternion()
const _scale = new THREE.Vector3()
const _matrix = new THREE.Matrix4()
const _center = new THREE.Vector3()
const _point = new THREE.Vector3()

// Scenery (M5): small groups of rocks drifting slowly past the current planet at a safe distance,
// recycled when far away. No collision. Groups whose path would cross a flight corridor fade out
// (and respawn elsewhere). Off on Low quality. Lives in view.world (layout space).
export default class DriftingRocks
{
    constructor()
    {
        this.view = View.getInstance()
        this.state = State.getInstance()

        const geometry = PROP_BUILDERS.rock.build()[0].geometry.clone()
        geometry.center()

        // Same material setup as the M3 asteroid field (same shader program)
        const material = createSurfaceMaterial({ set: 'regolith', color: '#7d776f', scale: 0.7, variation: 0.15, roughness: 1 })
        this.mesh = new THREE.InstancedMesh(geometry, material, GROUPS * PER_GROUP)
        this.mesh.receiveShadow = true
        this.mesh.frustumCulled = false
        this.view.world.add(this.mesh)

        this.enabled = true
        this.planet = null
        this.route = null
        this.routePoints = []
        this.groups = Array.from({ length: GROUPS }, () => ({
            start: new THREE.Vector3(), // relative to the planet center
            velocity: new THREE.Vector3(),
            time: 0,
            duration: 1,
            fade: 0,
            hidden: false,
            rocks: Array.from({ length: PER_GROUP }, () => ({ offset: new THREE.Vector3(), rotation: new THREE.Quaternion(), axis: new THREE.Vector3(), spin: 0, scale: 1 }))
        }))
    }

    setEnabled(enabled)
    {
        this.enabled = enabled
        this.mesh.visible = enabled
    }

    // A straight pass by the planet: closest point at PASS_DISTANCE above the surface
    spawn(group, planet, anywhere)
    {
        for(let attempt = 0; attempt < 12; attempt++)
        {
            const normal = new THREE.Vector3().randomDirection()
            const direction = new THREE.Vector3().randomDirection().projectOnPlane(normal).normalize()
            const pass = normal.multiplyScalar(planet.radius + THREE.MathUtils.lerp(PASS_DISTANCE[0], PASS_DISTANCE[1], Math.random()))
            const speed = THREE.MathUtils.lerp(SPEED[0], SPEED[1], Math.random())
            group.start.copy(pass).addScaledVector(direction, - HALF_PATH)
            group.velocity.copy(direction).multiplyScalar(speed)
            group.duration = (HALF_PATH * 2) / speed
            group.time = anywhere ? Math.random() * group.duration : 0
            if(!this.crossesRoute(group))
                break
        }
        group.fade = anywhere ? 1 : 0
        group.hidden = false

        for(const rock of group.rocks)
        {
            rock.offset.randomDirection().multiplyScalar(1.5 + Math.random() * 5)
            rock.rotation.setFromAxisAngle(_offset.randomDirection(), Math.random() * Math.PI * 2)
            rock.axis.randomDirection()
            rock.spin = 0.05 + Math.random() * 0.25
            rock.scale = 0.4 + Math.pow(Math.random(), 2) * 1.8
        }
    }

    // Does the rest of this group's path come near the current route's centre line?
    crossesRoute(group)
    {
        for(const point of this.routePoints)
        {
            // Closest point of the remaining path segment to the route point
            const t = THREE.MathUtils.clamp(_offset.subVectors(point, group.start).dot(group.velocity) / group.velocity.lengthSq(), group.time, group.duration)
            if(_position.copy(group.start).addScaledVector(group.velocity, t).distanceTo(point) < CORRIDOR_GAP)
                return true
        }
        return false
    }

    // Route points near this planet, relative to its center
    updateRoute(planet)
    {
        const flight = this.state.flight
        const route = flight.active ? flight.route : null
        if(route === this.route)
            return
        this.route = route
        this.routePoints = []
        if(route && (route.from === planet || route.to === planet))
        {
            for(let s = 0; s <= route.length; s += 6)
            {
                pointAt(route, s, _point).sub(planet.center)
                if(_point.length() < planet.radius + ROUTE_REACH)
                    this.routePoints.push(_point.clone())
            }
        }
        for(const group of this.groups)
            if(this.crossesRoute(group))
                group.hidden = true
    }

    update()
    {
        if(!this.enabled)
            return

        const planet = this.state.planets.current
        const delta = this.state.time.delta
        if(planet !== this.planet)
        {
            this.planet = planet
            this.route = null
            this.routePoints = []
            this.updateRoute(planet)
            for(const group of this.groups)
                this.spawn(group, planet, true)
        }
        // Relative to the planet center, so the floating origin never moves it
        this.updateRoute(planet)

        _center.copy(planet.center).add(this.state.planets.origin) // layout space
        const elapsed = this.state.time.elapsed
        let index = 0
        for(const group of this.groups)
        {
            group.time += delta
            group.fade = THREE.MathUtils.clamp(group.fade + (group.hidden ? - delta / 0.6 : delta / 2), 0, 1)
            if(group.time >= group.duration || (group.hidden && group.fade === 0 && !this.route))
                this.spawn(group, planet, false)

            // Fade in/out at both ends of the path too
            const ends = Math.min(1, group.time / 6, (group.duration - group.time) / 6)
            const visibility = group.fade * Math.max(0, ends)
            _position.copy(group.start).addScaledVector(group.velocity, group.time).add(_center)
            for(const rock of group.rocks)
            {
                _quaternion.copy(rock.rotation).multiply(_spin.setFromAxisAngle(rock.axis, rock.spin * elapsed))
                _matrix.compose(_offset.copy(_position).add(rock.offset), _quaternion, _scale.setScalar(rock.scale * visibility))
                this.mesh.setMatrixAt(index++, _matrix)
            }
        }
        this.mesh.instanceMatrix.needsUpdate = true
    }
}
