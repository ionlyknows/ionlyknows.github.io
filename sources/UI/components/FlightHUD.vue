<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useUIBridge } from '../composables/useUIBridge.js'

// M3 flight HUD: destination, distance, speed bar, an arrow at the screen edge when the
// destination is off-screen, and "Skip flight" (also Esc). Data comes from View/Ship.js.
const emit = defineEmits([ 'skip' ])
const hud = ref(null)

const { listen } = useUIBridge()
const stop = listen('flight:hud', (value) => { hud.value = value })
onBeforeUnmount(stop)

// 1 world unit = 1 m (the astronaut is ~1.9 units tall)
const distance = computed(() =>
{
    const meters = hud.value?.distance ?? 0
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`
})

// Arrow on an ellipse near the screen edge, pointing toward the destination
const arrowStyle = computed(() =>
{
    const angle = hud.value?.arrow
    if(angle === null || angle === undefined)
        return null
    return {
        left: `${50 + Math.cos(angle) * 44}%`,
        top: `${50 - Math.sin(angle) * 40}%`,
        transform: `translate(-50%, -50%) rotate(${- angle}rad)`
    }
})
</script>

<template>
    <div v-if="hud" class="iw-flight">
        <div class="iw-flight__panel" role="status" aria-live="off">
            <p class="iw-flight__label">{{ hud.autopilot ? 'Autopilot to' : 'Flying to' }}</p>
            <p class="iw-flight__name">{{ hud.name }}</p>
            <p class="iw-flight__distance">{{ distance }}</p>
            <div class="iw-flight__speed" :class="{ 'is-boosting': hud.boosting }" aria-hidden="true">
                <span :style="{ transform: `scaleX(${hud.speed})` }" />
            </div>
        </div>

        <button v-if="hud.skippable" class="iw-flight__skip" type="button" @click="emit('skip')">
            Skip flight <kbd>Esc</kbd>
        </button>

        <div v-if="arrowStyle" class="iw-flight__arrow" :style="arrowStyle" aria-hidden="true" />
    </div>
</template>

<style scoped>
.iw-flight__panel
{
    position: fixed;
    left: 50%;
    bottom: 28px;
    transform: translateX(-50%);
    display: grid;
    justify-items: center;
    gap: 4px;
    min-width: 220px;
    padding: 12px 22px 14px;
    background: var(--iw-ink-soft);
    border: 1px solid var(--iw-border);
    border-radius: var(--iw-radius-md);
    backdrop-filter: blur(8px);
    color: var(--iw-text);
    font-family: var(--iw-font);
    pointer-events: none;
    z-index: 20;
}

.iw-flight__label
{
    margin: 0;
    color: var(--iw-text-dim);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

.iw-flight__name
{
    margin: 0;
    font-size: 18px;
    font-weight: 700;
}

.iw-flight__distance
{
    margin: 0;
    color: var(--iw-glow);
    font-family: var(--iw-font-mono);
    font-size: 14px;
}

.iw-flight__speed
{
    width: 100%;
    height: 4px;
    margin-top: 6px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 999px;
}

.iw-flight__speed span
{
    display: block;
    height: 100%;
    background: var(--iw-glow);
    transform-origin: left center;
    transition: background 0.3s var(--iw-ease);
}

.iw-flight__speed.is-boosting span
{
    background: var(--iw-accent-2);
}

.iw-flight__skip
{
    position: fixed;
    right: 24px;
    bottom: 32px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px 10px 18px;
    background: var(--iw-ink-soft);
    border: 1px solid var(--iw-border-strong);
    border-radius: 999px;
    backdrop-filter: blur(8px);
    color: var(--iw-text);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.04em;
    pointer-events: auto; /* the UI layer itself lets clicks through to the canvas */
    z-index: 20;
}

.iw-flight__skip:hover
{
    border-color: var(--iw-glow);
}

.iw-flight__skip:focus-visible
{
    outline: 2px solid var(--iw-glow);
    outline-offset: 2px;
}

.iw-flight__skip kbd
{
    padding: 3px 7px;
    border-radius: var(--iw-radius-sm);
    background: rgba(255, 255, 255, 0.08);
    color: var(--iw-text-dim);
    font-family: var(--iw-font-mono);
    font-size: 11px;
}

/* Chevron pointing right at 0 rad, rotated toward the destination */
.iw-flight__arrow
{
    position: fixed;
    width: 0;
    height: 0;
    border-top: 11px solid transparent;
    border-bottom: 11px solid transparent;
    border-left: 18px solid var(--iw-glow);
    filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.6));
    pointer-events: none;
    z-index: 19;
}

@media (max-width: 560px)
{
    .iw-flight__panel { bottom: 84px; }
    .iw-flight__skip { right: 50%; transform: translateX(50%); bottom: 24px; }
}
</style>
