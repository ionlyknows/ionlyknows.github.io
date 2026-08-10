import Debug from '@/Debug/Debug.js'
import State from '@/State/State.js'
import View from '@/View/View.js'
import Settings from '@/Settings.js'

export default class Game
{
    static instance

    static getInstance()
    {
        return Game.instance
    }

    constructor()
    {
        if(Game.instance)
            return Game.instance

        Game.instance = this

        this.seed = 'p'
        this.debug = new Debug()
        this.state = new State()
        this.view = new View()
        this.settings = new Settings(this)
        
        window.addEventListener('resize', () =>
        {
            this.resize()
        })

        this.update()
    }

    update()
    {
        this.state.update()
        this.view.update()

        window.requestAnimationFrame(() =>
        {
            this.update()
        })
    }

    resize()
    {
        this.state.resize()
        this.view.resize()
    }

    destroy()
    {
        
    }
}
