import * as THREE from 'three'
import EventsEmitter from 'events'

import config, { earth, spawnPlanetId, sunDirection } from '../config/planets.js'
import locations from '../../content/locations.js'
import { PROP_BUILDERS, MARKER_SHAPES, SHIP_SHAPE, propMatrix, buildCollider, shipRestPose } from './PropShapes.js'
import { HANGAR, WALL } from './InteriorLayout.js'
import { visibleProjects } from '../../UI/visibleContent.js'
import activities from '../../content/activities.js'
import goals from '../../content/goals.js'
import forge from '../../content/forge.js'

const DEG = Math.PI / 180
const INTERACTION_RADIUS = 3 // BR-03

const _yAxis = new THREE.Vector3(0, 1, 0)

const has = (value) => Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && String(value).trim() !== ''

const nameOf = (id) => locations.find((location) => location.id === id)?.name || ''

// M6b Apeiron Station: no surface, props or beacons (its walkable floor is the interior, State/
// Interior.js). The flight uses the hangar: the ship's rest pose on the pad (nose to the bay door),
// the bay door, the hover point above the pad, the gate outside where routes start and end, and the
// approach point where docking is aligned on the bay axis.
function createStation(planet)
{
    const center = new THREE.Vector3().fromArray(planet.center)
    const local = (x, y, z) => new THREE.Vector3(x, y, z).add(center)
    const up = new THREE.Vector3(0, 1, 0)
    const axis = new THREE.Vector3(- 1, 0, 0) // out through the bay door
    const rest = { position: local(HANGAR.pad.x, HANGAR.pad.height, HANGAR.pad.z), quaternion: new THREE.Quaternion(), up: up.clone(), forward: axis.clone() }
    rest.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3().crossVectors(up, axis), up, axis))
    const door = local(HANGAR.x0 - WALL / 2, HANGAR.glide, HANGAR.pad.z)
    return {
        id: planet.id,
        kind: 'station',
        name: nameOf(planet.id),
        center,
        radius: planet.radius,
        reach: planet.reach,
        color: planet.color,
        accent: planet.accent,
        landingPoint: rest.position.clone(),
        stations: {},
        contentPoints: [],
        launchPad: null,
        shipMatrix: null,
        shipHatch: SHIP_SHAPE.hatch,
        interactives: [],
        lookAt: null,
        screens: [],
        workers: [],
        props: [],
        colliders: [],
        hangar: {
            rest,
            axis,
            up,
            door,
            hover: local(HANGAR.pad.x, HANGAR.glide, HANGAR.pad.z),
            gate: door.clone().addScaledVector(axis, 6),
            approach: door.clone().addScaledVector(axis, 20)
        }
    }
}

// Unit direction for a { lat, long } point (degrees). long 0 / lat 0 = +Z.
export function latLongToDirection({ lat, long }, target = new THREE.Vector3())
{
    const cosLat = Math.cos(lat * DEG)
    return target.set(cosLat * Math.sin(long * DEG), Math.sin(lat * DEG), cosLat * Math.cos(long * DEG))
}

