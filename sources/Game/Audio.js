import StateMachine from '@/StateMachine.js'
import UIBridge from '../UI/UIBridge.js'
import stations from '../content/radio.js'

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
// M7 radio tuner: a station is heard within BAND of its dial position; static is soft and quiet
const RADIO = { band: 0.06, station: 0.55, static: 0.045, lowpass: 6500, response: 0.08 }

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
        this.bridge.on('scan:start', () => this.scanSound())
        this.bridge.on('radio:open', () => this.openRadio())
        this.bridge.on('radio:tune', ({ value }) => this.tuneRadio(value))
        this.bridge.on('radio:close', () => this.closeRadio())
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

    // M7 radio tuner (The Observatory). The NASA recordings load only when the tuner first opens
    // (content/radio.js); each loops on its own gain, all through a gentle low-pass, the master and
    // the limiter. Between stations: soft filtered noise (no hum, no buzz), quieter near a station.
    openRadio()
    {
        if(!this.context || this.radio)
            return
        const context = this.context
        const output = context.createBiquadFilter()
        output.type = 'lowpass'
        output.frequency.value = RADIO.lowpass
        output.connect(this.master)

        // Static: 2 s of white noise, band-limited to a soft hiss
        const noise = context.createBuffer(1, context.sampleRate * 2, context.sampleRate)
        const data = noise.getChannelData(0)
        for(let i = 0; i < data.length; i++)
            data[i] = Math.random() * 2 - 1
        const hiss = context.createBufferSource()
        hiss.buffer = noise
        hiss.loop = true
        const high = context.createBiquadFilter()
        high.type = 'highpass'
        high.frequency.value = 300
        const low = context.createBiquadFilter()
        low.type = 'lowpass'
        low.frequency.value = 2200
        const staticGain = context.createGain()
        staticGain.gain.value = 0
        hiss.connect(high).connect(low).connect(staticGain).connect(output)
        hiss.start()

        this.radio = { output, hiss, staticGain, value: 0, stations: stations.map((station) => ({ ...station, gain: null, source: null })) }
        for(const station of this.radio.stations)
            this.loadStation(station)
        this.tuneRadio(this.radio.value)
    }

    async loadStation(station)
    {
        const radio = this.radio
        try
        {
            this.radioBuffers ||= {}
            this.radioBuffers[station.file] ||= fetch(`${BASE}radio/${station.file}`).then((response) => response.arrayBuffer()).then((data) => this.context.decodeAudioData(data))
            const buffer = await this.radioBuffers[station.file]
            if(this.radio !== radio)
                return // closed (or reopened) meanwhile
            station.gain = this.context.createGain()
            station.gain.gain.value = 0
            station.gain.connect(this.radio.output)
            station.source = this.context.createBufferSource()
            station.source.buffer = buffer
            station.source.loop = true
            station.source.connect(station.gain)
            station.source.start()
            this.tuneRadio(this.radio.value)
        }
        catch(error)
        {
            delete this.radioBuffers[station.file]
            console.warn(`[Audio] Could not load ${station.file}`, error)
        }
    }

    // value 0–1 on the dial: each station fades in within RADIO.band of its position, static fills
    // the gaps (smooth ramps, no clicks)
    tuneRadio(value)
    {
        if(!this.radio)
            return
        this.radio.value = value
        const now = this.context.currentTime
        let strongest = 0
        for(const station of this.radio.stations)
        {
            const strength = Math.max(0, 1 - Math.abs(value - station.dial) / RADIO.band)
            strongest = Math.max(strongest, station.gain ? strength : 0)
            station.gain?.gain.setTargetAtTime(strength * strength * RADIO.station, now, RADIO.response)
        }
        this.radio.staticGain.gain.setTargetAtTime((1 - strongest) * RADIO.static, now, RADIO.response)
    }

    closeRadio()
    {
        const radio = this.radio
        if(!radio)
            return
        this.radio = null
        const now = this.context.currentTime
        for(const station of radio.stations)
            station.gain?.gain.setTargetAtTime(0, now, 0.05)
        radio.staticGain.gain.setTargetAtTime(0, now, 0.05)
        // Stop once faded (the decoded files stay for the next time)
        setTimeout(() =>
        {
            radio.hiss.stop()
            for(const station of radio.stations)
                station.source?.stop()
            radio.output.disconnect()
        }, 400)
    }

    // M7 science lab scan: a soft sine glide up and back over the sweep (1.3 s), then a quiet two-note
    // chime; synthesized, no file, low level (no buzz: pure sines only)
    scanSound()
    {
        if(!this.context)
            return
        const now = this.context.currentTime
        const tone = (type, from, to, back, start, duration, level) =>
        {
            const oscillator = this.context.createOscillator()
            const gain = this.context.createGain()
            oscillator.type = type
            oscillator.frequency.setValueAtTime(from, now + start)
            oscillator.frequency.exponentialRampToValueAtTime(to, now + start + duration * 0.5)
            oscillator.frequency.exponentialRampToValueAtTime(back, now + start + duration)
            gain.gain.setValueAtTime(0, now + start)
            gain.gain.linearRampToValueAtTime(level, now + start + Math.min(0.08, duration * 0.2))
            gain.gain.setValueAtTime(level, now + start + duration * 0.7)
            gain.gain.linearRampToValueAtTime(0, now + start + duration)
            oscillator.connect(gain).connect(this.master)
            oscillator.start(now + start)
            oscillator.stop(now + start + duration + 0.02)
        }
        tone('sine', 420, 880, 520, 0, 1.2, 0.05)
        tone('sine', 1046, 1046, 1046, 1.22, 0.32, 0.06)
        tone('sine', 1568, 1568, 1568, 1.34, 0.4, 0.045)
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
