const STORAGE_KEY = 'apeiron.settings'
const number = (value, fallback, min, max, step = 0) =>
{
    const parsed = Number(value)
    if(!Number.isFinite(parsed) || parsed < min || parsed > max)
        return fallback

    return step ? Math.round(parsed / step) * step : parsed
}

export default class Settings
{
    constructor(game)
    {
        this.game = game
        this.defaults = this.snapshot()
        this.apply(this.validate(this.read(), this.defaults))
    }

    read()
    {
        try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {} }
        catch { return {} }
    }

    snapshot()
    {
        const { view } = this.game
        const stars = view.space.stars

        return {
            stars: { count: stars.count, size: stars.material.uniforms.uSize.value, brightness: stars.material.uniforms.uBrightness.value },
            lighting: { sunLightIntensity: view.player.sunLight.intensity, fillLightIntensity: view.player.fillLight.intensity }
        }
    }

    validate(saved, fallback)
    {
        const source = saved && typeof saved === 'object' ? saved : {}
        const get = (section, key) => source[section]?.[key]
        return {
            stars: { count: number(get('stars', 'count'), fallback.stars.count, 100, 50000, 100), size: number(get('stars', 'size'), fallback.stars.size, 0, 1), brightness: number(get('stars', 'brightness'), fallback.stars.brightness, 0, 1) },
            lighting: { sunLightIntensity: number(get('lighting', 'sunLightIntensity'), fallback.lighting.sunLightIntensity, 0, 5), fillLightIntensity: number(get('lighting', 'fillLightIntensity'), fallback.lighting.fillLightIntensity, 0, 5) }
        }
    }

    getValues() { return this.snapshot() }

    apply(values)
    {
        const next = this.validate(values, this.defaults)
        const { view } = this.game
        const stars = view.space.stars

        if(stars.count !== next.stars.count)
        {
            stars.count = next.stars.count
            stars.update()
        }
        stars.material.uniforms.uSize.value = next.stars.size
        stars.material.uniforms.uBrightness.value = next.stars.brightness
        view.player.sunLight.intensity = next.lighting.sunLightIntensity
        view.player.fillLight.intensity = next.lighting.fillLightIntensity
    }

    save(values = this.snapshot())
    {
        try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.validate(values, this.defaults))) }
        catch {}
    }

    reset()
    {
        this.apply(this.defaults)
        try { window.localStorage.removeItem(STORAGE_KEY) }
        catch {}
        return this.getValues()
    }
}
