<script setup>
import { ref, computed, provide, watch, onMounted, onUnmounted } from 'vue'
import { UI_BRIDGE_KEY } from './composables/useUIBridge.js'
import { GAME_KEY } from './composables/useGame.js'

import Navigation from './components/Navigation.vue'
import ExploreHUD from './components/ExploreHUD.vue'
import WorkPanel from './components/panels/WorkPanel.vue'
import AboutPanel from './components/panels/AboutPanel.vue'
import SettingsPanel from './components/panels/SettingsPanel.vue'
import LoadingScreen from './components/LoadingScreen.vue'

const props = defineProps({
    bridge: { type: Object, required: true },
    game: { type: Object, required: true }
})

provide(UI_BRIDGE_KEY, props.bridge)
provide(GAME_KEY, props.game)

const activePanel = ref(null)
const worldReady = ref(false)
let loadingFrame = null

function openPanel(name)
{
    if(activePanel.value)
        return

    props.game.state.viewport.pointerLock.deactivate()
    activePanel.value = name
}

function closePanel()
{
    activePanel.value = null
}

function onKeydown(event)
{
    if(event.code !== 'KeyB' || event.repeat)
        return

    event.preventDefault()
    if(activePanel.value === 'settings')
        closePanel()
    else
        openPanel('settings')
}

const stopEscape = props.bridge.on('escapePressed', () =>
{
    if(activePanel.value === 'settings')
        closePanel()
})

onMounted(() =>
{
    // Nothing heavy to load in M0: hide the loading screen after the first frame
    loadingFrame = window.requestAnimationFrame(() =>
    {
        worldReady.value = true
        loadingFrame = null
    })
    window.addEventListener('keydown', onKeydown)
})

onUnmounted(() =>
{
    if(loadingFrame)
        window.cancelAnimationFrame(loadingFrame)

    window.removeEventListener('keydown', onKeydown)
    stopEscape()
})

const inputEnabled = computed(() => !activePanel.value)

watch(inputEnabled, (value) =>
{
    props.game.state.controls.setInputEnabled(value)

    if(value)
        document.activeElement?.blur?.()
}, { immediate: true })
</script>

<template>
    <Transition name="iw-loading-fade">
        <LoadingScreen v-if="!worldReady" />
    </Transition>

    <Navigation v-if="!activePanel" @open-panel="openPanel" />

    <ExploreHUD v-if="!activePanel" />

    <WorkPanel v-if="activePanel === 'work'" @close="closePanel" />
    <AboutPanel v-else-if="activePanel === 'about'" @close="closePanel" />
    <SettingsPanel v-else-if="activePanel === 'settings'" :settings="game.settings" @close="closePanel" />
</template>

<style scoped>
.iw-loading-fade-leave-active
{
    transition: opacity 0.4s ease;
}

.iw-loading-fade-leave-to
{
    opacity: 0;
}
</style>
