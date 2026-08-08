<# ============================================================
   deploy-project-buttons.ps1
   Restyles the Live Site / Repository buttons on About Me > Projects
   to full-width, accent-outlined pills (matches the approved mock).

   Writes (with backups of any existing files):
     sources/UI/components/panels/AboutPanel.vue   (modified: button restyle)
     sources/UI/components/panels/PanelShell.vue    (unchanged, re-written for consistency)
     sources/UI/data/about.js                       (unchanged, re-written for consistency)

   Uses no-BOM UTF8 writes (PowerShell 5.1-safe).

   USAGE:
     1. Edit $ProjectRoot below if your repo lives elsewhere.
     2. Save this file as deploy-project-buttons.ps1
     3. Run:
          Unblock-File .\deploy-project-buttons.ps1
          powershell -ExecutionPolicy Bypass -File .\deploy-project-buttons.ps1
   ============================================================ #>

$ErrorActionPreference = "Stop"

$ProjectRoot = "$PSScriptRoot"
# If this script is NOT sitting inside the repo root, set the absolute path instead, e.g.:
# $ProjectRoot = "C:\Users\JEFF\OneDrive\Documents\YknowJeff"

$PanelsDir = Join-Path $ProjectRoot "sources\UI\components\panels"
$DataDir   = Join-Path $ProjectRoot "sources\UI\data"

if (-not (Test-Path $ProjectRoot)) {
    throw "ProjectRoot not found: $ProjectRoot -- update `$ProjectRoot at the top of this script."
}

New-Item -ItemType Directory -Force -Path $PanelsDir | Out-Null
New-Item -ItemType Directory -Force -Path $DataDir   | Out-Null

Write-Host "Target panels dir: $PanelsDir"
Write-Host "Target data dir:   $DataDir"
Write-Host ""

function Write-Utf8NoBom {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Content
    )
    $encoding = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Content, $encoding)
    Write-Host "  Wrote: $Path"
}

$targets = @(
    (Join-Path $PanelsDir "PanelShell.vue"),
    (Join-Path $PanelsDir "AboutPanel.vue"),
    (Join-Path $DataDir   "about.js")
)

Write-Host "Backing up existing files (if any)..."
foreach ($t in $targets) {
    if (Test-Path $t) {
        $backup = "$t.bak"
        Copy-Item -Path $t -Destination $backup -Force
        Write-Host "  Backed up: $t -> $backup"
    }
}
Write-Host ""

$panelShellContent = @'
<script setup>
import gsap from 'gsap'

const props = defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    // 'card' (default) is a centered card over a translucent backdrop that
    // still shows the 3D scene behind it -- used for Work/Resume. 'fullscreen'
    // is a wider (max 980px) glass HUD card over a fully transparent backdrop
    // with its own scrollable body -- used for About. Per the Figma source of
    // truth, the 3D world must stay visible behind it at all times, so this
    // variant never paints an opaque background at any layer.
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
                        <div class="iw-panel__header-right">
                            <!-- Optional per-panel extra (e.g. About's "AVAILABLE" status dot).
                                 Empty by default, so Work/Resume render exactly as before. -->
                            <slot name="header-meta" />
                            <button class="iw-panel__close" type="button" @click="emit('close')" aria-label="Close">
                                <span>Close</span>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                </svg>
                            </button>
                        </div>
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
    /* Figma source of truth: "the 3D game world MUST remain visible behind
       the About Me interface at all times" -- no opaque page background,
       just enough padding to let the HUD card float above the scene. */
    padding: 14px;
    background: transparent;
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
    max-width: 980px;
    height: 100%;
    max-height: 100%;
    margin: 0 auto;
    border: 1px solid var(--iw-border);
    border-radius: var(--iw-radius-lg);
    box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.65);
    background: rgba(6, 9, 16, 0.55);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
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
    padding: 18px 28px;
    position: sticky;
    top: 0;
    background: rgba(4, 6, 12, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 1;
}

.iw-panel--fullscreen .iw-panel__title
{
    font-family: 'JetBrains Mono', var(--iw-font-mono);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.1em;
}

.iw-panel--fullscreen .iw-panel__subtitle
{
    font-family: 'JetBrains Mono', var(--iw-font-mono);
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--iw-accent);
    opacity: 0.75;
    margin-top: 2px;
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

.iw-panel__header-right
{
    display: flex;
    align-items: center;
    gap: 14px;
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
    padding: 32px clamp(20px, 4vw, 40px) 60px;
}
</style>

'@
Write-Utf8NoBom -Path (Join-Path $PanelsDir "PanelShell.vue") -Content $panelShellContent

