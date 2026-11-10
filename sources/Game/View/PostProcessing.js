import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

import Game from '@/Game.js'
import View from '@/View/View.js'
import State from '@/State/State.js'
import Debug from '@/Debug/Debug.js'
import StateMachine from '@/StateMachine.js'
import UIBridge from '../../UI/UIBridge.js'
import { setSurfaceResolution } from './Materials/surface.js'
import gradeVertexShader from './Materials/shaders/grade/vertex.glsl'
import gradeFragmentShader from './Materials/shaders/grade/fragment.glsl'

export const QUALITIES = [ 'low', 'medium', 'high' ]
const MAX_PIXEL_RATIO = { low: 1, medium: 1.5, high: 2 }
// Low keeps 64 near: a 32-segment sphere sags up to 10 cm below the walking radius
const PLANET_SEGMENTS = { low: 64, medium: 64, high: 128 }
const MIN_FPS = 45
const LOW_FPS_SECONDS = 3

// Quality levels (docs/milestones/M2a-revision.md §5):
// Low = no post-processing (renderer MSAA), no shadows, no nebula/clouds.
// Medium = bloom (half res) + tone mapping, 1024 shadows, 64 segments, 1K textures.
// High = bloom + vignette/grain/grading, soft 2048 shadows, 128 segments, 2K textures (lazy, after Launch).
// The composer renders into a 4× MSAA target, so Medium/High keep anti-aliasing.
export default class PostProcessing
{
    constructor()
    {
        this.game = Game.getInstance()
        this.view = View.getInstance()
        this.state = State.getInstance()
        this.debug = Debug.getInstance()
        this.bridge = UIBridge.getInstance()

        this.renderer = this.view.renderer.instance
        this.scene = this.view.scene
        this.camera = this.view.camera.instance
        this.viewport = this.state.viewport

        this.quality = 'high'

        const target = new THREE.WebGLRenderTarget(this.viewport.width, this.viewport.height, { type: THREE.HalfFloatType, samples: 4 })
        this.composer = new EffectComposer(this.renderer, target)
        this.composer.addPass(new RenderPass(this.scene, this.camera))

        // Only beacons, the sun and emissive details glow
        this.bloom = new UnrealBloomPass(new THREE.Vector2(this.viewport.width, this.viewport.height), 0.5, 0.4, 0.85)
        const setBloomSize = this.bloom.setSize.bind(this.bloom)
        this.bloom.setSize = (width, height) => setBloomSize(Math.round(width / 2), Math.round(height / 2))
        this.composer.addPass(this.bloom)

        this.composer.addPass(new OutputPass())

        this.grade = new ShaderPass({
            uniforms: {
                tDiffuse: { value: null },
                uTime: { value: 0 },
                uVignette: { value: 0.4 },
                uGrain: { value: 0.02 },
                uGrade: { value: 1 }
            },
            vertexShader: gradeVertexShader,
            fragmentShader: gradeFragmentShader
        })
        this.composer.addPass(this.grade)

        this.fps = { frames: 0, start: performance.now(), lowSeconds: 0 }

        // 2K textures load only after Launch (initial download stays small)
        this.game.stateMachine.events.on('change', () => this.updateTextures())

        this.resize()
        this.setDebug()
    }

    setQuality(quality)
    {
        if(!QUALITIES.includes(quality))
            return

        this.quality = quality
        this.bloom.enabled = quality !== 'low'
        this.grade.enabled = quality === 'high'
        this.view.renderer.setPixelRatio(MAX_PIXEL_RATIO[quality])
        this.view.planets.setDetail(PLANET_SEGMENTS[quality])
        this.view.lights.setShadowQuality(quality)
        this.view.space.nebula.visible = quality !== 'low'
        this.view.earth.clouds.visible = quality !== 'low'
        this.updateTextures()
        this.fps.lowSeconds = 0
    }

    // Before Launch, View.load() fetches only the spawn planet's 1K sets. After Launch every
    // set loads: 2K on High, 1K otherwise.
    updateTextures()
    {
        const stateMachine = this.game.stateMachine
        const waiting = stateMachine.is(StateMachine.LOADING) || stateMachine.is(StateMachine.READY)
            || (stateMachine.is(StateMachine.QUICK_VIEW) && !this.launched)
        if(waiting)
            return
        this.launched = true
        setSurfaceResolution(this.quality === 'high' ? '2k' : '1k')
    }

    setDebug()
    {
        if(!this.debug.active)
            return

        const folder = this.debug.ui.getFolder('view/postProcessing')
        folder.add(this, 'quality', QUALITIES).onChange((value) => this.setQuality(value))
        folder.add(this.bloom, 'strength', 0, 3, 0.01).name('bloomStrength')
        folder.add(this.bloom, 'radius', 0, 1, 0.01).name('bloomRadius')
        folder.add(this.bloom, 'threshold', 0, 2, 0.01).name('bloomThreshold')
        folder.add(this.grade.uniforms.uVignette, 'value', 0, 1, 0.01).name('vignette')
        folder.add(this.grade.uniforms.uGrain, 'value', 0, 0.2, 0.001).name('grain')
        folder.add(this.grade.uniforms.uGrade, 'value', 0, 2, 0.01).name('grading')
    }

    resize()
    {
        this.composer.setPixelRatio(this.renderer.getPixelRatio())
        this.composer.setSize(this.viewport.width, this.viewport.height)
    }

    // If fps < 45 for 3 s, drop one quality level
    monitor()
    {
        const now = performance.now()
        const fps = this.fps
        fps.frames++

        const elapsed = now - fps.start
        if(elapsed < 1000)
            return

        const stateMachine = this.game.stateMachine
        const measuring = elapsed < 1500 && !stateMachine.is(StateMachine.LOADING) && !stateMachine.is(StateMachine.READY)

        if(measuring && fps.frames * 1000 / elapsed < MIN_FPS)
            fps.lowSeconds++
        else
            fps.lowSeconds = 0

        fps.frames = 0
        fps.start = now

        if(fps.lowSeconds >= LOW_FPS_SECONDS && this.quality !== 'low')
        {
            this.setQuality(QUALITIES[QUALITIES.indexOf(this.quality) - 1])
            this.bridge.emit('settings:change', { quality: this.quality })
        }
    }

    render()
    {
        this.monitor()

        if(this.quality === 'low')
        {
            this.renderer.render(this.scene, this.camera)
            return
        }

        this.grade.uniforms.uTime.value = this.state.time.elapsed
        this.composer.render(this.state.time.delta)
    }
}
