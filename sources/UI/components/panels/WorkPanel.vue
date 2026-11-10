<script setup>
import { ref, computed } from 'vue'
import PanelShell from './PanelShell.vue'
import { usePanelEscape } from '../../composables/usePanelEscape.js'
import { visibleProjects as projects } from '../../visibleContent.js'

const emit = defineEmits([ 'close' ])

const index = ref(0)
const project = computed(() => projects[index.value])

function step(direction)
{
    index.value = (index.value + direction + projects.length) % projects.length
}

function close() { emit('close') }

usePanelEscape(close)
</script>

<template>
    <PanelShell
        variant="fullscreen"
        :title="project?.title || 'Work'"
        :subtitle="projects.length > 1 ? `Project ${index + 1} of ${projects.length}` : ''"
        @close="close"
    >
        <div v-if="project" class="iw-work-info">
            <!-- Video mounts only while this panel is open; preload="none" + poster -->
            <div class="iw-work-info__media" :class="{ 'iw-work-info__media--placeholder': !project.media }">
                <video
                    v-if="project.media?.type === 'video'"
                    :key="project.id"
                    :src="project.media.src"
                    :poster="project.media.poster || undefined"
                    :aria-label="project.media.alt || project.title"
                    preload="none"
                    controls
                    playsinline
                    muted
                />
                <img v-else-if="project.media?.src" :src="project.media.src" :alt="project.media.alt || project.title">
            </div>

            <section class="iw-work-info__intro">
                <p class="iw-work-info__eyebrow">// project info</p>
                <p class="iw-work-info__summary">{{ project.summary }}</p>
            </section>

            <template v-if="project.role || project.status">
                <hr class="iw-work-info__divider">
                <section>
                    <p class="iw-work-info__slug">// contribution</p>
                    <h3 class="iw-work-info__heading">My Contribution</h3>
                    <dl class="iw-work-info__quick-info">
                        <div v-if="project.role" class="iw-work-info__quick-row">
                            <dt>Role</dt>
                            <dd>{{ project.role }}</dd>
                        </div>
                        <div v-if="project.status" class="iw-work-info__quick-row">
                            <dt>Status</dt>
                            <dd>{{ project.status }}</dd>
                        </div>
                    </dl>
                </section>
            </template>

            <template v-if="project.keyFeatures?.length">
                <hr class="iw-work-info__divider">
                <section>
                    <p class="iw-work-info__slug">// key features</p>
                    <h3 class="iw-work-info__heading">What It Does</h3>
                    <ul class="iw-work-info__features">
                        <li v-for="feature in project.keyFeatures" :key="feature">{{ feature }}</li>
                    </ul>
                </section>
            </template>

            <template v-if="project.description">
                <hr class="iw-work-info__divider">
                <section>
                    <p class="iw-work-info__slug">// description</p>
                    <h3 class="iw-work-info__heading">Project Overview</h3>
                    <p class="iw-work-info__desc">{{ project.description }}</p>
                </section>
            </template>

            <template v-if="project.stack?.length">
                <hr class="iw-work-info__divider">
                <section>
                    <p class="iw-work-info__slug">// technologies</p>
                    <h3 class="iw-work-info__heading">Built With</h3>
                    <div class="iw-work-info__tag-row">
                        <span v-for="tech in project.stack" :key="tech" class="iw-work-info__tag">{{ tech }}</span>
                    </div>
                </section>
            </template>

            <template v-if="project.repoUrl || project.demoUrl">
                <hr class="iw-work-info__divider">
                <section>
                    <p class="iw-work-info__slug">// details</p>
                    <h3 class="iw-work-info__heading">Project Details</h3>
                    <dl class="iw-work-info__quick-info">
                        <div v-if="project.repoUrl" class="iw-work-info__quick-row">
                            <dt>Repository</dt>
                            <dd><a :href="project.repoUrl" target="_blank" rel="noopener noreferrer">{{ project.repoUrl.replace('https://', '') }}</a></dd>
                        </div>
                        <div v-if="project.demoUrl" class="iw-work-info__quick-row">
                            <dt>Live Demo</dt>
                            <dd><a :href="project.demoUrl" target="_blank" rel="noopener noreferrer">{{ project.demoUrl.replace('https://', '') }}</a></dd>
                        </div>
                    </dl>
                </section>
            </template>

            <div v-if="projects.length > 1" class="iw-work-info__nav">
                <button type="button" class="iw-work-info__back" @click="step(-1)">&larr; Previous</button>
                <button type="button" class="iw-work-info__back" @click="step(1)">Next &rarr;</button>
            </div>
        </div>
    </PanelShell>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');

