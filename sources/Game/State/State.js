import Time from './Time.js'
import Controls from './Controls.js'
import Viewport from './Viewport.js'
import DayCycle from './DayCycle.js'
import Sun from './Sun.js'
import Player from './Player.js'
import Terrains from './Terrains.js'
import Chunks from './Chunks.js'
import Teleporter from './Teleporter.js'

export default class State
{
    static instance

    static getInstance()
    {
        return State.instance
    }

    constructor()
    {
        if(State.instance)
            return State.instance

        State.instance = this

        this.time = new Time()
        this.controls = new Controls()
        this.viewport = new Viewport()
        this.day = new DayCycle()
        this.sun = new Sun()
        this.player = new Player()
        this.terrains = new Terrains()
        this.chunks = new Chunks()
        this.teleporter = new Teleporter()
        this.workFocus = false
    }

    resize()
    {
        this.viewport.resize()
    }

    update()
    {
        this.time.update()
        this.controls.update()

        // The Work camera is a fixed, scripted view. While it is active the
        // player cannot move, so updating player physics, terrain chunks and
        // the day cycle only burns CPU and can trigger terrain work that is
        // completely hidden by the billboard view.
        if(this.workFocus)
        {
            // Keep the fixed Work camera synchronized with the final
            // teleporter pose without running movement, physics or chunks.
            this.player.camera.update()
            return
        }

        this.day.update()
        this.sun.update()
        this.player.update()
        this.chunks.update()
    }

    setWorkFocus(active)
    {
        this.workFocus = active
    }
}
