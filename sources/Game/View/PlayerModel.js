import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import View from '@/View/View.js'
import State from '@/State/State.js'

// Astronaut mascot (M4): Quaternius "Astronaut" (CC0, see CREDITS.md), meshopt-compressed in
// public/models/astronaut.glb, recoloured here to the Apeiron palette. M5: the helmet's "Grey"
// part was split by vertex selection into the front visor (Grey) and the ear rings / tubes
// (HelmetTrim); the dome has its own HelmetShell material. Suit fabric gets a faint CC0 fabric
// normal map (triplanar in the model's bind pose: its UVs are collapsed) and every part a faint
// cool rim light so the astronaut reads against dark space.
const MODEL_URL = `${import.meta.env.BASE_URL}models/astronaut.glb`
const FABRIC_URL = `${import.meta.env.BASE_URL}textures/suit/fabric-normal.webp`
const LOOK = {
    SciFi_Light_Accent: { color: '#e9e5dc', roughness: 0.8, metalness: 0, envMapIntensity: 0.5, fabric: true }, // off-white suit fabric
    SciFi_Light: { color: '#d7dade', roughness: 0.45, metalness: 0.3, envMapIntensity: 0.6 }, // light-grey panels
    SciFi_MainDark: { color: '#bfc3c9', roughness: 0.75, metalness: 0, envMapIntensity: 0.5, fabric: true }, // light-grey fabric (legs, sleeves): a soft seam contrast
    SciFi_Main: { color: '#ff7a2e', roughness: 0.6, metalness: 0, envMapIntensity: 0.5 }, // orange accents
    HelmetShell: { color: '#eeeae2', roughness: 0.3, metalness: 0.05, envMapIntensity: 0.8 }, // white helmet shell
    HelmetTrim: { color: '#b9bec6', roughness: 0.35, metalness: 0.7, envMapIntensity: 0.8 }, // ear rings, tubes
    Grey: { color: '#8c6a24', roughness: 0.12, metalness: 1, envMapIntensity: 1.2, rim: false } // reflective dark-gold visor
}
const FABRIC = { scale: 9, strength: 0.35 } // repeats per metre, normal strength
const RIM = { color: new THREE.Color('#9ec9ff'), strength: 0.22 }
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

// Flat normal until the fabric texture has loaded
const fabricMap = { value: new THREE.DataTexture(new Uint8Array([ 128, 128, 255, 255 ]), 1, 1) }
fabricMap.value.needsUpdate = true

