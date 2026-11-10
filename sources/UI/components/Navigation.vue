<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import profile from '../../content/profile.js'

defineProps({ location: { type: String, default: '' } })
const emit = defineEmits([ 'open-panel', 'quick' ])

const items = [
    { id: 'work', label: 'Work' },
    { id: 'about', label: 'About' },
    { id: 'settings', label: 'Settings' }
]

const rootEl = ref(null)
let tween = null

onBeforeUnmount(() => tween?.kill())

onMounted(() =>
{
    tween = gsap.from(rootEl.value.children, {
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
        <div class="iw-topbar__mark">
            <p v-if="location" class="iw-topbar__location">{{ location }}</p>
            <p class="iw-topbar__name">{{ profile.name }}</p>
        </div>

        <nav class="iw-topbar__nav">
            <button
                v-for="item in items"
                :key="item.id"
                class="iw-topbar__link"
                type="button"
                @click="emit('open-panel', item.id)"
            >
                {{ item.label }}
            </button>
            <button class="iw-topbar__link iw-topbar__skip" type="button" @click="emit('quick')">Skip the adventure</button>
        </nav>
    </div>
</template>

<style scoped>
.iw-topbar
{
    position: fixed;
    top: 20px;
    left: 20px;
    right: 76px; /* the sound toggle sits in the corner */
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 20;
    pointer-events: none;
}

.iw-topbar__mark
{
    padding: 4px;
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.6);
}

.iw-topbar__location
{
    margin: 0;
    color: var(--iw-text);
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.06em;
}

.iw-topbar__name
{
    margin: 2px 0 0;
    color: var(--iw-text-dim);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
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

/* FR-08: always-visible quick-view entry, slightly highlighted */
.iw-topbar__skip
{
    color: var(--iw-glow);
    background: rgba(127, 249, 255, 0.1);
}

.iw-topbar__skip:hover
{
    background: rgba(127, 249, 255, 0.2);
}
</style>
