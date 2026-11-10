<script setup>
import PanelShell from './PanelShell.vue'
import { usePanelEscape } from '../../composables/usePanelEscape.js'
import contact from '../../../content/contact.js'
import { has } from '../../visibleContent.js'
import { track } from '../../../Game/Analytics.js'

const emit = defineEmits([ 'close' ])
const names = { email: 'Email', github: 'GitHub', linkedin: 'LinkedIn', facebook: 'Facebook' }
const links = contact.links.filter((link) => has(link.url))

function close() { emit('close') }
usePanelEscape(close)
</script>

<template>
    <PanelShell title="Contact" :subtitle="contact.subheading || ''" @close="close">
        <h3 v-if="has(contact.heading)" class="iw-contact__heading">{{ contact.heading }}</h3>
        <ul class="iw-contact">
            <li v-for="link in links" :key="link.type">
                <a
                    class="iw-contact__link"
                    :href="link.url"
                    :target="link.type === 'email' ? undefined : '_blank'"
                    :rel="link.type === 'email' ? undefined : 'noopener noreferrer'"
                    @click="track('contact_click', { type: link.type })"
                >
                    <span class="iw-contact__type">{{ names[link.type] || link.type }}</span>
                    <span class="iw-contact__label">{{ has(link.label) ? decodeURI(link.label) : link.url }}</span>
                </a>
            </li>
        </ul>
    </PanelShell>
</template>

<style scoped>
.iw-contact__heading
{
    margin: 0 0 18px;
    font-size: 26px;
}

.iw-contact
{
    display: grid;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.iw-contact__link
{
    display: grid;
    grid-template-columns: 110px 1fr;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    border: 1px solid var(--iw-border);
    border-radius: var(--iw-radius-md);
    background: rgba(111, 214, 255, 0.06);
    color: var(--iw-text);
    text-decoration: none;
    transition: border-color 0.2s var(--iw-ease), background 0.2s var(--iw-ease);
}

.iw-contact__link:hover
{
    border-color: var(--iw-loc-station);
    background: rgba(111, 214, 255, 0.12);
}

.iw-contact__link:focus-visible
{
    outline: 2px solid var(--iw-loc-station);
    outline-offset: 2px;
}

.iw-contact__type
{
    color: var(--iw-loc-station);
    font-family: var(--iw-font-mono);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

.iw-contact__label
{
    overflow-wrap: anywhere;
    font-size: 16px;
}

@media (max-width: 520px)
{
    .iw-contact__link { grid-template-columns: 1fr; gap: 4px; }
}
</style>
