<script setup>
import gsap from 'gsap'

const props = defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    // 'card' (default) is a centered card over a translucent backdrop that
    // still shows the 3D scene behind it -- used for Work/Resume. 'fullscreen'
    // fills the viewport edge-to-edge with a scrollable body -- used for About,
    // per spec ("full-screen HTML/CSS overlay ... vertically scrollable").
    variant: { type: String, default: 'card' }
})

const emit = defineEmits([ 'close' ])

function onBackdropEnter(el, done)
{
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out', onComplete: done })
}

function onBackdropLeave(el, done)
{
    gsap.to(el, { opacity: 0, duration: 0.25, ease: 'power1.in', onComplete: done })
}

function onPanelEnter(el, done)
{
    const fromVars = props.variant === 'fullscreen'
        ? { opacity: 0 }
        : { opacity: 0, y: 24, scale: 0.98 }

    gsap.fromTo(
        el,
        fromVars,
        { opacity: 1, y: 0, scale: 1, duration: 0.45, delay: 0.05, ease: 'power3.out', onComplete: done }
    )
}

function onPanelLeave(el, done)
{
    const toVars = props.variant === 'fullscreen'
        ? { opacity: 0, duration: 0.25, ease: 'power1.in' }
        : { opacity: 0, y: 16, scale: 0.98, duration: 0.25, ease: 'power1.in' }

    gsap.to(el, { ...toVars, onComplete: done })
}
</script>

<template>
    <Transition :css="false" @enter="onBackdropEnter" @leave="onBackdropLeave">
        <div
            class="iw-panel-backdrop"
            :class="{ 'iw-panel-backdrop--fullscreen': variant === 'fullscreen' }"
            @click.self="emit('close')"
        >
            <Transition :css="false" @enter="onPanelEnter" @leave="onPanelLeave" appear>
                <section
                    class="iw-panel"
                    :class="{ 'iw-panel--fullscreen': variant === 'fullscreen' }"
                    role="dialog"
                    aria-modal="true"
                    :aria-label="title"
                >
                    <header class="iw-panel__header">
                        <div>
                            <h2 class="iw-panel__title">{{ title }}</h2>
                            <p v-if="subtitle" class="iw-panel__subtitle">{{ subtitle }}</p>
                        </div>
                        <button class="iw-panel__close" type="button" @click="emit('close')" aria-label="Close">
                            <span>Close</span>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                            </svg>
                        </button>
                    </header>
                    <div class="iw-panel__body iw-scrollable">
                        <slot />
                    </div>
                </section>
            </Transition>
        </div>
    </Transition>
</template>

<style scoped>
.iw-panel-backdrop
{
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5vh 5vw;
    background: radial-gradient(circle at 50% 20%, rgba(20, 28, 26, 0.55), var(--iw-ink-soft) 70%);
    pointer-events: auto;
    z-index: 30;
}

.iw-panel-backdrop--fullscreen
{
    padding: 0;
    background: var(--iw-ink);
}

.iw-panel
{
    width: min(920px, 100%);
    max-height: 86vh;
    display: flex;
    flex-direction: column;
    background: var(--iw-panel);
    border: 1px solid var(--iw-border);
    border-radius: var(--iw-radius-lg);
    box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.7);
    overflow: hidden;
}

.iw-panel--fullscreen
{
    width: 100%;
    height: 100%;
    max-height: 100%;
    border: none;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
}

.iw-panel__header
{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 28px 32px 20px;
    border-bottom: 1px solid var(--iw-border);
}

.iw-panel--fullscreen .iw-panel__header
{
    padding: 32px clamp(20px, 6vw, 80px) 20px;
    position: sticky;
    top: 0;
    background: var(--iw-ink);
    z-index: 1;
}

.iw-panel__title
{
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 0.01em;
}

.iw-panel__subtitle
{
    margin: 6px 0 0;
    font-size: 13px;
    color: var(--iw-text-dim);
}

.iw-panel__close
{
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: transparent;
    border: 1px solid var(--iw-border);
    border-radius: var(--iw-radius-sm);
    color: var(--iw-text-dim);
    font-size: 11px;
    font-family: var(--iw-font-mono);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    transition: color 0.2s var(--iw-ease), border-color 0.2s var(--iw-ease);
}

.iw-panel__close:hover
{
    color: var(--iw-text);
    border-color: var(--iw-border-strong);
}

.iw-panel__body
{
    padding: 28px 32px 32px;
    overflow-y: auto;
}

.iw-panel--fullscreen .iw-panel__body
{
    padding: 8px clamp(20px, 6vw, 80px) 80px;
}
</style>
