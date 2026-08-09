<# ============================================================
   deploy-work-info-panel.ps1
   Updates the INFO button on the Work billboard to open a DOM-based
   panel (WorkInfoPanel.vue) that reuses About Me's PanelShell design
   -- transparent backdrop, same fonts/tokens/close button -- instead
   of the old canvas-drawn overlay.

   Writes (with .bak backups of any existing files):
     sources/Game/View/Billboard.js                      (modified: removed
                                                            canvas-drawn info
                                                            panel, added
                                                            onInfoChange hook)
     sources/index.js                                    (modified: bridges
                                                            Billboard's INFO
                                                            state to the UI
                                                            layer)
     sources/UI/App.vue                                  (modified: mounts
                                                            WorkInfoPanel)
     sources/UI/components/panels/WorkInfoPanel.vue      (new file)

   VIEW REPO, project navigation, billboard, camera, and all existing
   animations/controls are unchanged.

   Uses no-BOM UTF8 writes (PowerShell 5.1-safe).

   USAGE:
     1. Edit $ProjectRoot below if this script isn't sitting in your repo root.
     2. Save this file as deploy-work-info-panel.ps1 in your repo root.
     3. Run:
          Unblock-File .\deploy-work-info-panel.ps1
          powershell -ExecutionPolicy Bypass -File .\deploy-work-info-panel.ps1
     4. Then:
          npm install
          npm run dev
   ============================================================ #>

$ErrorActionPreference = "Stop"

$ProjectRoot = "$PSScriptRoot"
# If this script is NOT sitting inside the repo root, set the absolute path instead, e.g.:
# $ProjectRoot = "C:\Users\JEFF\OneDrive\Documents\YknowJeff"

$GameViewDir = Join-Path $ProjectRoot "sources\Game\View"
$SourcesDir  = Join-Path $ProjectRoot "sources"
$UIDir       = Join-Path $ProjectRoot "sources\UI"
$PanelsDir   = Join-Path $ProjectRoot "sources\UI\components\panels"

if (-not (Test-Path $ProjectRoot)) {
    throw "ProjectRoot not found: $ProjectRoot -- update `$ProjectRoot at the top of this script."
}

New-Item -ItemType Directory -Force -Path $GameViewDir | Out-Null
New-Item -ItemType Directory -Force -Path $UIDir       | Out-Null
New-Item -ItemType Directory -Force -Path $PanelsDir   | Out-Null

Write-Host "Target Game/View dir: $GameViewDir"
Write-Host "Target sources dir:   $SourcesDir"
Write-Host "Target UI dir:        $UIDir"
Write-Host "Target panels dir:    $PanelsDir"
Write-Host ""

function Write-Utf8NoBom {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Content
    )
    $encoding = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Content, $encoding)
    Write-Host "  Wrote: $Path"
}

$targets = @(
    (Join-Path $GameViewDir "Billboard.js"),
    (Join-Path $SourcesDir  "index.js"),
    (Join-Path $UIDir       "App.vue"),
    (Join-Path $PanelsDir   "WorkInfoPanel.vue")
)

Write-Host "Backing up existing files (if any)..."
foreach ($t in $targets) {
    if (Test-Path $t) {
        $backup = "$t.bak"
        Copy-Item -Path $t -Destination $backup -Force
        Write-Host "  Backed up: $t -> $backup"
    }
}
Write-Host ""

