import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm'

import Game from '@/Game.js'
import Debug from '@/Debug/Debug.js'
import { loadMixamoAnimationForVRM } from './loadMixamoAnimationForVRM.js'

const VRM_ASSET_PATH = '/models/player/character.vrm'
const ANIMATION_ASSET_PATH = '/models/player/'

const ANIMATION_FILES = {
    idle: 'Idle.fbx',
    dancing: 'Silly_Dancing.fbx',
    running: 'Running.fbx',
    fastRun: 'Fast_Run.fbx',
    runningJump: 'Running_Jump.fbx'
}

const TARGET_HEIGHT = 1.8
const CROSSFADE_DURATION = 0.25
const MODEL_FORWARD_OFFSET = Math.PI

const IDLE_FIDGET_DELAY_MIN = 8
const IDLE_FIDGET_DELAY_MAX = 16

export default class PlayerModel
{
    constructor()
    {
        this.game = Game.getInstance()
        this.debug = Debug.getInstance()

        this.group = new THREE.Group()

        this.ready = false
        this.vrm = null
        this.mixer = null
        this.actions = {}
        this.currentAction = null
        this.currentState = 'idle'

        this.idleTimer = 0
        this.idleFidgetDelay = this.getRandomIdleFidgetDelay()

        this.load()
    }

    getRandomIdleFidgetDelay()
    {
        return THREE.MathUtils.randFloat(IDLE_FIDGET_DELAY_MIN, IDLE_FIDGET_DELAY_MAX)
    }

    async load()
    {
        try
        {
            this.vrm = await this.loadVRM()
            this.setupModel()

            this.mixer = new THREE.AnimationMixer(this.vrm.scene)

            await this.setupAnimations()

            this.ready = true
        }
        catch(error)
        {
            console.error('[PlayerModel] Failed to load VRM character/animations', error)
        }
    }

    loadVRM()
    {
        return new Promise((resolve, reject) =>
        {
            const loader = new GLTFLoader()
            loader.register((parser) => new VRMLoaderPlugin(parser))

            loader.load(
                VRM_ASSET_PATH,
                (gltf) =>
                {
                    const vrm = gltf.userData.vrm

                    VRMUtils.removeUnnecessaryVertices(gltf.scene)
                    VRMUtils.removeUnnecessaryJoints(gltf.scene)
                    VRMUtils.combineSkeletons(gltf.scene)
                    VRMUtils.combineMorphs(vrm)

                    VRMUtils.rotateVRM0(vrm)

                    resolve(vrm)
                },
                undefined,
                (error) => reject(error)
            )
        })
    }

    setupModel()
    {
        const scene = this.vrm.scene

        scene.traverse((child) =>
        {
            child.frustumCulled = false

            if(child.isMesh)
            {
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        scene.scale.setScalar(1)
        const rawHeight = new THREE.Box3().setFromObject(scene).getSize(new THREE.Vector3()).y
        const scale = rawHeight > 0 ? TARGET_HEIGHT / rawHeight : 1
        scene.scale.setScalar(scale)

        const scaledBox = new THREE.Box3().setFromObject(scene)
        scene.position.y -= scaledBox.min.y

        scene.rotation.y = MODEL_FORWARD_OFFSET

        this.group.add(scene)
    }

    async setupAnimations()
    {
        const [ idle, dancing, running, fastRun, runningJump ] = await Promise.all([
            loadMixamoAnimationForVRM(`${ANIMATION_ASSET_PATH}${ANIMATION_FILES.idle}`, this.vrm),
            loadMixamoAnimationForVRM(`${ANIMATION_ASSET_PATH}${ANIMATION_FILES.dancing}`, this.vrm),
            loadMixamoAnimationForVRM(`${ANIMATION_ASSET_PATH}${ANIMATION_FILES.running}`, this.vrm),
            loadMixamoAnimationForVRM(`${ANIMATION_ASSET_PATH}${ANIMATION_FILES.fastRun}`, this.vrm),
            loadMixamoAnimationForVRM(`${ANIMATION_ASSET_PATH}${ANIMATION_FILES.runningJump}`, this.vrm)
        ])

        const clips = { idle, dancing, running, fastRun, runningJump }

        for(const [ name, clip ] of Object.entries(clips))
        {
            if(!clip)
            {
                console.warn(`[PlayerModel] No retargeted clip produced for ${ANIMATION_FILES[name]}`)
                continue
            }

            clip.name = name
            this.actions[name] = this.mixer.clipAction(clip)
        }

        if(this.actions.runningJump)
            this.actions.runningJump.setLoop(THREE.LoopOnce, 1).clampWhenFinished = true

        if(this.actions.idle)
        {
            this.actions.idle.play()
            this.currentAction = this.actions.idle
        }
    }

    setState(name)
    {
        const nextAction = this.actions[name]

        if(!nextAction || this.currentState === name)
            return

        const previousAction = this.currentAction

        nextAction.reset().fadeIn(CROSSFADE_DURATION).play()

        if(previousAction && previousAction !== nextAction)
            previousAction.fadeOut(CROSSFADE_DURATION)

        this.currentAction = nextAction
        this.currentState = name
    }

    updateIdleFidget(delta)
    {
        if(this.currentState !== 'idle' && this.currentState !== 'dancing')
        {
            this.idleTimer = 0
            this.idleFidgetDelay = this.getRandomIdleFidgetDelay()
            this.setState('idle')
            return
        }

        if(this.currentState === 'idle')
        {
            this.idleTimer += delta

            if(this.idleTimer >= this.idleFidgetDelay)
                this.setState('dancing')
        }
    }

    updateAnimationState(playerState, delta)
    {
        if(!playerState.isGrounded)
        {
            this.setState('runningJump')
            return
        }

        if(playerState.isMoving)
        {
            this.setState(playerState.isRunning ? 'fastRun' : 'running')
            return
        }

        this.updateIdleFidget(delta)
    }

    update(playerState, delta)
    {
        if(!this.ready)
            return

        this.updateAnimationState(playerState, delta)

        this.mixer.update(delta)
        this.vrm.update(delta)
    }
}
