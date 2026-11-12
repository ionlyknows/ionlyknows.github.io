<script setup>
import PanelShell from './PanelShell.vue'
import { usePanelEscape } from '../../composables/usePanelEscape.js'
import goals from '../../../content/goals.js'
import exhibits from '../../../content/exhibits.js'
import { has } from '../../visibleContent.js'

// M6: The Observatory's goals console (currently learning, next, goal); empty parts hidden
const emit = defineEmits([ 'close' ])
const lists = [ 'currentlyLearning', 'next' ].filter((key) => has(goals[key]))

function close() { emit('close') }
usePanelEscape(close)
</script>

<template>
    <PanelShell :title="exhibits.goals.title" @close="close">
        <div class="iw-goals">
            <section v-for="key in lists" :key="key" class="iw-goals__group">
                <h3 class="iw-goals__heading">{{ exhibits.goals[key] }}</h3>
                <ul class="iw-goals__tags">
                    <li v-for="item in goals[key].filter(has)" :key="item" class="iw-goals__tag">{{ item }}</li>
                </ul>
            </section>
            <section v-if="has(goals.goal)" class="iw-goals__group">
                <h3 class="iw-goals__heading">{{ exhibits.goals.goal }}</h3>
                <p class="iw-goals__text">{{ goals.goal }}</p>
            </section>
        </div>
    </PanelShell>
</template>

<style scoped>
.iw-goals { display: grid; gap: 22px; }
.iw-goals__group { display: grid; gap: 10px; }
.iw-goals__heading { margin: 0; color: var(--iw-loc-observatory); font: 700 12px/1 var(--iw-font-mono); letter-spacing: .12em; text-transform: uppercase; }
.iw-goals__tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 0; padding: 0; list-style: none; }
.iw-goals__tag { padding: 8px 14px; border: 1px solid var(--iw-border-strong); border-radius: 999px; color: var(--iw-text); font-size: 15px; }
.iw-goals__text { margin: 0; color: var(--iw-text); font-size: 16px; line-height: 1.55; }
</style>
