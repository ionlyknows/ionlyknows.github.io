<script setup>
import { ref, computed, provide, watch } from 'vue'
import { UI_BRIDGE_KEY, useUIBridge } from './composables/useUIBridge.js'
import { GAME_KEY } from './composables/useGame.js'

import Navigation from './components/Navigation.vue'
import ExploreHUD from './components/ExploreHUD.vue'
import WorkPanel from './components/panels/WorkPanel.vue'
import AboutPanel from './components/panels/AboutPanel.vue'
import ResumePanel from './components/panels/ResumePanel.vue'

const props = defineProps({
    bridge: { type: Object, required: true },
    game: { type: Object, required: true }
})

provide(UI_BRIDGE_KEY, props.bridge)
provide(GAME_KEY, props.game)

useUIBridge() // no-op here beyond validating the bridge exists for children

// The player is already in the world from the first frame -- no loading
// screen / menu gate in this design. activePanel is the only thing that
// pauses gameplay: null means "exploring", any string means a panel is open.
const activePanel = ref(null)

const inputEnabled = computed(() => !activePanel.value)

watch(inputEnabled, (value) =>
{
    props.game.state.controls.setInputEnabled(value)

    if(value)
        document.activeElement?.blur?.()
}, { immediate: true })

function openPanel(name)
{
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
        v-if="!activePanel"
        :active-panel="activePanel"
        @open-panel="openPanel"
    />

    <ExploreHUD v-if="!activePanel" />

    <Transition name="iw-panel-switch" mode="out-in">
        <WorkPanel v-if="activePanel === 'work'" key="work" @close="closePanel" />
        <AboutPanel v-else-if="activePanel === 'about'" key="about" @close="closePanel" />
        <ResumePanel v-else-if="activePanel === 'resume'" key="resume" @close="closePanel" />
    </Transition>
</template>
