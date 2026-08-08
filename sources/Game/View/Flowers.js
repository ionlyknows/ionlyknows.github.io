import * as THREE from 'three'

import Game from '@/Game.js'
import View from '@/View/View.js'
import State from '@/State/State.js'
import FlowerMaterial from './Materials/FlowerMaterial.js'

function hash2D(x, y)
{
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123
    return s - Math.floor(s)
}

const SPECIES = [
    {
        name: 'daisy',
        details: 83,
        density: 0.32,
        speciesType: 0,
        petalCount: 10,
        height: 0.48,
        width: 0.26,
        heightRandomness: 0.35,
        headColorA: [0.97, 0.97, 0.93],
        headColorB: [0.85, 0.65, 0.15],
        stemColor: [0.35, 0.45, 0.18],
        hueJitter: 0.15
    },
    {
        name: 'tulip',
        details: 61,
        density: 0.16,
        speciesType: 0,
        petalCount: 6,
        height: 0.75,
        width: 0.30,
        heightRandomness: 0.3,
        headColorA: [0.82, 0.16, 0.22],
        headColorB: [0.92, 0.55, 0.68],
        stemColor: [0.3, 0.5, 0.22],
        hueJitter: 1.0
    },
    {
        name: 'lavender',
        details: 54,
        density: 0.18,
        speciesType: 1,
        petalCount: 5,
        height: 0.80,
        width: 0.14,
        heightRandomness: 0.25,
        headColorA: [0.45, 0.32, 0.62],
        headColorB: [0.58, 0.42, 0.75],
        stemColor: [0.4, 0.48, 0.28],
        hueJitter: 0.35
    },
    {
        name: 'wildflower',
        details: 76,
        density: 0.27,
        speciesType: 0,
        petalCount: 5,
        height: 0.50,
        width: 0.24,
        heightRandomness: 0.5,
        headColorA: [0.85, 0.35, 0.45],
        headColorB: [0.95, 0.8, 0.35],
        stemColor: [0.38, 0.48, 0.2],
        hueJitter: 3.0
    },
    {
        name: 'poppy',
        details: 58,
        density: 0.09,
        speciesType: 0,
        petalCount: 4,
        height: 0.62,
        width: 0.28,
        heightRandomness: 0.35,
        headColorA: [0.75, 0.08, 0.05],
        headColorB: [0.85, 0.35, 0.05],
        stemColor: [0.32, 0.45, 0.18],
        hueJitter: 0.35
    },
    {
        name: 'bluebell',
        details: 58,
        density: 0.13,
        speciesType: 1,
        petalCount: 5,
        height: 0.55,
        width: 0.15,
        heightRandomness: 0.3,
        headColorA: [0.25, 0.35, 0.75],
        headColorB: [0.4, 0.45, 0.85],
        stemColor: [0.32, 0.46, 0.2],
        hueJitter: 0.2
    },
    {
        name: 'buttercup',
        details: 79,
        density: 0.25,
        speciesType: 0,
        petalCount: 5,
        height: 0.28,
        width: 0.16,
        heightRandomness: 0.3,
        headColorA: [0.95, 0.82, 0.15],
        headColorB: [0.99, 0.68, 0.1],
        stemColor: [0.36, 0.46, 0.19],
        hueJitter: 0.1
    }
]

export default class Flowers
{
    constructor()
    {
        this.game = Game.getInstance()
        this.view = View.getInstance()
        this.state = State.getInstance()

        this.time = this.state.time
        this.scene = this.view.scene
        this.noises = this.view.noises

        this.size = 160
        this.noiseTexture = this.noises.create(64, 64)

        this.species = []

        for(const config of SPECIES)
        {
            const species = this.createSpecies(config)
            if(species)
                this.species.push(species)
        }
    }

    generatePositions(config)
    {
        const details = config.details
        const fragmentSize = this.size / details
        const positions = []

        for(let iX = 0; iX < details; iX++)
        {
            const fragmentX = (iX / details - 0.5) * this.size + fragmentSize * 0.5

            for(let iZ = 0; iZ < details; iZ++)
            {
                if(hash2D(iX * 3.11 + config.name.length, iZ * 1.37 + config.name.length) > config.density)
                    continue

                const fragmentZ = (iZ / details - 0.5) * this.size + fragmentSize * 0.5

                positions.push({
                    x: fragmentX + (Math.random() - 0.5) * fragmentSize,
                    z: fragmentZ + (Math.random() - 0.5) * fragmentSize
                })
            }
        }

        return positions
    }

