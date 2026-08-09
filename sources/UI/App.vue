<script setup>
import { ref, computed, provide, watch, onUnmounted } from 'vue'
import { UI_BRIDGE_KEY } from './composables/useUIBridge.js'
import { GAME_KEY } from './composables/useGame.js'

import Navigation from './components/Navigation.vue'
import ExploreHUD from './components/ExploreHUD.vue'
import BillboardViewer from './components/BillboardViewer.vue'
import AboutPanel from './components/panels/AboutPanel.vue'
import ResumePanel from './components/panels/ResumePanel.vue'

const props = defineProps({
    bridge: { type: Object, required: true },
    game: { type: Object, required: true }
})

provide(UI_BRIDGE_KEY, props.bridge)
provide(GAME_KEY, props.game)

// A component can never inject a value it just provided to itself --
// inject() on the root component reads the app-level context, not the
// local `provides` object provide() just wrote to, so useUIBridge()
// (which calls inject() under the hood) always threw "UIBridge has not
// been provided" here even though the bridge was provided one line above.
// Validate the prop directly instead. Descendants (WorkPanel, AboutPanel,
// ResumePanel via usePanelEscape()/useGame()) are true children of this
// instance, so their inject() calls resolve correctly and are unaffected.
if(!props.bridge)
    throw new Error('UIBridge has not been provided')

// The player is already in the world from the first frame -- no loading
// screen / menu gate in this design. activePanel is the only thing that
// pauses gameplay: null means "exploring", any string means a panel is open.
const activePanel = ref(null)
const workActive = ref(false)
// True from the instant "Work" is clicked until the fly-in settles (either
// into the billboard interface, or straight back out if ESC arrived mid
// flight -- see index.js's closeRequested handling). Navigation hides on
// this immediately, rather than waiting for the full flight to resolve, so
// About/Resume can't be opened while the Work camera tween is still running
// and left index.js's workOpen state out of sync with what's on screen.
const workTransitioning = ref(false)
const projectIndex = ref(0)

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

onUnmounted(() =>
{
    stopBillboardState()
    stopBillboardTransition()
    stopProjectState()
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
        // Belt-and-braces alongside index.js's own workOpen/isBusy() guard:
        // stops a rapid double click from emitting a second request while
        // the first is still being decided.
        if(workTransitioning.value || workActive.value)
            return

        workTransitioning.value = true
        props.bridge.emit('openWorkBillboard')
        return
    }

    // Work owns the camera/controls until its own transition settles --
    // About/Resume can't cut in mid-flight.
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
</script>

<template>
    <Navigation
        v-if="!activePanel && !workActive && !workTransitioning"
        :active-panel="activePanel"
        @open-panel="openPanel"
    />

    <ExploreHUD v-if="!activePanel && !workActive && !workTransitioning" />

    <!-- No outer <Transition> here: PanelShell (rendered by each panel)
         already owns real enter/leave animation via its own nested
         <Transition :css="false"> + GSAP hooks. Wrapping it in another
         <Transition> from here doesn't work anyway -- PanelShell's root is
         itself a <Transition> component, not a plain element, which Vue
         can't attach transition classes to (that's what was spamming
         "Component inside <Transition> renders non-element root node that
         cannot be animated" in the console) -- and it was dead weight
         besides: activePanel only ever goes work/about/resume <-> null
         (Navigation is hidden while any panel is open, so you can't jump
         directly from one panel to another), so mode="out-in" never had
         two real branches to sequence between. -->
    <BillboardViewer v-if="workActive" :bridge="bridge" :project-index="projectIndex" />
    <AboutPanel v-else-if="activePanel === 'about'" @close="closePanel" />
    <ResumePanel v-else-if="activePanel === 'resume'" @close="closePanel" />
</template>
