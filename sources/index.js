import Game from '@/Game.js'
import UIBridge from './UI/UIBridge.js'
import { createUIApp } from './UI/main.js'

const game = new Game()

if(game.view)
    document.querySelector('.game').append(game.view.renderer.instance.domElement)

// UI layer: framework-agnostic bridge, then the Vue app that consumes it.
// None of this touches the engine's own update loop -- Game.update() above
// is untouched and keeps driving state/view. Wrapped defensively: if
// anything here throws, the engine keeps running and Controls.inputEnabled
// stays at its safe default (enabled) rather than movement silently locking
// up with no explanation.
try
{
    const bridge = UIBridge.getInstance()
    createUIApp(bridge, game)

    // Translate the one remaining raw key event the UI layer cares about.
    // Movement/physics keys are handled entirely inside State/Controls.js +
    // State/Player.js and never touch this file.
    game.state.controls.events.on('escapeDown', () => bridge.emit('escapePressed'))
}
catch(error)
{
    console.error('[UI] Failed to initialise the UI layer -- gameplay input remains enabled regardless:', error)
}
