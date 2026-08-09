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
    constructor(scene)
    {
        this.scene = scene
        this.state = State.getInstance()
        this.boards = CERTIFICATE_AREA.map((certificate, index) => this.createBoard(certificate, index))
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

        // The screen itself becomes the certificate: no canvas frame, labels,
        // or overlays. Resizing the geometry to the source aspect ratio avoids
        // both letterboxing and cropping without distorting the image.
        new THREE.TextureLoader().load(certificate.image, (texture) =>
        {
            texture.colorSpace = THREE.SRGBColorSpace
            texture.minFilter = THREE.LinearFilter
            texture.magFilter = THREE.LinearFilter
            texture.generateMipmaps = false
            screenMaterial.map = texture
            screenMaterial.needsUpdate = true
            setBoardAspect(housing, screen, glow, texture.image.width / texture.image.height)
        })

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

        return { root, certificate, groundResolved: false }
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
    }
}
