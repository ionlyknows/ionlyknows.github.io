<script setup>
import { ref } from 'vue'
import locations from '../../content/locations.js'

defineProps({ current: { type: String, default: '' } })
const emit = defineEmits([ 'travel' ])

const open = ref(false)
</script>

<template>
    <nav class="iw-locations" aria-label="Locations">
        <button
            class="iw-locations__toggle"
            type="button"
            :aria-expanded="open"
            aria-controls="iw-locations-list"
            @click="open = !open"
        >
            <span class="iw-locations__icon" aria-hidden="true">{{ open ? '−' : '+' }}</span>
            Locations
        </button>

        <ul v-show="open" id="iw-locations-list" class="iw-locations__list">
            <li v-for="location in locations" :key="location.id">
                <button
                    class="iw-locations__item"
                    :class="{ 'is-current': location.id === current }"
                    type="button"
                    :disabled="location.id === current"
                    :aria-current="location.id === current ? 'location' : undefined"
                    @click="emit('travel', location.id)"
                >
                    <span class="iw-locations__dot" :style="{ background: `var(--iw-loc-${location.id})` }" aria-hidden="true" />
                    {{ location.name }}
                </button>
            </li>
        </ul>
    </nav>
</template>

<style scoped>
.iw-locations
{
    position: fixed;
    top: 96px;
    left: 20px;
    display: grid;
    gap: 8px;
    justify-items: start;
    z-index: 20;
    pointer-events: auto;
}

.iw-locations__toggle,
.iw-locations__list
{
    border: 1px solid var(--iw-border);
    background: var(--iw-glass);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}

.iw-locations__toggle
{
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 16px 9px 12px;
    border-radius: 999px;
    color: var(--iw-text);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.iw-locations__icon
{
    width: 14px;
    color: var(--iw-glow);
    font-size: 16px;
    line-height: 1;
}

.iw-locations__list
{
    display: grid;
    gap: 2px;
    margin: 0;
    padding: 6px;
    border-radius: var(--iw-radius-md);
    list-style: none;
}

.iw-locations__item
{
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 14px;
    border: none;
    border-radius: var(--iw-radius-sm);
    background: transparent;
    color: var(--iw-text);
    font-size: 14px;
    text-align: left;
    transition: background 0.2s var(--iw-ease);
}

.iw-locations__item:hover:not(:disabled)
{
    background: rgba(255, 255, 255, 0.08);
}

.iw-locations__item.is-current
{
    color: var(--iw-text-dim);
    cursor: default;
}

.iw-locations__dot
{
    width: 10px;
    height: 10px;
    border-radius: 50%;
    box-shadow: 0 0 8px currentColor;
}

.iw-locations__toggle:focus-visible,
.iw-locations__item:focus-visible
{
    outline: 2px solid var(--iw-glow);
    outline-offset: 2px;
}
</style>
