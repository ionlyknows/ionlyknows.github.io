import * as THREE from 'three'

import vertexShader from './shaders/atmosphere/vertex.glsl'
import fragmentShader from './shaders/atmosphere/fragment.glsl'

export const ATMOSPHERE_SCALE = 1.05

// Thin scattering shell in the planet's accent color: a thin ring at the limb (back faces)
// plus a faint edge just inside it (front faces), lit by the sun. No haze over the horizon.
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