$aboutPanelContent = @'
<script setup>
import PanelShell from './PanelShell.vue'
import { usePanelEscape } from '../../composables/usePanelEscape.js'
import about from '../../data/about.js'

const emit = defineEmits([ 'close' ])

function close() { emit('close') }

// Unchanged: same global-Escape wiring every panel uses.
usePanelEscape(close)
</script>

<template>
    <PanelShell variant="fullscreen" :title="about.name" :subtitle="about.role" @close="close">
        <template #header-meta>
            <span class="iw-about__status">
                <span class="iw-about__status-dot" />
                {{ about.status }}
            </span>
        </template>

        <div class="iw-about">
            <!-- ── ABOUT ── -->
            <section class="iw-about__hero">
                <div>
                    <p class="iw-about__eyebrow">{{ about.hero.greeting }}</p>
                    <h1 class="iw-about__headline">
                        I'm <span class="iw-about__accent-text">{{ about.name }}</span>
                    </h1>
                    <p class="iw-about__role">{{ about.role }}</p>

                    <p v-for="(paragraph, i) in about.hero.bio" :key="i" class="iw-about__bio">
                        {{ paragraph }}
                    </p>

                    <dl class="iw-about__quick-info">
                        <div v-for="row in about.quickInfo" :key="row.label" class="iw-about__quick-row">
                            <dt>{{ row.label }}</dt>
                            <dd v-if="row.value">{{ row.value }}</dd>
                            <dd v-else-if="row.tags" class="iw-about__tag-row">
                                <span v-for="tag in row.tags" :key="tag" class="iw-about__tag">{{ tag }}</span>
                            </dd>
                        </div>
                    </dl>
                </div>

                <div class="iw-about__avatar-block">
                    <div class="iw-about__avatar">
                        <div class="iw-about__avatar-glow" />
                        <svg class="iw-about__avatar-icon" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                            <circle cx="40" cy="30" r="18" fill="var(--iw-about-accent-faint)" stroke="var(--iw-about-accent-dim)" stroke-width="1.5" />
                            <path d="M8 72 C8 52 72 52 72 72" fill="var(--iw-about-accent-faint)" stroke="var(--iw-about-accent-dim)" stroke-width="1.5" />
                        </svg>
                    </div>
                    <p class="iw-about__avatar-caption">{{ about.hero.avatarCaption }}</p>
                </div>
            </section>

            <hr class="iw-about__divider">

            <!-- ── SKILLS ── -->
            <section>
                <p class="iw-about__slug">// skills</p>
                <h3 class="iw-about__heading">What I Work With</h3>
                <div class="iw-about__skills">
                    <div v-for="group in about.skills" :key="group.group" class="iw-about__skill-group">
                        <p class="iw-about__skill-group-title">// {{ group.group }}</p>
                        <div class="iw-about__tag-row">
                            <span v-for="item in group.items" :key="item" class="iw-about__tag">{{ item }}</span>
                        </div>
                    </div>
                </div>
            </section>

            <hr class="iw-about__divider">

            <!-- ── PROJECTS ── -->
            <section>
                <p class="iw-about__slug">// projects</p>
                <h3 class="iw-about__heading">Things I've Built</h3>
                <div class="iw-about__projects">
                    <article v-for="project in about.projects" :key="project.title" class="iw-about__project-card">
                        <div class="iw-about__project-media">
                            <img :src="project.image" :alt="project.imageAlt" loading="lazy">
                            <span class="iw-about__project-num">{{ project.num }}</span>
                        </div>
                        <div class="iw-about__project-body">
                            <div class="iw-about__project-head">
                                <span class="iw-about__project-title">{{ project.title }}</span>
                                <span class="iw-about__project-view">View →</span>
                            </div>
                            <p class="iw-about__project-desc">{{ project.desc }}</p>
                            <div class="iw-about__tag-row">
                                <span v-for="tag in project.tags" :key="tag" class="iw-about__tag">{{ tag }}</span>
                            </div>

                            <!-- Live Site / Repository actions. Each renders as a real
                                 link only when its URL is filled in (see about.js); with
                                 no URL it renders a disabled placeholder instead, so we
                                 never ship a dead or fake link. @click.stop keeps the
                                 button clicks from bubbling into the card's own
                                 hover/click affordance above. -->
                            <div class="iw-about__project-links">
                                <a
                                    v-if="project.liveUrl"
                                    class="iw-about__project-link iw-about__project-link--live"
                                    :href="project.liveUrl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    :aria-label="`Open live site for ${project.title} (opens in a new tab)`"
                                    @click.stop
                                >
                                    <svg class="iw-about__project-link-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                        <path d="M6.5 9.5L14 2M14 2H9.5M14 2V6.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 9V13.25C12 13.6642 11.6642 14 11.25 14H2.75C2.33579 14 2 13.6642 2 13.25V4.75C2 4.33579 2.33579 4 2.75 4H7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    Live Site
                                </a>
                                <span v-else class="iw-about__project-link iw-about__project-link--disabled" aria-disabled="true" title="Live site link coming soon">
                                    <svg class="iw-about__project-link-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                        <path d="M6.5 9.5L14 2M14 2H9.5M14 2V6.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 9V13.25C12 13.6642 11.6642 14 11.25 14H2.75C2.33579 14 2 13.6642 2 13.25V4.75C2 4.33579 2.33579 4 2.75 4H7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    Live Site
                                </span>

                                <a
                                    v-if="project.repoUrl"
                                    class="iw-about__project-link iw-about__project-link--repo"
                                    :href="project.repoUrl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    :aria-label="`Open GitHub repository for ${project.title} (opens in a new tab)`"
                                    @click.stop
                                >
                                    <svg class="iw-about__project-link-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                                    </svg>
                                    Repository
                                </a>
                                <span v-else class="iw-about__project-link iw-about__project-link--disabled" aria-disabled="true" title="Repository link coming soon">
                                    <svg class="iw-about__project-link-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                                    </svg>
                                    Repository
                                </span>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            <hr class="iw-about__divider">

            <!-- ── ACTIVITIES ── -->
            <section>
                <p class="iw-about__slug">// activities</p>
                <h3 class="iw-about__heading">Hands-on Practice</h3>
                <article v-for="activity in about.activities" :key="activity.title" class="iw-about__activity">
                    <div class="iw-about__activity-head">
                        <div>
                            <p class="iw-about__activity-meta">{{ activity.num }} · {{ activity.year }}</p>
                            <p class="iw-about__activity-title">{{ activity.title }}</p>
                            <p class="iw-about__activity-role">{{ activity.role }}</p>
                        </div>
                        <span class="iw-about__activity-details">Details →</span>
                    </div>
                    <p class="iw-about__activity-desc">{{ activity.desc }}</p>
                </article>
            </section>

            <hr class="iw-about__divider">

            <!-- ── EXPERIENCE ── -->
            <section>
                <p class="iw-about__slug">// experience</p>
                <h3 class="iw-about__heading">Where I've Been</h3>
                <div v-for="entry in about.experience" :key="entry.title" class="iw-about__timeline-card">
                    <p class="iw-about__timeline-period">{{ entry.period }}</p>
                    <p class="iw-about__timeline-title">{{ entry.title }}</p>
                    <p class="iw-about__timeline-place">{{ entry.place }}</p>
                    <p class="iw-about__timeline-desc">{{ entry.desc }}</p>
                </div>
            </section>

            <hr class="iw-about__divider">

            <!-- ── ACHIEVEMENTS ── -->
            <section>
                <p class="iw-about__slug">// achievements</p>
                <h3 class="iw-about__heading">Milestones</h3>
                <div v-for="(item, i) in about.achievements" :key="i" class="iw-about__achievement-row">
                    <span class="iw-about__achievement-year">{{ item.year }}</span>
                    <span class="iw-about__achievement-label">{{ item.label }}</span>
                </div>
            </section>

            <hr class="iw-about__divider">

            <!-- ── EDUCATION ── -->
            <section>
                <p class="iw-about__slug">// education</p>
                <h3 class="iw-about__heading">Academic Background</h3>
                <div class="iw-about__education-card">
                    <p class="iw-about__education-school">{{ about.education.school }}</p>
                    <p class="iw-about__education-degree">{{ about.education.degree }}</p>
                    <p class="iw-about__education-period">{{ about.education.period }}</p>
                </div>
            </section>

            <hr class="iw-about__divider">

            <!-- ── RESUME ── -->
            <section>
                <p class="iw-about__slug">// resume</p>
                <h3 class="iw-about__heading">{{ about.resumeCta.heading }}</h3>
                <p class="iw-about__bio">{{ about.resumeCta.text }}</p>
                <a class="iw-about__resume-button" :href="about.resumeCta.path" download>
                    {{ about.resumeCta.buttonLabel }}
                </a>
            </section>

            <hr class="iw-about__divider">

            <!-- ── CONTACT ── -->
            <section class="iw-about__contact-section">
                <p class="iw-about__slug">// contact</p>
                <h3 class="iw-about__heading">{{ about.contact.heading }}</h3>
                <p class="iw-about__bio">{{ about.contact.subheading }}</p>

                <div class="iw-about__contact-rows">
                    <a v-if="about.contact.email" class="iw-about__contact-row" :href="`mailto:${about.contact.email}`">
                        <span>Email</span>
                        <span>{{ about.contact.email }}</span>
                    </a>
                    <a v-if="about.contact.github" class="iw-about__contact-row" :href="about.contact.github" target="_blank" rel="noopener noreferrer">
                        <span>GitHub</span>
                        <span>{{ about.contact.github.replace('https://', '') }}</span>
                    </a>
                    <a v-if="about.contact.linkedin" class="iw-about__contact-row" :href="about.contact.linkedin" target="_blank" rel="noopener noreferrer">
                        <span>LinkedIn</span>
                        <span>{{ about.contact.linkedin.replace('https://', '') }}</span>
                    </a>
                </div>

                <a v-if="about.contact.email" class="iw-about__connect-button" :href="`mailto:${about.contact.email}`">
                    Connect With Me
                </a>
            </section>
        </div>
    </PanelShell>
