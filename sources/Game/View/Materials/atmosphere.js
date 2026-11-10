import * as THREE from 'three'

import vertexShader from './shaders/atmosphere/vertex.glsl'
import fragmentShader from './shaders/atmosphere/fragment.glsl'

export const ATMOSPHERE_SCALE = 1.08

// Thin scattering shell in the planet's accent color: a ring outside the limb (back faces)
// plus a haze over the disc that rises toward the limb (front faces), lit by the sun.
export function createAtmosphere(radius, color, intensity, sunDirection)
{
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uColor: { value: new THREE.Color(color) },
            uIntensity: { value: intensity },
            uLimb: { value: Math.sqrt(1 - 1 / (ATMOSPHERE_SCALE * ATMOSPHERE_SCALE)) },
            uSunDirection: { value: sunDirection }
        },
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    })

    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius * ATMOSPHERE_SCALE, 64, 32), material)
    mesh.userData.baseIntensity = intensity
    return mesh
}
