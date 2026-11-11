import * as THREE from 'three'

import View from '@/View/View.js'
import State from '@/State/State.js'
import Debug from '@/Debug/Debug.js'
import StarsMaterial from './Materials/StarsMaterial.js'
import warpVertexShader from './Materials/shaders/warp/vertex.glsl'
import warpFragmentShader from './Materials/shaders/warp/fragment.glsl'
import nebulaVertexShader from './Materials/shaders/nebula/vertex.glsl'
import nebulaFragmentShader from './Materials/shaders/nebula/fragment.glsl'

const WARP_STREAKS = 400
const WARP_LENGTH = 420
const NEBULA_RADIUS = 1800
const SUN_DISTANCE = 1500

// Near-black space: subtle stars, one soft nebula and the sun disc, all following the
// camera so they look infinitely far away. During travel the stars stretch into warp
// streaks (TravelCinematic sets `warp`). Also builds the PMREM environment map.
export default class Space
{
    constructor()
    {
        this.view = View.getInstance()
        this.state = State.getInstance()
        this.debug = Debug.getInstance()

        this.viewport = this.state.viewport
        this.scene = this.view.scene
        this.sunDirection = this.state.planets.sunDirection

        this.group = new THREE.Group()
        this.scene.add(this.group)

        this.setNebula()
        this.setSun()
        this.setStars()
        this.setWarp()
        this.setDebug()
    }

    setNebula()
    {
        this.nebula = new THREE.Mesh(
            new THREE.SphereGeometry(NEBULA_RADIUS, 48, 24),
            new THREE.ShaderMaterial({
                uniforms: {
                    uIntensity: { value: 0.09 },
                    uColorA: { value: new THREE.Color('#3b2a8c') },
                    uColorB: { value: new THREE.Color('#1f6f8b') },
                    uBandAxis: { value: new THREE.Vector3(0.35, 0.85, - 0.4).normalize() }
                },
                vertexShader: nebulaVertexShader,
                fragmentShader: nebulaFragmentShader,
                side: THREE.BackSide,
                depthWrite: false
            })
        )
        this.nebula.renderOrder = - 2
        this.nebula.frustumCulled = false
        this.group.add(this.nebula)
    }

    setSun()
    {
        const canvas = document.createElement('canvas')
        canvas.width = 128
        canvas.height = 128
        const context = canvas.getContext('2d')
        const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
        // Same disc size as before on a sprite half as big: the halo is half the size and half as strong
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
        gradient.addColorStop(0.16, 'rgba(255, 250, 235, 1)')
        gradient.addColorStop(0.3, 'rgba(255, 220, 170, 0.17)')
        gradient.addColorStop(0.6, 'rgba(255, 190, 120, 0.03)')
        gradient.addColorStop(1, 'rgba(255, 180, 110, 0)')
        context.fillStyle = gradient
        context.fillRect(0, 0, 128, 128)

        const texture = new THREE.CanvasTexture(canvas)
        texture.colorSpace = THREE.SRGBColorSpace

        // HDR color so bloom picks up the sun disc (halved: never washes out the screen)
        const material = new THREE.SpriteMaterial({ map: texture, color: new THREE.Color(2.5, 2.3, 2), blending: THREE.AdditiveBlending, depthWrite: false, fog: false })
        this.sun = new THREE.Sprite(material)
        this.sun.position.copy(this.sunDirection).multiplyScalar(SUN_DISTANCE)
        this.sun.scale.setScalar(160)
        this.sun.renderOrder = - 1
        this.group.add(this.sun)
    }

