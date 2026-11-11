import Game from '@/Game.js'
import StateMachine from '@/StateMachine.js'
import UIBridge from '../../UI/UIBridge.js'
import { track } from '@/Analytics.js'

// BR-11 / FR-19: three easter eggs. Found ones are saved per browser in `apeiron.eggs`.
// duck + signal: press E at the hidden prop (Player.interact → 'egg:interact');
// dance: type the Konami code on foot.
export const EGG_IDS = [ 'duck', 'signal', 'dance' ]
const STORAGE_KEY = 'apeiron.eggs'
const KONAMI = [ 'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA' ]

export default class Eggs
{
    constructor()
    {
        this.game = Game.getInstance()
        this.bridge = UIBridge.getInstance()
        this.found = this.read()
        this.konami = 0

        this.bridge.on('egg:interact', ({ id }) => this.find(id))

        // Capture phase, registered before the UI: when B completes the 9th step of the code,
        // it must not also open Settings
        window.addEventListener('keydown', (event) =>
        {
            if(event.repeat || !this.game.stateMachine.is(StateMachine.ON_FOOT))
            {
                this.konami = 0
                return
            }
            if(event.code === KONAMI[this.konami])
            {
                if(event.code === 'KeyB')
                    event.stopImmediatePropagation()
                this.konami++
                if(this.konami === KONAMI.length)
                {
                    this.konami = 0
                    this.find('dance')
                }
            }
            else
                this.konami = event.code === KONAMI[0] ? 1 : 0
        }, { capture: true })
    }

    read()
    {
        try
        {
            const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
            return Array.isArray(saved) ? saved.filter((id) => EGG_IDS.includes(id)) : []
        }
        catch { return [] }
    }

    get count()
    {
        return this.found.length
    }

    // Every find replays the reward; only the first one counts, saves and is tracked
    find(id)
    {
        if(!EGG_IDS.includes(id))
            return

        const isNew = !this.found.includes(id)
        if(isNew)
        {
            this.found.push(id)
            try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.found)) }
            catch {}
            track('easter_egg_found', { id })
        }
        this.bridge.emit('egg:found', { id, isNew, count: this.count, total: EGG_IDS.length })
    }
}
