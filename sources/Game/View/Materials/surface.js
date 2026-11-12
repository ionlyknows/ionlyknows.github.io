import * as THREE from 'three'

// Triplanar PBR surface (no UV seams at the poles). CC0 texture sets from ambientCG,
// see CREDITS.md. Each set = albedo (sRGB) + packed normal-rough (R,G = normal, B = roughness).
// 1K loads before Launch; High swaps every set to 2K lazily (setSurfaceResolution).
const SETS = [ 'regolith', 'volcanic', 'ice', 'sand', 'metal' ]
const BASE = `${import.meta.env.BASE_URL}textures/surfaces/`

const loader = new THREE.TextureLoader()
const cache = {} // "1k/regolith" → Promise<{ albedo, normalRough }>
let wanted = '1k'

// Neutral 1×1 placeholders (mid-grey albedo, flat normal, rough) until a set has loaded
function placeholder(r, g, b, colorSpace)
{
    const texture = new THREE.DataTexture(new Uint8Array([ r, g, b, 255 ]), 1, 1)
    texture.colorSpace = colorSpace
    texture.needsUpdate = true
    return texture
}
const PLACEHOLDER = { albedo: placeholder(128, 128, 128, THREE.SRGBColorSpace), normalRough: placeholder(128, 128, 255, THREE.NoColorSpace) }

// Shared uniforms per set: swapping `.value` updates every material that uses the set
const uniforms = Object.fromEntries(SETS.map((set) => [ set, { albedo: { value: PLACEHOLDER.albedo }, normalRough: { value: PLACEHOLDER.normalRough } } ]))

// Uploads a texture before it is used (View.upload: one per task, so no frame uploads a set)
let uploader = null
export function setTextureUploader(upload)
{
    uploader = upload
}

// Shared clock for the lava pulse (Planets.update sets it)
export const surfaceTime = { value: 0 }

function loadTexture(url, colorSpace)
{
    return new Promise((resolve) =>
    {
        loader.load(url, (texture) =>
        {
            texture.wrapS = THREE.RepeatWrapping
            texture.wrapT = THREE.RepeatWrapping
            texture.colorSpace = colorSpace
            texture.anisotropy = 8
            resolve(texture)
        }, undefined, () =>
        {
            console.warn(`[surface] Could not load ${url}`)
            resolve(null)
        })
    })
}

function loadSet(resolution, set)
{
    const key = `${resolution}/${set}`
    if(!cache[key])
    {
        cache[key] = Promise.all([
            loadTexture(`${BASE}${set}/${resolution}/albedo.webp`, THREE.SRGBColorSpace),
            loadTexture(`${BASE}${set}/${resolution}/normal-rough.webp`, THREE.NoColorSpace)
        ]).then(([ albedo, normalRough ]) => ({ albedo, normalRough }))
    }
    return cache[key]
}

// Load `sets` at `resolution` and use each one as soon as it arrives (unless another
// resolution was asked for meanwhile). Before Launch only the spawn planet's sets load.
export function setSurfaceResolution(resolution, sets = SETS)
{
    wanted = resolution
    return Promise.all(sets.map(async (set) =>
    {
        const maps = await loadSet(resolution, set)
        if(uploader)
            for(const texture of [ maps.albedo, maps.normalRough ])
                if(texture)
                    await uploader(texture)
        if(wanted !== resolution)
            return
        if(maps.albedo)
            uniforms[set].albedo.value = maps.albedo
        if(maps.normalRough)
            uniforms[set].normalRough.value = maps.normalRough
    }))
}

const NOISE = /* glsl */`
float tpHash(vec3 p)
{
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float tpNoise(vec3 x)
{
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(mix(tpHash(i), tpHash(i + vec3(1, 0, 0)), f.x), mix(tpHash(i + vec3(0, 1, 0)), tpHash(i + vec3(1, 1, 0)), f.x), f.y),
        mix(mix(tpHash(i + vec3(0, 0, 1)), tpHash(i + vec3(1, 0, 1)), f.x), mix(tpHash(i + vec3(0, 1, 1)), tpHash(i + vec3(1, 1, 1)), f.x), f.y),
        f.z);
}

float tpFbm(vec3 p)
{
    float value = 0.0;
    float amplitude = 0.5;
    for(int i = 0; i < 4; i++)
    {
        value += amplitude * tpNoise(p);
        p *= 2.03;
        amplitude *= 0.5;
    }
    return value;
}
`

