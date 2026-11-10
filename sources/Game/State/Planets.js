import * as THREE from 'three'

import config from '@/config/planets.js'

const DEG = Math.PI / 180
const INTERACTION_RADIUS = 3 // BR-03

// Unit direction for a { lat, long } point (degrees). long 0 / lat 0 = +Z.
export function latLongToDirection({ lat, long }, target = new THREE.Vector3())
{
    const cosLat = Math.cos(lat * DEG)
    return target.set(cosLat * Math.sin(long * DEG), Math.sin(lat * DEG), cosLat * Math.cos(long * DEG))
}

export default class Planets
{
    constructor()
    {
        this.items = config.map((planet) =>
        {
            const center = new THREE.Vector3().fromArray(planet.center)
            const surfacePoint = (position) => latLongToDirection(position).multiplyScalar(planet.radius).add(center)

            const props = planet.props.map((prop) => ({
                type: prop.type,
                size: prop.size,
                position: surfacePoint(prop.position),
                up: latLongToDirection(prop.position)
            }))

            return {
                id: planet.id,
                name: planet.name,
                center,
                radius: planet.radius,
                color: planet.color,
                landingPoint: surfacePoint(planet.landingPoint),
                contentPoints: planet.contentPoints.map((point) => ({
                    id: point.id,
                    opens: point.opens,
                    position: surfacePoint(point.position),
                    up: latLongToDirection(point.position)
                })),
                props,
                colliders: props.map((prop) => ({ center: prop.position, radius: prop.size }))
            }
        })

        this.current = this.items[0]
        this.nearest = null
    }

    // Nearest content point within the interaction radius, or null
    findNearest(position)
    {
        let nearest = null
        let nearestDistance = INTERACTION_RADIUS

        for(const point of this.current.contentPoints)
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
