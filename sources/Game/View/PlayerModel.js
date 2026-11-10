import * as THREE from 'three'

const TARGET_HEIGHT = 1.8
const RADIUS = 0.35

// Placeholder player: a simple orange capsule (the old VRM character was removed).
export default class PlayerModel
{
    constructor()
    {
        this.group = new THREE.Group()

        const capsule = new THREE.Mesh(
            new THREE.CapsuleGeometry(RADIUS, TARGET_HEIGHT - RADIUS * 2, 8, 16),
            new THREE.MeshStandardMaterial({ color: '#ff8a3d', roughness: 0.6 })
        )
        capsule.position.y = TARGET_HEIGHT / 2
        capsule.castShadow = true
        capsule.receiveShadow = true
        this.group.add(capsule)

        this.ready = true
    }

    update()
    {
    }
}
