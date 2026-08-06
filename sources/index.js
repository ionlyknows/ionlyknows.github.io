import Game from '@/Game.js'
import UIBridge from './UI/UIBridge.js'
import { createUIApp } from './UI/main.js'
import projects from './UI/data/projects.js'

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

    let projectIndex = 0
    let workOpen = false

    const showProject = () =>
    {
        const project = projects[projectIndex] || projects[0]
        game.view.billboard.setProject(project)
        bridge.emit('billboardProjectChanged', projectIndex)
    }

    bridge.on('openWorkBillboard', async () =>
    {
        if(workOpen || game.state.teleporter.isBusy())
            return

        workOpen = true
        game.state.controls.setInputEnabled(false)
        await game.state.teleporter.flyToWork()
        game.view.billboard.enterInteraction(projects[projectIndex] || projects[0])
        bridge.emit('billboardInteractionChanged', true)
        showProject()
    })

    bridge.on('billboardPrevious', () =>
    {
        if(!workOpen)
            return

        projectIndex = (projectIndex - 1 + projects.length) % projects.length
        showProject()
    })

    bridge.on('billboardNext', () =>
    {
        if(!workOpen)
            return

        projectIndex = (projectIndex + 1) % projects.length
        showProject()
    })

    const closeWorkBillboard = async () =>
    {
        if(!workOpen || game.state.teleporter.isBusy())
            return

        game.view.billboard.exitInteraction()
        bridge.emit('billboardInteractionChanged', false)
        await game.state.teleporter.flyBack()
        game.state.controls.setInputEnabled(true)
        workOpen = false
    }

    bridge.on('closeWorkBillboard', closeWorkBillboard)

    // Translate the one remaining raw key event the UI layer cares about.
    // Movement/physics keys are handled entirely inside State/Controls.js +
    // State/Player.js and never touch this file.
    game.state.controls.events.on('escapeDown', () =>
    {
        if(workOpen)
            closeWorkBillboard()
        else
            bridge.emit('escapePressed')
    })
}
catch(error)
{
    console.error('[UI] Failed to initialise the UI layer -- gameplay input remains enabled regardless:', error)
}
