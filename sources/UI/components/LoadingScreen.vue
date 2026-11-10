<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import profile from '../../content/profile.js'

const props = defineProps({
    progress: { type: Number, default: 0 },
    ready: { type: Boolean, default: false }
})
const emit = defineEmits([ 'launch', 'quick' ])

const launchEl = ref(null)
const launched = ref(false)
let tween = null

watch(() => props.ready, async (ready) =>
{
    if(!ready)
        return

    await nextTick()
    tween = gsap.fromTo(launchEl.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
    launchEl.value?.focus()
})

function launch()
{
    if(launched.value)
        return

    launched.value = true
    emit('launch')
}

onBeforeUnmount(() => tween?.kill())
</script>

<template>
    <div class="iw-loading" role="status" aria-live="polite">
        <div class="iw-loading__content">
            <h1 v-if="profile.site?.title" class="iw-loading__title">{{ profile.site.title }}</h1>
            <p v-if="profile.site?.subtitle" class="iw-loading__subtitle">{{ profile.site.subtitle }}</p>

            <div
                class="iw-loading__track"
                role="progressbar"
                aria-label="Loading"
                aria-valuemin="0"
                aria-valuemax="100"
                :aria-valuenow="Math.round(progress * 100)"
            >
                <span :style="{ transform: `scaleX(${progress})` }" />
            </div>

            <button v-if="ready" ref="launchEl" class="iw-loading__launch" type="button" @click="launch">
                Launch
            </button>
        </div>

        <button class="iw-loading__skip" type="button" @click="emit('quick')">Skip the adventure →</button>
    </div>
</template>

<style scoped>
.iw-loading
{
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    z-index: 100;
    background: radial-gradient(circle at 50% 40%, #12204a 0%, var(--iw-space) 55%, #020309 100%);
    color: var(--iw-text);
    pointer-events: auto;
}

.iw-loading__content
{
    display: grid;
    justify-items: center;
    gap: 14px;
    width: min(360px, calc(100vw - 48px));
    text-align: center;
}

.iw-loading__title
{
    margin: 0;
    font-size: clamp(36px, 7vw, 56px);
    font-weight: 800;
    letter-spacing: 0.32em;
    padding-left: 0.32em;
    text-shadow: 0 0 24px rgba(127, 249, 255, 0.35);
}

.iw-loading__subtitle
{
    margin: -6px 0 18px;
    color: var(--iw-text-dim);
    font-family: var(--iw-font-mono);
    font-size: 13px;
    letter-spacing: 0.2em;
}

.iw-loading__track
{
    width: 100%;
    height: 3px;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(127, 249, 255, 0.16);
}

.iw-loading__track span
{
    display: block;
    height: 100%;
    background: var(--iw-glow);
    transform-origin: left center;
    transition: transform 0.4s var(--iw-ease);
}

.iw-loading__launch
{
    margin-top: 18px;
    padding: 14px 44px;
    border: 1px solid var(--iw-glow);
    border-radius: 999px;
    background: rgba(127, 249, 255, 0.12);
    color: var(--iw-text);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    box-shadow: 0 0 28px rgba(127, 249, 255, 0.25);
    transition: background 0.2s var(--iw-ease), box-shadow 0.2s var(--iw-ease);
}

.iw-loading__launch:hover
{
    background: rgba(127, 249, 255, 0.22);
    box-shadow: 0 0 40px rgba(127, 249, 255, 0.4);
}

.iw-loading__launch:focus-visible
{
    outline: 2px solid var(--iw-glow);
    outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce)
{
    .iw-loading__track span { transition: none; }
}

.iw-loading__skip
{
    position: fixed;
    top: 20px;
    right: 76px; /* next to the sound toggle */
    min-height: 44px;
    padding: 10px 18px;
    border: 1px solid var(--iw-border-strong);
    border-radius: 999px;
    background: var(--iw-glass);
    color: var(--iw-text);
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.04em;
}

.iw-loading__skip:hover
{
    border-color: var(--iw-glow);
}

.iw-loading__skip:focus-visible,
.iw-loading__launch:focus-visible
{
    outline: 2px solid var(--iw-glow);
    outline-offset: 3px;
}
</style>
