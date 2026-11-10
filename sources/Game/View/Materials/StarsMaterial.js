import * as THREE from 'three'

import vertexShader from './shaders/stars/vertex.glsl'
import fragmentShader from './shaders/stars/fragment.glsl'

export default function StarsMaterial()
{
    const material = new THREE.ShaderMaterial({
        uniforms:
        {
            uSize: { value: 0.01 },
            uBrightness: { value: 0.5 },
            uHeightFragments: { value: null },
            uIntensity: { value: 1.6 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })

    return material
}
