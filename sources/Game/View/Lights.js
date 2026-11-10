import * as THREE from 'three'

import View from '@/View/View.js'
import State from '@/State/State.js'
import Debug from '@/Debug/Debug.js'

const SUN_DISTANCE = 50
// Fixed tilt so the sun sits a bit off-zenith wherever the player stands
const SUN_TILT = new THREE.Vector3(0.6, 0.35, 0.7).normalize()

const _direction = new THREE.Vector3()
const _tangent = new THREE.Vector3()

// One directional "sun" (shadows on the current planet only) + a hemisphere fill.
// Both follow the player's up so every side of the small planet is daylight.
export default class Lights
{
    constructor()
    {
        this.view = View.getInstance()
        this.state = State.getInstance()
        this.debug = Debug.getInstance()
        this.scene = this.view.scene

        const planet = this.state.planets.current

        this.sun = new THREE.DirectionalLight('#fff4e0', 2.4)
        this.sun.castShadow = true
        this.sun.shadow.mapSize.set(1024, 1024)
        const extent = planet.radius + 4
        Object.assign(this.sun.shadow.camera, { left: - extent, right: extent, top: extent, bottom: - extent, near: 1, far: SUN_DISTANCE * 2 })
        this.sun.shadow.camera.updateProjectionMatrix()
        this.sun.shadow.bias = - 0.0005
        this.sun.shadow.normalBias = 0.04
        this.sun.target.position.copy(planet.center)
        this.scene.add(this.sun, this.sun.target)

        this.fill = new THREE.HemisphereLight('#fff4e0', '#3a2a4a', 0.8)
        this.scene.add(this.fill)

        this.setDebug()
    }

    setDebug()
    {
        if(!this.debug.active)
            return

        const folder = this.debug.ui.getFolder('view/lights')
        folder.add(this.sun, 'intensity', 0, 5, 0.05).name('sunLightIntensity')
        folder.add(this.fill, 'intensity', 0, 5, 0.05).name('fillLightIntensity')
    }

    update()
    {
        const player = this.state.player
        const center = this.state.planets.current.center

        _tangent.copy(SUN_TILT).projectOnPlane(player.up)
        _direction.copy(player.up).addScaledVector(_tangent, 0.7).normalize()

        this.sun.position.copy(center).addScaledVector(_direction, SUN_DISTANCE)
        this.fill.position.copy(player.up)
    }
}
