import * as THREE from 'three'

import Camera from './Camera.js'
import Cinematics from './Cinematics.js'
import ControlHints, { WALK_HINTS, FLIGHT_HINTS } from './ControlHints.js'
import Ship from './Ship.js'
import Asteroids from './Asteroids.js'
import DriftingRocks from './DriftingRocks.js'
import Confetti from './Confetti.js'
import Workers from './Workers.js'
import Rover from './Rover.js'
import ScienceLab from './ScienceLab.js'
import Scientists from './Scientists.js'
import Game from '@/Game.js'
import StateMachine from '@/StateMachine.js'
import Earth from './Earth.js'
import Lights from './Lights.js'
import Planets from './Planet.js'
import PlayerModel from './PlayerModel.js'
import PostProcessing from './PostProcessing.js'
import Renderer from './Renderer.js'
import Space from './Space.js'
import Station from './Station.js'
import State from '@/State/State.js'
import { setSurfaceResolution, setTextureUploader } from './Materials/surface.js'

// Yield to the event loop (frames render in between). A MessageChannel task: chained timeouts are
// clamped to 4 ms each
const channel = new MessageChannel()
const waiting = []
channel.port1.onmessage = () => waiting.shift()?.()
const nextTask = () => new Promise((resolve) =>
{
    waiting.push(resolve)
    channel.port2.postMessage(0)
})

export default class View
{
    static instance

    static getInstance()
    {
        return View.instance
    }

    constructor()
    {
        if(View.instance)
            return View.instance

        View.instance = this

        this.scene = new THREE.Scene()
        this.scene.fog = new THREE.FogExp2('#010103', 0.002) // far planets feel deep

        // Floating origin: everything placed in layout space lives in `world`, which sits at
        // -origin so the current planet is always at (0, 0, 0). Earth never collides.
        const planets = State.getInstance().planets
        this.world = new THREE.Group()
        this.world.position.copy(planets.origin).negate()
        this.scene.add(this.world)
        planets.events.on('originShift', () =>
        {
            this.world.position.copy(planets.origin).negate()
            this.world.updateMatrixWorld(true)
        })

        this.camera = new Camera()
        this.renderer = new Renderer()
        this.space = new Space()
        this.environment = null // PMREM map, built during loading (createEnvironment)
        this.lights = new Lights()
        this.planets = new Planets()
        this.station = new Station() // Apeiron Station's exterior (M6b); also says if the camera is near / inside
        this.earth = new Earth()
        this.player = new PlayerModel()
        this.ship = new Ship()
        this.asteroids = new Asteroids()
        this.driftingRocks = new DriftingRocks()
        this.confetti = new Confetti()
        this.workers = new Workers()
        this.rover = new Rover() // M7 (after the planets: it uses their materials)
        this.lab = new ScienceLab()
        this.scientists = new Scientists()

        // Control hints: own scene, drawn after bloom
        const stateMachine = Game.getInstance().stateMachine
        const state = State.getInstance()
        this.overlay = new THREE.Scene()
        this.hints = new ControlHints({
            scene: this.overlay,
            hints: WALK_HINTS,
            isActive: () => stateMachine.is(StateMachine.ON_FOOT),
            isUsed: () => state.player.isMoving
        })
        this.flightHints = new ControlHints({
            scene: this.overlay,
            hints: FLIGHT_HINTS,
            height: 3.4,
            side: 3.8, // clear of the wings
            autoShow: true,
            isActive: () => (stateMachine.is(StateMachine.TAKEOFF) || stateMachine.is(StateMachine.FLYING)) && !state.flight.route?.autopilot,
            isUsed: () => state.flight.body?.steering
        })
        this.cinematics = new Cinematics()
        this.postProcessing = new PostProcessing()
        setTextureUploader((texture) => this.upload(texture)) // surface sets upload before they are used
    }

    // Before Launch: only what the intro's first shots need (Earth's maps; the ship GLB, Game.load)
    load()
    {
        return this.earth.ready
    }

    // After the loading screen (READY and the intro): the astronaut GLB, the station's surface sets,
    // then the station interior and its crew (clones of the astronaut). Resolves (either way) once the
    // station is ready to show: the intro waits for it before it shows the hangar (View/Cinematics.js).
    loadDeferred()
    {
        if(!this.deferred)
        {
            this.deferred = Promise.all([ this.warm(this.station.group), this.loadAstronaut(), setSurfaceResolution('1k', [ 'metal', 'regolith' ]) ])
                .then(() => this.loadInterior())
                .catch((error) => console.warn('[View] Deferred loading failed', error))
            // Then, in the background: whatever was hidden or off screen at the warm-up frame
            this.deferred.then(() => this.warm(this.scene, { all: true })).catch((error) => console.warn('[View] Warm-up failed', error))
        }
        return this.deferred
    }

    // The astronaut GLB: hidden until warm() has made it ready to draw
    async loadAstronaut()
    {
        await this.player.load()
        const character = this.player.character
        if(!character)
            return
        character.visible = false
        await this.warm(character)
        character.visible = true
    }

