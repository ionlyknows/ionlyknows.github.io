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
    let flyToWorkInProgress = false
    let autoplayTimer = null

    const clearAutoplay = () =>
    {
        if(autoplayTimer)
        {
            clearTimeout(autoplayTimer)
            autoplayTimer = null
        }
    }

    const resetAutoplay = () =>
    {
        clearAutoplay()

        if(projects.length <= 1)
            return

        autoplayTimer = window.setTimeout(() =>
        {
            projectIndex = (projectIndex + 1) % projects.length
            showProject()
        }, 20000)
    }

    const showProject = () =>
    {
        const project = projects[projectIndex] || projects[0]
        game.view.billboard.setProject(project)
        bridge.emit('billboardProjectChanged', projectIndex)
        resetAutoplay()
    }

    const openWorkBillboard = async () =>
    {
        if(workOpen || flyToWorkInProgress || game.state.teleporter.isBusy())
            return

        workOpen = true
        flyToWorkInProgress = true
        closeRequested = false
        game.state.controls.setInputEnabled(false)
        bridge.emit('billboardTransitionChanged', true)

        try
        {
            await game.state.teleporter.flyToWork()
        }
        catch(error)
        {
            console.error('[UI] Failed to fly to work billboard:', error)
            workOpen = false
            bridge.emit('billboardTransitionChanged', false)
            game.state.controls.setInputEnabled(true)
            return
        }
        finally
        {
            flyToWorkInProgress = false
        }

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

    // Player controls are disabled while the billboard is open, so project
    // navigation is handled here instead of through the gameplay controls.
    // This keeps A/D and the left/right arrows scoped to the billboard view.
    window.addEventListener('keydown', (event) =>
    {
        if(!workOpen || event.repeat)
            return

        if(event.code === 'KeyA' || event.code === 'ArrowLeft')
        {
            event.preventDefault()
            projectIndex = (projectIndex - 1 + projects.length) % projects.length
            showProject()
        }
        else if(event.code === 'KeyD' || event.code === 'ArrowRight')
        {
            event.preventDefault()
            projectIndex = (projectIndex + 1) % projects.length
            showProject()
        }
    })

    const closeWorkBillboard = async () =>
    {
        if(!workOpen && !flyToWorkInProgress)
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
        flyToWorkInProgress = false
        closeRequested = false
    }

    bridge.on('closeWorkBillboard', closeWorkBillboard)

    bridge.on('closeBillboardInfo', () =>
    {
        game.view.billboard.closeInfo()
    })

    showProject()

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
