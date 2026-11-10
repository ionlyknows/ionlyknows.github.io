// Desktop with WebGL 2: the full 3D adventure. Loaded only through dynamic import()
// from index.js, so phones and no-WebGL browsers never download Three.js (BR-01).
import Game from '@/Game.js'
import StateMachine from '@/StateMachine.js'
import UIBridge from './UI/UIBridge.js'
import { createUIApp } from './UI/main.js'

const game = new Game()

document.querySelector('.game').append(game.view.renderer.instance.domElement)

let uiReady = false

try
{
    const bridge = UIBridge.getInstance()
    createUIApp(bridge, game)

    game.state.controls.events.on('escapeDown', () =>
    {
        bridge.emit('escapePressed')
    })

    uiReady = true
}
catch(error)
{
    console.error('[UI] Failed to initialise the UI layer -- starting on foot without the intro:', error)
}

game.load().then(() =>
{
    // Without a UI there is no Launch button: go straight to the world
    if(!uiReady)
        game.stateMachine.set(StateMachine.ON_FOOT)
})
