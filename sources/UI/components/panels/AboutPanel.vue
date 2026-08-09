<script setup>
import { ref } from 'vue'
import PanelShell from './PanelShell.vue'
import { usePanelEscape } from '../../composables/usePanelEscape.js'
import about from '../../data/about.js'

const emit = defineEmits([ 'close' ])
const avatarLoadFailed = ref(false)

function close() { emit('close') }
function onAvatarError() { avatarLoadFailed.value = true }

// Unchanged: same global-Escape wiring every panel uses.
usePanelEscape(close)
</script>

<template>
    <PanelShell variant="fullscreen" :title="about.name" :subtitle="about.role" :show-header-copy="false" @close="close">
        <template #header-meta>
            <span class="iw-about__status">
                <span class="iw-about__status-dot" />
                {{ about.status }}
            </span>
        </template>

        <div class="iw-about">
            <!-- â”€â”€ ABOUT â”€â”€ -->
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
                        <template v-if="about.hero.avatarImage && !avatarLoadFailed">
                            <img
                                class="iw-about__avatar-image"
                                :src="about.hero.avatarImage"
                                :alt="`Profile picture of ${about.name}`"
                                @error="onAvatarError"
                            />
                        </template>
                        <svg v-else class="iw-about__avatar-icon" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                            <circle cx="40" cy="30" r="18" fill="var(--iw-about-accent-faint)" stroke="var(--iw-about-accent-dim)" stroke-width="1.5" />
                            <path d="M8 72 C8 52 72 52 72 72" fill="var(--iw-about-accent-faint)" stroke="var(--iw-about-accent-dim)" stroke-width="1.5" />
                        </svg>
                    </div>
                </div>
            </section>

            <hr class="iw-about__divider">

            <!-- â”€â”€ SKILLS â”€â”€ -->
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

            <!-- â”€â”€ PROJECTS â”€â”€ -->
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
                            </div>
                            <p class="iw-about__project-desc">{{ project.desc }}</p>
                            <div class="iw-about__tag-row">
                                <span v-for="tag in project.tags" :key="tag" class="iw-about__tag">{{ tag }}</span>
                            </div>

                            <!-- Live Site / Repository actions. Each renders as a real
                                 link only when its URL is filled in (see about.js); with
                                 no URL it renders a disabled placeholder instead, so we
                                 never ship a dead or fake link. -->
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

            <!-- â”€â”€ ACTIVITIES â”€â”€ -->
            <section>
                <p class="iw-about__slug">// activities</p>
                <h3 class="iw-about__heading">Hands-on Practice</h3>
                <a
                    v-for="activity in about.activities"
                    :key="activity.title"
                    class="iw-about__activity"
                    :href="activity.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    :aria-label="`Open ${activity.title} in a new tab`"
                >
                    <div class="iw-about__activity-head">
                        <div>
                            <p class="iw-about__activity-meta">{{ activity.num }} · {{ activity.year }}</p>
                            <p class="iw-about__activity-title">{{ activity.title }}</p>
                            <p class="iw-about__activity-role">{{ activity.role }}</p>
                        </div>
                        <span class="iw-about__activity-details">Details →</span>
                    </div>
                    <p class="iw-about__activity-desc">{{ activity.desc }}</p>
                </a>
            </section>

            <hr class="iw-about__divider">

            <!-- â”€â”€ EXPERIENCE â”€â”€ -->
            <section>
                <p class="iw-about__slug">// experience</p>
                <h3 class="iw-about__heading">Where I've Been</h3>
                <div v-for="entry in about.experience" :key="entry.title" class="iw-about__timeline-card">
                    <p class="iw-about__timeline-period">{{ entry.period }}</p>
                    <p class="iw-about__timeline-title">{{ entry.title }}</p>
                    <p class="iw-about__timeline-place">{{ entry.place }}</p>
                    <p v-if="entry.desc" class="iw-about__timeline-desc">{{ entry.desc }}</p>
                    <ul v-if="entry.bullets" class="iw-about__timeline-bullets">
                        <li v-for="(bullet, index) in entry.bullets" :key="index">{{ bullet }}</li>
                    </ul>
                </div>
            </section>

            <hr class="iw-about__divider">

            <!-- â”€â”€ ACHIEVEMENTS â”€â”€ -->
            <section>
                <p class="iw-about__slug">// achievements</p>
                <h3 class="iw-about__heading">Milestones</h3>
                <div class="iw-about__achievements">
                    <article v-for="(item, i) in about.achievements" :key="i" class="iw-about__achievement-row">
                        <div class="iw-about__achievement-copy">
                            <span class="iw-about__achievement-year">{{ item.year }}</span>
                            <span class="iw-about__achievement-label">{{ item.label }}</span>
                            <dl class="iw-about__achievement-details">
                                <div>
                                    <dt>Issuer</dt>
                                    <dd>{{ item.issuer }}</dd>
                                </div>
                                <div>
                                    <dt>Credential ID</dt>
                                    <dd>{{ item.credentialId }}</dd>
                                </div>
                            </dl>
                        </div>
                        <a
                            class="iw-about__achievement-image-link"
                            :href="item.imageUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                            :aria-label="`Open full certificate image for ${item.label} in a new tab`"
                        >
                            <img class="iw-about__achievement-image" :src="item.imageUrl" :alt="item.imageAlt" />
                        </a>
                        <a
                            class="iw-about__achievement-credential-button"
                            :href="item.credentialUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            CREDENTIAL
                        </a>
                    </article>
                </div>
            </section>

            <hr class="iw-about__divider">

            <!-- â”€â”€ CONTACT â”€â”€ -->
            <section class="iw-about__contact-section">
                <p class="iw-about__slug">// contact</p>
                <h3 class="iw-about__heading">{{ about.contact.heading }}</h3>
                <p class="iw-about__bio">{{ about.contact.subheading }}</p>

                <div class="iw-about__contact-rows">
                    <div v-if="about.contact.email" class="iw-about__contact-row">
                        <span>Email</span>
                        <a :href="`mailto:${about.contact.email}?subject=Portfolio%20Inquiry`" target="_blank" rel="noopener noreferrer">{{ about.contact.email }}</a>
                    </div>
                    <div v-if="about.contact.github" class="iw-about__contact-row">
                        <span>GitHub</span>
                        <a :href="about.contact.github" target="_blank" rel="noopener noreferrer">{{ about.contact.github.replace('https://', '') }}</a>
                    </div>
                    <div v-if="about.contact.linkedin" class="iw-about__contact-row">
                        <span>LinkedIn</span>
                        <a :href="about.contact.linkedin" target="_blank" rel="noopener noreferrer">{{ about.contact.linkedin.replace('https://', '') }}</a>
                    </div>
                    <div v-if="about.contact.facebook" class="iw-about__contact-row">
                        <span>Facebook</span>
                        <a :href="about.contact.facebook" target="_blank" rel="noopener noreferrer">{{ about.contact.facebook.replace('https://', '') }}</a>
                    </div>
                </div>

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
    margin: 20px 0 0;
}

