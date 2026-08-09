<script setup>
import { computed } from 'vue'
import projects from '../data/projects.js'

const props = defineProps({
    bridge: { type: Object, required: true },
    projectIndex: { type: Number, default: 0 }
})

// Kept only for the aria-labels below -- title/description/GitHub link are
// now drawn directly onto the billboard's own screen texture (title +
// INFO/VIEW REPO buttons -- see Billboard.js#drawScreen), not duplicated
// here as a separate DOM panel.
const project = computed(() => projects[props.projectIndex] || projects[0])

function previous() { props.bridge.emit('billboardPrevious') }
function next() { props.bridge.emit('billboardNext') }
function close() { props.bridge.emit('closeWorkBillboard') }
</script>

<template>
    <section class="iw-billboard-controls" aria-label="Billboard project controls">
        <button
            type="button"
            class="iw-billboard-controls__arrow"
            :aria-label="`Previous project (currently ${project?.title})`"
            @click="previous"
        >←</button>

        <!-- Small, secondary -- ESC is the primary way to exit (see
             App.vue/index.js), this just covers devices without a real
             Escape key (touch/mobile). -->
        <button type="button" class="iw-billboard-controls__close" aria-label="Close billboard view" @click="close">
            ESC
        </button>

        <button
            type="button"
            class="iw-billboard-controls__arrow"
            :aria-label="`Next project (currently ${project?.title})`"
            @click="next"
        >→</button>
    </section>
</template>

<style scoped>
.iw-billboard-controls
{
    position: fixed;
    left: 50%;
    bottom: 5vh;
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
.iw-billboard-controls__close
{
    min-height: 38px;
    padding: 9px 14px;
    border: 1px solid #35f6ff;
    border-radius: 2px;
    background: rgba(3, 10, 18, 0.7);
    color: inherit;
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

.iw-billboard-controls__close
{
    border-color: #ff174f;
    color: #ff174f;
}

@media (max-width: 720px)
{
    .iw-billboard-controls { bottom: 14px; gap: 8px; }
}
</style>
