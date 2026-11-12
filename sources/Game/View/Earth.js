import * as THREE from 'three'

import View from '@/View/View.js'
import State from '@/State/State.js'
import { createAtmosphere } from './Materials/atmosphere.js'
import UIBridge from '../../UI/UIBridge.js'
import Game from '@/Game.js'
import StateMachine from '@/StateMachine.js'

const BASE = `${import.meta.env.BASE_URL}textures/earth/`
const BEACON_COLOR = new THREE.Color('#7ff9ff').multiplyScalar(1.4) // a small glowing point
const BEAM_COLOR = new THREE.Color('#7ff9ff')
// Beacon sizes per unit of Earth radius (2.5× the pre-size-up 34-radius Earth's 0.45 / 1.2 / 5 / 0.12)
const BEACON = { size: 0.0132, lift: 0.035, beam: 0.147, beamRadius: 0.0035 }

const _direction = new THREE.Vector3()

// Non-walkable Earth below Apeiron Station (M6b): NASA Blue Marble day map, Black Marble city
// lights on the dark side, and a thin cloud layer (public domain, see CREDITS.md).
// The Philippines beacon sits at its real coordinates; the globe is turned so it faces the station.
// Fog off: Earth is a distant backdrop (≈ 135 below the station), the indoor fog would grey it.
// High quality: a 4K day map replaces the 2K one, loaded only after the loading screen.
export default class Earth
{
    constructor()
    {
        this.view = View.getInstance()
        this.state = State.getInstance()
        this.data = this.state.planets.earth
        this.sunDirection = this.state.planets.sunDirection

        this.group = new THREE.Group()
        this.group.position.copy(this.data.center).add(this.state.planets.origin) // layout space, inside view.world
        this.view.world.add(this.group)

        const station = this.state.planets.get('station')
        _direction.subVectors(station.center, this.data.center).normalize()
        this.group.quaternion.setFromUnitVectors(this.data.beaconDirection, _direction)
        // Tilt a little so the beacon isn't dead-centre from the station
        this.group.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), - 0.35)

        const loader = new THREE.TextureLoader()
        const load = (name, colorSpace) => new Promise((resolve) =>
        {
            const texture = loader.load(`${BASE}${name}.webp`, () => resolve(), undefined, () => { console.warn(`[Earth] Could not load ${name}`); resolve() })
            texture.colorSpace = colorSpace
            texture.anisotropy = 8
            this.textures[name] = texture
        })
        this.textures = {}
        this.ready = Promise.all([ load('day', THREE.SRGBColorSpace), load('night', THREE.SRGBColorSpace), load('clouds', THREE.NoColorSpace) ])

        this.setSurface()
        this.setClouds()
        this.setBeacon()
        this.group.add(createAtmosphere(this.data.radius, '#6fb4ff', 0.36, this.sunDirection))

        // Easter egg "Signal from home": the Philippines beacon flashes for a few seconds
        this.flash = 0
        UIBridge.getInstance().on('egg:found', ({ id }) => { if(id === 'signal') this.flash = 1 })

        this.view.world.updateMatrixWorld(true)
        this.beaconPosition = this.beacon.getWorldPosition(new THREE.Vector3())
        this.state.planets.events.on('originShift', (offset) => this.beaconPosition.sub(offset))
    }

    setSurface()
    {
        // Day side not overexposed: the map is darkened a little, oceans glint less
        const material = new THREE.MeshStandardMaterial({ map: this.textures.day, color: '#d6d6d6', roughness: 0.9, metalness: 0, fog: false })
        const uniforms = { uNight: { value: this.textures.night }, uSunDirection: { value: this.sunDirection } }

        material.onBeforeCompile = (shader) =>
        {
            Object.assign(shader.uniforms, uniforms)
            shader.vertexShader = shader.vertexShader
                .replace('#include <common>', '#include <common>\nvarying vec3 vEarthNormal;')
                .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nvEarthNormal = normalize(mat3(modelMatrix) * objectNormal);')
            shader.fragmentShader = shader.fragmentShader
                .replace('#include <common>', '#include <common>\nuniform sampler2D uNight;\nuniform vec3 uSunDirection;\nvarying vec3 vEarthNormal;')
                // Oceans are glossier than land (blue-dominant pixels)
                .replace('#include <roughnessmap_fragment>', `
                    float ocean = smoothstep(0.01, 0.06, diffuseColor.b - diffuseColor.r);
                    float roughnessFactor = mix(roughness, 0.5, ocean);`)
                // City lights only on the night side
                .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
                    float night = smoothstep(0.05, - 0.25, dot(normalize(vEarthNormal), uSunDirection));
                    float city = smoothstep(0.25, 0.75, dot(texture2D(uNight, vMapUv).rgb, vec3(0.3, 0.59, 0.11)));
                    totalEmissiveRadiance += vec3(1.0, 0.72, 0.42) * city * night * 0.6;`)
        }

        // Equirectangular texture → latLongToDirection frame (long 0 = +Z)
        this.surface = new THREE.Mesh(new THREE.SphereGeometry(this.data.radius, 128, 64), material)
        this.surface.rotation.y = - Math.PI / 2
        this.group.add(this.surface)
    }

    setClouds()
    {
        this.clouds = new THREE.Mesh(
            new THREE.SphereGeometry(this.data.radius * 1.012, 96, 48),
            // Grey enough that sunlit clouds stay under the bloom threshold
            new THREE.MeshStandardMaterial({ color: '#c4c4c4', alphaMap: this.textures.clouds, transparent: true, opacity: 0.9, depthWrite: false, roughness: 1, metalness: 0, fog: false })
        )
        this.clouds.rotation.y = - Math.PI / 2
        this.group.add(this.clouds)
    }

    setBeacon()
    {
        const direction = this.data.beaconDirection
        const material = new THREE.MeshBasicMaterial({ color: BEACON_COLOR })

        const radius = this.data.radius
        this.beacon = new THREE.Mesh(new THREE.OctahedronGeometry(radius * BEACON.size, 0), material)
        this.beacon.position.copy(direction).multiplyScalar(radius * (1 + BEACON.lift))
        this.group.add(this.beacon)

        this.beam = new THREE.Mesh(
            new THREE.CylinderGeometry(radius * BEACON.beamRadius, radius * BEACON.beamRadius, radius * BEACON.beam, 12, 1, true),
            new THREE.MeshBasicMaterial({ color: BEAM_COLOR, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false })
        )
        this.beam.position.copy(direction).multiplyScalar(radius * (1 + BEACON.beam / 2))
        this.beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction)
        this.group.add(this.beam)
    }

    // High only, after loading: the 4K day map (the 2K one stays for the other qualities)
    updateDayMap()
    {
        const high = this.view.postProcessing.quality === 'high'
        if(high && !this.day4k && !Game.getInstance().stateMachine.is(StateMachine.LOADING))
        {
            this.day4k = new THREE.TextureLoader().load(`${BASE}day-4k.webp`, (texture) => { texture.loaded = true }, undefined, () => console.warn('[Earth] Could not load day-4k'))
            this.day4k.colorSpace = THREE.SRGBColorSpace
            this.day4k.anisotropy = 8
        }
        const map = high && this.day4k?.loaded ? this.day4k : this.textures.day
        if(this.surface.material.map !== map)
            this.surface.material.map = map
    }

    update()
    {
        this.updateDayMap()
        const pulse = 1 + Math.sin(this.state.time.elapsed * 3) * 0.15
        this.flash = Math.max(0, this.flash - this.state.time.delta / 4)
        const blink = this.flash * (0.5 + 0.5 * Math.sin(this.state.time.elapsed * 14))
        this.beacon.scale.setScalar(pulse * (1 + blink * 2.5))
        this.beam.material.opacity = 0.2 + (pulse - 1) * 0.3 + blink * 0.5
        this.clouds.rotation.y += this.state.time.delta * 0.004
    }
}
