<script setup>
import PanelShell from './PanelShell.vue'
import { usePanelEscape } from '../../composables/usePanelEscape.js'
import about from '../../data/about.js'

const emit = defineEmits([ 'close' ])

function close() { emit('close') }

usePanelEscape(close)
</script>

<template>
    <PanelShell variant="fullscreen" :title="about.name" :subtitle="about.role" @close="close">
        <p class="iw-about__bio">{{ about.bio }}</p>

        <h3 class="iw-about__heading">Timeline</h3>
        <ol class="iw-about__timeline">
            <li v-for="entry in about.timeline" :key="entry.year + entry.title" class="iw-about__timeline-item">
                <span class="iw-about__timeline-year">{{ entry.year }}</span>
                <div>
                    <p class="iw-about__timeline-title">{{ entry.title }}</p>
                    <p class="iw-about__timeline-place">{{ entry.place }}</p>
                </div>
                <span class="iw-about__timeline-kind">{{ entry.kind }}</span>
            </li>
        </ol>

        <h3 class="iw-about__heading">Skills</h3>
        <div class="iw-about__skills">
            <div v-for="group in about.skills" :key="group.group" class="iw-about__skill-group">
                <p class="iw-about__skill-group-title">{{ group.group }}</p>
                <ul>
                    <li v-for="item in group.items" :key="item">{{ item }}</li>
                </ul>
            </div>
        </div>

        <h3 class="iw-about__heading">Contact</h3>
        <div class="iw-about__contact">
            <a v-if="about.contact.email" :href="`mailto:${about.contact.email}`">{{ about.contact.email }}</a>
            <a v-if="about.contact.github" :href="about.contact.github" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a v-if="about.contact.linkedin" :href="about.contact.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
    </PanelShell>
</template>

<style scoped>
.iw-about__bio
{
    font-size: 15px;
    line-height: 1.7;
    color: var(--iw-text-dim);
    margin: 0 0 26px;
}

.iw-about__heading
{
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--iw-accent);
    margin: 0 0 14px;
    font-family: var(--iw-font-mono);
}

.iw-about__timeline
{
    list-style: none;
    margin: 0 0 30px;
    padding: 0;
    border-left: 1px solid var(--iw-border);
}

.iw-about__timeline-item
{
    display: grid;
    grid-template-columns: 60px 1fr auto;
    align-items: baseline;
    gap: 12px;
    padding: 0 0 18px 18px;
    position: relative;
}

.iw-about__timeline-item::before
{
    content: '';
    position: absolute;
    left: -4.5px;
    top: 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--iw-accent);
}

.iw-about__timeline-year
{
    font-family: var(--iw-font-mono);
    font-size: 12px;
    color: var(--iw-text-dim);
}

.iw-about__timeline-title
{
    margin: 0;
    font-size: 14px;
    font-weight: 600;
}

.iw-about__timeline-place
{
    margin: 2px 0 0;
    font-size: 12px;
    color: var(--iw-text-dim);
}

.iw-about__timeline-kind
{
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--iw-text-dim);
    align-self: start;
}

.iw-about__skills
{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 18px;
    margin-bottom: 30px;
}

.iw-about__skill-group-title
{
    margin: 0 0 8px;
    font-size: 13px;
    font-weight: 600;
}

.iw-about__skill-group ul
{
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.iw-about__skill-group li
{
    font-size: 13px;
    color: var(--iw-text-dim);
}

.iw-about__contact
{
    display: flex;
    gap: 14px;
}

.iw-about__contact a
{
    padding: 9px 16px;
    border: 1px solid var(--iw-border-strong);
    border-radius: var(--iw-radius-sm);
    color: var(--iw-text);
    font-size: 12px;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.iw-about__contact a:hover
{
    background: rgba(255, 255, 255, 0.06);
}
</style>
