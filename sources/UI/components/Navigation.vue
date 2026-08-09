<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import about from '../data/about.js'

defineProps({
    activePanel: { type: String, default: null }
})

const emit = defineEmits([ 'open-panel', 'return-to-spawn' ])

const items = [
    { id: 'work', label: 'Work' },
    { id: 'about', label: 'About' },
    { id: 'resume', label: 'Resume' }
]

const rootEl = ref(null)

onMounted(() =>
{
    gsap.from(rootEl.value.children, {
        opacity: 0,
        y: -12,
        stagger: 0.06,
        duration: 0.5,
        ease: 'power2.out'
    })
})
</script>

<template>
    <div ref="rootEl" class="iw-topbar">
        <div class="iw-topbar__mark">{{ about.name }}</div>

        <nav class="iw-topbar__nav">
            <button
                v-for="item in items"
                :key="item.id"
                class="iw-topbar__link"
                :class="{ 'is-active': activePanel === item.id }"
                type="button"
                @click="emit('open-panel', item.id)"
            >
                {{ item.label }}
            </button>
            <button class="iw-topbar__link" type="button" @click="emit('return-to-spawn')">
                Spawn
            </button>
        </nav>
    </div>
</template>

<style scoped>
.iw-topbar
{
    position: fixed;
    top: 20px;
    left: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 20;
    pointer-events: none;
}

.iw-topbar__mark
{
    padding: 8px 4px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--iw-text-dim);
    pointer-events: auto;
}

.iw-topbar__nav
{
    display: flex;
    gap: 4px;
    padding: 5px;
    background: var(--iw-ink-soft);
    border: 1px solid var(--iw-border);
    border-radius: 999px;
    backdrop-filter: blur(8px);
    pointer-events: auto;
}

.iw-topbar__link
{
    padding: 9px 20px;
    background: transparent;
    border: none;
    border-radius: 999px;
    color: var(--iw-text-dim);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    transition: color 0.2s var(--iw-ease), background 0.2s var(--iw-ease);
}

.iw-topbar__link:hover
{
    color: var(--iw-text);
    background: rgba(255, 255, 255, 0.06);
}

.iw-topbar__link.is-active
{
    color: var(--iw-ink);
    background: var(--iw-accent);
}

@media (max-width: 560px)
{
    .iw-topbar__mark { display: none; }
    .iw-topbar { justify-content: center; }
}
</style>
