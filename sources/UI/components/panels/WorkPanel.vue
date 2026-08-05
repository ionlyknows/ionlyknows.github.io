<script setup>
import { ref, computed, onMounted } from 'vue'
import PanelShell from './PanelShell.vue'
import { useGame } from '../../composables/useGame.js'
import { usePanelEscape } from '../../composables/usePanelEscape.js'
import projects from '../../data/projects.js'

const emit = defineEmits([ 'close' ])

const game = useGame()
const teleporter = game?.state?.teleporter

const index = ref(0)
const project = computed(() => projects[index.value])

// Gate the actual project content behind the teleport-in finishing, so the
// billboard content doesn't pop in before the camera has arrived.
const arrived = ref(false)
const closing = ref(false)

function next() { index.value = (index.value + 1) % projects.length }
function previous() { index.value = (index.value - 1 + projects.length) % projects.length }

async function handleClose()
{
    if(closing.value)
        return

    closing.value = true

    // Fly the player/camera back to where they were before opening Work,
    // then let the parent actually unmount this panel.
    if(teleporter)
        await teleporter.flyBack()

    emit('close')
}

usePanelEscape(handleClose)

onMounted(async () =>
{
    if(teleporter)
        await teleporter.flyToWork()

    arrived.value = true
})
</script>

<template>
    <PanelShell
        :title="arrived ? project.title : 'Approaching the billboard...'"
        :subtitle="arrived ? `Project ${index + 1} of ${projects.length}` : ''"
        @close="handleClose"
    >
        <Transition name="iw-fade" mode="out-in">
            <div v-if="!arrived" key="transit" class="iw-work__transit">
                <span class="iw-work__transit-ring" />
            </div>

            <div v-else key="content">
                <Transition name="iw-fade" mode="out-in">
                    <div :key="project.id" class="iw-work">
                        <div class="iw-work__media">
                            <video
                                v-if="project.media?.type === 'video' && project.media.src"
                                :src="project.media.src"
                                autoplay
                                muted
                                loop
                                playsinline
                            />
                            <img
                                v-else-if="project.media?.src"
                                :src="project.media.src"
                                :alt="project.media.alt || project.title"
                            >
                            <div v-else class="iw-work__media-placeholder">No media yet</div>
                        </div>

                        <p class="iw-work__summary">{{ project.summary }}</p>
                        <p class="iw-work__description">{{ project.description }}</p>

                        <ul class="iw-work__tech">
                            <li v-for="tech in project.tech" :key="tech">{{ tech }}</li>
                        </ul>

                        <div class="iw-work__links">
                            <a
                                v-if="project.github"
                                class="iw-work__link"
                                :href="project.github"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                GitHub
                            </a>
                            <a
                                v-if="project.demo"
                                class="iw-work__link iw-work__link--primary"
                                :href="project.demo"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Live Demo
                            </a>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </PanelShell>

    <div v-if="arrived" class="iw-work__nav">
        <button type="button" @click="previous" aria-label="Previous project">&larr;</button>
        <div class="iw-work__dots">
            <span
                v-for="(p, i) in projects"
                :key="p.id"
                class="iw-work__dot"
                :class="{ 'is-active': i === index }"
            />
        </div>
        <button type="button" @click="next" aria-label="Next project">&rarr;</button>
    </div>
</template>

<style scoped>
.iw-work__transit
{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 220px;
}

.iw-work__transit-ring
{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1.5px solid var(--iw-border);
    border-top-color: var(--iw-accent);
    animation: iw-spin 1s linear infinite;
}

@keyframes iw-spin
{
    to { transform: rotate(360deg); }
}

.iw-fade-enter-active, .iw-fade-leave-active
{
    transition: opacity 0.3s var(--iw-ease);
}

.iw-fade-enter-from, .iw-fade-leave-to
{
    opacity: 0;
}

.iw-work__media
{
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: var(--iw-radius-md);
    overflow: hidden;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--iw-border);
    margin-bottom: 20px;
}

.iw-work__media img,
.iw-work__media video
{
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.iw-work__media-placeholder
{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--iw-text-dim);
    font-size: 12px;
    font-family: var(--iw-font-mono);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.iw-work__summary
{
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 10px;
}

.iw-work__description
{
    font-size: 14px;
    line-height: 1.6;
    color: var(--iw-text-dim);
    margin: 0 0 18px;
}

.iw-work__tech
{
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 0 0 22px;
}

.iw-work__tech li
{
    padding: 5px 12px;
    background: var(--iw-accent-soft);
    border: 1px solid var(--iw-border);
    border-radius: 999px;
    font-size: 11px;
    font-family: var(--iw-font-mono);
    color: var(--iw-accent);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.iw-work__links
{
    display: flex;
    gap: 12px;
}

.iw-work__link
{
    padding: 10px 20px;
    border: 1px solid var(--iw-border-strong);
    border-radius: var(--iw-radius-sm);
    color: var(--iw-text);
    font-size: 12px;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: background 0.2s var(--iw-ease);
}

.iw-work__link--primary
{
    background: var(--iw-accent);
    color: var(--iw-ink);
    border-color: transparent;
}

.iw-work__link:hover
{
    background: rgba(255, 255, 255, 0.08);
}

.iw-work__link--primary:hover
{
    background: var(--iw-accent);
    opacity: 0.85;
}

.iw-work__nav
{
    position: fixed;
    left: 50%;
    bottom: 5vh;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 16px;
    z-index: 31;
    pointer-events: auto;
}

.iw-work__nav button
{
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--iw-panel);
    border: 1px solid var(--iw-border-strong);
    border-radius: 50%;
    color: var(--iw-text);
    font-size: 16px;
}

.iw-work__dots
{
    display: flex;
    gap: 6px;
}

.iw-work__dot
{
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--iw-border-strong);
}

.iw-work__dot.is-active
{
    background: var(--iw-accent);
}
</style>
