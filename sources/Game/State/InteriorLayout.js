// Station interior layout (M6; ISS-style modules since the M6b realism pass), pure data: no rendering,
// no singletons. View/StationInterior.js and View/Station.js build the meshes from it,
// State/PlanarPhysics.js collides with the same wall segments (every collider is a drawn rack face,
// bulkhead or exhibit), and the temporary Node walk check uses it too.
//
// Local frame: metres, flat deck at y = 0, +Y up, origin = centre of the Node (the hologram).
// The Node is an octagonal module (inradius 6 m, 5 m high); cylindrical modules (4.8 m across, a flat
// deck 1.3 m below their axis) branch off its faces through round hatches (3.4 m across, cut by the
// deck). Face angles (from +X toward +Z): 0° Cupola (toward Earth), 45° Certificates, 90° Photos
// (closed while photos.js is empty), 180° Hangar (the large docking module; its bay door faces −X,
// the docking axis), 270° Projects, 315° Skills. 135° and 225° are rack banks (the hangar is too wide
// for modules beside it). Each module has its own frame: v along its axis from the Node centre, u across.

export const WALL = 0.3 // hull / bulkhead thickness (outside the free space)
export const NODE = { sides: 8, inradius: 6, height: 5 }
export const NODE_HALF_FACE = NODE.inradius * Math.tan(Math.PI / NODE.sides)
export const HATCH = { radius: 1.7, centre: 0.9, depth: 0.4 } // passage from v = inradius to inradius + depth
export const HATCH_HALF = Math.sqrt(HATCH.radius ** 2 - HATCH.centre ** 2) // half width at deck level (1.44 m)
export const MODULE_START = NODE.inradius + HATCH.depth
export const TUBE = { radius: 2.4, axis: 1.3, rack: 1.85, upper: 2, rackTop: 0.8, upperTop: 2.5 } // rack = lower rack fronts (the walls you walk along)
export const TUBE_DECK = Math.sqrt(TUBE.radius ** 2 - TUBE.axis ** 2) // deck half width (2.02 m)
export const CUPOLA = { length: 1.6, sill: 1.85, sillHeight: 0.45 } // short module, then the glass dome (radius = TUBE.radius)
export const RACK_BANK = 0.45 // depth of the rack banks on the Node's closed faces
export const BACK_RACK = 0.3 // a module's back wall: a rack bank this deep (its face is the collider)
export const CEILING = NODE.height
export const PROJECTOR_RADIUS = 1.3
export const HANGAR = {
    angle: 180,
    start: MODULE_START,
    length: 16,
    radius: 6.8,
    axis: 3.4,
    wall: 5.5, // shelving along its walls (collider)
    x0: - (MODULE_START + 16), // the bay end (the door's inner face)
    bay: { half: 5.2, height: 6.6 }, // bay door in the end bulkhead
    pad: { x: - 14.4, z: 0, r: 3.4, height: 0.35 }, // the ship rests on top, nose to the bay door
    glide: 2.6, // ship belly height while it flies in or out
    console: { x0: - 11.05, x1: - 10.45, z0: - 0.75, z1: 0.75 } // touches the pad (no gap to get stuck in)
}
export const SPAWN = { x: - 8.8, z: 2.6, facing: [ 1, - 0.55 ] } // beside the ship, facing the hatch into the Node
export const INTERACTION_DISTANCE = 1.2 // exhibit → its interaction point (in front of it)

const GAP = { screen: 0.6, frame: 0.9, console: 0.8, photo: 0.9 }
const DOOR_CLEAR = 1.6 // along a module: hatch → first exhibit
const END_CLEAR = 1.1 // last exhibit → back wall
const MIN_LENGTH = 6
const DESK = { console: 0.4, photo: 0.45 } // exhibits standing on a desk along the wall (depth in front of the racks)

const BRANCHES = [
    { id: 'cupola', angle: 0, kind: 'cupola' },
    { id: 'certificates', angle: 45, kind: 'tube' },
    { id: 'photos', angle: 90, kind: 'tube' },
    { id: 'hangar', angle: 180, kind: 'hangar' },
    { id: 'projects', angle: 270, kind: 'tube' },
    { id: 'skills', angle: 315, kind: 'tube' }
]

