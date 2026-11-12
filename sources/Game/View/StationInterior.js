import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import config, { earth, sunDirection } from '../config/planets.js'
import { NODE, NODE_HALF_FACE, HATCH, HATCH_HALF, MODULE_START, TUBE, TUBE_DECK, CUPOLA, RACK_BANK, BACK_RACK, PROJECTOR_RADIUS, moduleFrame } from '@/State/InteriorLayout.js'
import StateMachine from '@/StateMachine.js'
import UIBridge from '../../UI/UIBridge.js'
import exhibits from '../../content/exhibits.js'
import { visibleProjects } from '../../UI/visibleContent.js'
import achievements from '../../content/achievements.js'
import photos from '../../content/photos.js'
import { createSurfaceMaterial } from './Materials/surface.js'
import { createCanvas, canvasTexture, text, labelTexture, roundRect, COLORS, MONO } from './ExhibitCanvas.js'
import { createCrewModel, PALETTES } from './CrewModels.js'
import { moduleBox, tubeArc, hoop, bulkheadShape, faceShape, shapeAt, rod, paint, finish, place, canvasMap, inward } from './StationParts.js'

const has = (value) => Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && String(value).trim() !== ''
const HDR = (color, amount) => new THREE.Color(color).multiplyScalar(amount)
const facingAngle = ([ nx, nz ]) => Math.atan2(nx, nz)
const HOLOGRAM_HEIGHT = 2.6
const HOLOGRAM_SIZE = 1.5 // radius of the miniature system
const PHOTO_FLICKER_DISTANCE = 7
const PHOTO_SCREEN = 1.95 // photo hologram height (on the desk)
const DESK_HEIGHT = 0.95
const ON_RACK = TUBE.upper - TUBE.rack + 0.02 // from the upper rack face out onto the lower rack's face
const HANGAR_DECK = (h) => Math.sqrt(h.radius ** 2 - h.axis ** 2)

// The station interior (M6; ISS-style modules since the M6b realism pass). Its own chunk, loaded during
// the intro (after Launch). Built from State/InteriorLayout.js (the same wall segments the planar physics
// collides with: every collider is a rack face, bulkhead or exhibit you can see). Lives in view.world at
// the station's layout position; drawn while the camera is near the station (View/Station.js), so the
// hangar shows through the open bay door and the modules through the Cupola. Parts are merged per
// material (padded wall panels, racks, fittings, metal, LED strips, laptop screens, labels).
// Exhibits' static parts (frames, lamps, light pools) are merged per material too, and every caption and
// sign shares one label atlas (draw calls). Nothing in here casts shadows: the outer hull
// (View/Station.js) keeps the sun out; it comes in only through the Cupola's glass.
// Lights: the planets' 3 beacon point lights move in here while near (no new lights, no shader
// recompiles); everything else glows (strips, screens, lamps, the hologram).
export default class StationInterior
{
    constructor(view, state)
    {
        this.view = view
        this.state = state
        this.interior = state.interior
        this.layout = state.interior.layout
        this.bridge = UIBridge.getInstance()

        this.group = new THREE.Group()
        this.group.position.copy(this.interior.station.center).add(state.planets.origin) // layout space
        this.group.visible = false
        this.view.world.add(this.group)

        this.textures = []
        this.photoScreens = []
        this.crewModels = []
        this.hologramBodies = []
        this.raycaster = new THREE.Raycaster()
        this.pointer = new THREE.Vector2()
        this.hover = null
        this.wasActive = false
        this.parts = { panel: [], rack: [], floor: [], hangar: [], fittings: [], metal: [], strip: [], screens: [], labels: [] }
    }

