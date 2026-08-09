<script setup>
import { ref, computed, provide, watch, onMounted, onUnmounted } from 'vue'
import { UI_BRIDGE_KEY } from './composables/useUIBridge.js'
import { GAME_KEY } from './composables/useGame.js'

import Navigation from './components/Navigation.vue'
import ExploreHUD from './components/ExploreHUD.vue'
import BillboardViewer from './components/BillboardViewer.vue'
import WorkInfoPanel from './components/panels/WorkInfoPanel.vue'
import AboutPanel from './components/panels/AboutPanel.vue'
import ResumePanel from './components/panels/ResumePanel.vue'
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
const worldReady = ref(false)
let loadingFrame = null

function waitForWorldReady()
{
    if(props.game.view.player.model.ready)
    {
        worldReady.value = true
        loadingFrame = null
        return
    }

    loadingFrame = window.requestAnimationFrame(waitForWorldReady)
}

onMounted(() =>
{
    waitForWorldReady()
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

onUnmounted(() =>
{
    if(loadingFrame)
        window.cancelAnimationFrame(loadingFrame)

    stopBillboardState()
    stopBillboardTransition()
    stopProjectState()
    stopBillboardInfo()
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

    <BillboardViewer v-if="workActive" :bridge="bridge" :project-index="projectIndex" />
    <AboutPanel v-else-if="activePanel === 'about'" @close="closePanel" />
    <ResumePanel v-else-if="activePanel === 'resume'" @close="closePanel" />

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
