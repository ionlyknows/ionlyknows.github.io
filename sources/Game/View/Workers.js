import * as THREE from 'three'

import View from '@/View/View.js'
import State from '@/State/State.js'
import { createCrewModel, PALETTES } from './CrewModels.js'

const WAVE_DISTANCE = 6
const WAVE_TIME = 2.6
const WAVE_COOLDOWN = 14

// Ambient workers on the planets (M6, The Forge): recoloured astronauts standing at work (the
// Interact clip, looped) that wave when the visitor comes near. They stand on a `worker` prop
// (a collider, so you walk around them, never through). Only the current planet's workers animate.
export default class Workers
{
    constructor()
    {
        this.view = View.getInstance()
        this.state = State.getInstance()
        this.items = null
    }

    create(gltf)
    {
        this.items = []
        for(const planetView of this.view.planets.items)
        {
            for(const worker of planetView.planet.workers)
            {
                const model = createCrewModel(gltf, PALETTES.worker, { envMap: this.view.environment || this.view.environmentPlaceholder })
                model.root.matrixAutoUpdate = false
                model.root.matrix.copy(worker.prop.matrix)
                model.root.visible = false // until warmed (View.warm), then only on its own planet
                planetView.group.add(model.root)
                model.play('work')
                const item = { planet: planetView.planet, model, worker, waveTimer: 0, cooldown: 0, position: new THREE.Vector3(), ready: false }
                this.view.warm(model.root).then(() => { item.ready = true })
                this.items.push(item)
            }
        }
    }

    update()
    {
        const gltf = this.view.player.gltf
        if(!this.items && gltf)
            this.create(gltf)
        if(!this.items)
            return
        if(this.state.interior.active)
        {
            for(const item of this.items)
                item.model.root.visible = false
            return
        }

        const delta = this.state.time.delta
        const planet = this.state.planets.current
        const player = this.state.player.position
        const flying = this.state.flight.active
        for(const item of this.items)
        {
            // Drawn only on their own planet (skinned: never frustum-culled), and not from the air
            item.model.root.visible = item.ready && item.planet === planet && !flying
            if(!item.model.root.visible)
                continue
            item.cooldown -= delta
            item.position.setFromMatrixPosition(item.worker.prop.matrix).add(planet.center)
            if(item.waveTimer > 0)
            {
                item.waveTimer -= delta
                if(item.waveTimer <= 0)
                    item.model.play('work')
            }
            else if(item.cooldown <= 0 && item.position.distanceTo(player) < WAVE_DISTANCE)
            {
                item.waveTimer = WAVE_TIME
                item.cooldown = WAVE_COOLDOWN
                item.model.play('wave')
            }
            item.model.update(delta)
        }
    }
}
