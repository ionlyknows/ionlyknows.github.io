<script setup>
import PanelShell from './PanelShell.vue'
import { usePanelEscape } from '../../composables/usePanelEscape.js'
import activities from '../../../content/activities.js'
import { has } from '../../visibleContent.js'

const emit = defineEmits([ 'close' ])
const items = activities.filter((activity) => has(activity.title))

function close() { emit('close') }
usePanelEscape(close)
</script>

<template>
    <PanelShell title="Activities" @close="close">
        <ul class="iw-activities">
            <li v-for="activity in items" :key="activity.id" class="iw-activities__card">
                <p v-if="has(activity.role) || has(activity.year)" class="iw-activities__meta">
                    <span v-if="has(activity.role)">{{ activity.role }}</span>
                    <span v-if="has(activity.role) && has(activity.year)"> · </span>
                    <span v-if="has(activity.year)">{{ activity.year }}</span>
                </p>
                <h3 class="iw-activities__title">{{ activity.title }}</h3>
                <p v-if="has(activity.description)" class="iw-activities__description">{{ activity.description }}</p>
                <a
                    v-if="has(activity.url)"
                    class="iw-activities__link"
                    :href="activity.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    :aria-label="`Open ${activity.title} (opens in a new tab)`"
                >Open page →</a>
            </li>
        </ul>
    </PanelShell>
</template>

<style scoped>
.iw-activities
{
    display: grid;
    gap: 14px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.iw-activities__card
{
    padding: 18px 20px;
    border: 1px solid var(--iw-border);
    border-radius: var(--iw-radius-md);
    background: rgba(255, 255, 255, 0.03);
}

.iw-activities__meta
{
    margin: 0 0 6px;
    color: var(--iw-loc-trophy);
    font-family: var(--iw-font-mono);
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.iw-activities__title
{
    margin: 0;
    font-size: 19px;
}

.iw-activities__description
{
    margin: 8px 0 0;
    color: var(--iw-text-dim);
    font-size: 16px;
    line-height: 1.55;
}

.iw-activities__link
{
    display: inline-block;
    margin-top: 12px;
    color: var(--iw-loc-trophy);
    font-weight: 600;
    text-decoration: none;
}

.iw-activities__link:hover { text-decoration: underline; }

.iw-activities__link:focus-visible
{
    outline: 2px solid var(--iw-loc-trophy);
    outline-offset: 3px;
}
</style>
