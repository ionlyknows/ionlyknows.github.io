import * as THREE from 'three'

let gradientMap = null

// Shared 3-step toon ramp
export function toonMaterial(parameters = {})
{
    if(!gradientMap)
    {
        gradientMap = new THREE.DataTexture(new Uint8Array([ 90, 170, 255 ]), 3, 1, THREE.RedFormat)
        gradientMap.minFilter = THREE.NearestFilter
        gradientMap.magFilter = THREE.NearestFilter
        gradientMap.generateMipmaps = false
        gradientMap.needsUpdate = true
    }

    return new THREE.MeshToonMaterial({ gradientMap, ...parameters })
}

// Per-face normals for the low-poly look (MeshToonMaterial has no flatShading)
export function flat(geometry)
{
    const flatGeometry = geometry.index ? geometry.toNonIndexed() : geometry
    if(flatGeometry !== geometry)
        geometry.dispose()
    flatGeometry.computeVertexNormals()
    return flatGeometry
}
