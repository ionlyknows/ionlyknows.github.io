import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import View from '@/View/View.js'
import State from '@/State/State.js'
import UIBridge from '../../UI/UIBridge.js'
import { SHIP_SHAPE, shipRestPose } from '@/State/PropShapes.js'
import { BOOST } from '@/State/FlightPhysics.js'

const IN_FLIGHT = [ 'boarding', 'takeoff', 'flying', 'landing' ]

const _projected = new THREE.Vector3()

// The ship (M3): code-built PBR (off-white hull, orange accents, glass canopy, glowing engine,
// nav lights). One parked on every launch pad (in view.world, so the floating origin moves it);
// the flying one follows the flight's interpolated render pose. Also feeds the flight HUD.
export default class Ship
{
    constructor()
    {
        this.view = View.getInstance()
        this.state = State.getInstance()
        this.bridge = UIBridge.getInstance()
        this.scene = this.view.scene

        const env = { userData: { useEnvironment: true } }
        this.materials = {
            paint: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.42, metalness: 0.15, envMapIntensity: 0.6, ...env }),
            metal: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.45, metalness: 0.85, envMapIntensity: 0.6, ...env }),
            glass: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.08, metalness: 1, envMapIntensity: 1.2, ...env }),
            glow: new THREE.MeshBasicMaterial({ vertexColors: true, color: new THREE.Color(1.5, 1.5, 1.5) })
        }

        // One merged geometry per material (4 draw calls per ship)
        const groups = {}
        for(const { geometry, mat } of SHIP_SHAPE.build())
            (groups[mat] ||= []).push(geometry)
        this.geometries = Object.entries(groups).map(([ mat, geometries ]) => ({ mat, geometry: mergeGeometries(geometries) }))

        this.setFlying()
        this.setParked()
    }

    createShip(parent)
    {
        const group = new THREE.Group()
        for(const { mat, geometry } of this.geometries)
        {
            const mesh = new THREE.Mesh(geometry, this.materials[mat])
            mesh.castShadow = mat !== 'glow'
            mesh.receiveShadow = mat !== 'glow'
            group.add(mesh)
        }
        parent.add(group)
        return group
    }

    setFlying()
    {
        this.flying = this.createShip(this.scene)
        this.flying.visible = false

        // Engine flame: additive cone behind the nozzle, longer with thrust
        const geometry = new THREE.ConeGeometry(0.3, 1.6, 20, 1, true)
        geometry.translate(0, 0.8, 0)
        geometry.rotateX(- Math.PI / 2)
        this.flame = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 0.8, 0.35), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }))
        this.flame.position.fromArray(SHIP_SHAPE.engine)
        this.flying.add(this.flame)
    }

    setParked()
    {
        const origin = this.state.planets.origin
        this.parked = this.state.planets.items.map((planet) =>
        {
            const pose = shipRestPose(planet.launchPad, planet.landingPoint)
            const group = this.createShip(this.view.world)
            group.position.copy(pose.position).add(origin) // layout space
            group.quaternion.copy(pose.quaternion)
            return { planet, group }
        })
    }

    update()
    {
        const flight = this.state.flight
        const phase = flight.phase
        const inFlight = IN_FLIGHT.includes(phase)
        const route = flight.route

        // The ship you board leaves its pad; the one at the destination is the one you land
        for(const { planet, group } of this.parked)
            group.visible = !(flight.active && (planet === route.from || (planet === route.to && inFlight)))

        this.flying.visible = inFlight
        if(!inFlight)
            return

        const render = flight.render
        this.flying.position.copy(render.position)
        this.flying.quaternion.copy(render.quaternion)
        const thrust = flight.body.thrust
        this.flame.visible = thrust > 0.02
        this.flame.scale.set(0.8 + thrust * 0.25, 0.8 + thrust * 0.25, 0.2 + thrust * 0.9)

        this.updateHud(flight)
    }

    // Flight HUD (UI): destination, distance, speed and an arrow when the destination is off-screen
    updateHud(flight)
    {
        const route = flight.route
        const body = flight.body
        const camera = this.view.camera.instance
        camera.updateMatrixWorld()
        _projected.copy(route.to.center).project(camera)

        let x = _projected.x
        let y = _projected.y
        const behind = _projected.z > 1
        if(behind)
        {
            x = - x
            y = - y
        }
        const offScreen = behind || Math.abs(x) > 0.9 || Math.abs(y) > 0.86

        this.bridge.emit('flight:hud', {
            name: route.to.name,
            distance: Math.round(flight.render.position.distanceTo(route.endPad.position)),
            speed: THREE.MathUtils.clamp(body.speed / (route.baseSpeed * BOOST), 0, 1),
            boosting: flight.boost > 0.5,
            skippable: body.phase !== 'landing',
            arrow: offScreen ? Math.atan2(y, x) : null
        })
    }
}
