import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

import View from '@/View/View.js'
import State from '@/State/State.js'

// Astronaut mascot (M4): Quaternius "Astronaut" (CC0, see CREDITS.md), meshopt-compressed in
// public/models/astronaut.glb, recoloured here to the Apeiron palette.
const MODEL_URL = `${import.meta.env.BASE_URL}models/astronaut.glb`
const LOOK = {
    SciFi_Light_Accent: { color: '#e9e5dc', roughness: 0.8, metalness: 0, envMapIntensity: 0.5 }, // off-white suit fabric
    SciFi_Light: { color: '#d2d5da', roughness: 0.5, metalness: 0.3, envMapIntensity: 0.6 }, // light-grey panels
    SciFi_MainDark: { color: '#c9ccd1', roughness: 0.75, metalness: 0, envMapIntensity: 0.5 }, // light-grey fabric (legs, sleeves)
    SciFi_Main: { color: '#ff7a2e', roughness: 0.6, metalness: 0, envMapIntensity: 0.5 }, // orange accents
    Grey: { color: '#8c6a24', roughness: 0.12, metalness: 1, envMapIntensity: 1.2 } // reflective dark-gold visor
}
// Our action → the model's clip ("CharacterArmature|Idle" …). `jump` is built from Run (see below).
const CLIPS = { idle: 'Idle', walk: 'Walk', run: 'Run', emote: 'Wave', board: 'Interact' }
const FADE = 0.2 // s crossfade
// Ground speed of the clips at timeScale 1 (measured from the feet), so the feet don't slide
const WALK_CLIP_SPEED = 1.23
const RUN_CLIP_SPEED = 2.73
const WALK_MAX = 3.2 // m/s: above this the run clip plays
const RUN_MAX_SCALE = 2.6 // sprinting (10 m/s) would need 3.7×: cap it, a little sliding beats frantic legs
const JUMP_POSE_TIME = 0.29 // s into Run: feet furthest apart, held as the in-air leap pose

const _right = new THREE.Vector3()
const _facing = new THREE.Vector3()
const _matrix = new THREE.Matrix4()

function damp(current, target, speed, delta)
{
    return current + (target - current) * (1 - Math.exp(- speed * delta))
}

// The astronaut. Loads the GLB mascot during the loading screen and plays its clips with
// crossfades driven by the real speed; until then, or if it fails to load, the code-built
// placeholder (procedural animation) is shown. Feet at the origin, facing +Z.
export default class PlayerModel
{
    constructor()
    {
        this.view = View.getInstance()
        this.state = State.getInstance()
        this.scene = this.view.scene

        this.moveBlend = 0
        this.phase = 0
        this.airBlend = 0
        this.squash = 0
        this.wasGrounded = true

        this.character = null // GLB root (null = placeholder)
        this.mixer = null
        this.actions = {}
        this.current = null
        this.emoting = false

        this.setModel()
    }

    // Called by View.load(): resolves either way (the placeholder stays on failure)
    load()
    {
        const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
        return loader.loadAsync(MODEL_URL)
            .then((gltf) => this.setCharacter(gltf))
            .catch((error) => console.warn('[PlayerModel] Astronaut model failed to load, keeping the placeholder', error))
    }

    setCharacter(gltf)
    {
        const root = gltf.scene
        const materials = new Map()
        root.traverse((object) =>
        {
            if(!object.isMesh)
                return
            object.castShadow = true
            object.frustumCulled = false // skinned: the bind-pose bounds don't follow the animation
            const look = LOOK[object.material.name]
            if(look && !materials.has(object.material))
            {
                const material = object.material
                material.color.set(look.color)
                material.roughness = look.roughness
                material.metalness = look.metalness
                material.envMapIntensity = look.envMapIntensity
                material.userData.useEnvironment = true
                material.envMap = this.view.environment || this.view.environmentPlaceholder || null
                materials.set(material, true)
            }
        })

        this.mixer = new THREE.AnimationMixer(root)
        const clip = (name) => gltf.animations.find((animation) => animation.name.split('|').pop() === name)
        for(const [ action, name ] of Object.entries(CLIPS))
        {
            const found = clip(name)
            if(found)
                this.actions[action] = this.mixer.clipAction(found)
        }

        // Jump: the leap pose of the run clip, held (one keyframe per track)
        const run = clip(CLIPS.run)
        if(run)
        {
            const tracks = run.tracks.map((track) =>
            {
                const value = track.createInterpolant().evaluate(JUMP_POSE_TIME).slice()
                return new track.constructor(track.name, [ 0 ], value)
            })
            this.actions.jump = this.mixer.clipAction(new THREE.AnimationClip('jump', 1, tracks))
        }

        for(const name of [ 'emote', 'board' ])
        {
            const action = this.actions[name]
            if(!action)
                continue
            action.setLoop(THREE.LoopOnce, 1)
            action.clampWhenFinished = true
        }
        this.mixer.addEventListener('finished', (event) =>
        {
            if(event.action === this.actions.emote)
                this.emoting = false
        })

        if(!this.actions.idle || !this.actions.walk || !this.actions.run)
        {
            console.warn('[PlayerModel] Astronaut clips missing, keeping the placeholder')
            this.mixer = null
            this.actions = {}
            return
        }

        // Swap: the GLB takes the placeholder's place (same pivot, so squash/stretch still apply)
        this.body.visible = false
        this.character = new THREE.Group()
        this.character.add(root)
        this.group.add(this.character)
        this.play('idle', 0)
    }