</template>

<style scoped>
/* Google Fonts import is a plain CSS @import, so it isn't selector-scoped by
   Vue -- it loads once, globally, but only About's rules below reference
   these families, so Work/Resume keep their existing system-font look. */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');

.iw-about
{
    /* Local tokens: the Figma palette maps almost exactly onto the site's
       existing --iw-accent, so we reuse it rather than duplicating a
       near-identical color. Only the cooler secondary/tertiary text tones
       and font families are genuinely new, so those get their own scoped
       variables instead of overloading global --iw-text-dim (which Work/
       Resume still rely on with different alpha semantics). */
    --iw-about-font: 'Inter', var(--iw-font);
    --iw-about-mono: 'JetBrains Mono', var(--iw-font-mono);
    --iw-about-accent: var(--iw-accent);
    --iw-about-accent-dim: rgba(255, 138, 61, 0.6);
    --iw-about-accent-faint: rgba(255, 138, 61, 0.12);
    --iw-about-border-accent: rgba(255, 138, 61, 0.45);
    --iw-about-text-2: rgba(190, 198, 215, 0.85);
    --iw-about-text-3: rgba(120, 130, 150, 0.85);

    font-family: var(--iw-about-font);
}

.iw-about__status
{
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--iw-about-mono);
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--iw-about-text-3);
}