$billboardContent = @'
﻿import * as THREE from 'three'
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

        // Optional callback, wired by index.js (the composition root) to
        // bridge.emit('billboardInfoChanged', ...) -- Billboard.js stays
        // framework-agnostic and never imports UIBridge itself, same as the
        // rest of Game/View. INFO now opens a DOM panel (WorkInfoPanel.vue)
        // instead of a canvas-drawn overlay, so this is how that panel's
        // open/closed state stays in sync with clicks on the 3D screen.
        this.onInfoChange = null

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
            this._setInfoOpen(!this.infoOpen)
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
            // open closes it, same as clicking INFO again. In practice the
            // DOM info panel's own fullscreen backdrop sits over the canvas
            // while open, so this rarely fires -- kept as a safety net.
            this._setInfoOpen(false)
            this.drawScreen()
        }
    }

    _pointInRect(x, y, rect)
    {
        return !!rect && x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h
    }

    // Single place that mutates infoOpen so the DOM panel (via onInfoChange)
    // can never drift out of sync with the canvas button's own highlight
    // state. No-ops if the value isn't actually changing, so callers like
    // setProject()/exitInteraction() can call this unconditionally on every
    // project switch without spamming redundant bridge emits.
    _setInfoOpen(open)
    {
        if(this.infoOpen === open)
            return

        this.infoOpen = open
        this.onInfoChange?.(open)
    }

    // Public entry point for the DOM info panel's own Close/Back button
    // (wired through index.js -> bridge 'closeBillboardInfo') -- closes the
    // panel and restores the INFO pill's inactive look on the canvas.
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

        // The INFO button now opens WorkInfoPanel.vue -- a DOM overlay
        // reusing About Me's PanelShell/styling -- instead of a canvas-drawn
        // panel here. this.infoOpen still exists purely to drive the INFO
        // pill's own highlighted/inactive look above; see _setInfoOpen().

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
        this._setInfoOpen(false)
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
        this._setInfoOpen(false)
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


'@

$indexJsContent = @'
﻿import Game from '@/Game.js'
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

    // Translates Billboard.js's own INFO-toggle state (set purely by
    // raycasted clicks on the 3D screen -- see Billboard.js#_handleClick)
    // into a bridge event so WorkInfoPanel.vue can mount/unmount in sync.
    // Billboard.js itself never imports UIBridge; this is the one place
    // that's allowed to reach across the Game/UI boundary.
    game.view.billboard.onInfoChange = (open) => bridge.emit('billboardInfoChanged', open)

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

    // The INFO DOM panel's own Close/Back button -- returns to the billboard
    // (VIEW REPO, project nav, camera, etc. all stay exactly as they are)
    // rather than exiting Work entirely, which is what closeWorkBillboard()
    // above does.
    bridge.on('closeBillboardInfo', () =>
    {
        game.view.billboard.closeInfo()
    })

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

'@

$appVueContent = @'
﻿<script setup>
import { ref, computed, provide, watch, onUnmounted } from 'vue'
import { UI_BRIDGE_KEY } from './composables/useUIBridge.js'
import { GAME_KEY } from './composables/useGame.js'

import Navigation from './components/Navigation.vue'
import ExploreHUD from './components/ExploreHUD.vue'
import BillboardViewer from './components/BillboardViewer.vue'
import WorkInfoPanel from './components/panels/WorkInfoPanel.vue'
import AboutPanel from './components/panels/AboutPanel.vue'
import ResumePanel from './components/panels/ResumePanel.vue'

const props = defineProps({
    bridge: { type: Object, required: true },
    game: { type: Object, required: true }
})

provide(UI_BRIDGE_KEY, props.bridge)
provide(GAME_KEY, props.game)

// A component can never inject a value it just provided to itself --
// inject() on the root component reads the app-level context, not the
// local `provides` object provide() just wrote to, so useUIBridge()
// (which calls inject() under the hood) always threw "UIBridge has not
// been provided" here even though the bridge was provided one line above.
// Validate the prop directly instead. Descendants (WorkPanel, AboutPanel,
// ResumePanel via usePanelEscape()/useGame()) are true children of this
// instance, so their inject() calls resolve correctly and are unaffected.
if(!props.bridge)
    throw new Error('UIBridge has not been provided')

