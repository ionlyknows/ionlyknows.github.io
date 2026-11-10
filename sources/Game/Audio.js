import StateMachine from '@/StateMachine.js'
import UIBridge from '../UI/UIBridge.js'

// CC0 sounds (see CREDITS.md). Nothing is created, loaded or played before the Launch
// click (BR-02): the AudioContext starts on that click, then the files are fetched.
const BASE = `${import.meta.env.BASE_URL}audio/`
const FILES = { ambient: 'ambient.mp3', warp: 'warp.mp3', panel: 'panel.mp3', beacon: 'beacon.mp3' }
const SFX_GAIN = { warp: 0.55, panel: 0.5, beacon: 0.45 }
const MUSIC_GAIN = 0.45
const LOOP_TRIM = 0.05 // s: skips the MP3 encoder padding at both ends of the loop

export default class Audio
{
    constructor(game)
    {
        this.game = game
        this.bridge = UIBridge.getInstance()

        this.volume = 0.7
        this.muted = false
        this.context = null
        this.buffers = {}

        this.bridge.on('launch', () => this.start())
        this.bridge.on('panel:open', () => this.play('panel'))
        this.bridge.on('prompt:show', () => this.play('beacon'))
        this.game.stateMachine.events.on('change', (state) =>
        {
            if(state === StateMachine.TRAVELING)
                this.play('warp')
        })

        // Silence while the tab is hidden
        document.addEventListener('visibilitychange', () =>
        {
            if(!this.context)
                return
            if(document.hidden)
                this.context.suspend()
            else
                this.context.resume()
        })
    }

    start()
    {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        if(this.context || !AudioContext)
            return

        this.context = new AudioContext()
        this.master = this.context.createGain()
        this.master.gain.value = this.muted ? 0 : this.volume
        this.master.connect(this.context.destination)

        this.pending = 'warp' // launch sound plays as soon as it has loaded
        for(const [ name, file ] of Object.entries(FILES))
            this.load(name, file)
    }

    async load(name, file)
    {
        try
        {
            const response = await fetch(BASE + file)
            const data = await response.arrayBuffer()
            this.buffers[name] = await this.context.decodeAudioData(data)
        }
        catch(error)
        {
            console.warn(`[Audio] Could not load ${file}`, error)
            return
        }

        if(name === 'ambient')
            this.startMusic()
        if(name === this.pending)
        {
            this.pending = null
            this.play(name)
        }
    }

    startMusic()
    {
        const buffer = this.buffers.ambient
        const source = this.context.createBufferSource()
        source.buffer = buffer
        source.loop = true
        source.loopStart = LOOP_TRIM
        source.loopEnd = buffer.duration - LOOP_TRIM

        const gain = this.context.createGain()
        gain.gain.setValueAtTime(0, this.context.currentTime)
        gain.gain.linearRampToValueAtTime(MUSIC_GAIN, this.context.currentTime + 3)

        source.connect(gain).connect(this.master)
        source.start(0, LOOP_TRIM)
    }

    play(name)
    {
        const buffer = this.buffers[name]
        if(!this.context || !buffer)
            return

        const source = this.context.createBufferSource()
        source.buffer = buffer
        const gain = this.context.createGain()
        gain.gain.value = SFX_GAIN[name] ?? 0.5
        source.connect(gain).connect(this.master)
        source.start()
    }

    set(volume, muted)
    {
        this.volume = volume
        this.muted = muted
        if(this.master)
            this.master.gain.setTargetAtTime(muted ? 0 : volume, this.context.currentTime, 0.05)
    }
}
