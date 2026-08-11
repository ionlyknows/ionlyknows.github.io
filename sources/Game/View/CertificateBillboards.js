import * as THREE from 'three'
import gsap from 'gsap'

import State from '@/State/State.js'

const SPAWN_POSITION = new THREE.Vector3(10, 2, 1)
const CERTIFICATE_ARC_RADIUS = 170
const CERTIFICATE_AREA = [
    { angle: 24, y: 30, image: '/certificates/introduction-to-generative-ai.jpg' },
    { angle: 36, y: 35, image: '/certificates/generative-ai-for-everyone.jpg' },
    { angle: 48, y: 29, image: '/certificates/foundations-of-cybersecurity.jpg' },
    { angle: 60, y: 35, image: '/certificates/connect-and-protect.jpg' },
    { angle: 72, y: 30, image: '/certificates/introduction-to-ai.jpg' }
].map((certificate) =>
{
    const angle = certificate.angle * Math.PI / 180

    return {
        ...certificate,
        x: SPAWN_POSITION.x + Math.sin(angle) * CERTIFICATE_ARC_RADIUS,
        z: SPAWN_POSITION.z - Math.cos(angle) * CERTIFICATE_ARC_RADIUS
    }
})

const SCREEN_HEIGHT = 15
const FRAME_DEPTH = 0.18
const DEFAULT_ASPECT = 16 / 10
// Interaction uses horizontal distance so floating certificate height does
// not make a nearby board unexpectedly unclickable.
const INTERACTION_DISTANCE = 125

const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x070b13 })
const glowMaterial = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.075, depthWrite: false })

function setBoardAspect(housing, screen, glow, aspect)
{
    const width = SCREEN_HEIGHT * aspect

    housing.geometry.dispose()
    screen.geometry.dispose()
    glow.geometry.dispose()

    housing.geometry = new THREE.BoxGeometry(width + 1, SCREEN_HEIGHT + 1, FRAME_DEPTH)
    screen.geometry = new THREE.PlaneGeometry(width, SCREEN_HEIGHT)
    glow.geometry = new THREE.PlaneGeometry(width + 2, SCREEN_HEIGHT + 2)
}

export default class CertificateBillboards
{
    constructor(scene, camera, renderer)
    {
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.state = State.getInstance()
        this.onSelect = null
        this.onProximityChange = null
        this.certificateNearby = false
        this.textureLoader = new THREE.TextureLoader()
        this.raycaster = new THREE.Raycaster()
        this.pointerNDC = new THREE.Vector2()
        this.boards = CERTIFICATE_AREA.map((certificate, index) => this.createBoard(certificate, index))

        // These boards are visible from the spawn area, well before the
        // player reaches the interaction radius. Preload the small, local
        // certificate set so their screens never appear as blank panels.
        this.boards.forEach((board) => this._loadBoardTexture(board))

        this._handleClick = this._handleClick.bind(this)
        this._handleMouseMove = this._handleMouseMove.bind(this)
        window.addEventListener('click', this._handleClick)
        window.addEventListener('mousemove', this._handleMouseMove)
    }

    createBoard(certificate, index)
    {
        const root = new THREE.Group()
        root.position.set(certificate.x, 0, certificate.z)

        const hoverGroup = new THREE.Group()
        hoverGroup.position.y = certificate.y
        root.add(hoverGroup)

        const initialWidth = SCREEN_HEIGHT * DEFAULT_ASPECT
        const housing = new THREE.Mesh(new THREE.BoxGeometry(initialWidth + 1, SCREEN_HEIGHT + 1, FRAME_DEPTH), frameMaterial)
        housing.castShadow = true
        housing.receiveShadow = true
        hoverGroup.add(housing)

        const screenMaterial = new THREE.MeshBasicMaterial({ toneMapped: false })
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(initialWidth, SCREEN_HEIGHT), screenMaterial)
        screen.position.z = FRAME_DEPTH * 0.5 + 0.22
        screen.renderOrder = 1
        hoverGroup.add(screen)

