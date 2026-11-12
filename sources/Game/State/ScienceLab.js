import Game from '@/Game.js'
import State from '@/State/State.js'
import StateMachine from '@/StateMachine.js'
import UIBridge from '../../UI/UIBridge.js'
import facts from '../../content/facts.js'
import { has } from '../../UI/visibleContent.js'
import { track } from '../Analytics.js'

export const SCAN_TIME = 1.3 // s: the light sweep (View/ScienceLab.js), then the fact card

const shown = facts.filter((fact) => has(fact.title) && has(fact.text))

// M7 science lab (The Observatory): E at a sample stand → a short scan (light sweep + sound) → the
// fact card (`panel:open` type 'fact'). Facts cycle, so every one is seen. Nothing blocks the
// visitor during the scan; the card opens only if they are still on foot.
export default class ScienceLab
{
    constructor()
    {
        this.game = Game.getInstance()
        this.state = State.getInstance()
        this.bridge = UIBridge.getInstance()
        this.scan = null // { sample, time }
        this.next = 0
    }

    start(sample)
    {
        if(!sample || this.scan || !shown.length)
            return
        this.scan = { sample, time: 0 }
        this.bridge.emit('scan:start', { id: sample.id })
        this.bridge.emit('prompt:hide')
        track('explore_use', { id: 'lab' })
    }

    update()
    {
        const scan = this.scan
        if(!scan)
            return
        scan.time += this.state.time.delta
        if(scan.time < SCAN_TIME)
            return
        this.scan = null
        if(!this.game.stateMachine.is(StateMachine.ON_FOOT) || !this.state.planets.current.stations?.lab?.samples.includes(scan.sample))
            return
        const fact = shown[this.next % shown.length]
        this.next++
        this.bridge.emit('panel:open', { type: 'fact', id: fact.id })
    }
}