function patch(shader, materialUniforms)
{
    Object.assign(shader.uniforms, materialUniforms)

    shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vTpPosition;\nvarying vec3 vTpNormal;')
        .replace('#include <worldpos_vertex>', `#include <worldpos_vertex>
            vec4 tpWorld = vec4(transformed, 1.0);
            vec3 tpObjectNormal = objectNormal;
            #ifdef USE_INSTANCING
                tpWorld = instanceMatrix * tpWorld;
                tpObjectNormal = mat3(instanceMatrix) * tpObjectNormal;
            #endif
            vTpPosition = (modelMatrix * tpWorld).xyz;
            vTpNormal = normalize(mat3(modelMatrix) * tpObjectNormal);`)

    shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>
            uniform sampler2D uAlbedo;
            uniform sampler2D uNormalRough;
            uniform float uScale;
            uniform float uNormalScale;
            uniform float uVariation;
            uniform float uCrackIntensity;
            uniform float uTime;
            varying vec3 vTpPosition;
            varying vec3 vTpNormal;
            ${NOISE}`)
        .replace('#include <map_fragment>', `
            vec3 tpN = normalize(vTpNormal);
            vec3 tpWeights = pow(abs(tpN), vec3(4.0));
            tpWeights /= tpWeights.x + tpWeights.y + tpWeights.z;
            vec3 tpSign = step(0.0, tpN) * 2.0 - 1.0;

            vec3 tpP = vTpPosition * uScale;
            vec2 uvX = vec2(tpP.z * tpSign.x, tpP.y);
            vec2 uvY = vec2(tpP.x * tpSign.y, tpP.z);
            vec2 uvZ = vec2(- tpP.x * tpSign.z, tpP.y);

            vec3 tpAlbedo = texture2D(uAlbedo, uvX).rgb * tpWeights.x + texture2D(uAlbedo, uvY).rgb * tpWeights.y + texture2D(uAlbedo, uvZ).rgb * tpWeights.z;
            vec3 nrX = texture2D(uNormalRough, uvX).rgb;
            vec3 nrY = texture2D(uNormalRough, uvY).rgb;
            vec3 nrZ = texture2D(uNormalRough, uvZ).rgb;
            float tpRough = nrX.b * tpWeights.x + nrY.b * tpWeights.y + nrZ.b * tpWeights.z;

            // Whiteout-blended triplanar normal (world space)
            vec2 tX = (nrX.rg * 2.0 - 1.0) * uNormalScale;
            vec2 tY = (nrY.rg * 2.0 - 1.0) * uNormalScale;
            vec2 tZ = (nrZ.rg * 2.0 - 1.0) * uNormalScale;
            tX.x *= tpSign.x;
            tY.x *= tpSign.y;
            tZ.x *= - tpSign.z;
            vec3 tnX = vec3(tX + tpN.zy, sqrt(max(0.0, 1.0 - dot(tX, tX))) * tpN.x);
            vec3 tnY = vec3(tY + tpN.xz, sqrt(max(0.0, 1.0 - dot(tY, tY))) * tpN.y);
            vec3 tnZ = vec3(tZ + tpN.xy, sqrt(max(0.0, 1.0 - dot(tZ, tZ))) * tpN.z);
            vec3 tpWorldNormal = normalize(tnX.zyx * tpWeights.x + tnY.xzy * tpWeights.y + tnZ.xyz * tpWeights.z);

            // Large-scale color variation so the tiling never reads
            float tpLarge = tpFbm(vTpPosition * 0.07);
            diffuseColor.rgb *= tpAlbedo * mix(1.0 - uVariation, 1.0 + uVariation, tpLarge);

            // Lava (The Forge): thin cracks along the zero lines of a noise field (ridged:
            // 1 - |noise|, sharpened), ~13% of the surface, plus finer branches next to them.
            // The branches use 2 octaves only: a third fbm makes ANGLE's D3D compiler stall.
            #ifdef USE_CRACKS
                float tpMain = abs(tpFbm(vTpPosition * 0.16) * 2.0 - 0.86);
                vec3 tpFineP = vTpPosition * 0.5 + 7.3;
                float tpFine = abs((tpNoise(tpFineP) * 0.65 + tpNoise(tpFineP * 2.03) * 0.35) * 2.0 - 1.0);
                float tpCrack = pow(clamp(1.0 - tpMain / 0.04, 0.0, 1.0), 3.0);
                float tpBranch = pow(clamp(1.0 - tpFine / 0.045, 0.0, 1.0), 3.0) * (1.0 - smoothstep(0.0, 0.25, tpMain)) * 0.6;
                tpCrack = max(tpCrack, tpBranch);
                diffuseColor.rgb *= 1.0 - smoothstep(0.0, 0.5, tpCrack) * 0.85;
            #endif`)
        .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = roughness * tpRough;')
        .replace('#include <normal_fragment_maps>', 'normal = normalize((viewMatrix * vec4(tpWorldNormal, 0.0)).xyz);')
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
            #ifdef USE_CRACKS
                // Deep orange at the edges, yellow-hot at the centers (only those reach the bloom threshold); ±10% pulse
                vec3 tpLava = mix(vec3(1.0, 0.22, 0.03), vec3(1.0, 0.75, 0.3), tpCrack * tpCrack) * tpCrack;
                float tpPulse = 1.0 + 0.1 * sin(uTime * 1.6 + tpLarge * 12.0);
                totalEmissiveRadiance += tpLava * uCrackIntensity * tpPulse;
            #endif`)
}

// set: texture set name. scale: texture repeats per world unit.
// cracks: emissive intensity at the lava crack centers (The Forge), or null.
export function createSurfaceMaterial({ set, scale = 0.25, normalScale = 1, variation = 0.2, cracks = null, ...parameters })
{
    const material = new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0, ...parameters })

    const materialUniforms = {
        uAlbedo: uniforms[set].albedo,
        uNormalRough: uniforms[set].normalRough,
        uScale: { value: scale },
        uNormalScale: { value: normalScale },
        uVariation: { value: variation },
        uCrackIntensity: { value: cracks || 0 },
        uTime: surfaceTime
    }
    if(cracks)
        material.defines = { USE_CRACKS: '' }

    material.onBeforeCompile = (shader) => patch(shader, materialUniforms)
    material.customProgramCacheKey = () => 'triplanar'

    return material
}
