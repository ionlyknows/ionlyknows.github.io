import * as THREE from 'three'

import View from '@/View/View.js'
import State from '@/State/State.js'
import UIBridge from '../../UI/UIBridge.js'
import { SAMPLE_HEIGHT } from '@/State/PropShapes.js'
import { SCAN_TIME } from '@/State/ScienceLab.js'

// M7 science lab scan (visual only): a glowing ring sweeps down over the sample and back up, with a
// faint light cone, for SCAN_TIME s (State/ScienceLab.js starts it, then opens the fact card)
export default class ScienceLab
{
    constructor()
    {
        this.view = View.getInstance()
        this.state = State.getInstance()

        const material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#5ff2e0').multiplyScalar(1.4), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
        this.ring = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.02, 6, 40), material)
        this.ring.rotation.x = Math.PI / 2
        this.cone = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.06, 0.5, 24, 1, true), new THREE.MeshBasicMaterial({ color: '#5ff2e0', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, forceSinglePass: true }))
        this.group = new THREE.Group()
        this.group.add(this.ring, this.cone)
        this.group.matrixAutoUpdate = false
        this.group.visible = false
        this.scan = null

        UIBridge.getInstance().on('scan:start', ({ id }) =>
        {
            const sample = this.state.planets.current.stations?.lab?.samples.find((item) => item.id === id)
            const planetView = this.view.planets.items.find((item) => item.planet === this.state.planets.current)
            if(!sample || !planetView)
                return
            planetView.group.add(this.group)
            this.group.matrix.copy(sample.prop.matrix)
            this.group.visible = true
            this.scan = { time: 0 }
        })
    }

    update()
    {
        if(!this.scan)
            return
        this.scan.time += this.state.time.delta
        const t = this.scan.time / SCAN_TIME
        if(t >= 1)
        {
            this.scan = null
            this.group.visible = false
            return
        }
        // Down over the sample and back up; fades in and out at the ends
        const sweep = 0.5 - 0.5 * Math.cos(t * Math.PI * 2)
        const fade = Math.min(1, t * 6, (1 - t) * 6)
        this.ring.position.y = SAMPLE_HEIGHT + 0.45 - sweep * 0.45
        this.ring.material.opacity = fade
        this.cone.position.y = SAMPLE_HEIGHT + 0.22
        this.cone.material.opacity = fade * 0.12
    }
}
