import Time from './Time.js'
import Controls from './Controls.js'
import Viewport from './Viewport.js'
import Planets from './Planets.js'
import Player from './Player.js'
import Travel from './Travel.js'

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
        this.planets = new Planets()
        this.player = new Player()
        this.travel = new Travel()
    }

    resize()
    {
        this.viewport.resize()
    }

    // Floating origin: the current planet is always at (0, 0, 0). Called by Player.update on
    // arrival; View listens to planets.events 'originShift' for its own objects.
    shiftOrigin(offset)
    {
        const player = this.player
        for(const vector of [ player.position, player.previousPosition, player.renderPosition, player.lastWritten ])
            vector.sub(offset)
        player.camera.thirdPerson.shift(offset)
        this.planets.shiftOrigin(offset)
    }

    // Order every frame: input → player (fixed steps + collision) → camera (this frame's player)
    // → View (cinematic override, camera blend, render)
    update()
    {
        this.time.update()
        this.controls.update()
        this.player.update()
        this.player.camera.update()
    }
}
