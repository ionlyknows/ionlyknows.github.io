<script setup>
import { ref, computed, nextTick } from 'vue'
import PanelShell from './PanelShell.vue'
import { usePanelEscape } from '../../composables/usePanelEscape.js'
import config, { earth, sunDirection } from '../../../Game/config/planets.js'
import locations from '../../../content/locations.js'
import sky from '../../../content/sky.js'
import { has } from '../../visibleContent.js'

// M5 map (M key): a top-down drawing of the system from the planet layout. Every location with a
// config and a name is shown (new places appear by themselves); click one → Autopilot / Fly it yourself.
const props = defineProps({ current: { type: String, default: '' } })
const emit = defineEmits([ 'close', 'travel' ])

const WIDTH = 1000
const HEIGHT = 600
const PAD = 90

// Top-down: x → right, z → down. Uniform scale to fit every body (Earth included) with a margin.
const bodies = [ ...config.map((planet) => ({ x: planet.center[0], z: planet.center[2], r: planet.mapRadius ?? planet.radius })), { x: earth.center[0], z: earth.center[2], r: earth.radius } ]
const minX = Math.min(...bodies.map((b) => b.x - b.r))
const maxX = Math.max(...bodies.map((b) => b.x + b.r))
const minZ = Math.min(...bodies.map((b) => b.z - b.r))
const maxZ = Math.max(...bodies.map((b) => b.z + b.r))
const scale = Math.min((WIDTH - PAD * 2) / (maxX - minX), (HEIGHT - PAD * 2) / (maxZ - minZ))
const offsetX = (WIDTH - (maxX - minX) * scale) / 2
const offsetZ = (HEIGHT - (maxZ - minZ) * scale) / 2
const project = (x, z) => ({ x: offsetX + (x - minX) * scale, y: offsetZ + (z - minZ) * scale })

const places = config
    .map((planet) =>
    {
        const location = locations.find((item) => item.id === planet.id)
        const { x, y } = project(planet.center[0], planet.center[2])
        return { id: planet.id, name: location?.name, description: location?.description, x, y, size: Math.max(22, (planet.mapRadius ?? planet.radius) * scale * 2.2) }
    })
    .filter((place) => has(place.name))

const earthDot = { ...project(earth.center[0], earth.center[2]), r: earth.radius * scale * 1.1 }

// The sun is far away in its direction: drawn on the map's edge
const sunLength = Math.hypot(sunDirection[0], sunDirection[2]) || 1
const sunDir = { x: sunDirection[0] / sunLength, y: sunDirection[2] / sunLength }
const sunReach = Math.min(Math.abs((WIDTH / 2) / (sunDir.x || 1e-6)), Math.abs((HEIGHT / 2) / (sunDir.y || 1e-6)))
const sun = { x: WIDTH / 2 + sunDir.x * sunReach, y: HEIGHT / 2 + sunDir.y * sunReach }

// Faint links between the locations (every trip is possible)
const links = places.flatMap((a, i) => places.slice(i + 1).map((b) => ({ a, b })))

const constellations = sky.filter((item) => has(item.name))

const selected = ref(null)
const confirmEl = ref(null)
const target = computed(() => places.find((place) => place.id === selected.value))

const percent = (place) => ({ left: `${(place.x / WIDTH) * 100}%`, top: `${(place.y / HEIGHT) * 100}%` })

async function choose(place)
{
    if(place.id === props.current)
        return
    selected.value = place.id
    await nextTick()
    confirmEl.value?.querySelector('button')?.focus()
}

function travel(autopilot)
{
    emit('travel', { id: selected.value, autopilot })
}

function close() { emit('close') }
usePanelEscape(close)
</script>