    createGeometry(positions, config)
    {
        const quadPositions = new Float32Array([
            -0.5, 0, 0,
             0.5, 0, 0,
             0.5, 1, 0,
            -0.5, 1, 0
        ])
        const quadUvs = new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            0, 1
        ])
        const quadIndices = [0, 1, 2, 0, 2, 3]

        const geometry = new THREE.BufferGeometry()
        geometry.setIndex(quadIndices)
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(quadPositions, 3))
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(quadUvs, 2))

        const count = positions.length
        const aCenter = new Float32Array(count * 2)
        const aScale = new Float32Array(count)
        const aHue = new Float32Array(count)
        const aSeed = new Float32Array(count)

        for(let i = 0; i < count; i++)
        {
            aCenter[i * 2    ] = positions[i].x
            aCenter[i * 2 + 1] = positions[i].z
            aScale[i] = (1 - config.heightRandomness) + Math.random() * config.heightRandomness
            aHue[i] = (Math.random() - 0.5) * 2 * config.hueJitter
            aSeed[i] = Math.random()
        }

        geometry.setAttribute('aCenter', new THREE.InstancedBufferAttribute(aCenter, 2))
        geometry.setAttribute('aScale', new THREE.InstancedBufferAttribute(aScale, 1))
        geometry.setAttribute('aHue', new THREE.InstancedBufferAttribute(aHue, 1))
        geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(aSeed, 1))

        return geometry
    }

    createSpecies(config)
    {
        const positions = this.generatePositions(config)
        const count = positions.length

        if(count === 0)
            return null

        const geometry = this.createGeometry(positions, config)
        const material = FlowerMaterial(config)

        material.uniforms.uTime.value = 0
        material.uniforms.uFlowerDistance.value = this.size
        material.uniforms.uPlayerPosition.value = new THREE.Vector3()
        material.uniforms.uTerrainSize.value = this.state.chunks.minSize
        material.uniforms.uTerrainTextureSize.value = this.state.terrains.segments
        material.uniforms.uTerrainATexture.value = null
        material.uniforms.uTerrainAOffset.value = new THREE.Vector2()
        material.uniforms.uTerrainBTexture.value = null
        material.uniforms.uTerrainBOffset.value = new THREE.Vector2()
        material.uniforms.uTerrainCTexture.value = null
        material.uniforms.uTerrainCOffset.value = new THREE.Vector2()
        material.uniforms.uTerrainDTexture.value = null
        material.uniforms.uTerrainDOffset.value = new THREE.Vector2()
        material.uniforms.uNoiseTexture.value = this.noiseTexture
        material.uniforms.uFresnelOffset.value = 0
        material.uniforms.uFresnelScale.value = 0.5
        material.uniforms.uFresnelPower.value = 2
        material.uniforms.uSunPosition.value = new THREE.Vector3(- 0.5, - 0.5, - 0.5)

        const mesh = new THREE.InstancedMesh(geometry, material, count)
        mesh.frustumCulled = false
        this.scene.add(mesh)

        return { mesh, material }
    }

    update()
    {
        const playerState = this.state.player
        const playerPosition = playerState.position.current
        const engineChunks = this.state.chunks
        const sunState = this.state.sun

        const aChunkState = engineChunks.getDeepestChunkForPosition(playerPosition[0], playerPosition[2])

        let terrainChunks = null

        if(aChunkState && aChunkState.terrain && aChunkState.terrain.renderInstance.texture)
        {
            const chunkPositionRatioX = (playerPosition[0] - aChunkState.x + aChunkState.size * 0.5) / aChunkState.size
            const chunkPositionRatioZ = (playerPosition[2] - aChunkState.z + aChunkState.size * 0.5) / aChunkState.size

            const bChunkState = aChunkState.neighbours.get(chunkPositionRatioX < 0.5 ? 'w' : 'e')
            const cChunkState = aChunkState.neighbours.get(chunkPositionRatioZ < 0.5 ? 'n' : 's')
            const dChunkState = bChunkState ? bChunkState.neighbours.get(chunkPositionRatioZ < 0.5 ? 'n' : 's') : null

            terrainChunks = { aChunkState, bChunkState, cChunkState, dChunkState }
        }

        for(const { mesh, material } of this.species)
        {
            mesh.position.set(playerPosition[0], 0, playerPosition[2])

            material.uniforms.uTime.value = this.time.elapsed
            material.uniforms.uSunPosition.value.set(sunState.position.x, sunState.position.y, sunState.position.z)
            material.uniforms.uPlayerPosition.value.set(playerPosition[0], playerPosition[1], playerPosition[2])

            if(!terrainChunks)
                continue

            const { aChunkState, bChunkState, cChunkState, dChunkState } = terrainChunks

            material.uniforms.uTerrainATexture.value = aChunkState.terrain.renderInstance.texture
            material.uniforms.uTerrainAOffset.value.set(
                aChunkState.x - aChunkState.size * 0.5,
                aChunkState.z - aChunkState.size * 0.5
            )

            if(bChunkState && bChunkState.terrain && bChunkState.terrain.renderInstance.texture)
            {
                material.uniforms.uTerrainBTexture.value = bChunkState.terrain.renderInstance.texture
                material.uniforms.uTerrainBOffset.value.set(
                    bChunkState.x - bChunkState.size * 0.5,
                    bChunkState.z - bChunkState.size * 0.5
                )
            }

            if(cChunkState && cChunkState.terrain && cChunkState.terrain.renderInstance.texture)
            {
                material.uniforms.uTerrainCTexture.value = cChunkState.terrain.renderInstance.texture
                material.uniforms.uTerrainCOffset.value.set(
                    cChunkState.x - cChunkState.size * 0.5,
                    cChunkState.z - cChunkState.size * 0.5
                )
            }

            if(dChunkState && dChunkState.terrain && dChunkState.terrain.renderInstance.texture)
            {
                material.uniforms.uTerrainDTexture.value = dChunkState.terrain.renderInstance.texture
                material.uniforms.uTerrainDOffset.value.set(
                    dChunkState.x - dChunkState.size * 0.5,
                    dChunkState.z - dChunkState.size * 0.5
                )
            }
        }
    }
}
