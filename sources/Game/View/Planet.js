import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import View from '@/View/View.js'
import State from '@/State/State.js'
import Debug from '@/Debug/Debug.js'
import { PROP_BUILDERS, MARKER_SHAPES, HEAD_HEIGHT } from '@/State/PropShapes.js'
import { createSurfaceMaterial } from './Materials/surface.js'
import { createAtmosphere, ATMOSPHERE_SCALE } from './Materials/atmosphere.js'

const CONTENT_COLOR = '#35f6ff'
const PAD_COLOR = '#ffcf5a'
const HDR = 1.8 // beacons sit just above the bloom threshold
const FAR_SEGMENTS = 32
const BEACON_LIGHTS = 3 // max interactives on one planet
const CLICK_TOLERANCE = 6 // px

// Per-location look (textures: see CREDITS.md)
const LOOKS = {
    station: { set: 'regolith', tint: '#b8bbc1', scale: 0.2, variation: 0.25, rock: '#8b8d93' },
    forge: { set: 'volcanic', tint: '#564943', scale: 0.18, variation: 0.3, cracks: new THREE.Color(3.4, 0.95, 0.2), rock: '#3c3431', crystal: '#ffb24a' },
    observatory: { set: 'ice', tint: '#8fdcd6', scale: 0.2, variation: 0.2, roughness: 0.45, rock: '#5f9ea0', crystal: '#7ff9ec' },
    trophy: { set: 'sand', tint: '#ead49e', scale: 0.22, variation: 0.2, rock: '#b39a6a', crystal: '#ffe08a' }
}

const _yAxis = new THREE.Vector3(0, 1, 0)
const _pointer = new THREE.Vector2()

// All locations: PBR triplanar surface (LOD), props, beacons, launch pad, atmosphere.
// Only the current planet animates, casts shadows and has beacon lights.
export default class Planets
{
    constructor()
    {
        this.view = View.getInstance()
        this.state = State.getInstance()
        this.scene = this.view.scene
        this.sunDirection = this.state.planets.sunDirection

        this.segments = 64
        this.setShared()
        this.items = this.state.planets.items.map((planet) => this.createPlanet(planet))
        this.current = null

        this.setBeaconLights()
        this.setClick()
        this.setColliderDebug()

        // Floating origin: planet groups live in view.world, which View shifts; the beacon
        // lights and collider wireframes are in scene space, so place them again
        this.state.planets.events.on('originShift', () =>
        {
            this.view.world.updateMatrixWorld(true)
            if(this.current)
                this.placeBeaconLights()
            this.colliderDebug.planet = null
        })
    }