    play(name, fade = FADE)
    {
        const next = this.actions[name]
        if(!next || next === this.current)
            return
        next.reset().setEffectiveWeight(1).fadeIn(fade).play()
        if(this.current)
            this.current.fadeOut(fade)
        this.current = next
    }

    // Secret dance (easter egg): the wave, once
    playEmote()
    {
        if(!this.actions.emote)
            return
        this.emoting = true
        this.current = null // restart even if it was the last one
        this.play('emote')
    }

    updateCharacter(delta)
    {
        const player = this.state.player
        const flight = this.state.flight
        const speed = player.speed

        let name
        if(flight.phase === 'boarding')
            name = 'board'
        else if(!player.isGrounded)
            name = 'jump'
        else if(this.emoting && !player.isMoving)
            name = 'emote'
        else if(!player.isMoving)
            name = 'idle'
        else
            name = speed < WALK_MAX ? 'walk' : 'run'

        if(name !== 'emote')
            this.emoting = false
        this.play(name)

        // Feet move at the ground speed (no sliding at walking speed)
        this.actions.walk.timeScale = THREE.MathUtils.clamp(speed / WALK_CLIP_SPEED, 0.5, 2.6)
        this.actions.run.timeScale = THREE.MathUtils.clamp(speed / RUN_CLIP_SPEED, 0.8, RUN_MAX_SCALE)
        this.mixer.update(delta)
    }

    setModel()
    {
        const suit = new THREE.MeshStandardMaterial({ color: '#ebe7df', roughness: 0.8, metalness: 0, envMapIntensity: 0.5, userData: { useEnvironment: true } })
        const accent = new THREE.MeshStandardMaterial({ color: '#ff7a2e', roughness: 0.6, metalness: 0, envMapIntensity: 0.5, userData: { useEnvironment: true } })
        // Reflective dark gold visor
        const visor = new THREE.MeshStandardMaterial({ color: '#8c6a24', roughness: 0.1, metalness: 1, envMapIntensity: 1.6, userData: { useEnvironment: true } })

        const part = (geometry, material, x, y, z, parent) =>
        {
            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.set(x, y, z)
            mesh.castShadow = true
            parent.add(mesh)
            return mesh
        }

        const limb = (x, y, length, radius, material, parent) =>
        {
            const pivot = new THREE.Group()
            pivot.position.set(x, y, 0)
            part(new THREE.CapsuleGeometry(radius, length, 4, 12), material, 0, - (length * 0.5 + radius), 0, pivot)
            parent.add(pivot)
            return pivot
        }

        this.group = new THREE.Group()
        this.scene.add(this.group)

        // Body pivot at the feet: bob, lean and squash/stretch happen here
        this.body = new THREE.Group()
        this.group.add(this.body)

        this.legLeft = limb(0.16, 0.5, 0.24, 0.13, suit, this.body)
        this.legRight = limb(- 0.16, 0.5, 0.24, 0.13, suit, this.body)

        part(new THREE.CapsuleGeometry(0.32, 0.3, 6, 20), suit, 0, 0.85, 0, this.body)
        part(new THREE.CylinderGeometry(0.34, 0.34, 0.1, 24), accent, 0, 0.72, 0, this.body) // belt
        part(new THREE.BoxGeometry(0.46, 0.5, 0.22), accent, 0, 0.95, - 0.32, this.body) // backpack

        this.armLeft = limb(0.4, 1.12, 0.22, 0.1, suit, this.body)
        this.armRight = limb(- 0.4, 1.12, 0.22, 0.1, suit, this.body)

        part(new THREE.SphereGeometry(0.42, 32, 24), suit, 0, 1.45, 0, this.body) // helmet
        const visorMesh = part(new THREE.SphereGeometry(0.3, 32, 24), visor, 0, 1.47, 0.22, this.body)
        visorMesh.scale.set(1, 0.72, 0.62)

        // Soft contact shadow under the feet (stays on the ground while jumping)
        const canvas = document.createElement('canvas')
        canvas.width = 64
        canvas.height = 64
        const context = canvas.getContext('2d')
        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)')
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        context.fillStyle = gradient
        context.fillRect(0, 0, 64, 64)