// A module's frame: v along its axis (from the Node centre), u across (u > 0 = left seen from the Node)
export function moduleFrame(angle)
{
    const a = angle * Math.PI / 180
    const d = [ Math.cos(a), Math.sin(a) ]
    const e = [ - d[1], d[0] ]
    return {
        d,
        e,
        point: (u, v) => [ d[0] * v + e[0] * u, d[1] * v + e[1] * u ],
        dir: (du, dv) => [ d[0] * dv + e[0] * du, d[1] * dv + e[1] * du ],
        local: (x, z) => ({ u: x * e[0] + z * e[1], v: x * d[0] + z * d[1] })
    }
}

// One-sided wall segment (local x, z) with its free side's normal
function segment(frame, u0, v0, u1, v1, nu, nv, extra = {})
{
    const a = frame.point(u0, v0)
    const b = frame.point(u1, v1)
    const n = frame.dir(nu, nv)
    return { ax: a[0], az: a[1], bx: b[0], bz: b[1], nx: n[0], nz: n[1], ...extra }
}

// Rectangle obstacle in a module frame (u0..u1 × v0..v1), its sides facing out (skip: sides against a wall)
function obstacle(frame, u0, v0, u1, v1, skip = [], extra = {})
{
    const sides = [
        [ 'u0', u0, v0, u0, v1, - 1, 0 ],
        [ 'u1', u1, v0, u1, v1, 1, 0 ],
        [ 'v0', u0, v0, u1, v0, 0, - 1 ],
        [ 'v1', u0, v1, u1, v1, 0, 1 ]
    ]
    return sides.filter(([ id ]) => !skip.includes(id)).map(([ , a, b, c, d, nu, nv ]) => segment(frame, a, b, c, d, nu, nv, extra))
}

// Split items into the two walls (left first) and give the module its length
function rows(items, widthOf, gap)
{
    const half = Math.ceil(items.length / 2)
    const sides = [ items.slice(0, half), items.slice(half) ]
    const span = (row) => row.reduce((sum, item, i) => sum + widthOf(item) + (i ? gap : 0), 0)
    const length = Math.max(MIN_LENGTH, DOOR_CLEAR + Math.max(span(sides[0]), span(sides[1])) + END_CLEAR)
    return { sides, span, length }
}

