<script setup>
import PanelShell from './PanelShell.vue'
import { usePanelEscape } from '../../composables/usePanelEscape.js'
import locations from '../../../content/locations.js'
import { has } from '../../visibleContent.js'

const props = defineProps({ current: { type: String, default: '' } })
const emit = defineEmits([ 'close', 'travel' ])

// S3: cards for the other locations, each with "Autopilot" or "Fly it yourself" (M5)
const destinations = locations.filter((location) => location.id !== props.current && has(location.name))

function close() { emit('close') }
usePanelEscape(close)
</script>

<template>
    <PanelShell title="Choose a destination" @close="close">
        <ul class="iw-destinations">
            <li v-for="location in destinations" :key="location.id">
                <div class="iw-destinations__card" :style="{ '--accent': `var(--iw-loc-${location.id})` }">
                    <span class="iw-destinations__icon" aria-hidden="true" />
                    <span class="iw-destinations__name">{{ location.name }}</span>
                    <span v-if="has(location.description)" class="iw-destinations__description">{{ location.description }}</span>
                    <span class="iw-destinations__actions">
                        <button class="iw-destinations__button iw-destinations__button--primary" type="button" :aria-label="`Autopilot to ${location.name}`" @click="emit('travel', { id: location.id, autopilot: true })">Autopilot</button>
                        <button class="iw-destinations__button" type="button" :aria-label="`Fly to ${location.name} yourself`" @click="emit('travel', { id: location.id, autopilot: false })">Fly it yourself</button>
                    </span>
                </div>
            </li>
        </ul>
    </PanelShell>
</template>

<style scoped>
.iw-destinations
{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 14px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.iw-destinations__card
{
    display: grid;
    justify-items: start;
    gap: 8px;
    width: 100%;
    height: 100%;
    padding: 20px;
    border: 1px solid var(--iw-border);
    border-radius: var(--iw-radius-md);
    background: rgba(255, 255, 255, 0.03);
    color: var(--iw-text);
    text-align: left;
    transition: border-color 0.2s var(--iw-ease), transform 0.2s var(--iw-ease), background 0.2s var(--iw-ease);
}

.iw-destinations__card:hover,
.iw-destinations__card:focus-within
{
    border-color: var(--accent);
    background: rgba(255, 255, 255, 0.06);
}

.iw-destinations__actions
{
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 6px;
}

.iw-destinations__button
{
    min-height: 38px;
    padding: 9px 12px;
    border: 1px solid var(--iw-border-strong);
    border-radius: var(--iw-radius-sm);
    background: transparent;
    color: var(--iw-text);
    font: 700 11px/1 var(--iw-font-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.iw-destinations__button--primary
{
    border-color: var(--accent);
    background: rgba(255, 255, 255, 0.06);
}

.iw-destinations__button:hover
{
    border-color: var(--accent);
}

.iw-destinations__button:focus-visible
{
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

.iw-destinations__icon
{
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #ffffff 0%, var(--accent) 45%, rgba(0, 0, 0, 0.4) 100%);
    box-shadow: 0 0 18px var(--accent);
}

.iw-destinations__name
{
    font-size: 18px;
    font-weight: 700;
}

.iw-destinations__description
{
    color: var(--iw-text-dim);
    font-size: 15px;
    line-height: 1.45;
}
</style>
