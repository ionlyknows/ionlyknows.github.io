import * as THREE from 'three'

import View from '@/View/View.js'
import State from '@/State/State.js'
import Debug from '@/Debug/Debug.js'
import StarsMaterial from './Materials/StarsMaterial.js'

// Empty space backdrop: a starfield that follows the player so it always
// looks infinitely far away. The sky/nebula is replaced in M2.
export default class Space
{
    constructor()
    {
        this.view = View.getInstance()
        this.state = State.getInstance()
        this.debug = Debug.getInstance()

        this.viewport = this.state.viewport
        this.scene = this.view.scene

        this.group = new THREE.Group()
        this.scene.add(this.group)

        this.setStars()
        this.setDebug()
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

                color.setHSL(Math.random(), 1, 0.5 + Math.random() * 0.5)
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

        this.stars.points = new THREE.Points(this.stars.geometry, this.stars.material)
        this.stars.points.frustumCulled = false
        this.group.add(this.stars.points)
    }

    setDebug()
    {
        if(!this.debug.active)
            return

        const starsFolder = this.debug.ui.getFolder('view/space/stars')

        starsFolder.add(this.stars, 'count').min(100).max(50000).step(100).name('count').onChange(() => { this.stars.update() })
        starsFolder.add(this.stars.material.uniforms.uSize, 'value').min(0).max(1).step(0.0001).name('uSize')
        starsFolder.add(this.stars.material.uniforms.uBrightness, 'value').min(0).max(1).step(0.001).name('uBrightness')
    }

    update()
    {
        const position = this.state.player.position.current
        this.group.position.set(position[0], position[1], position[2])
    }

    resize()
    {
        this.stars.material.uniforms.uHeightFragments.value = this.viewport.height * this.viewport.clampedPixelRatio
    }
}
