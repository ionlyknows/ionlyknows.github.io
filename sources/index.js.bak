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
    // Set when ESC/close arrives while the fly-IN tween is still running --
    // isBusy() blocks closeWorkBillboard() from acting immediately (it can't
    // safely fly back while another tween owns the camera), but the request
    // itself must not be dropped, or the camera reaches the billboard shot
    // with no memory that the player already asked to leave (the "stuck in
    // billboard view" symptom). openWorkBillboard checks this flag the
    // instant its own fly-in resolves and, if set, closes immediately
    // instead of ever presenting the interface.
    let closeRequested = false

    const showProject = () =>
    {
        const project = projects[projectIndex] || projects[0]
        game.view.billboard.setProject(project)
        bridge.emit('billboardProjectChanged', projectIndex)
    }

    const openWorkBillboard = async () =>
    {
        // Blocks duplicate/overlapping triggers: a second "Work" click (or
        // Enter-key repeat) while workOpen is already true, or while the
        // teleporter is mid-tween for any reason, is a no-op.
        if(workOpen || game.state.teleporter.isBusy())
            return

        workOpen = true
        closeRequested = false
        game.state.controls.setInputEnabled(false)
        bridge.emit('billboardTransitionChanged', true)

        await game.state.teleporter.flyToWork()

        if(closeRequested)
        {
            // ESC arrived while we were still flying in -- go straight back
            // out instead of presenting the interface at all.
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
            // Already mid-tween (still flying in, or already flying back
            // from a previous close request) -- flag it so the in-flight
            // promise finishes the close itself once it resolves, rather
            // than silently dropping this ESC press.
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
