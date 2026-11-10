import State from '@/State/State.js'
import UIBridge from '../UI/UIBridge.js'

// M1: only ON_FOOT and PANEL_OPEN. Input is ignored while PANEL_OPEN (BR-04).
export default class StateMachine
{
    static ON_FOOT = 'ON_FOOT'
    static PANEL_OPEN = 'PANEL_OPEN'

    constructor()
    {
        this.bridge = UIBridge.getInstance()
        this.state = StateMachine.ON_FOOT

        this.bridge.on('panel:open', () => this.set(StateMachine.PANEL_OPEN))
        this.bridge.on('panel:close', () => this.set(StateMachine.ON_FOOT))
    }

    is(state)
    {
        return this.state === state
    }

    set(state)
    {
        if(state === this.state)
            return

        this.state = state

        const { controls, viewport } = State.getInstance()
        controls.setInputEnabled(state === StateMachine.ON_FOOT)
        if(state === StateMachine.PANEL_OPEN)
            viewport.pointerLock.deactivate()

        this.bridge.emit('state:change', { state })
    }
}
