<script setup>
import { ref, computed, provide, watch, onUnmounted } from 'vue'
import { UI_BRIDGE_KEY } from './composables/useUIBridge.js'
import { GAME_KEY } from './composables/useGame.js'

import Navigation from './components/Navigation.vue'
import ExploreHUD from './components/ExploreHUD.vue'
import BillboardViewer from './components/BillboardViewer.vue'
import WorkInfoPanel from './components/panels/WorkInfoPanel.vue'
import AboutPanel from './components/panels/AboutPanel.vue'
import ResumePanel from './components/panels/ResumePanel.vue'

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
const projectIndex = ref(0)
const infoOpen = ref(false)

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
    stopBillboardState()
    stopBillboardTransition()
    stopProjectState()
    stopBillboardInfo()
})

const inputEnabled = computed(() => !activePanel.value)

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

        workTransitioning.value = true
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
</script>

<template>
    <Navigation
        v-if="!activePanel && !workActive && !workTransitioning"
        :active-panel="activePanel"
        @open-panel="openPanel"
    />

    <ExploreHUD v-if="!activePanel && !workActive && !workTransitioning" />

    <BillboardViewer v-if="workActive" :bridge="bridge" :project-index="projectIndex" />
    <AboutPanel v-else-if="activePanel === 'about'" @close="closePanel" />
    <ResumePanel v-else-if="activePanel === 'resume'" @close="closePanel" />

    <WorkInfoPanel v-if="workActive && infoOpen" :project-index="projectIndex" @close="closeInfo" />
</template>