.iw-about__status-dot
{
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 6px rgba(74, 222, 128, 0.7);
}

.iw-about__divider
{
    height: 1px;
    border: none;
    background: var(--iw-border);
    margin: 40px 0;
}

/* -- Section header pattern (slug + big heading), reused by every section -- */
.iw-about__slug
{
    font-family: var(--iw-about-mono);
    font-size: 11px;
    color: var(--iw-about-text-3);
    letter-spacing: 0.08em;
    margin: 0 0 8px;
}

.iw-about__heading
{
    font-family: var(--iw-about-font);
    font-size: clamp(22px, 3.4vw, 32px);
    font-weight: 800;
    color: var(--iw-text);
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin: 0 0 24px;
}

/* -- Hero / About Me -- */
.iw-about__hero
{
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 40px;
    align-items: center;
}

.iw-about__eyebrow
{
    font-family: var(--iw-about-mono);
    font-size: 10px;
    color: var(--iw-about-text-3);
    letter-spacing: 0.14em;
    margin: 0 0 8px;
}

.iw-about__headline
{
    font-family: var(--iw-about-font);
    font-size: clamp(26px, 4vw, 40px);
    font-weight: 800;
    color: var(--iw-text);
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin: 0 0 6px;
}

.iw-about__accent-text
{
    color: var(--iw-about-accent);
}

.iw-about__role
{
    font-family: var(--iw-about-mono);
    font-size: 12px;
    font-weight: 600;
    color: var(--iw-about-accent-dim);
    letter-spacing: 0.1em;
    margin: 0 0 20px;
}

.iw-about__bio
{
    font-size: 13px;
    line-height: 1.8;
    color: var(--iw-about-text-2);
    margin: 0 0 10px;
}

.iw-about__quick-info
{
    border-top: 1px solid var(--iw-border);
    margin: 20px 0 0;
}

.iw-about__quick-row
{
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid var(--iw-border);
    margin: 0;
}

.iw-about__quick-row dt
{
    font-family: var(--iw-about-mono);
    font-size: 10px;
    color: var(--iw-about-accent-dim);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    min-width: 90px;
    padding-top: 1px;
    flex-shrink: 0;
}

