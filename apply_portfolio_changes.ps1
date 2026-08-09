$ErrorActionPreference = 'Stop'

$projectRoot = (Get-Location).Path
Write-Host "Applying the supplied changes from: $projectRoot" -ForegroundColor Cyan

$filesToBackup = @(
    'sources/Game/View/Billboard.js'
    'sources/Game/State/CameraThirdPerson.js'
    'sources/Game/State/Teleporter.js'
    'sources/index.js'
    'sources/UI/App.vue'
)

foreach ($relativePath in $filesToBackup) {
    $fullPath = Join-Path $projectRoot $relativePath
    if (-not (Test-Path -LiteralPath $fullPath)) { throw "File not found: $relativePath. Run this from the project root." }
    $backupPath = "$fullPath.bak-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item -LiteralPath $fullPath -Destination $backupPath -Force
    Write-Host "Backup: $backupPath" -ForegroundColor DarkGray
}

# Billboard.js: replace only the configuration at the top; preserve the existing Billboard class.
$billboardPath = Join-Path $projectRoot 'sources/Game/View/Billboard.js'
$billboard = Get-Content -LiteralPath $billboardPath -Raw -Encoding UTF8
$classMatch = [regex]::Match($billboard, '(?m)^export default class Billboard\b')
if (-not $classMatch.Success) { $classMatch = [regex]::Match($billboard, '(?m)^class Billboard\b') }
if (-not $classMatch.Success) { throw 'Could not find the existing Billboard class in sources/Game/View/Billboard.js.' }

$billboardConfig = @'
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

// -- everything below this point (class Billboard: constructor, buildFrame(),
// buildScreen(), drawScreen(), wrapText(), startIdleAnimation(),
// enterInteraction(), setProject(), loadMedia(), exitInteraction(), update())
// is UNCHANGED from your current file. Only buildFrame()'s local width/height
// vars now read `SCREEN_WIDTH + FRAME_MARGIN` / `SCREEN_HEIGHT + FRAME_MARGIN`
// instead of the old inline `+ 1.4` literals -- same numbers, shared constant.
'@

$billboardNew = $billboardConfig + "`r`n" + $billboard.Substring($classMatch.Index)
Set-Content -LiteralPath $billboardPath -Value $billboardNew -Encoding UTF8
Write-Host 'Updated sources/Game/View/Billboard.js (class preserved).' -ForegroundColor Green

$content = @'
import { vec3, quat2, mat4 } from 'gl-matrix'

import State from '@/State/State.js'

export default class CameraThirdPerson
{
    constructor(player)
    {
        this.state = State.getInstance()
        this.viewport = this.state.viewport
        this.controls = this.state.controls

        this.player = player

        this.active = false
        this.gameUp = vec3.fromValues(0, 1, 0)
        this.position = vec3.create()
        this.quaternion = quat2.create()
        this.distance = 15
        this.phi = Math.PI * 0.45
        this.theta = - Math.PI * 0.25
        this.aboveOffset = 2
        // Extra world-space Y added on top of the orbit's own vertical
        // component. Stays 0 for normal gameplay; Teleporter drives it during
        // the "Work" billboard shot to raise the camera itself to roughly the
        // screen's centre height instead of only tilting the look target.
        this.heightOffset = 0
        this.phiLimits = { min: 0.1, max: Math.PI - 0.1 }
    }

    activate()
    {
        this.active = true
    }

    deactivate()
    {
        this.active = false
    }

    update()
    {
        if(!this.active)
            return

        // Phi and theta. Gated by controls.inputEnabled (the same switch the
        // UI layer flips off while a panel/the "Work" billboard view is
        // open) so a held-down mouse drag can't fight the Teleporter's
        // scripted camera tween -- without this, pointer.delta keeps
        // accumulating from raw window events regardless of inputEnabled
        // (see Controls.setPointer()), so this check has to happen here,
        // not just at the input source.
        if(this.controls.inputEnabled && (this.controls.pointer.down || this.viewport.pointerLock.active))
        {
            const normalisedPointer = this.viewport.normalise(this.controls.pointer.delta)
            this.phi -= normalisedPointer.y * 2
            this.theta -= normalisedPointer.x * 2

            if(this.phi < this.phiLimits.min)
                this.phi = this.phiLimits.min
            if(this.phi > this.phiLimits.max)
                this.phi = this.phiLimits.max
        }
        
        // Position
        const sinPhiRadius = Math.sin(this.phi) * this.distance
        const sphericalPosition = vec3.fromValues(
            sinPhiRadius * Math.sin(this.theta),
            Math.cos(this.phi) * this.distance,
            sinPhiRadius * Math.cos(this.theta)
        )
        vec3.add(this.position, this.player.position.current, sphericalPosition)
        this.position[1] += this.heightOffset

        // Target
        const target = vec3.fromValues(
            this.player.position.current[0],
            this.player.position.current[1] + this.aboveOffset,
            this.player.position.current[2]
        )

        // Quaternion
        const toTargetMatrix = mat4.create()
        mat4.targetTo(toTargetMatrix, this.position, target, this.gameUp)
        quat2.fromMat4(this.quaternion, toTargetMatrix)
        
        // Clamp to ground
        const chunks = this.state.chunks
        const elevation = chunks.getElevationForPosition(this.position[0], this.position[2])

        if(elevation && this.position[1] < elevation + 1)
            this.position[1] = elevation + 1
    }
}
'@
$path = Join-Path $projectRoot 'sources/Game/State/CameraThirdPerson.js'
Set-Content -LiteralPath $path -Value $content -Encoding UTF8
Write-Host 'Updated sources/Game/State/CameraThirdPerson.js' -ForegroundColor Green

