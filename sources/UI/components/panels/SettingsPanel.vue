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
    <PanelShell title="Settings" subtitle="Live world controls" @close="emit('close')">
        <form class="iw-settings" @submit.prevent="save">
            <section class="iw-settings__group">
                <h3>State · Day cycle</h3>
                <label class="iw-settings__toggle"><input v-model="values.dayCycle.autoUpdate" type="checkbox" @change="apply"><span>Auto update</span></label>
                <label>Progress <output>{{ values.dayCycle.progress.toFixed(3) }}</output><input v-model.number="values.dayCycle.progress" type="range" min="0" max="1" step=".001" @input="apply"></label>
                <label>Duration (seconds)<input v-model.number="values.dayCycle.duration" type="number" min="5" max="100" step="1" @change="apply"></label>
            </section>

            <section class="iw-settings__group">
                <h3>Player · View</h3>
                <label>Camera mode<select v-model.number="values.player.viewMode" @change="apply"><option :value="1">Third person</option><option :value="2">Fly camera</option></select></label>
            </section>

            <section class="iw-settings__group">
                <h3>Terrain</h3>
                <div class="iw-settings__grid">
                    <label>Subdivisions<input v-model.number="values.terrain.subdivisions" type="number" min="1" max="400" step="1" @change="apply"></label>
                    <label>Lacunarity<input v-model.number="values.terrain.lacunarity" type="number" min="1" max="5" step=".01" @change="apply"></label>
                    <label>Persistence<input v-model.number="values.terrain.persistence" type="number" min="0" max="1" step=".01" @change="apply"></label>
                    <label>Max iterations<input v-model.number="values.terrain.maxIterations" type="number" min="1" max="10" step="1" @change="apply"></label>
                    <label>Base frequency<input v-model.number="values.terrain.baseFrequency" type="number" min="0" max=".01" step=".0001" @change="apply"></label>
                    <label>Base amplitude<input v-model.number="values.terrain.baseAmplitude" type="number" min="0" max="500" step=".1" @change="apply"></label>
                    <label>Power<input v-model.number="values.terrain.power" type="number" min="1" max="10" step="1" @change="apply"></label>
                    <label>Elevation offset<input v-model.number="values.terrain.elevationOffset" type="number" min="-10" max="10" step="1" @change="apply"></label>
                    <label>Iterations formula<select v-model.number="values.terrain.iterationsFormula" @change="apply"><option :value="1">Max</option><option :value="2">Min</option><option :value="3">Mix</option><option :value="4">Power mix</option></select></label>
                </div>
            </section>

            <section class="iw-settings__group">
                <h3>Sky</h3>
                <div class="iw-settings__grid">
                    <label>Sphere width segments<input v-model.number="values.sky.widthSegments" type="number" min="4" max="512" step="1" @change="apply"></label>
                    <label>Sphere height segments<input v-model.number="values.sky.heightSegments" type="number" min="4" max="512" step="1" @change="apply"></label>
                    <label>Atmosphere elevation<input v-model.number="values.sky.atmosphereElevation" type="number" min=".01" max="5" step=".01" @change="apply"></label>
                    <label>Atmosphere power<input v-model.number="values.sky.atmospherePower" type="number" min="0" max="20" step="1" @change="apply"></label>
                    <label>Dawn angle amplitude<input v-model.number="values.sky.dawnAngleAmplitude" type="number" min=".001" max="1" step=".001" @change="apply"></label>
                    <label>Dawn elevation amplitude<input v-model.number="values.sky.dawnElevationAmplitude" type="number" min=".01" max="1" step=".01" @change="apply"></label>
                    <label>Sun amplitude<input v-model.number="values.sky.sunAmplitude" type="number" min=".01" max="3" step=".01" @change="apply"></label>
                    <label>Sun multiplier<input v-model.number="values.sky.sunMultiplier" type="number" min="0" max="1" step=".01" @change="apply"></label>
                </div>
                <div class="iw-settings__colors">
                    <label>Day low<input v-model="values.sky.colorDayCycleLow" type="color" @input="apply"></label><label>Day high<input v-model="values.sky.colorDayCycleHigh" type="color" @input="apply"></label><label>Night low<input v-model="values.sky.colorNightLow" type="color" @input="apply"></label><label>Night high<input v-model="values.sky.colorNightHigh" type="color" @input="apply"></label><label>Dawn<input v-model="values.sky.colorDawn" type="color" @input="apply"></label><label>Sun<input v-model="values.sky.colorSun" type="color" @input="apply"></label>
                </div>
            </section>

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

            <section class="iw-settings__group"><h3>Terrain gradient</h3><div class="iw-settings__colors"><label>Above far<input v-model="values.terrainGradient.aboveFar" type="color" @input="apply"></label><label>Above close<input v-model="values.terrainGradient.aboveClose" type="color" @input="apply"></label><label>Below close<input v-model="values.terrainGradient.belowClose" type="color" @input="apply"></label><label>Below far<input v-model="values.terrainGradient.belowFar" type="color" @input="apply"></label></div></section>
            <footer class="iw-settings__actions"><Transition name="iw-settings-notice"><p v-if="notification" class="iw-settings__notice" role="status">{{ notification }}</p></Transition><button class="iw-settings__reset" type="button" @click="reset">Reset to default</button><button class="iw-settings__save" type="submit">Save changes</button></footer>
        </form>
    </PanelShell>
</template>

<style scoped>
.iw-settings { display: grid; gap: 26px; } .iw-settings__group { display: grid; gap: 12px; } h3 { margin: 0; color: var(--iw-accent); font: 700 11px/1 var(--iw-font-mono); letter-spacing: .12em; text-transform: uppercase; } label { display: grid; gap: 6px; color: var(--iw-text-dim); font-size: 13px; } label:has(input[type='range']) { grid-template-columns: 1fr auto; } label:has(input[type='range']) input { grid-column: 1 / -1; } output { color: var(--iw-text); font: 12px var(--iw-font-mono); } input, select { box-sizing: border-box; width: 100%; padding: 8px; color: var(--iw-text); background: var(--iw-ink); border: 1px solid var(--iw-border); border-radius: var(--iw-radius-sm); } input[type='range'], input[type='color'] { padding: 0; accent-color: var(--iw-accent); } input[type='color'] { height: 32px; } .iw-settings__toggle { display: flex; align-items: center; gap: 10px; } .iw-settings__toggle input { width: auto; accent-color: var(--iw-accent); } .iw-settings__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; } .iw-settings__colors { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; } .iw-settings__actions { display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding-top: 16px; border-top: 1px solid var(--iw-border); } .iw-settings__notice { margin: 0 auto 0 0; color: var(--iw-accent-2); font: 11px var(--iw-font-mono); } .iw-settings-notice-enter-active, .iw-settings-notice-leave-active { transition: opacity .18s var(--iw-ease); } .iw-settings-notice-enter-from, .iw-settings-notice-leave-to { opacity: 0; } button { padding: 10px 14px; border-radius: var(--iw-radius-sm); font: 700 11px/1 var(--iw-font-mono); letter-spacing: .08em; text-transform: uppercase; } .iw-settings__reset { color: var(--iw-text-dim); background: transparent; border: 1px solid var(--iw-border); } .iw-settings__save { color: var(--iw-ink); background: var(--iw-accent); border: 1px solid var(--iw-accent); } @media (max-width: 600px) { .iw-settings__grid, .iw-settings__colors { grid-template-columns: 1fr 1fr; } }
</style>
