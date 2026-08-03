import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

import { mixamoVRMRigMap } from './mixamoVRMRigMap.js'

/**
 * Strips baked-in horizontal root motion from the retargeted Hips position track.
 * Mixamo clips are sometimes exported with the hips drifting forward in local space;
 * since the game already drives horizontal movement itself (State/Player.js), leaving
 * that drift in would double the translation and make the character slide/moonwalk.
 * Vertical (Y) motion is preserved so walk-cycle bob and jump arc still read correctly.
 */
function stripHorizontalRootMotion(track)
{
    const values = track.values
    const startX = values[0]
    const startZ = values[2]

    for(let i = 0; i < values.length; i += 3)
    {
        values[i] = startX
        values[i + 2] = startZ
    }
}

/**
 * Loads a Mixamo FBX animation and retargets it onto a VRM's normalized humanoid bones.
 * Adapted from the official pixiv/three-vrm "humanoidAnimation" example
 * (packages/three-vrm/examples/humanoidAnimation/loadMixamoAnimation.js).
 *
 * @param {string} url URL of the Mixamo FBX animation
 * @param {import('@pixiv/three-vrm').VRM} vrm The target VRM to retarget onto
 * @returns {Promise<THREE.AnimationClip|null>}
 */
export async function loadMixamoAnimationForVRM(url, vrm)
{
    const loader = new FBXLoader()
    const asset = await loader.loadAsync(url)

    const clip = THREE.AnimationClip.findByName(asset.animations, 'mixamo.com') ?? asset.animations[0]

    if(!clip)
        return null

    const tracks = []

    const restRotationInverse = new THREE.Quaternion()
    const parentRestWorldRotation = new THREE.Quaternion()
    const quatA = new THREE.Quaternion()

    // Adjust translation amplitude with reference to hips height, so the retargeted
    // motion scales to this VRM's proportions instead of the Mixamo skeleton's.
    const motionHipsHeight = asset.getObjectByName('mixamorigHips').position.y
    const vrmHipsHeight = vrm.humanoid.normalizedRestPose.hips.position[1]
    const hipsPositionScale = vrmHipsHeight / motionHipsHeight

    clip.tracks.forEach((track) =>
    {
        const [ mixamoRigName, propertyName ] = track.name.split('.')
        const vrmBoneName = mixamoVRMRigMap[mixamoRigName]
        const vrmNodeName = vrm.humanoid?.getNormalizedBoneNode(vrmBoneName)?.name
        const mixamoRigNode = asset.getObjectByName(mixamoRigName)

        if(vrmNodeName == null || mixamoRigNode == null)
            return

        // VRM 0.x models are authored facing +Z (opposite of VRM 1.0's -Z convention),
        // so retargeted coordinates need an extra flip on legacy files. Inactive for
        // VRM 1.0 assets (like this one), kept for correctness if a VRM0 file is ever
        // swapped in. Mirrors PlayerModel's VRMUtils.rotateVRM0() call for consistency.
        const isLegacyVRM0 = vrm.meta?.metaVersion === '0'

        if(track instanceof THREE.QuaternionKeyframeTrack)
        {
            // Store rest-pose rotations, used to re-express each keyframe relative to
            // the VRM's own rest pose instead of the Mixamo skeleton's rest pose.
            mixamoRigNode.getWorldQuaternion(restRotationInverse).invert()
            mixamoRigNode.parent.getWorldQuaternion(parentRestWorldRotation)

            for(let i = 0; i < track.values.length; i += 4)
            {
                quatA.fromArray(track.values, i)
                quatA.premultiply(parentRestWorldRotation).multiply(restRotationInverse)
                quatA.toArray(track.values, i)
            }

            const values = track.values.map((v, i) => (isLegacyVRM0 && i % 2 === 0 ? -v : v))

            const newTrack = new THREE.QuaternionKeyframeTrack(
                `${vrmNodeName}.${propertyName}`,
                track.times,
                values
            )

            tracks.push(newTrack)
        }
        else if(track instanceof THREE.VectorKeyframeTrack)
        {
            const values = track.values.map((v, i) => (isLegacyVRM0 && i % 3 !== 1 ? -v : v) * hipsPositionScale)
            const newTrack = new THREE.VectorKeyframeTrack(`${vrmNodeName}.${propertyName}`, track.times, values)

            if(propertyName === 'position' && /hips/i.test(vrmNodeName))
                stripHorizontalRootMotion(newTrack)

            tracks.push(newTrack)
        }
    })

    return new THREE.AnimationClip(clip.name, clip.duration, tracks)
}
