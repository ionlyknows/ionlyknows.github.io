<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useUIBridge } from '../composables/useUIBridge.js'
import config from '../../Game/config/planets.js'
import locations from '../../content/locations.js'
import exhibits from '../../content/exhibits.js'
import { has } from '../visibleContent.js'

// M6 hologram orbit mode (station centre): drag rotates, scroll zooms, hovering a body shows its
// name and one-line description; a location you can fly to gets the two trip buttons (the trip
// starts in the ship in the hangar, M6b). Esc leaves.
const props = defineProps({ current: { type: String, default: '' } })
const { emit: send, listen } = useUIBridge()

const hovered = ref(null)
onBeforeUnmount(listen('hologram:hover', ({ id }) => { hovered.value = id }))

const body = computed(() =>
{
    const id = hovered.value
    if(!id)
        return null
    const location = locations.find((item) => item.id === id)
    const other = exhibits.hologram[id]
    const name = location?.name || other?.name
    if(!has(name))
        return null
    return {
        id,
        name,
        description: location?.description || other?.description || '',
        travel: !!location && config.some((planet) => planet.id === id) && id !== props.current,
        here: id === props.current
    }
})

const travel = (autopilot) => send('flight:request', { to: body.value.id, autopilot, cut: true })
const leave = () => send('hologram:exit')
</script>

<template>
    <div class="iw-holo">
        <div class="iw-holo__hint" role="status">
            <span>Drag to rotate · Scroll to zoom · Point at a place</span>
            <button class="iw-holo__button iw-holo__button--ghost" type="button" @click="leave">Leave <kbd>Esc</kbd></button>
        </div>

        <Transition name="iw-holo-card">
            <div v-if="body" :key="body.id" class="iw-holo__card" role="group" :aria-label="body.name">
                <p v-if="body.here" class="iw-holo__here">You are here</p>
                <p class="iw-holo__name">{{ body.name }}</p>
                <p v-if="has(body.description)" class="iw-holo__description">{{ body.description }}</p>
                <div v-if="body.travel" class="iw-holo__actions">
                    <button class="iw-holo__button iw-holo__button--primary" type="button" @click="travel(true)">Autopilot</button>
                    <button class="iw-holo__button" type="button" @click="travel(false)">Fly it yourself</button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.iw-holo__hint
{
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 8px 10px 8px 18px;
    border: 1px solid var(--iw-border);
    border-radius: 999px;
    background: var(--iw-glass);
    backdrop-filter: blur(12px);
    color: var(--iw-text-dim);
    font-size: 14px;
    pointer-events: auto;
    z-index: 30;
}

.iw-holo__card
{
    position: fixed;
    left: 50%;
    bottom: 36px;
    transform: translateX(-50%);
    display: grid;
    gap: 8px;
    width: min(420px, calc(100vw - 32px));
    padding: 18px 20px;
    border: 1px solid var(--iw-border-strong);
    border-radius: var(--iw-radius-md);
    background: var(--iw-glass);
    backdrop-filter: blur(12px);
    color: var(--iw-text);
    pointer-events: auto;
    z-index: 30;
}

.iw-holo__here { margin: 0; color: var(--iw-glow); font: 700 11px/1.2 var(--iw-font-mono); letter-spacing: .1em; text-transform: uppercase; }
.iw-holo__name { margin: 0; font-size: 20px; font-weight: 700; }
.iw-holo__description { margin: 0; color: var(--iw-text-dim); font-size: 15px; line-height: 1.45; }
.iw-holo__actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 6px; }

.iw-holo__button
{
    min-height: 40px;
    padding: 10px 16px;
    border: 1px solid var(--iw-border-strong);
    border-radius: var(--iw-radius-sm);
    background: transparent;
    color: var(--iw-text);
    font: 700 12px/1 var(--iw-font-mono);
    letter-spacing: .08em;
    text-transform: uppercase;
}

.iw-holo__button--primary { border-color: var(--iw-glow); background: rgba(127, 249, 255, 0.12); }
.iw-holo__button--ghost { min-height: 32px; padding: 6px 12px; border-radius: 999px; }
.iw-holo__button:hover { border-color: var(--iw-glow); }
.iw-holo__button:focus-visible { outline: 2px solid var(--iw-glow); outline-offset: 2px; }
kbd { margin-left: 6px; color: var(--iw-text-dim); font: 11px var(--iw-font-mono); }

.iw-holo-card-enter-active, .iw-holo-card-leave-active { transition: opacity .2s var(--iw-ease); }
.iw-holo-card-enter-from, .iw-holo-card-leave-to { opacity: 0; }
</style>
