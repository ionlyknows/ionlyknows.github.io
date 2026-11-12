<script setup>
import { computed } from 'vue'
import PanelShell from './PanelShell.vue'
import { usePanelEscape } from '../../composables/usePanelEscape.js'
import facts from '../../../content/facts.js'
import exhibits from '../../../content/exhibits.js'
import { has } from '../../visibleContent.js'

// M7 science lab: the fact card after a sample scan (content/facts.js), with its NASA source
const props = defineProps({ itemId: { type: String, default: '' } })
const emit = defineEmits([ 'close' ])
const fact = computed(() => facts.find((item) => item.id === props.itemId))

function close() { emit('close') }
usePanelEscape(close)
</script>

<template>
    <PanelShell v-if="fact" :title="fact.title" :subtitle="exhibits.lab.eyebrow" @close="close">
        <div class="iw-fact">
            <p class="iw-fact__text">{{ fact.text }}</p>
            <a v-if="has(fact.source)" class="iw-fact__source" :href="fact.source" target="_blank" rel="noopener noreferrer">{{ exhibits.lab.source }}</a>
        </div>
    </PanelShell>
</template>

<style scoped>
.iw-fact { display: grid; gap: 16px; }
.iw-fact__text { margin: 0; color: var(--iw-text); font-size: 17px; line-height: 1.6; }
.iw-fact__source { justify-self: start; color: var(--iw-loc-observatory); font: 700 12px/1 var(--iw-font-mono); letter-spacing: .1em; text-transform: uppercase; text-decoration: none; }
.iw-fact__source:hover, .iw-fact__source:focus-visible { text-decoration: underline; }
</style>
