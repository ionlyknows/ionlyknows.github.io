<script setup>
import { ref, onMounted } from 'vue'
import QuickViewContent from './components/quick/QuickViewContent.vue'
import { initAnalytics, track } from '../Game/Analytics.js'

// S6: the quick-view page for phones / no WebGL, with the dismissible desktop notice (FR-11).
// No Three.js and nothing from the 3D world is loaded on this path (BR-01).
const showNotice = ref(true)

onMounted(() =>
{
    initAnalytics()
    track('quickview_open', { source: 'mobile' })
})
</script>

<template>
    <main class="iw-mobile">
        <div v-if="showNotice" class="iw-mobile__notice" role="note">
            <p>For the full space adventure, visit on a desktop.</p>
            <button type="button" aria-label="Dismiss notice" @click="showNotice = false">✕</button>
        </div>
        <QuickViewContent />
    </main>
</template>

<style scoped>
.iw-mobile
{
    min-height: 100vh;
    background:
        radial-gradient(ellipse at 90% -5%, rgba(59, 42, 140, 0.4), transparent 60%),
        radial-gradient(ellipse at 0% 100%, rgba(31, 111, 139, 0.3), transparent 55%),
        #02030a;
    color: var(--iw-text);
}

.iw-mobile__notice
{
    position: sticky;
    top: 0;
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    padding-top: max(12px, env(safe-area-inset-top));
    border-bottom: 1px solid rgba(127, 249, 255, 0.3);
    background: rgba(5, 8, 20, 0.92);
    backdrop-filter: blur(12px);
    font-size: 15px;
}

.iw-mobile__notice p
{
    flex: 1;
    margin: 0;
}

.iw-mobile__notice button
{
    width: 44px;
    height: 44px;
    border: 1px solid var(--iw-border-strong);
    border-radius: 50%;
    background: transparent;
    color: var(--iw-text);
    font-size: 16px;
    cursor: pointer;
}

.iw-mobile__notice button:focus-visible
{
    outline: 2px solid var(--iw-glow);
    outline-offset: 2px;
}
</style>
