import * as THREE from 'three'

import View from '@/View/View.js'
import Debug from '@/Debug/Debug.js'
import State from '@/State/State.js'

const ROTATION_SMOOTHING_SPEED = 15

// Temporary player (M0): a simple colored capsule. Replaced by the astronaut in M1.
const CAPSULE_RADIUS = 0.5
const CAPSULE_LENGTH = 1

function dampAngle(current, target, speed, delta)
{
    let diff = (target - current) % (Math.PI * 2)

    if(diff > Math.PI)
        diff -= Math.PI * 2
    else if(diff < -Math.PI)
        diff += Math.PI * 2

    const t = 1 - Math.exp(-speed * delta)

    return current + diff * t
}

export default class Player
{
    constructor()
    {
        this.state = State.getInstance()
        this.view = View.getInstance()
        this.debug = Debug.getInstance()

        this.scene = this.view.scene

        this.renderedRotationY = this.state.player.rotation

        this.setGroup()
        this.setLights()
        this.setCapsule()
        this.setDebug()
    }

    setGroup()
    {
        this.group = new THREE.Group()
        this.scene.add(this.group)
    }

    setLights()
    {
        this.sunLight = new THREE.DirectionalLight('#fff8d6', 2.4)
        this.sunLight.position.set(10, 20, 10)
        this.scene.add(this.sunLight)

        this.fillLight = new THREE.HemisphereLight('#fff8d6', '#3a3a4a', 0.6)
        this.scene.add(this.fillLight)
    }

    setCapsule()
    {
        const geometry = new THREE.CapsuleGeometry(CAPSULE_RADIUS, CAPSULE_LENGTH, 8, 16)
        const material = new THREE.MeshStandardMaterial({ color: '#ff8a3d', roughness: 0.6 })
        this.capsule = new THREE.Mesh(geometry, material)
        // Feet at the group origin
        this.capsule.position.y = CAPSULE_LENGTH * 0.5 + CAPSULE_RADIUS
        this.group.add(this.capsule)

        // Small "visor" so the facing direction is readable
        const visor = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.2, 0.2),
            new THREE.MeshStandardMaterial({ color: '#35f6ff', roughness: 0.3 })
        )
        visor.position.set(0, CAPSULE_LENGTH * 0.5 + 0.2, -CAPSULE_RADIUS)
        this.capsule.add(visor)
    }

    setDebug()
    {
        if(!this.debug.active)
            return

        const playerFolder = this.debug.ui.getFolder('view/player')

        playerFolder.add(this.sunLight, 'intensity', 0, 5, 0.05).name('sunLightIntensity')
        playerFolder.add(this.fillLight, 'intensity', 0, 5, 0.05).name('fillLightIntensity')
    }

    update()
    {
        const playerState = this.state.player
        const delta = this.state.time.delta

        this.group.position.set(
            playerState.position.current[0],
            playerState.position.current[1],
            playerState.position.current[2]
        )

        this.renderedRotationY = dampAngle(this.renderedRotationY, playerState.rotation, ROTATION_SMOOTHING_SPEED, delta)
        this.group.rotation.y = this.renderedRotationY
    }
}
