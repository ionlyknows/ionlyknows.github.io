<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import PanelShell from './PanelShell.vue'
import { usePanelEscape } from '../../composables/usePanelEscape.js'
import { useUIBridge } from '../../composables/useUIBridge.js'
import stations from '../../../content/radio.js'
import exhibits from '../../../content/exhibits.js'
import { has } from '../../visibleContent.js'
import { track } from '../../../Game/Analytics.js'

// M7 radio dish tuner (The Observatory): drag the dial or use ← →; static between the stations, a
// NASA recording at each (Game/Audio.js plays them; they load when the tuner opens). E or Esc closes.
const emit = defineEmits([ 'close' ])
const { emit: send } = useUIBridge()
const STEP = 0.01
const BAND = 0.06 // = Game/Audio.js RADIO.band

const value = ref(0.2)
const tuned = computed(() =>
{
    let best = null
    for(const station of stations)
        if(Math.abs(value.value - station.dial) < BAND * 0.5 && has(station.label))
            best = station
    return best
})

function set(next)
{
    value.value = Math.min(1, Math.max(0, next))
    send('radio:tune', { value: value.value })
}

function onKeydown(event)
{
    if(event.code === 'ArrowLeft' || event.code === 'ArrowRight')
    {
        event.preventDefault()
        set(value.value + (event.code === 'ArrowRight' ? STEP : - STEP))
    }
    else if(event.code === 'KeyE' && !event.repeat)
        close()
}

function close() { emit('close') }
usePanelEscape(close)

onMounted(() =>
{
    send('radio:open')
    send('radio:tune', { value: value.value })
    window.addEventListener('keydown', onKeydown)
    track('explore_use', { id: 'radio' })
})
onBeforeUnmount(() =>
{
    window.removeEventListener('keydown', onKeydown)
    send('radio:close')
})
</script>

<template>
    <PanelShell :title="exhibits.radio.title" :subtitle="exhibits.radio.hint" @close="close">
        <div class="iw-radio">
            <div class="iw-radio__scale" aria-hidden="true">
                <span v-for="station in stations" :key="station.id" class="iw-radio__mark" :style="{ left: `${station.dial * 100}%` }" />
                <span class="iw-radio__needle" :style="{ left: `${value * 100}%` }" />
            </div>
            <input
                class="iw-radio__dial"
                type="range"
                min="0"
                max="1"
                step="0.002"
                :value="value"
                :aria-label="exhibits.radio.dial"
                @input="set(Number($event.target.value))"
            >
            <p class="iw-radio__label" role="status" aria-live="polite">{{ tuned ? tuned.label : exhibits.radio.static }}</p>
        </div>
    </PanelShell>
</template>

<style scoped>
.iw-radio { display: grid; gap: 14px; }
.iw-radio__scale
{
    position: relative;
    height: 34px;
    border: 1px solid var(--iw-border-strong);
    border-radius: var(--iw-radius-sm);
    background: repeating-linear-gradient(90deg, transparent 0 calc(5% - 1px), var(--iw-border) calc(5% - 1px) 5%);
}
.iw-radio__mark { position: absolute; bottom: 0; width: 2px; height: 12px; margin-left: -1px; background: var(--iw-loc-observatory); }
.iw-radio__needle { position: absolute; top: -4px; bottom: -4px; width: 2px; margin-left: -1px; background: var(--iw-glow); box-shadow: 0 0 8px var(--iw-glow); }
.iw-radio__dial { width: 100%; accent-color: var(--iw-loc-observatory); }
.iw-radio__label { min-height: 1.5em; margin: 0; color: var(--iw-text); font-size: 16px; line-height: 1.5; }
</style>
