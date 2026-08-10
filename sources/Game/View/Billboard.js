import * as THREE from 'three'
import gsap from 'gsap'

import State from '@/State/State.js'

// Billboard is 3x its original footprint (aspect ratio unchanged: 16:9).
const SCALE = 3
const SCREEN_WIDTH = 30 * SCALE
const SCREEN_HEIGHT = 16.875 * SCALE
const FRAME_MARGIN = 0   // was 1.4 * SCALE -- housing now matches the
                          // screen plane exactly, so no bezel is visible
                          // around the media (housing sits directly behind
                          // the screen and is invisible from the front).

// Housing depth is intentionally NOT scaled with SCALE -- keeping it a
// small fixed value (instead of the old 1.1) is what gives the enlarged
// billboard a thin, holographic-panel look instead of a bulky physical
// sign. Screen/glow z-offsets below are derived from this so they stay
// correctly seated against the housing's front face regardless of scale.
const FRAME_DEPTH = 0.18

// Local Y lift (on top of the terrain-resolved ground height) applied to
// both the housing and the screen so the whole billboard reads as clearly
// floating in the sky rather than sitting on the hill.
const BASE_ELEVATION = 16

export const BILLBOARD = {
    structurePosition: [ 10, 0, -45 ],
    displayResolution: '7680 x 4320',
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
    frameWidth: SCREEN_WIDTH + FRAME_MARGIN,
    frameHeight: SCREEN_HEIGHT + FRAME_MARGIN,
    viewpoint: {
        rotation: 0,
        theta: 0,
        phi: Math.PI * 0.5,
        orbitDistance: 6,
        framingPadding: 1.2,
        maxStandoffDistance: 55 * SCALE
    },
    color: 0x00e5ff
}

export default class Billboard
{
    constructor(scene, camera, renderer)
    {
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.active = false
        this.project = null
        this.mediaElement = null
        this.mediaSource = null
        this.mediaCache = new Map()
        this.mediaRequestId = 0
        this.lastVideoFrame = 0
        this.infoOpen = false
        this.onInfoChange = null
        this.hitRects = { info: null, repo: null }
        this.raycaster = new THREE.Raycaster()
        this.pointerNDC = new THREE.Vector2()
        this.transition = { alpha: 1, scale: 1 }
        this.groundY = BILLBOARD.structurePosition[1]
        this.groundResolved = false
        this.floatState = { y: 0 }

        this.group = new THREE.Group()
        this.group.position.set(BILLBOARD.structurePosition[0], this.groundY, BILLBOARD.structurePosition[2])

        this.buildFrame()
        this.buildScreen()
        this.startIdleAnimation()
        this.resolveGroundElevation()
        this.scene.add(this.group)

        this._handleClick = this._handleClick.bind(this)
        window.addEventListener('click', this._handleClick)

        this._handleMouseMove = this._handleMouseMove.bind(this)
        window.addEventListener('mousemove', this._handleMouseMove)
    }

    get groundElevation()
    {
        return this.groundY
    }

    get screenCenterY()
    {
        return this.groundY + this.screen.position.y
    }

    resolveGroundElevation()
    {
        if(this.groundResolved)
            return

        const state = State.getInstance()
        const elevation = state.chunks.getElevationForPosition(BILLBOARD.structurePosition[0], BILLBOARD.structurePosition[2])

        if(typeof elevation === 'number')
        {
            this.groundY = elevation
            this.groundResolved = true
        }
    }

    _handleClick(event)
    {
        if(!this.active || !this.renderer?.instance?.domElement)
            return

        if(event.target !== this.renderer.instance.domElement)
            return

        const rect = this.renderer.instance.domElement.getBoundingClientRect()
        if(rect.width === 0 || rect.height === 0)
            return

        this.pointerNDC.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        this.pointerNDC.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1

        this.raycaster.setFromCamera(this.pointerNDC, this.camera.instance)
        const hit = this.raycaster.intersectObject(this.screen, false)[0]
        if(!hit?.uv)
            return

        const x = hit.uv.x * this.canvas.width
        const y = (1 - hit.uv.y) * this.canvas.height

        if(this._pointInRect(x, y, this.hitRects.info))
        {
            this._setInfoOpen(!this.infoOpen)
            this.drawScreen()
        }
        else if(this._pointInRect(x, y, this.hitRects.repo))
        {
            const actionUrl = this.getAction(this.project).url
            if(actionUrl)
                window.open(actionUrl, '_blank', 'noopener,noreferrer')
        }
        else if(this.infoOpen)
        {
            this._setInfoOpen(false)
            this.drawScreen()
        }
    }