        const glow = new THREE.Mesh(new THREE.PlaneGeometry(initialWidth + 2, SCREEN_HEIGHT + 2), glowMaterial)
        glow.position.z = -FRAME_DEPTH * 0.5 - 0.01
        hoverGroup.add(glow)

        this.scene.add(root)

        const floatState = { y: 0 }
        gsap.to(floatState, {
            y: 0.8,
            duration: 2.7 + index * 0.18,
            delay: index * 0.14,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            onUpdate: () => { hoverGroup.position.y = certificate.y + floatState.y }
        })

        return { root, hoverGroup, screen, screenMaterial, housing, glow, certificate, width: initialWidth, groundResolved: false, textureRequested: false }
    }

    _loadBoardTexture(board)
    {
        if(board.textureRequested)
            return

        board.textureRequested = true
        // Retain the loaded texture for the lifetime of the scene.
        this.textureLoader.load(
            board.certificate.image,
            (texture) =>
            {
                texture.colorSpace = THREE.SRGBColorSpace
                texture.minFilter = THREE.LinearFilter
                texture.magFilter = THREE.LinearFilter
                texture.generateMipmaps = false
                texture.needsUpdate = true
                board.screenMaterial.map = texture
                board.screenMaterial.needsUpdate = true
                setBoardAspect(board.housing, board.screen, board.glow, texture.image.width / texture.image.height)
            },
            undefined,
            () => { board.textureRequested = false }
        )
    }

    setVisible(visible)
    {
        this.boards.forEach((board) => { board.root.visible = visible })
    }

    _getBoardAtPointer(event)
    {
        const canvas = this.renderer?.instance?.domElement
        if(event.target !== canvas)
            return null

        const rect = canvas.getBoundingClientRect()
        if(!rect.width || !rect.height)
            return null

        this.pointerNDC.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        this.pointerNDC.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
        this.raycaster.setFromCamera(this.pointerNDC, this.camera.instance)

        const screens = this.boards.map((board) => board.screen)
        const hit = this.raycaster.intersectObjects(screens, false)[0]
        const board = hit ? this.boards.find((item) => item.screen === hit.object) : null
        return board && this._isNear(board) ? board : null
    }

    _isNear(board)
    {
        const [ playerX, , playerZ ] = this.state.player.position.current
        const xDistance = playerX - board.root.position.x
        const zDistance = playerZ - board.root.position.z
        return xDistance * xDistance + zDistance * zDistance <= INTERACTION_DISTANCE * INTERACTION_DISTANCE
    }

    _handleClick(event)
    {
        const board = this._getBoardAtPointer(event)
        if(board)
        {
            // Start the texture request from the same interaction that opens
            // the board, guaranteeing the framed view does not remain blank
            // if the player arrived before the proximity check ran.
            this._loadBoardTexture(board)
            this.onSelect?.(board)
        }
    }

    _handleMouseMove(event)
    {
        const canvas = this.renderer?.instance?.domElement
        if(!canvas || event.target !== canvas)
            return

        canvas.style.cursor = this._getBoardAtPointer(event) ? 'pointer' : 'default'
    }

    update()
    {
        for(const board of this.boards)
        {
            if(board.groundResolved)
                continue

            const elevation = this.state.chunks.getElevationForPosition(board.certificate.x, board.certificate.z)
            if(typeof elevation !== 'number')
                continue

            board.root.position.y = elevation
            // This runs once after terrain height resolves, so every screen
            // faces the fixed spawn point and does not rotate as the player
            // moves through the world.
            board.root.lookAt(SPAWN_POSITION)
            board.groundResolved = true
        }

        const nearby = this.boards.some((board) => board.groundResolved && this._isNear(board))
        for(const board of this.boards)
        {
            if(board.groundResolved && this._isNear(board))
                this._loadBoardTexture(board)
        }
        if(nearby !== this.certificateNearby)
        {
            this.certificateNearby = nearby
            this.onProximityChange?.(nearby)
        }
    }
}