// All positions here are scene positions relative to the floating origin: the current
// planet is always at (0, 0, 0). `origin` is where the scene origin sits in layout space.
// Colliders are generated from the real prop meshes (State/PropShapes.js); only the
// current planet's colliders are ever queried.
export default class Planets
{
    constructor({ keepTriangles = false } = {})
    {
        this.events = new EventsEmitter()
        this.origin = new THREE.Vector3()

        const geometries = Object.fromEntries(Object.entries(PROP_BUILDERS).map(([ type, builder ]) => [ type, builder.build() ]))
        const baseGeometry = [ { geometry: MARKER_SHAPES.base() } ]
        const shipGeometry = SHIP_SHAPE.build()

        this.items = config.map((planet) =>
        {
            if(planet.kind === 'station')
                return createStation(planet)

            const center = new THREE.Vector3().fromArray(planet.center)
            const surfacePoint = (position) => latLongToDirection(position).multiplyScalar(planet.radius).add(center)
            const point = (id, position, opens) => ({ id, opens, position: surfacePoint(position), up: latLongToDirection(position) })

            const typeCounts = {}
            const props = planet.props.map((prop) =>
            {
                const up = latLongToDirection(prop.position)
                const index = typeCounts[prop.type] = (typeCounts[prop.type] ?? - 1) + 1
                const result = { type: prop.type, size: prop.size, up, position: surfacePoint(prop.position) }
                result.matrix = propMatrix(result, index, planet.radius) // relative to the planet center
                result.collider = buildCollider(geometries[prop.type], result.matrix, center, { keepTriangles })
                return result
            })

            const contentPoints = planet.contentPoints.map((p) => point(p.id, p.position, p.opens))
            const launchPad = point('launchpad', planet.launchPad, 'destinations')
            const eggs = (planet.eggs || []).map((egg) => point(egg.id, egg.position, 'egg'))

            // M6 exhibits: props turned toward `facing`, with their interaction point in front
            // (marker: false = no beacon, the object itself is the thing to walk up to)
            const exhibits = []
            const screens = []
            const workers = []
            const tangentToward = (from, to) =>
            {
                const up = latLongToDirection(from)
                const target = latLongToDirection(to)
                return target.addScaledVector(up, - target.dot(up)).normalize()
            }
            const addProp = (type, position, facing) =>
            {
                const prop = { type, size: 1, up: latLongToDirection(position), position: surfacePoint(position), face: tangentToward(position, facing) }
                prop.matrix = propMatrix(prop, 0, planet.radius)
                prop.collider = buildCollider(geometries[type], prop.matrix, center, { keepTriangles })
                props.push(prop)
                return prop
            }
            // A point given in the prop's local space, dropped onto the surface
            const onSurface = (prop, local) =>
            {
                const p = new THREE.Vector3().fromArray(local).applyMatrix4(prop.matrix)
                const up = p.clone().normalize()
                return { position: up.clone().multiplyScalar(planet.radius).add(center), up }
            }
            const exhibitPoint = (prop, local, id, opens, marker = false) => exhibits.push({ id, opens, marker, ...onSurface(prop, local) })

            if(planet.featured)
            {
                const project = visibleProjects.find((item) => item.id === forge.featuredProjectId)
                if(project)
                {
                    const prop = addProp('exhibit', planet.featured.position, planet.featured.facing)
                    exhibitPoint(prop, [ 0, 0, 2.4 ], project.id, 'work')
                    screens.push({ kind: 'featured', prop, project })
                }
            }
            if(planet.activities)
            {
                const { start, step, facing } = planet.activities
                activities.filter((activity) => has(activity.title)).forEach((activity, i) =>
                {
                    const position = { lat: start.lat + step.lat * i, long: start.long + step.long * i }
                    const prop = addProp('banner', position, { lat: facing.lat + step.lat * i, long: facing.long + step.long * i })
                    exhibitPoint(prop, [ 0.6, 0, 1.5 ], activity.id, 'activities')
                    screens.push({ kind: 'banner', prop, activity })
                })
            }
            for(const worker of planet.workers || [])
                workers.push({ prop: addProp('worker', worker.position, worker.facing) })
            if(planet.goals && (has(goals.currentlyLearning) || has(goals.next) || has(goals.goal)))
            {
                const prop = addProp('console', planet.goals.position, planet.goals.facing)
                exhibitPoint(prop, [ 0, 0, 1.7 ], 'goals', 'goals')
                screens.push({ kind: 'goals', prop })
            }

            // M7 exploration stations (The Observatory): walk-up points, no beacons (BR-03 prompt only)
            const stations = {}
            if(planet.stations?.telescope)
            {
                const { position, facing } = planet.stations.telescope
                const prop = addProp('observatoryTelescope', position, facing)
                exhibitPoint(prop, [ 0, 0, 2.6 ], 'telescope', 'telescope')
                stations.telescope = { prop }
            }
            if(planet.stations?.rover)
                stations.rover = planet.stations.rover // its parking spot (State/Rover.js: it drives, not a prop)
            if(planet.stations?.radio)
            {
                const { position, facing } = planet.stations.radio
                const prop = addProp('radioDish', position, facing)
                exhibitPoint(prop, [ 0, 0, 2.2 ], 'radio', 'radio')
                stations.radio = { prop }
            }
            if(planet.stations?.lab)
            {
                const { hut, samples, facing } = planet.stations.lab
                addProp('labHut', hut.position, hut.facing)
                stations.lab = {
                    samples: samples.map((position, i) =>
                    {
                        const prop = addProp(i % 2 ? 'sampleCrystal' : 'sampleRock', position, facing)
                        const id = `sample-${i + 1}`
                        exhibitPoint(prop, [ 0, 0, 1.1 ], id, 'sample')
                        return { id, prop, kind: i % 2 ? 'crystal' : 'rock' }
                    })
                }
            }

            // Beacon bases collide (small, their visible base only); launch pads are flat
            const beaconColliders = contentPoints.map((p) =>
            {
                const matrix = new THREE.Matrix4().compose(p.up.clone().multiplyScalar(planet.radius), new THREE.Quaternion().setFromUnitVectors(_yAxis, p.up), new THREE.Vector3(1, 1, 1))
                const collider = buildCollider(baseGeometry, matrix, center, { keepTriangles })
                collider.beacon = p.id
                return collider
            })

            // The ship parked on the launch pad collides like a prop (its mesh footprint)
            const landingPoint = surfacePoint(planet.landingPoint)
            const rest = shipRestPose(launchPad, landingPoint)
            const shipMatrix = new THREE.Matrix4().compose(rest.position.clone().sub(center), rest.quaternion, new THREE.Vector3(1, 1, 1))
            const shipCollider = buildCollider(shipGeometry, shipMatrix, center, { keepTriangles })
            if(shipCollider)
                shipCollider.ship = true

            return {
                id: planet.id,
                name: nameOf(planet.id),
                center,
                radius: planet.radius,
                color: planet.color,
                accent: planet.accent,
                landingPoint,
                contentPoints,
                launchPad,
                shipMatrix,
                shipHatch: SHIP_SHAPE.hatch, // where the astronaut boards (ship-local)
                interactives: [ ...contentPoints, ...exhibits, launchPad, ...eggs ],
                lookAt: (contentPoints[0] || exhibits[0] || launchPad).position, // what you face on landing
                screens,
                workers,
                stations,
                scientists: planet.scientists || [],
                scientistAnchor: planet.scientistAnchor,
                movers: [], // M7 scientists (State/Scientists.js)
                props,
                colliders: [ ...props.map((prop) => prop.collider).filter(Boolean), ...beaconColliders, shipCollider ].filter(Boolean)
            }
        })

        this.earth = {
            center: new THREE.Vector3().fromArray(earth.center),
            radius: earth.radius,
            beaconDirection: latLongToDirection(earth.beacon)
        }

        this.sunDirection = new THREE.Vector3().fromArray(sunDirection).normalize()
        this.current = this.get(spawnPlanetId)
        this.shiftOrigin(this.current.center.clone())
    }

