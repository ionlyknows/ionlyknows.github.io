<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useUIBridge } from '../composables/useUIBridge.js'
import exhibits from '../../content/exhibits.js'
import goals from '../../content/goals.js'
import sky from '../../content/sky.js'
import { has } from '../visibleContent.js'

// M7 telescope view (The Observatory): round eyepiece with a lens edge, the centred constellation's
// name, the "Looking ahead" caption with Jefferson's goal under it (only when goals.goal is
// written, BR-07). Esc or E leaves.
const { emit: send, listen } = useUIBridge()

const target = ref(null)
onBeforeUnmount(listen('telescope:target', ({ id }) => { target.value = id }))
const name = computed(() => sky.find((item) => item.id === target.value)?.name || '')

const text = exhibits.telescope
const leave = () => send('telescope:exit')
</script>

<template>
    <div class="iw-scope">
        <div class="iw-scope__eyepiece" aria-hidden="true"></div>

        <div class="iw-scope__hint" role="status">
            <span>{{ text.hint }}</span>
            <button class="iw-scope__button" type="button" @click="leave">Leave <kbd>Esc</kbd></button>
        </div>

        <Transition name="iw-scope-name">
            <p v-if="has(name)" :key="name" class="iw-scope__name">{{ name }}</p>
        </Transition>

        <div class="iw-scope__caption">
            <p class="iw-scope__title">{{ text.caption }}</p>
            <p v-if="has(goals.goal)" class="iw-scope__goal">{{ goals.goal }}</p>
        </div>
    </div>
</template>

<style scoped>
.iw-scope
{
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 20;
}

/* Round field of view: clear centre, a thin glassy lens edge, black outside */
.iw-scope__eyepiece
{
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%,
        rgba(0, 0, 0, 0) 0,
        rgba(0, 0, 0, 0) 36vmin,
        rgba(0, 8, 12, 0.35) 41vmin,
        rgba(127, 249, 236, 0.16) 43vmin,
        rgba(2, 4, 8, 0.94) 44.5vmin,
        #000 47vmin);
    animation: iw-scope-in 0.6s var(--iw-ease);
}

.iw-scope__hint
{
    position: absolute;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 8px 10px 8px 18px;
    border: 1px solid var(--iw-border);
    border-radius: 999px;
    background: var(--iw-glass);
    color: var(--iw-text-dim);
    font-size: 14px;
    white-space: nowrap;
}

.iw-scope__button
{
    min-height: 32px;
    padding: 6px 12px;
    border: 1px solid var(--iw-border-strong);
    border-radius: 999px;
    background: transparent;
    color: var(--iw-text);
    font: 700 12px/1 var(--iw-font-mono);
    letter-spacing: .08em;
    text-transform: uppercase;
    pointer-events: auto;
}

.iw-scope__button:hover { border-color: var(--iw-glow); }
.iw-scope__button:focus-visible { outline: 2px solid var(--iw-glow); outline-offset: 2px; }
kbd { margin-left: 6px; color: var(--iw-text-dim); font: 11px var(--iw-font-mono); }

.iw-scope__name
{
    position: absolute;
    left: 50%;
    top: calc(50% + 30vmin);
    transform: translateX(-50%);
    margin: 0;
    color: var(--iw-glow);
    font: 700 13px/1.2 var(--iw-font-mono);
    letter-spacing: .14em;
    text-transform: uppercase;
    white-space: nowrap;
}

.iw-scope__caption
{
    position: absolute;
    left: 50%;
    bottom: 28px;
    transform: translateX(-50%);
    width: min(560px, calc(100vw - 32px));
    text-align: center;
}

.iw-scope__title { margin: 0; color: var(--iw-text); font-size: 15px; font-weight: 700; letter-spacing: .04em; }
.iw-scope__goal { margin: 6px 0 0; color: var(--iw-text-dim); font-size: 14px; line-height: 1.45; }

.iw-scope-name-enter-active, .iw-scope-name-leave-active { transition: opacity .3s var(--iw-ease); }
.iw-scope-name-enter-from, .iw-scope-name-leave-to { opacity: 0; }

@keyframes iw-scope-in
{
    from { opacity: 0; }
    to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce)
{
    .iw-scope__eyepiece { animation: none; }
}
</style>