// Suit shader additions: fabric normal detail (USE_FABRIC) + rim light. The fabric is sampled
// triplanar from the bind-pose position in metres (raw position × the mesh's world scale: meshopt
// quantizes positions and scales the node), and the bent normal is carried to view space through
// the skinned object axes, so the weave sticks to the suit while it animates.
function patchSuit(shader, { fabric, rim })
{
    shader.uniforms.uFabricMap = fabricMap
    shader.uniforms.uRimColor = { value: RIM.color }
    shader.uniforms.uRimStrength = { value: rim ? RIM.strength : 0 }

    shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>
            varying vec3 vFabricPosition;
            varying vec3 vFabricNormal;
            varying vec3 vFabricX;
            varying vec3 vFabricY;
            varying vec3 vFabricZ;`)
        .replace('#include <skinnormal_vertex>', `#include <skinnormal_vertex>
            vFabricPosition = position * length(modelMatrix[0].xyz) * ${FABRIC.scale.toFixed(1)};
            vFabricNormal = normal;
            vec3 fabricX = vec3(1.0, 0.0, 0.0);
            vec3 fabricY = vec3(0.0, 1.0, 0.0);
            vec3 fabricZ = vec3(0.0, 0.0, 1.0);
            #ifdef USE_SKINNING
                fabricX = (skinMatrix * vec4(fabricX, 0.0)).xyz;
                fabricY = (skinMatrix * vec4(fabricY, 0.0)).xyz;
                fabricZ = (skinMatrix * vec4(fabricZ, 0.0)).xyz;
            #endif
            vFabricX = normalize(normalMatrix * fabricX);
            vFabricY = normalize(normalMatrix * fabricY);
            vFabricZ = normalize(normalMatrix * fabricZ);`)

    shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>
            uniform sampler2D uFabricMap;
            uniform vec3 uRimColor;
            uniform float uRimStrength;
            varying vec3 vFabricPosition;
            varying vec3 vFabricNormal;
            varying vec3 vFabricX;
            varying vec3 vFabricY;
            varying vec3 vFabricZ;`)
        .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
            #ifdef USE_FABRIC
                vec3 fabricN = normalize(vFabricNormal);
                vec3 fabricW = pow(abs(fabricN), vec3(4.0));
                fabricW /= fabricW.x + fabricW.y + fabricW.z;
                vec2 fabricA = texture2D(uFabricMap, vFabricPosition.zy).rg * 2.0 - 1.0;
                vec2 fabricB = texture2D(uFabricMap, vFabricPosition.xz).rg * 2.0 - 1.0;
                vec2 fabricC = texture2D(uFabricMap, vFabricPosition.xy).rg * 2.0 - 1.0;
                // Object-space bend: each projection's tangent plane
                vec3 fabricBend = vec3(0.0, fabricA.y, fabricA.x) * fabricW.x + vec3(fabricB.x, 0.0, fabricB.y) * fabricW.y + vec3(fabricC.x, fabricC.y, 0.0) * fabricW.z;
                vec3 fabricView = fabricBend.x * vFabricX + fabricBend.y * vFabricY + fabricBend.z * vFabricZ;
                normal = normalize(normal + fabricView * ${FABRIC.strength.toFixed(2)});
            #endif`)
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
            float rimFacing = 1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0);
            totalEmissiveRadiance += uRimColor * pow(rimFacing, 3.0) * uRimStrength;`)
}
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
        new THREE.TextureLoader().load(FABRIC_URL, (texture) =>
        {
            texture.wrapS = THREE.RepeatWrapping
            texture.wrapT = THREE.RepeatWrapping
            texture.colorSpace = THREE.NoColorSpace
            this.view.upload(texture).then(() => { fabricMap.value = texture })
        })
        const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
        return loader.loadAsync(MODEL_URL)
            .then((gltf) => this.setCharacter(gltf))
            .catch((error) => console.warn('[PlayerModel] Astronaut model failed to load, keeping the placeholder', error))
    }

    setCharacter(gltf)
    {
        this.gltf = gltf // the crew (View/CrewModels.js) are clones of it
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
                const options = { fabric: !!look.fabric, rim: look.rim !== false }
                if(options.fabric)
                    material.defines = { ...material.defines, USE_FABRIC: '' }
                material.onBeforeCompile = (shader) => patchSuit(shader, options)
                material.customProgramCacheKey = () => `astronaut-${options.fabric}-${options.rim}`
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

        this.addDetails(root)

        // Swap: the GLB takes the placeholder's place (same pivot, so squash/stretch still apply)
        this.body.visible = false
        this.character = new THREE.Group()
        this.character.add(root)
        this.group.add(this.character)
        this.play('idle', 0)
    }

    // Chest light and backpack (code-built, on the Chest bone): placed on the suit's surface by
    // casting rays at the rest pose from the front and from behind
    addDetails(root)
    {
        const chest = root.getObjectByName('Chest')
        const body = root.getObjectByName('SpaceSuit_Body')
        const bodyMesh = body?.isMesh ? body : body?.children.find((child) => child.isMesh)
        if(!chest || !bodyMesh)
            return

        root.updateMatrixWorld(true)
        const raycaster = new THREE.Raycaster()
        const surface = (origin, direction) =>
        {
            raycaster.set(origin, direction)
            const hits = []
            body.traverse((object) => { if(object.isMesh) hits.push(...raycaster.intersectObject(object, false)) })
            hits.sort((a, b) => a.distance - b.distance)
            return hits[0]?.point || null
        }
        const front = surface(new THREE.Vector3(0.07, 1.3, 1), new THREE.Vector3(0, 0, - 1))
        const back = surface(new THREE.Vector3(0, 1.22, - 1), new THREE.Vector3(0, 0, 1))
        if(!front || !back)
            return

        const tint = (geometry, color) =>
        {
            const geo = geometry.toNonIndexed()
            const value = new THREE.Color(color)
            const colors = new Float32Array(geo.attributes.position.count * 3)
            for(let i = 0; i < colors.length; i += 3)
                value.toArray(colors, i)
            geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
            geo.deleteAttribute('uv')
            return geo
        }

        // Backpack (rest pose, world space = root space): off-white case, orange side stripes, status light
        const pack = [
            tint(new THREE.BoxGeometry(0.3, 0.38, 0.13).translate(0, 0, - 0.065), '#e6e2da'),
            tint(new THREE.BoxGeometry(0.22, 0.05, 0.02).translate(0, 0.12, - 0.135), '#ff7a2e'),
            tint(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 12).translate(0.13, 0, - 0.1), '#b9bec6'),
            tint(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 12).translate(- 0.13, 0, - 0.1), '#b9bec6')
        ].map((geometry) => geometry.translate(back.x, back.y, back.z + 0.01))
        const glow = [
            tint(new THREE.SphereGeometry(0.022, 12, 8).translate(front.x, front.y, front.z + 0.01), '#7ff9ff'),
            tint(new THREE.SphereGeometry(0.014, 10, 6).translate(back.x + 0.08, back.y - 0.12, back.z - 0.125), '#3bff7a')
        ]

        // Into the Chest bone's space, so they follow the torso
        const toChest = new THREE.Matrix4().copy(chest.matrixWorld).invert()
        const packMesh = new THREE.Mesh(mergeGeometries(pack).applyMatrix4(toChest), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.45, metalness: 0.2, envMapIntensity: 0.6, envMap: this.view.environment || this.view.environmentPlaceholder || null, userData: { useEnvironment: true } }))
        packMesh.castShadow = true
        const glowMesh = new THREE.Mesh(mergeGeometries(glow).applyMatrix4(toChest), new THREE.MeshBasicMaterial({ vertexColors: true, color: new THREE.Color(1.6, 1.6, 1.6) }))
        chest.add(packMesh, glowMesh)
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
        // Apeiron Station (M6b): a flat floor at the interior's height
        const height = planet.kind === 'station'
            ? Math.max(0, player.renderPosition.y - this.state.interior.center.y)
            : Math.max(0, player.renderPosition.distanceTo(planet.center) - planet.radius)
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
