import Billboard from './Billboard.js'
import Camera from './Camera.js'
import CertificateBillboards from './CertificateBillboards.js'
import Chunks from './Chunks.js'
import Grass from './Grass.js'
import Noises from './Noises.js'
import Player from './Player.js'
import Renderer from './Renderer.js'
import Sky from './Sky.js'
import Terrains from './Terrains.js'
import Water from './Water.js'

import State from '@/State/State.js'
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
        this.noises = new Noises()
        this.sky = new Sky()
        this.water = new Water()
        this.terrains = new Terrains()
        this.chunks = new Chunks()
        this.player = new Player()
        this.grass = new Grass()
        this.certificateBillboards = new CertificateBillboards(this.scene, this.camera, this.renderer)

        this.state = State.getInstance()
        this.billboard = new Billboard(this.scene, this.camera, this.renderer)
        this.workFocus = false
    }

    setWorkFocus(active)
    {
        if(this.workFocus === active)
            return

        this.workFocus = active
        this.state.setWorkFocus(active)

        // The Work camera only frames the main billboard. Hide world-only
        // geometry and skip its update/render-target work; it is restored
        // before the return flight, so normal gameplay is unchanged.
        this.grass.mesh.visible = !active
        this.player.setVisible(!active)
        this.certificateBillboards.setVisible(!active)
        // Keep the terrain/sky backdrop visible around the billboard frame
        // in Work mode; only its costly state updates are paused below.
        this.terrains.setVisible(true)
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
        this.sky.resize()
        this.terrains.resize()
    }

    update()
    {
        if(!this.workFocus)
        {
            this.sky.update()
            this.water.update()
            this.terrains.update()
            this.chunks.update()
            this.player.update()
            this.grass.update()
            this.certificateBillboards.update()
        }
        this.billboard.update(this.state.time.elapsed)
        this.camera.update()
        this.renderer.update()
    }

    destroy()
    {
    }
}
