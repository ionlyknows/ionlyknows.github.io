import * as THREE from 'three'

import Camera from './Camera.js'
import Cinematics from './Cinematics.js'
import ControlHints, { WALK_HINTS, FLIGHT_HINTS } from './ControlHints.js'
import Ship from './Ship.js'
import Asteroids from './Asteroids.js'
import Confetti from './Confetti.js'
import Game from '@/Game.js'
import StateMachine from '@/StateMachine.js'
import Earth from './Earth.js'
import Lights from './Lights.js'
import Planets from './Planet.js'
import PlayerModel from './PlayerModel.js'
import PostProcessing from './PostProcessing.js'
import Renderer from './Renderer.js'
import Space from './Space.js'
import State from '@/State/State.js'
import { setSurfaceResolution } from './Materials/surface.js'

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
        this.earth = new Earth()
        this.player = new PlayerModel()
        this.ship = new Ship()
        this.asteroids = new Asteroids()
        this.confetti = new Confetti()

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
            isActive: () => stateMachine.is(StateMachine.TAKEOFF) || stateMachine.is(StateMachine.FLYING),
            isUsed: () => state.flight.body?.steering
        })
        this.cinematics = new Cinematics()
        this.postProcessing = new PostProcessing()
    }

    // Textures needed before Launch: the spawn planet's 1K sets + Earth (the rest after Launch)
    load()
    {
        return Promise.all([ setSurfaceResolution('1k', [ 'regolith', 'metal' ]), this.earth.ready ])
    }

    // The astronaut GLB (resolves even if it fails: the placeholder stays)
    loadCharacter()
    {
        return this.player.load()
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
        this.space.update()
        this.planets.update()
        this.earth.update()
        this.player.update()
        this.ship.update()
        this.asteroids.update()
        this.confetti.update()
        this.hints.update()
        this.flightHints.update()
        this.lights.update()
        this.renderer.update()
    }
}