<template>
    <PanelShell title="Map" subtitle="Choose where to fly" variant="fullscreen" @close="close">
        <div class="iw-map">
            <svg class="iw-map__drawing" :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                <defs>
                    <radialGradient id="iw-map-sun">
                        <stop offset="0" stop-color="#fff6e0" />
                        <stop offset="0.25" stop-color="#ffd27a" stop-opacity="0.8" />
                        <stop offset="1" stop-color="#ff9d4a" stop-opacity="0" />
                    </radialGradient>
                    <radialGradient id="iw-map-earth" cx="0.35" cy="0.3">
                        <stop offset="0" stop-color="#9fd3ff" />
                        <stop offset="0.6" stop-color="#2b6cb0" />
                        <stop offset="1" stop-color="#0b2545" />
                    </radialGradient>
                </defs>
                <circle :cx="sun.x" :cy="sun.y" r="120" fill="url(#iw-map-sun)" />
                <line v-for="link in links" :key="`${link.a.id}-${link.b.id}`" :x1="link.a.x" :y1="link.a.y" :x2="link.b.x" :y2="link.b.y" class="iw-map__link" />
                <circle :cx="earthDot.x" :cy="earthDot.y" :r="earthDot.r" fill="url(#iw-map-earth)" opacity="0.55" />
            </svg>

            <button
                v-for="place in places"
                :key="place.id"
                class="iw-map__place"
                :class="{ 'is-current': place.id === current, 'is-selected': place.id === selected }"
                :style="{ ...percent(place), '--accent': `var(--iw-loc-${place.id})`, '--size': `${place.size}px` }"
                type="button"
                :aria-current="place.id === current ? 'location' : undefined"
                :aria-label="place.id === current ? `${place.name}, you are here` : `Fly to ${place.name}`"
                @click="choose(place)"
            >
                <span class="iw-map__planet" aria-hidden="true" />
                <span class="iw-map__label">
                    <span v-if="place.id === current" class="iw-map__here">You are here</span>
                    <span class="iw-map__name">{{ place.name }}</span>
                    <span v-if="has(place.description)" class="iw-map__description">{{ place.description }}</span>
                </span>
            </button>
        </div>

        <div v-if="target" ref="confirmEl" class="iw-map__confirm" role="group" :aria-label="`Fly to ${target.name}`">
            <p class="iw-map__confirm-title">Fly to <strong>{{ target.name }}</strong></p>
            <button class="iw-map__button iw-map__button--primary" type="button" @click="travel(true)">Autopilot</button>
            <button class="iw-map__button" type="button" @click="travel(false)">Fly it yourself</button>
            <button class="iw-map__button iw-map__button--ghost" type="button" @click="selected = null">Cancel</button>
        </div>

        <p v-if="constellations.length" class="iw-map__sky">
            <span class="iw-map__sky-title">In the sky</span>
            {{ constellations.map((item) => item.name).join(' · ') }}
        </p>
    </PanelShell>
</template>

<style scoped>
.iw-map
{
    position: relative;
    width: 100%;
    aspect-ratio: 1000 / 600;
    border: 1px solid var(--iw-border);
    border-radius: var(--iw-radius-md);
    background: radial-gradient(ellipse at 50% 50%, rgba(40, 60, 110, 0.18), rgba(0, 0, 0, 0.35));
    overflow: hidden;
}

.iw-map__drawing
{
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}

.iw-map__link
{
    stroke: var(--iw-glow);
    stroke-opacity: 0.16;
    stroke-width: 1.5;
    stroke-dasharray: 4 8;
}

.iw-map__place
{
    position: absolute;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0;
    border: none;
    background: none;
    color: var(--iw-text);
    text-align: left;
    transform: translate(calc(var(--size) / -2), -50%);
    cursor: pointer;
}

.iw-map__place.is-current
{
    cursor: default;
}

.iw-map__planet
{
    flex: none;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #ffffff 0%, var(--accent) 45%, rgba(0, 0, 0, 0.5) 100%);
    box-shadow: 0 0 18px var(--accent);
    transition: transform 0.2s var(--iw-ease), box-shadow 0.2s var(--iw-ease);
}

.iw-map__place:not(.is-current):hover .iw-map__planet,
.iw-map__place.is-selected .iw-map__planet
{
    transform: scale(1.12);
    box-shadow: 0 0 28px var(--accent);
}

.iw-map__place.is-current .iw-map__planet
{
    outline: 2px solid var(--iw-text);
    outline-offset: 5px;
}

.iw-map__label
{
    display: grid;
    gap: 2px;
    max-width: 210px;
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.8);
}

.iw-map__here
{
    color: var(--iw-glow);
    font: 700 11px/1.2 var(--iw-font-mono);
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

.iw-map__name
{
    font-size: 16px;
    font-weight: 700;
}

.iw-map__description
{
    color: var(--iw-text-dim);
    font-size: 14px;
    line-height: 1.35;
}

.iw-map__place:focus-visible
{
    outline: 2px solid var(--iw-glow);
    outline-offset: 4px;
    border-radius: var(--iw-radius-sm);
}

.iw-map__confirm
{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-top: 16px;
    padding: 14px 16px;
    border: 1px solid var(--iw-border-strong);
    border-radius: var(--iw-radius-md);
    background: rgba(255, 255, 255, 0.04);
}

.iw-map__confirm-title
{
    margin: 0 auto 0 0;
    color: var(--iw-text);
    font-size: 16px;
}

.iw-map__button
{
    min-height: 40px;
    padding: 10px 16px;
    border: 1px solid var(--iw-border-strong);
    border-radius: var(--iw-radius-sm);
    background: transparent;
    color: var(--iw-text);
    font: 700 12px/1 var(--iw-font-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.iw-map__button--primary
{
    border-color: var(--iw-glow);
    background: rgba(127, 249, 255, 0.12);
}

.iw-map__button--ghost
{
    border-color: transparent;
    color: var(--iw-text-dim);
}

.iw-map__button:hover
{
    border-color: var(--iw-glow);
}

.iw-map__button:focus-visible
{
    outline: 2px solid var(--iw-glow);
    outline-offset: 2px;
}

.iw-map__sky
{
    margin: 14px 0 0;
    color: var(--iw-text-dim);
    font-size: 14px;
    line-height: 1.5;
}

.iw-map__sky-title
{
    margin-right: 8px;
    color: var(--iw-glow);
    font: 700 11px/1 var(--iw-font-mono);
    letter-spacing: 0.1em;
    text-transform: uppercase;
}
</style>
