import { QUALITIES } from '@/View/PostProcessing.js'
import UIBridge from '../UI/UIBridge.js'

// BR-02 / BR-09 / FR-13: saved in localStorage `apeiron.settings`. `version: 2` marks the
// cinematic-lighting revision: older saves only keep their quality (old light values are dropped).
const STORAGE_KEY = 'apeiron.settings'
const VERSION = 2
const INTRO_SEEN_KEY = 'apeiron.introSeen'

// BR-09: High if devicePixelRatio ≤ 1.5 and max texture ≥ 8192, otherwise Medium
function defaultQuality(renderer)
{
    return window.devicePixelRatio <= 1.5 && renderer.capabilities.maxTextureSize >= 8192 ? 'high' : 'medium'
}

const clamp01 = (value, fallback) =>
{
    const parsed = Number(value)
    return Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : fallback
}

// Every change is applied live and saved right away (no Save button)
export default class Settings
{
    constructor(game)
    {
        this.game = game
        this.bridge = UIBridge.getInstance()
        this.defaults = { version: VERSION, quality: defaultQuality(game.view.renderer.instance), sound: { volume: 0.7, muted: false } }
        this.values = this.validate(this.read())
        this.apply(this.values, { save: false })

        // M key / mute button
        this.bridge.on('sound:toggle', () => this.apply({ ...this.values, sound: { ...this.values.sound, muted: !this.values.sound.muted } }))
    }

    read()
    {
        try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {} }
        catch { return {} }
    }

    validate(saved)
    {
        const source = saved && typeof saved === 'object' ? saved : {}
        const sound = source.sound && typeof source.sound === 'object' ? source.sound : {}
        return {
            version: VERSION,
            quality: QUALITIES.includes(source.quality) ? source.quality : this.defaults.quality,
            sound: {
                volume: clamp01(sound.volume, this.defaults.sound.volume),
                muted: typeof sound.muted === 'boolean' ? sound.muted : this.defaults.sound.muted
            }
        }
    }

    getValues()
    {
        // The auto quality drop changes the live quality without saving it
        return { ...this.values, quality: this.game.view.postProcessing.quality, sound: { ...this.values.sound } }
    }

    apply(values, { save = true } = {})
    {
        const next = this.validate(values)
        const { view, audio } = this.game

        if(view.postProcessing.quality !== next.quality)
            view.postProcessing.setQuality(next.quality)
        audio.set(next.sound.volume, next.sound.muted)

        this.values = next
        if(save)
        {
            try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) }
            catch {}
        }

        this.bridge.emit('settings:change', { quality: next.quality, sound: { ...next.sound } })
    }

    reset()
    {
        this.apply(this.defaults)
        return this.getValues()
    }

    // Next Launch plays the full opening sequence again
    replayIntro()
    {
        try { window.localStorage.removeItem(INTRO_SEEN_KEY) }
        catch {}
    }
}