$content = @'
import gsap from 'gsap'

import Game from '@/Game.js'
import State from '@/State/State.js'
import Camera from './Camera.js'
import { BILLBOARD } from '@/View/Billboard.js'

export default class Teleporter
{
    constructor()
    {
        this.state = State.getInstance()

        // Plain tween target -- never touch player.position.current directly
        // from GSAP's own ticker except inside onUpdate, so there's exactly
        // one place that writes to game state each tick.
        this.tween = { x: 0, z: 0, rotation: 0, theta: 0, phi: 0, distance: 0, aboveOffset: 0, heightOffset: 0 }
        this.activeTween = null
        this.origin = null // where to fly back to on close
    }

    isBusy()
    {
        return !!this.activeTween
    }

    flyToWork(duration = 1.6)
    {
        const player = this.state.player

        // The Work shot is only ever scripted through CameraThirdPerson's
        // theta/phi/distance/aboveOffset/heightOffset. If the player happens
        // to be in fly-cam mode (V), Camera#update() would keep rendering
        // CameraFly's position instead and the framing below would silently
        // have no visible effect.
        if(player.camera.mode !== Camera.MODE_THIRDPERSON)
        {
            player.camera.fly.deactivate()
            player.camera.thirdPerson.activate()
            player.camera.mode = Camera.MODE_THIRDPERSON
        }

        // Snapshot exactly what "restore on ESC" means, captured fresh on
        // every visit (not just the first -- see the note on _flyTo() about
        // why this can no longer be left to an implicit null-check there).
        const camera = player.camera.thirdPerson
        this.origin = {
            x: player.position.current[0],
            z: player.position.current[2],
            rotation: player.rotation,
            theta: camera.theta,
            phi: camera.phi,
            distance: camera.distance,
            aboveOffset: camera.aboveOffset,
            heightOffset: camera.heightOffset
        }

        return this._flyTo(this._computeWorkViewpoint(), duration)
    }

    // Solves the player standoff position + camera look-height offset that
    // puts the billboard screen centred and fully framed, sized to the
    // *current* viewport aspect ratio and live camera FOV -- rather than a
    // single hand-tuned (x, z, theta, phi, distance) baked in for one window
    // size. This has to be recomputed on every call (not cached once) because
    // it depends on:
    //  - the billboard's terrain-resolved ground height (only known once the
    //    surrounding chunk's terrain worker has finished), and
    //  - the live window aspect ratio (the player can resize the window or
    //    rotate their device between visits to the billboard).
    _computeWorkViewpoint()
    {
        const game = Game.getInstance()
        const billboard = game.view.billboard
        const cameraInstance = game.view.camera.instance
        const chunks = this.state.chunks
        const config = BILLBOARD.viewpoint

        const billboardX = BILLBOARD.structurePosition[0]
        const billboardZ = BILLBOARD.structurePosition[2]
        const screenCenterY = billboard.screenCenterY

        // Distance needed for the full housing -- frame + beacons, not just
        // the inner screen plane -- (width AND height, since on a
        // narrow/portrait viewport the horizontal FOV is the tighter
        // constraint even though the structure is wider than it is tall) to
        // fit inside the camera's FOV, with a comfortable margin.
        const aspect = Number.isFinite(cameraInstance.aspect) && cameraInstance.aspect > 0
            ? cameraInstance.aspect
            : 16 / 9
        const verticalFov = cameraInstance.fov * Math.PI / 180
        const horizontalFov = 2 * Math.atan(Math.tan(verticalFov * 0.5) * aspect)

        const halfHeight = (BILLBOARD.frameHeight * 0.5) * config.framingPadding
        const halfWidth = (BILLBOARD.frameWidth * 0.5) * config.framingPadding

        const distanceForHeight = halfHeight / Math.tan(verticalFov * 0.5)
        const distanceForWidth = halfWidth / Math.tan(horizontalFov * 0.5)
        const requiredDistance = Math.min(
            Math.max(distanceForHeight, distanceForWidth),
            config.maxStandoffDistance
        )

        // The player stands back far enough that, combined with the camera's
        // own orbitDistance behind them, the total camera-to-billboard
        // distance equals requiredDistance.
        const minZGap = config.orbitDistance * 2
        const zGap = Math.max(requiredDistance, minZGap)
        const viewpointZ = billboardZ + zGap - config.orbitDistance

        const rawElevation = chunks.getElevationForPosition(billboardX, viewpointZ)
        const playerGroundElevation = typeof rawElevation === 'number' ? rawElevation : billboard.groundElevation

        // Vertical aim. CameraThirdPerson always looks at
        // (player.x, player.y + aboveOffset, player.z) and positions the
        // camera at (player position + orbit offset + heightOffset) -- so
        // rather than leaving the camera at the player's ground height and
        // tilting the look target way up (which distorts the FOV-based
        // requiredDistance above, since that math assumes a level shot), the
        // camera itself is raised to the target's height too. aboveOffset and
        // heightOffset therefore end up equal: both the camera and its look
        // target sit at the screen's own centre height, giving a level,
        // fully-framed shot at (roughly) the requested camera height.
        const aboveOffset = Math.max(screenCenterY - playerGroundElevation, 1)

        return {
            x: billboardX,
            z: viewpointZ,
            rotation: config.rotation,
            theta: config.theta,
            phi: config.phi,
            distance: config.orbitDistance,
            aboveOffset,
            heightOffset: aboveOffset
        }
    }

