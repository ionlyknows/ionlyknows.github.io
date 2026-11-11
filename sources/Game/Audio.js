import StateMachine from '@/StateMachine.js'
import UIBridge from '../UI/UIBridge.js'

// CC0 sounds (see CREDITS.md). Nothing is created, loaded or played before the Launch
// click (BR-02): the AudioContext starts on that click, then the files are fetched.
// Chain: sources → own gain (fades) → master (volume / mute) → limiter → speakers.
// The music's pitch and playback rate never change: during travel it only ducks.
const BASE = `${import.meta.env.BASE_URL}audio/`
const FILES = { ambient: 'ambient.mp3', warp: 'warp.mp3', panel: 'panel.mp3', beacon: 'beacon.mp3' }
const SFX = {
    warp: { gain: 0.5, fadeIn: 0.25, fadeOut: 0.5 }, // airy whoosh, a bit below the music
    panel: { gain: 0.45, fadeIn: 0.005, fadeOut: 0.06 },
    beacon: { gain: 0.4, fadeIn: 0.005, fadeOut: 0.08 }
}
const MUSIC_GAIN = 0.45
const DUCK = 0.5 // −6 dB while traveling
const DUCK_DOWN = 0.5 // s
const DUCK_UP = 1 // s, after arrival
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
        this.music = null
        this.traveling = false
        this.buffers = {}

        this.bridge.on('launch', () => this.start())
        this.bridge.on('panel:open', () => this.play('panel'))
        this.bridge.on('prompt:show', () => this.play('beacon'))
        this.game.stateMachine.events.on('change', (state) =>
        {
            const traveling = state === StateMachine.TRAVELING
            if(traveling === this.traveling)
                return

            this.traveling = traveling
            if(traveling)
                this.play('warp')
            this.rampMusic(traveling ? MUSIC_GAIN * DUCK : MUSIC_GAIN, traveling ? DUCK_DOWN : DUCK_UP)
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

        // Limiter: overlapping sounds never distort
        this.limiter = this.context.createDynamicsCompressor()
        this.limiter.threshold.value = - 6
        this.limiter.knee.value = 3
        this.limiter.ratio.value = 20
        this.limiter.attack.value = 0.003
        this.limiter.release.value = 0.25
        this.limiter.connect(this.context.destination)

        this.master = this.context.createGain()
        this.master.gain.value = this.muted ? 0 : this.volume
        this.master.connect(this.limiter)

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

        this.music = this.context.createGain()
        this.music.gain.value = 0
        source.connect(this.music).connect(this.master)
        source.start(0, LOOP_TRIM)

        this.rampMusic(this.traveling ? MUSIC_GAIN * DUCK : MUSIC_GAIN, 3)
    }

    // Smooth music level change from wherever it is now (also mid-ramp)
    rampMusic(target, duration)
    {
        if(!this.music)
            return

        const gain = this.music.gain
        const now = this.context.currentTime
        const current = gain.value
        gain.cancelScheduledValues(now)
        gain.setValueAtTime(current, now)
        gain.linearRampToValueAtTime(target, now + duration)
    }

    // One-shot with a fade in and out (no clicks at either end)
    play(name)
    {
        const buffer = this.buffers[name]
        if(!this.context || !buffer)
            return

        const { gain: level, fadeIn, fadeOut } = SFX[name]
        const now = this.context.currentTime
        const end = now + buffer.duration

        const source = this.context.createBufferSource()
        source.buffer = buffer
        const gain = this.context.createGain()
        gain.gain.setValueAtTime(0, now)
        gain.gain.linearRampToValueAtTime(level, now + fadeIn)
        gain.gain.setValueAtTime(level, Math.max(now + fadeIn, end - fadeOut))
        gain.gain.linearRampToValueAtTime(0, end)
        source.connect(gain).connect(this.master)
        source.start(now)
        source.stop(end)
    }

    set(volume, muted)
    {
        this.volume = volume
        this.muted = muted
        if(this.master)
            this.master.gain.setTargetAtTime(muted ? 0 : volume, this.context.currentTime, 0.05)
    }
}
