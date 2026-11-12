<script setup>
import PanelShell from './PanelShell.vue'
import { usePanelEscape } from '../../composables/usePanelEscape.js'
import photos from '../../../content/photos.js'
import { has } from '../../visibleContent.js'

// M6: a photo from the station's Photos room, full size with its caption
const props = defineProps({ itemId: { type: String, default: '' } })
const emit = defineEmits([ 'close' ])
const photo = photos.find((item) => item.id === props.itemId && has(item.src))

function close() { emit('close') }
usePanelEscape(close)
</script>

<template>
    <PanelShell :title="photo && has(photo.caption) ? photo.caption : 'Photo'" variant="fullscreen" @close="close">
        <figure v-if="photo" class="iw-photo">
            <img class="iw-photo__image" :src="photo.src" :alt="photo.alt || photo.caption || ''">
            <figcaption v-if="has(photo.caption)" class="iw-photo__caption">{{ photo.caption }}</figcaption>
        </figure>
    </PanelShell>
</template>

<style scoped>
.iw-photo { display: grid; gap: 14px; margin: 0; }
.iw-photo__image { width: 100%; max-height: 70vh; object-fit: contain; border-radius: var(--iw-radius-md); background: rgba(0, 0, 0, 0.3); }
.iw-photo__caption { color: var(--iw-text-dim); font-size: 16px; line-height: 1.5; }
</style>
