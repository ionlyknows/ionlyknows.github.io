import Time from './Time.js'
import Controls from './Controls.js'
import Viewport from './Viewport.js'
import Player from './Player.js'

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
        this.player = new Player()
    }

    resize()
    {
        this.viewport.resize()
    }

    update()
    {
        this.time.update()
        this.controls.update()
        this.player.update()
    }
}
