<script setup>
import PanelShell from './PanelShell.vue'
import { usePanelEscape } from '../../composables/usePanelEscape.js'
import about from '../../data/about.js'

const emit = defineEmits([ 'close' ])

function close() { emit('close') }

usePanelEscape(close)

// Place your PDF at public/resume.pdf -- it will be served from /resume.pdf.
const RESUME_PATH = '/resume.pdf'
</script>

<template>
    <PanelShell title="Resume" :subtitle="about.name" @close="close">
        <p class="iw-resume__text">
            A quick overview of {{ about.role.toLowerCase() }} experience, education and skills.
            Download the full resume below, or check the About section for the detailed timeline.
        </p>

        <div class="iw-resume__actions">
            <a class="iw-resume__button" :href="RESUME_PATH" target="_blank" rel="noopener noreferrer">
                View Resume
            </a>
            <a class="iw-resume__button iw-resume__button--ghost" :href="RESUME_PATH" download>
                Download PDF
            </a>
        </div>

        <p class="iw-resume__note">
            (Drop your resume file at <code>public/resume.pdf</code> to enable these links.)
        </p>
    </PanelShell>
</template>

<style scoped>
.iw-resume__text
{
    font-size: 14px;
    line-height: 1.7;
    color: var(--iw-text-dim);
    margin: 0 0 24px;
}

.iw-resume__actions
{
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
}

.iw-resume__button
{
    padding: 12px 24px;
    background: var(--iw-accent);
    color: var(--iw-ink);
    border-radius: var(--iw-radius-sm);
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.iw-resume__button--ghost
{
    background: transparent;
    color: var(--iw-text);
    border: 1px solid var(--iw-border-strong);
}

.iw-resume__note
{
    font-size: 11px;
    color: var(--iw-text-dim);
    font-family: var(--iw-font-mono);
}

.iw-resume__note code
{
    color: var(--iw-accent);
}
</style>
