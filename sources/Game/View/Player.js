import * as THREE from 'three'

import Game from '@/Game.js'
import View from '@/View/View.js'
import Debug from '@/Debug/Debug.js'
import State from '@/State/State.js'
import PlayerModel from './PlayerModel.js'

const SUN_LIGHT_DISTANCE = 20

const ROTATION_SMOOTHING_SPEED = 15

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
        this.game = Game.getInstance()
        this.state = State.getInstance()
        this.view = View.getInstance()
        this.debug = Debug.getInstance()

        this.scene = this.view.scene

        this.renderedRotationY = this.state.player.rotation

        this.setGroup()
        this.setLights()
        this.setModel()
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
        this.sunLight.target.position.set(0, 0, 0)
        this.scene.add(this.sunLight)
        this.scene.add(this.sunLight.target)

        this.fillLight = new THREE.HemisphereLight('#fff8d6', '#3a3a4a', 0.6)
        this.scene.add(this.fillLight)
    }

    setModel()
    {
        this.model = new PlayerModel()
        this.group.add(this.model.group)
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
        const sunState = this.state.sun
        const delta = this.state.time.delta

        this.group.position.set(
            playerState.position.current[0],
            playerState.position.current[1],
            playerState.position.current[2]
        )

        this.renderedRotationY = dampAngle(this.renderedRotationY, playerState.rotation, ROTATION_SMOOTHING_SPEED, delta)
        this.group.rotation.y = this.renderedRotationY

        this.sunLight.target.position.copy(this.group.position)
        this.sunLight.position.set(
            this.group.position.x + sunState.position.x * SUN_LIGHT_DISTANCE,
            this.group.position.y + sunState.position.y * SUN_LIGHT_DISTANCE,
            this.group.position.z + sunState.position.z * SUN_LIGHT_DISTANCE
        )

        this.model.update(playerState, delta)
    }
}
