import * as THREE from 'three'

import Game from '@/Game.js'
import View from '@/View/View.js'
import Debug from '@/Debug/Debug.js'
import State from '@/State/State.js'

export default class Renderer
{
    constructor()
    {
        this.game = Game.getInstance()
        this.view = View.getInstance()
        this.state = State.getInstance()
        this.debug = Debug.getInstance()

        this.scene = this.view.scene
        this.viewport = this.state.viewport
        this.camera = this.view.camera

        this.pixelRatio = this.viewport.clampedPixelRatio

        this.setInstance()
        this.setDebug()
    }

    setInstance()
    {
        this.clearColor = '#010103'

        this.instance = new THREE.WebGLRenderer({
            alpha: false,
            antialias: !this.viewport.isMobile,
            powerPreference: 'high-performance'
        })

        this.instance.sortObjects = true
        this.instance.domElement.style.position = 'absolute'
        this.instance.domElement.style.top = 0
        this.instance.domElement.style.left = 0
        this.instance.domElement.style.width = '100%'
        this.instance.domElement.style.height = '100%'

        this.instance.setClearColor(this.clearColor, 1)
        this.instance.setSize(this.viewport.width, this.viewport.height)
        this.instance.setPixelRatio(this.pixelRatio)

        this.instance.toneMapping = THREE.ACESFilmicToneMapping
        this.instance.toneMappingExposure = 0.7 // Settings → Brightness (0.5–1.0)

        // Shadows: only the current planet casts (size per quality, see View/Lights.js)
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFShadowMap

        // Totals per frame, including post-processing passes (reset in update)
        this.instance.info.autoReset = false

        this.context = this.instance.getContext()

        if(this.debug.stats)
            this.debug.stats.setRenderPanel(this.context)
    }

    setDebug()
    {
        if(!this.debug.active)
            return

        const folder = this.debug.ui.getFolder('view/renderer')
        this.stats = { calls: 0, triangles: 0 }
        folder.add(this.stats, 'calls').name('draw calls').listen().disable()
        folder.add(this.stats, 'triangles').listen().disable()
        folder.add(this.instance, 'toneMappingExposure', 0.2, 3, 0.01)
    }

    // Quality: max pixel ratio 1 (low), 1.5 (medium), 2 (high)
    setPixelRatio(max)
    {
        this.pixelRatio = Math.min(this.viewport.pixelRatio, max)
        this.instance.setPixelRatio(this.pixelRatio)
        this.view.postProcessing?.resize()
    }

    resize()
    {
        this.instance.setSize(this.viewport.width, this.viewport.height)
        this.instance.setPixelRatio(this.pixelRatio)
    }

    update()
    {
        if(this.debug.stats)
            this.debug.stats.beforeRender()

        this.view.camera.checkWriters()
        this.instance.info.reset()
        this.view.postProcessing.render()

        if(this.stats)
        {
            this.stats.calls = this.instance.info.render.calls
            this.stats.triangles = this.instance.info.render.triangles
        }

        if(this.debug.stats)
            this.debug.stats.afterRender()
    }

    destroy()
    {
        this.instance.renderLists.dispose()
        this.instance.dispose()
    }
}
