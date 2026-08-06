import * as THREE from 'three'
import gsap from 'gsap'

// The display is intentionally a world landmark: the canvas is texture-capped
// for memory/bandwidth, while its UI is authored as an 8K display design.
export const BILLBOARD = {
    structurePosition: [ 10, 0, -45 ],
    displayResolution: '7680 × 4320',
    viewpoint: {
        x: 10,
        z: -18,
        rotation: 0,
        theta: 0,
        phi: Math.PI * 0.43,
        distance: 16
    },
    color: 0x00e5ff
}

const SCREEN_WIDTH = 30
const SCREEN_HEIGHT = 16.875

export default class Billboard
{
    constructor(scene)
    {
        this.scene = scene
        this.active = false
        this.project = null
        this.mediaElement = null
        this.mediaSource = null
        this.lastVideoFrame = 0
        this.group = new THREE.Group()
        this.group.position.set(...BILLBOARD.structurePosition)

        this.buildFrame()
        this.buildScreen()
        this.startIdleAnimation()
        this.scene.add(this.group)
    }

    buildFrame()
    {
        const shell = new THREE.MeshBasicMaterial({ color: 0x070b13 })
        const accent = new THREE.MeshBasicMaterial({ color: BILLBOARD.color })
        const width = SCREEN_WIDTH + 1.4
        const height = SCREEN_HEIGHT + 1.4

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

        const trussGeometry = new THREE.BoxGeometry(0.7, 6, 0.7)
        for(const x of [ -width * 0.39, width * 0.39 ])
        {
            const truss = new THREE.Mesh(trussGeometry, shell)
            truss.position.set(x, 3, 0)
            this.group.add(truss)

            const strip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 5.7, 0.75), accent)
            strip.position.set(x, 3, 0.38)
            this.group.add(strip)
        }

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

        ctx.fillStyle = '#050912'
        ctx.fillRect(0, 0, width, height)

        const glow = ctx.createRadialGradient(width * 0.5, height * 0.42, 10, width * 0.5, height * 0.42, width * 0.7)
        glow.addColorStop(0, '#123e51')
        glow.addColorStop(0.5, '#0b1828')
        glow.addColorStop(1, '#03060c')
        ctx.fillStyle = glow
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

        ctx.fillStyle = '#e9ffff'
        ctx.font = '800 96px sans-serif'
        this.wrapText(project.title || 'UNTITLED PROJECT', 100, 290, width - 200, 110)
        ctx.fillStyle = '#65f6ff'
        ctx.font = '600 38px monospace'
        this.wrapText(project.summary || project.description || 'Project details coming soon.', 105, 470, width - 240, 54)

        // Project media is drawn into the screen texture itself so it remains
        // physically attached to the world display (not a floating DOM card).
        const mediaX = width - 820
        const mediaY = 250
        const mediaWidth = 620
        const mediaHeight = 350
        ctx.fillStyle = '#08131f'
        ctx.fillRect(mediaX, mediaY, mediaWidth, mediaHeight)
        ctx.strokeStyle = '#35f6ff'
        ctx.lineWidth = 3
        ctx.strokeRect(mediaX, mediaY, mediaWidth, mediaHeight)
        if(this.mediaElement?.readyState !== 0 && this.mediaElement?.complete !== false)
        {
            try
            {
                ctx.drawImage(this.mediaElement, mediaX + 8, mediaY + 8, mediaWidth - 16, mediaHeight - 16)
            }
            catch(error)
            {
                // A not-yet-decoded video frame is harmless; the next update
                // will paint it once the browser makes it available.
            }
        }
        else
        {
            ctx.fillStyle = '#8ffbff'
            ctx.font = '600 24px monospace'
            ctx.fillText(project.media ? 'MEDIA // LOADING' : 'MEDIA // SIGNAL EMPTY', mediaX + 50, mediaY + mediaHeight * 0.52)
        }

        ctx.fillStyle = '#ff174f'
        ctx.font = '700 30px monospace'
        ctx.fillText('SYSTEM / STACK', 105, 725)
        let chipX = 105
        for(const tech of project.tech || [])
        {
            const label = String(tech).toUpperCase()
            const chipWidth = ctx.measureText(label).width + 58
            ctx.fillStyle = 'rgba(0, 229, 255, 0.14)'
            ctx.fillRect(chipX, 755, chipWidth, 52)
            ctx.strokeStyle = '#35f6ff'
            ctx.strokeRect(chipX, 755, chipWidth, 52)
            ctx.fillStyle = '#e9ffff'
            ctx.fillText(label, chipX + 24, 791)
            chipX += chipWidth + 16
        }

        ctx.fillStyle = '#e9ffff'
        ctx.font = '700 28px monospace'
        ctx.fillText('← PREV', 105, height - 105)
        ctx.fillText('NEXT →', width - 250, height - 105)
        ctx.fillStyle = '#ff174f'
        ctx.fillText(this.active ? 'ESC // EXIT INTERFACE' : 'WORK // CONNECT', width * 0.5 - 185, height - 105)

        // CRT scanlines and a deliberately small, deterministic glitch band.
        ctx.fillStyle = 'rgba(0, 0, 0, 0.24)'
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
    }

    startIdleAnimation()
    {
        this.idleTween = gsap.to(this.group.position, {
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
        this.loadMedia(project?.media)
        this.drawScreen(true)
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
        this.drawScreen()
        gsap.to(this.group.scale, { x: 1, y: 1, z: 1, duration: 0.3 })
    }

    update(elapsedTime)
    {
        this.glow.material.opacity = (this.active ? 0.1 : 0.045) + Math.sin(elapsedTime * 2.4) * 0.018

        if(this.active && this.mediaElement instanceof HTMLVideoElement && elapsedTime - this.lastVideoFrame > 0.12)
        {
            this.lastVideoFrame = elapsedTime
            this.drawScreen()
        }
    }
}
