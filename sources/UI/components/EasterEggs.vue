<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useUIBridge } from '../composables/useUIBridge.js'
import eggs from '../../content/eggs.js'
import profile from '../../content/profile.js'
import { has } from '../visibleContent.js'

// BR-11: a short toast per find and a small x/3 counter (shown after the first find)
const props = defineProps({
    count: { type: Number, default: 0 },
    total: { type: Number, default: 3 },
    showCounter: { type: Boolean, default: true }
})

const found = ref(props.count)
const toasts = ref([])
let nextId = 0
const timers = []

function toast(text, delay = 0)
{
    timers.push(window.setTimeout(() =>
    {
        const id = nextId++
        toasts.value.push({ id, text })
        timers.push(window.setTimeout(() => { toasts.value = toasts.value.filter((item) => item.id !== id) }, 3200))
    }, delay))
}

const { listen } = useUIBridge()
const stop = listen('egg:found', ({ id, isNew, count, total }) =>
{
    found.value = count
    const egg = eggs[id]
    if(!egg)
        return
    toast(egg.withLocation && has(profile.location) ? `${egg.toast}: ${profile.location}` : egg.toast)
    if(isNew && count === total)
        toast(eggs.all, 1400)
})

onBeforeUnmount(() =>
{
    stop()
    timers.forEach((timer) => window.clearTimeout(timer))
})
</script>

<template>
    <p v-if="showCounter && found > 0" class="iw-eggs__counter" :aria-label="`${found} of ${total} ${eggs.counter} found`">
        <span aria-hidden="true">★</span> {{ found }}/{{ total }}
    </p>
    <TransitionGroup tag="div" name="iw-toast" class="iw-eggs__toasts" role="status" aria-live="polite">
        <p v-for="item in toasts" :key="item.id" class="iw-eggs__toast">{{ item.text }}</p>
    </TransitionGroup>
</template>

<style scoped>
.iw-eggs__counter
{
    position: fixed;
    top: 76px;
    left: 24px;
    margin: 0;
    padding: 6px 12px;
    background: var(--iw-ink-soft);
    border: 1px solid var(--iw-border);
    border-radius: 999px;
    backdrop-filter: blur(8px);
    color: var(--iw-accent-2);
    font-family: var(--iw-font-mono);
    font-size: 13px;
    pointer-events: none;
    z-index: 20;
}

.iw-eggs__toasts
{
    position: fixed;
    top: 84px;
    left: 50%;
    transform: translateX(-50%);
    display: grid;
    justify-items: center;
    gap: 8px;
    pointer-events: none;
    z-index: 60;
}

.iw-eggs__toast
{
    margin: 0;
    padding: 10px 18px;
    background: var(--iw-ink-soft);
    border: 1px solid var(--iw-border-strong);
    border-radius: 999px;
    backdrop-filter: blur(8px);
    color: var(--iw-text);
    font-family: var(--iw-font);
    font-size: 15px;
    font-weight: 600;
}

.iw-toast-enter-active, .iw-toast-leave-active { transition: opacity 0.3s var(--iw-ease), transform 0.3s var(--iw-ease); }
.iw-toast-enter-from, .iw-toast-leave-to { opacity: 0; transform: translateY(-8px); }

@media (prefers-reduced-motion: reduce)
{
    .iw-toast-enter-from, .iw-toast-leave-to { transform: none; }
}

@media (max-width: 560px)
{
    .iw-eggs__counter { top: 72px; left: 16px; }
}
</style>