    _pointInRect(x, y, rect)
    {
        return !!rect && x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h
    }

    getAction(project)
    {
        const useRepository = project?.billboardAction === 'github'
        const url = useRepository ? project?.github : project?.demo || project?.github
        const label = useRepository || !project?.demo ? 'VIEW REPO' : 'LIVE SITE'

        return { url, label }
    }

    _handleMouseMove(event)
    {
        if(!this.renderer?.instance?.domElement)
            return

        const canvasEl = this.renderer.instance.domElement

        if(!this.active)
            return

        if(event.target !== canvasEl)
        {
            canvasEl.style.cursor = 'default'
            return
        }

        const rect = canvasEl.getBoundingClientRect()
        if(rect.width === 0 || rect.height === 0)
            return

        this.pointerNDC.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        this.pointerNDC.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1

        this.raycaster.setFromCamera(this.pointerNDC, this.camera.instance)
        const hit = this.raycaster.intersectObject(this.screen, false)[0]

        let hovering = false
        if(hit?.uv)
        {
            const x = hit.uv.x * this.canvas.width
            const y = (1 - hit.uv.y) * this.canvas.height
            hovering = this._pointInRect(x, y, this.hitRects.info) || this._pointInRect(x, y, this.hitRects.repo)
        }

        canvasEl.style.cursor = hovering ? 'pointer' : 'default'
    }

    _setInfoOpen(open)
    {
        if(this.infoOpen === open)
            return

        this.infoOpen = open
        this.onInfoChange?.(open)
    }

    closeInfo()
    {
        this._setInfoOpen(false)
        this.drawScreen()
    }

    _roundRectPath(ctx, x, y, w, h, r)
    {
        const radius = Math.min(r, w * 0.5, h * 0.5)
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.arcTo(x + w, y, x + w, y + h, radius)
        ctx.arcTo(x + w, y + h, x, y + h, radius)
        ctx.arcTo(x, y + h, x, y, radius)
        ctx.arcTo(x, y, x + w, y, radius)
        ctx.closePath()
    }

    buildFrame()
    {
        const shell = new THREE.MeshBasicMaterial({ color: 0x070b13 })
        const width = SCREEN_WIDTH + FRAME_MARGIN
        const height = SCREEN_HEIGHT + FRAME_MARGIN

        const housing = new THREE.Mesh(new THREE.BoxGeometry(width, height, FRAME_DEPTH), shell)
        housing.position.y = height * 0.5 + BASE_ELEVATION
        housing.frustumCulled = true
        this.group.add(housing)
    }

    buildScreen()
    {
        this.canvas = document.createElement('canvas')
        this.canvas.width = 2048
        this.canvas.height = 1152
        this.context = this.canvas.getContext('2d')
        this.texture = new THREE.CanvasTexture(this.canvas)
        this.texture.colorSpace = THREE.SRGBColorSpace
        this.texture.minFilter = THREE.LinearFilter
        this.texture.generateMipmaps = false

        const frameHalfDepth = FRAME_DEPTH * 0.5

        this.screen = new THREE.Mesh(
            new THREE.PlaneGeometry(SCREEN_WIDTH, SCREEN_HEIGHT),
            new THREE.MeshBasicMaterial({
                map: this.texture,
                toneMapped: false,
                transparent: true,
                polygonOffset: true,
                polygonOffsetFactor: -2,
                polygonOffsetUnits: -2
            })
        )
        // Keep the canvas screen well in front of its black housing. The old
        // 0.03 offset lost depth precision at a distance and caused flicker.
        this.screen.position.set(0, SCREEN_HEIGHT * 0.5 + BASE_ELEVATION, frameHalfDepth + 0.25)
        this.screen.renderOrder = 1
        this.group.add(this.screen)

        this.glow = new THREE.Mesh(
            new THREE.PlaneGeometry(SCREEN_WIDTH + 0.5 * SCALE, SCREEN_HEIGHT + 0.5 * SCALE),
            new THREE.MeshBasicMaterial({ color: BILLBOARD.color, transparent: true, opacity: 0.06, depthWrite: false })
        )
        this.glow.position.z = frameHalfDepth - 0.01
        this.glow.position.y = this.screen.position.y
        this.group.add(this.glow)

        this.drawScreen()
    }

