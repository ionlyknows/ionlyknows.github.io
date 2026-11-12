import * as THREE from 'three'

import constellations, { GALACTIC_POLE } from '../config/constellations.js'

const SKY_RADIUS = 990 // just inside the background stars (Space.js, 1000)
const GALAXY_DISTANCE = 960
const METEOR_RADIUS = 900
const METEOR_POOL = 10
const METEOR_GAP = [ 8, 20 ] // s between single meteors
const SHOWER_GAP = [ 100, 140 ] // s between showers (5–8 meteors)

const DEG = Math.PI / 180

// Equatorial (right ascension in hours, declination in degrees) → direction on the sky sphere.
// Fixed mapping: celestial north = +Y. The Milky Way (Space nebula shader) uses the same mapping.
export function skyDirection(ra, dec, target = new THREE.Vector3())
{
    const a = ra * 15 * DEG
    const b = dec * DEG
    return target.set(Math.cos(b) * Math.cos(a), Math.sin(b), - Math.cos(b) * Math.sin(a))
}

export const galacticPole = skyDirection(...GALACTIC_POLE)

// Deterministic pseudo-random (same sky every visit)
const random = (i, k) =>
{
    const value = Math.sin(i * 127.1 + k * 311.7) * 43758.5453
    return value - Math.floor(value)
}

// M5 sky details, all inside Space's camera-following group: the 10 real constellations (brighter
// points + faint lines), 8 distant procedural galaxies, and meteors. Only the brightest few
// constellation stars reach the bloom threshold.
export default class SkyObjects
{
    constructor(group, viewport, sunDirection)
    {
        this.group = group
        this.viewport = viewport
        this.sunDirection = sunDirection

        this.setConstellations()
        this.setGalaxies()
        this.setMeteors()
    }

