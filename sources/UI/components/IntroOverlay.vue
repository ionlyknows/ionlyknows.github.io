<script setup>
import { ref, computed, onUnmounted } from 'vue'
import gsap from 'gsap'
import profile from '../../content/profile.js'
import { has } from '../visibleContent.js'
import { useUIBridge } from '../composables/useUIBridge.js'

const { emit, listen } = useUIBridge()
const beat = ref(null)
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Title text comes only from content/profile.js
const card = computed(() =>
{
    if(beat.value === 'title')
        return { title: profile.site?.title, subtitle: profile.site?.subtitle, large: true }
    if(beat.value === 'name')
        return { title: profile.name, subtitle: profile.role, large: false }
    return null
})

onUnmounted(listen('intro:beat', ({ beat: value }) => { beat.value = value }))

function onEnter(el, done)
{
    gsap.fromTo(el, { opacity: 0, y: reducedMotion ? 0 : 12 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', onComplete: done })
}

function onLeave(el, done)
{
    gsap.to(el, { opacity: 0, duration: 0.6, ease: 'power1.in', onComplete: done })
}
</script>

<template>
    <div class="iw-intro">
        <Transition :css="false" mode="out-in" @enter="onEnter" @leave="onLeave">
            <div v-if="card && has(card.title)" :key="beat" class="iw-intro__card" :class="{ 'iw-intro__card--large': card.large }">
                <p class="iw-intro__title">{{ card.title }}</p>
                <p v-if="has(card.subtitle)" class="iw-intro__subtitle">{{ card.subtitle }}</p>
            </div>
        </Transition>

        <button class="iw-intro__skip" type="button" @click="emit('intro:skip')">
            Skip <kbd>Esc</kbd>
        </button>
    </div>
</template>

<style scoped>
.iw-intro
{
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    z-index: 40;
    pointer-events: none;
}

.iw-intro__card
{
    text-align: center;
    text-shadow: 0 0 30px rgba(127, 249, 255, 0.35), 0 2px 12px rgba(0, 0, 0, 0.6);
}

.iw-intro__title
{
    margin: 0;
    font-size: clamp(28px, 4.5vw, 48px);
    font-weight: 700;
    letter-spacing: 0.08em;
}

.iw-intro__card--large .iw-intro__title
{
    font-size: clamp(44px, 9vw, 96px);
    font-weight: 800;
    letter-spacing: 0.32em;
    padding-left: 0.32em;
}

.iw-intro__subtitle
{
    margin: 10px 0 0;
    color: var(--iw-text-dim);
    font-family: var(--iw-font-mono);
    font-size: clamp(13px, 1.6vw, 17px);
    letter-spacing: 0.2em;
}

.iw-intro__skip
{
    position: fixed;
    right: 24px;
    bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    border: 1px solid var(--iw-border-strong);
    border-radius: 999px;
    background: var(--iw-glass);
    backdrop-filter: blur(12px);
    color: var(--iw-text);
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.08em;
    pointer-events: auto;
}

.iw-intro__skip kbd
{
    padding: 2px 6px;
    border: 1px solid var(--iw-border-strong);
    border-radius: var(--iw-radius-sm);
    color: var(--iw-text-dim);
    font-family: var(--iw-font-mono);
    font-size: 11px;
}

.iw-intro__skip:focus-visible
{
    outline: 2px solid var(--iw-glow);
    outline-offset: 3px;
}
</style>
