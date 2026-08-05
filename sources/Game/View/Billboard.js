import * as THREE from 'three'

// Single source of truth for where the billboard lives and where the player
// should stand to view it. Placed a short walk from spawn (~[10, 0, 1], see
// State/Player.js). Consumed by both this module (to build the mesh) and
// State/Teleporter.js (to know where to fly the player/camera).
export const BILLBOARD = {
    structurePosition: [ 10, 0, -20 ],
    viewpoint: {
        x: 10,
        z: -10,
        rotation: 0,   // player facing (0 = -Z, matches Player.js's forward convention)
        theta: 0,      // camera orbit angle -> sits behind the player looking toward -Z
        phi: Math.PI * 0.42,
        distance: 11
    },
    color: 0xff8a3d
}

export default class Billboard
{
    constructor(scene)
    {
        this.scene = scene
        this.group = new THREE.Group()
        this.group.position.set(...BILLBOARD.structurePosition)

        this.buildFrame()
        this.buildScreen()

        this.scene.add(this.group)
    }

    buildFrame()
    {
        const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x14181d })

        const panel = new THREE.Mesh(new THREE.BoxGeometry(9, 5.5, 0.4), frameMaterial)
        panel.position.y = 3.2
        this.group.add(panel)

        const legGeometry = new THREE.BoxGeometry(0.35, 3.2, 0.35)
        const legLeft = new THREE.Mesh(legGeometry, frameMaterial)
        legLeft.position.set(-3.4, 1.4, 0)
        const legRight = legLeft.clone()
        legRight.position.x = 3.4
        this.group.add(legLeft, legRight)
    }

    buildScreen()
    {
        const screenGeometry = new THREE.PlaneGeometry(8.2, 4.6)
        const screenMaterial = new THREE.MeshBasicMaterial({
            color: BILLBOARD.color,
            transparent: true,
            opacity: 0.16
        })
        this.screen = new THREE.Mesh(screenGeometry, screenMaterial)
        this.screen.position.set(0, 3.2, 0.21)
        this.group.add(this.screen)

        const rim = new THREE.LineSegments(
            new THREE.EdgesGeometry(screenGeometry),
            new THREE.LineBasicMaterial({ color: BILLBOARD.color })
        )
        rim.position.copy(this.screen.position)
        this.group.add(rim)
    }

    update(elapsedTime)
    {
        // Idle glow so it reads as "alive"/interactive from a distance.
        this.screen.material.opacity = 0.13 + Math.sin(elapsedTime * 1.1) * 0.05
    }
}