// The player is already in the world from the first frame -- no loading
// screen / menu gate in this design. activePanel is the only thing that
// pauses gameplay: null means "exploring", any string means a panel is open.
const activePanel = ref(null)
const workActive = ref(false)
// True from the instant "Work" is clicked until the fly-in settles (either
// into the billboard interface, or straight back out if ESC arrived mid
// flight -- see index.js's closeRequested handling). Navigation hides on
// this immediately, rather than waiting for the full flight to resolve, so
// About/Resume can't be opened while the Work camera tween is still running
// and left index.js's workOpen state out of sync with what's on screen.
const workTransitioning = ref(false)
const projectIndex = ref(0)
// Mirrors Billboard.js's own this.infoOpen (see billboard's onInfoChange
// hook, wired in index.js) -- true while the INFO DOM panel should be shown
// over the billboard.
const infoOpen = ref(false)

const stopBillboardState = props.bridge.on('billboardInteractionChanged', (active) =>
{
    workActive.value = active
})

const stopBillboardTransition = props.bridge.on('billboardTransitionChanged', (transitioning) =>
{
    workTransitioning.value = transitioning
})

const stopProjectState = props.bridge.on('billboardProjectChanged', (index) =>
{
    projectIndex.value = index
})

const stopBillboardInfo = props.bridge.on('billboardInfoChanged', (open) =>
{
    infoOpen.value = open
})

onUnmounted(() =>
{
    stopBillboardState()
    stopBillboardTransition()
    stopProjectState()
    stopBillboardInfo()
})

const inputEnabled = computed(() => !activePanel.value)

watch(inputEnabled, (value) =>
{
    props.game.state.controls.setInputEnabled(value)

    if(value)
        document.activeElement?.blur?.()
}, { immediate: true })

function openPanel(name)
{
    if(name === 'work')
    {
        // Belt-and-braces alongside index.js's own workOpen/isBusy() guard:
        // stops a rapid double click from emitting a second request while
        // the first is still being decided.
        if(workTransitioning.value || workActive.value)
            return

        workTransitioning.value = true
        props.bridge.emit('openWorkBillboard')
        return
    }

    // Work owns the camera/controls until its own transition settles --
    // About/Resume can't cut in mid-flight.
    if(workTransitioning.value)
        return

    if(activePanel.value === name)
        return

    activePanel.value = name
}

function closePanel()
{
    activePanel.value = null
}

// Closes just the INFO overlay, back to the billboard itself -- Work stays
// open (camera, VIEW REPO, project nav all untouched). See index.js's
// 'closeBillboardInfo' handler, which calls Billboard.js#closeInfo().
function closeInfo()
{
    props.bridge.emit('closeBillboardInfo')
}
</script>

<template>
    <Navigation
        v-if="!activePanel && !workActive && !workTransitioning"
        :active-panel="activePanel"
        @open-panel="openPanel"
    />

    <ExploreHUD v-if="!activePanel && !workActive && !workTransitioning" />

    <!-- No outer <Transition> here: PanelShell (rendered by each panel)
         already owns real enter/leave animation via its own nested
         <Transition :css="false"> + GSAP hooks. Wrapping it in another
         <Transition> from here doesn't work anyway -- PanelShell's root is
         itself a <Transition> component, not a plain element, which Vue
         can't attach transition classes to (that's what was spamming
         "Component inside <Transition> renders non-element root node that
         cannot be animated" in the console) -- and it was dead weight
         besides: activePanel only ever goes work/about/resume <-> null
         (Navigation is hidden while any panel is open, so you can't jump
         directly from one panel to another), so mode="out-in" never had
         two real branches to sequence between. -->
    <BillboardViewer v-if="workActive" :bridge="bridge" :project-index="projectIndex" />
    <AboutPanel v-else-if="activePanel === 'about'" @close="closePanel" />
    <ResumePanel v-else-if="activePanel === 'resume'" @close="closePanel" />

    <!-- Deliberately outside the v-if/v-else-if chain above (a v-if here
         would otherwise splice into that chain and break it -- Vue requires
         v-else-if to immediately follow a v-if/v-else-if sibling). Being
         last in the template also means it's last in the DOM, so its
         fullscreen backdrop paints over BillboardViewer's prev/next/ESC
         controls (same z-index) while open. Closing it (closeInfo(), below)
         returns to exactly that billboard view, camera and all, untouched. -->
    <WorkInfoPanel v-if="workActive && infoOpen" :project-index="projectIndex" @close="closeInfo" />
