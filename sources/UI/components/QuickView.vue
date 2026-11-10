<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import QuickViewContent from './quick/QuickViewContent.vue'
import { useUIBridge } from '../composables/useUIBridge.js'

// S5 desktop overlay over the paused scene, with a sticky "Back to the adventure" button
const emit = defineEmits([ 'close' ])
const { listen } = useUIBridge()

const rootEl = ref(null)
const backEl = ref(null)
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
let tween = null
const opener = document.activeElement

onMounted(() =>
{
    tween = gsap.fromTo(rootEl.value, { opacity: 0, y: reducedMotion ? 0 : 12 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' })
    backEl.value?.focus()
})

onBeforeUnmount(() =>
{
    tween?.kill()
    opener?.focus?.()
})

onBeforeUnmount(listen('escapePressed', () => emit('close')))
</script>

<template>
    <div ref="rootEl" class="iw-quick iw-scrollable" role="dialog" aria-modal="true" aria-label="Portfolio quick view">
        <div class="iw-quick__bar">
            <button ref="backEl" class="iw-quick__back" type="button" @click="emit('close')">← Back to the adventure</button>
        </div>
        <QuickViewContent />
    </div>
</template>

<style scoped>
.iw-quick
{
    position: fixed;
    inset: 0;
    z-index: 120; /* above the loading screen: it can open from there */
    overflow-y: auto;
    background:
        radial-gradient(ellipse at 80% -10%, rgba(59, 42, 140, 0.35), transparent 55%),
        radial-gradient(ellipse at 0% 110%, rgba(31, 111, 139, 0.28), transparent 50%),
        rgba(2, 3, 9, 0.94);
    backdrop-filter: blur(14px);
    pointer-events: auto;
    user-select: text;
}

.iw-quick__bar
{
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    justify-content: flex-end;
    padding: 16px 24px 16px 16px;
    background: linear-gradient(rgba(2, 3, 9, 0.92), rgba(2, 3, 9, 0));
    pointer-events: none;
}

.iw-quick__back
{
    min-height: 44px;
    margin-right: 56px; /* room for the sound toggle */
    padding: 10px 18px;
    border: 1px solid var(--iw-border-strong);
    border-radius: 999px;
    background: var(--iw-glass);
    backdrop-filter: blur(12px);
    color: var(--iw-text);
    font-size: 15px;
    font-weight: 600;
    pointer-events: auto;
}

.iw-quick__back:hover
{
    border-color: var(--iw-glow);
}

.iw-quick__back:focus-visible
{
    outline: 2px solid var(--iw-glow);
    outline-offset: 3px;
}
</style>