// content = { projects, certificates, photos, skillGroups } (already filtered for visibility)
export function buildInterior({ projects = [], certificates = [], photos = [], skillGroups = [] } = {})
{
    const segments = []
    const circles = [ { x: 0, z: 0, r: PROJECTOR_RADIUS, kind: 'projector' } ]
    const exhibits = []
    const desks = []
    const modules = []
    const open = { cupola: true, certificates: certificates.length > 0, photos: photos.length > 0, hangar: true, projects: projects.length > 0, skills: skillGroups.length > 0 }

    // Module contents (exhibit rows) and lengths
    skillGroups.forEach((group, index) => { group.__id = `skills-${index}` })
    const content = {
        projects: { items: projects, kind: 'project', widthOf: (p) => p.featured ? 2.6 : 2.3, gap: GAP.screen, extra: (p) => ({ id: p.id, opens: 'work', height: p.featured ? 1.46 : 1.29, y: 1.8, featured: !!p.featured }) },
        certificates: { items: certificates, kind: 'certificate', widthOf: () => 1.5, gap: GAP.frame, extra: (c) => ({ id: c.id, opens: 'achievements', height: 1.1, y: 1.7 }) },
        photos: { items: photos, kind: 'photo', widthOf: () => 1.8, gap: GAP.photo, extra: (p) => ({ id: p.id, opens: 'photo', height: 1.2, y: 1.75, depth: DESK.photo }) },
        skills: { items: skillGroups, kind: 'console', widthOf: () => 2.2, gap: GAP.console, extra: (g) => ({ id: g.__id, opens: 'skills', group: g, height: 1.1, y: 1.4, depth: DESK.console }) }
    }

    // Node: octagon faces (a hatch where a module is open, a rack bank where the face is closed)
    for(let k = 0; k < NODE.sides; k++)
    {
        const angle = k * 360 / NODE.sides
        const frame = moduleFrame(angle)
        const branch = BRANCHES.find((b) => b.angle === angle)
        const h = NODE_HALF_FACE
        const R = NODE.inradius
        if(branch && open[branch.id])
        {
            segments.push(segment(frame, - h, R, - HATCH_HALF, R, 0, - 1, { part: `node-${angle}` }))
            segments.push(segment(frame, HATCH_HALF, R, h, R, 0, - 1, { part: `node-${angle}` }))
            // Hatch passage (the bulkhead's thickness)
            segments.push(segment(frame, - HATCH_HALF, R, - HATCH_HALF, MODULE_START, 1, 0, { part: `hatch-${branch.id}` }))
            segments.push(segment(frame, HATCH_HALF, R, HATCH_HALF, MODULE_START, - 1, 0, { part: `hatch-${branch.id}` }))
        }
        else if(branch)
            segments.push(segment(frame, - h, R, h, R, 0, - 1, { part: `node-${angle}`, closed: branch.id })) // closed hatch
        else
        {
            // Rack bank across the whole face: its front ends on the neighbouring faces (no gap)
            const reachOut = h + RACK_BANK * Math.tan(2 * Math.PI / NODE.sides)
            segments.push(segment(frame, - reachOut, R - RACK_BANK, reachOut, R - RACK_BANK, 0, - 1, { part: `rackbank-${angle}` }))
        }
    }

    // Modules
    for(const branch of BRANCHES)
    {
        if(!open[branch.id])
            continue
        const frame = moduleFrame(branch.angle)
        const start = MODULE_START
        if(branch.kind === 'hangar')
        {
            const H = HANGAR
            const end = start + H.length
            modules.push({ id: 'hangar', kind: 'hangar', angle: branch.angle, start, end, hull: end, radius: H.radius, axis: H.axis, wall: H.wall })
            segments.push(segment(frame, - H.wall, start, - H.wall, end, 1, 0, { part: 'hangar-side' }))
            segments.push(segment(frame, H.wall, start, H.wall, end, - 1, 0, { part: 'hangar-side' }))
            segments.push(segment(frame, - H.wall, start, - HATCH_HALF, start, 0, 1, { part: 'hangar-bulkhead' }))
            segments.push(segment(frame, HATCH_HALF, start, H.wall, start, 0, 1, { part: 'hangar-bulkhead' }))
            segments.push(segment(frame, - H.wall, end, H.wall, end, 0, - 1, { part: 'hangar-bay', bay: true }))
            continue
        }

        const isCupola = branch.kind === 'cupola'
        const spec = content[branch.id]
        const plan = spec ? rows(spec.items, spec.widthOf, spec.gap) : { length: CUPOLA.length }
        const end = start + plan.length
        modules.push({ id: branch.id, kind: branch.kind, angle: branch.angle, start, end, hull: isCupola ? end : end + BACK_RACK, radius: TUBE.radius, axis: TUBE.axis })

        // Lower rack fronts along both walls, the bulkhead beside the hatch, the back wall
        const W = TUBE.rack
        segments.push(segment(frame, - W, start, - W, end, 1, 0, { part: `${branch.id}-rack` }))
        segments.push(segment(frame, W, start, W, end, - 1, 0, { part: `${branch.id}-rack` }))
        segments.push(segment(frame, - W, start, - HATCH_HALF, start, 0, 1, { part: `${branch.id}-bulkhead` }))
        segments.push(segment(frame, HATCH_HALF, start, W, start, 0, 1, { part: `${branch.id}-bulkhead` }))
        if(isCupola)
        {
            // The dome's sill: a half ring at the deck (8 pieces)
            const pieces = 8
            for(let i = 0; i < pieces; i++)
            {
                const a0 = - Math.PI / 2 + i / pieces * Math.PI
                const a1 = - Math.PI / 2 + (i + 1) / pieces * Math.PI
                const am = (a0 + a1) / 2
                segments.push(segment(frame, Math.sin(a0) * CUPOLA.sill, end + Math.cos(a0) * CUPOLA.sill, Math.sin(a1) * CUPOLA.sill, end + Math.cos(a1) * CUPOLA.sill, - Math.sin(am), - Math.cos(am), { part: 'cupola-sill' }))
            }
            continue
        }
        segments.push(segment(frame, - W, end, W, end, 0, - 1, { part: `${branch.id}-back` }))

        // Exhibits along the walls: left row (u = −upper rack face), right row (u = +)
        for(const [ side, row ] of plan.sides.entries())
        {
            if(!row.length)
                continue
            const sign = side === 0 ? - 1 : 1
            const span = plan.span(row)
            let v = start + DOOR_CLEAR + (plan.length - DOOR_CLEAR - END_CLEAR - span) / 2
            const first = v
            for(const item of row)
            {
                const width = spec.widthOf(item)
                const extra = spec.extra(item)
                const depth = extra.depth || 0
                // Wall exhibits hang on the upper rack face; desk exhibits stand on a desk in front of the racks
                const mount = depth ? W : TUBE.upper
                const [ x, z ] = frame.point(sign * mount, v + width / 2)
                const normal = frame.dir(- sign, 0)
                const exhibit = { kind: spec.kind, room: branch.id, x, z, normal, width, mount, ...extra }
                const reach = INTERACTION_DISTANCE + depth + (mount - W)
                exhibit.point = { x: x + normal[0] * reach, z: z + normal[1] * reach }
                exhibits.push(exhibit)
                v += width + spec.gap
            }
            // One continuous desk per row (one collider, nothing to get stuck between)
            const depth = spec.extra(row[0]).depth
            if(depth)
            {
                const v0 = first - 0.3
                const v1 = v - spec.gap + 0.3
                const u0 = sign < 0 ? - W : W - depth
                const u1 = sign < 0 ? - W + depth : W
                segments.push(...obstacle(frame, u0, v0, u1, v1, [ sign < 0 ? 'u0' : 'u1' ], { part: `desk-${branch.id}` }))
                desks.push({ room: branch.id, angle: branch.angle, u0, u1, v0, v1, depth })
            }
        }
    }

    // Hangar: the landing pad and the console touching it
    const H = HANGAR
    circles.push({ x: H.pad.x, z: H.pad.z, r: H.pad.r, kind: 'pad' })
    segments.push(...obstacle(moduleFrame(0), H.console.z0, H.console.x0, H.console.z1, H.console.x1, [], { part: 'hangar-console', console: true })) // the 0° frame: u = z, v = x

    // Signs above the open hatches (Node side) and the hatches themselves
    const hatches = BRANCHES.map((b) =>
    {
        const frame = moduleFrame(b.angle)
        const [ x, z ] = frame.point(0, NODE.inradius)
        return { id: b.id, angle: b.angle, x, z, normal: frame.dir(0, - 1), open: open[b.id] }
    })
    const signs = hatches.filter((h) => h.open).map((h) => ({ room: h.id, x: h.x + h.normal[0] * 0.02, z: h.z + h.normal[1] * 0.02, normal: h.normal, y: 3.55, width: 3 }))

    // Interactives: every exhibit, the hologram projector and the hangar console (destination picker)
    const interactives = [
        ...exhibits.map((e) => ({ id: e.id, opens: e.opens, x: e.point.x, z: e.point.z, kind: e.kind })),
        { id: 'hologram', opens: 'hologram', x: 0, z: PROJECTOR_RADIUS + 1.1, kind: 'hologram' },
        { id: 'hangar-console', opens: 'destinations', x: H.console.x1 + INTERACTION_DISTANCE, z: (H.console.z0 + H.console.z1) / 2, kind: 'hangar' }
    ]

    // Crew (ambient NPCs): one round the hologram, one in each of the two longest modules, walking the
    // module's centre line (they step aside toward a wall when you come); never pausing in a hatch
    const crewPath = (id) =>
    {
        const m = modules.find((item) => item.id === id)
        if(!m)
            return null
        const frame = moduleFrame(m.angle)
        const at = (v) => { const [ x, z ] = frame.point(0, v); return { x, z } }
        return { id: `crew-${id}`, loop: false, path: [ { ...at(m.start + 2.4), pause: 3 }, { ...at(m.end - 1.4), pause: 4 } ] }
    }
    const crew = [
        { id: 'crew-node', loop: true, path: ring(3.9, 8).map((p, i) => ({ ...p, pause: i % 4 === 0 ? 3 : 0 })) },
        crewPath('projects'),
        crewPath('certificates')
    ].filter(Boolean)

    // Where the crew may never stop (hatches, exhibits' interaction spots)
    const noStop = [
        ...hatches.filter((h) => h.open).map((h) => { const [ x, z ] = moduleFrame(h.angle).point(0, NODE.inradius + HATCH.depth / 2); return { x, z, r: 2.4 } }),
        ...interactives.map((i) => ({ x: i.x, z: i.z, r: 1.1 }))
    ]

    // Lights: 3 point lights (the planet beacon-light pool, so no shader recompiles) in the Node, the
    // Projects module and the hangar; everything else glows (LED strips, screens, lamps)
    const projectsModule = modules.find((m) => m.id === 'projects')
    const middle = projectsModule ? moduleFrame(projectsModule.angle).point(0, (projectsModule.start + projectsModule.end) / 2) : [ 0, - 10 ]
    const lights = [
        { x: 0, y: 4.5, z: 0, color: '#d6f2ff', intensity: 20, distance: 15 },
        { x: middle[0], y: 3.1, z: middle[1], color: '#fff0dc', intensity: 9, distance: 10 },
        { x: H.pad.x, y: 9, z: H.pad.z, color: '#e2eeff', intensity: 40, distance: 22 }
    ]

    // Free space (camera, "is the camera inside"): the Node prism, the hatch passages, the module tubes
    const volumes = [
        { kind: 'node' },
        ...hatches.filter((h) => h.open).map((h) => ({ kind: 'hatch', angle: h.angle })),
        ...modules.map((m) => ({ kind: m.kind === 'hangar' ? 'hangar' : 'tube', angle: m.angle, start: m.start, end: m.end, radius: m.radius, axis: m.axis, dome: m.kind === 'cupola' }))
    ]
    const radius = Math.max(...modules.map((m) => m.hull + (m.kind === 'cupola' ? TUBE.radius : WALL)))

    return { segments, circles, exhibits, desks, modules, hatches, signs, interactives, crew, noStop, lights, volumes, radius, open, spawn: SPAWN, hangar: HANGAR, ceiling: CEILING }
}

