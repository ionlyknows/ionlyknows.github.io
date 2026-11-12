import * as THREE from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// Ambient crew (M6): clones of the Quaternius astronaut (CC0, already loaded for the player),
// recoloured so they never look like the visitor's astronaut (dark visors, other accents). Each clone's
// skinned parts are merged into one skinned mesh with the palette as vertex colours: one draw call per
// member instead of one per part (15).
export const PALETTES = {
    // Station crew: off-white suits, teal accents
    crew: { SciFi_Main: '#2ec4b6', SciFi_MainDark: '#aab3bd', Grey: '#1b2a3a', HelmetShell: '#e9ecef', HelmetTrim: '#8a96a3' },
    // Forge workers: dark overalls, amber accents
    worker: { SciFi_Main: '#ffb24a', SciFi_MainDark: '#4a4f57', SciFi_Light_Accent: '#8e939b', Grey: '#2a1f14', HelmetShell: '#d8b46a', HelmetTrim: '#6b7079' }
}
const CLIPS = { idle: 'Idle', walk: 'Walk', wave: 'Wave', work: 'Interact' }
const FADE = 0.25
const WALK_CLIP_SPEED = 1.23 // m/s at timeScale 1 (see View/PlayerModel.js)

export function createCrewModel(gltf, palette, { walkSpeed = 1.3, envMap = null } = {})
{
    const root = clone(gltf.scene)
    const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0.15, envMap, envMapIntensity: 0.8 })
    material.userData.useEnvironment = true
    const materials = new Map([ [ 'crew', material ] ])
    mergeSkinned(root, palette, material)

    const mixer = new THREE.AnimationMixer(root)
    const actions = {}
    for(const [ name, clipName ] of Object.entries(CLIPS))
    {
        const found = gltf.animations.find((animation) => animation.name.split('|').pop() === clipName)
        if(found)
            actions[name] = mixer.clipAction(found)
    }
    if(actions.walk)
        actions.walk.timeScale = walkSpeed / WALK_CLIP_SPEED
    if(actions.wave)
    {
        actions.wave.setLoop(THREE.LoopRepeat, Infinity)
    }

    let current = null
    const play = (name) =>
    {
        const next = actions[name] || actions.idle
        if(!next || next === current)
            return
        next.reset().setEffectiveWeight(1).fadeIn(current ? FADE : 0).play()
        current?.fadeOut(FADE)
        current = next
    }
    play('idle')

    return {
        root,
        play,
        update: (delta) => mixer.update(delta),
        dispose: () => materials.forEach((material) => material.dispose())
    }
}

// Every skinned part → one SkinnedMesh on the first part's skeleton and bind matrix (positions moved
// into that bind space), the part's colour (palette, else its own) as a vertex colour
function mergeSkinned(root, palette, material)
{
    const parts = []
    root.traverse((object) =>
    {
        if(object.isSkinnedMesh)
            parts.push(object)
    })
    if(!parts.length)
        return
    const first = parts[0]
    const toFirst = new THREE.Matrix4()
    const color = new THREE.Color()
    const geometries = parts.map((part) =>
    {
        const geometry = part.geometry.clone()
        for(const name of Object.keys(geometry.attributes))
            if(![ 'position', 'normal', 'skinIndex', 'skinWeight' ].includes(name))
                geometry.deleteAttribute(name)
        toFirst.copy(first.bindMatrixInverse).multiply(part.bindMatrix)
        geometry.applyMatrix4(toFirst) // normals follow
        color.set(palette[part.material.name] || part.material.color)
        const colors = new Float32Array(geometry.attributes.position.count * 3)
        for(let i = 0; i < colors.length; i += 3)
            color.toArray(colors, i)
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        return geometry.index ? geometry.toNonIndexed() : geometry
    })
    const merged = new THREE.SkinnedMesh(mergeGeometries(geometries), material)
    merged.castShadow = true
    merged.frustumCulled = false
    first.parent.add(merged)
    merged.bind(first.skeleton, first.bindMatrix)
    for(const part of parts)
        part.removeFromParent()
}