    // The ship model has loaded (View/Ship.js): parked-ship colliders from its mesh, its hatch
    setShipShape(parts, hatch)
    {
        for(const planet of this.items)
        {
            planet.shipHatch = hatch
            if(!planet.shipMatrix)
                continue // the station: the hangar pad is the collider (State/InteriorLayout.js)
            planet.colliders = planet.colliders.filter((collider) => !collider.ship)
            const collider = buildCollider(parts, planet.shipMatrix, planet.center)
            if(collider)
            {
                collider.ship = true
                planet.colliders.push(collider)
            }
        }
    }

    get(id)
    {
        return this.items.find((planet) => planet.id === id)
    }

    // Floating origin: move every position by -offset (so `offset` becomes the new origin)
    shiftOrigin(offset)
    {
        if(offset.lengthSq() === 0)
            return

        this.origin.add(offset)
        for(const planet of this.items)
        {
            planet.center.sub(offset)
            planet.landingPoint.sub(offset)
            if(planet.hangar)
            {
                const hangar = planet.hangar
                for(const vector of [ hangar.rest.position, hangar.door, hangar.hover, hangar.gate, hangar.approach ])
                    vector.sub(offset)
            }
            for(const point of planet.interactives)
                point.position.sub(offset)
            for(const prop of planet.props)
                prop.position.sub(offset)
            for(const collider of planet.colliders)
            {
                collider.center.sub(offset)
                collider.camera.center.sub(offset)
            }
        }
        this.earth.center.sub(offset)

        this.events.emit('originShift', offset)
    }

    // Nearest interactive point (content point or launch pad) in range, or null
    findNearest(position)
    {
        let nearest = null
        let nearestDistance = INTERACTION_RADIUS

        for(const point of this.current.interactives)
        {
            const distance = point.position.distanceTo(position)
            if(distance <= nearestDistance)
            {
                nearest = point
                nearestDistance = distance
            }
        }

        return nearest
    }
}
