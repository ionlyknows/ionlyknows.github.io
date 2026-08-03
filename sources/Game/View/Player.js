import * as THREE from 'three'

import Game from '@/Game.js'
import View from '@/View/View.js'
import Debug from '@/Debug/Debug.js'
import State from '@/State/State.js'
import PlayerModel from './PlayerModel.js'

const SUN_LIGHT_DISTANCE = 20

export default class Player
{
    constructor()
    {
        this.game = Game.getInstance()
        this.state = State.getInstance()
        this.view = View.getInstance()
        this.debug = Debug.getInstance()

        this.scene = this.view.scene

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
        // Every other material in the scene (terrain, sky, grass, water...) is a hand
        // rolled ShaderMaterial that fakes lighting from a uSunPosition uniform and
        // never touches THREE's lighting system. The imported character instead uses
        // a real MeshStandardMaterial (needed for skinning), so it needs an actual
        // THREE.Light to be shaded consistently with the same sun direction. These
        // lights live at the scene root (not under this.group) so their direction
        // stays correct regardless of player position/rotation.
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

        this.group.position.set(
            playerState.position.current[0],
            playerState.position.current[1],
            playerState.position.current[2]
        )

        this.group.rotation.y = playerState.rotation

        // Keep the light's target glued to the player (precision) while its offset
        // from that target still matches the global sun direction (position - target).
        this.sunLight.target.position.copy(this.group.position)
        this.sunLight.position.set(
            this.group.position.x + sunState.position.x * SUN_LIGHT_DISTANCE,
            this.group.position.y + sunState.position.y * SUN_LIGHT_DISTANCE,
            this.group.position.z + sunState.position.z * SUN_LIGHT_DISTANCE
        )

        this.model.update(playerState, this.state.time.delta)
    }
}
