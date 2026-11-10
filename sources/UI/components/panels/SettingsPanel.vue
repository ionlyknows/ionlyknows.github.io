<script setup>
import { reactive, ref, onUnmounted } from 'vue'
import PanelShell from './PanelShell.vue'

const props = defineProps({ settings: { type: Object, required: true } })
const emit = defineEmits([ 'close' ])
const values = reactive(props.settings.getValues())
const notification = ref('')
let notificationTimer = null
const apply = () => props.settings.apply(values)

function showNotification(message)
{
    notification.value = message
    window.clearTimeout(notificationTimer)
    notificationTimer = window.setTimeout(() => { notification.value = '' }, 2600)
}

function save()
{
    props.settings.save(values)
    showNotification('Settings saved')
}

function reset()
{
    Object.assign(values, props.settings.reset())
    showNotification('Settings reset to default')
}

onUnmounted(() => window.clearTimeout(notificationTimer))
</script>

<template>
    <PanelShell title="Settings" subtitle="Live scene controls" @close="emit('close')">
        <form class="iw-settings" @submit.prevent="save">
            <section class="iw-settings__group">
                <h3>Stars &amp; lighting</h3>
                <div class="iw-settings__grid">
                    <label>Star count<input v-model.number="values.stars.count" type="number" min="100" max="50000" step="100" @change="apply"></label>
                    <label>Star size<input v-model.number="values.stars.size" type="number" min="0" max="1" step=".0001" @change="apply"></label>
                    <label>Star brightness<input v-model.number="values.stars.brightness" type="number" min="0" max="1" step=".001" @change="apply"></label>
                    <label>Sun light intensity<input v-model.number="values.lighting.sunLightIntensity" type="number" min="0" max="5" step=".05" @change="apply"></label>
                    <label>Fill light intensity<input v-model.number="values.lighting.fillLightIntensity" type="number" min="0" max="5" step=".05" @change="apply"></label>
                </div>
            </section>

            <footer class="iw-settings__actions"><Transition name="iw-settings-notice"><p v-if="notification" class="iw-settings__notice" role="status">{{ notification }}</p></Transition><button class="iw-settings__reset" type="button" @click="reset">Reset to default</button><button class="iw-settings__save" type="submit">Save changes</button></footer>
        </form>
    </PanelShell>
</template>

<style scoped>
.iw-settings { display: grid; gap: 26px; } .iw-settings__group { display: grid; gap: 12px; } h3 { margin: 0; color: var(--iw-accent); font: 700 11px/1 var(--iw-font-mono); letter-spacing: .12em; text-transform: uppercase; } label { display: grid; gap: 6px; color: var(--iw-text-dim); font-size: 13px; } label:has(input[type='range']) { grid-template-columns: 1fr auto; } label:has(input[type='range']) input { grid-column: 1 / -1; } output { color: var(--iw-text); font: 12px var(--iw-font-mono); } input, select { box-sizing: border-box; width: 100%; padding: 8px; color: var(--iw-text); background: var(--iw-ink); border: 1px solid var(--iw-border); border-radius: var(--iw-radius-sm); } input[type='range'], input[type='color'] { padding: 0; accent-color: var(--iw-accent); } input[type='color'] { height: 32px; } .iw-settings__toggle { display: flex; align-items: center; gap: 10px; } .iw-settings__toggle input { width: auto; accent-color: var(--iw-accent); } .iw-settings__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; } .iw-settings__colors { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; } .iw-settings__actions { display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding-top: 16px; border-top: 1px solid var(--iw-border); } .iw-settings__notice { margin: 0 auto 0 0; color: var(--iw-accent-2); font: 11px var(--iw-font-mono); } .iw-settings-notice-enter-active, .iw-settings-notice-leave-active { transition: opacity .18s var(--iw-ease); } .iw-settings-notice-enter-from, .iw-settings-notice-leave-to { opacity: 0; } button { padding: 10px 14px; border-radius: var(--iw-radius-sm); font: 700 11px/1 var(--iw-font-mono); letter-spacing: .08em; text-transform: uppercase; } .iw-settings__reset { color: var(--iw-text-dim); background: transparent; border: 1px solid var(--iw-border); } .iw-settings__save { color: var(--iw-ink); background: var(--iw-accent); border: 1px solid var(--iw-accent); } @media (max-width: 600px) { .iw-settings__grid, .iw-settings__colors { grid-template-columns: 1fr 1fr; } }
</style>
