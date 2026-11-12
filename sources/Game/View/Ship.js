import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import View from '@/View/View.js'
import State from '@/State/State.js'
import UIBridge from '../../UI/UIBridge.js'
import { SHIP_SHAPE, shipRestPose } from '@/State/PropShapes.js'
import { BOOST } from '@/State/FlightPhysics.js'

const IN_FLIGHT = [ 'boarding', 'takeoff', 'flying', 'landing' ]

// The ship model (M5): Quaternius "Spaceship" (CC0, see CREDITS.md), its atlas colours split into
// hull / trim / glass / accent groups, scaled to 5.1 m, nose +Z, belly at y = 0 (public/models/ship.glb)
const MODEL = {
    url: `${import.meta.env.BASE_URL}models/ship.glb`,
    hatch: [ 0, 0.85, - 0.3 ], // the canopy
    engines: [ [ 0.36, 0.5, - 1.92 ], [ - 0.36, 0.5, - 1.92 ] ],
    engineRadius: 0.17,
    navLights: [ [ 2.0, 0.9, - 1.55 ], [ - 2.0, 0.9, - 1.55 ] ] // red port (+X), green starboard
}
const FALLBACK_ENGINES = [ SHIP_SHAPE.engine ]

const _projected = new THREE.Vector3()

// Bake a GLB mesh's node transform (meshopt quantization) into float positions (for colliders)
function bakedGeometry(mesh)
{
    const source = mesh.geometry.attributes.position
    const array = new Float32Array(source.count * 3)
    const vertex = new THREE.Vector3()
    for(let i = 0; i < source.count; i++)
        vertex.fromBufferAttribute(source, i).applyMatrix4(mesh.matrixWorld).toArray(array, i * 3)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(array, 3))
    if(mesh.geometry.index)
        geometry.setIndex(mesh.geometry.index.clone())
    return geometry
}