    drawScreen()
    {
        const { context: ctx, canvas } = this
        const width = canvas.width
        const height = canvas.height
        const project = this.project || {
            title: 'SIGNAL / PORTFOLIO',
            summary: 'Approach the display to open the work archive.',
            description: 'A floating 8K cybernetic terminal.',
            tech: [ 'WEBGL', 'THREE.JS', 'INTERACTIVE' ]
        }

        ctx.fillStyle = '#050912'
        ctx.fillRect(0, 0, width, height)
        const idleGlow = ctx.createRadialGradient(width * 0.5, height * 0.42, 10, width * 0.5, height * 0.42, width * 0.7)
        idleGlow.addColorStop(0, '#123e51')
        idleGlow.addColorStop(0.5, '#0b1828')
        idleGlow.addColorStop(1, '#03060c')
        ctx.fillStyle = idleGlow
        ctx.fillRect(0, 0, width, height)
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.22)'
        ctx.lineWidth = 2
        for(let x = 0; x < width; x += 96)
        {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke()
        }
        for(let y = 0; y < height; y += 72)
        {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke()
        }

        const hasMedia = this.mediaElement?.readyState !== 0 && this.mediaElement?.complete !== false
        if(hasMedia)
        {
            try
            {
                const sourceWidth = this.mediaElement.videoWidth || this.mediaElement.naturalWidth || width
                const sourceHeight = this.mediaElement.videoHeight || this.mediaElement.naturalHeight || height
                const sourceAspect = sourceWidth / sourceHeight
                const boxAspect = width / height

                let cropWidth = sourceWidth
                let cropHeight = sourceHeight
                if(sourceAspect > boxAspect)
                    cropWidth = sourceHeight * boxAspect
                else
                    cropHeight = sourceWidth / boxAspect

                const cropX = (sourceWidth - cropWidth) * 0.5
                const cropY = (sourceHeight - cropHeight) * 0.5

                ctx.drawImage(this.mediaElement, cropX, cropY, cropWidth, cropHeight, 0, 0, width, height)
                // Keep media bright and glass-clear. The labels remain legible
                // through their own scrims instead of darkening the whole image.
                ctx.fillStyle = 'rgba(3, 6, 12, 0.04)'
                ctx.fillRect(0, 0, width, height)
            }
            catch(error)
            {
                // Media not decodable yet -- keep the idle background
            }
        }

        const topScrim = ctx.createLinearGradient(0, 0, 0, height * 0.22)
        topScrim.addColorStop(0, 'rgba(2, 4, 8, 0.48)')
        topScrim.addColorStop(1, 'rgba(2, 4, 8, 0)')
        ctx.fillStyle = topScrim
        ctx.fillRect(0, 0, width, height * 0.22)

        const bottomScrim = ctx.createLinearGradient(0, height * 0.5, 0, height)
        bottomScrim.addColorStop(0, 'rgba(2, 4, 8, 0)')
        bottomScrim.addColorStop(1, 'rgba(2, 4, 8, 0.58)')
        ctx.fillStyle = bottomScrim
        ctx.fillRect(0, height * 0.5, width, height * 0.5)

        ctx.fillStyle = '#8ffbff'
        ctx.font = '700 26px monospace'
        ctx.fillText('LIVE // WORK ARCHIVE', 92, 112)
        ctx.fillStyle = '#ff174f'
        ctx.fillText(`STATUS // ${(project.status || 'ACTIVE').toUpperCase()}`, width - 510, 112)

        ctx.fillStyle = 'rgba(233, 255, 255, 0.82)'
        ctx.font = '700 20px monospace'
        ctx.fillText(`ROLE // ${(project.role || 'Creative Developer').toUpperCase()}`, 100, 158)

        if(!hasMedia)
        {
            ctx.fillStyle = '#8ffbff'
            ctx.font = '600 24px monospace'
            ctx.fillText(project.media ? 'MEDIA // LOADING' : 'MEDIA // SIGNAL EMPTY', width * 0.5 - 140, height * 0.5)
        }

        const margin = 100