.iw-about__quick-row dd
{
    font-size: 12px;
    color: var(--iw-about-text-2);
    line-height: 1.6;
    margin: 0;
}

.iw-about__avatar-block
{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}

.iw-about__avatar
{
    position: relative;
    width: 180px;
    height: 180px;
}

.iw-about__avatar-glow
{
    position: absolute;
    inset: -18px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--iw-about-accent-faint) 0%, rgba(255, 100, 20, 0.15) 45%, transparent 70%);
    filter: blur(8px);
}

.iw-about__avatar-icon
{
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid var(--iw-about-border-accent);
    background: rgba(15, 22, 35, 0.7);
    padding: 50px;
    box-sizing: border-box;
}

.iw-about__avatar-caption
{
    font-family: var(--iw-about-mono);
    font-size: 9px;
    color: var(--iw-about-accent-dim);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    margin: 0;
}

/* -- Tags -- */
.iw-about__tag-row
{
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.iw-about__tag
{
    font-family: var(--iw-about-mono);
    font-size: 10px;
    font-weight: 500;
    color: var(--iw-about-text-2);
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--iw-border);
    border-radius: 3px;
    padding: 3px 8px;
    letter-spacing: 0.04em;
}

/* -- Skills -- */
.iw-about__skills
{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

.iw-about__skill-group-title
{
    font-family: var(--iw-about-mono);
    font-size: 10px;
    color: var(--iw-about-text-3);
    letter-spacing: 0.1em;
    margin: 0 0 12px;
}

/* -- Projects -- */
.iw-about__projects
{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.iw-about__project-card
{
    border-radius: 8px;
    border: 1px solid var(--iw-border);
    background: rgba(255, 255, 255, 0.01);
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.25s var(--iw-ease), background 0.25s var(--iw-ease);
}

.iw-about__project-card:hover,
.iw-about__project-card:focus-within
{
    border-color: var(--iw-about-border-accent);
    background: rgba(255, 138, 61, 0.03);
}

.iw-about__project-media
{
    position: relative;
    width: 100%;
    height: 160px;
    background: rgba(10, 14, 22, 0.8);
    overflow: hidden;
}

.iw-about__project-media img
{
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    opacity: 0.5;
    transition: opacity 0.25s var(--iw-ease);
}

.iw-about__project-card:hover .iw-about__project-media img
{
    opacity: 0.75;
}

.iw-about__project-num
{
    position: absolute;
    top: 12px;
    left: 14px;
    font-family: var(--iw-about-mono);
    font-size: 10px;
    color: var(--iw-about-accent-dim);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: rgba(5, 8, 14, 0.7);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    padding: 3px 8px;
    border-radius: 3px;
    border: 1px solid var(--iw-border);
}

.iw-about__project-body
{
    padding: 16px 18px;
}

.iw-about__project-head
{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 8px;
}

.iw-about__project-title
{
    font-family: var(--iw-about-mono);
    font-size: 13px;
    font-weight: 700;
    color: var(--iw-text);
    letter-spacing: 0.05em;
}

.iw-about__project-view
{
    font-family: var(--iw-about-mono);
    font-size: 10px;
    color: var(--iw-about-accent-dim);
    letter-spacing: 0.08em;
    white-space: nowrap;
    transition: color 0.2s var(--iw-ease), transform 0.2s var(--iw-ease);
}

.iw-about__project-card:hover .iw-about__project-view
{
    color: var(--iw-about-accent);
    transform: translateX(4px);
}

.iw-about__project-desc
{
    font-size: 12px;
    color: var(--iw-about-text-2);
    line-height: 1.7;
    margin: 0 0 14px;
}

/* -- Project actions: Live Site / Repository --
   Full-width, evenly-split accent-outlined pills (per the approved mock):
   both buttons share one look, icon + label centered, colored border and
   label visible at rest (not just on hover), subtle lift + glow on
   hover/focus. */
.iw-about__project-links
{
    display: flex;
    gap: 10px;
    margin-top: 16px;
}

.iw-about__project-link
{
    flex: 1 1 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: var(--iw-about-mono);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--iw-about-accent);
    background: var(--iw-about-accent-faint);
    border: 1.5px solid var(--iw-about-border-accent);
    border-radius: 8px;
    padding: 12px 14px;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s var(--iw-ease), border-color 0.2s var(--iw-ease),
        background 0.2s var(--iw-ease), box-shadow 0.2s var(--iw-ease),
        transform 0.2s var(--iw-ease);
}

.iw-about__project-link-icon
{
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}

.iw-about__project-link:hover,
.iw-about__project-link:focus-visible
{
    color: var(--iw-about-accent);
    border-color: var(--iw-about-accent);
    background: rgba(255, 138, 61, 0.16);
    box-shadow: 0 0 0 1px rgba(255, 138, 61, 0.25), 0 8px 20px -10px rgba(255, 138, 61, 0.5);
    transform: translateY(-1px);
}

.iw-about__project-link:focus-visible
{
    outline: 2px solid var(--iw-about-accent);
    outline-offset: 2px;
}

/* Disabled state -- shown when a project has no liveUrl/repoUrl yet.
   Same footprint/size as a real button so the row layout never jumps once
   the URL is filled in, but visually inert: dashed border, dimmed, no
   hover motion, not focusable (it's a <span>, not an <a>). */
.iw-about__project-link--disabled
{
    color: var(--iw-about-text-3);
    background: rgba(255, 255, 255, 0.02);
    border-color: var(--iw-border);
    border-style: dashed;
    cursor: not-allowed;
    opacity: 0.6;
}

.iw-about__project-link--disabled:hover
{
    color: var(--iw-about-text-3);
    background: rgba(255, 255, 255, 0.02);
    border-color: var(--iw-border);
    box-shadow: none;
    transform: none;
}

/* -- Activities -- */
.iw-about__activity
{
    padding: 18px 20px;
    border-radius: 6px;
    border: 1px solid var(--iw-border);
    background: transparent;
    cursor: pointer;
    margin-bottom: 10px;
    transition: border-color 0.2s var(--iw-ease), background 0.2s var(--iw-ease);
}

.iw-about__activity:hover,
.iw-about__activity:focus-within
{
    border-color: var(--iw-about-border-accent);
    background: var(--iw-about-accent-faint);
}

.iw-about__activity-head
{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 8px;
}

.iw-about__activity-meta
{
    font-family: var(--iw-about-mono);
    font-size: 10px;
    color: var(--iw-about-accent-dim);
    letter-spacing: 0.1em;
    margin: 0 0 4px;
}

.iw-about__activity-title
{
    font-family: var(--iw-about-mono);
    font-size: 13px;
    font-weight: 700;
    color: var(--iw-text);
    letter-spacing: 0.06em;
    margin: 0 0 2px;
}

.iw-about__activity-role
{
    font-family: var(--iw-about-mono);
    font-size: 10px;
    color: var(--iw-about-text-3);
    letter-spacing: 0.08em;
    margin: 0;
}

.iw-about__activity-details
{
    font-family: var(--iw-about-mono);
    font-size: 10px;
    color: var(--iw-about-text-3);
    letter-spacing: 0.08em;
    white-space: nowrap;
    transition: color 0.2s var(--iw-ease), transform 0.2s var(--iw-ease);
}

.iw-about__activity:hover .iw-about__activity-details
{
    color: var(--iw-about-accent);
    transform: translateX(3px);
}

.iw-about__activity-desc
{
    font-size: 12px;
    color: var(--iw-about-text-2);
    line-height: 1.7;
    margin: 0;
}

/* -- Experience -- */
.iw-about__timeline-card
{
    padding: 22px 24px;
    border-radius: 6px;
    border: 1px solid var(--iw-border);
    position: relative;
}

.iw-about__timeline-card::before
{
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, var(--iw-about-accent-dim), transparent);
    border-radius: 1px;
}