    flyBack(duration = 1.2)
    {
        if(!this.origin)
            return Promise.resolve()

        const target = this.origin
        this.origin = null

        return this._flyTo(target, duration)
    }

    _flyTo(target, duration)
    {
        const player = this.state.player
        const camera = player.camera.thirdPerson

        // Releasing pointer lock stops residual mouse movement from fighting
        // the scripted camera framing while it's mid-tween or a panel is open.
        this.state.viewport.pointerLock.deactivate()

        this.tween.x = player.position.current[0]
        this.tween.z = player.position.current[2]
        this.tween.rotation = player.rotation
        this.tween.theta = camera.theta
        this.tween.phi = camera.phi
        this.tween.distance = camera.distance
        this.tween.aboveOffset = camera.aboveOffset
        this.tween.heightOffset = camera.heightOffset

        if(this.activeTween)
            this.activeTween.kill()

        return new Promise((resolve) =>
        {
            this.activeTween = gsap.to(this.tween, {
                x: target.x,
                z: target.z,
                rotation: target.rotation,
                theta: target.theta,
                phi: target.phi,
                distance: target.distance,
                aboveOffset: target.aboveOffset,
                heightOffset: target.heightOffset ?? 0,
                duration,
                ease: 'power3.inOut',
                onUpdate: () =>
                {
                    player.position.current[0] = this.tween.x
                    player.position.current[2] = this.tween.z
                    player.rotation = this.tween.rotation
                    camera.theta = this.tween.theta
                    camera.phi = this.tween.phi
                    camera.distance = this.tween.distance
                    camera.aboveOffset = this.tween.aboveOffset
                    camera.heightOffset = this.tween.heightOffset
                },
                onComplete: () =>
                {
                    this.activeTween = null
                    resolve()
                }
            })
        })
    }
}
'@
$path = Join-Path $projectRoot 'sources/Game/State/Teleporter.js'
Set-Content -LiteralPath $path -Value $content -Encoding UTF8
Write-Host 'Updated sources/Game/State/Teleporter.js' -ForegroundColor Green

$content = @'
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
'@
$path = Join-Path $projectRoot 'sources/index.js'
Set-Content -LiteralPath $path -Value $content -Encoding UTF8
Write-Host 'Updated sources/index.js' -ForegroundColor Green

$content = @'
<script setup>
import { ref, computed, provide, watch, onUnmounted } from 'vue'
import { UI_BRIDGE_KEY } from './composables/useUIBridge.js'
import { GAME_KEY } from './composables/useGame.js'

import Navigation from './components/Navigation.vue'
import ExploreHUD from './components/ExploreHUD.vue'
import BillboardViewer from './components/BillboardViewer.vue'
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

onUnmounted(() =>
{
    stopBillboardState()
    stopBillboardTransition()
    stopProjectState()
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
</template>
'@
$path = Join-Path $projectRoot 'sources/UI/App.vue'
Set-Content -LiteralPath $path -Value $content -Encoding UTF8
Write-Host 'Updated sources/UI/App.vue' -ForegroundColor Green

Write-Host ''
Write-Host 'All supplied changes have been applied successfully.' -ForegroundColor Green
Write-Host 'Backup files were created next to each original file.' -ForegroundColor Yellow
