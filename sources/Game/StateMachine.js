import EventsEmitter from 'events'

import State from '@/State/State.js'
import UIBridge from '../UI/UIBridge.js'

// Spec §5. Walking input only in ON_FOOT (BR-04); steering only in FLYING. QUICK_VIEW pauses
// the scene and remembers where to return ("Back to the adventure").
// Flight (M3): ON_FOOT → BOARDING → TAKEOFF → FLYING → LANDING → ON_FOOT.
export default class StateMachine
{
    static LOADING = 'LOADING'
    static READY = 'READY'
    static INTRO = 'INTRO'
    static ON_FOOT = 'ON_FOOT'
    static PANEL_OPEN = 'PANEL_OPEN'
    static QUICK_VIEW = 'QUICK_VIEW'
    static BOARDING = 'BOARDING'
    static TAKEOFF = 'TAKEOFF'
    static FLYING = 'FLYING'
    static LANDING = 'LANDING'
    static FLIGHT_STATES = [ 'BOARDING', 'TAKEOFF', 'FLYING', 'LANDING' ]

    constructor()
    {
        this.bridge = UIBridge.getInstance()
        this.events = new EventsEmitter()
        this.state = StateMachine.LOADING
        this.resumeState = null // where QUICK_VIEW returns to
        State.getInstance().controls.setInputEnabled(false)

        this.bridge.on('panel:open', () =>
        {
            if(this.is(StateMachine.ON_FOOT))
                this.set(StateMachine.PANEL_OPEN)
        })
        this.bridge.on('panel:close', () =>
        {
            if(this.is(StateMachine.PANEL_OPEN))
                this.set(StateMachine.ON_FOOT)
        })
        this.bridge.on('launch', () =>
        {
            if(this.is(StateMachine.READY))
                this.set(StateMachine.INTRO)
        })

        // Quick-view opens from the loading screen or the world (FR-08)
        this.bridge.on('quickview:open', () =>
        {
            if(!this.is(StateMachine.LOADING) && !this.is(StateMachine.READY) && !this.is(StateMachine.ON_FOOT) && !this.inFlight())
                return
            this.resumeState = this.state
            this.set(StateMachine.QUICK_VIEW)
        })
        this.bridge.on('quickview:close', () =>
        {
            if(!this.is(StateMachine.QUICK_VIEW))
                return
            const state = this.resumeState
            this.resumeState = null
            this.set(state)
        })
    }

    // Loading finished: READY, or (while the quick-view is open) READY once it closes
    ready()
    {
        if(this.is(StateMachine.QUICK_VIEW))
            this.resumeState = StateMachine.READY
        else
            this.set(StateMachine.READY)
    }

    is(state)
    {
        return this.state === state
    }

    inFlight()
    {
        return StateMachine.FLIGHT_STATES.includes(this.state)
    }

    set(state)
    {
        if(state === this.state)
            return

        const previous = this.state
        this.state = state

        const { controls, viewport } = State.getInstance()
        controls.setInputEnabled(state === StateMachine.ON_FOOT || state === StateMachine.FLYING)
        if(state !== StateMachine.ON_FOOT)
            viewport.pointerLock.deactivate()

        this.events.emit('change', state, previous)
        this.bridge.emit('state:change', { state, previous })
    }
}
