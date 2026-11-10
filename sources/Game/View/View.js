import Camera from './Camera.js'
import Lights from './Lights.js'
import Planet from './Planet.js'
import PlayerModel from './PlayerModel.js'
import Renderer from './Renderer.js'
import Space from './Space.js'

import * as THREE from 'three'

export default class View
{
    static instance

    static getInstance()
    {
        return View.instance
    }

    constructor()
    {
        if(View.instance)
            return View.instance

        View.instance = this

        this.scene = new THREE.Scene()

        this.camera = new Camera()
        this.renderer = new Renderer()
        this.space = new Space()
        this.lights = new Lights()
        this.planet = new Planet()
        this.player = new PlayerModel()
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
        this.space.resize()
    }

    update()
    {
        this.space.update()
        this.planet.update()
        this.player.update()
        this.lights.update()
        this.camera.update()
        this.renderer.update()
    }

    destroy()
    {
    }
}