    setConstellations()
    {
        const positions = []
        const sizes = []
        const intensities = []
        const lines = []
        const a = new THREE.Vector3()
        const b = new THREE.Vector3()
        const direction = new THREE.Vector3()

        // M7 telescope: each constellation's own bright lines (shown when centred) and its centre
        this.highlights = []
        const highlightMaterial = new THREE.LineBasicMaterial({ color: '#bfe3ff', transparent: true, opacity: 0, depthWrite: false, fog: false })
        this.highlightMaterial = highlightMaterial

        for(const constellation of constellations)
        {
            const points = constellation.stars.map(([ ra, dec ]) => skyDirection(ra, dec).multiplyScalar(SKY_RADIUS))
            const own = []
            const centre = points.reduce((sum, point) => sum.add(point), new THREE.Vector3()).normalize()
            const extent = Math.max(...points.map((point) => point.clone().normalize().angleTo(centre)))
            constellation.stars.forEach(([ , , magnitude ], i) =>
            {
                positions.push(...points[i].toArray())
                sizes.push(THREE.MathUtils.clamp(5.2 - magnitude * 0.75, 2.2, 5.6))
                intensities.push(magnitude < 0.9 ? 1.2 : THREE.MathUtils.clamp(0.82 - (magnitude - 1) * 0.07, 0.55, 0.82))
            })

            // Lines stop short of the stars
            for(const [ i, j ] of constellation.lines)
            {
                direction.subVectors(points[j], points[i])
                const gap = Math.min(4, direction.length() * 0.2)
                direction.normalize()
                a.copy(points[i]).addScaledVector(direction, gap)
                b.copy(points[j]).addScaledVector(direction, - gap)
                lines.push(...a.toArray(), ...b.toArray())
                own.push(...a.toArray(), ...b.toArray())
            }

            const highlightGeometry = new THREE.BufferGeometry()
            highlightGeometry.setAttribute('position', new THREE.Float32BufferAttribute(own, 3))
            const mesh = new THREE.LineSegments(highlightGeometry, highlightMaterial)
            mesh.frustumCulled = false
            mesh.visible = false
            this.group.add(mesh)
            this.highlights.push({ id: constellation.id, centre, extent, mesh })
        }

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
        geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1))
        geometry.setAttribute('aIntensity', new THREE.Float32BufferAttribute(intensities, 1))

        this.starMaterial = new THREE.ShaderMaterial({
            uniforms: { uPixelRatio: { value: this.viewport.clampedPixelRatio } },
            vertexShader: /* glsl */`
                uniform float uPixelRatio;
                attribute float aSize;
                attribute float aIntensity;
                varying float vIntensity;
                void main()
                {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = aSize * uPixelRatio;
                    vIntensity = aIntensity;
                }`,
            fragmentShader: /* glsl */`
                varying float vIntensity;
                void main()
                {
                    float d = length(gl_PointCoord - 0.5);
                    float alpha = pow(smoothstep(0.5, 0.0, d), 1.6);
                    gl_FragColor = vec4(vec3(0.92, 0.95, 1.0) * vIntensity * alpha, 1.0);
                }`,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true
        })
        this.stars = new THREE.Points(geometry, this.starMaterial)
        this.stars.frustumCulled = false
        this.group.add(this.stars)

        const lineGeometry = new THREE.BufferGeometry()
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3))
        this.lines = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: '#8fb3e8', transparent: true, opacity: 0.16, depthWrite: false, fog: false }))
        this.lines.frustumCulled = false
        this.group.add(this.lines)
    }

    // M7 telescope view: the constellation nearest the centre of view (within its own size plus a
    // little, less when zoomed in) gets bright lines; returns its id (or null). direction = null: off
    updateTelescope(direction, zoom, delta)
    {
        let best = null
        let bestAngle = Infinity
        if(direction)
        {
            for(const item of this.highlights)
            {
                const angle = direction.angleTo(item.centre)
                if(angle < item.extent * 0.9 + 0.12 / zoom && angle < bestAngle)
                {
                    best = item
                    bestAngle = angle
                }
            }
        }
        if(best !== this.highlighted)
        {
            if(this.highlighted)
                this.highlighted.mesh.visible = false
            this.highlighted = best
            this.highlightMaterial.opacity = 0
            if(best)
                best.mesh.visible = true
        }
        if(best)
            this.highlightMaterial.opacity += (0.75 - this.highlightMaterial.opacity) * (1 - Math.exp(- 6 * delta))
        // Galaxies show more through the telescope (zoomed in: brighter and larger on screen)
        this.galaxies.material.uniforms.uBoost.value = direction ? 1.6 : 1
        return best?.id || null
    }

    setConstellationLines(visible)
    {
        this.lines.visible = visible
    }

    // Spiral and elliptical galaxies on quads facing the camera, away from the Milky Way and the sun
    setGalaxies()
    {
        const positions = []
        const uvs = []
        const params = []
        const indices = []
        const direction = new THREE.Vector3()
        const u = new THREE.Vector3()
        const v = new THREE.Vector3()
        const corner = new THREE.Vector3()

        let placed = 0
        for(let attempt = 0; placed < 8 && attempt < 200; attempt++)
        {
            const r = (k) => random(attempt, k)
            direction.setFromSphericalCoords(1, Math.acos(r(1) * 2 - 1), r(2) * Math.PI * 2)
            if(Math.abs(direction.dot(galacticPole)) < 0.35 || direction.dot(this.sunDirection) > 0.8)
                continue

            u.crossVectors(direction, Math.abs(direction.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0)).normalize()
            v.crossVectors(u, direction)
            const angle = r(3) * Math.PI
            const right = u.clone().multiplyScalar(Math.cos(angle)).addScaledVector(v, Math.sin(angle))
            const up = u.clone().multiplyScalar(- Math.sin(angle)).addScaledVector(v, Math.cos(angle))

            const spiral = placed < 5
            const size = 14 + r(4) * 22
            const incline = spiral ? 0.3 + r(5) * 0.7 : 0.55 + r(5) * 0.4 // squashed = tilted
            const brightness = 0.16 + r(6) * 0.16
            const base = placed * 4
            for(const [ x, y ] of [ [ - 1, - 1 ], [ 1, - 1 ], [ 1, 1 ], [ - 1, 1 ] ])
            {
                corner.copy(direction).multiplyScalar(GALAXY_DISTANCE).addScaledVector(right, x * size).addScaledVector(up, y * size * incline)
                positions.push(...corner.toArray())
                uvs.push(x, y)
                params.push(spiral ? 0 : 1, r(7), brightness, r(8))
            }
            indices.push(base, base + 1, base + 2, base, base + 2, base + 3)
            placed++
        }

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
        geometry.setAttribute('aUv', new THREE.Float32BufferAttribute(uvs, 2))
        geometry.setAttribute('aParams', new THREE.Float32BufferAttribute(params, 4))
        geometry.setIndex(indices)

        this.galaxies = new THREE.Mesh(geometry, new THREE.ShaderMaterial({
            uniforms: { uBoost: { value: 1 } },
            vertexShader: /* glsl */`
                attribute vec2 aUv;
                attribute vec4 aParams;
                varying vec2 vUv;
                varying vec4 vParams;
                void main()
                {
                    vUv = aUv;
                    vParams = aParams;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }`,
            fragmentShader: /* glsl */`
                uniform float uBoost;
                varying vec2 vUv;
                varying vec4 vParams;
                void main()
                {
                    float r = length(vUv);
                    float core = exp(- r * r * 40.0);
                    float disk;
                    if(vParams.x < 0.5)
                    {
                        // Two logarithmic spiral arms + a soft disk
                        float a = atan(vUv.y, vUv.x);
                        float arms = 0.5 + 0.5 * cos(2.0 * (a - log(r + 0.04) * 2.6) + vParams.y * 6.2831);
                        disk = exp(- r * 3.6) * (0.25 + 0.75 * pow(arms, 2.5)) * 0.8;
                    }
                    else
                        disk = exp(- r * r * 7.0) * 0.8;
                    float alpha = (core * 1.3 + disk) * smoothstep(1.0, 0.55, r);
                    vec3 color = mix(vec3(1.0, 0.88, 0.72), vec3(0.72, 0.82, 1.0), smoothstep(0.1, 0.6, r) * (1.0 - vParams.x));
                    gl_FragColor = vec4(color * alpha * vParams.z * uBoost, 1.0);
                }`,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true
        }))
        this.galaxies.frustumCulled = false
        this.galaxies.renderOrder = - 1.5
        this.group.add(this.galaxies)
    }

    setMeteors()
    {
        this.meteors = Array.from({ length: METEOR_POOL }, () => ({ active: false, delay: 0, time: 0, duration: 1, start: new THREE.Vector3(), tangent: new THREE.Vector3(), arc: 0, tail: 0 }))
        this.nextMeteor = 4 + Math.random() * 6
        this.nextShower = SHOWER_GAP[0] + Math.random() * (SHOWER_GAP[1] - SHOWER_GAP[0])

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(METEOR_POOL * 4 * 3), 3).setUsage(THREE.DynamicDrawUsage))
        geometry.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(METEOR_POOL * 4), 1).setUsage(THREE.DynamicDrawUsage))
        const indices = []
        for(let i = 0; i < METEOR_POOL; i++)
            indices.push(i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3)
        geometry.setIndex(indices)

        this.meteorMesh = new THREE.Mesh(geometry, new THREE.ShaderMaterial({
            vertexShader: /* glsl */`
                attribute float aAlpha;
                varying float vAlpha;
                void main()
                {
                    vAlpha = aAlpha;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }`,
            fragmentShader: /* glsl */`
                varying float vAlpha;
                void main()
                {
                    gl_FragColor = vec4(vec3(1.0, 0.94, 0.85) * 1.5 * vAlpha * vAlpha, 1.0);
                }`,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            side: THREE.DoubleSide
        }))
        this.meteorMesh.frustumCulled = false
        this.group.add(this.meteorMesh)

        this._head = new THREE.Vector3()
        this._tail = new THREE.Vector3()
        this._side = new THREE.Vector3()
        this._direction = new THREE.Vector3()
    }

    // One meteor from `start` moving along `tangent` (perpendicular to start), after `delay` s
    launch(start, tangent, delay = 0)
    {
        const meteor = this.meteors.find((item) => !item.active)
        if(!meteor)
            return
        meteor.active = true
        meteor.delay = delay
        meteor.time = 0
        meteor.duration = 0.6 + Math.random() * 0.35
        meteor.start.copy(start).normalize()
        meteor.tangent.copy(tangent).addScaledVector(meteor.start, - tangent.dot(meteor.start)).normalize()
        meteor.arc = 0.2 + Math.random() * 0.2
        meteor.tail = 0.06 + Math.random() * 0.07
    }

    randomDirection(target)
    {
        return target.setFromSphericalCoords(1, Math.acos(Math.random() * 2 - 1), Math.random() * Math.PI * 2)
    }

    updateMeteors(delta)
    {
        this.nextMeteor -= delta
        this.nextShower -= delta
        if(this.nextMeteor <= 0)
        {
            this.nextMeteor = METEOR_GAP[0] + Math.random() * (METEOR_GAP[1] - METEOR_GAP[0])
            const start = this.randomDirection(new THREE.Vector3())
            this.launch(start, this.randomDirection(new THREE.Vector3()))
        }
        if(this.nextShower <= 0)
        {
            this.nextShower = SHOWER_GAP[0] + Math.random() * (SHOWER_GAP[1] - SHOWER_GAP[0])
            const radiant = this.randomDirection(new THREE.Vector3())
            const count = 5 + Math.floor(Math.random() * 4)
            for(let i = 0; i < count; i++)
            {
                const start = this.randomDirection(new THREE.Vector3()).multiplyScalar(0.35).add(radiant).normalize()
                this.launch(start, start.clone().sub(radiant), i * (0.15 + Math.random() * 0.25))
            }
        }

        const positions = this.meteorMesh.geometry.attributes.position
        const alphas = this.meteorMesh.geometry.attributes.aAlpha
        const head = this._head
        const tail = this._tail
        const side = this._side
        this.meteors.forEach((meteor, i) =>
        {
            let alpha = 0
            if(meteor.active)
            {
                if(meteor.delay > 0)
                    meteor.delay -= delta
                else
                    meteor.time += delta
                const p = meteor.time / meteor.duration
                if(p >= 1)
                    meteor.active = false
                else if(meteor.delay <= 0)
                {
                    const a = p * meteor.arc
                    const b = Math.max(0, a - meteor.tail)
                    head.copy(meteor.start).multiplyScalar(Math.cos(a)).addScaledVector(meteor.tangent, Math.sin(a)).multiplyScalar(METEOR_RADIUS)
                    tail.copy(meteor.start).multiplyScalar(Math.cos(b)).addScaledVector(meteor.tangent, Math.sin(b)).multiplyScalar(METEOR_RADIUS)
                    side.crossVectors(this._direction.subVectors(head, tail), head).normalize()
                    alpha = THREE.MathUtils.smoothstep(p, 0, 0.2) * (1 - THREE.MathUtils.smoothstep(p, 0.6, 1))
                    positions.setXYZ(i * 4, tail.x - side.x * 0.2, tail.y - side.y * 0.2, tail.z - side.z * 0.2)
                    positions.setXYZ(i * 4 + 1, tail.x + side.x * 0.2, tail.y + side.y * 0.2, tail.z + side.z * 0.2)
                    positions.setXYZ(i * 4 + 2, head.x + side.x * 0.8, head.y + side.y * 0.8, head.z + side.z * 0.8)
                    positions.setXYZ(i * 4 + 3, head.x - side.x * 0.8, head.y - side.y * 0.8, head.z - side.z * 0.8)
                }
            }
            alphas.setX(i * 4, 0)
            alphas.setX(i * 4 + 1, 0)
            alphas.setX(i * 4 + 2, alpha)
            alphas.setX(i * 4 + 3, alpha)
        })
        positions.needsUpdate = true
        alphas.needsUpdate = true
    }

    resize()
    {
        this.starMaterial.uniforms.uPixelRatio.value = this.viewport.clampedPixelRatio
    }

    update(delta)
    {
        this.updateMeteors(delta)
    }
}