    // Make `object` ready to draw before it is first drawn (M6b realism pass: things that load during
    // the intro): compile its programs (and its skinned shadow casters' depth program) while it is
    // visible only for the compile call, then finish every program's first use (the driver's link) and
    // upload every texture, one step per task, so no frame compiles or uploads anything
    // all: also what is hidden right now (made visible only for the compile call)
    async warm(object, { all = false } = {})
    {
        const renderer = this.renderer.instance
        const standIns = new THREE.Group()
        const depth = new THREE.MeshDepthMaterial({ side: THREE.BackSide }) // three's shadow map: plain depth, side flipped
        object.traverse((child) =>
        {
            if(child.isSkinnedMesh && child.castShadow && !standIns.children.length)
            {
                const standIn = new THREE.SkinnedMesh(child.geometry, depth)
                standIn.bind(child.skeleton, child.bindMatrix)
                standIn.frustumCulled = false
                standIns.add(standIn)
            }
        })
        const hidden = []
        if(all)
            object.traverse((child) => { if(!child.visible) { hidden.push(child); child.visible = true } })
        const visible = object.visible
        object.visible = true
        this.scene.add(standIns)
        renderer.setRenderTarget(this.postProcessing.quality === 'low' ? null : this.postProcessing.composer.renderTarget1)
        const compiled = Promise.all([ renderer.compileAsync(object, this.camera.instance, this.scene), renderer.compileAsync(standIns, this.camera.instance, this.scene) ])
        renderer.setRenderTarget(null)
        this.scene.remove(standIns)
        object.visible = visible
        for(const child of hidden)
            child.visible = false
        try { await compiled }
        catch(error) { console.warn('[View] Shader warm-up failed', error) }

        const materials = new Set()
        const textures = new Set()
        object.traverse((child) =>
        {
            for(const material of child.material ? [].concat(child.material) : [])
            {
                materials.add(material)
                for(const value of [ ...Object.values(material), ...Object.values(material.uniforms || {}).map((uniform) => uniform?.value) ])
                    if(value?.isTexture)
                        textures.add(value)
            }
        })
        materials.add(depth)
        for(const material of materials)
        {
            const program = renderer.properties.get(material).currentProgram
            if(!program)
                continue
            await nextTask()
            program.getUniforms()
        }
        for(const texture of textures)
            await this.upload(texture)
        depth.dispose()
    }

    // Upload one texture in its own task (not in a frame)
    upload(texture)
    {
        return nextTask().then(() => this.renderer.instance.initTexture(texture))
    }

    // The station interior (its own chunk): built, its textures uploaded and its shaders compiled
    // asynchronously (the intro keeps running)
    loadInterior()
    {
        if(!this.interiorLoading)
        {
            this.interiorLoading = import('./StationInterior.js').then(async ({ default: StationInterior }) =>
            {
                const interior = new StationInterior(this, State.getInstance())
                await interior.load()
                this.stationInterior = interior
            })
        }
        return this.interiorLoading
    }

    // PMREM environment: built while the textures download, then given to every material that
    // asked for it (before the scene's shaders compile, so they include it)
    // Returns a promise for the real map; materials get a same-shaped placeholder right away
    createEnvironment()
    {
        const { placeholder, ready } = this.space.createEnvironment(this.renderer.instance)
        this.environmentPlaceholder = placeholder
        const assign = (texture) => this.scene.traverse((object) =>
        {
            const materials = Array.isArray(object.material) ? object.material : [ object.material ]
            for(const material of materials)
                if(material?.userData.useEnvironment)
                    material.envMap = texture
        })

        assign(placeholder)
        return ready.then((texture) =>
        {
            this.environment = texture
            assign(texture)
        })
    }

    // Post-processing shaders (not in the scene): compiled in parallel during loading
    compilePostProcessing()
    {
        const renderer = this.renderer.instance
        const composer = this.postProcessing.composer
        const materials = []
        for(const pass of composer.passes)
            for(const value of Object.values(pass))
                for(const item of Array.isArray(value) ? value : [ value ])
                    if(item?.isMaterial && !materials.includes(item))
                        materials.push(item)

        const quad = new THREE.PlaneGeometry(2, 2)
        const scene = new THREE.Scene()
        const output = new THREE.Scene()
        for(const material of materials)
            (material.type === 'OutputShader' || material.name === 'OutputShader' ? output : scene).add(new THREE.Mesh(quad, material))

        const camera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0, 1)
        renderer.setRenderTarget(composer.renderTarget1)
        const passes = renderer.compileAsync(scene, camera)
        renderer.setRenderTarget(null)
        return Promise.all([ passes, renderer.compileAsync(output, camera) ]).finally(() => quad.dispose())
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
        this.postProcessing.resize()
        this.space.resize()
    }

    update()
    {
        this.cinematics.update()
        this.camera.update()
        this.station.update() // first: near / inside from this frame's camera
        this.space.update()
        this.planets.update()
        this.stationInterior?.update(Game.getInstance().stateMachine)
        this.workers.update()
        this.scientists.update()
        this.earth.update()
        this.player.update()
        this.rover.update()
        this.lab.update()
        this.ship.update()
        this.asteroids.update()
        this.driftingRocks.update()
        this.confetti.update()
        this.hints.update()
        this.flightHints.update()
        this.lights.update()
        this.renderer.update()
    }
}
