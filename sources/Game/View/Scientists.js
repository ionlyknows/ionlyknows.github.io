import * as THREE from 'three'

import View from '@/View/View.js'
import State from '@/State/State.js'
import { createCrewModel, PALETTES } from './CrewModels.js'

const _x = new THREE.Vector3()
const _matrix = new THREE.Matrix4()

// M7 ambient scientists (The Observatory): recoloured astronaut clones (one merged skinned mesh each,
// View/CrewModels.js) posed from State/Scientists.js. Built once the astronaut GLB is in, drawn
// (and animated) only on The Observatory, not from the air or from inside the station.
export default class Scientists
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
        const planetView = this.view.planets.items.find((item) => item.planet === this.state.scientists.planet)
        if(!planetView)
            return
        for(const member of this.state.scientists.members)
        {
            const model = createCrewModel(gltf, PALETTES.scientist, { envMap: this.view.environment || this.view.environmentPlaceholder })
            model.root.matrixAutoUpdate = false
            model.root.visible = false // until warmed (View.warm)
            this.view.world.add(model.root)
            const item = { member, model, ready: false }
            this.view.warm(model.root).then(() => { item.ready = true })
            this.items.push(item)
        }
    }

    update()
    {
        const gltf = this.view.player.gltf
        if(!this.items && gltf)
            this.create(gltf)
        if(!this.items)
            return

        const scientists = this.state.scientists
        const here = this.state.planets.current === scientists.planet && !this.state.flight.active && !this.state.interior.active
        const delta = this.state.time.delta
        const origin = this.state.planets.origin
        for(const item of this.items)
        {
            item.model.root.visible = item.ready && here
            if(!item.model.root.visible)
                continue
            const { member } = item
            // Layout space (inside view.world, which sits at −origin)
            _x.crossVectors(member.up, member.forward).normalize()
            _matrix.makeBasis(_x, member.up, member.forward).setPosition(member.mover.position.x + origin.x, member.mover.position.y + origin.y, member.mover.position.z + origin.z)
            item.model.root.matrix.copy(_matrix)
            item.model.root.matrixWorldNeedsUpdate = true
            item.model.play(member.anim === 'walk' ? 'walk' : member.anim === 'wave' ? 'wave' : 'idle')
            item.model.update(delta)
        }
    }
}
