import * as THREE from 'three'

import View from '@/View/View.js'
import State from '@/State/State.js'
import { toonMaterial, flat } from './Materials/toon.js'

const MARKER_COLOR = '#35f6ff'
const CLICK_TOLERANCE = 6 // px

const _yAxis = new THREE.Vector3(0, 1, 0)
const _dummy = new THREE.Object3D()
const _pointer = new THREE.Vector2()

// Low-poly planet, its props, and its content-point markers
export default class Planet
{
    constructor()
    {
        this.view = View.getInstance()
        this.state = State.getInstance()
        this.scene = this.view.scene
        this.planet = this.state.planets.current

        this.group = new THREE.Group()
        this.group.position.copy(this.planet.center)
        this.scene.add(this.group)

        this.setSurface()
        this.setProps()
        this.setMarkers()
        this.setClick()
    }

    setSurface()
    {
        const geometry = flat(new THREE.IcosahedronGeometry(this.planet.radius, 5))

        // Slight per-face shade variation
        const base = new THREE.Color(this.planet.color)
        const color = new THREE.Color()
        const count = geometry.attributes.position.count
        const colors = new Float32Array(count * 3)
        for(let face = 0; face < count / 3; face++)
        {
            const noise = Math.sin(face * 12.9898) * 43758.5453
            color.copy(base).offsetHSL(0, 0, (noise - Math.floor(noise)) * 0.08 - 0.04)
            for(let v = 0; v < 3; v++)
                color.toArray(colors, (face * 3 + v) * 3)
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        this.surface = new THREE.Mesh(geometry, toonMaterial({ vertexColors: true }))
        this.surface.receiveShadow = true
        this.group.add(this.surface)
    }

    setProps()
    {
        const types = {
            rock: {
                geometry: flat(new THREE.DodecahedronGeometry(1, 0)),
                material: toonMaterial({ color: '#6b4a5e' }),
                place: (size) => { _dummy.scale.set(size, size * 0.75, size); return - size * 0.2 }
            },
            crystal: {
                geometry: flat(new THREE.OctahedronGeometry(1, 0)),
                material: toonMaterial({ color: '#ffd166', emissive: '#7a4a10' }),
                place: (size) => { _dummy.scale.set(size * 0.6, size * 1.8, size * 0.6); return size * 1.2 }
            }
        }

        for(const [ type, { geometry, material, place } ] of Object.entries(types))
        {
            const props = this.planet.props.filter((prop) => prop.type === type)
            if(!props.length)
                continue

            const mesh = new THREE.InstancedMesh(geometry, material, props.length)
            mesh.castShadow = true
            mesh.receiveShadow = true

            props.forEach((prop, index) =>
            {
                const lift = place(prop.size)
                _dummy.quaternion.setFromUnitVectors(_yAxis, prop.up)
                _dummy.rotateY(index * 2.4)
                _dummy.position.copy(prop.position).sub(this.planet.center).addScaledVector(prop.up, lift)
                _dummy.updateMatrix()
                mesh.setMatrixAt(index, _dummy.matrix)
            })

            this.group.add(mesh)
        }
    }

    setMarkers()
    {
        const baseGeometry = flat(new THREE.CylinderGeometry(1.1, 1.3, 0.3, 8))
        const beamGeometry = new THREE.CylinderGeometry(0.22, 0.22, 4, 8, 1, true)
        const gemGeometry = flat(new THREE.OctahedronGeometry(0.5, 0))
        const baseMaterial = toonMaterial({ color: '#2b2f45' })
        const beamMaterial = new THREE.MeshBasicMaterial({ color: MARKER_COLOR, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })
        const gemMaterial = new THREE.MeshBasicMaterial({ color: MARKER_COLOR })

        this.markers = this.planet.contentPoints.map((point) =>
        {
            const marker = new THREE.Group()
            marker.position.copy(point.position).sub(this.planet.center)
            marker.quaternion.setFromUnitVectors(_yAxis, point.up)

            const base = new THREE.Mesh(baseGeometry, baseMaterial)
            base.castShadow = true
            base.receiveShadow = true

            const beam = new THREE.Mesh(beamGeometry, beamMaterial)
            beam.position.y = 2

            const gem = new THREE.Mesh(gemGeometry, gemMaterial)
            gem.position.y = 3

            marker.add(base, beam, gem)
            marker.userData.pointId = point.id
            this.group.add(marker)

            return { marker, gem }
        })
    }

    // Clicking a marker = pressing E (only works when in range)
    setClick()
    {
        const raycaster = new THREE.Raycaster()
        const canvas = this.view.renderer.instance.domElement
        const targets = this.markers.map(({ marker }) => marker)
        let downX = 0
        let downY = 0

        canvas.addEventListener('pointerdown', (event) =>
        {
            downX = event.clientX
            downY = event.clientY
        })

        canvas.addEventListener('pointerup', (event) =>
        {
            if(Math.abs(event.clientX - downX) > CLICK_TOLERANCE || Math.abs(event.clientY - downY) > CLICK_TOLERANCE)
                return

            _pointer.set(event.clientX / window.innerWidth * 2 - 1, - event.clientY / window.innerHeight * 2 + 1)
            raycaster.setFromCamera(_pointer, this.view.camera.instance)

            const hit = raycaster.intersectObjects(targets, true)[0]
            let object = hit?.object
            while(object && object.userData.pointId === undefined)
                object = object.parent

            if(object)
                this.state.player.interact(object.userData.pointId)
        })
    }

    update()
    {
        const elapsed = this.state.time.elapsed

        for(const { gem } of this.markers)
        {
            gem.rotation.y = elapsed * 1.5
            gem.position.y = 3 + Math.sin(elapsed * 2) * 0.2
        }
    }
}
