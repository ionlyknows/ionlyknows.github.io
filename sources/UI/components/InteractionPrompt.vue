<script setup>
import { computed } from 'vue'

const props = defineProps({
    type: { type: String, required: true },
    id: { type: String, default: '' }
})

// Prompt label per panel type opened by a content point
const labels = {
    about: 'About me',
    contact: 'Contact',
    work: 'View project',
    skills: 'View skills',
    achievements: 'View certificate',
    activities: 'View activity',
    photo: 'View photo',
    goals: 'View goals',
    hologram: 'Explore the hologram',
    destinations: 'Travel',
    egg: 'Inspect'
}

// Launch pads and the station's hangar console (M6b) both open the destination picker
const label = computed(() => labels[props.type] || '')
</script>

<template>
    <div v-if="label" class="iw-prompt" role="status" aria-live="polite">
        <kbd class="iw-prompt__key">E</kbd>
        <span class="iw-prompt__dash">—</span>
        <span>{{ label }}</span>
    </div>
</template>

<style scoped>
.iw-prompt
{
    position: fixed;
    left: 50%;
    bottom: 48px;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 18px 10px 10px;
    border: 1px solid var(--iw-border-strong);
    border-radius: 999px;
    background: var(--iw-ink-soft);
    backdrop-filter: blur(8px);
    color: var(--iw-text);
    font-family: var(--iw-font);
    font-size: 14px;
    letter-spacing: 0.02em;
    pointer-events: none;
    animation: iw-prompt-in 0.25s var(--iw-ease);
}

.iw-prompt__key
{
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: var(--iw-radius-sm);
    background: var(--iw-accent);
    color: var(--iw-ink);
    font-family: var(--iw-font-mono);
    font-size: 13px;
    font-weight: 700;
}

.iw-prompt__dash
{
    color: var(--iw-text-dim);
}

@keyframes iw-prompt-in
{
    from { opacity: 0; transform: translate(-50%, 8px); }
    to { opacity: 1; transform: translate(-50%, 0); }
}

@media (prefers-reduced-motion: reduce)
{
    .iw-prompt { animation: none; }
}
</style>
