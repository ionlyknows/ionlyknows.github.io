<script setup>
import { ref, computed, provide, onMounted, onUnmounted } from 'vue'
import { UI_BRIDGE_KEY } from './composables/useUIBridge.js'
import { GAME_KEY } from './composables/useGame.js'

import LoadingScreen from './components/LoadingScreen.vue'
import IntroOverlay from './components/IntroOverlay.vue'
import Navigation from './components/Navigation.vue'
import LocationNav from './components/LocationNav.vue'
import ControlsHint from './components/ControlsHint.vue'
import InteractionPrompt from './components/InteractionPrompt.vue'
import WorkPanel from './components/panels/WorkPanel.vue'
import AboutPanel from './components/panels/AboutPanel.vue'
import SkillsPanel from './components/panels/SkillsPanel.vue'
import AchievementsPanel from './components/panels/AchievementsPanel.vue'
import ActivitiesPanel from './components/panels/ActivitiesPanel.vue'
import ContactPanel from './components/panels/ContactPanel.vue'
import DestinationPicker from './components/panels/DestinationPicker.vue'
import SettingsPanel from './components/panels/SettingsPanel.vue'
import QuickView from './components/QuickView.vue'
import SoundToggle from './components/SoundToggle.vue'
import { track } from '../Game/Analytics.js'

const props = defineProps({
    bridge: { type: Object, required: true },
    game: { type: Object, required: true }
})

provide(UI_BRIDGE_KEY, props.bridge)
provide(GAME_KEY, props.game)

const panels = {
    work: WorkPanel,
    about: AboutPanel,
    skills: SkillsPanel,
    achievements: AchievementsPanel,
    activities: ActivitiesPanel,
    contact: ContactPanel,
    destinations: DestinationPicker
}

const gameState = ref('LOADING')
const loadProgress = ref(0)
const location = ref({ id: '', name: '' })
const activePanel = ref(null)
const promptType = ref(null)
const quickOpen = ref(false)

const onFoot = computed(() => gameState.value === 'ON_FOOT')
const showLoading = computed(() => gameState.value === 'LOADING' || gameState.value === 'READY')

// Panels open only through UIBridge `panel:open` (content points, launch pads
// or the menu); the game's state machine listens to the same events (BR-04).
function openPanel(type)
{
    if(!activePanel.value && onFoot.value)
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

// Quick-view (FR-08–FR-10): the scene pauses (QUICK_VIEW) and resumes where it was
function openQuick(source)
{
    if(quickOpen.value || activePanel.value)
        return
    quickOpen.value = true
    props.bridge.emit('quickview:open')
    track('quickview_open', { source })
}

function closeQuick()
{
    if(!quickOpen.value)
        return
    quickOpen.value = false
    props.bridge.emit('quickview:close')
    if(window.location.hash === '#quick')
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
}

function onHashChange()
{
    if(window.location.hash === '#quick')
        openQuick('url')
}

function travelTo(id)
{
    closePanel()
    props.bridge.emit('travel:request', { to: id })
}

const stops = [
    props.bridge.on('state:change', ({ state }) => { gameState.value = state }),
    props.bridge.on('loading:progress', ({ value }) => { loadProgress.value = value }),
    props.bridge.on('location:change', (value) => { location.value = value }),
    props.bridge.on('panel:open', ({ type }) =>
    {
        if(!activePanel.value)
            activePanel.value = type
    }),
    props.bridge.on('prompt:show', ({ type }) => { promptType.value = type }),
    props.bridge.on('prompt:hide', () => { promptType.value = null }),
    props.bridge.on('escapePressed', () =>
    {
        if(activePanel.value === 'settings')
            closePanel()
    })
]

function onKeydown(event)
{
    if(event.repeat || [ 'INPUT', 'SELECT', 'TEXTAREA' ].includes(event.target?.tagName))
        return

    // M: mute toggle, anywhere after load (BR-02 / FR-12)
    if(event.code === 'KeyM')
    {
        props.bridge.emit('sound:toggle')
        return
    }

    if(event.code !== 'KeyB' || quickOpen.value)
        return

    event.preventDefault()
    if(activePanel.value === 'settings')
        closePanel()
    else
        openPanel('settings')
}

onMounted(() =>
{
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('hashchange', onHashChange)
    onHashChange() // /#quick opens the quick-view directly
})

onUnmounted(() =>
{
    window.removeEventListener('keydown', onKeydown)
    window.removeEventListener('hashchange', onHashChange)
    stops.forEach((stop) => stop())
})
</script>

<template>
    <Transition name="iw-fade">
        <LoadingScreen v-if="showLoading" :progress="loadProgress" :ready="gameState === 'READY'" @launch="bridge.emit('launch')" @quick="openQuick('button')" />
    </Transition>

    <IntroOverlay v-if="gameState === 'INTRO'" />

    <template v-if="onFoot">
        <Navigation :location="location.name" @open-panel="openPanel" @quick="openQuick('button')" />
        <LocationNav :current="location.id" @travel="travelTo" />
        <ControlsHint />
        <InteractionPrompt v-if="promptType" :type="promptType" />
    </template>

    <QuickView v-if="quickOpen" @close="closeQuick" />
    <SoundToggle />

    <SettingsPanel v-if="activePanel === 'settings'" :settings="game.settings" @close="closePanel" />
    <component
        :is="panels[activePanel]"
        v-else-if="panels[activePanel]"
        v-bind="activePanel === 'destinations' ? { current: location.id, onTravel: travelTo } : {}"
        @close="closePanel"
    />
</template>

<style scoped>
.iw-fade-leave-active
{
    transition: opacity 0.6s ease;
}

.iw-fade-leave-to
{
    opacity: 0;
}
</style>