.iw-about__timeline-period
{
    font-family: var(--iw-about-mono);
    font-size: 10px;
    color: var(--iw-about-accent-dim);
    letter-spacing: 0.1em;
    margin: 0 0 6px;
}

.iw-about__timeline-title
{
    font-family: var(--iw-about-mono);
    font-size: 14px;
    font-weight: 700;
    color: var(--iw-text);
    letter-spacing: 0.06em;
    margin: 0 0 4px;
}

.iw-about__timeline-place
{
    font-size: 11px;
    color: var(--iw-about-text-3);
    margin: 0 0 10px;
}

.iw-about__timeline-desc
{
    font-size: 12px;
    color: var(--iw-about-text-2);
    line-height: 1.75;
    margin: 0;
}

/* -- Achievements -- */
.iw-about__achievement-row
{
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 13px 0;
    border-bottom: 1px solid var(--iw-border);
}

.iw-about__achievement-year
{
    font-family: var(--iw-about-mono);
    font-size: 10px;
    color: var(--iw-about-accent-dim);
    letter-spacing: 0.1em;
    min-width: 40px;
}

.iw-about__achievement-label
{
    font-size: 12px;
    color: var(--iw-about-text-2);
}

/* -- Education -- */
.iw-about__education-card
{
    padding: 22px 24px;
    border-radius: 6px;
    border: 1px solid var(--iw-border);
}

