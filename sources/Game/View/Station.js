import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import View from '@/View/View.js'
import State from '@/State/State.js'
import { NODE, WALL, HANGAR, TUBE, insideStation } from '@/State/InteriorLayout.js'
import { moduleBox, moduleMatrix, tubeArc, hoop, rod, paint, finish, place, canvasMap } from './StationParts.js'

const NEAR = 150 // camera closer than this: the real interior (modules, hangar) is drawn
const SKIN = 0.15 // the outer hull stands this far outside the interior's
const TRUSS = { y: 12.5, half: 34, size: 1.5, bay: 2.5 }
// Solar wings (2 pairs per side along the truss), turning about the truss axis to face the sun
const WINGS = { z: [ 22, 31 ], width: 4.4, inner: 2.6, outer: 20, swing: 0.3, speed: 0.04 }
const DOOR = { thickness: 0.16, speed: 1 / 0.9 } // the bay door rolls up in 0.9 s
const HDR = (color, amount) => new THREE.Color(color).multiplyScalar(amount)

const _local = new THREE.Vector3()
const _color = new THREE.Color()
const _matrix = new THREE.Matrix4()
const _position = new THREE.Vector3()

// Box in the layout frame from two corners, one vertex colour
function box(x0, y0, z0, x1, y1, z1, color)
{
    const geometry = new THREE.BoxGeometry(Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0))
    geometry.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)
    return paint(geometry, color)
}

function part(geometry, color, { position = [ 0, 0, 0 ], rotation = [ 0, 0, 0 ], scale = [ 1, 1, 1 ] } = {})
{
    const matrix = new THREE.Matrix4().compose(new THREE.Vector3(...position), new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)), new THREE.Vector3(...scale))
    return paint(geometry.toNonIndexed().applyMatrix4(matrix), color)
}

