import Time from './Time.js'
import Controls from './Controls.js'
import Viewport from './Viewport.js'
import Planets from './Planets.js'
import Player from './Player.js'
import Flight from './Flight.js'
import Interior from './Interior.js'
import Eggs from './Eggs.js'
import Telescope from './Telescope.js'
import Rover from './Rover.js'
import ScienceLab from './ScienceLab.js'
import Scientists from './Scientists.js'

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
        this.interior = new Interior() // before the player: it spawns in the station's hangar (M6b)
        this.player = new Player()
        this.flight = new Flight()
        this.eggs = new Eggs()
        this.telescope = new Telescope() // M7 (after the player: E enters there first)
        this.rover = new Rover()
        this.lab = new ScienceLab()
        this.scientists = new Scientists()
    }

    resize()
    {
        this.viewport.resize()
    }

    // Floating origin: the current planet is always at (0, 0, 0) on foot; in flight the world
    // rebases around the ship. Called by Player.update on arrival and by Flight.update in flight;
    // View listens to planets.events 'originShift' for its own objects.
    shiftOrigin(offset)
    {
        const player = this.player
        for(const vector of [ player.position, player.previousPosition, player.renderPosition, player.lastWritten ])
            vector.sub(offset)
        player.camera.shift(offset)
        this.flight.shift(offset)
        this.planets.shiftOrigin(offset)
    }

    // Order every frame: input → flight (fixed steps, ship) → player (fixed steps + collision, or
    // sampled from the flight) → camera (this frame's player / ship) → View (cinematic
    // override, render)
    update()
    {
        this.time.update()
        this.controls.update()
        this.flight.update()
        this.interior.update()
        this.scientists.update() // before the player: it collides with them
        this.player.update()
        this.telescope.update()
        this.rover.update()
        this.lab.update()
        this.player.camera.update()
    }
}
