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
    game.view.certificateBillboards.onProximityChange = (nearby) => bridge.emit('certificateProximityChanged', nearby)

    let projectIndex = 0
    let workOpen = false
    let certificateOpen = false
    let closeRequested = false
    let flyToWorkInProgress = false
    let flyToCertificateInProgress = false
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

        game.view.billboard.enterInteraction()
        bridge.emit('billboardInteractionChanged', true)
        // Render the project once. Calling setProject in enterInteraction and
        // again here replayed the screen fade and made the billboard pop.
        showProject()
    }

    bridge.on('openWorkBillboard', openWorkBillboard)

    const openCertificateBillboard = async (board) =>
    {
        if(workOpen || certificateOpen || flyToCertificateInProgress || game.state.teleporter.isBusy())
            return

        certificateOpen = true
        flyToCertificateInProgress = true
        game.state.controls.setInputEnabled(false)

        try
        {
            await game.state.teleporter.flyToCertificate(board)
        }
        catch(error)
        {
            console.error('[Certificates] Failed to frame certificate:', error)
            certificateOpen = false
            game.state.controls.setInputEnabled(true)
        }
        finally
        {
            flyToCertificateInProgress = false
        }
    }

    game.view.certificateBillboards.onSelect = openCertificateBillboard

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

    const closeCertificateBillboard = async () =>
    {
        if(!certificateOpen || game.state.teleporter.isBusy())
            return

        await game.state.teleporter.flyBack()
        game.state.controls.setInputEnabled(true)
        certificateOpen = false
    }

    bridge.on('closeBillboardInfo', () =>
    {
        game.view.billboard.closeInfo()
    })

    showProject()
    // The first project begins loading above. Defer the remaining image
    // decodes until the browser has idle time so terrain/world startup wins
    // the first few frames after deployment.
    const preloadProjectMedia = () => game.view.billboard.preloadMedia(projects)
    if('requestIdleCallback' in window)
        window.requestIdleCallback(preloadProjectMedia, { timeout: 3000 })
    else
        window.setTimeout(preloadProjectMedia, 1500)

    game.state.controls.events.on('escapeDown', () =>
    {
        if(workOpen)
            closeWorkBillboard()
        else if(certificateOpen)
            closeCertificateBillboard()
        else
            bridge.emit('escapePressed')
    })
}
catch(error)
{
    console.error('[UI] Failed to initialise the UI layer -- gameplay input remains enabled regardless:', error)
}
