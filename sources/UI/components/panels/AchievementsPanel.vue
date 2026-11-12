<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import PanelShell from './PanelShell.vue'
import { useUIBridge } from '../../composables/useUIBridge.js'
import achievements from '../../../content/achievements.js'
import { has } from '../../visibleContent.js'
import { track } from '../../../Game/Analytics.js'

const props = defineProps({ itemId: { type: String, default: '' } }) // M6: opened from a station frame
const emit = defineEmits([ 'close' ])
const { listen } = useUIBridge()

const items = achievements.filter((item) => has(item.title))
const viewing = ref(null) // certificate shown in the viewer (FR-16)
const viewerEl = ref(null)
let opener = null

async function openViewer(item, event)
{
    opener = event.currentTarget
    viewing.value = item
    track('certificate_open', { id: item.id })
    await nextTick()
    viewerEl.value?.focus()
}

async function closeViewer()
{
    viewing.value = null
    await nextTick()
    opener?.focus()
}

function close() { emit('close') }

// Esc closes the top layer: the viewer first, then the panel (NFR-04)
onUnmounted(listen('escapePressed', () => viewing.value ? closeViewer() : close()))

const meta = (item) => [ item.issuer, item.year ].filter(has).join(' · ')

// Opened from a certificate frame in the station: straight to its viewer (credential link)
onMounted(async () =>
{
    const item = items.find((entry) => entry.id === props.itemId)
    if(!item)
        return
    viewing.value = item
    track('certificate_open', { id: item.id })
    await nextTick()
    viewerEl.value?.focus()
})
</script>

<template>
    <PanelShell :title="viewing ? viewing.title : 'Achievements'" :subtitle="viewing ? '' : 'Certificates'" @close="close">
        <div v-if="viewing" ref="viewerEl" class="iw-cert" tabindex="-1">
            <button class="iw-cert__back" type="button" @click="closeViewer">← All certificates</button>

            <img v-if="has(viewing.image)" class="iw-cert__image" :src="viewing.image" :alt="`${viewing.title} certificate`">

            <dl v-if="has(viewing.issuer) || has(viewing.year) || has(viewing.credentialId)" class="iw-cert__details">
                <div v-if="has(viewing.issuer)"><dt>Issuer</dt><dd>{{ viewing.issuer }}</dd></div>
                <div v-if="has(viewing.year)"><dt>Year</dt><dd>{{ viewing.year }}</dd></div>
                <div v-if="has(viewing.credentialId)"><dt>Credential ID</dt><dd>{{ viewing.credentialId }}</dd></div>
            </dl>

            <a
                v-if="has(viewing.credentialUrl)"
                class="iw-cert__credential"
                :href="viewing.credentialUrl"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`View credential for ${viewing.title} (opens in a new tab)`"
            >View credential ↗</a>
        </div>

        <ul v-else class="iw-achievements">
            <li v-for="item in items" :key="item.id">
                <button class="iw-achievements__card" type="button" @click="openViewer(item, $event)">
                    <img v-if="has(item.image)" class="iw-achievements__thumb" :src="item.image" alt="" loading="lazy">
                    <span class="iw-achievements__copy">
                        <span class="iw-achievements__title">{{ item.title }}</span>
                        <span v-if="meta(item)" class="iw-achievements__meta">{{ meta(item) }}</span>
                    </span>
                </button>
            </li>
        </ul>
    </PanelShell>
</template>

<style scoped>
.iw-achievements
{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 14px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.iw-achievements__card
{
    display: grid;
    gap: 12px;
    width: 100%;
    height: 100%;
    padding: 12px;
    border: 1px solid var(--iw-border);
    border-radius: var(--iw-radius-md);
    background: rgba(255, 207, 90, 0.05);
    color: var(--iw-text);
    text-align: left;
    transition: border-color 0.2s var(--iw-ease), transform 0.2s var(--iw-ease);
}

.iw-achievements__card:hover
{
    border-color: var(--iw-gold);
    transform: translateY(-2px);
}

.iw-achievements__card:focus-visible
{
    outline: 2px solid var(--iw-gold);
    outline-offset: 2px;
}

.iw-achievements__thumb
{
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: var(--iw-radius-sm);
    background: rgba(255, 255, 255, 0.04);
}

.iw-achievements__copy
{
    display: grid;
    gap: 4px;
}

.iw-achievements__title
{
    font-size: 16px;
    font-weight: 700;
}

.iw-achievements__meta
{
    color: var(--iw-text-dim);
    font-size: 14px;
}

.iw-cert
{
    display: grid;
    gap: 18px;
    outline: none;
}

.iw-cert__back
{
    justify-self: start;
    padding: 8px 12px;
    border: 1px solid var(--iw-border);
    border-radius: var(--iw-radius-sm);
    background: transparent;
    color: var(--iw-text);
    font-size: 14px;
}

.iw-cert__image
{
    width: 100%;
    max-height: 56vh;
    object-fit: contain;
    border-radius: var(--iw-radius-md);
    background: rgba(255, 255, 255, 0.04);
}

.iw-cert__details
{
    display: flex;
    flex-wrap: wrap;
    gap: 12px 32px;
    margin: 0;
}

.iw-cert__details dt
{
    color: var(--iw-gold);
    font-family: var(--iw-font-mono);
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

.iw-cert__details dd
{
    margin: 4px 0 0;
    font-size: 16px;
}

.iw-cert__credential
{
    justify-self: start;
    padding: 12px 20px;
    border-radius: 999px;
    background: var(--iw-gold);
    color: var(--iw-ink);
    font-weight: 700;
    text-decoration: none;
}

.iw-cert__back:focus-visible,
.iw-cert__credential:focus-visible
{
    outline: 2px solid var(--iw-gold);
    outline-offset: 3px;
}
</style>
