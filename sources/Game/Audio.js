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
    boost: { buffer: 'warp', gain: 0.32, fadeIn: 0.15, fadeOut: 0.5 }, // same whoosh, softer
    panel: { gain: 0.45, fadeIn: 0.005, fadeOut: 0.06 },
    beacon: { gain: 0.4, fadeIn: 0.005, fadeOut: 0.08 }
}
const MUSIC_GAIN = 0.45
const FLIGHT_DUCK = 0.71 // −3 dB during a flight (M3)
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
        this.duck = 1
        this.buffers = {}

        this.bridge.on('launch', () => this.start())
        this.bridge.on('panel:open', () => this.play('panel'))
        this.bridge.on('prompt:show', () => this.play('beacon'))
        this.bridge.on('flight:boost', () => this.play('boost'))
        this.bridge.on('egg:found', ({ id }) => id === 'duck' ? this.squeak() : this.play('beacon'))
        this.game.stateMachine.events.on('change', (state, previous) =>
        {
            // The quick-view pauses the scene: keep the sound where it was
            if(state === StateMachine.QUICK_VIEW || previous === StateMachine.QUICK_VIEW)
                return

            // Whoosh on take-off (no engine sound at all)
            if(state === StateMachine.TAKEOFF)
                this.play('warp')

            const duck = StateMachine.FLIGHT_STATES.includes(state) ? FLIGHT_DUCK : 1 // read at run time (module order)
            if(duck === this.duck)
                return
            this.rampMusic(MUSIC_GAIN * duck, duck < this.duck ? DUCK_DOWN : DUCK_UP)
            this.duck = duck
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

        this.rampMusic(MUSIC_GAIN * this.duck, 3)
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
        const { buffer: bufferName = name, gain: level, fadeIn, fadeOut } = SFX[name]
        const buffer = this.buffers[bufferName]
        if(!this.context || !buffer)
            return

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

    // Rubber-duck squeak (easter egg), synthesized: two soft rising sine chirps, no file
    squeak()
    {
        if(!this.context)
            return
        const now = this.context.currentTime
        for(const start of [ 0, 0.16 ])
        {
            const oscillator = this.context.createOscillator()
            const gain = this.context.createGain()
            oscillator.type = 'sine'
            oscillator.frequency.setValueAtTime(900, now + start)
            oscillator.frequency.exponentialRampToValueAtTime(1700, now + start + 0.07)
            oscillator.frequency.exponentialRampToValueAtTime(1150, now + start + 0.13)
            gain.gain.setValueAtTime(0, now + start)
            gain.gain.linearRampToValueAtTime(0.18, now + start + 0.015)
            gain.gain.linearRampToValueAtTime(0, now + start + 0.13)
            oscillator.connect(gain).connect(this.master)
            oscillator.start(now + start)
            oscillator.stop(now + start + 0.14)
        }
    }

    set(volume, muted)
    {
        this.volume = volume
        this.muted = muted
        if(this.master)
            this.master.gain.setTargetAtTime(muted ? 0 : volume, this.context.currentTime, 0.05)
    }
}
