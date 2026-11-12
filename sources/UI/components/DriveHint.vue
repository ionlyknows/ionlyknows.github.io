<script setup>
import { useUIBridge } from '../composables/useUIBridge.js'
import exhibits from '../../content/exhibits.js'

// M7 rover (The Observatory): driving keys, and a button to get out (Esc always works)
const { emit: send } = useUIBridge()
const leave = () => send('rover:exit')
</script>

<template>
    <div class="iw-drive" role="status">
        <span>{{ exhibits.rover.hint }}</span>
        <button class="iw-drive__button" type="button" @click="leave">Get out <kbd>Esc</kbd></button>
    </div>
</template>

<style scoped>
.iw-drive
{
    position: fixed;
    left: 50%;
    bottom: 36px;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 14px;
    max-width: calc(100vw - 32px);
    padding: 8px 10px 8px 18px;
    border: 1px solid var(--iw-border);
    border-radius: 999px;
    background: var(--iw-glass);
    backdrop-filter: blur(12px);
    color: var(--iw-text-dim);
    font-size: 14px;
    z-index: 20;
}

.iw-drive__button
{
    flex: none;
    min-height: 32px;
    padding: 6px 12px;
    border: 1px solid var(--iw-border-strong);
    border-radius: 999px;
    background: transparent;
    color: var(--iw-text);
    font: 700 12px/1 var(--iw-font-mono);
    letter-spacing: .08em;
    text-transform: uppercase;
}

.iw-drive__button:hover { border-color: var(--iw-glow); }
.iw-drive__button:focus-visible { outline: 2px solid var(--iw-glow); outline-offset: 2px; }
kbd { margin-left: 6px; color: var(--iw-text-dim); font: 11px var(--iw-font-mono); }
</style>
