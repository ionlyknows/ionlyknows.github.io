import gsap from 'gsap'

import Debug from '@/Debug/Debug.js'
import Readout from '@/Debug/Readout.js'
import State from '@/State/State.js'
import View from '@/View/View.js'
import Settings from '@/Settings.js'
import Audio from '@/Audio.js'
import { track, initAnalytics } from '@/Analytics.js'
import StateMachine from '@/StateMachine.js'
import UIBridge from '../UI/UIBridge.js'

export default class Game
{
    static instance

    static getInstance()
    {
        return Game.instance
    }

    constructor()
    {
        if(Game.instance)
            return Game.instance

        Game.instance = this

        this.seed = 'p'
        this.debug = new Debug()
        this.state = new State()
        this.stateMachine = new StateMachine()
        this.view = new View()
        this.audio = new Audio(this)
        this.settings = new Settings(this)
        this.bridge = UIBridge.getInstance()

        // Analytics (BR-10): launch + every location the visitor reaches
        initAnalytics()
        this.bridge.on('launch', () =>
        {
            track('launch')
            track('location_visit', { id: this.state.planets.current.id })
        })
        this.bridge.on('location:change', ({ id }) =>
        {
            if(!this.stateMachine.is(StateMachine.LOADING) && !this.stateMachine.is(StateMachine.READY))
                track('location_visit', { id })
        })
        this.loadProgress = 0
        this.readout = this.debug.active ? new Readout(this) : null

        // GSAP runs inside the game loop (not on its own requestAnimationFrame), so every
        // tween value is updated once per frame, before the player and camera read it
        gsap.ticker.remove(gsap.updateRoot)

        window.addEventListener('resize', () =>
        {
            this.resize()
        })

        this.update()
    }

    // Real loading steps (FR-01): only what the intro's first shots need (M6b realism pass: the rest loads
    // during the intro, View.loadDeferred). Textures download while the shaders compile in parallel
    // (KHR_parallel_shader_compile, nothing renders during LOADING so the main thread stays free);
    // then one warm-up frame behind the loading screen compiles the rest (shadows,
    // post-processing) so nothing stalls after Launch.
    async load()
    {
        let progress = 0.1
        const step = (amount) =>
        {
            progress = Math.min(1, progress + amount)
            this.loadProgress = progress
            this.bridge.emit('loading:progress', { value: progress })
        }
        step(0)

        // Compile for the target the scene really renders into: with post-processing that is
        // the composer's render target (no tone mapping, linear output), otherwise the screen.
        // Compiling for the screen made the first frame recompile every shader synchronously.
        const textures = this.view.load().then(() => step(0.45))

        // Environment map and scene shaders build in parallel (the scene compiles against a
        // same-shaped placeholder map). Compile for the target the scene really renders into:
        // with post-processing that is the composer's render target, otherwise the screen.
        const environment = this.view.createEnvironment().then(() => step(0.1))
        const renderer = this.view.renderer.instance
        const postProcessing = this.view.postProcessing
        // The ship GLB (~20 KB: it docks in the intro). The astronaut, the station interior and the
        // crew load after the loading screen (View.loadDeferred), so Launch is ready sooner
        const compiling = this.view.ship.load().then(() =>
        {
            renderer.setRenderTarget(postProcessing.quality === 'low' ? null : postProcessing.composer.renderTarget1)
            const compiled = renderer.compileAsync(this.view.scene, this.view.camera.instance)
            renderer.setRenderTarget(null)
            return compiled
        })
        const post = postProcessing.quality === 'low' ? Promise.resolve() : this.view.compilePostProcessing()

        await Promise.all([
            textures,
            environment,
            Promise.all([ compiling, post ])
                .catch((error) => console.warn('[Game] Shader warm-up failed', error))
                .then(() => step(0.2))
        ])

        this.warmUp = true
        await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)))
        this.warmUp = false
        // In the intro's first shot: linked and uploaded now (its night map is a shader uniform)
        await this.view.warm(this.view.earth.group)
        for(const texture of Object.values(this.view.earth.textures))
            await this.view.upload(texture)
        step(0.1)

        try { await document.fonts?.ready }
        catch {}
        step(1)

        const planet = this.state.planets.current
        this.bridge.emit('location:change', { id: planet.id, name: planet.name })
        this.stateMachine.ready()
        this.view.loadDeferred()
    }

    update()
    {
        // GSAP always runs (the UI uses it too). The 3D scene doesn't render while loading
        // (except the warm-up frame) and pauses during the quick-view.
        gsap.updateRoot(performance.now() / 1000)
        const idle = this.stateMachine.is(StateMachine.LOADING) || this.stateMachine.is(StateMachine.QUICK_VIEW)
        if(this.warmUp || !idle)
        {
            this.state.update()
            this.view.update()
            this.readout?.update()
            this.debug.stats?.update()
        }

        window.requestAnimationFrame(() =>
        {
            this.update()
        })
    }

    resize()
    {
        this.state.resize()
        this.view.resize()
    }

    destroy()
    {
        
    }
}