    async load()
    {
        const env = { userData: { useEnvironment: true }, envMap: this.view.environment || this.view.environmentPlaceholder || null }
        this.materials = {
            panel: new THREE.MeshStandardMaterial({ map: this.track(this.panelTexture()), roughness: 0.9, metalness: 0, envMapIntensity: 0.55, ...env }),
            rack: new THREE.MeshStandardMaterial({ map: this.track(this.rackTexture()), roughness: 0.65, metalness: 0.08, envMapIntensity: 0.5, ...env }),
            floor: createSurfaceMaterial({ set: 'metal', scale: 0.35, color: '#6b717b', variation: 0.08, metalness: 0.8, roughness: 0.65, envMapIntensity: 0.4, ...env }),
            hangar: createSurfaceMaterial({ set: 'metal', scale: 0.3, color: '#9aa1ab', variation: 0.06, metalness: 0.75, roughness: 0.8, envMapIntensity: 0.45, ...env }),
            fittings: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.7, metalness: 0.05, envMapIntensity: 0.45, ...env }),
            metal: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.35, metalness: 0.85, envMapIntensity: 0.6, ...env }),
            trim: new THREE.MeshStandardMaterial({ color: '#2b3038', roughness: 0.4, metalness: 0.85, envMapIntensity: 0.6, ...env }),
            gold: new THREE.MeshStandardMaterial({ color: '#c9a24a', roughness: 0.3, metalness: 0.9, envMapIntensity: 0.7, ...env }),
            strip: new THREE.MeshBasicMaterial({ color: HDR('#e8fbff', 1.15) }),
            glow: new THREE.MeshBasicMaterial({ color: HDR('#7ff9ff', 1.15) }),
            warm: new THREE.MeshBasicMaterial({ color: HDR('#ffd9a8', 1.1) }),
            screens: new THREE.MeshBasicMaterial({ map: this.track(this.screenAtlas()), color: HDR('#ffffff', 0.9) }),
            labels: new THREE.MeshBasicMaterial({ map: this.track(this.labelAtlas()), transparent: true, depthWrite: false }),
            pool: new THREE.MeshBasicMaterial({ map: this.track(this.lightPoolTexture()), transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false }),
            dark: new THREE.MeshBasicMaterial({ color: '#04060b' })
        }
        this.labelRequests = []

        this.buildNode()
        for(const module of this.layout.modules)
        {
            if(module.kind === 'hangar')
                this.buildHangar(module)
            else
                this.buildModule(module)
        }
        this.buildHatches()
        this.mergeParts()
        this.buildConsole()
        this.buildSigns()
        await Promise.all([ this.buildProjects(), this.buildCertificates(), this.buildPhotos() ])
        this.buildConsoles()
        this.buildHologram()
        this.buildCrew()
        this.buildLabelAtlas()
        this.mergeTagged()
        await this.view.warm(this.group) // compiled, linked and uploaded before the intro shows it
    }

    // Static parts tagged with userData.merge (frames, lamps, light pools, captions, signs): baked into
    // the group's frame and merged per material, then removed
    mergeTagged()
    {
        this.group.updateMatrixWorld(true)
        const inverse = this.group.matrixWorld.clone().invert()
        const lists = {}
        const tagged = []
        this.group.traverse((object) =>
        {
            if(object.isMesh && object.userData.merge)
                tagged.push(object)
        })
        for(const mesh of tagged)
        {
            const geometry = finish(mesh.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, mesh.matrixWorld)))
            const name = mesh.userData.merge
            if(name !== 'atlas' && geometry.attributes.color)
                geometry.deleteAttribute('color')
            ;(lists[name] ||= []).push(geometry)
            mesh.removeFromParent()
            mesh.geometry.dispose()
        }
        for(const [ name, list ] of Object.entries(lists))
            this.add(new THREE.Mesh(mergeGeometries(list), this.materials[name]), { receive: name === 'trim' || name === 'gold' })
    }

    tag(mesh, name)
    {
        mesh.userData.merge = name
        return mesh
    }

    // Captions and signs: drawn into one atlas, one merged mesh (vertex colour = brightness)
    buildLabelAtlas()
    {
        const requests = this.labelRequests
        if(!requests.length)
            return
        const WIDTH = 1024
        const slots = requests.map((r) => Math.round(WIDTH / r.aspect))
        const height = slots.reduce((sum, h) => sum + h, 0)
        const { canvas, ctx } = createCanvas(WIDTH, height)
        ctx.clearRect(0, 0, WIDTH, height)
        let y = 0
        requests.forEach((request, i) =>
        {
            const texture = labelTexture(request.value, { ...request.options, width: WIDTH, height: slots[i], size: request.options.size * WIDTH / (request.options.width || 1024) })
            ctx.drawImage(texture.image, 0, y)
            texture.dispose()
            const geometry = new THREE.PlaneGeometry(request.width, request.width / request.aspect)
            const uv = geometry.attributes.uv
            for(let k = 0; k < uv.count; k++)
                uv.setY(k, 1 - (y + (1 - uv.getY(k)) * slots[i]) / height)
            paint(geometry, request.color)
            const mesh = new THREE.Mesh(geometry, this.materials.labels)
            request.place(mesh)
            this.add(this.tag(mesh, 'atlas'), { receive: false })
            y += slots[i]
        })
        this.materials.atlas = new THREE.MeshBasicMaterial({ map: this.track(canvasTexture(canvas)), vertexColors: true, transparent: true, depthWrite: false })
        this.labelRequests = []
    }

    add(mesh, { cast = false, receive = true } = {})
    {
        mesh.castShadow = cast
        mesh.receiveShadow = receive
        this.group.add(mesh)
        return mesh
    }

    track(texture)
    {
        this.textures.push(texture)
        return texture
    }

    // Module-space parts → layout frame, into the per-material lists
    put(list, geometry, angle)
    {
        this.parts[list].push(finish(place(geometry, angle)))
    }

    mergeParts()
    {
        for(const [ name, list ] of Object.entries(this.parts))
        {
            if(!list.length)
                continue
            // The vertex-coloured materials need a colour on every part; the others must not have one
            const coloured = name === 'fittings' || name === 'metal'
            const geometries = list.map((g) =>
            {
                if(coloured && !g.attributes.color)
                    paint(g, '#ffffff')
                if(!coloured && g.attributes.color)
                    g.deleteAttribute('color')
                return g
            })
            this.add(new THREE.Mesh(mergeGeometries(geometries), this.materials[name]), { receive: name !== 'strip' && name !== 'screens' && name !== 'labels' })
        }
        this.parts = null
    }

    // ---------- Textures (code-drawn, own work) ----------

    // Off-white padded wall panels: quilted squares, seams, velcro patches
    panelTexture()
    {
        const { canvas, ctx } = createCanvas(512, 512)
        ctx.fillStyle = '#e8e5de'
        ctx.fillRect(0, 0, 512, 512)
        for(let y = 0; y < 2; y++)
            for(let x = 0; x < 2; x++)
            {
                const g = ctx.createRadialGradient(x * 256 + 128, y * 256 + 128, 30, x * 256 + 128, y * 256 + 128, 180)
                g.addColorStop(0, 'rgba(255, 255, 255, 0.35)')
                g.addColorStop(1, 'rgba(120, 110, 95, 0.28)')
                ctx.fillStyle = g
                ctx.fillRect(x * 256 + 4, y * 256 + 4, 248, 248)
            }
        ctx.strokeStyle = 'rgba(110, 104, 92, 0.55)'
        ctx.lineWidth = 3
        ctx.setLineDash([ 10, 6 ])
        for(const p of [ 4, 252, 260, 508 ])
        {
            ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, 512); ctx.stroke()
            ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(512, p); ctx.stroke()
        }
        ctx.setLineDash([])
        ctx.fillStyle = '#d2cbbd'
        for(const [ x, y ] of [ [ 60, 90 ], [ 330, 380 ], [ 400, 120 ], [ 150, 330 ] ])
            ctx.fillRect(x, y, 34, 22)
        ctx.fillStyle = '#9a958c'
        for(const [ x, y ] of [ [ 20, 20 ], [ 236, 20 ], [ 20, 236 ], [ 236, 236 ], [ 276, 276 ], [ 492, 492 ] ])
        {
            ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill()
        }
        return canvasMap(canvas)
    }

    // Equipment racks (1 m per repeat): panels, switch plates, knobs, small displays, bolts
    rackTexture()
    {
        const { canvas, ctx } = createCanvas(512, 512)
        ctx.fillStyle = '#d6d5cf'
        ctx.fillRect(0, 0, 512, 512)
        ctx.strokeStyle = '#8f8d86'
        ctx.lineWidth = 4
        ctx.strokeRect(2, 2, 508, 508)
        ctx.strokeRect(2, 2, 508, 250)
        ctx.lineWidth = 2
        ctx.strokeRect(24, 280, 220, 200)
        ctx.strokeRect(268, 280, 220, 200)
        ctx.fillStyle = '#3a3f47'
        ctx.fillRect(40, 40, 170, 70)
        ctx.fillStyle = '#5d8f7a'
        ctx.fillRect(48, 48, 60, 24)
        ctx.fillStyle = '#2c3138'
        for(let i = 0; i < 6; i++)
            ctx.fillRect(250 + i * 38, 50, 22, 40)
        ctx.fillStyle = '#c9a54a'
        for(let i = 0; i < 4; i++)
        {
            ctx.beginPath(); ctx.arc(70 + i * 46, 170, 12, 0, Math.PI * 2); ctx.fill()
        }
        ctx.fillStyle = '#b8b6af'
        ctx.fillRect(300, 140, 170, 80)
        ctx.fillStyle = '#e0b43c'
        for(let i = 0; i < 8; i++)
            ctx.fillRect(300 + i * 22, 230, 11, 10)
        ctx.fillStyle = '#7c7a74'
        for(const [ x, y ] of [ [ 12, 12 ], [ 500, 12 ], [ 12, 500 ], [ 500, 500 ], [ 12, 262 ], [ 500, 262 ] ])
        {
            ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill()
        }
        ctx.fillStyle = '#9b9992'
        ctx.fillRect(110, 370, 50, 14)
        ctx.fillRect(354, 370, 50, 14)
        return canvasMap(canvas)
    }

    // Four small screens (laptops / monitors): telemetry plots, a schematic, a checklist, a terminal
    screenAtlas()
    {
        const { canvas, ctx } = createCanvas(512, 256)
        ctx.fillStyle = '#06121b'
        ctx.fillRect(0, 0, 512, 256)
        const tile = (i, draw) => { ctx.save(); ctx.translate((i % 2) * 256, Math.floor(i / 2) * 128); ctx.beginPath(); ctx.rect(4, 4, 248, 120); ctx.clip(); draw(); ctx.restore() }
        tile(0, () =>
        {
            ctx.strokeStyle = '#4fe3c1'
            ctx.lineWidth = 2
            ctx.beginPath()
            for(let x = 0; x < 248; x += 4)
                ctx.lineTo(4 + x, 64 + Math.sin(x * 0.07) * 24 + Math.sin(x * 0.21) * 8)
            ctx.stroke()
            ctx.strokeStyle = '#f2b84b'
            ctx.beginPath()
            for(let x = 0; x < 248; x += 4)
                ctx.lineTo(4 + x, 96 - x * 0.12 + Math.cos(x * 0.1) * 6)
            ctx.stroke()
        })
        tile(1, () =>
        {
            ctx.strokeStyle = '#7ff9ff'
            ctx.lineWidth = 3
            ctx.strokeRect(100, 50, 56, 32)
            for(const [ x, y, w, h ] of [ [ 40, 58, 60, 16 ], [ 156, 58, 70, 16 ], [ 120, 14, 16, 36 ], [ 120, 82, 16, 34 ] ])
                ctx.strokeRect(x, y, w, h)
        })
        tile(2, () =>
        {
            ctx.fillStyle = '#9fb3c4'
            for(let i = 0; i < 6; i++)
            {
                ctx.fillRect(40, 16 + i * 18, 150 - (i * 23) % 70, 6)
                ctx.fillStyle = i < 3 ? '#4fe3a0' : '#9fb3c4'
                ctx.fillRect(16, 14 + i * 18, 10, 10)
                ctx.fillStyle = '#9fb3c4'
            }
        })
        tile(3, () =>
        {
            ctx.fillStyle = '#5dff9b'
            for(let i = 0; i < 7; i++)
                ctx.fillRect(14 + (i % 3) * 12, 14 + i * 15, 60 + (i * 37) % 140, 5)
        })
        return canvasMap(canvas, { repeat: false })
    }

    // Generic stencil labels (content/exhibits.js) in one atlas: 8 tiles of 256 × 64
    labelAtlas()
    {
        const { canvas, ctx } = createCanvas(1024, 128)
        ctx.clearRect(0, 0, 1024, 128)
        const labels = (exhibits.labels || []).slice(0, 8)
        labels.forEach((label, i) =>
        {
            const x = (i % 4) * 256
            const y = Math.floor(i / 4) * 64
            ctx.fillStyle = i % 3 === 1 ? '#e6c33c' : '#f2f0ea'
            roundRect(ctx, x + 6, y + 8, 244, 48, 6)
            ctx.fill()
            ctx.fillStyle = '#1b1d21'
            ctx.font = `700 26px ${MONO}`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(label, x + 128, y + 33, 228)
        })
        this.labelCount = labels.length
        return canvasMap(canvas, { repeat: false })
    }

    // A quad (module space, on a plane facing −u or +u) showing tile `i` of an atlas
    tileQuad(atlas, i, u, y, v, width, height, facing)
    {
        const geometry = new THREE.PlaneGeometry(width, height)
        const [ cols, rows ] = atlas === 'labels' ? [ 4, 2 ] : [ 2, 2 ]
        const col = i % cols
        const row = Math.floor(i / cols)
        const uv = geometry.attributes.uv
        for(let k = 0; k < uv.count; k++)
            uv.setXY(k, (col + uv.getX(k)) / cols, 1 - (row + 1 - uv.getY(k)) / rows)
        geometry.rotateY(facing > 0 ? - Math.PI / 2 : Math.PI / 2) // face +u (module x = −u) or −u
        geometry.translate(- u, y, v)
        return geometry
    }

    // ---------- Node ----------

    buildNode()
    {
        const circum = NODE.inradius / Math.cos(Math.PI / NODE.sides)
        // Deck and ceiling (octagons), a light ring over the hologram, strips along the ceiling's edge
        const deck = new THREE.CircleGeometry(circum, NODE.sides, Math.PI / NODE.sides)
        deck.rotateX(- Math.PI / 2)
        this.parts.floor.push(finish(deck))
        const ceiling = new THREE.CircleGeometry(circum, NODE.sides, Math.PI / NODE.sides)
        ceiling.rotateX(Math.PI / 2)
        ceiling.translate(0, NODE.height, 0)
        this.parts.panel.push(finish(ceiling))
        const ring = new THREE.TorusGeometry(2.6, 0.06, 6, 64)
        ring.rotateX(Math.PI / 2)
        ring.translate(0, NODE.height - 0.05, 0)
        this.parts.strip.push(finish(ring))

        const h = NODE_HALF_FACE
        for(let k = 0; k < NODE.sides; k++)
        {
            const angle = k * 360 / NODE.sides
            const hatch = this.layout.hatches.find((item) => item.angle === angle)
            const open = hatch?.open
            this.put('panel', shapeAt(faceShape(h, NODE.height, !!open), NODE.inradius, { facing: - 1, uvScale: 1.25 }), angle)
            // Ceiling-edge strip and a handrail below it
            this.put('strip', moduleBox(- h + 0.3, NODE.height - 0.32, NODE.inradius - 0.06, h - 0.3, NODE.height - 0.26, NODE.inradius - 0.02), angle)
            if(!hatch)
            {
                // Rack bank across the face (trapezoid: its front ends on the neighbouring faces)
                const out = h + RACK_BANK * Math.tan(2 * Math.PI / NODE.sides)
                const front = NODE.inradius - RACK_BANK
                const face = new THREE.PlaneGeometry(out * 2, 2.6)
                const uv = face.attributes.uv
                for(let i = 0; i < uv.count; i++)
                    uv.setXY(i, uv.getX(i) * out * 2, uv.getY(i) * 2.6)
                face.rotateY(Math.PI)
                face.translate(0, 1.3, front)
                this.put('rack', face, angle)
                this.put('rack', this.trapezoid(out, h, front, NODE.inradius, 2.6), angle)
                // Stowage bags on top, labels on the front
                this.put('fittings', moduleBox(- 1.4, 2.6, front + 0.05, - 0.4, 3.1, NODE.inradius - 0.02, { color: '#e3dccb' }), angle)
                this.put('fittings', moduleBox(0.3, 2.6, front + 0.05, 1.6, 3.0, NODE.inradius - 0.02, { color: '#d9d2bf' }), angle)
                this.put('fittings', moduleBox(- 1.42, 2.82, front + 0.03, - 0.38, 2.86, NODE.inradius - 0.01, { color: '#6b6656' }), angle)
                this.put('labels', this.labelFacing(k % this.labelCount, 0, 0.45, front - 0.01, 0.9, 0.225), angle)
            }
            else
            {
                // Handrails either side of the hatch
                for(const side of [ - 1, 1 ])
                {
                    const rail = new THREE.CylinderGeometry(0.025, 0.025, 1.6, 6)
                    rail.translate(- side * (HATCH_HALF + 0.55), 1.4, NODE.inradius - 0.09)
                    this.put('fittings', paint(rail, '#cbb98a'), angle)
                }
            }
        }
    }

    // Top of a rack bank: front edge (half width `front`) to the wall (half width `back`)
    trapezoid(frontHalf, backHalf, v0, v1, y)
    {
        const geometry = new THREE.BufferGeometry()
        const p = [ frontHalf, y, v0, - frontHalf, y, v0, - backHalf, y, v1, frontHalf, y, v0, - backHalf, y, v1, backHalf, y, v1 ]
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(p, 3))
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(p.filter((_, i) => i % 3 !== 1).map((value) => value * 0.5), 2))
        geometry.computeVertexNormals()
        return geometry
    }

    // A label tile on a face looking −v (toward the Node centre)
    labelFacing(i, u, y, v, width, height)
    {
        const geometry = new THREE.PlaneGeometry(width, height)
        const col = i % 4
        const row = Math.floor(i / 4)
        const uv = geometry.attributes.uv
        for(let k = 0; k < uv.count; k++)
            uv.setXY(k, (col + uv.getX(k)) / 4, 1 - (row + 1 - uv.getY(k)) / 2)
        geometry.rotateY(Math.PI)
        geometry.translate(- u, y, v)
        return geometry
    }

    // ---------- Hatches (frames on both sides, the passage through the bulkhead) ----------

    buildHatches()
    {
        for(const hatch of this.layout.hatches)
        {
            if(!hatch.open)
            {
                // Closed: the hatch door shut, its hand wheel
                const door = new THREE.Shape()
                door.moveTo(- HATCH_HALF, 0)
                door.absarc(0, HATCH.centre, HATCH.radius, Math.atan2(- HATCH.centre, - HATCH_HALF), Math.atan2(- HATCH.centre, HATCH_HALF), true)
                door.lineTo(- HATCH_HALF, 0)
                this.put('fittings', paint(shapeAt(door, NODE.inradius - 0.03, { facing: - 1 }), '#cfd3d8'), hatch.angle)
                this.put('metal', paint(hoop(0.35, 0.04, 1.3, NODE.inradius - 0.1), '#8d949e'), hatch.angle)
                this.put('metal', paint(hoop(HATCH.radius + 0.06, 0.09, HATCH.centre, NODE.inradius - 0.04, { yMin: 0 }), '#9aa0a8'), hatch.angle)
                continue
            }
            const v0 = NODE.inradius
            const v1 = MODULE_START
            this.put('panel', inward(tubeArc(HATCH.radius, HATCH.centre, v0, v1, { yMin: 0, segments: 40, uvScale: 1.25 })), hatch.angle)
            this.put('floor', moduleBox(- HATCH_HALF, - 0.1, v0, HATCH_HALF, 0, v1), hatch.angle)
            for(const v of [ v0 - 0.03, v1 + 0.03 ])
                this.put('metal', paint(hoop(HATCH.radius + 0.07, 0.09, HATCH.centre, v, { yMin: 0 }), '#a7adb5'), hatch.angle)
            // Latches round the frame (Node side)
            for(let i = 0; i < 6; i++)
            {
                const a = Math.PI * (0.15 + i * 0.14)
                const latch = new THREE.BoxGeometry(0.12, 0.2, 0.08)
                latch.rotateZ(a)
                latch.translate(Math.cos(a) * (HATCH.radius + 0.22), HATCH.centre + Math.sin(a) * (HATCH.radius + 0.22), v0 - 0.06)
                this.put('metal', paint(latch, '#5b616b'), hatch.angle)
            }
        }
    }

    // ---------- Cylindrical modules (and the Cupola's short module) ----------

    buildModule(module)
    {
        const { angle, start, end, hull, id } = module
        const R = TUBE.radius
        const A = TUBE.axis
        const cupola = module.kind === 'cupola'

        // Deck plates, the bulkhead with the hatch, the ceiling (padded), back wall
        this.put('floor', moduleBox(- TUBE_DECK, - 0.1, start, TUBE_DECK, 0, hull), angle)
        this.put('panel', shapeAt(bulkheadShape(R, A, 'hatch'), start, { uvScale: 1.25 }), angle)
        if(cupola)
        {
            this.put('panel', inward(tubeArc(R, A, start, end, { yMin: 0, uvScale: 1.25 })), angle)
            this.buildCupola(module)
            return
        }
        this.put('panel', inward(tubeArc(R, A, start, hull, { yMin: TUBE.upperTop, uvScale: 1.25 })), angle)
        this.put('panel', shapeAt(bulkheadShape(R, A), hull, { facing: - 1, uvScale: 1.25 }), angle)

        // Racks: lower fronts (the walls you walk along), upper faces (exhibits hang here), a fascia
        for(const side of [ - 1, 1 ])
        {
            const s = side
            this.put('rack', moduleBox(s * TUBE.rack, 0, start, s * (TUBE.upper + 0.02), TUBE.rackTop, hull, { uvScale: 1 }), angle)
            this.put('rack', moduleBox(s * TUBE.upper, TUBE.rackTop, start, s * (TUBE.upper + 0.1), TUBE.upperTop, hull, { uvScale: 1 }), angle)
            this.put('fittings', moduleBox(s * TUBE.upper, TUBE.upperTop, start, s * (TUBE.upper + 0.12), TUBE.upperTop + 0.06, hull, { color: '#c9c6bd' }), angle)
            // Cable bundles where the racks meet the ceiling, a handrail along the ceiling
            this.put('fittings', rod(s * 1.9, 2.66, start + 0.1, hull - 0.1, 0.045, '#2b2e33'), angle)
            this.put('fittings', rod(s * 1.83, 2.73, start + 0.1, hull - 0.1, 0.03, '#45403a'), angle)
            this.put('fittings', rod(s * 1.76, 2.79, start + 0.3, hull - 0.3, 0.022, '#6a3b2c'), angle)
            this.put('fittings', rod(s * 0.48, 3.6, start + 0.5, hull - 0.5, 0.022, '#cbb98a'), angle)
            for(let v = start + 0.7; v < hull - 0.5; v += 1.5)
                this.put('fittings', moduleBox(s * 0.46, 3.6, v - 0.03, s * 0.5, 3.66, v + 0.03, { color: '#8f8d86' }), angle)
        }
        // Back wall: a rack bank (its face is the collider) with stowage bags
        this.put('rack', moduleBox(- TUBE.rack, 0, end, TUBE.rack, TUBE.upperTop, hull, { uvScale: 1 }), angle)
        this.put('fittings', moduleBox(- 1.2, 1.2, end - 0.16, - 0.2, 1.9, end, { color: '#e3dccb' }), angle)
        this.put('fittings', moduleBox(0.25, 1.1, end - 0.14, 1.25, 1.75, end, { color: '#d6cfbc' }), angle)
        this.put('fittings', moduleBox(- 1.22, 1.5, end - 0.18, - 0.18, 1.54, end, { color: '#6b6656' }), angle)
        this.put('labels', this.labelFacing((angle / 45 + 3) % this.labelCount, 0.75, 2.15, end - 0.01, 0.8, 0.2), angle)

        // Ceiling LED strips
        for(const side of [ - 1, 1 ])
        {
            const theta = Math.PI + side * 0.42
            const u = - (R - 0.06) * Math.sin(theta)
            const y = A - (R - 0.06) * Math.cos(theta)
            const strip = moduleBox(u - 0.07, y - 0.02, start + 0.3, u + 0.07, y + 0.02, hull - 0.3)
            strip.translate(u, - y, 0).rotateZ(side * 0.42).translate(- u, y, 0) // tangent to the ceiling (module x = −u)
            this.put('strip', strip, angle)
        }
        // Rings every 2 m (structure), a label on the lower racks every few metres
        for(let v = start + 2; v < hull - 0.5; v += 2)
            this.put('metal', paint(hoop(R - 0.03, 0.03, A, v, { yMin: TUBE.upperTop + 0.1 }), '#b8bcc2'), angle)
        let label = angle / 45
        for(let v = start + 1.2; v < end - 0.4; v += 2.6, label++)
            for(const side of [ - 1, 1 ])
                this.put('labels', this.tileQuad('labels', (label + (side > 0 ? 1 : 0)) % this.labelCount, side * (TUBE.rack - 0.01), 0.55, v, 0.64, 0.16, - side), angle)

        // Between the exhibits on the upper racks: stowage bags and wall laptops (where there's room)
        const exhibitsHere = this.layout.exhibits.filter((e) => e.room === id)
        const frame = moduleFrame(angle)
        for(const side of [ - 1, 1 ])
        {
            const spans = exhibitsHere.map((e) => ({ e, local: frame.local(e.x, e.z) })).filter((x) => Math.sign(x.local.u) === side).map((x) => [ x.local.v - x.e.width / 2 - 0.2, x.local.v + x.e.width / 2 + 0.2 ]).sort((a, b) => a[0] - b[0])
            const desk = this.layout.desks.find((d) => d.room === id && Math.sign(d.u0 + d.u1) === side)
            const busy = desk ? [ ...spans, [ desk.v0, desk.v1 ] ] : spans
            busy.sort((a, b) => a[0] - b[0])
            let cursor = start + 0.35
            let count = 0
            for(const [ a, b ] of [ ...busy, [ end - 0.25, end ] ])
            {
                for(let v = cursor; v + 0.8 <= a; v += 1.0, count++)
                    this.wallItem(angle, side, v + 0.4, count + (side > 0 ? 1 : 0))
                cursor = Math.max(cursor, b)
            }
        }
    }

    // A stowage bag (strapped) or a wall-mounted laptop at v on the upper rack face
    wallItem(angle, side, v, index)
    {
        const face = side * TUBE.upper
        const inward = - side
        if(index % 2 === 0)
        {
            const y = 1.55 + (index % 3) * 0.12
            this.put('fittings', moduleBox(face, y - 0.3, v - 0.32, face + inward * 0.14, y + 0.3, v + 0.32, { color: index % 4 ? '#e4ddcc' : '#d7d9dc' }), angle)
            this.put('fittings', moduleBox(face + inward * 0.12, y - 0.31, v - 0.34, face + inward * 0.15, y + 0.31, v - 0.27, { color: '#5e5a4c' }), angle)
            this.put('fittings', moduleBox(face + inward * 0.12, y - 0.31, v + 0.27, face + inward * 0.15, y + 0.31, v + 0.34, { color: '#5e5a4c' }), angle)
        }
        else
        {
            this.put('metal', moduleBox(face, 1.42, v - 0.3, face + inward * 0.06, 1.86, v + 0.3, { color: '#2a2d33' }), angle)
            this.put('screens', this.tileQuad('screens', index % 4, face + inward * 0.065, 1.64, v, 0.54, 0.36, inward), angle)
        }
        // A short handhold beside it
        const hold = new THREE.CylinderGeometry(0.022, 0.022, 0.7, 6)
        hold.translate(- (face + inward * 0.07), 1.6, v + 0.42)
        this.put('fittings', paint(hold, '#cbb98a'), angle)
    }

    // The Cupola: the sill round the dome (the dome, its windows and frames are the exterior's:
    // View/Station.js), the deck out to the sill, a handrail
    buildCupola(module)
    {
        const { angle, end } = module
        const deck = new THREE.CircleGeometry(CUPOLA.sill + 0.05, 24, Math.PI, Math.PI)
        deck.rotateX(- Math.PI / 2)
        deck.translate(0, 0, end)
        this.put('floor', deck, angle)
        const sill = new THREE.CylinderGeometry(CUPOLA.sill, CUPOLA.sill, CUPOLA.sillHeight, 32, 1, true, - Math.PI / 2, Math.PI)
        sill.translate(0, CUPOLA.sillHeight / 2, end)
        this.put('fittings', paint(inward(sill), '#dcd9d2'), angle)
        const top = new THREE.RingGeometry(CUPOLA.sill, CUPOLA.sill + 0.18, 32, 1, Math.PI, Math.PI) // the half toward the dome
        top.rotateX(- Math.PI / 2)
        top.translate(0, CUPOLA.sillHeight, end)
        this.put('fittings', paint(top, '#c9c6bd'), angle)
        const rail = new THREE.TorusGeometry(CUPOLA.sill - 0.08, 0.025, 6, 32, Math.PI)
        rail.rotateX(Math.PI / 2) // the half toward the dome
        rail.translate(0, 1.05, end)
        this.put('fittings', paint(rail, '#cbb98a'), angle)
        for(const a of [ - 1.2, 0, 1.2 ])
        {
            const post = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6)
            post.translate(Math.sin(a) * (CUPOLA.sill - 0.08), CUPOLA.sillHeight + 0.3, end + Math.cos(a) * (CUPOLA.sill - 0.08))
            this.put('fittings', paint(post, '#8f8d86'), angle)
        }
    }

    // ---------- Hangar (the large docking module) ----------

    buildHangar(module)
    {
        const { angle, start, end, radius, axis, wall } = module
        const deck = HANGAR_DECK(module)
        this.put('floor', moduleBox(- deck, - 0.1, start, deck, 0, end), angle)
        this.put('hangar', inward(tubeArc(radius, axis, start, end, { yMin: 0, segments: 64 })), angle)
        this.put('hangar', shapeAt(bulkheadShape(radius, axis, 'hatch'), start), angle)
        this.put('hangar', shapeAt(bulkheadShape(radius, axis, this.layout.hangar.bay), end, { facing: - 1 }), angle)
        for(let v = start + 1.2; v < end - 0.5; v += 2.6)
            this.put('metal', paint(hoop(radius - 0.06, 0.08, axis, v, { yMin: 0, segments: 64 }), '#6b7079'), angle)
        for(const side of [ - 1, 1 ])
        {
            const theta = Math.PI + side * 0.3
            const u = - (radius - 0.12) * Math.sin(theta)
            const y = axis - (radius - 0.12) * Math.cos(theta)
            this.put('strip', moduleBox(u - 0.1, y - 0.03, start + 0.6, u + 0.1, y + 0.03, end - 0.6), angle)

            // Shelving along the wall (its fronts are the collider): uprights, three shelves, crates
            const f = side * wall
            const back = side * (wall + 0.45)
            for(let v = start + 0.3; v <= end - 0.2; v += 1.55)
                this.put('metal', moduleBox(f, 0, v - 0.04, back, 2.45, v + 0.04, { color: '#5b616b' }), angle)
            for(const y of [ 0.08, 0.85, 1.65, 2.4 ])
                this.put('metal', moduleBox(f, y - 0.03, start + 0.3, back, y + 0.03, end - 0.2, { color: '#7b828c' }), angle)
            let n = 0
            for(let v = start + 0.45; v < end - 0.6; v += 0.78, n++)
                for(const [ y, height ] of [ [ 0.11, 0.55 ], [ 0.88, 0.5 ], [ 1.68, 0.42 ] ])
                {
                    if((n * 7 + y * 10) % 5 < 1.2)
                        continue
                    const colors = [ '#d9d6cf', '#8e969f', '#c46a2c', '#e3dccb', '#5b6f86' ]
                    this.put('fittings', moduleBox(f + side * 0.05, y, v, f + side * 0.42, y + height - ((n % 3) * 0.06), v + 0.62, { color: colors[(n + Math.round(y * 3)) % colors.length] }), angle)
                }
        }
        // Hazard stripes along the bay
        for(let u = - this.layout.hangar.bay.half + 0.3; u < this.layout.hangar.bay.half - 0.3; u += 0.9)
            this.put('fittings', moduleBox(u, 0.002, end - 0.9, u + 0.45, 0.014, end - 0.4, { color: '#d9a21b' }), angle)
        this.put('labels', this.labelFacing(4 % this.labelCount, - 3.2, 3.2, end - 0.02, 1.4, 0.35), angle)
    }

    // Hangar pad, its warm ring, the console (destination picker) touching the pad
    buildConsole()
    {
        const { pad, console: desk } = this.layout.hangar
        const top = new THREE.Mesh(new THREE.CylinderGeometry(pad.r, pad.r + 0.12, pad.height, 48), this.materials.trim)
        top.position.set(pad.x, pad.height / 2, pad.z)
        this.add(this.tag(top, 'trim'))
        const ring = new THREE.Mesh(new THREE.TorusGeometry(pad.r - 0.35, 0.05, 6, 64), this.materials.warm)
        ring.rotation.x = Math.PI / 2
        ring.position.set(pad.x, pad.height + 0.01, pad.z)
        this.add(this.tag(ring, 'warm'), { receive: false })

        // Console: a desk with a slanted screen facing the walk-up point (+X)
        const width = desk.z1 - desk.z0
        const body = new THREE.Mesh(new THREE.BoxGeometry(desk.x1 - desk.x0, 1, width), this.materials.trim)
        body.position.set((desk.x0 + desk.x1) / 2, 0.5, (desk.z0 + desk.z1) / 2)
        this.add(this.tag(body, 'trim'))
        const label = exhibits.hangar?.console
        const { canvas, ctx } = createCanvas(512, 256)
        ctx.fillStyle = '#071622'
        ctx.fillRect(0, 0, 512, 256)
        ctx.strokeStyle = 'rgba(127, 249, 255, 0.6)'
        ctx.lineWidth = 4
        roundRect(ctx, 16, 16, 480, 224, 18)
        ctx.stroke()
        if(has(label))
            text(ctx, label, 256, 96, { size: 52, weight: 700, align: 'center', color: COLORS.glow, maxWidth: 440 })
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(width - 0.1, (width - 0.1) / 2), new THREE.MeshBasicMaterial({ map: this.track(canvasTexture(canvas)), color: HDR('#ffffff', 0.95) }))
        screen.position.set(desk.x1 + 0.02, 1.25, (desk.z0 + desk.z1) / 2)
        screen.rotation.set(0, Math.PI / 2, 0)
        screen.rotateX(- 0.5)
        this.add(screen, { receive: false })
    }

    // Lit module signs above the open hatches (Node side)
    buildSigns()
    {
        for(const sign of this.layout.signs)
        {
            const name = exhibits.rooms[sign.room]
            if(!has(name))
                continue
            this.labelRequests.push({
                value: name,
                options: { size: 110, glow: COLORS.glow },
                aspect: 4,
                width: sign.width,
                color: HDR('#ffffff', 1.15),
                place: (mesh) =>
                {
                    mesh.position.set(sign.x + sign.normal[0] * 0.03, sign.y, sign.z + sign.normal[1] * 0.03)
                    mesh.rotation.y = facingAngle(sign.normal)
                }
            })
        }
    }

    // ---------- Exhibits ----------

    // Place an object on the wall at an exhibit: its local +Z faces into the module
    placeOnWall(object, exhibit, y, out = 0)
    {
        object.position.set(exhibit.x + exhibit.normal[0] * out, y, exhibit.z + exhibit.normal[1] * out)
        object.rotation.y = facingAngle(exhibit.normal)
        return object
    }

    loadTexture(src)
    {
        return new Promise((resolve) =>
        {
            if(!has(src))
                return resolve(null)
            // Decoded off the main thread (ImageBitmap), flipped like a normal texture
            new THREE.ImageBitmapLoader().setOptions({ imageOrientation: 'flipY' }).load(src, (bitmap) =>
            {
                const texture = new THREE.Texture(bitmap)
                texture.flipY = false
                texture.colorSpace = THREE.SRGBColorSpace
                texture.anisotropy = 8
                texture.needsUpdate = true
                resolve(this.track(texture))
            }, undefined, () =>
            {
                console.warn(`[StationInterior] Could not load ${src}`)
                resolve(null)
            })
        })
    }

    // Placeholder screen: the title on a dark panel (no media)
    titleTexture(title)
    {
        const { canvas, ctx } = createCanvas(1024, 576)
        ctx.fillStyle = COLORS.panel
        ctx.fillRect(0, 0, 1024, 576)
        text(ctx, title, 512, 220, { size: 72, weight: 800, align: 'center', maxWidth: 900, maxLines: 2 })
        return this.track(canvasTexture(canvas))
    }

    // A caption plate (out: from the exhibit's wall plane; captions sit on the lower rack's face)
    caption(value, width, exhibit, y, out = ON_RACK)
    {
        if(!has(value))
            return
        this.labelRequests.push({ value, options: { width: 1536, size: 78, weight: 600 }, aspect: 8, width, color: '#ffffff', place: (mesh) => this.placeOnWall(mesh, exhibit, y, out) })
    }

    // Projects module: wall screens on the upper racks (featured larger), the title under each
    async buildProjects()
    {
        const screens = this.layout.exhibits.filter((e) => e.kind === 'project')
        await Promise.all(screens.map(async (exhibit) =>
        {
            const project = visibleProjects.find((p) => p.id === exhibit.id)
            const texture = await this.loadTexture(project.media?.poster || (project.media?.type === 'image' ? project.media.src : '')) || this.titleTexture(project.title)
            const frame = new THREE.Mesh(new THREE.BoxGeometry(exhibit.width + 0.16, exhibit.height + 0.16, 0.08), this.materials.trim)
            this.add(this.tag(this.placeOnWall(frame, exhibit, exhibit.y, 0.04), 'trim'))
            const screen = new THREE.Mesh(new THREE.PlaneGeometry(exhibit.width, exhibit.height), new THREE.MeshBasicMaterial({ map: texture, color: HDR('#ffffff', 0.9) }))
            this.add(this.placeOnWall(screen, exhibit, exhibit.y, 0.085), { receive: false })
            const glow = new THREE.Mesh(new THREE.BoxGeometry(exhibit.width + 0.16, 0.035, 0.035), exhibit.featured ? this.materials.warm : this.materials.glow)
            this.add(this.tag(this.placeOnWall(glow, exhibit, exhibit.y - exhibit.height / 2 - 0.12, 0.08), exhibit.featured ? 'warm' : 'glow'), { receive: false })
            this.caption(project.title, Math.min(exhibit.width, 2.2), exhibit, exhibit.y - exhibit.height / 2 - 0.36)
        }))
    }

    // Certificates module: framed panels on the upper racks, each under a small lamp
    async buildCertificates()
    {
        const frames = this.layout.exhibits.filter((e) => e.kind === 'certificate')
        await Promise.all(frames.map(async (exhibit) =>
        {
            const item = achievements.find((a) => a.id === exhibit.id)
            const texture = await this.loadTexture(item.image) || this.titleTexture(item.title)
            const aspect = texture.image?.width ? texture.image.height / texture.image.width : exhibit.height / exhibit.width
            const height = Math.min(1.3, exhibit.width * aspect)
            const frame = new THREE.Mesh(new THREE.BoxGeometry(exhibit.width + 0.16, height + 0.16, 0.06), this.materials.gold)
            this.add(this.tag(this.placeOnWall(frame, exhibit, exhibit.y, 0.03), 'gold'))
            const image = new THREE.Mesh(new THREE.PlaneGeometry(exhibit.width, height), new THREE.MeshBasicMaterial({ map: texture, color: HDR('#ffffff', 0.85) }))
            this.add(this.placeOnWall(image, exhibit, exhibit.y, 0.065), { receive: false })
            const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.14), this.materials.warm)
            this.add(this.tag(this.placeOnWall(lamp, exhibit, Math.min(TUBE.upperTop - 0.04, exhibit.y + height / 2 + 0.16), 0.08), 'warm'), { receive: false })
            const light = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.7), this.materials.pool)
            this.add(this.tag(this.placeOnWall(light, exhibit, exhibit.y + 0.05, 0.012), 'pool'), { receive: false })
            this.caption(item.title, 1.9, exhibit, exhibit.y - height / 2 - 0.3)
        }))
    }

    lightPoolTexture()
    {
        const { canvas, ctx } = createCanvas(256, 256)
        const gradient = ctx.createRadialGradient(128, 30, 0, 128, 100, 150)
        gradient.addColorStop(0, 'rgba(255, 226, 180, 0.9)')
        gradient.addColorStop(0.5, 'rgba(255, 210, 160, 0.25)')
        gradient.addColorStop(1, 'rgba(255, 200, 150, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 256, 256)
        return canvasTexture(canvas)
    }

    // Photos module (closed while photos.js is empty): hologram screens on the desk, the photo clear
    // and true-colour, the glow only on the edges, a faint light cone, flicker-on when you come near
    async buildPhotos()
    {
        const items = this.layout.exhibits.filter((e) => e.kind === 'photo')
        if(!items.length)
            return
        this.buildDesks('photos')
        const edge = this.edgeGlowTexture()
        await Promise.all(items.map(async (exhibit) =>
        {
            const photo = photos.find((p) => p.id === exhibit.id)
            const texture = await this.loadTexture(photo.src)
            if(!texture)
                return
            const aspect = texture.image.height / texture.image.width
            const width = exhibit.width
            const height = Math.min(1.1, width * aspect)
            const holder = this.placeOnWall(new THREE.Group(), exhibit, 0, exhibit.depth / 2)
            const screen = new THREE.Group()
            screen.position.y = PHOTO_SCREEN
            const image = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 1 }))
            const glow = new THREE.Mesh(new THREE.PlaneGeometry(width + 0.36, height + 0.36), new THREE.MeshBasicMaterial({ map: edge, color: HDR('#7ff9ff', 1.2), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
            glow.position.z = - 0.01
            screen.add(glow, image)
            const coneHeight = PHOTO_SCREEN - height / 2 - DESK_HEIGHT - 0.06
            const cone = new THREE.Mesh(new THREE.CylinderGeometry(width * 0.4, 0.16, coneHeight, 24, 1, true), new THREE.MeshBasicMaterial({ color: '#7ff9ff', transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, forceSinglePass: true }))
            cone.position.y = DESK_HEIGHT + 0.04 + coneHeight / 2
            const emitter = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 0.05, 24), this.materials.glow)
            emitter.position.y = DESK_HEIGHT + 0.025
            holder.add(screen, cone, emitter)
            this.add(holder, { receive: false })
            this.photoScreens.push({ screen, image, glow, cone, exhibit, flicker: 0, seed: Math.random() * 10 })
            if(has(photo.caption))
                this.caption(photo.caption, 1.6, exhibit, DESK_HEIGHT - 0.25, 0.02)
        }))
    }

    edgeGlowTexture()
    {
        const { canvas, ctx } = createCanvas(256, 256)
        ctx.fillStyle = 'rgba(0, 0, 0, 0)'
        ctx.fillRect(0, 0, 256, 256)
        ctx.shadowColor = 'rgba(127, 249, 255, 1)'
        ctx.shadowBlur = 22
        ctx.strokeStyle = 'rgba(127, 249, 255, 0.9)'
        ctx.lineWidth = 6
        roundRect(ctx, 22, 22, 212, 212, 10)
        ctx.stroke()
        return this.track(canvasTexture(canvas))
    }

    // One continuous desk per row (exactly the obstacle the physics uses)
    buildDesks(room)
    {
        const geometries = this.layout.desks.filter((d) => d.room === room).map((d) => finish(place(moduleBox(d.u0, 0, d.v0, d.u1, DESK_HEIGHT, d.v1, { color: '#d8d6d0' }), d.angle)))
        if(geometries.length)
            this.add(new THREE.Mesh(mergeGeometries(geometries), this.materials.fittings))
    }

    // Skills module: one glowing console per skill group, on a desk along the racks
    buildConsoles()
    {
        const consoles = this.layout.exhibits.filter((e) => e.kind === 'console')
        if(!consoles.length)
            return
        this.buildDesks('skills')
        for(const exhibit of consoles)
        {
            const group = exhibit.group
            const { canvas, ctx } = createCanvas(1024, 512)
            ctx.fillStyle = '#071622'
            ctx.fillRect(0, 0, 1024, 512)
            let y = 40
            y = text(ctx, group.group.toUpperCase(), 48, y, { size: 40, weight: 700, color: COLORS.glow, font: MONO, maxWidth: 928 }) + 20
            ctx.font = `600 34px ${MONO}`
            let x = 48
            for(const item of group.items.filter(has))
            {
                const width = ctx.measureText(item).width + 44
                if(x + width > 976)
                {
                    x = 48
                    y += 66
                }
                if(y > 440)
                    break
                ctx.strokeStyle = 'rgba(127, 249, 255, 0.6)'
                ctx.lineWidth = 3
                roundRect(ctx, x, y, width, 52, 26)
                ctx.stroke()
                ctx.fillStyle = COLORS.text
                ctx.textBaseline = 'middle'
                ctx.fillText(item, x + 22, y + 27)
                x += width + 14
            }
            const holder = this.placeOnWall(new THREE.Group(), exhibit, 0, 0)
            const panel = this.tag(new THREE.Mesh(new THREE.BoxGeometry(exhibit.width - 0.1, 1.05, 0.07), this.materials.trim), 'trim')
            panel.position.set(0, 1.55, 0.2)
            panel.rotation.x = - 0.32
            const screen = new THREE.Mesh(new THREE.PlaneGeometry(exhibit.width - 0.3, 0.92), new THREE.MeshBasicMaterial({ map: this.track(canvasTexture(canvas)), color: HDR('#ffffff', 0.95) }))
            screen.position.set(0, 1.55 + 0.315 * 0.04, 0.2 + 0.949 * 0.04)
            screen.rotation.x = - 0.32
            const strip = this.tag(new THREE.Mesh(new THREE.BoxGeometry(exhibit.width - 0.2, 0.035, 0.035), this.materials.glow), 'glow')
            strip.position.set(0, DESK_HEIGHT + 0.01, exhibit.depth + 0.01)
            holder.add(panel, screen, strip)
            this.add(holder)
        }
    }

    // Node centre: the projector and a miniature Apeiron (Sun, the locations, Earth, orbit lines)
    buildHologram()
    {
        const base = new THREE.Mesh(new THREE.CylinderGeometry(PROJECTOR_RADIUS, PROJECTOR_RADIUS + 0.1, 0.6, 48), this.materials.trim)
        base.position.y = 0.3
        this.add(this.tag(base, 'trim'))
        const ring = new THREE.Mesh(new THREE.TorusGeometry(PROJECTOR_RADIUS - 0.2, 0.04, 8, 64), this.materials.glow)
        ring.rotation.x = Math.PI / 2
        ring.position.y = 0.61
        this.add(this.tag(ring, 'glow'), { receive: false })
        // Additive: one pass is enough (one program, one draw)
        const beam = new THREE.Mesh(new THREE.CylinderGeometry(HOLOGRAM_SIZE * 1.15, PROJECTOR_RADIUS - 0.3, HOLOGRAM_HEIGHT - 0.6, 48, 1, true), new THREE.MeshBasicMaterial({ color: '#7ff9ff', transparent: true, opacity: 0.045, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, forceSinglePass: true }))
        beam.position.y = 0.6 + (HOLOGRAM_HEIGHT - 0.6) / 2
        this.add(beam, { receive: false })

        this.hologram = new THREE.Group()
        this.hologram.position.y = HOLOGRAM_HEIGHT
        this.add(this.hologram, { receive: false })

        const station = new THREE.Vector3().fromArray(config.find((p) => p.id === 'station')?.center || [ 0, 0, 0 ])
        const bodies = [ ...config.map((p) => ({ id: p.id, center: new THREE.Vector3().fromArray(p.center), radius: p.mapRadius ?? p.radius, color: p.accent })), { id: 'earth', center: new THREE.Vector3().fromArray(earth.center), radius: earth.radius, color: '#5aa8ff' } ]
        const reach = Math.max(...bodies.map((b) => b.center.distanceTo(station)))
        const scale = (HOLOGRAM_SIZE - 0.15) / reach
        const material = (color, amount = 0.9) => new THREE.MeshBasicMaterial({ color: HDR(new THREE.Color(color).lerp(new THREE.Color('#7ff9ff'), 0.35), amount), transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })
        const lineMaterial = new THREE.LineBasicMaterial({ color: '#7ff9ff', transparent: true, opacity: 0.3, depthWrite: false })
        const orbitPoints = []
        for(const body of bodies)
        {
            const position = body.center.clone().sub(station).multiplyScalar(scale)
            const mesh = new THREE.Mesh(new THREE.SphereGeometry(THREE.MathUtils.clamp(body.radius * scale * 2.2, 0.08, 0.32), 24, 16), material(body.color))
            mesh.position.copy(position)
            mesh.userData.hologramId = body.id
            this.hologram.add(mesh)
            this.hologramBodies.push(mesh)
            // Orbit line: a circle round the station through the body (stylised)
            const radius = Math.hypot(position.x, position.z)
            if(radius > 0.05)
                for(let i = 0; i < 96; i++)
                    for(const k of [ i, i + 1 ])
                        orbitPoints.push(new THREE.Vector3(Math.cos(k / 96 * Math.PI * 2) * radius, position.y, Math.sin(k / 96 * Math.PI * 2) * radius))
        }
        this.hologram.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(orbitPoints), lineMaterial)) // every orbit, one draw
        const sun = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 16), new THREE.MeshBasicMaterial({ color: HDR('#ffd27a', 1.6) }))
        sun.position.fromArray(sunDirection).normalize().multiplyScalar(HOLOGRAM_SIZE)
        sun.userData.hologramId = 'sun'
        this.hologram.add(sun)
        this.hologramBodies.push(sun)
    }

    // Crew: recoloured astronauts walking their paths (State/Crew.js moves them)
    buildCrew()
    {
        const gltf = this.view.player.gltf
        if(!gltf)
            return
        for(const member of this.interior.crew)
        {
            const model = createCrewModel(gltf, PALETTES.crew, { envMap: this.view.environment || this.view.environmentPlaceholder })
            model.root.traverse((object) => { object.castShadow = false })
            this.add(model.root)
            this.crewModels.push({ member, model })
        }
    }

    // Planet beacon-light pool → interior lights while near
    placeLights()
    {
        const lights = this.view.planets.beaconLights
        this.group.updateMatrixWorld(true)
        lights.forEach((light, i) =>
        {
            const spec = this.layout.lights[i]
            light.intensity = spec ? spec.intensity : 0
            if(!spec)
                return
            light.color.set(spec.color)
            light.distance = spec.distance
            light.position.set(spec.x, spec.y, spec.z)
            this.group.localToWorld(light.position)
        })
    }

    update(stateMachine)
    {
        const interior = this.interior
        const active = this.view.station.near
        this.group.visible = active
        if(active !== this.wasActive)
        {
            this.wasActive = active
            if(active)
                this.placeLights()
        }
        if(!active)
            return

        const delta = this.state.time.delta
        const elapsed = this.state.time.elapsed

        // Hologram: slow spin, gentle bob
        this.hologram.rotation.y = elapsed * 0.12
        this.hologram.position.y = HOLOGRAM_HEIGHT + Math.sin(elapsed * 0.8) * 0.05
        this.updateHoverWith(stateMachine)

        // Photos: hover, flicker on when the visitor comes near
        const player = this.state.player.position
        for(const photo of this.photoScreens)
        {
            const centre = interior.center
            const distance = Math.hypot(player.x - centre.x - photo.exhibit.x, player.z - centre.z - photo.exhibit.z)
            const target = distance < PHOTO_FLICKER_DISTANCE ? 1 : 0.15
            photo.flicker += (target - photo.flicker) * (1 - Math.exp(- 6 * delta))
            const flick = target === 1 && photo.flicker < 0.9 ? (Math.sin(elapsed * 60 + photo.seed) > 0 ? 1 : 0.4) : 1
            photo.image.material.opacity = Math.min(1, 0.25 + photo.flicker) * flick
            photo.glow.material.opacity = photo.flicker * flick
            photo.cone.material.opacity = 0.06 * photo.flicker
            photo.screen.position.y = PHOTO_SCREEN + Math.sin(elapsed * 1.1 + photo.seed) * 0.03
        }

        // Crew: pose from State/Crew.js
        for(const { member, model } of this.crewModels)
        {
            model.root.position.set(member.x, 0, member.z)
            model.root.rotation.y = Math.atan2(member.facingX, member.facingZ)
            model.play(member.anim === 'walk' ? 'walk' : member.anim === 'wave' ? 'wave' : 'idle')
            model.update(delta)
        }
    }

    updateHoverWith(stateMachine)
    {
        let id = null
        if(stateMachine.is(StateMachine.HOLOGRAM) && this.state.controls.pointer.inside)
        {
            this.pointer.set(this.state.controls.pointer.x, - this.state.controls.pointer.y)
            this.raycaster.setFromCamera(this.pointer, this.view.camera.instance)
            id = this.raycaster.intersectObjects(this.hologramBodies, false)[0]?.object.userData.hologramId || null
        }
        if(id && id !== this.hover)
            this.bridge.emit('hologram:hover', { id })
        if(id !== this.hover)
        {
            this.hover = id
            for(const body of this.hologramBodies)
                body.scale.setScalar(body.userData.hologramId === id ? 1.35 : 1)
        }
    }
}
