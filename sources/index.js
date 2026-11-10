import Game from '@/Game.js'
import UIBridge from './UI/UIBridge.js'
import { createUIApp } from './UI/main.js'

const game = new Game()

document.querySelector('.game').append(game.view.renderer.instance.domElement)

try
{
    const bridge = UIBridge.getInstance()
    createUIApp(bridge, game)

    game.state.controls.events.on('escapeDown', () =>
    {
        bridge.emit('escapePressed')
    })
}
catch(error)
{
    console.error('[UI] Failed to initialise the UI layer -- gameplay input remains enabled regardless:', error)
}
