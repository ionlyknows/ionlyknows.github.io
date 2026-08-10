const STORAGE_KEY = 'infinite-world-settings-v2'
const number = (value, fallback, min, max, step = 0) =>
{
    const parsed = Number(value)
    if(!Number.isFinite(parsed) || parsed < min || parsed > max)
        return fallback

    return step ? Math.round(parsed / step) * step : parsed
}

const color = (value, fallback) => /^#[0-9a-f]{6}$/i.test(value || '') ? value : fallback

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
        const { state, view } = this.game
        const uniforms = view.sky.sphere.material.uniforms
        const hex = (uniform) => `#${uniform.value.getHexString()}`

        return {
            dayCycle: { autoUpdate: state.day.autoUpdate, progress: state.day.progress, duration: state.day.duration },
            player: { viewMode: state.player.camera.mode },
            terrain: {
                subdivisions: state.terrains.subdivisions, lacunarity: state.terrains.lacunarity,
                persistence: state.terrains.persistence, maxIterations: state.terrains.maxIterations,
                baseFrequency: state.terrains.baseFrequency, baseAmplitude: state.terrains.baseAmplitude,
                power: state.terrains.power, elevationOffset: state.terrains.elevationOffset,
                iterationsFormula: state.terrains.iterationsFormula
            },
            sky: {
                widthSegments: view.sky.sphere.widthSegments, heightSegments: view.sky.sphere.heightSegments,
                atmosphereElevation: uniforms.uAtmosphereElevation.value, atmospherePower: uniforms.uAtmospherePower.value,
                colorDayCycleLow: hex(uniforms.uColorDayCycleLow), colorDayCycleHigh: hex(uniforms.uColorDayCycleHigh),
                colorNightLow: hex(uniforms.uColorNightLow), colorNightHigh: hex(uniforms.uColorNightHigh),
                dawnAngleAmplitude: uniforms.uDawnAngleAmplitude.value, dawnElevationAmplitude: uniforms.uDawnElevationAmplitude.value,
                colorDawn: hex(uniforms.uColorDawn), sunAmplitude: uniforms.uSunAmplitude.value,
                sunMultiplier: uniforms.uSunMultiplier.value, colorSun: hex(uniforms.uColorSun)
            },
            stars: { count: view.sky.stars.count, size: view.sky.stars.material.uniforms.uSize.value, brightness: view.sky.stars.material.uniforms.uBrightness.value },
            terrainGradient: { ...view.terrains.gradient.colors },
            lighting: { sunLightIntensity: view.player.sunLight.intensity, fillLightIntensity: view.player.fillLight.intensity }
        }
    }

    validate(saved, fallback)
    {
        const source = saved && typeof saved === 'object' ? saved : {}
        const get = (section, key) => source[section]?.[key]
        return {
            dayCycle: { autoUpdate: typeof get('dayCycle', 'autoUpdate') === 'boolean' ? get('dayCycle', 'autoUpdate') : fallback.dayCycle.autoUpdate, progress: number(get('dayCycle', 'progress'), fallback.dayCycle.progress, 0, 1), duration: number(get('dayCycle', 'duration'), fallback.dayCycle.duration, 5, 100) },
            player: { viewMode: [1, 2].includes(get('player', 'viewMode')) ? get('player', 'viewMode') : fallback.player.viewMode },
            terrain: {
                subdivisions: number(get('terrain', 'subdivisions'), fallback.terrain.subdivisions, 1, 400, 1), lacunarity: number(get('terrain', 'lacunarity'), fallback.terrain.lacunarity, 1, 5), persistence: number(get('terrain', 'persistence'), fallback.terrain.persistence, 0, 1), maxIterations: number(get('terrain', 'maxIterations'), fallback.terrain.maxIterations, 1, 10, 1), baseFrequency: number(get('terrain', 'baseFrequency'), fallback.terrain.baseFrequency, 0, .01), baseAmplitude: number(get('terrain', 'baseAmplitude'), fallback.terrain.baseAmplitude, 0, 500), power: number(get('terrain', 'power'), fallback.terrain.power, 1, 10, 1), elevationOffset: number(get('terrain', 'elevationOffset'), fallback.terrain.elevationOffset, -10, 10, 1), iterationsFormula: number(get('terrain', 'iterationsFormula'), fallback.terrain.iterationsFormula, 1, 4, 1)
            },
            sky: {
                widthSegments: number(get('sky', 'widthSegments'), fallback.sky.widthSegments, 4, 512, 1), heightSegments: number(get('sky', 'heightSegments'), fallback.sky.heightSegments, 4, 512, 1), atmosphereElevation: number(get('sky', 'atmosphereElevation'), fallback.sky.atmosphereElevation, .01, 5), atmospherePower: number(get('sky', 'atmospherePower'), fallback.sky.atmospherePower, 0, 20), colorDayCycleLow: color(get('sky', 'colorDayCycleLow'), fallback.sky.colorDayCycleLow), colorDayCycleHigh: color(get('sky', 'colorDayCycleHigh'), fallback.sky.colorDayCycleHigh), colorNightLow: color(get('sky', 'colorNightLow'), fallback.sky.colorNightLow), colorNightHigh: color(get('sky', 'colorNightHigh'), fallback.sky.colorNightHigh), dawnAngleAmplitude: number(get('sky', 'dawnAngleAmplitude'), fallback.sky.dawnAngleAmplitude, .001, 1), dawnElevationAmplitude: number(get('sky', 'dawnElevationAmplitude'), fallback.sky.dawnElevationAmplitude, .01, 1), colorDawn: color(get('sky', 'colorDawn'), fallback.sky.colorDawn), sunAmplitude: number(get('sky', 'sunAmplitude'), fallback.sky.sunAmplitude, .01, 3), sunMultiplier: number(get('sky', 'sunMultiplier'), fallback.sky.sunMultiplier, 0, 1), colorSun: color(get('sky', 'colorSun'), fallback.sky.colorSun)
            },
            stars: { count: number(get('stars', 'count'), fallback.stars.count, 100, 50000, 100), size: number(get('stars', 'size'), fallback.stars.size, 0, 1), brightness: number(get('stars', 'brightness'), fallback.stars.brightness, 0, 1) },
            terrainGradient: { aboveFar: color(get('terrainGradient', 'aboveFar'), fallback.terrainGradient.aboveFar), aboveClose: color(get('terrainGradient', 'aboveClose'), fallback.terrainGradient.aboveClose), belowClose: color(get('terrainGradient', 'belowClose'), fallback.terrainGradient.belowClose), belowFar: color(get('terrainGradient', 'belowFar'), fallback.terrainGradient.belowFar) },
            lighting: { sunLightIntensity: number(get('lighting', 'sunLightIntensity'), fallback.lighting.sunLightIntensity, 0, 5), fillLightIntensity: number(get('lighting', 'fillLightIntensity'), fallback.lighting.fillLightIntensity, 0, 5) }
        }
    }

    getValues() { return this.snapshot() }

    apply(values)
    {
        const next = this.validate(values, this.defaults)
        const { state, view } = this.game
        const current = this.snapshot()
        const changed = (section) => JSON.stringify(current[section]) !== JSON.stringify(next[section])
        Object.assign(state.day, next.dayCycle)
        state.day.timeProgress = next.dayCycle.progress
        state.player.camera.setMode(next.player.viewMode)
        Object.assign(state.terrains, next.terrain)
        if(changed('terrain'))
        {
            state.terrains.recreate()
            view.grass.material.uniforms.uTerrainTextureSize.value = state.terrains.segments
        }
        Object.assign(view.sky.sphere, { widthSegments: next.sky.widthSegments, heightSegments: next.sky.heightSegments })
        if(current.sky.widthSegments !== next.sky.widthSegments || current.sky.heightSegments !== next.sky.heightSegments)
            view.sky.sphere.update()
        const uniforms = view.sky.sphere.material.uniforms
        uniforms.uAtmosphereElevation.value = next.sky.atmosphereElevation; uniforms.uAtmospherePower.value = next.sky.atmospherePower
        uniforms.uColorDayCycleLow.value.set(next.sky.colorDayCycleLow); uniforms.uColorDayCycleHigh.value.set(next.sky.colorDayCycleHigh)
        uniforms.uColorNightLow.value.set(next.sky.colorNightLow); uniforms.uColorNightHigh.value.set(next.sky.colorNightHigh)
        uniforms.uDawnAngleAmplitude.value = next.sky.dawnAngleAmplitude; uniforms.uDawnElevationAmplitude.value = next.sky.dawnElevationAmplitude
        uniforms.uColorDawn.value.set(next.sky.colorDawn); uniforms.uSunAmplitude.value = next.sky.sunAmplitude; uniforms.uSunMultiplier.value = next.sky.sunMultiplier; uniforms.uColorSun.value.set(next.sky.colorSun)
        view.sky.stars.count = next.stars.count
        if(current.stars.count !== next.stars.count)
            view.sky.stars.update()
        view.sky.stars.material.uniforms.uSize.value = next.stars.size; view.sky.stars.material.uniforms.uBrightness.value = next.stars.brightness
        if(changed('terrainGradient'))
        {
            Object.assign(view.terrains.gradient.colors, next.terrainGradient)
            view.terrains.gradient.update()
        }
        view.player.sunLight.intensity = next.lighting.sunLightIntensity; view.player.fillLight.intensity = next.lighting.fillLightIntensity
    }

    save(values = this.snapshot()) { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.validate(values, this.defaults))) }
    reset() { this.apply(this.defaults); window.localStorage.removeItem(STORAGE_KEY); return this.getValues() }
}
