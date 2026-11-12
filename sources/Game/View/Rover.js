import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import Game from '@/Game.js'
import View from '@/View/View.js'
import State from '@/State/State.js'
import StateMachine from '@/StateMachine.js'
import { ROVER_SHAPE } from '@/State/PropShapes.js'

const LEAN = 0.08 // rad, at most, into turns
const BOB = 0.025 // m

const _matrix = new THREE.Matrix4()
const _wheel = new THREE.Matrix4()
const _spin = new THREE.Matrix4()
const _right = new THREE.Vector3()
const _forward = new THREE.Vector3()
const _quaternion = new THREE.Quaternion()

// M7 rover (The Observatory), code-built (State/PropShapes.js ROVER_SHAPE): the body (merged per
// material) bobs and leans into turns, the six wheels spin and the front pair
// steers. Visual only: State/Rover.js and State/Player.js own the pose. While driving it draws at the
// player's interpolated render position (the player rides it).
export default class Rover
{
    constructor()
    {
        this.game = Game.getInstance()
        this.view = View.getInstance()
        this.state = State.getInstance()
        this.rover = this.state.rover
        if(!this.rover.planet)
            return

        const materials = this.view.planets.materials
        this.group = new THREE.Group()
        this.body = new THREE.Group()
        this.group.add(this.body)
        this.casters = []

        const byMaterial = (parts) =>
        {
            const groups = {}
            for(const { geometry, mat } of parts)
                (groups[mat] ||= []).push(geometry)
            return Object.entries(groups).map(([ mat, geometries ]) => ({ mat, geometry: geometries.length > 1 ? mergeGeometries(geometries) : geometries[0] }))
        }
        for(const { mat, geometry } of byMaterial(ROVER_SHAPE.body()))
        {
            const mesh = new THREE.Mesh(geometry, materials[mat])
            this.body.add(mesh)
            if(mat !== 'glow')
                this.casters.push(mesh)
        }
        // Six plain meshes, not an instanced mesh: rewriting an instance buffer every frame while the
        // GPU still reads it (shadow pass) stalled the pipeline on ANGLE / D3D11 (≈ 35 fps)
        const [ wheel ] = byMaterial(ROVER_SHAPE.wheel())
        this.wheels = ROVER_SHAPE.wheels.map(() =>
        {
            const mesh = new THREE.Mesh(wheel.geometry, materials[wheel.mat])
            mesh.matrixAutoUpdate = false
            this.group.add(mesh)
            this.casters.push(mesh)
            return mesh
        })
        for(const mesh of this.casters)
            mesh.receiveShadow = true
        this.view.scene.add(this.group)
        this.group.visible = false
    }

    update()
    {
        if(!this.group)
            return
        const rover = this.rover
        const here = this.state.planets.current === rover.planet && !this.view.station.inside
        if(here !== this.group.visible)
        {
            this.group.visible = here
            for(const mesh of this.casters)
                mesh.castShadow = here
        }
        if(!here)
            return

        const body = rover.body
        const driving = this.game.stateMachine.is(StateMachine.DRIVING)
        const player = this.state.player
        const position = driving ? player.renderPosition : body.position
        const up = driving ? player.renderUp : body.up
        _forward.copy(body.facing).projectOnPlane(up).normalize()
        _right.crossVectors(up, _forward).normalize()
        _quaternion.setFromRotationMatrix(_matrix.makeBasis(_right, up, _forward))
        this.group.position.copy(position)
        this.group.quaternion.copy(_quaternion)

        // Suspension (visual only): rolls toward the outside of a turn, a small bob with speed
        const speed = Math.abs(body.speed)
        const lean = THREE.MathUtils.clamp(- body.yawRate * body.speed * 0.012, - LEAN, LEAN)
        this.body.rotation.z += (lean - this.body.rotation.z) * (1 - Math.exp(- 6 * this.state.time.delta))
        this.body.position.y = Math.sin(body.wheel * 1.7) * BOB * Math.min(1, speed / 6)

        ROVER_SHAPE.wheels.forEach((centre, index) =>
        {
            const front = centre[2] > 0.5
            _wheel.makeRotationY(front ? - body.steer * 0.45 : 0)
            _wheel.multiply(_spin.makeRotationX(body.wheel))
            _wheel.setPosition(centre[0], centre[1], centre[2])
            this.wheels[index].matrix.copy(_wheel)
        })
    }
}

