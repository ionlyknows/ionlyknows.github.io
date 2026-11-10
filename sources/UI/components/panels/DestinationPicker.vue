<script setup>
import PanelShell from './PanelShell.vue'
import { usePanelEscape } from '../../composables/usePanelEscape.js'
import locations from '../../../content/locations.js'
import { has } from '../../visibleContent.js'

const props = defineProps({ current: { type: String, default: '' } })
const emit = defineEmits([ 'close', 'travel' ])

// S3: cards for the other locations
const destinations = locations.filter((location) => location.id !== props.current && has(location.name))

function close() { emit('close') }
usePanelEscape(close)
</script>

<template>
    <PanelShell title="Choose a destination" @close="close">
        <ul class="iw-destinations">
            <li v-for="location in destinations" :key="location.id">
                <button
                    class="iw-destinations__card"
                    type="button"
                    :style="{ '--accent': `var(--iw-loc-${location.id})` }"
                    @click="emit('travel', location.id)"
                >
                    <span class="iw-destinations__icon" aria-hidden="true" />
                    <span class="iw-destinations__name">{{ location.name }}</span>
                    <span v-if="has(location.description)" class="iw-destinations__description">{{ location.description }}</span>
                </button>
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

.iw-destinations__card:hover
{
    border-color: var(--accent);
    background: rgba(255, 255, 255, 0.06);
    transform: translateY(-2px);
}

.iw-destinations__card:focus-visible
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