// Apeiron Station's exterior (M6b; ISS-inspired since the realism pass), code-built around the interior's
// modules (State/InteriorLayout.js): cylindrical modules in quilted white MLI blankets with seams,
// handrails and docking ports, the octagonal Node, the large hangar module with its rolling bay door, the
// Cupola's glass dome facing Earth, a truss over the Node with four solar wings (they track the sun) and
// radiators, a robotic arm, antennas, nav lights and the docking guide lights. Merged per material; casts
// and receives the sun's shadows (hard light, deep shadows). The interior (View/StationInterior.js) is
// drawn only near; far away the Cupola glows. Also tells the rest of the view whether the camera is near
// or inside the station (`near`, `inside`).
export default class Station
{
    constructor()
    {
        this.view = View.getInstance()
        this.state = State.getInstance()
        this.interior = this.state.interior
        this.layout = this.interior.layout
        this.station = this.interior.station

        this.group = new THREE.Group()
        this.group.position.copy(this.station.center).add(this.state.planets.origin) // layout space
        this.view.world.add(this.group)

        this.near = true
        this.inside = true
        this.door = 0
        this.parts = { mli: [], hull: [], metal: [], solar: [], glow: [], blink: [] }

        const env = { userData: { useEnvironment: true } }
        this.materials = {
            mli: new THREE.MeshStandardMaterial({ map: this.mliTexture(), roughness: 0.78, metalness: 0, envMapIntensity: 0.5, ...env }),
            hull: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0.25, envMapIntensity: 0.5, ...env }),
            metal: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, metalness: 0.85, envMapIntensity: 0.65, ...env }),
            solar: new THREE.MeshStandardMaterial({ map: this.cellTexture(), roughness: 0.32, metalness: 0.55, envMapIntensity: 0.9, side: THREE.DoubleSide, ...env }),
            glass: new THREE.MeshStandardMaterial({ color: '#a9d8ff', roughness: 0.04, metalness: 0.3, transparent: true, opacity: 0.14, depthWrite: false, side: THREE.DoubleSide, forceSinglePass: true, envMapIntensity: 1, ...env }), // faint: one pass
            glow: new THREE.MeshBasicMaterial({ vertexColors: true, color: HDR('#ffffff', 1.3) }),
            blink: new THREE.MeshBasicMaterial({ vertexColors: true }),
            window: new THREE.MeshBasicMaterial({ color: HDR('#ffd9a8', 0.9), side: THREE.BackSide }),
            guide: new THREE.MeshBasicMaterial({ color: '#ffffff' })
        }

        for(const module of this.layout.modules)
            this.buildModule(module)
        this.buildNode()
        this.buildCupola()
        this.buildTruss()
        this.buildArm()
        this.buildNavLights()
        this.mergeParts()
        this.buildWings()
        this.buildDoor()
        this.buildGuideLights()
    }

    add(mesh, parent = this.group, shadows = true)
    {
        mesh.castShadow = shadows
        mesh.receiveShadow = shadows
        parent.add(mesh)
        return mesh
    }

    put(list, geometry, angle = null)
    {
        this.parts[list].push(finish(angle === null ? geometry : place(geometry, angle)))
    }

    mergeParts()
    {
        for(const [ name, list ] of Object.entries(this.parts))
        {
            if(!list.length)
                continue
            const coloured = name !== 'mli' && name !== 'solar'
            for(const g of list)
            {
                if(coloured && !g.attributes.color)
                    paint(g, '#ffffff')
                if(!coloured && g.attributes.color)
                    g.deleteAttribute('color')
            }
            this.add(new THREE.Mesh(mergeGeometries(list), this.materials[name]), this.group, name !== 'glow' && name !== 'blink')
        }
        this.parts = null
    }

    // Quilted white MLI blankets: stitched squares, soft puffs, a few wrinkles and tape seams
    mliTexture()
    {
        const canvas = document.createElement('canvas')
        canvas.width = 512
        canvas.height = 512
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#eceae4'
        ctx.fillRect(0, 0, 512, 512)
        for(let y = 0; y < 4; y++)
            for(let x = 0; x < 4; x++)
            {
                const g = ctx.createRadialGradient(x * 128 + 60, y * 128 + 58, 10, x * 128 + 64, y * 128 + 64, 96)
                g.addColorStop(0, 'rgba(255, 255, 255, 0.5)')
                g.addColorStop(1, 'rgba(150, 146, 138, 0.35)')
                ctx.fillStyle = g
                ctx.fillRect(x * 128, y * 128, 128, 128)
            }
        ctx.strokeStyle = 'rgba(120, 116, 108, 0.6)'
        ctx.lineWidth = 2
        ctx.setLineDash([ 6, 5 ])
        for(let p = 0; p <= 512; p += 128)
        {
            ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, 512); ctx.stroke()
            ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(512, p); ctx.stroke()
        }
        ctx.setLineDash([])
        // Wrinkles
        ctx.strokeStyle = 'rgba(170, 166, 158, 0.35)'
        ctx.lineWidth = 3
        for(const [ x, y, dx, dy ] of [ [ 40, 300, 60, 20 ], [ 300, 90, - 40, 50 ], [ 380, 420, 70, - 10 ], [ 150, 170, 30, 40 ] ])
        {
            ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + dx / 2, y - 12, x + dx, y + dy); ctx.stroke()
        }
        // Tape seam
        ctx.fillStyle = 'rgba(205, 200, 188, 0.9)'
        ctx.fillRect(0, 250, 512, 12)
        const texture = canvasMap(canvas)
        return texture
    }

    // Solar cells: dark blue cells in a thin gold grid (one repeat = 1 m)
    cellTexture()
    {
        const canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 256
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#b8954a'
        ctx.fillRect(0, 0, 256, 256)
        for(let y = 0; y < 4; y++)
            for(let x = 0; x < 4; x++)
            {
                const g = ctx.createLinearGradient(x * 64, y * 64, x * 64 + 64, y * 64 + 64)
                g.addColorStop(0, '#1a2c52')
                g.addColorStop(1, '#122040')
                ctx.fillStyle = g
                ctx.fillRect(x * 64 + 3, y * 64 + 3, 58, 58)
            }
        ctx.strokeStyle = 'rgba(200, 165, 90, 0.5)'
        ctx.lineWidth = 1
        for(let p = 3; p < 256; p += 16)
        {
            ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(256, p); ctx.stroke()
        }
        return canvasMap(canvas)
    }

    // A cylindrical module's outer hull: the MLI cylinder, seams, end cap, handrails, a docking port
    buildModule(module)
    {
        const { angle, start, hull, radius, axis, kind, id } = module
        const R = radius + SKIN
        const v0 = kind === 'hangar' ? start - 0.1 : NODE.inradius // inside the Node's shell
        const v1 = kind === 'cupola' ? hull : hull + WALL
        this.put('mli', tubeArc(R, axis, v0, v1, { segments: kind === 'hangar' ? 64 : 40, uvScale: 1.4 }), angle)
        for(let v = start + 1.4; v < v1 - 0.4; v += kind === 'hangar' ? 3.2 : 2.2)
            this.put('metal', paint(hoop(R + 0.02, 0.045, axis, v, { segments: 48 }), '#b5bac1'), angle)
        this.put('metal', paint(hoop(R + 0.03, 0.08, axis, v1 - 0.05, { segments: 48 }), '#8d949e'), angle)

        // Handrails along the top (yellow-grey), with standoffs
        for(const u of [ - 0.7, 0.7 ])
        {
            this.put('hull', rod(u, axis + R + 0.14, start + 0.6, v1 - 0.6, 0.03, '#d8c690'), angle)
            for(let v = start + 0.8; v < v1 - 0.6; v += 1.3)
                this.put('hull', moduleBox(u - 0.03, axis + R - 0.02, v - 0.03, u + 0.03, axis + R + 0.14, v + 0.03, { color: '#9aa0a8' }), angle)
        }

        if(kind === 'cupola')
            return
        if(kind === 'hangar')
        {
            this.buildBay(module)
            return
        }
        // End cap and a docking port with lights (Projects, Certificates), an antenna (the others)
        const cap = new THREE.CircleGeometry(R, 40)
        cap.translate(0, axis, v1)
        this.put('mli', cap, angle)
        if(id === 'projects' || id === 'certificates')
        {
            const port = new THREE.CylinderGeometry(0.95, 1.05, 0.7, 32)
            port.rotateX(Math.PI / 2)
            port.translate(0, axis, v1 + 0.35)
            this.put('hull', paint(port, '#d9dde3'), angle)
            this.put('metal', paint(hoop(0.98, 0.06, axis, v1 + 0.72, { segments: 32 }), '#5b616b'), angle)
            for(let i = 0; i < 4; i++)
            {
                const a = i * Math.PI / 2 + Math.PI / 4
                const light = new THREE.SphereGeometry(0.07, 8, 6)
                light.translate(Math.cos(a) * 1.25, axis + Math.sin(a) * 1.25, v1 + 0.08)
                this.put('glow', paint(light, i % 2 ? '#ffffff' : '#ffb347'), angle)
            }
        }
        else
        {
            const mast = new THREE.CylinderGeometry(0.05, 0.07, 2.4, 8)
            mast.translate(0.8, axis + R + 1.1, hull - 0.8)
            this.put('metal', paint(mast, '#9aa0a8'), angle)
        }
    }

    // The hangar's bay end: the outer bulkhead round the opening, a dark frame, hazard stripes
    buildBay(module)
    {
        const { angle, end, radius, axis } = module
        const R = radius + SKIN
        const { half, height } = HANGAR.bay
        const shape = new THREE.Shape()
        shape.absarc(0, axis, R, 0, Math.PI * 2, false)
        const hole = new THREE.Path()
        hole.moveTo(- half, 0)
        hole.lineTo(half, 0)
        hole.lineTo(half, height)
        hole.lineTo(- half, height)
        hole.lineTo(- half, 0)
        shape.holes.push(hole)
        const disc = new THREE.ShapeGeometry(shape, 48)
        disc.translate(0, 0, end + WALL)
        this.put('mli', disc, angle)
        // Under the deck: the bay opening's sill, frame round the opening (through the bulkhead)
        const frame = '#2b3038'
        this.put('metal', moduleBox(- half - 0.35, height, end - 0.02, half + 0.35, height + 0.35, end + WALL + 0.12, { color: frame }), angle)
        this.put('metal', moduleBox(- half - 0.35, - 0.3, end - 0.02, - half, height, end + WALL + 0.12, { color: frame }), angle)
        this.put('metal', moduleBox(half, - 0.3, end - 0.02, half + 0.35, height, end + WALL + 0.12, { color: frame }), angle)
        this.put('metal', moduleBox(- half, - 0.3, end - 0.02, half, 0, end + WALL + 0.12, { color: '#3a3f47' }), angle)
        for(let u = - half; u < half - 0.3; u += 0.9)
            this.put('hull', moduleBox(u, height + 0.42, end + WALL + 0.1, u + 0.45, height + 0.78, end + WALL + 0.16, { color: '#ffcc33' }), angle)
    }

    // The Node: an octagonal shell over the interior's, roof plates, a zenith docking port with lights,
    // and an antenna dish pointing at Earth
    buildNode()
    {
        const circum = (NODE.inradius + 0.3) / Math.cos(Math.PI / NODE.sides)
        const shell = new THREE.CylinderGeometry(circum, circum, NODE.height + 1.0, NODE.sides, 1, false, Math.PI * 3 / 8)
        const uv = shell.attributes.uv
        for(let i = 0; i < uv.count; i++)
            uv.setXY(i, uv.getX(i) * circum * 2 * Math.PI / 1.4, uv.getY(i) * (NODE.height + 1) / 1.4)
        shell.translate(0, NODE.height / 2, 0)
        this.put('mli', shell)
        const roof = NODE.height + 0.5
        this.put('hull', part(new THREE.CylinderGeometry(circum - 0.6, circum - 0.1, 0.35, NODE.sides, 1, false, Math.PI * 3 / 8), '#dfe3e8', { position: [ 0, roof + 0.17, 0 ] }))
        this.put('hull', part(new THREE.CylinderGeometry(1.3, 1.4, 1.1, 32), '#d9dde3', { position: [ 0, roof + 0.9, 0 ] }))
        this.put('metal', part(new THREE.TorusGeometry(1.32, 0.07, 6, 32), '#5b616b', { position: [ 0, roof + 1.45, 0 ], rotation: [ Math.PI / 2, 0, 0 ] }))
        for(let i = 0; i < 4; i++)
        {
            const a = i * Math.PI / 2
            this.put('glow', part(new THREE.SphereGeometry(0.08, 8, 6), i % 2 ? '#ffffff' : '#ffb347', { position: [ Math.cos(a) * 1.75, roof + 0.4, Math.sin(a) * 1.75 ] }))
        }
        // Mast to the truss, an antenna dish facing Earth (+X, down)
        this.put('metal', box(- 0.35, roof + 1.45, - 0.35, 0.35, TRUSS.y - TRUSS.size / 2, 0.35, '#6b7079'))
        this.put('metal', part(new THREE.CylinderGeometry(0.1, 0.12, 2.2, 10), '#9aa0a8', { position: [ 3.2, roof + 1.1, 2.6 ] }))
        this.put('hull', part(new THREE.CylinderGeometry(1.2, 0.2, 0.35, 32), '#eef0f3', { position: [ 3.6, roof + 2.2, 2.6 ], rotation: [ 0, 0, - 1.25 ] }))
    }

    // The Cupola's dome: glass and the seven-window frames (a round top window, six round it), on the
    // Cupola module's end facing Earth; a warm glow inside stands in for the interior far away
    buildCupola()
    {
        const module = this.layout.modules.find((m) => m.kind === 'cupola')
        if(!module)
            return
        const { angle, end, axis } = module
        const R = TUBE.radius + 0.05
        const dome = new THREE.SphereGeometry(R, 48, 20, 0, Math.PI * 2, 0, Math.PI / 2)
        dome.rotateX(Math.PI / 2) // pole along +v
        dome.translate(0, axis, end)
        const glass = this.add(new THREE.Mesh(finish(place(dome, angle)), this.materials.glass), this.group, false)
        glass.renderOrder = 2

        const frame = '#c9ced6'
        const top = 0.48 // polar angle of the top window's frame
        const ringAt = (polar, tube) =>
        {
            const ring = new THREE.TorusGeometry(R * Math.sin(polar), tube, 6, 48)
            ring.translate(0, 0, R * Math.cos(polar))
            ring.translate(0, axis, end)
            return ring
        }
        this.put('hull', paint(ringAt(top, 0.07), frame), angle)
        this.put('hull', paint(ringAt(Math.PI / 2 - 0.02, 0.13), frame), angle)
        for(let i = 0; i < 6; i++)
        {
            const a = i * Math.PI / 3 + Math.PI / 6
            const points = []
            for(let k = 0; k <= 8; k++)
            {
                const polar = top + (Math.PI / 2 - top) * k / 8
                points.push(new THREE.Vector3(R * Math.sin(polar) * Math.cos(a), axis + R * Math.sin(polar) * Math.sin(a), end + R * Math.cos(polar)))
            }
            this.put('hull', paint(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 12, 0.06, 6), frame), angle)
        }
        // Far away: a warm glow behind the glass (the interior is not drawn then)
        const inside = new THREE.SphereGeometry(R - 0.25, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2)
        inside.rotateX(Math.PI / 2)
        inside.translate(0, axis, end - 0.1)
        this.windowGlow = this.add(new THREE.Mesh(finish(place(inside, angle)), this.materials.window), this.group, false)
    }

    // The truss over the Node along Z (four longerons, cross members), joints by the wings, radiators
    buildTruss()
    {
        const { y, half, size, bay } = TRUSS
        const h = size / 2
        const steel = '#8d949e'
        for(const [ a, b ] of [ [ - h, - h ], [ - h, h ], [ h, - h ], [ h, h ] ])
            this.put('metal', box(a - 0.07, y + b - 0.07, - half, a + 0.07, y + b + 0.07, half, steel))
        for(let z = - half; z <= half + 1e-6; z += bay)
        {
            this.put('metal', box(- h - 0.05, y - h, z - 0.05, - h + 0.05, y + h, z + 0.05, steel))
            this.put('metal', box(h - 0.05, y - h, z - 0.05, h + 0.05, y + h, z + 0.05, steel))
            this.put('metal', box(- h, y - h - 0.05, z - 0.05, h, y - h + 0.05, z + 0.05, steel))
            this.put('metal', box(- h, y + h - 0.05, z - 0.05, h, y + h + 0.05, z + 0.05, steel))
        }
        for(const side of [ - 1, 1 ])
        {
            this.put('metal', part(new THREE.CylinderGeometry(1.1, 1.1, 1.6, 24), '#5b616b', { position: [ 0, y, side * (WINGS.z[0] - 3.2) ], rotation: [ Math.PI / 2, 0, 0 ] }))
            // Radiators: white slatted panels off the truss (+X), edge-on to the sun
            for(let i = 0; i < 3; i++)
            {
                const z0 = side * (9 + i * 3)
                this.put('hull', box(h + 0.2, y - 0.05, z0, h + 9, y + 0.05, z0 + side * 2.6, i % 2 ? '#e8ebef' : '#dde1e6'))
                for(let x = h + 1; x < h + 9; x += 1.4)
                    this.put('metal', box(x, y + 0.05, z0, x + 0.08, y + 0.1, z0 + side * 2.6, '#aab0b8'))
            }
            this.put('metal', box(h, y - 0.12, side * 8.6, h + 9, y + 0.12, side * 8.9, '#9aa0a8'))
        }
    }

    // Robotic arm on the Projects module: base, two booms, elbow, wrist and end effector (a static pose)
    buildArm()
    {
        const module = this.layout.modules.find((m) => m.id === 'projects')
        if(!module)
            return
        const { angle, axis, radius } = module
        const top = axis + radius + SKIN
        const base = new THREE.Vector3(0, top, module.start + 2.5)
        const elbow = new THREE.Vector3(1.2, top + 5.2, module.start + 6.5)
        const wrist = new THREE.Vector3(2.0, top + 2.6, module.end - 0.5)
        const boom = (a, b, r, color) =>
        {
            const length = a.distanceTo(b)
            const geometry = new THREE.CylinderGeometry(r, r, length, 16)
            geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()))
            geometry.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2)
            return paint(geometry, color)
        }
        const joint = (p, r) => paint(new THREE.SphereGeometry(r, 16, 10).translate(p.x, p.y, p.z), '#4a4f57')
        const local = (p) => _position.set(- p.x, p.y, p.z).clone() // module space x = −u
        this.put('metal', boom(local(base), local(elbow), 0.22, '#e6e8eb'), angle)
        this.put('metal', boom(local(elbow), local(wrist), 0.2, '#e6e8eb'), angle)
        this.put('metal', joint(local(base), 0.38), angle)
        this.put('metal', joint(local(elbow), 0.34), angle)
        this.put('metal', joint(local(wrist), 0.3), angle)
        const effector = new THREE.CylinderGeometry(0.22, 0.28, 0.7, 16)
        effector.translate(- wrist.x, wrist.y - 0.5, wrist.z)
        this.put('metal', paint(effector, '#9aa0a8'), angle)
        this.put('metal', paint(moduleBox(- 0.5, top - 0.05, base.z - 0.5, 0.5, top + 0.2, base.z + 0.5), '#5b616b'), angle)
    }

    // Red / green at the truss ends, white strobes on the hangar and the Projects module, a red beacon
    buildNavLights()
    {
        const light = (position, color) => part(new THREE.SphereGeometry(0.16, 10, 8), color, { position })
        const hangar = this.layout.modules.find((m) => m.kind === 'hangar')
        const strobe = (u, y, v, angle) => { _position.set(- u, y, v).applyMatrix4(moduleMatrix(angle)); return [ _position.x, _position.y, _position.z ] }
        const lights = [
            light([ 0, TRUSS.y, - TRUSS.half - 0.4 ], '#ff3b3b'),
            light([ 0, TRUSS.y, TRUSS.half + 0.4 ], '#3bff7a'),
            light([ 0, NODE.height + 2.1, 0 ], '#ff3b3b')
        ]
        if(hangar)
            for(const u of [ - 3, 3 ])
                lights.push(light(strobe(u, hangar.axis + hangar.radius + SKIN + 0.2, hangar.end, hangar.angle), '#ffffff'))
        const projects = this.layout.modules.find((m) => m.id === 'projects')
        if(projects)
            lights.push(light(strobe(0, projects.axis + projects.radius + SKIN + 0.2, projects.hull, projects.angle), '#ffffff'))
        for(const g of lights)
            this.parts.blink.push(finish(g))
    }

    // Four solar wings (two pairs a side), long panels of cells across the truss, turning together
    // about the truss axis to face the sun
    buildWings()
    {
        this.wings = new THREE.Group()
        this.wings.position.y = TRUSS.y
        this.group.add(this.wings)
        const { width, inner, outer } = WINGS
        const panels = []
        const frames = []
        for(const side of [ - 1, 1 ])
            for(const z of WINGS.z)
            {
                const zc = side * z
                for(const sign of [ - 1, 1 ])
                {
                    const length = outer - inner
                    const geometry = new THREE.BoxGeometry(length, 0.04, width)
                    const uv = geometry.attributes.uv
                    for(let i = 0; i < uv.count; i++)
                        uv.setXY(i, uv.getX(i) * length, uv.getY(i) * width)
                    geometry.translate(sign * (inner + outer) / 2, 0, zc)
                    panels.push(geometry)
                    frames.push(box(sign * inner, - 0.05, zc - width / 2 - 0.05, sign * outer, 0.05, zc - width / 2, '#9aa0a8'))
                    frames.push(box(sign * inner, - 0.05, zc + width / 2, sign * outer, 0.05, zc + width / 2 + 0.05, '#9aa0a8'))
                    frames.push(box(sign * inner, - 0.09, zc - 0.07, sign * outer, 0.09, zc + 0.07, '#6b7079')) // mast
                    frames.push(box(sign * outer, - 0.07, zc - width / 2 - 0.05, sign * (outer + 0.12), 0.07, zc + width / 2 + 0.05, '#6b7079'))
                }
                frames.push(box(- inner, - 0.15, zc - 0.25, inner, 0.15, zc + 0.25, '#5b616b'))
            }
        this.add(new THREE.Mesh(mergeGeometries(panels.map(finish)), this.materials.solar), this.wings)
        this.add(new THREE.Mesh(mergeGeometries(frames.map(finish)), this.materials.metal), this.wings)
        // The sun's angle about the truss axis (Z): the wings' normal points at the sun's projection
        const sun = this.state.planets.sunDirection
        this.sunAngle = Math.atan2(- sun.x, sun.y)
    }

    // The bay door: rolls up into the lintel (its bottom edge rises)
    buildDoor()
    {
        const hangar = this.layout.modules.find((m) => m.kind === 'hangar')
        const { half, height } = HANGAR.bay
        const geometry = new THREE.BoxGeometry(half * 2, height, DOOR.thickness)
        geometry.translate(0, - height / 2, 0) // origin at the top edge
        const stripes = []
        for(let y = 0.6; y < height - 0.2; y += 1.2)
            stripes.push(box(- half + 0.2, - y - 0.08, - DOOR.thickness / 2 - 0.01, half - 0.2, - y + 0.08, DOOR.thickness / 2 + 0.01, '#8d949e'))
        this.bayDoor = new THREE.Group()
        this.bayDoor.position.set(0, height, hangar.end + WALL / 2).applyMatrix4(moduleMatrix(hangar.angle))
        this.bayDoor.quaternion.setFromRotationMatrix(moduleMatrix(hangar.angle))
        this.add(new THREE.Mesh(paint(geometry, '#c9ced6'), this.materials.hull), this.bayDoor)
        this.add(new THREE.Mesh(mergeGeometries(stripes), this.materials.metal), this.bayDoor)
        this.group.add(this.bayDoor)
    }

    // Docking guide lights (one instanced mesh): round the bay door outside, two rows on the hangar
    // deck from the door to the pad, a ring on the pad's edge
    buildGuideLights()
    {
        const hangar = this.layout.modules.find((m) => m.kind === 'hangar')
        const matrix = moduleMatrix(hangar.angle)
        const { half, height } = HANGAR.bay
        const { pad } = HANGAR
        const padV = - pad.x // the hangar points along −X
        const at = (u, y, v) => _position.set(- u, y, v).applyMatrix4(matrix).toArray()
        const points = []
        const outside = hangar.end + WALL + 0.16
        for(let u = - half; u <= half + 1e-6; u += half / 6)
            points.push({ position: at(u, height + 0.2, outside), group: 'frame', order: 0 })
        for(let y = 0.4; y <= height; y += 1)
            for(const u of [ - half - 0.22, half + 0.22 ])
                points.push({ position: at(u, y, outside), group: 'frame', order: 0 })
        let order = 0
        for(let v = hangar.end - 0.4; v > padV + pad.r + 0.2; v -= 0.8, order++)
            for(const u of [ - 2.3, 2.3 ])
                points.push({ position: at(u, 0.03, v), group: 'floor', order })
        for(let i = 0; i < 16; i++)
        {
            const angle = i / 16 * Math.PI * 2
            points.push({ position: [ pad.x + Math.cos(angle) * (pad.r + 0.04), pad.height - 0.08, pad.z + Math.sin(angle) * (pad.r + 0.04) ], group: 'pad', order: i })
        }
        this.floorCount = order

        const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.09, 8, 6), this.materials.guide, points.length)
        points.forEach((point, i) => mesh.setMatrixAt(i, _matrix.makeTranslation(...point.position)))
        mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(points.length * 3), 3)
        mesh.computeBoundingSphere()
        this.guide = { mesh: this.add(mesh, this.group, false), points }
    }

    // Which way the bay door and the guide lights work: 'leave', 'dock' or null
    activity()
    {
        const flight = this.state.flight
        if(!flight.active)
            return null
        const { route, phase } = flight
        if(route.from === this.station && (phase === 'boarding' || phase === 'takeoff'))
            return 'leave'
        if(route.to === this.station && phase === 'landing')
            return 'dock'
        return null
    }

    updateGuideLights(activity, elapsed)
    {
        const { mesh, points } = this.guide
        points.forEach((point, i) =>
        {
            let amount = point.group === 'floor' ? 0.7 : point.group === 'pad' ? 0.9 : 0.5
            let color = point.group === 'frame' ? '#ffffff' : '#ffb347'
            if(activity)
            {
                color = activity === 'dock' ? '#ffb347' : '#5dff9b'
                if(point.group === 'frame')
                    amount = Math.sin(elapsed * 9) > 0 ? 2.4 : 0.3
                else
                {
                    // A pulse running toward the pad (docking) or out to the door (leaving)
                    const order = point.group === 'pad' ? this.floorCount : point.order
                    const wave = activity === 'dock' ? elapsed * 6 - order : elapsed * 6 + order
                    amount = 0.4 + 2 * Math.max(0, Math.cos(wave * 0.9)) ** 6
                }
            }
            mesh.setColorAt(i, _color.set(color).multiplyScalar(amount))
        })
        mesh.instanceColor.needsUpdate = true
    }

    update()
    {
        const delta = this.state.time.delta
        const elapsed = this.state.time.elapsed

        // Near / inside (from this frame's camera). Only while the station is where you are or where
        // you fly to: Signal Moon is close enough to be "near", and keeps its own beacon lights.
        const camera = this.view.camera.instance.position
        const flight = this.state.flight
        const here = this.state.planets.current === this.station || (flight.active && flight.route?.to === this.station)
        _local.subVectors(camera, this.interior.center)
        this.near = here && _local.length() < NEAR
        this.inside = this.near && insideStation(this.layout.volumes, _local.x, _local.y, _local.z)
        this.windowGlow.visible = !this.near

        // Solar wings: facing the sun about the truss axis, a slow swing either side
        this.wings.rotation.z = this.sunAngle + Math.sin(elapsed * WINGS.speed) * WINGS.swing

        // Nav lights: a double flash every 1.6 s
        const t = elapsed % 1.6
        this.materials.blink.color.setScalar(t < 0.1 || (t > 0.25 && t < 0.35) ? 2.4 : 0.12)

        // Bay door: open while the ship leaves or docks
        const activity = this.activity()
        const target = activity ? 1 : 0
        this.door += THREE.MathUtils.clamp(target - this.door, - DOOR.speed * delta, DOOR.speed * delta)
        const open = THREE.MathUtils.smootherstep(this.door, 0, 1)
        this.bayDoor.scale.y = Math.max(0.02, 1 - open)
        this.bayDoor.visible = open < 0.99

        if(this.near)
            this.updateGuideLights(activity, elapsed)
    }
}
