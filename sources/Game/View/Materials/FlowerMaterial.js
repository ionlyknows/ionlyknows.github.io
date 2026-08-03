import * as THREE from 'three'

import vertexShader from './shaders/flowers/vertex.glsl'
import fragmentShader from './shaders/flowers/fragment.glsl'

export default function FlowerMaterial(config)
{
    const material = new THREE.ShaderMaterial({
        uniforms:
        {
            uTime: { value: null },
            uFlowerDistance: { value: null },
            uPlayerPosition: { value: null },
            uTerrainSize: { value: null },
            uTerrainTextureSize: { value: null },
            uTerrainATexture: { value: null },
            uTerrainAOffset: { value: null },
            uTerrainBTexture: { value: null },
            uTerrainBOffset: { value: null },
            uTerrainCTexture: { value: null },
            uTerrainCOffset: { value: null },
            uTerrainDTexture: { value: null },
            uTerrainDOffset: { value: null },
            uNoiseTexture: { value: null },
            uFresnelOffset: { value: null },
            uFresnelScale: { value: null },
            uFresnelPower: { value: null },
            uSunPosition: { value: null },
            uFlowerHeight: { value: config.height },
            uFlowerWidth: { value: config.width },
            uHeadColorA: { value: new THREE.Color(...config.headColorA) },
            uHeadColorB: { value: new THREE.Color(...config.headColorB) },
            uStemColor: { value: new THREE.Color(...config.stemColor) },
            uSpeciesType: { value: config.speciesType },
            uPetalCount: { value: config.petalCount }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide
    })

    return material
}
