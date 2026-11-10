import Camera from './Camera.js'
import Player from './Player.js'
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
        this.player = new Player()
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
        this.player.update()
        this.camera.update()
        this.renderer.update()
    }

    destroy()
    {
    }
}
