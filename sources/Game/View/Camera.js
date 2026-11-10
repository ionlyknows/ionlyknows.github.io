import * as THREE from 'three'

import View from '@/View/View.js'
import State from '@/State/State.js'

export const BASE_FOV = 45

const _position = new THREE.Vector3()
const _quaternion = new THREE.Quaternion()

const _check = new THREE.Vector3()

export default class Camera
{
    constructor()
    {
        this.state = State.getInstance()
        this.view = View.getInstance()
        this.scene = this.view.scene
        this.viewport = this.state.viewport

        // Cinematic pose blended over the gameplay camera (View/Cinematics.js)
        this.override = {
            weight: 0,
            position: new THREE.Vector3(),
            quaternion: new THREE.Quaternion(),
            fov: BASE_FOV
        }

        // Debug: how many systems wrote the camera this frame (must always be 1)
        this.writers = 0
        this.lastWritten = new THREE.Vector3()

        this.setInstance()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(BASE_FOV, this.viewport.width / this.viewport.height, 0.1, 5000)
        this.instance.rotation.reorder('YXZ')

        this.scene.add(this.instance)
    }

    resize()
    {
        this.instance.aspect = this.viewport.width / this.viewport.height
        this.instance.updateProjectionMatrix()
    }

    // The only writer of the camera: gameplay pose (State) blended with the cinematic override
    update()
    {
        this.writers = this.instance.position.equals(this.lastWritten) ? 0 : 1
        const playerCamera = this.state.player.camera
        const override = this.override

        _position.fromArray(playerCamera.position)
        _quaternion.fromArray(playerCamera.quaternion)

        if(override.weight > 0)
        {
            _position.lerp(override.position, override.weight)
            _quaternion.slerp(override.quaternion, override.weight)
        }

        this.instance.position.copy(_position)
        this.instance.quaternion.copy(_quaternion)
        this.lastWritten.copy(_position)
        this.writers++

        const fov = BASE_FOV + (override.fov - BASE_FOV) * override.weight
        if(Math.abs(fov - this.instance.fov) > 0.01)
        {
            this.instance.fov = fov
            this.instance.updateProjectionMatrix()
        }
    }

    // Called right before rendering: a change since update() means another writer
    checkWriters()
    {
        if(!_check.copy(this.instance.position).equals(this.lastWritten))
            this.writers++
    }
}
