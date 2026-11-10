import * as THREE from 'three'

import View from '@/View/View.js'
import State from '@/State/State.js'
import Debug from '@/Debug/Debug.js'

const SUN_DISTANCE = 60

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
        const planet = this.state.planets.current
        if(planet !== this.planet)
            this.setPlanet(planet)

        this.fill.position.copy(this.state.player.up)
    }
}