.iw-work-info
{
    --iw-work-info-font: 'Inter', var(--iw-font);
    --iw-work-info-mono: 'JetBrains Mono', var(--iw-font-mono);
    --iw-work-info-accent: var(--iw-accent);
    --iw-work-info-accent-dim: rgba(255, 138, 61, 0.6);
    --iw-work-info-accent-faint: rgba(255, 138, 61, 0.12);
    --iw-work-info-border-accent: rgba(255, 138, 61, 0.45);
    --iw-work-info-text-2: rgba(190, 198, 215, 0.85);
    --iw-work-info-text-3: rgba(120, 130, 150, 0.85);

    font-family: var(--iw-work-info-font);
}

.iw-work-info__divider
{
    height: 1px;
    border: none;
    background: var(--iw-border);
    margin: 32px 0;
}

.iw-work-info__slug,
.iw-work-info__eyebrow
{
    font-family: var(--iw-work-info-mono);
    font-size: 11px;
    color: var(--iw-work-info-text-3);
    letter-spacing: 0.08em;
    margin: 0 0 8px;
}

.iw-work-info__heading
{
    font-family: var(--iw-work-info-font);
    font-size: clamp(20px, 3vw, 28px);
    font-weight: 800;
    color: var(--iw-text);
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin: 0 0 16px;
}

.iw-work-info__summary
{
    font-size: 15px;
    font-weight: 600;
    line-height: 1.6;
    color: var(--iw-text);
    margin: 0;
}

.iw-work-info__desc
{
    font-size: 13px;
    line-height: 1.8;
    color: var(--iw-work-info-text-2);
    margin: 0;
}

.iw-work-info__muted
{
    font-size: 12px;
    color: var(--iw-work-info-text-3);
    margin: 0;
}

.iw-work-info__features
{
    display: grid;
    gap: 10px;
    padding: 0;
    margin: 0;
    list-style: none;
}

.iw-work-info__features li
{
    position: relative;
    padding-left: 18px;
    font-size: 13px;
    line-height: 1.6;
    color: var(--iw-work-info-text-2);
}

.iw-work-info__features li::before
{
    content: '';
    position: absolute;
    left: 0;
    top: 0.62em;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--iw-work-info-accent);
}

.iw-work-info__tag-row
{
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.iw-work-info__tag
{
    font-family: var(--iw-work-info-mono);
    font-size: 11px;
    font-weight: 500;
    color: var(--iw-work-info-text-2);
    background: var(--iw-work-info-accent-faint);
    border: 1px solid var(--iw-work-info-border-accent);
    border-radius: 999px;
    padding: 5px 12px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.iw-work-info__quick-info
{
    margin: 0;
}

.iw-work-info__quick-row
{
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 12px 0;
    margin: 0;
}

.iw-work-info__quick-row dt
{
    font-family: var(--iw-work-info-mono);
    font-size: 10px;
    color: var(--iw-work-info-accent-dim);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    min-width: 100px;
    padding-top: 1px;
    flex-shrink: 0;
}

.iw-work-info__quick-row dd
{
    font-size: 12px;
    color: var(--iw-work-info-text-2);
    line-height: 1.6;
    margin: 0;
    word-break: break-word;
}

.iw-work-info__quick-row dd a
{
    color: var(--iw-work-info-accent);
    text-decoration: none;
}

.iw-work-info__quick-row dd a:hover
{
    text-decoration: underline;
}

.iw-work-info__back
{
    display: inline-flex;
    align-items: center;
    margin-top: 36px;
    font-family: var(--iw-work-info-mono);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--iw-text);
    background: var(--iw-work-info-accent-faint);
    border: 1px solid var(--iw-work-info-border-accent);
    border-radius: 6px;
    padding: 12px 24px;
    transition: background 0.2s var(--iw-ease), border-color 0.2s var(--iw-ease);
}

.iw-work-info__back:hover
{
    background: rgba(255, 138, 61, 0.2);
    border-color: var(--iw-work-info-accent);
}

@media (max-width: 520px)
{
    .iw-work-info__quick-row
    {
        flex-direction: column;
        gap: 4px;
    }
}

.iw-work-info__media
{
    aspect-ratio: 16 / 9;
    margin-bottom: 28px;
    overflow: hidden;
    border: 1px solid var(--iw-border);
    border-radius: 8px;
    background: #000;
}

.iw-work-info__media--placeholder
{
    background: linear-gradient(135deg, rgba(255, 138, 61, 0.22), rgba(53, 246, 255, 0.12));
}

.iw-work-info__media video,
.iw-work-info__media img
{
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.iw-work-info__nav
{
    display: flex;
    justify-content: space-between;
    gap: 12px;
}
</style>
