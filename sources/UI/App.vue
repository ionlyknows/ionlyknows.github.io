<script setup>
import { ref, provide, onMounted, onUnmounted } from 'vue'
import { UI_BRIDGE_KEY } from './composables/useUIBridge.js'
import { GAME_KEY } from './composables/useGame.js'

import Navigation from './components/Navigation.vue'
import ExploreHUD from './components/ExploreHUD.vue'
import InteractionPrompt from './components/InteractionPrompt.vue'
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
const promptType = ref(null)
const worldReady = ref(false)
let loadingFrame = null

// Panels open only through UIBridge `panel:open` (game content points or the
// menu); the game's state machine listens to the same events (BR-04).
function openPanel(type)
{
    if(!activePanel.value)
        props.bridge.emit('panel:open', { type })
}

function closePanel()
{
    if(!activePanel.value)
        return

    activePanel.value = null
    props.bridge.emit('panel:close')
    document.activeElement?.blur?.()
}

const stopPanelOpen = props.bridge.on('panel:open', ({ type }) =>
{
    if(!activePanel.value)
        activePanel.value = type
})
const stopPromptShow = props.bridge.on('prompt:show', ({ type }) => { promptType.value = type })
const stopPromptHide = props.bridge.on('prompt:hide', () => { promptType.value = null })

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
    stopPanelOpen()
    stopPromptShow()
    stopPromptHide()
})
</script>

<template>
    <Transition name="iw-loading-fade">
        <LoadingScreen v-if="!worldReady" />
    </Transition>

    <Navigation v-if="!activePanel" @open-panel="openPanel" />

    <ExploreHUD v-if="!activePanel" />

    <InteractionPrompt v-if="!activePanel && promptType" :type="promptType" />

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
