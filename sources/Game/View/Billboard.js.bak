import * as THREE from 'three'
import gsap from 'gsap'

import State from '@/State/State.js'

const SCREEN_WIDTH = 30
const SCREEN_HEIGHT = 16.875
// Bezel margin added around the screen to get the outer housing footprint
// (see buildFrame()) -- shared here so Teleporter can size the "Work" camera
// shot to the whole structure, not just the inner screen plane.
const FRAME_MARGIN = 1.4

// The display is intentionally a world landmark: the canvas is texture-capped
// for memory/bandwidth, while its UI is authored as an 8K display design.
export const BILLBOARD = {
    // Y here is only a startup fallback used for the handful of frames before
    // the terrain worker resolves real elevation at this X/Z -- see
    // Billboard#resolveGroundElevation(). It is not the structure's real
    // ground height.
    structurePosition: [ 10, 0, -45 ],
    displayResolution: '7680 x 4320',
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
    // Outer housing footprint (screen + bezel) -- what "frame the entire
    // billboard" actually needs to fit inside the camera's FOV, as opposed
    // to screenWidth/screenHeight which only cover the inner screen plane.
    frameWidth: SCREEN_WIDTH + FRAME_MARGIN,
    frameHeight: SCREEN_HEIGHT + FRAME_MARGIN,
    // Tuning knobs for Teleporter#_computeWorkViewpoint(). x/z are no longer
    // stored here: the player's standoff position is solved at fly-time from
    // these plus the live viewport aspect + camera FOV, so the framing stays
    // correct across window sizes instead of being hand-tuned for one.
    viewpoint: {
        rotation: 0,
        theta: 0,
        phi: Math.PI * 0.5, // keeps the orbit level (no vertical component from distance/phi); heightOffset does the actual vertical placement
        orbitDistance: 6, // how far the camera sits behind the player, third-person style
        framingPadding: 1.2, // extra margin so the screen doesn't touch the frame edges
        maxStandoffDistance: 55 // hard cap so extreme (e.g. narrow mobile) aspects can't fling the player away
    },
    color: 0x00e5ff
}

export default class Billboard
{
    constructor(scene, camera, renderer)
    {
        this.scene = scene
        // View/Camera.js and View/Renderer.js instances -- needed to raycast
        // mouse clicks against this.screen so the INFO/VIEW REPO buttons
        // (drawn into the canvas texture itself, not as separate DOM
        // elements) are actually clickable.
        this.camera = camera
        this.renderer = renderer
        this.active = false
        this.project = null
        this.mediaElement = null
        this.mediaSource = null
        this.lastVideoFrame = 0
        this.infoOpen = false

        // Canvas-pixel-space hit rects for the two buttons, recomputed every
        // drawScreen() call so hit-testing always matches what's on screen.
        this.hitRects = { info: null, repo: null }
        this.raycaster = new THREE.Raycaster()
        this.pointerNDC = new THREE.Vector2()

        // Drives the fade/scale-in transition on enter and on every project
        // change -- a plain tween target redrawn each tick (see
        // _playTransition()), not a THREE/CSS transition, since the whole
        // billboard face is one canvas texture.
        this.transition = { alpha: 1, scale: 1 }

        // Ground placement: terrain elevation streams in asynchronously from a
        // Web Worker (see State/Terrain.js), so it's essentially never ready on
        // the very first frame. `groundY` starts at the static fallback and is
        // corrected to the real terrain height by resolveGroundElevation() as
        // soon as the surrounding chunk finishes generating -- this is what
        // stops the structure clipping into/floating above the ground.
        this.groundY = BILLBOARD.structurePosition[1]
        this.groundResolved = false

        // The idle bob tween used to animate `group.position.y` directly, which
        // is exactly the value resolveGroundElevation() also needs to write to.
        // Two writers on the same property fight each other (GSAP replays its
        // own recorded start/end values every tick and would stomp the ground
        // snap right back down). Bob amount now lives in its own plain object
        // and is composed with groundY each frame in update() instead.
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
    }

    // World-space Y the billboard's base is currently resting on (terrain
    // elevation once resolved, the startup fallback until then).
    get groundElevation()
    {
        return this.groundY
    }

    // World-space Y of the screen's centre -- ground height plus the screen's
    // fixed local offset. Used by Teleporter to frame the "Work" camera shot.
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