    setShared()
    {
        const env = { userData: { useEnvironment: true } } // env map arrives during loading (View.createEnvironment)

        // Geometry per prop type, merged per material
        this.propGeometries = {}
        for(const [ type, builder ] of Object.entries(PROP_BUILDERS))
        {
            const parts = builder.build()
            const groups = {}
            for(const { geometry, mat } of parts)
                (groups[mat] ||= []).push(geometry)
            this.propGeometries[type] = Object.entries(groups).map(([ mat, geometries ]) => ({ mat, geometry: geometries.length > 1 ? mergeGeometries(geometries) : geometries[0] }))
        }

        this.materials = {
            metal: createSurfaceMaterial({ set: 'metal', scale: 0.8, variation: 0.05, metalness: 0.9, roughness: 0.9, vertexColors: true, ...env }),
            paint: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.45, metalness: 0.2, envMapIntensity: 0.6, ...env }),
            panel: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.15, metalness: 0.7, envMapIntensity: 1.2, ...env }),
            polished: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.18, metalness: 1, envMapIntensity: 1.6, ...env }),
            cloth: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, side: THREE.DoubleSide }),
            glow: new THREE.MeshBasicMaterial({ vertexColors: true, color: new THREE.Color(2.2, 2.2, 2.2) })
        }

        const hdr = (color) => new THREE.Color(color).multiplyScalar(HDR)
        const beam = (color) => new THREE.MeshBasicMaterial({ color: hdr(color), transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, depthWrite: false })

        this.marker = {
            baseGeometry: MARKER_SHAPES.base(),
            padGeometry: MARKER_SHAPES.pad(),
            ringGeometry: new THREE.TorusGeometry(1.5, 0.05, 8, 64),
            beamGeometry: new THREE.CylinderGeometry(0.2, 0.2, 4, 16, 1, true),
            gemGeometry: new THREE.OctahedronGeometry(0.45, 0),
            baseMaterial: createSurfaceMaterial({ set: 'metal', scale: 0.8, variation: 0.05, color: '#4a505c', metalness: 0.85, roughness: 0.8, ...env }),
            content: { color: CONTENT_COLOR, beam: beam(CONTENT_COLOR), gem: new THREE.MeshBasicMaterial({ color: hdr(CONTENT_COLOR) }) },
            pad: { color: PAD_COLOR, beam: beam(PAD_COLOR), gem: new THREE.MeshBasicMaterial({ color: hdr(PAD_COLOR) }) }
        }
    }

    createPlanet(planet)
    {
        const look = LOOKS[planet.id]
        const group = new THREE.Group()
        group.position.copy(planet.center).add(this.state.planets.origin) // layout space, inside view.world
        this.view.world.add(group)

        const item = { planet, group, casters: [], gems: [], markers: [], atmosphere: null }

        // Smooth sphere for walking; all relief comes from the normal maps
        const surfaceMaterial = createSurfaceMaterial({ set: look.set, color: look.tint, scale: look.scale, variation: look.variation, roughness: look.roughness ?? 1, cracks: look.cracks })
        item.near = new THREE.Mesh(new THREE.SphereGeometry(planet.radius, this.segments, this.segments), surfaceMaterial)
        item.near.receiveShadow = true
        const far = new THREE.Mesh(new THREE.SphereGeometry(planet.radius, FAR_SEGMENTS, FAR_SEGMENTS), surfaceMaterial)
        const lod = new THREE.LOD()
        lod.addLevel(item.near, 0)
        lod.addLevel(far, planet.radius * 7)
        group.add(lod)

        const planetMaterials = {
            rock: createSurfaceMaterial({ set: look.set, color: look.rock, scale: 0.7, variation: 0.15, roughness: look.roughness ?? 1 }),
            crystal: new THREE.MeshPhysicalMaterial({
                color: look.crystal || '#ffffff',
                emissive: look.crystal || '#ffffff',
                emissiveIntensity: 0.12,
                roughness: 0.06,
                metalness: 0.05,
                clearcoat: 1,
                clearcoatRoughness: 0.04,
                iridescence: 0.5,
                flatShading: true,
                transparent: true,
                opacity: 0.88,
                userData: { useEnvironment: true },
                envMapIntensity: 2.2
            })
        }

        // Props: one InstancedMesh per type and material
        for(const type of Object.keys(PROP_BUILDERS))
        {
            const props = planet.props.filter((prop) => prop.type === type)
            if(!props.length)
                continue

            for(const { mat, geometry } of this.propGeometries[type])
            {
                const mesh = new THREE.InstancedMesh(geometry, planetMaterials[mat] || this.materials[mat], props.length)
                mesh.receiveShadow = true

                props.forEach((prop, index) => mesh.setMatrixAt(index, prop.matrix)) // same transform as the collider
                mesh.computeBoundingSphere()

                group.add(mesh)
                if(mat !== 'glow')
                    item.casters.push(mesh)
            }
        }

        // Beacons for content points, plus the launch pad
        for(const point of planet.interactives)
            this.createMarker(item, point, point.opens === 'destinations')

        item.atmosphere = createAtmosphere(planet.radius, planet.accent, 0.5, this.sunDirection)
        group.add(item.atmosphere)

        return item
    }

    createMarker(item, point, isPad)
    {
        const marker = new THREE.Group()
        marker.position.copy(point.position).sub(item.planet.center)
        marker.quaternion.setFromUnitVectors(_yAxis, point.up)
        marker.userData.pointId = point.id
        marker.userData.planetId = item.planet.id
        marker.userData.color = isPad ? PAD_COLOR : CONTENT_COLOR

        const materials = isPad ? this.marker.pad : this.marker.content

        const base = new THREE.Mesh(isPad ? this.marker.padGeometry : this.marker.baseGeometry, this.marker.baseMaterial)
        base.receiveShadow = true
        marker.add(base)
        item.casters.push(base)

        if(isPad)
        {
            const ring = new THREE.Mesh(this.marker.ringGeometry, materials.gem)
            ring.rotation.x = Math.PI / 2
            ring.position.y = 0.1
            marker.add(ring)
        }

        const beam = new THREE.Mesh(this.marker.beamGeometry, materials.beam)
        beam.position.y = 2
        marker.add(beam)

        const gem = new THREE.Mesh(this.marker.gemGeometry, materials.gem)
        gem.position.y = 3
        marker.add(gem)

        item.group.add(marker)
        item.gems.push(gem)
        item.markers.push(marker)
    }

    // A small point light per beacon of the current planet (fixed pool: no shader recompiles)
    setBeaconLights()
    {
        this.beaconLights = []
        for(let i = 0; i < BEACON_LIGHTS; i++)
        {
            const light = new THREE.PointLight('#ffffff', 0, 9, 2)
            this.scene.add(light)
            this.beaconLights.push(light)
        }
    }

    // Planet detail per quality (segments of the near sphere)
    setDetail(segments)
    {
        if(segments === this.segments)
            return

        this.segments = segments
        for(const item of this.items)
        {
            item.near.geometry.dispose()
            item.near.geometry = new THREE.SphereGeometry(item.planet.radius, segments, segments)
        }
    }

    // Clicking a beacon of the current planet = pressing E (only when in range)
    setClick()
    {
        const raycaster = new THREE.Raycaster()
        const canvas = this.view.renderer.instance.domElement
        let downX = 0
        let downY = 0

        canvas.addEventListener('pointerdown', (event) =>
        {
            downX = event.clientX
            downY = event.clientY
        })

        canvas.addEventListener('pointerup', (event) =>
        {
            if(Math.abs(event.clientX - downX) > CLICK_TOLERANCE || Math.abs(event.clientY - downY) > CLICK_TOLERANCE || !this.current)
                return

            _pointer.set(event.clientX / window.innerWidth * 2 - 1, - event.clientY / window.innerHeight * 2 + 1)
            raycaster.setFromCamera(_pointer, this.view.camera.instance)

            const hit = raycaster.intersectObjects(this.current.markers, true)[0]
            let object = hit?.object
            while(object && object.userData.pointId === undefined)
                object = object.parent

            if(object)
                this.state.player.interact(object.userData.pointId)
        })
    }

    setCurrent(planet)
    {
        if(this.current)
        {
            for(const caster of this.current.casters)
                caster.castShadow = false
            this.current.atmosphere.material.uniforms.uIntensity.value = this.current.atmosphere.userData.baseIntensity
        }

        this.current = this.items.find((item) => item.planet === planet)
        for(const caster of this.current.casters)
            caster.castShadow = true

        this.placeBeaconLights()
    }

    placeBeaconLights()
    {
        this.current.group.updateMatrixWorld(true)
        this.beaconLights.forEach((light, index) =>
        {
            const marker = this.current.markers[index]
            light.intensity = marker ? 6 : 0
            if(!marker)
                return

            light.color.set(marker.userData.color)
            light.position.set(0, 2.6, 0)
            marker.localToWorld(light.position)
        })
    }

    // #debug: C draws every active collider (current planet) as a wireframe prism
    setColliderDebug()
    {
        this.colliderDebug = { visible: false, planet: null, lines: null }
        if(!Debug.getInstance().active)
            return

        window.addEventListener('keydown', (event) =>
        {
            if(event.code !== 'KeyC' || event.repeat)
                return
            this.colliderDebug.visible = !this.colliderDebug.visible
            this.colliderDebug.planet = null
        })
    }

    updateColliderDebug()
    {
        const debug = this.colliderDebug
        const planet = this.state.planets.current
        if(debug.lines)
            debug.lines.visible = debug.visible
        if(!debug.visible || debug.planet === planet)
            return

        debug.planet = planet
        if(debug.lines)
        {
            debug.lines.geometry.dispose()
            this.scene.remove(debug.lines)
        }

        const points = []
        const corner = (collider, p, h) => collider.center.clone()
            .addScaledVector(collider.axisX, p[0])
            .addScaledVector(collider.axisZ, p[1])
            .add(collider.center.clone().sub(planet.center).normalize().multiplyScalar(h))
        for(const collider of planet.colliders)
        {
            for(const polygon of collider.polygons)
            {
                polygon.forEach((p, i) =>
                {
                    const q = polygon[(i + 1) % polygon.length]
                    for(const h of [ 0.03, HEAD_HEIGHT ])
                        points.push(corner(collider, p, h), corner(collider, q, h))
                    points.push(corner(collider, p, 0.03), corner(collider, p, HEAD_HEIGHT))
                })
            }
        }

        debug.lines = new THREE.LineSegments(
            new THREE.BufferGeometry().setFromPoints(points),
            new THREE.LineBasicMaterial({ color: '#ff3df5', depthTest: false, transparent: true, fog: false, toneMapped: false })
        )
        debug.lines.renderOrder = 999
        debug.lines.frustumCulled = false
        this.scene.add(debug.lines)
    }

    update()
    {
        if(this.current?.planet !== this.state.planets.current)
            this.setCurrent(this.state.planets.current)

        this.updateColliderDebug()

        const elapsed = this.state.time.elapsed
        const { planet, gems, atmosphere } = this.current

        for(let i = 0; i < gems.length; i++)
        {
            gems[i].rotation.y = elapsed * 1.5
            gems[i].position.y = 3 + Math.sin(elapsed * 2 + i) * 0.2
        }

        // Fade the atmosphere out when the camera is inside it
        const shell = planet.radius * ATMOSPHERE_SCALE
        const distance = this.view.camera.instance.position.distanceTo(planet.center)
        const fade = THREE.MathUtils.smoothstep(distance, shell * 1.05, shell * 1.8)
        atmosphere.material.uniforms.uIntensity.value = atmosphere.userData.baseIntensity * fade
    }
}
