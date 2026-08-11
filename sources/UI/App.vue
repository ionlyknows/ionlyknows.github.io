<script setup>
import { ref, computed, provide, watch, onMounted, onUnmounted } from 'vue'
import { UI_BRIDGE_KEY } from './composables/useUIBridge.js'
import { GAME_KEY } from './composables/useGame.js'

import Navigation from './components/Navigation.vue'
import ExploreHUD from './components/ExploreHUD.vue'
import BillboardViewer from './components/BillboardViewer.vue'
import CertificateHint from './components/CertificateHint.vue'
import WorkInfoPanel from './components/panels/WorkInfoPanel.vue'
import AboutPanel from './components/panels/AboutPanel.vue'
import SettingsPanel from './components/panels/SettingsPanel.vue'
import LoadingScreen from './components/LoadingScreen.vue'

const props = defineProps({
    bridge: { type: Object, required: true },
    game: { type: Object, required: true }
})

provide(UI_BRIDGE_KEY, props.bridge)
provide(GAME_KEY, props.game)

if(!props.bridge)
    throw new Error('UIBridge has not been provided')

const activePanel = ref(null)
const workActive = ref(false)
const workTransitioning = ref(false)
const returningToSpawn = ref(false)
const projectIndex = ref(0)
const infoOpen = ref(false)
const certificateNearby = ref(false)
const certificateHintVisible = ref(false)
const introMessage = ref('')
const worldReady = ref(false)
let loadingFrame = null
let certificateHintTimer = null
let introStartTimer = null
let introStepTimer = null

function toggleSettings()
{
    if(workActive.value || workTransitioning.value || returningToSpawn.value)
        return

    if(activePanel.value === 'settings')
    {
        closePanel()
        return
    }

    if(activePanel.value)
        return

    props.game.state.viewport.pointerLock.deactivate()
    activePanel.value = 'settings'
}

function onKeydown(event)
{
    if(event.code !== 'KeyB' || event.repeat)
        return

    event.preventDefault()
    toggleSettings()
}

function waitForWorldReady()
{
    if(props.game.view.player.model.ready)
    {
        worldReady.value = true
        startIntroSequence()
        loadingFrame = null
        return
    }

    loadingFrame = window.requestAnimationFrame(waitForWorldReady)
}

function startIntroSequence()
{
    // This starts once after the loading screen fades and intentionally does
    // not repeat while the player remains in the world.
    introStartTimer = window.setTimeout(() =>
    {
        introMessage.value = 'Hi! my name Ghosty'
        introStepTimer = window.setTimeout(() =>
        {
            introMessage.value = "Welcome to Field Notes, Jeff's 3D Interactive World Portfolio"
            introStepTimer = window.setTimeout(() => { introMessage.value = '' }, 7000)
        }, 5000)
    }, 450)
}

onMounted(() =>
{
    waitForWorldReady()
    window.addEventListener('keydown', onKeydown)
})

const stopBillboardState = props.bridge.on('billboardInteractionChanged', (active) =>
{
    workActive.value = active
})

const stopBillboardTransition = props.bridge.on('billboardTransitionChanged', (transitioning) =>
{
    workTransitioning.value = transitioning
})

const stopProjectState = props.bridge.on('billboardProjectChanged', (index) =>
{
    projectIndex.value = index
})

const stopBillboardInfo = props.bridge.on('billboardInfoChanged', (open) =>
{
    infoOpen.value = open
})

const stopCertificateProximity = props.bridge.on('certificateProximityChanged', (nearby) =>
{
    certificateNearby.value = nearby
})

watch(certificateNearby, (nearby) =>
{
    if(certificateHintTimer)
    {
        clearTimeout(certificateHintTimer)
        certificateHintTimer = null
    }

    certificateHintVisible.value = nearby
    if(nearby)
    {
        // The cue appears once after entering range, then stays hidden until
        // the player leaves the certificate area and enters it again.
        certificateHintTimer = window.setTimeout(() =>
        {
            certificateHintVisible.value = false
            certificateHintTimer = null
        }, 5000)
    }
})

const stopEscape = props.bridge.on('escapePressed', () =>
{
    if(activePanel.value === 'settings')
        closePanel()
})

onUnmounted(() =>
{
    if(loadingFrame)
        window.cancelAnimationFrame(loadingFrame)
    if(certificateHintTimer)
        clearTimeout(certificateHintTimer)
    if(introStartTimer)
        clearTimeout(introStartTimer)
    if(introStepTimer)
        clearTimeout(introStepTimer)

    window.removeEventListener('keydown', onKeydown)

    stopBillboardState()
    stopBillboardTransition()
    stopProjectState()
    stopBillboardInfo()
    stopCertificateProximity()
    stopEscape()
})

const inputEnabled = computed(() => !activePanel.value && !workActive.value && !workTransitioning.value && !returningToSpawn.value)

watch(inputEnabled, (value) =>
{
    props.game.state.controls.setInputEnabled(value)

    if(value)
        document.activeElement?.blur?.()
}, { immediate: true })

function openPanel(name)
{
    if(name === 'work')
    {
        if(workTransitioning.value || workActive.value)
            return

        props.bridge.emit('openWorkBillboard')
        return
    }

    if(workTransitioning.value)
        return

    if(activePanel.value === name)
        return

    activePanel.value = name
}

function closePanel()
{
    activePanel.value = null
}

function closeInfo()
{
    props.bridge.emit('closeBillboardInfo')
}

async function returnToSpawn()
{
    if(returningToSpawn.value || props.game.state.teleporter.isBusy())
        return

    returningToSpawn.value = true
    try
    {
        await props.game.state.teleporter.returnToSpawn()
    }
    finally
    {
        returningToSpawn.value = false
    }
}
</script>

<template>
    <Transition name="iw-loading-fade">
        <LoadingScreen v-if="!worldReady" />
    </Transition>

    <Navigation
        v-if="!activePanel && !workActive && !workTransitioning"
        :active-panel="activePanel"
        @open-panel="openPanel"
        @return-to-spawn="returnToSpawn"
    />

    <ExploreHUD v-if="!activePanel && !workActive && !workTransitioning" />

    <Transition name="iw-certificate-hint">
        <CertificateHint
            v-if="certificateHintVisible && !activePanel && !workActive && !workTransitioning"
            message="CLICK THE CERTIFICATE TO SEE"
            :above="!!introMessage"
        />
    </Transition>

    <Transition name="iw-certificate-hint" mode="out-in">
        <CertificateHint v-if="introMessage" :key="introMessage" :message="introMessage" />
    </Transition>

    <BillboardViewer v-if="workActive" :bridge="bridge" :project-index="projectIndex" />
    <AboutPanel v-else-if="activePanel === 'about'" @close="closePanel" />
    <SettingsPanel v-else-if="activePanel === 'settings'" :settings="game.settings" @close="closePanel" />

    <WorkInfoPanel v-if="workActive && infoOpen" :project-index="projectIndex" @close="closeInfo" />
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