.iw-about__education-school
{
    font-family: var(--iw-about-mono);
    font-size: 13px;
    font-weight: 700;
    color: var(--iw-text);
    letter-spacing: 0.05em;
    margin: 0 0 6px;
}

.iw-about__education-degree
{
    font-size: 12px;
    color: var(--iw-about-text-2);
    margin: 0 0 8px;
}

.iw-about__education-period
{
    font-family: var(--iw-about-mono);
    font-size: 10px;
    color: var(--iw-about-accent-dim);
    letter-spacing: 0.1em;
    margin: 0;
}

/* -- Resume CTA -- */
.iw-about__resume-button
{
    display: inline-flex;
    align-items: center;
    font-family: var(--iw-about-mono);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--iw-text);
    background: var(--iw-about-accent-faint);
    border: 1px solid var(--iw-about-border-accent);
    border-radius: 6px;
    padding: 12px 24px;
    text-decoration: none;
    transition: background 0.2s var(--iw-ease), border-color 0.2s var(--iw-ease);
}

.iw-about__resume-button:hover
{
    background: rgba(255, 138, 61, 0.2);
    border-color: var(--iw-about-accent);
}

/* -- Contact -- */
.iw-about__contact-section
{
    margin-bottom: 12px;
}

.iw-about__contact-rows
{
    margin: 20px 0 28px;
}

.iw-about__contact-row
{
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 13px 0;
    border-bottom: 1px solid var(--iw-border);
    text-decoration: none;
}

.iw-about__contact-row span:first-child
{
    font-family: var(--iw-about-mono);
    font-size: 10px;
    color: var(--iw-about-accent-dim);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    min-width: 72px;
}

.iw-about__contact-row span:last-child
{
    font-size: 12px;
    color: var(--iw-about-text-2);
}

.iw-about__connect-button
{
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: var(--iw-about-mono);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--iw-text);
    background: linear-gradient(135deg, rgba(255, 138, 61, 0.18) 0%, rgba(255, 138, 61, 0.08) 100%);
    border: 1px solid var(--iw-about-border-accent);
    border-radius: 6px;
    padding: 12px 28px;
    text-decoration: none;
    transition: background 0.2s var(--iw-ease), border-color 0.2s var(--iw-ease);
}

.iw-about__connect-button:hover
{
    background: linear-gradient(135deg, rgba(255, 138, 61, 0.28) 0%, rgba(255, 138, 61, 0.14) 100%);
    border-color: var(--iw-about-accent);
}

