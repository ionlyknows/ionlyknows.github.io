<script setup>
import PanelShell from './PanelShell.vue'
import { usePanelEscape } from '../../composables/usePanelEscape.js'
import skills from '../../../content/skills.js'
import { has } from '../../visibleContent.js'

const emit = defineEmits([ 'close' ])
const groups = skills.filter((group) => has(group.group) && has(group.items))

function close() { emit('close') }
usePanelEscape(close)
</script>

<template>
    <PanelShell title="Skills" @close="close">
        <div class="iw-skills">
            <section v-for="group in groups" :key="group.group" class="iw-skills__group">
                <h3 class="iw-skills__heading">{{ group.group }}</h3>
                <ul class="iw-skills__tags">
                    <li v-for="item in group.items.filter(has)" :key="item" class="iw-skills__tag">{{ item }}</li>
                </ul>
            </section>
        </div>
    </PanelShell>
</template>

<style scoped>
.iw-skills
{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 24px;
}

.iw-skills__heading
{
    margin: 0 0 12px;
    color: var(--iw-loc-observatory);
    font-family: var(--iw-font-mono);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}

.iw-skills__tags
{
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.iw-skills__tag
{
    padding: 7px 12px;
    border: 1px solid var(--iw-border-strong);
    border-radius: 999px;
    background: rgba(46, 196, 182, 0.1);
    color: var(--iw-text);
    font-size: 15px;
}
</style>