        this.contactShadow = new THREE.Mesh(
            new THREE.PlaneGeometry(1.4, 1.4),
            new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: - 2 })
        )
        this.contactShadow.rotation.x = - Math.PI / 2
        this.contactShadow.renderOrder = 1
        this.group.add(this.contactShadow)
    }

    update()
    {
        const player = this.state.player
        const delta = this.state.time.delta
        const elapsed = this.state.time.elapsed

        // Align up to the player's up, face the movement direction (+Z = facing)
        // Exactly the interpolated physics position (no extra smoothing here)
        _facing.copy(player.facing).projectOnPlane(player.renderUp).normalize()
        _right.crossVectors(player.renderUp, _facing)
        _matrix.makeBasis(_right, player.renderUp, _facing)
        this.group.quaternion.setFromRotationMatrix(_matrix)
        this.group.position.copy(player.renderPosition)

        // Boarding the ship: the astronaut shrinks into the hatch; hidden in flight
        this.group.visible = player.visibility > 0.01
        this.group.scale.setScalar(Math.max(0.01, player.visibility))
        if(!this.group.visible)
            return

        const planet = this.state.planets.current
        const height = Math.max(0, player.renderPosition.distanceTo(planet.center) - planet.radius)
        this.contactShadow.position.y = - height + 0.03
        this.contactShadow.visible = height < 3
        this.contactShadow.material.opacity = 1 - THREE.MathUtils.clamp(height / 3, 0, 1)

        if(player.isGrounded && !this.wasGrounded)
            this.squash = 1
        this.wasGrounded = player.isGrounded
        this.squash = damp(this.squash, 0, 10, delta)

        // Jump: stretch while rising/falling, squash on landing (both models)
        const stretch = player.isGrounded ? 0 : THREE.MathUtils.clamp(Math.abs(player.verticalVelocity) / 9, 0, 1) * 0.15
        const scaleY = 1 + stretch - this.squash * 0.28
        const scaleXZ = 1 / Math.sqrt(scaleY)

        if(this.character)
        {
            this.character.scale.set(scaleXZ, scaleY, scaleXZ)
            this.updateCharacter(delta)
            return
        }

        // Placeholder: procedural blends, driven by the real speed (continuous), so sliding
        // slowly along a rock never flickers
        this.moveBlend = damp(this.moveBlend, THREE.MathUtils.clamp(player.speed / 10, 0, 1), 10, delta)
        this.airBlend = damp(this.airBlend, player.isGrounded ? 0 : 1, 14, delta)
        this.phase += delta * (5 + player.speed * 0.9)

        // Run: leg/arm swing + forward lean. Idle: gentle bob.
        const swing = Math.sin(this.phase) * 0.9 * this.moveBlend * (1 - this.airBlend)
        this.legLeft.rotation.x = swing - this.airBlend * 0.6
        this.legRight.rotation.x = - swing + this.airBlend * 0.3
        this.armLeft.rotation.x = - swing * 0.8
        this.armRight.rotation.x = swing * 0.8
        this.armLeft.rotation.z = this.airBlend * 0.9
        this.armRight.rotation.z = - this.airBlend * 0.9

        this.body.rotation.x = this.moveBlend * 0.22
        this.body.position.y = (1 - this.moveBlend) * Math.sin(elapsed * 2.2) * 0.03 + this.moveBlend * Math.abs(Math.sin(this.phase)) * 0.08 * (1 - this.airBlend)
        this.body.scale.set(scaleXZ, scaleY, scaleXZ)
    }
}