// The ships: one parked on every launch pad (in view.world, so the floating origin moves it) and the
// flying one, which follows the flight's interpolated render pose. Until the GLB has loaded (or if it
// fails) they are the code-built M3 ship. Also feeds the flight HUD.
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
            glow: new THREE.MeshBasicMaterial({ vertexColors: true, color: new THREE.Color(1.5, 1.5, 1.5) }),
            // GLB groups (Apeiron palette)
            hull: new THREE.MeshStandardMaterial({ color: '#eeeae2', roughness: 0.38, metalness: 0.12, envMapIntensity: 0.7, ...env }),
            trim: new THREE.MeshStandardMaterial({ color: '#3d434c', roughness: 0.4, metalness: 0.85, envMapIntensity: 0.8, ...env }),
            canopy: new THREE.MeshStandardMaterial({ color: '#141b26', roughness: 0.05, metalness: 1, envMapIntensity: 1.4, ...env }),
            accent: new THREE.MeshStandardMaterial({ color: '#ff7a2e', roughness: 0.42, metalness: 0.1, envMapIntensity: 0.6, ...env })
        }
        this.flameMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 0.8, 0.35), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })

        // Code-built ship: one merged geometry per material (4 draw calls per ship)
        const groups = {}
        for(const { geometry, mat } of SHIP_SHAPE.build())
            (groups[mat] ||= []).push(geometry)
        this.geometries = Object.entries(groups).map(([ mat, geometries ]) => ({ mat, geometry: mergeGeometries(geometries) }))
        this.engines = FALLBACK_ENGINES

        this.setFlying()
        this.setParked()
    }

    // Called by Game.load(): resolves either way (the code-built ship stays on failure)
    load()
    {
        const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
        return loader.loadAsync(MODEL.url)
            .then((gltf) => this.setModel(gltf))
            .catch((error) => console.warn('[Ship] Ship model failed to load, keeping the code-built ship', error))
    }

    setModel(gltf)
    {
        const names = { hull: 'hull', trim: 'trim', glass: 'canopy', accent: 'accent' }
        const root = gltf.scene
        root.updateMatrixWorld(true)

        const parts = []
        root.traverse((object) =>
        {
            if(object.isMesh)
                parts.push({ geometry: object.geometry, matrix: object.matrixWorld.clone(), mat: names[object.material.name] || 'hull', baked: bakedGeometry(object) })
        })
        if(!parts.length)
            return

        // Engine glow discs + nav lights (code-built, merged into one glow mesh)
        const glow = []
        for(const engine of MODEL.engines)
        {
            const disc = new THREE.CircleGeometry(MODEL.engineRadius, 24).toNonIndexed()
            disc.rotateY(Math.PI) // faces backward (-Z)
            disc.translate(engine[0], engine[1], engine[2] - 0.01)
            glow.push(this.tint(disc, '#ffb46b'))
        }
        MODEL.navLights.forEach((position, i) =>
        {
            const light = new THREE.SphereGeometry(0.07, 10, 8).toNonIndexed()
            light.translate(...position)
            glow.push(this.tint(light, i === 0 ? '#ff3b3b' : '#3bff7a'))
        })

        this.model = { parts, glow: mergeGeometries(glow) }
        this.engines = MODEL.engines

        // Colliders follow the drawn mesh (F28); the astronaut boards at the canopy
        this.state.planets.setShipShape(parts.map(({ baked }) => ({ geometry: baked })), MODEL.hatch)

        // Swap every ship (same pivot and pose)
        for(const ship of [ this.flying, ...this.parked.map(({ group }) => group) ])
        {
            ship.remove(...ship.children.filter((child) => child.userData.body))
            this.addBody(ship)
            if(ship === this.flying)
                this.setFlames(ship)
        }
    }

    tint(geometry, color)
    {
        const tint = new THREE.Color(color)
        const colors = new Float32Array(geometry.attributes.position.count * 3)
        for(let i = 0; i < colors.length; i += 3)
            tint.toArray(colors, i)
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        geometry.deleteAttribute('uv')
        geometry.deleteAttribute('normal')
        return geometry
    }

    addBody(group)
    {
        const meshes = this.model
            ? [
                ...this.model.parts.map(({ geometry, matrix, mat }) =>
                {
                    const mesh = new THREE.Mesh(geometry, this.materials[mat])
                    mesh.matrix.copy(matrix)
                    mesh.matrixAutoUpdate = false
                    return mesh
                }),
                new THREE.Mesh(this.model.glow, this.materials.glow)
            ]
            : this.geometries.map(({ mat, geometry }) => new THREE.Mesh(geometry, this.materials[mat]))

        for(const mesh of meshes)
        {
            const glows = mesh.material === this.materials.glow
            mesh.castShadow = !glows
            mesh.receiveShadow = !glows
            mesh.userData.body = true
            group.add(mesh)
        }
    }

    createShip(parent)
    {
        const group = new THREE.Group()
        this.addBody(group)
        parent.add(group)
        return group
    }

    // Engine flames: additive cones behind each nozzle, longer with thrust
    setFlames(ship)
    {
        for(const flame of this.flames || [])
            ship.remove(flame)

        const geometry = new THREE.ConeGeometry(this.engines.length > 1 ? 0.2 : 0.3, 1.6, 20, 1, true)
        geometry.translate(0, 0.8, 0)
        geometry.rotateX(- Math.PI / 2)
        this.flames = this.engines.map((engine) =>
        {
            const flame = new THREE.Mesh(geometry, this.flameMaterial)
            flame.position.fromArray(engine)
            ship.add(flame)
            return flame
        })
    }

    setFlying()
    {
        this.flying = this.createShip(this.scene)
        this.flying.visible = false
        this.setFlames(this.flying)
    }

    setParked()
    {
        const origin = this.state.planets.origin
        this.parked = this.state.planets.items.map((planet) =>
        {
            // Apeiron Station (M6b): the ship rests on the hangar pad, nose to the bay door
            const pose = planet.hangar ? planet.hangar.rest : shipRestPose(planet.launchPad, planet.landingPoint)
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
        const indoor = this.view.station.inside // the planets' ships are hidden behind the station walls
        for(const { planet, group } of this.parked)
            group.visible = !(indoor && !planet.hangar) && !(flight.active && (planet === route.from || (planet === route.to && inFlight)))

        this.flying.visible = inFlight
        if(!inFlight)
            return

        const render = flight.render
        this.flying.position.copy(render.position)
        this.flying.quaternion.copy(render.quaternion)
        const thrust = flight.body.thrust
        for(const flame of this.flames)
        {
            flame.visible = thrust > 0.02
            flame.scale.set(0.8 + thrust * 0.25, 0.8 + thrust * 0.25, 0.2 + thrust * 0.9)
        }

        this.updateHud(flight)
    }

    // Flight HUD (UI): destination, distance, speed and an arrow when the destination is off-screen
    updateHud(flight)
    {
        if(flight.skipping || flight.skipped)
            return

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
            autopilot: route.autopilot,
            distance: Math.round(flight.render.position.distanceTo(route.endPad.position)),
            speed: THREE.MathUtils.clamp(body.speed / (route.baseSpeed * (route.autopilot ? 1 : BOOST)), 0, 1),
            boosting: flight.boost > 0.5,
            skippable: body.phase !== 'landing',
            arrow: offScreen ? Math.atan2(y, x) : null
        })
    }
}