    setStars()
    {
        this.stars = {}
        this.stars.count = 1000
        this.stars.distance = 1000

        this.stars.update = () =>
        {
            const positionArray = new Float32Array(this.stars.count * 3)
            const sizeArray = new Float32Array(this.stars.count)
            const colorArray = new Float32Array(this.stars.count * 3)
            const position = new THREE.Vector3()
            const color = new THREE.Color()

            for(let i = 0; i < this.stars.count; i++)
            {
                const iStride3 = i * 3

                // Full sphere around the player (space has no horizon)
                position.setFromSphericalCoords(this.stars.distance, Math.acos(Math.random() * 2 - 1), 2 * Math.PI * Math.random())
                positionArray[iStride3    ] = position.x
                positionArray[iStride3 + 1] = position.y
                positionArray[iStride3 + 2] = position.z

                sizeArray[i] = Math.pow(Math.random() * 0.9, 10) + 0.1

                // Mostly white, slightly warm or cool
                color.setHSL(Math.random() < 0.5 ? 0.6 : 0.1, 0.3, 0.6 + Math.random() * 0.4)
                colorArray[iStride3    ] = color.r
                colorArray[iStride3 + 1] = color.g
                colorArray[iStride3 + 2] = color.b
            }

            const geometry = new THREE.BufferGeometry()
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionArray, 3))
            geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizeArray, 1))
            geometry.setAttribute('aColor', new THREE.Float32BufferAttribute(colorArray, 3))

            const previousGeometry = this.stars.geometry
            this.stars.geometry = geometry
            if(previousGeometry)
            {
                previousGeometry.dispose()
                this.stars.points.geometry = geometry
            }
        }

        this.stars.update()

        this.stars.material = new StarsMaterial()
        this.stars.material.uniforms.uHeightFragments.value = this.viewport.height * this.viewport.clampedPixelRatio
        this.stars.material.uniforms.uIntensity.value = 1

        this.stars.points = new THREE.Points(this.stars.geometry, this.stars.material)
        this.stars.points.frustumCulled = false
        this.group.add(this.stars.points)
    }

    setWarp()
    {
        this.warp = { amount: 0, direction: new THREE.Vector3(0, 0, 1) }

        const source = this.stars.geometry.attributes.position.array
        const positions = new Float32Array(WARP_STREAKS * 6)
        const ends = new Float32Array(WARP_STREAKS * 2)
        for(let i = 0; i < WARP_STREAKS; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                positions[i * 6 + j] = source[i * 3 + j]
                positions[i * 6 + 3 + j] = source[i * 3 + j]
            }
            ends[i * 2 + 1] = 1
        }

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('aEnd', new THREE.BufferAttribute(ends, 1))

        this.warp.material = new THREE.ShaderMaterial({
            uniforms: {
                uDirection: { value: this.warp.direction },
                uLength: { value: 0 },
                uIntensity: { value: 0 }
            },
            vertexShader: warpVertexShader,
            fragmentShader: warpFragmentShader,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true
        })

        this.warp.lines = new THREE.LineSegments(geometry, this.warp.material)
        this.warp.lines.frustumCulled = false
        this.warp.lines.visible = false
        this.group.add(this.warp.lines)
    }

    // Small PMREM environment from the space backdrop (nebula + sun + a faint sky/ground
    // gradient) so metals and the astronaut visor have something to reflect.
    // All its shaders compile in parallel first (compileAsync), so generating it no longer
    // blocks the main thread for ~2 s on integrated GPUs.
    // Returns { placeholder, ready }: `placeholder` has the exact shape of the final map (same
    // shader variant), so the scene can compile with it while the real map is generated.
    createEnvironment(renderer)
    {
        const scene = new THREE.Scene()

        const gradient = new THREE.Mesh(
            new THREE.SphereGeometry(100, 32, 16),
            new THREE.ShaderMaterial({
                vertexShader: 'varying vec3 vDirection; void main() { vDirection = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
                fragmentShader: 'varying vec3 vDirection; void main() { float y = normalize(vDirection).y; gl_FragColor = vec4(mix(vec3(0.05, 0.045, 0.04), vec3(0.025, 0.035, 0.07), smoothstep(-0.3, 0.4, y)), 1.0); }',
                side: THREE.BackSide,
                depthWrite: false
            })
        )
        gradient.renderOrder = - 3
        scene.add(gradient)

        const nebula = this.nebula.clone()
        nebula.material = this.nebula.material.clone()
        nebula.material.uniforms.uIntensity.value = 0.6
        nebula.material.blending = THREE.AdditiveBlending
        nebula.material.transparent = true
        nebula.scale.setScalar(90 / NEBULA_RADIUS)
        scene.add(nebula)

        const sun = this.sun.clone()
        sun.position.copy(this.sunDirection).multiplyScalar(80)
        sun.scale.setScalar(13)
        scene.add(sun)

        const pmrem = new THREE.PMREMGenerator(renderer)

        // three r184 internals: allocating the targets creates PMREM's blur and GGX shaders,
        // which fromScene() would otherwise compile synchronously
        pmrem._setSize(256)
        const target = pmrem._allocateTargets()
        const placeholder = new THREE.Texture()
        placeholder.mapping = THREE.CubeUVReflectionMapping
        placeholder.image = { width: target.width, height: target.height }
        target.dispose()
        const shaders = new THREE.Scene()
        for(const material of [ pmrem._blurMaterial, pmrem._ggxMaterial ])
            if(material)
                shaders.add(new THREE.Mesh(pmrem._lodMeshes[0].geometry, material))

        const camera = new THREE.PerspectiveCamera(90, 1, 0.1, 200)
        renderer.setRenderTarget(pmrem._pingPongRenderTarget) // same output settings as the real passes
        const compiling = Promise.all([ renderer.compileAsync(scene, camera), renderer.compileAsync(shaders, camera) ])
        renderer.setRenderTarget(null)

        const ready = compiling
            .catch((error) => console.warn('[Space] Environment warm-up failed', error))
            .then(() =>
            {
                const texture = pmrem.fromScene(scene, 0.02, 0.1, 200).texture
                pmrem.dispose()
                nebula.material.dispose()
                gradient.geometry.dispose()
                gradient.material.dispose()
                return texture
            })

        return { placeholder, ready }
    }

    setDebug()
    {
        if(!this.debug.active)
            return

        const starsFolder = this.debug.ui.getFolder('view/space/stars')

        starsFolder.add(this.stars, 'count').min(100).max(50000).step(100).name('count').onChange(() => { this.stars.update() })
        starsFolder.add(this.stars.material.uniforms.uSize, 'value').min(0).max(1).step(0.0001).name('uSize')
        starsFolder.add(this.stars.material.uniforms.uBrightness, 'value').min(0).max(1).step(0.001).name('uBrightness')
        this.debug.ui.getFolder('view/space/nebula').add(this.nebula.material.uniforms.uIntensity, 'value', 0, 0.5, 0.005).name('intensity')
    }

    update()
    {
        this.group.position.copy(this.view.camera.instance.position)

        const amount = this.warp.amount
        this.warp.lines.visible = amount > 0.01
        this.warp.material.uniforms.uLength.value = amount * WARP_LENGTH
        this.warp.material.uniforms.uIntensity.value = amount * 1.5
    }

    resize()
    {
        this.stars.material.uniforms.uHeightFragments.value = this.viewport.height * this.viewport.clampedPixelRatio
    }
}
