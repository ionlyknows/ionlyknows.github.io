<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useUIBridge } from '../composables/useUIBridge.js'
import { useGame } from '../composables/useGame.js'

// FR-12: always-visible mute toggle (N key does the same). Talks to the game via UIBridge.
const { emit, listen } = useUIBridge()
const game = useGame()
const muted = ref(game.settings.getValues().sound.muted)

onBeforeUnmount(listen('settings:change', ({ sound }) => { if(sound) muted.value = sound.muted }))
</script>

<template>
    <button
        class="iw-sound"
        type="button"
        :aria-pressed="muted"
        :aria-label="muted ? 'Unmute sound (N)' : 'Mute sound (N)'"
        :title="muted ? 'Unmute (N)' : 'Mute (N)'"
        @click="emit('sound:toggle')"
    >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
            <path v-if="!muted" d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path v-else d="M16.5 9.5l5 5M21.5 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
    </button>
</template>

<style scoped>
.iw-sound
{
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 130; /* above loading screen and quick-view */
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 1px solid var(--iw-border-strong);
    border-radius: 50%;
    background: var(--iw-glass);
    backdrop-filter: blur(12px);
    color: var(--iw-text);
    pointer-events: auto;
}

.iw-sound:hover
{
    border-color: var(--iw-glow);
}

.iw-sound:focus-visible
{
    outline: 2px solid var(--iw-glow);
    outline-offset: 3px;
}
</style>
