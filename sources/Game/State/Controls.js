import EventsEmitter from 'events'

import Game from '@/Game.js'
import State from '@/State/State.js'

export default class Controls
{
    constructor()
    {
        this.game = Game.getInstance()
        this.state = State.getInstance()

        this.events = new EventsEmitter()

        // Gameplay input gate. The UI layer (App.vue) flips this off while a
        // panel (Work/About/Resume) is open and back on when it closes -- see
        // setInputEnabled() below. Defaults to enabled so the world is always
        // playable even if the UI layer fails to initialise.
        this.inputEnabled = true

        this.setKeys()
        this.setPointer()

        this.events.on('debugDown', () =>
        {
            if(location.hash === '#debug')
                location.hash = ''
            else
                location.hash = 'debug'

            location.reload()
        })
    }

    setKeys()
    {
        this.keys = {}
        
        // Map
        this.keys.map = [
            {
                codes: [ 'ArrowUp', 'KeyW' ],
                name: 'forward'
            },
            {
                codes: [ 'ArrowRight', 'KeyD' ],
                name: 'strafeRight'
            },
            {
                codes: [ 'ArrowDown', 'KeyS' ],
                name: 'backward'
            },
            {
                codes: [ 'ArrowLeft', 'KeyA' ],
                name: 'strafeLeft'
            },
            {
                codes: [ 'ShiftLeft', 'ShiftRight' ],
                name: 'boost'
            },
            {
                codes: [ 'KeyP' ],
                name: 'pointerLock'
            },
            {
                codes: [ 'KeyV' ],
                name: 'cameraMode'
            },
            {
                codes: [ 'KeyB' ],
                name: 'debug'
            },
            {
                codes: [ 'KeyF' ],
                name: 'fullscreen'
            },
            {
                codes: [ 'Space' ],
                name: 'jump'
            },
            {
                codes: [ 'ControlLeft', 'KeyC' ],
                name: 'crouch'
            },
            {
                codes: [ 'Escape' ],
                name: 'escape'
            },
        ]

        // Down keys
        this.keys.down = {}

        for(const mapItem of this.keys.map)
        {
            this.keys.down[mapItem.name] = false
        }

        // Find in map per code
        this.keys.findPerCode = (key) =>
        {
            return this.keys.map.find((mapItem) => mapItem.codes.includes(key))
        }

        // Event
        window.addEventListener('keydown', (event) =>
        {
            const mapItem = this.keys.findPerCode(event.code)

            if(!mapItem)
                return

            // Everything except Escape respects the input gate -- Escape
            // must always be able to reach the UI so an open panel can be
            // closed even while gameplay input is disabled.
            if(!this.inputEnabled && mapItem.name !== 'escape')
                return

            this.events.emit('keyDown', mapItem.name)
            this.events.emit(`${mapItem.name}Down`)
            this.keys.down[mapItem.name] = true
        })

        window.addEventListener('keyup', (event) =>
        {
            const mapItem = this.keys.findPerCode(event.code)

            if(!mapItem)
                return

            if(!this.inputEnabled && mapItem.name !== 'escape')
                return

            this.events.emit('keyUp', mapItem.name)
            this.events.emit(`${mapItem.name}Up`)
            this.keys.down[mapItem.name] = false
        })
    }

    /**
     * Enables or disables gameplay input as a single switch. Called by the
     * Vue UI layer (App.vue) whenever a panel opens/closes: movement,
     * jump, crouch, boost, camera-mode, pointer-lock, fullscreen and debug
     * keys are all suspended while a panel has focus, so e.g. pressing "P"
     * to read about a project can't silently pointer-lock the page behind
     * it. Escape is exempt (see the listeners above) so panels always stay
     * closable.
     *
     * When disabling, any keys currently held down are force-released so
     * Player/CameraFly (which poll `keys.down` every frame) can't end up
     * stuck mid-movement once input is re-enabled.
     */
    setInputEnabled(value)
    {
        this.inputEnabled = value

        if(!this.inputEnabled)
        {
            for(const name in this.keys.down)
            {
                this.keys.down[name] = false
            }
        }
    }

    setPointer()
    {
        this.pointer = {}
        this.pointer.down = false
        this.pointer.deltaTemp = { x: 0, y: 0 }
        this.pointer.delta = { x: 0, y: 0 }

        window.addEventListener('pointerdown', (event) =>
        {
            this.pointer.down = true
        })

        window.addEventListener('pointermove', (event) =>
        {
            this.pointer.deltaTemp.x += event.movementX
            this.pointer.deltaTemp.y += event.movementY
        })

        window.addEventListener('pointerup', () =>
        {
            this.pointer.down = false
        })
    }

    update()
    {
        this.pointer.delta.x = this.pointer.deltaTemp.x
        this.pointer.delta.y = this.pointer.deltaTemp.y

        this.pointer.deltaTemp.x = 0
        this.pointer.deltaTemp.y = 0
    }
}
