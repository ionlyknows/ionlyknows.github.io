<script>
// Module scope: the hint is shown once per visit, then fades out after 10 s
let shownOnce = false
</script>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible = ref(!shownOnce)
let timer = null

onMounted(() =>
{
    if(!visible.value)
        return

    shownOnce = true
    timer = window.setTimeout(() => { visible.value = false }, 10000)
})

onBeforeUnmount(() => window.clearTimeout(timer))

const controls = [
    { keys: [ 'W', 'A', 'S', 'D' ], label: 'move' },
    { keys: [ 'Shift' ], label: 'run' },
    { keys: [ 'Space' ], label: 'jump' },
    { keys: [ 'E' ], label: 'interact' },
    { keys: [ 'Drag' ], label: 'camera' }
]
</script>

<template>
    <Transition name="iw-hint">
        <ul v-if="visible" class="iw-hint" aria-label="Controls">
            <li v-for="control in controls" :key="control.label" class="iw-hint__row">
                <kbd v-for="key in control.keys" :key="key">{{ key }}</kbd>
                <span>{{ control.label }}</span>
            </li>
        </ul>
    </Transition>
</template>

<style scoped>
.iw-hint
{
    position: fixed;
    left: 20px;
    bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px 16px;
    max-width: calc(100vw - 40px);
    margin: 0;
    padding: 10px 14px;
    border: 1px solid var(--iw-border);
    border-radius: var(--iw-radius-md);
    background: var(--iw-glass);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: var(--iw-text-dim);
    font-size: 12px;
    list-style: none;
}

.iw-hint__row
{
    display: flex;
    align-items: center;
    gap: 4px;
}

.iw-hint__row span
{
    margin-left: 4px;
}

kbd
{
    min-width: 22px;
    padding: 2px 6px;
    border: 1px solid var(--iw-border-strong);
    border-radius: var(--iw-radius-sm);
    color: var(--iw-text);
    font-family: var(--iw-font-mono);
    font-size: 11px;
    text-align: center;
}

.iw-hint-leave-active
{
    transition: opacity 1s ease;
}

.iw-hint-leave-to
{
    opacity: 0;
}
</style>