// Is a local point inside the free space, at least `margin` from every surface? (camera, "inside")
export function insideStation(volumes, x, y, z, margin = 0)
{
    if(y < margin)
        return false
    for(const volume of volumes)
    {
        if(volume.kind === 'node')
        {
            if(y > NODE.height - margin)
                continue
            let inside = true
            for(let k = 0; k < NODE.sides && inside; k++)
            {
                const a = k * Math.PI * 2 / NODE.sides
                inside = x * Math.cos(a) + z * Math.sin(a) <= NODE.inradius - margin
            }
            if(inside)
                return true
            continue
        }
        const { u, v } = moduleFrame(volume.angle).local(x, z)
        if(volume.kind === 'hatch')
        {
            // The passage, open a metre into the Node and the module (both are free space there)
            if(v > NODE.inradius - 1 && v < MODULE_START + 1 && u * u + (y - HATCH.centre) ** 2 <= (HATCH.radius - margin) ** 2)
                return true
            continue
        }
        const r = volume.radius - margin
        const across = u * u + (y - volume.axis) ** 2
        if(v >= volume.start + margin && v <= volume.end - (volume.dome ? 0 : margin) && across <= r * r)
            return true
        if(volume.dome && v > volume.end && across + (v - volume.end) ** 2 <= r * r)
            return true
    }
    return false
}

function ring(radius, count)
{
    return Array.from({ length: count }, (_, i) =>
    {
        const angle = i / count * Math.PI * 2 + Math.PI / count
        return { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius }
    })
}