        const alpha = this.transition.alpha
        const riseOffset = (1 - this.transition.scale) * 140
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.translate(0, riseOffset)

        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'
        ctx.shadowBlur = 22
        const featureText = project.keyFeatures?.length
            ? `KEY FEATURES // ${project.keyFeatures.join('  •  ')}`
            : ''
        if(featureText)
        {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.75)'
            ctx.shadowBlur = 14
            ctx.fillStyle = '#8ffbff'
            ctx.font = '700 20px monospace'
            this.wrapText(featureText, margin, height - 390, width - margin * 2, 28)
        }

        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'
        ctx.shadowBlur = 22
        ctx.fillStyle = '#ff2e63'
        ctx.font = '800 76px sans-serif'
        const titleY = height - 300
        const afterTitleY = this.wrapText(project.title || 'UNTITLED PROJECT', margin, titleY, width - margin * 2 - 420, 82)
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0

        const buttonY = afterTitleY + 6
        const buttonHeight = 64
        ctx.font = '700 26px monospace'

        const infoLabel = 'INFO'
        const infoWidth = ctx.measureText(infoLabel).width + 72
        const infoRect = { x: margin, y: buttonY, w: infoWidth, h: buttonHeight }
        this._roundRectPath(ctx, infoRect.x, infoRect.y, infoRect.w, infoRect.h, buttonHeight * 0.5)
        ctx.fillStyle = this.infoOpen ? 'rgba(255, 46, 99, 0.9)' : 'rgba(255, 46, 99, 0.16)'
        ctx.fill()
        ctx.strokeStyle = '#ff2e63'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.fillStyle = this.infoOpen ? '#0a0a0f' : '#ffe8ee'
        ctx.fillText(infoLabel, infoRect.x + 36, infoRect.y + buttonHeight * 0.64)

        const action = this.getAction(this.project)
        const actionAvailable = !!action.url
        const actionLabel = action.label
        const actionWidth = ctx.measureText(actionLabel).width + 72
        const actionRect = { x: infoRect.x + infoRect.w + 20, y: buttonY, w: actionWidth, h: buttonHeight }
        this._roundRectPath(ctx, actionRect.x, actionRect.y, actionRect.w, actionRect.h, buttonHeight * 0.5)
        ctx.fillStyle = actionAvailable ? 'rgba(53, 246, 255, 0.16)' : 'rgba(160, 170, 175, 0.08)'
        ctx.fill()
        ctx.strokeStyle = actionAvailable ? '#35f6ff' : 'rgba(160, 170, 175, 0.4)'
        ctx.stroke()
        ctx.fillStyle = actionAvailable ? '#e9ffff' : 'rgba(220, 225, 228, 0.45)'
        ctx.fillText(actionLabel, actionRect.x + 36, actionRect.y + buttonHeight * 0.64)

        this.hitRects.info = infoRect
        this.hitRects.repo = actionAvailable ? actionRect : null

        ctx.restore()

        ctx.fillStyle = 'rgba(233, 255, 255, 0.8)'
        ctx.font = '700 24px monospace'
        ctx.fillText('<- PREV', 46, height - 26)
        ctx.fillText('NEXT ->', width - 170, height - 26)
        ctx.fillStyle = 'rgba(255, 23, 79, 0.85)'
        ctx.fillText(this.active ? 'ESC // EXIT' : 'WORK // CONNECT', width * 0.5 - 110, height - 26)

        ctx.fillStyle = 'rgba(255, 255, 255, 0.025)'
        for(let y = 0; y < height; y += 5)
            ctx.fillRect(0, y, width, 2)

        this.texture.needsUpdate = true
    }

    wrapText(text, x, y, maxWidth, lineHeight)
    {
        const words = String(text).split(' ')
        let line = ''
        let currentY = y
        for(const word of words)
        {
            const test = `${line}${word} `
            if(this.context.measureText(test).width > maxWidth && line)
            {
                this.context.fillText(line, x, currentY)
                line = `${word} `
                currentY += lineHeight
            }
            else
                line = test
        }
        this.context.fillText(line, x, currentY)
        return currentY + lineHeight
    }

    startIdleAnimation()
    {
        this.idleTween = gsap.to(this.floatState, {
            y: 0.35,
            duration: 3.2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        })
        this.rotationTween = gsap.to(this.group.rotation, {
            z: 0.012,
            duration: 4.6,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        })
    }

    _playTransition()
    {
        if(this.transitionTween)
            this.transitionTween.kill()

        // Animate the Three.js material, not the source canvas. Repainting a
        // 2K canvas every GSAP tick forced a texture upload and caused visible
        // stutter when changing projects.
        this.screen.material.opacity = 0
        this.screen.scale.set(0.985, 0.985, 1)
        this.transitionTween = gsap.to(this.screen.material, {
            opacity: 1,
            duration: 0.28,
            ease: 'power3.out',
            onComplete: () => { this.transitionTween = null }
        })
        gsap.to(this.screen.scale, {
            x: 1,
            y: 1,
            duration: 0.34,
            ease: 'power3.out'
        })
    }

    enterInteraction()
    {
        this.active = true
        // The billboard is already visible before Work is clicked. Keep its
        // screen and transform unchanged as interaction begins, rather than
        // making it pop or replay the project transition.
        this.group.scale.set(1, 1, 1)
        gsap.to(this.glow.material, { opacity: 0.17, duration: 0.35, yoyo: true, repeat: 1 })
    }

    setProject(project)
    {
        const isCurrentProject = project === this.project && project?.media?.src === this.mediaSource
        if(isCurrentProject)
        {
            this.drawScreen()
            return
        }

        this.project = project
        this._setInfoOpen(false)
        this.loadMedia(project?.media)
        this.drawScreen()
        this._playTransition()
    }

    preloadMedia(projects)
    {
        projects?.forEach((project) => this._getMedia(project?.media))
    }

    _getMedia(media)
    {
        const source = media?.src
        if(!source)
            return Promise.resolve(null)

        const cached = this.mediaCache.get(source)
        if(cached)
            return cached

        const isVideo = media.type === 'video' || /\.(mp4|webm|ogg)(\?.*)?$/i.test(source)
        const request = new Promise((resolve) =>
        {
            if(isVideo)
            {
                const video = document.createElement('video')
                video.preload = 'auto'
                video.muted = true
                video.loop = true
                video.playsInline = true
                video.addEventListener('canplay', () => resolve(video), { once: true })
                video.addEventListener('error', () => resolve(null), { once: true })
                video.src = source
                video.load()
                return
            }

            const image = new Image()
            image.decoding = 'async'
            image.addEventListener('load', async () =>
            {
                try { await image.decode() } catch(error) { /* already usable */ }
                resolve(image)
            }, { once: true })
            image.addEventListener('error', () => resolve(null), { once: true })
            image.src = source
        })
        this.mediaCache.set(source, request)
        return request
    }

    loadMedia(media)
    {
        const source = media?.src
        if(!source)
        {
            this.mediaSource = null
            this.mediaElement = null
            return
        }

        if(source === this.mediaSource)
            return

        this.mediaSource = source
        const requestId = ++this.mediaRequestId
        this._getMedia(media).then((element) =>
        {
            // Ignore media that completed after the user already moved on.
            if(requestId !== this.mediaRequestId || source !== this.mediaSource || !element)
                return

            this.mediaElement = element
            if(element instanceof HTMLVideoElement)
                element.play().catch(() => {})
            this.drawScreen()
        })
    }

    exitInteraction()
    {
        this.active = false
        this._setInfoOpen(false)
        if(this.transitionTween)
        {
            this.transitionTween.kill()
            this.transitionTween = null
        }
        this.transition.alpha = 1
        this.transition.scale = 1
        this.screen.material.opacity = 1
        this.screen.scale.set(1, 1, 1)
        this.drawScreen()
        gsap.to(this.group.scale, { x: 1, y: 1, z: 1, duration: 0.3 })

        if(this.renderer?.instance?.domElement)
            this.renderer.instance.domElement.style.cursor = 'default'
    }

    update(elapsedTime)
    {
        if(!this.groundResolved)
            this.resolveGroundElevation()

        this.group.position.y = this.groundY + this.floatState.y

        this.glow.material.opacity = (this.active ? 0.1 : 0.045) + Math.sin(elapsedTime * 2.4) * 0.018

        if(this.active && this.mediaElement instanceof HTMLVideoElement && elapsedTime - this.lastVideoFrame > 0.12)
        {
            this.lastVideoFrame = elapsedTime
            this.drawScreen()
        }
    }
}