</template>

'@

$workInfoPanelContent = @'
<script setup>
import { computed } from 'vue'
import PanelShell from './PanelShell.vue'
import projects from '../../data/projects.js'

// Driven by the billboard's own project index (kept in sync via the
// 'billboardProjectChanged' bridge event -- see App.vue), not a local copy,
// so INFO always reflects whatever project the canvas screen is currently
// showing.
const props = defineProps({
    projectIndex: { type: Number, default: 0 }
})

const emit = defineEmits([ 'close' ])

const project = computed(() => projects[props.projectIndex] || projects[0])

function close() { emit('close') }
</script>

<template>
    <PanelShell
        variant="fullscreen"
        :title="project.title"
        :subtitle="`Project ${projectIndex + 1} of ${projects.length}`"
        @close="close"
    >
        <div class="iw-work-info">
            <!-- ── OVERVIEW ── -->
            <section class="iw-work-info__intro">
                <p class="iw-work-info__eyebrow">// project info</p>
                <p class="iw-work-info__summary">{{ project.summary }}</p>
            </section>

            <hr class="iw-work-info__divider">

            <!-- ── DESCRIPTION ── -->
            <section>
                <p class="iw-work-info__slug">// description</p>
                <h3 class="iw-work-info__heading">Project Overview</h3>
                <p class="iw-work-info__desc">
                    {{ project.description || project.summary || 'Project details coming soon.' }}
                </p>
            </section>

            <hr class="iw-work-info__divider">

            <!-- ── TECHNOLOGIES ── -->
            <section>
                <p class="iw-work-info__slug">// technologies</p>
                <h3 class="iw-work-info__heading">Built With</h3>
                <div v-if="project.tech?.length" class="iw-work-info__tag-row">
                    <span v-for="tech in project.tech" :key="tech" class="iw-work-info__tag">{{ tech }}</span>
                </div>
                <p v-else class="iw-work-info__muted">Not specified yet.</p>
            </section>

            <hr class="iw-work-info__divider">

            <!-- ── PROJECT DETAILS ── -->
            <section>
                <p class="iw-work-info__slug">// details</p>
                <h3 class="iw-work-info__heading">Project Details</h3>
                <dl class="iw-work-info__quick-info">
                    <div class="iw-work-info__quick-row">
                        <dt>Repository</dt>
                        <dd v-if="project.github">
                            <a :href="project.github" target="_blank" rel="noopener noreferrer">
                                {{ project.github.replace('https://', '') }}
                            </a>
                        </dd>
                        <dd v-else>Not public yet.</dd>
                    </div>
                    <div class="iw-work-info__quick-row">
                        <dt>Live Demo</dt>
                        <dd v-if="project.demo">
                            <a :href="project.demo" target="_blank" rel="noopener noreferrer">
                                {{ project.demo.replace('https://', '') }}
                            </a>
                        </dd>
                        <dd v-else>Not available yet.</dd>
                    </div>
                </dl>
            </section>

            <!-- ── BACK TO BILLBOARD ── -->
            <button type="button" class="iw-work-info__back" @click="close">
                &larr; Back to Billboard
            </button>
        </div>
    </PanelShell>
</template>

<style scoped>
/* Same Google Fonts as About Me (identical URL -- the browser dedupes the
   request if About's stylesheet already loaded it, so this costs nothing
   extra while keeping this panel self-contained). */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');

.iw-work-info
{
    /* Local tokens mirrored 1:1 from AboutPanel's .iw-about block so INFO
       reads as the same interface, not a reskin. */
    --iw-work-info-font: 'Inter', var(--iw-font);
    --iw-work-info-mono: 'JetBrains Mono', var(--iw-font-mono);
    --iw-work-info-accent: var(--iw-accent);
    --iw-work-info-accent-dim: rgba(255, 138, 61, 0.6);
    --iw-work-info-accent-faint: rgba(255, 138, 61, 0.12);
    --iw-work-info-border-accent: rgba(255, 138, 61, 0.45);
    --iw-work-info-text-2: rgba(190, 198, 215, 0.85);
    --iw-work-info-text-3: rgba(120, 130, 150, 0.85);

    font-family: var(--iw-work-info-font);
}

