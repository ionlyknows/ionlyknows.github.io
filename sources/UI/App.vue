<script setup>
import { ref, computed, provide, onMounted, onUnmounted } from 'vue'
import { UI_BRIDGE_KEY } from './composables/useUIBridge.js'
import { GAME_KEY } from './composables/useGame.js'

import LoadingScreen from './components/LoadingScreen.vue'
import IntroOverlay from './components/IntroOverlay.vue'
import Navigation from './components/Navigation.vue'
import MapButton from './components/MapButton.vue'
import ControlsHint from './components/ControlsHint.vue'
import InteractionPrompt from './components/InteractionPrompt.vue'
import WorkPanel from './components/panels/WorkPanel.vue'
import AboutPanel from './components/panels/AboutPanel.vue'
import SkillsPanel from './components/panels/SkillsPanel.vue'
import AchievementsPanel from './components/panels/AchievementsPanel.vue'
import ActivitiesPanel from './components/panels/ActivitiesPanel.vue'
import ContactPanel from './components/panels/ContactPanel.vue'
import DestinationPicker from './components/panels/DestinationPicker.vue'
import MapOverlay from './components/panels/MapOverlay.vue'
import PhotoPanel from './components/panels/PhotoPanel.vue'
import GoalsPanel from './components/panels/GoalsPanel.vue'
import HologramOverlay from './components/HologramOverlay.vue'
import SettingsPanel from './components/panels/SettingsPanel.vue'
import QuickView from './components/QuickView.vue'
import FlightHUD from './components/FlightHUD.vue'
import EasterEggs from './components/EasterEggs.vue'
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
    destinations: DestinationPicker,
    map: MapOverlay,
    photo: PhotoPanel,
    goals: GoalsPanel
}
// Panels that open on one item (M6: a station screen / frame / console, a Forge banner)
const ITEM_PANELS = [ 'work', 'achievements', 'activities', 'skills', 'photo' ]

const gameState = ref('LOADING')
const loadProgress = ref(0)
const location = ref({ id: '', name: '' })
const activePanel = ref(null)
const activeItemId = ref('')
const promptType = ref(null)
const promptId = ref('')
const quickOpen = ref(false)

const FLIGHT_STATES = [ 'BOARDING', 'TAKEOFF', 'FLYING', 'LANDING' ]
const onFoot = computed(() => gameState.value === 'ON_FOOT')
const inFlight = computed(() => FLIGHT_STATES.includes(gameState.value))
const showLoading = computed(() => gameState.value === 'LOADING' || gameState.value === 'READY')

// Panels open only through UIBridge `panel:open` (content points, launch pads
// or the menu); the game's state machine listens to the same events (BR-04).
// In flight the panels stay available; the flight waits while one is open
function openPanel(type)
{
    if(!activePanel.value && (onFoot.value || inFlight.value))
        props.bridge.emit('panel:open', { type })
}

function closePanel()
{
    if(!activePanel.value)
        return

    activePanel.value = null
    activeItemId.value = ''
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

// Every trip is by ship (M5). Launch-pad picker: board the parked ship. Map: start already inside it.
function flyTo({ id, autopilot }, cut = false)
{
    closePanel()
    props.bridge.emit('flight:request', { to: id, autopilot, cut })
}

// M5 map (M key or the HUD button): only on foot; the game pauses like for a panel
function toggleMap()
{
    if(activePanel.value === 'map')
        closePanel()
    else if(!activePanel.value && onFoot.value && !quickOpen.value)
    {
        openPanel('map')
        track('map_open')
    }
}

function skipFlight()
{
    props.bridge.emit('flight:skip')
}

const stops = [
    props.bridge.on('state:change', ({ state }) => { gameState.value = state }),
    props.bridge.on('loading:progress', ({ value }) => { loadProgress.value = value }),
    props.bridge.on('location:change', (value) => { location.value = value }),
    props.bridge.on('panel:open', ({ type, id }) =>
    {
        if(activePanel.value)
            return
        activePanel.value = type
        activeItemId.value = id || ''
    }),
    props.bridge.on('prompt:show', ({ type, id }) =>
    {
        promptType.value = type
        promptId.value = id || ''
    }),
    props.bridge.on('prompt:hide', () => { promptType.value = null }),
    // Registered before any panel: Esc closes a panel first, and only skips the flight when
    // nothing was open
    props.bridge.on('escapePressed', () =>
    {
        const somethingOpen = !!activePanel.value || quickOpen.value
        if(activePanel.value === 'settings')
            closePanel()
        if(!somethingOpen && [ 'BOARDING', 'TAKEOFF', 'FLYING' ].includes(gameState.value))
            skipFlight()
    })
]

function onKeydown(event)
{
    if(event.repeat || [ 'INPUT', 'SELECT', 'TEXTAREA' ].includes(event.target?.tagName))
        return

    // N: mute toggle, anywhere after load (BR-02 / FR-12; M is the map since M5)
    if(event.code === 'KeyN')
    {
        props.bridge.emit('sound:toggle')
        return
    }

    if(event.code === 'KeyM' && !showLoading.value)
    {
        event.preventDefault()
        toggleMap()
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

    <Navigation v-if="onFoot || inFlight" :location="inFlight ? '' : location.name" @open-panel="openPanel" @quick="openQuick('button')" />
    <FlightHUD v-if="inFlight" @skip="skipFlight" />
    <EasterEggs v-if="!showLoading" :count="game.state.eggs.count" :show-counter="onFoot || inFlight" />

    <template v-if="onFoot">
        <MapButton @open="toggleMap" />
        <ControlsHint />
        <InteractionPrompt v-if="promptType" :type="promptType" :id="promptId" />
    </template>

    <HologramOverlay v-if="gameState === 'HOLOGRAM'" :current="location.id" />
    <QuickView v-if="quickOpen" @close="closeQuick" />
    <SoundToggle />

    <SettingsPanel v-if="activePanel === 'settings'" :settings="game.settings" @close="closePanel" />
    <component
        :is="panels[activePanel]"
        v-else-if="panels[activePanel]"
        v-bind="activePanel === 'destinations' ? { current: location.id, onTravel: (trip) => flyTo(trip) } : activePanel === 'map' ? { current: location.id, onTravel: (trip) => flyTo(trip, true) } : ITEM_PANELS.includes(activePanel) ? { itemId: activeItemId } : {}"
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
