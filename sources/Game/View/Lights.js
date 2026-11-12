import * as THREE from 'three'

import View from '@/View/View.js'
import State from '@/State/State.js'
import Debug from '@/Debug/Debug.js'

const SUN_DISTANCE = 60
const OUTDOOR = { sun: 3.2, fill: 0.08, fog: 0.002, sky: '#8ea6ff', ground: '#06070c' }
const INDOOR = { sun: 1.1, fill: 0.55, fog: 0.005, sky: '#8ea6ff', ground: '#06070c' }
// Outside Apeiron Station: hard sun, and soft blue Earth-shine from below (Earth's side)
const STATION = { sun: 3.2, fill: 0.32, fog: 0.002, sky: '#0b0e18', ground: '#4f7fbf' }
const _sky = new THREE.Color()
const _ground = new THREE.Color()
const _toEarth = new THREE.Vector3()

const _matrix = new THREE.Matrix4()
const _inverse = new THREE.Matrix4()
const _snapped = new THREE.Vector3()
const _zero = new THREE.Vector3()
const _worldUp = new THREE.Vector3(0, 1, 0)
const SHADOWS = {
    low: null,
    medium: { size: 1024, radius: 1 },
    high: { size: 2048, radius: 3 } // PCF + larger radius = soft (PCFSoftShadowMap is deprecated in r184)
}

// Real space lighting: one strong sun from a fixed direction (so planets have a real
// dark side) and a very weak cool fill. Shadows only on the current planet.
export default class Lights
{
    constructor()
    {
        this.view = View.getInstance()
        this.state = State.getInstance()
        this.debug = Debug.getInstance()
        this.scene = this.view.scene
        this.direction = this.state.planets.sunDirection

        this.sun = new THREE.DirectionalLight('#fff1dc', 3.2)
        this.sun.castShadow = true
        this.sun.shadow.mapSize.set(1024, 1024)
        this.sun.shadow.bias = - 0.0004
        this.sun.shadow.normalBias = 0.04
        this.scene.add(this.sun, this.sun.target)

        this.fill = new THREE.HemisphereLight('#8ea6ff', '#06070c', 0.08)
        this.scene.add(this.fill)

        this.planet = null
        this.state.planets.events.on('originShift', () => { this.planet = null }) // refit next frame

        this.setDebug()
    }

    setDebug()
    {
        if(!this.debug.active)
            return

        const folder = this.debug.ui.getFolder('view/lights')
        folder.add(this.sun, 'intensity', 0, 5, 0.05).name('sunLightIntensity')
        folder.add(this.fill, 'intensity', 0, 5, 0.01).name('fillLightIntensity')
    }

    interiorTarget(interior)
    {
        if(!this.interiorBounds || this.interiorBounds.center !== interior.center)
            this.interiorBounds = { center: interior.center, radius: interior.layout.radius } // every module, the hangar's end included
        return this.interiorBounds
    }

    setShadowQuality(quality)
    {
        const shadow = SHADOWS[quality]
        this.sun.castShadow = !!shadow
        if(!shadow)
            return

        this.sun.shadow.radius = shadow.radius
        if(this.sun.shadow.mapSize.x !== shadow.size)
        {
            this.planet = null // texel size changed: snap again
            this.sun.shadow.mapSize.set(shadow.size, shadow.size)
            this.sun.shadow.map?.dispose()
            this.sun.shadow.map = null
        }
    }

    // Sun sits on the fixed sun direction of the current planet; the shadow camera fits the
    // planet and its center is snapped to the shadow-map texel grid (no shimmer)
    setPlanet(planet)
    {
        this.planet = planet
        const extent = planet.radius + 6
        const camera = this.sun.shadow.camera
        Object.assign(camera, { left: - extent, right: extent, top: extent, bottom: - extent, near: 1, far: SUN_DISTANCE + extent * 2 })
        camera.updateProjectionMatrix()
        this.snapShadow()
    }

    snapShadow()
    {
        const planet = this.planet
        const texel = (this.sun.shadow.camera.right - this.sun.shadow.camera.left) / this.sun.shadow.mapSize.x

        // Light-space basis (same as the shadow camera's lookAt)
        _matrix.lookAt(_zero, this.direction, _worldUp)
        _inverse.copy(_matrix).invert()
        _snapped.copy(planet.center).applyMatrix4(_inverse)
        _snapped.x = Math.round(_snapped.x / texel) * texel
        _snapped.y = Math.round(_snapped.y / texel) * texel
        _snapped.applyMatrix4(_matrix)

        this.sun.target.position.copy(_snapped)
        this.sun.position.copy(_snapped).addScaledVector(this.direction, SUN_DISTANCE)
        this.sun.target.updateMatrixWorld()
    }

    update()
    {
        // Inside the station (M6; M6b: the camera is inside its walls, View/Station.js): a softer sun
        // through the windows, a stronger cool fill, shadows fitted to the interior, light fog.
        // Intensities only (eased over ~0.3 s, the camera can fly through the bay door): no recompiles.
        const interior = this.state.interior
        const indoor = this.view.station.inside
        if(indoor !== this.indoor)
        {
            this.indoor = indoor
            this.planet = null
        }
        const k = this.lightsSet ? 1 - Math.exp(- 10 * this.state.time.delta) : 1
        this.lightsSet = true
        const atStation = !indoor && this.view.station.near
        const target = indoor ? INDOOR : atStation ? STATION : OUTDOOR
        this.sun.intensity += (target.sun - this.sun.intensity) * k
        this.fill.intensity += (target.fill - this.fill.intensity) * k
        this.fill.color.lerp(_sky.set(target.sky), k)
        this.fill.groundColor.lerp(_ground.set(target.ground), k)
        this.view.scene.fog.density += (target.fog - this.view.scene.fog.density) * k
        const planet = indoor ? this.interiorTarget(interior) : this.state.planets.current
        if(planet !== this.planet)
            this.setPlanet(planet)

        // The fill's "sky" side: the player's up, or (outside the station) away from Earth
        if(atStation)
            this.fill.position.copy(_toEarth.subVectors(interior.center, this.state.planets.earth.center).normalize())
        else
            this.fill.position.copy(this.state.player.up)
    }
}