.iw-work-info__divider
{
    height: 1px;
    border: none;
    background: var(--iw-border);
    margin: 32px 0;
}

.iw-work-info__slug,
.iw-work-info__eyebrow
{
    font-family: var(--iw-work-info-mono);
    font-size: 11px;
    color: var(--iw-work-info-text-3);
    letter-spacing: 0.08em;
    margin: 0 0 8px;
}

.iw-work-info__heading
{
    font-family: var(--iw-work-info-font);
    font-size: clamp(20px, 3vw, 28px);
    font-weight: 800;
    color: var(--iw-text);
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin: 0 0 16px;
}

.iw-work-info__summary
{
    font-size: 15px;
    font-weight: 600;
    line-height: 1.6;
    color: var(--iw-text);
    margin: 0;
}

.iw-work-info__desc
{
    font-size: 13px;
    line-height: 1.8;
    color: var(--iw-work-info-text-2);
    margin: 0;
}

.iw-work-info__muted
{
    font-size: 12px;
    color: var(--iw-work-info-text-3);
    margin: 0;
}

/* -- Tags (identical treatment to About's tech/skill chips) -- */
.iw-work-info__tag-row
{
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.iw-work-info__tag
{
    font-family: var(--iw-work-info-mono);
    font-size: 11px;
    font-weight: 500;
    color: var(--iw-work-info-text-2);
    background: var(--iw-work-info-accent-faint);
    border: 1px solid var(--iw-work-info-border-accent);
    border-radius: 999px;
    padding: 5px 12px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

/* -- Quick info rows (identical treatment to About's quickInfo dl) -- */
.iw-work-info__quick-info
{
    border-top: 1px solid var(--iw-border);
    margin: 0;
}

.iw-work-info__quick-row
{
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid var(--iw-border);
    margin: 0;
}

.iw-work-info__quick-row dt
{
    font-family: var(--iw-work-info-mono);
    font-size: 10px;
    color: var(--iw-work-info-accent-dim);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    min-width: 100px;
    padding-top: 1px;
    flex-shrink: 0;
}

.iw-work-info__quick-row dd
{
    font-size: 12px;
    color: var(--iw-work-info-text-2);
    line-height: 1.6;
    margin: 0;
    word-break: break-word;
}

.iw-work-info__quick-row dd a
{
    color: var(--iw-work-info-accent);
    text-decoration: none;
}

.iw-work-info__quick-row dd a:hover
{
    text-decoration: underline;
}

/* -- Back to billboard -- */
.iw-work-info__back
{
    display: inline-flex;
    align-items: center;
    margin-top: 36px;
    font-family: var(--iw-work-info-mono);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--iw-text);
    background: var(--iw-work-info-accent-faint);
    border: 1px solid var(--iw-work-info-border-accent);
    border-radius: 6px;
    padding: 12px 24px;
    transition: background 0.2s var(--iw-ease), border-color 0.2s var(--iw-ease);
}

.iw-work-info__back:hover
{
    background: rgba(255, 138, 61, 0.2);
    border-color: var(--iw-work-info-accent);
}

@media (max-width: 520px)
{
    .iw-work-info__quick-row
    {
        flex-direction: column;
        gap: 4px;
    }
}
</style>

'@

Write-Utf8NoBom -Path (Join-Path $GameViewDir "Billboard.js") -Content $billboardContent
Write-Utf8NoBom -Path (Join-Path $SourcesDir  "index.js") -Content $indexJsContent
Write-Utf8NoBom -Path (Join-Path $UIDir       "App.vue") -Content $appVueContent
Write-Utf8NoBom -Path (Join-Path $PanelsDir   "WorkInfoPanel.vue") -Content $workInfoPanelContent

Write-Host ""
Write-Host "Done. Next steps:"
Write-Host "  npm install"
Write-Host "  npm run dev"