.iw-about__quick-row
{
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 12px 0;
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
    width: 240px;
    height: 240px;
    border-radius: 50%;
    overflow: hidden;
}

.iw-about__avatar-image
{
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
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
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
}

.iw-about__skill-group
{
    min-width: 0;
    padding: 16px;
    border: 1px solid var(--iw-border);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.02);
}

.iw-about__skill-group-title
{
    font-family: var(--iw-about-mono);
    font-size: 10px;
    color: var(--iw-about-text-3);
    letter-spacing: 0.1em;
    margin: 0 0 10px;
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
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    border: 1px solid var(--iw-border);
    background: rgba(255, 255, 255, 0.01);
    overflow: hidden;
    transition: border-color 0.25s var(--iw-ease), background 0.25s var(--iw-ease);
}

.iw-about__project-media
{
    position: relative;
    width: 100%;
    height: 160px;
    overflow: hidden;
}

.iw-about__project-media img
{
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    opacity: 1;
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
    display: flex;
    flex-direction: column;
    flex: 1;
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
   hover/focus.

   margin-top: auto pins this row to the bottom of .iw-about__project-body
   (a flex column) -- so the buttons sit on the same baseline across all
   three cards regardless of how long each project's description/tag list
   runs, instead of trailing right after the tags at whatever height that
   happens to land on. */
.iw-about__project-links
{
    display: flex;
    gap: 10px;
    margin-top: auto;
    padding-top: 16px;
}

.iw-about__project-link
{
    flex: 1 1 0;
    min-width: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-family: var(--iw-about-mono);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--iw-about-accent);
    background: var(--iw-about-accent-faint);
    border: 1.5px solid var(--iw-about-border-accent);
    border-radius: 8px;
    padding: 11px 10px;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s var(--iw-ease), border-color 0.2s var(--iw-ease),
        background 0.2s var(--iw-ease), box-shadow 0.2s var(--iw-ease),
        transform 0.2s var(--iw-ease);
}