/* -- Responsive: stack the two-column layouts below tablet width -- */
@media (max-width: 720px)
{
    .iw-about__hero
    {
        grid-template-columns: 1fr;
    }

    .iw-about__skills,
    .iw-about__projects
    {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 520px)
{
    .iw-about__skills,
    .iw-about__projects
    {
        grid-template-columns: 1fr;
    }

    .iw-about__project-links
    {
        flex-direction: column;
    }

    .iw-about__quick-row
    {
        flex-direction: column;
        gap: 4px;
    }
}
</style>

'@
Write-Utf8NoBom -Path (Join-Path $PanelsDir "AboutPanel.vue") -Content $aboutPanelContent

$aboutJsContent = @'
// Content for the About panel (sources/UI/components/panels/AboutPanel.vue)
// and, for name/role only, the Resume panel. Source of truth for layout is
// the Figma "Build Now" About Me HUD design -- see AboutPanel.vue.

export default {
    name: 'Jefferson F. Laspiñas',
    role: 'Creative Developer',
    status: 'Available',

    hero: {
        greeting: 'Hello!',
        bio: [
            'I\'m a Computer Science student and creative developer interested in building interactive websites, applications, and digital experiences.',
            'I enjoy combining programming, design, and interactive technologies to create projects that are both functional and engaging.'
        ],
        avatarCaption: 'CS Student'
    },

    quickInfo: [
        { label: 'Location', value: 'Philippines' },
        { label: 'Education', value: 'Bachelor of Science in Computer Science' },
        { label: 'Focus', tags: [ 'Web Development', 'Interactive Experiences', 'UI/UX', 'Creative Technology' ] }
    ],

    skills: [
        { group: 'development', items: [ 'JavaScript', 'HTML', 'CSS', 'Java', 'Vue.js' ] },
        { group: '3d / interactive', items: [ 'Three.js', 'WebGL', 'WebGPU', 'GSAP' ] },
        { group: 'tools', items: [ 'Git', 'GitHub', 'VS Code', 'Figma' ] }
    ],

    // Independent from sources/UI/data/projects.js (which drives the Work
    // billboard) -- About tells the same story in its own scrollable list,
    // per the Figma design. Swap `image` for local screenshots when ready;
    // these are placeholder Unsplash photos carried over from the design file.
    //
    // liveUrl / repoUrl: PLACEHOLDERS. Leave as '' until you have the real
    // link -- AboutPanel.vue hides a project's Live Site / Repository button
    // whenever its URL is empty (renders a disabled state instead), so an
    // empty string never produces a dead or fake link. Fill these in with
    // your actual deployed URL and GitHub repo URL when ready.
    projects: [
        {
            num: 'Project 01',
            title: '3D Interactive Portfolio',
            desc: 'An immersive 3D portfolio experience designed around exploration and interaction.',
            tags: [ 'Three.js', 'WebGL', 'JavaScript' ],
            image: 'https://images.unsplash.com/photo-1760008486593-a85315610136?w=600&h=360&fit=crop&auto=format',
            imageAlt: '3D abstract shapes representing an interactive portfolio',
            liveUrl: '',
            repoUrl: ''
        },
        {
            num: 'Project 02',
            title: 'Event Registration System',
            desc: 'Desktop application for managing walk-in registration and attendee check-ins.',
            tags: [ 'Java', 'Swing', 'JSON' ],
            image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=600&h=360&fit=crop&auto=format',
            imageAlt: 'Dashboard monitoring screen for event management',
            liveUrl: '',
            repoUrl: ''
        },
        {
            num: 'Project 03',
            title: 'Canteen Ordering System',
            desc: 'Desktop ordering application designed to simplify canteen transactions.',
            tags: [ 'Java', 'GUI' ],
            image: 'https://images.unsplash.com/photo-1760888549280-4aef010720bd?w=600&h=360&fit=crop&auto=format',
            imageAlt: 'Food ordering app on a smartphone',
            liveUrl: '',
            repoUrl: ''
        }
    ],

    activities: [
        {
            num: '01',
            title: 'University Event',
            role: 'Organizer / Contributor',
            year: '2026',
            desc: 'Participated in planning and coordinating university activities while working with different teams.'
        },
        {
            num: '02',
            title: 'Programming Activity',
            role: 'Participant / Developer',
            year: '2026',
            desc: 'Participated in programming activities involving problem solving, development, and collaboration.'
        },
        {
            num: '03',
            title: 'Community Activity',
            role: 'Participant',
            year: '2026',
            desc: 'Participated in collaborative school and community-oriented activities.'
        }
    ],

    experience: [
        {
            period: '2026 — Present',
            title: 'Computer Science Student',
            place: 'University of the Immaculate Conception',
            desc: 'Developing software projects and studying programming, algorithms, data structures, web development, and software engineering.'
        }
    ],

    // Placeholders, per the Figma spec ("use placeholders where actual
    // information is unavailable, do not invent achievements").
    achievements: [
        { year: '2026', label: 'Programming / Academic Achievement' },
        { year: '2026', label: 'Project Recognition' },
        { year: '2026', label: 'Competition / Event' },
        { year: '2026', label: 'Certification' }
    ],

    education: {
        school: 'University of the Immaculate Conception',
        degree: 'Bachelor of Science in Computer Science',
        period: '2025 — Present'
    },

    resumeCta: {
        heading: 'Want the complete picture?',
        text: 'Download my resume for a concise overview of my education, skills, projects, activities, achievements, and experience.',
        buttonLabel: 'Download Resume',
        path: '/resume.pdf'
    },

    contact: {
        heading: 'Let\'s Build Something.',
        subheading: 'Have an idea? Let\'s talk.',
        email: 'your-email@example.com',
        github: 'https://github.com/yourusername',
        linkedin: 'https://linkedin.com/in/yourusername'
    }
}

'@
Write-Utf8NoBom -Path (Join-Path $DataDir "about.js") -Content $aboutJsContent

Write-Host ""
Write-Host "Done. Verifying no BOM on written files..."

foreach ($t in $targets) {
    $bytes = [System.IO.File]::ReadAllBytes($t)
    $hasBom = ($bytes.Length -ge 3) -and ($bytes[0] -eq 0xEF) -and ($bytes[1] -eq 0xBB) -and ($bytes[2] -eq 0xBF)
    if ($hasBom) {
        Write-Host "  WARNING: BOM detected in $t" -ForegroundColor Red
    } else {
        Write-Host "  OK (no BOM): $t" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  git status"
Write-Host "  git diff sources/UI/components/panels/AboutPanel.vue"
Write-Host "  npm run build"
Write-Host "  npm run dev   # check About Me > Projects visually"
