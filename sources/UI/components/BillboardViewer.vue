<script setup>
import { computed } from 'vue'
import projects from '../data/projects.js'

const props = defineProps({
    bridge: { type: Object, required: true },
    projectIndex: { type: Number, default: 0 }
})

const project = computed(() => projects[props.projectIndex] || projects[0])

function previous() { props.bridge.emit('billboardPrevious') }
function next() { props.bridge.emit('billboardNext') }
function close() { props.bridge.emit('closeWorkBillboard') }
</script>

<template>
    <section class="iw-billboard-controls" aria-label="Billboard project controls">
        <button type="button" class="iw-billboard-controls__arrow" aria-label="Previous project" @click="previous">←</button>

        <div class="iw-billboard-controls__meta">
            <span>WORK ARCHIVE</span>
            <strong>{{ project?.title }}</strong>
        </div>

        <div class="iw-billboard-controls__links">
            <a v-if="project?.github" :href="project.github" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a v-if="project?.demo" :href="project.demo" target="_blank" rel="noopener noreferrer">Live Demo</a>
            <button type="button" @click="close">Close / Esc</button>
        </div>

        <button type="button" class="iw-billboard-controls__arrow" aria-label="Next project" @click="next">→</button>
    </section>
</template>

<style scoped>
.iw-billboard-controls
{
    position: fixed;
    left: 50%;
    bottom: 7vh;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 14px;
    z-index: 30;
    pointer-events: auto;
    color: var(--iw-text, #efffff);
    font-family: var(--iw-font-mono, monospace);
}

.iw-billboard-controls__arrow,
.iw-billboard-controls__links a,
.iw-billboard-controls__links button
{
    min-height: 38px;
    padding: 9px 14px;
    border: 1px solid #35f6ff;
    border-radius: 2px;
    background: rgba(3, 10, 18, 0.84);
    color: inherit;
    text-decoration: none;
    font: inherit;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    cursor: pointer;
}

.iw-billboard-controls__arrow
{
    color: #ff174f;
    font-size: 22px;
}

.iw-billboard-controls__meta
{
    min-width: 180px;
    display: grid;
    gap: 3px;
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 0.12em;
}

.iw-billboard-controls__meta span { color: #35f6ff; }
.iw-billboard-controls__meta strong { color: #ffffff; font-size: 12px; }
.iw-billboard-controls__links { display: flex; gap: 7px; }
.iw-billboard-controls__links button { border-color: #ff174f; }

@media (max-width: 720px)
{
    .iw-billboard-controls { bottom: 18px; gap: 6px; }
    .iw-billboard-controls__meta, .iw-billboard-controls__links a { display: none; }
}
</style>