.iw-about__project-link-icon
{
    width: 14px;
    height: 14px;
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
    display: block;
    padding: 18px 20px;
    border-radius: 6px;
    border: 1px solid var(--iw-border);
    background: transparent;
    cursor: pointer;
    margin-bottom: 10px;
    color: inherit;
    text-decoration: none;
    transition: border-color 0.2s var(--iw-ease), background 0.2s var(--iw-ease);
}

.iw-about__activity:hover,
.iw-about__activity:focus-within
{
    border-color: var(--iw-about-border-accent);
    background: var(--iw-about-accent-faint);
}

.iw-about__activity:focus-visible
{
    outline: 2px solid var(--iw-about-accent);
    outline-offset: 2px;
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
    margin: 0 0 10px;
}

.iw-about__timeline-bullets
{
    margin: 0;
    padding-left: 18px;
    color: var(--iw-about-text-2);
    font-size: 12px;
    line-height: 1.75;
}

.iw-about__timeline-bullets li
{
    margin-bottom: 8px;
}

/* -- Achievements -- */
.iw-about__achievements
{
    display: grid;
    gap: 18px;
}

.iw-about__achievement-row
{
    display: grid;
    grid-template-columns: 1fr minmax(180px, 240px) auto;
    gap: 16px;
    align-items: start;
    padding: 18px 0;
    border-bottom: 1px solid var(--iw-border);
}

.iw-about__achievement-copy
{
    display: grid;
    gap: 6px;
}

.iw-about__achievement-year
{
    font-family: var(--iw-about-mono);
    font-size: 10px;
    color: var(--iw-about-accent-dim);
    letter-spacing: 0.1em;
}

.iw-about__achievement-label
{
    font-size: 14px;
    color: var(--iw-text);
    line-height: 1.5;
}

.iw-about__achievement-details
{
    display: grid;
    gap: 3px;
    margin: 6px 0 0;
    font-family: var(--iw-about-mono);
    font-size: 10px;
    line-height: 1.45;
}

.iw-about__achievement-details div
{
    display: flex;
    gap: 7px;
}

.iw-about__achievement-details dt
{
    color: var(--iw-about-text-3);
}

.iw-about__achievement-details dd
{
    margin: 0;
    color: var(--iw-about-text-2);
}

.iw-about__achievement-image-link
{
    display: block;
    width: 100%;
    overflow: hidden;
    border-radius: 10px;
    border: 1px solid var(--iw-border);
    background: rgba(255, 255, 255, 0.03);
    transition: border-color 0.2s var(--iw-ease), box-shadow 0.2s var(--iw-ease), transform 0.2s var(--iw-ease);
}

.iw-about__achievement-image-link:hover,
.iw-about__achievement-image-link:focus-visible
{
    border-color: var(--iw-about-border-accent);
    box-shadow: 0 12px 28px -18px var(--iw-text);
    transform: translateY(-1px);
}

.iw-about__achievement-image
{
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 10;
    object-fit: contain;
}

.iw-about__achievement-credential-button
{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 16px;
    min-width: 120px;
    border-radius: 8px;
    border: 1px solid var(--iw-border);
    background: rgba(255, 255, 255, 0.04);
    color: var(--iw-text);
    font-family: var(--iw-about-mono);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-decoration: none;
    transition: color 0.2s var(--iw-ease), border-color 0.2s var(--iw-ease), background 0.2s var(--iw-ease), transform 0.2s var(--iw-ease);
}

.iw-about__achievement-credential-button:hover,
.iw-about__achievement-credential-button:focus-visible
{
    color: var(--iw-about-accent);
    border-color: var(--iw-about-accent);
    background: rgba(255, 138, 61, 0.1);
    transform: translateY(-1px);
}

.iw-about__achievement-credential-button:focus-visible
{
    outline: 2px solid var(--iw-about-accent);
    outline-offset: 2px;
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

.iw-about__contact-row a
{
    font-size: 12px;
    color: var(--iw-about-text-2);
    text-decoration: none;
    transition: color 0.2s var(--iw-ease), text-shadow 0.2s var(--iw-ease);
}

.iw-about__contact-row a:hover,
.iw-about__contact-row a:focus-visible
{
    color: var(--iw-about-accent);
    text-shadow: 0 0 12px rgba(255, 138, 61, 0.45);
}

.iw-about__contact-row a:focus-visible
{
    outline: 1px solid var(--iw-about-accent);
    outline-offset: 3px;
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
