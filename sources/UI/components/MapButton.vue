<script setup>
// HUD (M5): opens the map (same as the M key). Replaces the old Locations list.
const emit = defineEmits([ 'open' ])
</script>

<template>
    <button class="iw-map-button" type="button" aria-keyshortcuts="M" @click="emit('open')">
        <svg class="iw-map-button__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 4 3 6.5v13.5L9 17.5l6 2.5 6-2.5V4l-6 2.5L9 4Zm0 0v13.5m6-11v13.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
        </svg>
        Map <kbd>M</kbd>
    </button>
</template>

<style scoped>
.iw-map-button
{
    position: fixed;
    top: 96px;
    left: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 14px 9px 12px;
    border: 1px solid var(--iw-border);
    border-radius: 999px;
    background: var(--iw-glass);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: var(--iw-text);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    z-index: 20;
    pointer-events: auto;
    transition: border-color 0.2s var(--iw-ease);
}

.iw-map-button:hover
{
    border-color: var(--iw-glow);
}

.iw-map-button:focus-visible
{
    outline: 2px solid var(--iw-glow);
    outline-offset: 2px;
}

.iw-map-button__icon
{
    width: 16px;
    height: 16px;
    color: var(--iw-glow);
}

kbd
{
    padding: 1px 6px;
    border: 1px solid var(--iw-border-strong);
    border-radius: 4px;
    color: var(--iw-text-dim);
    font: 11px var(--iw-font-mono);
}
</style>
