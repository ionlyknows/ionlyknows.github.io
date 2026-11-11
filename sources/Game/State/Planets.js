import * as THREE from 'three'
import EventsEmitter from 'events'

import config, { earth, spawnPlanetId, sunDirection } from '../config/planets.js'
import locations from '../../content/locations.js'
import { PROP_BUILDERS, MARKER_SHAPES, SHIP_SHAPE, propMatrix, buildCollider, shipRestPose } from './PropShapes.js'

const DEG = Math.PI / 180
const INTERACTION_RADIUS = 3 // BR-03

const _yAxis = new THREE.Vector3(0, 1, 0)

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

            return {
                id: planet.id,
                name: locations.find((location) => location.id === planet.id)?.name || '',
                center,
                radius: planet.radius,
                color: planet.color,
                accent: planet.accent,
                landingPoint,
                contentPoints,
                launchPad,
                interactives: [ ...contentPoints, launchPad ],
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
