<script setup>
import { reactive, ref, onUnmounted } from 'vue'
import PanelShell from './PanelShell.vue'
import { useUIBridge } from '../../composables/useUIBridge.js'

// S7 / FR-13: quality, volume, mute, replay intro, reset. Every change applies live and is
// saved right away in `apeiron.settings`.
const props = defineProps({ settings: { type: Object, required: true } })
const emit = defineEmits([ 'close' ])
const values = reactive(props.settings.getValues())
const notification = ref('')
let notificationTimer = null

const apply = () => props.settings.apply(values)

// Auto quality drop (fps < 45 for 3 s), mute button and M key update the form
const { listen } = useUIBridge()
const stopSettingsChange = listen('settings:change', ({ quality, sound }) =>
{
    if(quality)
        values.quality = quality
    if(sound)
        Object.assign(values.sound, sound)
})

function showNotification(message)
{
    notification.value = message
    window.clearTimeout(notificationTimer)
    notificationTimer = window.setTimeout(() => { notification.value = '' }, 3200)
}

function replayIntro()
{
    props.settings.replayIntro()
    showNotification('The full intro will play on your next launch')
}

function reset()
{
    Object.assign(values, props.settings.reset())
    showNotification('Settings reset to default')
}

onUnmounted(() =>
{
    window.clearTimeout(notificationTimer)
    stopSettingsChange()
})
</script>

<template>
    <PanelShell title="Settings" subtitle="Saved automatically" @close="emit('close')">
        <form class="iw-settings" @submit.prevent>
            <section class="iw-settings__group">
                <h3>Graphics</h3>
                <label>Quality
                    <select v-model="values.quality" @change="apply">
                        <option value="low">Low (no post-processing)</option>
                        <option value="medium">Medium (bloom)</option>
                        <option value="high">High (all effects)</option>
                    </select>
                </label>
            </section>

            <section class="iw-settings__group">
                <h3>Sound</h3>
                <label>Volume <output>{{ Math.round(values.sound.volume * 100) }}%</output>
                    <input v-model.number="values.sound.volume" type="range" min="0" max="1" step="0.05" @input="apply">
                </label>
                <label class="iw-settings__toggle">
                    <input v-model="values.sound.muted" type="checkbox" @change="apply">
                    Mute (M)
                </label>
            </section>

            <section class="iw-settings__group">
                <h3>Intro</h3>
                <button class="iw-settings__secondary" type="button" @click="replayIntro">Replay intro</button>
            </section>

            <footer class="iw-settings__actions">
                <Transition name="iw-settings-notice"><p v-if="notification" class="iw-settings__notice" role="status">{{ notification }}</p></Transition>
                <button class="iw-settings__secondary" type="button" @click="reset">Reset to default</button>
            </footer>
        </form>
    </PanelShell>
</template>

<style scoped>
.iw-settings { display: grid; gap: 26px; }
.iw-settings__group { display: grid; gap: 12px; justify-items: start; }
h3 { margin: 0; color: var(--iw-glow); font: 700 12px/1 var(--iw-font-mono); letter-spacing: .12em; text-transform: uppercase; }
label { display: grid; gap: 8px; width: 100%; color: var(--iw-text-dim); font-size: 15px; }
label:has(input[type='range']) { grid-template-columns: 1fr auto; }
label:has(input[type='range']) input { grid-column: 1 / -1; }
output { color: var(--iw-text); font: 14px var(--iw-font-mono); }
select { box-sizing: border-box; width: 100%; padding: 10px; color: var(--iw-text); background: var(--iw-ink); border: 1px solid var(--iw-border); border-radius: var(--iw-radius-sm); font-size: 15px; }
input[type='range'] { width: 100%; accent-color: var(--iw-glow); }
.iw-settings__toggle { display: flex; align-items: center; gap: 10px; color: var(--iw-text); }
.iw-settings__toggle input { width: 18px; height: 18px; accent-color: var(--iw-glow); }
.iw-settings__actions { display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding-top: 16px; border-top: 1px solid var(--iw-border); }
.iw-settings__notice { margin: 0 auto 0 0; color: var(--iw-accent-2); font: 13px var(--iw-font-mono); }
.iw-settings-notice-enter-active, .iw-settings-notice-leave-active { transition: opacity .18s var(--iw-ease); }
.iw-settings-notice-enter-from, .iw-settings-notice-leave-to { opacity: 0; }
.iw-settings__secondary { min-height: 40px; padding: 10px 16px; border: 1px solid var(--iw-border-strong); border-radius: var(--iw-radius-sm); background: transparent; color: var(--iw-text); font: 700 12px/1 var(--iw-font-mono); letter-spacing: .08em; text-transform: uppercase; }
.iw-settings__secondary:hover { border-color: var(--iw-glow); }
select:focus-visible, input:focus-visible, .iw-settings__secondary:focus-visible { outline: 2px solid var(--iw-glow); outline-offset: 2px; }
</style>
