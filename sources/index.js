import Game from '@/Game.js'
import UIBridge from './UI/UIBridge.js'
import { createUIApp } from './UI/main.js'
import projects from './UI/data/projects.js'

const game = new Game()

if(game.view)
    document.querySelector('.game').append(game.view.renderer.instance.domElement)

try
{
    const bridge = UIBridge.getInstance()
    createUIApp(bridge, game)

    game.view.billboard.onInfoChange = (open) => bridge.emit('billboardInfoChanged', open)

    let projectIndex = 0
    let workOpen = false
    let closeRequested = false

    const showProject = () =>
    {
        const project = projects[projectIndex] || projects[0]
        game.view.billboard.setProject(project)
        bridge.emit('billboardProjectChanged', projectIndex)
    }

    const openWorkBillboard = async () =>
    {
        if(workOpen || game.state.teleporter.isBusy())
            return

        workOpen = true
        closeRequested = false
        game.state.controls.setInputEnabled(false)
        bridge.emit('billboardTransitionChanged', true)

        await game.state.teleporter.flyToWork()

        if(closeRequested)
        {
            await closeWorkBillboard()
            return
        }

        game.view.billboard.enterInteraction(projects[projectIndex] || projects[0])
        bridge.emit('billboardInteractionChanged', true)
        showProject()
    }

    bridge.on('openWorkBillboard', openWorkBillboard)

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
        if(!workOpen)
            return

        if(game.state.teleporter.isBusy())
        {
            closeRequested = true
            return
        }

        game.view.billboard.exitInteraction()
        bridge.emit('billboardInteractionChanged', false)
        bridge.emit('billboardTransitionChanged', false)
        await game.state.teleporter.flyBack()
        game.state.controls.setInputEnabled(true)
        workOpen = false
        closeRequested = false
    }

    bridge.on('closeWorkBillboard', closeWorkBillboard)

    bridge.on('closeBillboardInfo', () =>
    {
        game.view.billboard.closeInfo()
    })

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