        // getElevationForPosition() returns `false` (no chunk yet) or
        // `undefined` (chunk exists, terrain worker hasn't finished) while not
        // ready -- only a real number means the data is in.
        if(typeof elevation === 'number')
        {
            this.groundY = elevation
            this.groundResolved = true
        }
    }

    // Raycasts a click against this.screen and, if it landed inside one of
    // the current button hit rects (in canvas-pixel space), triggers it.
    // Registered once on `window` for the app's lifetime -- Billboard is a
    // session-long singleton that's never torn down (same as the rest of
    // View's children), so this mirrors the existing no-teardown pattern.
    _handleClick(event)
    {
        if(!this.active || !this.renderer?.instance?.domElement)
            return

        // DOM UI (BillboardViewer's prev/next arrows, panels) also bubbles
        // clicks up to `window` -- only clicks that actually landed on the
        // 3D canvas should be reinterpreted as billboard button presses.
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
            this.infoOpen = !this.infoOpen
            this.drawScreen()
        }
        else if(this._pointInRect(x, y, this.hitRects.repo))
        {
            if(this.project?.github)
                window.open(this.project.github, '_blank', 'noopener,noreferrer')
        }
        else if(this.infoOpen)
        {
            // Clicking anywhere else on the screen while the info panel is
            // open closes it, same as clicking INFO again.
            this.infoOpen = false
            this.drawScreen()
        }
    }

    _pointInRect(x, y, rect)
    {
        return !!rect && x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h
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

        const housing = new THREE.Mesh(new THREE.BoxGeometry(width, height, 1.1), shell)
        housing.position.y = height * 0.5 + 3.5
        housing.frustumCulled = true
        this.group.add(housing)

        const edge = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.BoxGeometry(width, height, 1.12)),
            new THREE.LineBasicMaterial({ color: BILLBOARD.color, transparent: true, opacity: 0.72 })
        )
        edge.position.copy(housing.position)
        this.group.add(edge)

        const beaconGeometry = new THREE.SphereGeometry(0.32, 12, 8)
        for(const x of [ -width * 0.46, width * 0.46 ])
        {
            const beacon = new THREE.Mesh(beaconGeometry, new THREE.MeshBasicMaterial({ color: 0xff174f }))
            beacon.position.set(x, height + 3.1, 0.7)
            this.group.add(beacon)
        }
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

        this.screen = new THREE.Mesh(
            new THREE.PlaneGeometry(SCREEN_WIDTH, SCREEN_HEIGHT),
            new THREE.MeshBasicMaterial({ map: this.texture, toneMapped: false })
        )
        this.screen.position.set(0, SCREEN_HEIGHT * 0.5 + 3.5, 0.58)
        this.group.add(this.screen)

        this.glow = new THREE.Mesh(
            new THREE.PlaneGeometry(SCREEN_WIDTH + 0.5, SCREEN_HEIGHT + 0.5),
            new THREE.MeshBasicMaterial({ color: BILLBOARD.color, transparent: true, opacity: 0.06, depthWrite: false })
        )
        this.glow.position.z = 0.54
        this.glow.position.y = this.screen.position.y
        this.group.add(this.glow)

        this.drawScreen()
    }

    drawScreen(glitch = false)
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

        // Idle fallback look (no project loaded yet, e.g. first paint before
        // enterInteraction runs) -- the grid/glow "terminal" background.
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

        // Hero image: fills the ENTIRE screen edge to edge (cover-fit --
        // scaled so it always fully covers the box, aspect ratio preserved,
        // cropping only the excess rather than stretching it out of shape).
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
            }
            catch(error)
            {
                // A not-yet-decoded video frame is harmless; the next update
                // paints it once the browser makes it available.
            }
        }

        // Scrims: dark gradients top and bottom so the header bar and the
        // title/buttons stay readable over any photo, without hiding the
        // image itself (no opaque panels).
        const topScrim = ctx.createLinearGradient(0, 0, 0, height * 0.22)
        topScrim.addColorStop(0, 'rgba(2, 4, 8, 0.82)')
        topScrim.addColorStop(1, 'rgba(2, 4, 8, 0)')
        ctx.fillStyle = topScrim
        ctx.fillRect(0, 0, width, height * 0.22)

        const bottomScrim = ctx.createLinearGradient(0, height * 0.5, 0, height)
        bottomScrim.addColorStop(0, 'rgba(2, 4, 8, 0)')
        bottomScrim.addColorStop(1, 'rgba(2, 4, 8, 0.92)')
        ctx.fillStyle = bottomScrim
        ctx.fillRect(0, height * 0.5, width, height * 0.5)

        ctx.strokeStyle = '#35f6ff'
        ctx.lineWidth = 7
        ctx.strokeRect(30, 30, width - 60, height - 60)
        ctx.strokeStyle = '#ff174f'
        ctx.lineWidth = 3
        ctx.strokeRect(48, 48, width - 96, height - 96)

        ctx.fillStyle = '#8ffbff'
        ctx.font = '700 26px monospace'
        ctx.fillText('LIVE // WORK ARCHIVE', 92, 112)
        ctx.fillStyle = '#ff174f'
        ctx.fillText(`DISPLAY ${BILLBOARD.displayResolution}  |  SIGNAL LOCKED`, width - 650, 112)

        if(!hasMedia)
        {
            ctx.fillStyle = '#8ffbff'
            ctx.font = '600 24px monospace'
            ctx.fillText(project.media ? 'MEDIA // LOADING' : 'MEDIA // SIGNAL EMPTY', width * 0.5 - 140, height * 0.5)
        }

        const margin = 100

        // Fade/scale-in transition: title + buttons rise slightly and fade
        // in together, driven by this.transition (tweened via GSAP -- see
        // _playTransition()). Applied as a canvas transform so it affects
        // everything drawn after this point without touching the image or
        // header above.
        const alpha = this.transition.alpha
        const riseOffset = (1 - this.transition.scale) * 140
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.translate(0, riseOffset)

        // Title, bottom-left, bold and large -- the billboard's own brand
        // colour so it reads as a strong focal point over the photo.
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'
        ctx.shadowBlur = 22
        ctx.fillStyle = '#ff2e63'
        ctx.font = '800 76px sans-serif'
        const titleY = height - 300
        const afterTitleY = this.wrapText(project.title || 'UNTITLED PROJECT', margin, titleY, width - margin * 2 - 420, 82)
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0

        // Two pill buttons beneath the title: INFO (toggles the transparent
        // info panel below) and VIEW REPO (opens the repo in a new tab).
        // Hit rects are recomputed here every draw so _handleClick() always
        // tests against exactly what's currently on screen.
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

        const repoAvailable = !!this.project?.github
        const repoLabel = 'VIEW REPO'
        const repoWidth = ctx.measureText(repoLabel).width + 72
        const repoRect = { x: infoRect.x + infoRect.w + 20, y: buttonY, w: repoWidth, h: buttonHeight }
        this._roundRectPath(ctx, repoRect.x, repoRect.y, repoRect.w, repoRect.h, buttonHeight * 0.5)
        ctx.fillStyle = repoAvailable ? 'rgba(53, 246, 255, 0.16)' : 'rgba(160, 170, 175, 0.08)'
        ctx.fill()
        ctx.strokeStyle = repoAvailable ? '#35f6ff' : 'rgba(160, 170, 175, 0.4)'
        ctx.stroke()
        ctx.fillStyle = repoAvailable ? '#e9ffff' : 'rgba(220, 225, 228, 0.45)'
        ctx.fillText(repoLabel, repoRect.x + 36, repoRect.y + buttonHeight * 0.64)

        // Store in un-transformed canvas-pixel space to match _handleClick()
        // (translate() above only affects drawing, not these coordinates).
        this.hitRects.info = infoRect
        this.hitRects.repo = repoAvailable ? repoRect : null

        ctx.restore()

        // Transparent info panel: description + tech stack, toggled by the
        // INFO button. Sits over the image (not a separate full-screen UI)
        // with a translucent backing so the photo stays partly visible.
        if(this.infoOpen)
        {
            const panelX = width - margin - 760
            const panelY = height * 0.16
            const panelWidth = 760
            const panelHeight = height * 0.56

            ctx.save()
            this._roundRectPath(ctx, panelX, panelY, panelWidth, panelHeight, 18)
            ctx.fillStyle = 'rgba(4, 10, 18, 0.72)'
            ctx.fill()
            ctx.strokeStyle = 'rgba(53, 246, 255, 0.55)'
            ctx.lineWidth = 2
            ctx.stroke()
            ctx.clip()

            const padX = panelX + 46
            const padWidth = panelWidth - 92

            ctx.fillStyle = '#ff2e63'
            ctx.font = '700 24px monospace'
            ctx.fillText('PROJECT INFO', padX, panelY + 58)

            ctx.fillStyle = '#e9ffff'
            ctx.font = '600 30px monospace'
            const afterDescY = this.wrapText(
                project.description || project.summary || 'Project details coming soon.',
                padX, panelY + 118, padWidth, 42
            )

            ctx.fillStyle = '#8ffbff'
            ctx.font = '700 22px monospace'
            ctx.fillText('TECH STACK', padX, afterDescY + 24)

            let chipX = padX
            let chipY = afterDescY + 52
            ctx.font = '600 22px monospace'
            for(const tech of project.tech || [])
            {
                const label = String(tech).toUpperCase()
                const chipWidth = ctx.measureText(label).width + 44
                if(chipX + chipWidth > padX + padWidth)
                {
                    chipX = padX
                    chipY += 56
                }
                this._roundRectPath(ctx, chipX, chipY, chipWidth, 42, 21)
                ctx.fillStyle = 'rgba(53, 246, 255, 0.14)'
                ctx.fill()
                ctx.strokeStyle = '#35f6ff'
                ctx.lineWidth = 1.5
                ctx.stroke()
                ctx.fillStyle = '#e9ffff'
                ctx.fillText(label, chipX + 22, chipY + 28)
                chipX += chipWidth + 12
            }
            if(!project.tech?.length)
            {
                ctx.fillStyle = 'rgba(233, 255, 255, 0.55)'
                ctx.fillText('Not specified yet.', padX, chipY + 28)
            }

            ctx.restore()

            ctx.fillStyle = 'rgba(233, 255, 255, 0.55)'
            ctx.font = '600 18px monospace'
            ctx.fillText('TAP INFO TO CLOSE', padX, panelY + panelHeight - 24)
        }

        // Minimal nav hints, kept small and out of the way of the new
        // title/button composition -- the existing prev/next behaviour
        // itself (see BillboardViewer.vue's arrows) is unchanged.
        ctx.fillStyle = 'rgba(233, 255, 255, 0.8)'
        ctx.font = '700 24px monospace'
        ctx.fillText('<- PREV', 46, height - 26)
        ctx.fillText('NEXT ->', width - 170, height - 26)
        ctx.fillStyle = 'rgba(255, 23, 79, 0.85)'
        ctx.fillText(this.active ? 'ESC // EXIT' : 'WORK // CONNECT', width * 0.5 - 110, height - 26)

        // CRT scanlines and a deliberately small, deterministic glitch band.
        ctx.fillStyle = 'rgba(0, 0, 0, 0.18)'
        for(let y = 0; y < height; y += 5)
            ctx.fillRect(0, y, width, 2)

        if(glitch)
        {
            ctx.fillStyle = 'rgba(255, 23, 79, 0.65)'
            ctx.fillRect(0, height * 0.32, width, 14)
            ctx.fillStyle = 'rgba(53, 246, 255, 0.55)'
            ctx.fillRect(0, height * 0.68, width, 8)
        }

        this.texture.needsUpdate = true
    }

    // Returns the Y position just after the last line drawn, so callers can
    // stack the next element based on how much text there actually was,
    // instead of a fixed guess that breaks for a longer/shorter title.
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

    // Fades + gently rises the title/buttons in -- fired on entering Work
    // view and again on every project change (prev/next), so switching
    // projects always gets a smooth transition rather than a hard cut.
    _playTransition()
    {
        if(this.transitionTween)
            this.transitionTween.kill()

        this.transition.alpha = 0
        this.transition.scale = 0.9
        this.transitionTween = gsap.to(this.transition, {
            alpha: 1,
            scale: 1,
            duration: 0.5,
            ease: 'power3.out',
            onUpdate: () => this.drawScreen(),
            onComplete: () => { this.transitionTween = null }
        })
    }

    enterInteraction(project)
    {
        this.active = true
        this.setProject(project)
        this.drawScreen(true)
        gsap.fromTo(this.group.scale, { x: 0.96, y: 0.96, z: 0.96 }, { x: 1, y: 1, z: 1, duration: 0.55, ease: 'power3.out' })
        gsap.to(this.glow.material, { opacity: 0.17, duration: 0.35, yoyo: true, repeat: 1 })
        gsap.delayedCall(0.16, () => this.drawScreen())
    }

    setProject(project)
    {
        this.project = project
        this.infoOpen = false
        this.loadMedia(project?.media)
        this.drawScreen(true)
        this._playTransition()
        gsap.delayedCall(0.14, () => this.drawScreen())
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
        this.mediaElement = null
        const isVideo = media.type === 'video' || /\.(mp4|webm|ogg)(\?.*)?$/i.test(source)

        if(isVideo)
        {
            const video = document.createElement('video')
            video.src = source
            video.muted = true
            video.loop = true
            video.playsInline = true
            video.addEventListener('canplay', () =>
            {
                this.mediaElement = video
                video.play().catch(() => {})
                this.drawScreen()
            }, { once: true })
            return
        }

        const image = new Image()
        image.addEventListener('load', () =>
        {
            this.mediaElement = image
            this.drawScreen()
        }, { once: true })
        image.src = source
    }

    exitInteraction()
    {
        this.active = false
        this.project = null
        this.infoOpen = false
        if(this.transitionTween)
        {
            this.transitionTween.kill()
            this.transitionTween = null
        }
        this.transition.alpha = 1
        this.transition.scale = 1
        this.drawScreen()
        gsap.to(this.group.scale, { x: 1, y: 1, z: 1, duration: 0.3 })
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

