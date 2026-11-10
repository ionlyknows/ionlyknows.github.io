<script setup>
import profile from '../../../content/profile.js'
import contact from '../../../content/contact.js'
import skills from '../../../content/skills.js'
import achievements from '../../../content/achievements.js'
import activities from '../../../content/activities.js'
import credits from '../../../content/credits.js'
import { has, visibleProjects } from '../../visibleContent.js'
import { track } from '../../../Game/Analytics.js'

// S5 / S6: one scrollable page, shared by the desktop quick-view and the phone 2D view.
// Every optional field is hidden when empty (BR-07).
const contactNames = { email: 'Email', github: 'GitHub', linkedin: 'LinkedIn', facebook: 'Facebook' }
const contactLinks = contact.links.filter((link) => has(link.url))
const featured = visibleProjects.filter((project) => project.featured)
const archive = visibleProjects.filter((project) => !project.featured)
const skillGroups = skills.filter((group) => has(group.items))
const certificates = achievements.filter((item) => has(item.title))
const activityItems = activities.filter((item) => has(item.title))
const education = [ profile.program, profile.school, profile.year ].filter(has)

const sections = [
    { id: 'qv-projects', label: 'Projects', show: featured.length || archive.length },
    { id: 'qv-skills', label: 'Skills', show: skillGroups.length },
    { id: 'qv-achievements', label: 'Achievements', show: certificates.length },
    { id: 'qv-activities', label: 'Activities', show: activityItems.length },
    { id: 'qv-about', label: 'About', show: has(profile.bio) || has(profile.experience) }
].filter((section) => section.show)

const meta = (...values) => values.filter(has).join(' · ')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
const external = (url) => /^https?:/.test(url)
</script>

<template>
    <div class="qv">
        <header class="qv-header">
            <p v-if="has(profile.status)" class="qv-header__status"><span aria-hidden="true" />{{ profile.status }}</p>
            <h1 class="qv-header__name">{{ profile.name }}</h1>
            <p v-if="has(profile.role)" class="qv-header__role">{{ profile.role }}</p>
            <p v-if="has(profile.location)" class="qv-header__location">{{ profile.location }}</p>

            <div v-if="contactLinks.length || has(profile.resumeUrl)" class="qv-header__contact">
                <a
                    v-for="link in contactLinks"
                    :key="link.type"
                    class="qv-button"
                    :class="{ 'qv-button--primary': link.type === 'email' }"
                    :href="link.url"
                    :target="external(link.url) ? '_blank' : undefined"
                    :rel="external(link.url) ? 'noopener noreferrer' : undefined"
                    @click="track('contact_click', { type: link.type })"
                >{{ contactNames[link.type] || link.type }}</a>
                <a v-if="has(profile.resumeUrl)" class="qv-button" :href="profile.resumeUrl" target="_blank" rel="noopener noreferrer">Résumé</a>
            </div>

            <nav v-if="sections.length" class="qv-header__nav" aria-label="Sections">
                <a v-for="section in sections" :key="section.id" :href="`#${section.id}`" @click.prevent="scrollToSection(section.id)">{{ section.label }}</a>
            </nav>
        </header>

        <section v-if="featured.length" id="qv-projects" class="qv-section qv-section--forge">
            <h2 class="qv-section__title">Featured projects</h2>
            <article v-for="project in featured" :key="project.id" class="qv-project">
                <div v-if="project.media" class="qv-project__media">
                    <video
                        v-if="project.media.type === 'video'"
                        :src="project.media.src"
                        :poster="project.media.poster || undefined"
                        :aria-label="project.media.alt || project.title"
                        preload="none"
                        controls
                        playsinline
                        muted
                        @play.once="track('project_open', { id: project.id })"
                    />
                    <img v-else-if="has(project.media.src)" :src="project.media.src" :alt="project.media.alt || project.title" loading="lazy">
                </div>
                <div class="qv-project__body">
                    <p v-if="meta(project.role, project.status)" class="qv-eyebrow">{{ meta(project.role, project.status) }}</p>
                    <h3 class="qv-project__title">{{ project.title }}</h3>
                    <p class="qv-project__summary">{{ project.summary }}</p>
                    <p v-if="has(project.description)" class="qv-project__description">{{ project.description }}</p>
                    <ul v-if="has(project.keyFeatures)" class="qv-list">
                        <li v-for="feature in project.keyFeatures" :key="feature">{{ feature }}</li>
                    </ul>
                    <ul v-if="has(project.stack)" class="qv-chips" aria-label="Stack">
                        <li v-for="item in project.stack" :key="item">{{ item }}</li>
                    </ul>
                    <div v-if="has(project.repoUrl) || has(project.demoUrl)" class="qv-project__links">
                        <a v-if="has(project.demoUrl)" class="qv-button qv-button--primary" :href="project.demoUrl" target="_blank" rel="noopener noreferrer" @click="track('project_open', { id: project.id })">Demo ↗</a>
                        <a v-if="has(project.repoUrl)" class="qv-button" :href="project.repoUrl" target="_blank" rel="noopener noreferrer" @click="track('project_open', { id: project.id })">Code ↗</a>
                    </div>
                </div>
            </article>
        </section>

        <section v-if="archive.length" :id="featured.length ? undefined : 'qv-projects'" class="qv-section qv-section--forge">
            <h2 class="qv-section__title">Project archive</h2>
            <ul class="qv-grid">
                <li v-for="project in archive" :key="project.id" class="qv-card">
                    <p v-if="meta(project.role, project.status)" class="qv-eyebrow">{{ meta(project.role, project.status) }}</p>
                    <h3 class="qv-card__title">{{ project.title }}</h3>
                    <p class="qv-card__text">{{ project.summary }}</p>
                    <div v-if="has(project.repoUrl) || has(project.demoUrl)" class="qv-project__links">
                        <a v-if="has(project.demoUrl)" class="qv-button" :href="project.demoUrl" target="_blank" rel="noopener noreferrer" @click="track('project_open', { id: project.id })">Demo ↗</a>
                        <a v-if="has(project.repoUrl)" class="qv-button" :href="project.repoUrl" target="_blank" rel="noopener noreferrer" @click="track('project_open', { id: project.id })">Code ↗</a>
                    </div>
                </li>
            </ul>
        </section>

        <section v-if="skillGroups.length" id="qv-skills" class="qv-section qv-section--observatory">
            <h2 class="qv-section__title">Skills</h2>
            <div class="qv-grid">
                <div v-for="group in skillGroups" :key="group.group" class="qv-card">
                    <h3 class="qv-eyebrow">{{ group.group }}</h3>
                    <ul class="qv-chips">
                        <li v-for="item in group.items" :key="item">{{ item }}</li>
                    </ul>
                </div>
            </div>
        </section>

        <section v-if="certificates.length" id="qv-achievements" class="qv-section qv-section--trophy">
            <h2 class="qv-section__title">Achievements</h2>
            <ul class="qv-grid">
                <li v-for="item in certificates" :key="item.id" class="qv-card qv-cert">
                    <a v-if="has(item.image)" class="qv-cert__image" :href="item.image" target="_blank" rel="noopener noreferrer" :aria-label="`${item.title} certificate (opens in a new tab)`" @click="track('certificate_open', { id: item.id })">
                        <img :src="item.image" alt="" loading="lazy">
                    </a>
                    <h3 class="qv-card__title">{{ item.title }}</h3>
                    <p v-if="meta(item.issuer, item.year)" class="qv-card__text">{{ meta(item.issuer, item.year) }}</p>
                    <a v-if="has(item.credentialUrl)" class="qv-link" :href="item.credentialUrl" target="_blank" rel="noopener noreferrer" @click="track('certificate_open', { id: item.id })">View credential ↗</a>
                </li>
            </ul>
        </section>

        <section v-if="activityItems.length" id="qv-activities" class="qv-section qv-section--trophy">
            <h2 class="qv-section__title">Activities</h2>
            <ul class="qv-grid">
                <li v-for="item in activityItems" :key="item.id" class="qv-card">
                    <p v-if="meta(item.role, item.year)" class="qv-eyebrow">{{ meta(item.role, item.year) }}</p>
                    <h3 class="qv-card__title">{{ item.title }}</h3>
                    <p v-if="has(item.description)" class="qv-card__text">{{ item.description }}</p>
                    <a v-if="has(item.url)" class="qv-link" :href="item.url" target="_blank" rel="noopener noreferrer">Open page ↗</a>
                </li>
            </ul>
        </section>

        <section v-if="has(profile.bio) || has(profile.experience)" id="qv-about" class="qv-section qv-section--station">
            <h2 class="qv-section__title">About</h2>
            <div class="qv-about">
                <div class="qv-about__intro">
                    <img v-if="has(profile.avatar)" class="qv-about__avatar" :src="profile.avatar" :alt="profile.name" loading="lazy">
                    <div>
                        <p v-if="has(profile.greeting)" class="qv-about__greeting">{{ profile.greeting }}</p>
                        <p v-for="paragraph in profile.bio" :key="paragraph" class="qv-about__bio">{{ paragraph }}</p>
                        <p v-if="education.length" class="qv-eyebrow">{{ education.join(' · ') }}</p>
                    </div>
                </div>
                <ol v-if="has(profile.experience)" class="qv-timeline">
                    <li v-for="item in profile.experience" :key="`${item.title}-${item.place}`">
                        <p v-if="has(item.period)" class="qv-eyebrow">{{ item.period }}</p>
                        <h3 class="qv-card__title">{{ item.title }}</h3>
                        <p v-if="has(item.place)" class="qv-card__text">{{ item.place }}</p>
                        <ul v-if="has(item.bullets)" class="qv-list">
                            <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
                        </ul>
                    </li>
                </ol>
            </div>
        </section>

        <footer class="qv-footer">
            <h2 class="qv-eyebrow">Credits</h2>
            <ul>
                <li v-for="credit in credits" :key="credit.what">
                    <span>{{ credit.what }}:</span>
                    <a :href="credit.url" target="_blank" rel="noopener noreferrer">{{ credit.name }}</a>
                    <span>({{ credit.license }})</span>
                </li>
            </ul>
        </footer>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700;800&display=swap');

.qv
{
    --qv-accent: var(--iw-glow);
    width: min(1080px, 100%);
    margin: 0 auto;
    padding: 0 16px 48px;
    font-family: 'Inter', var(--iw-font);
    font-size: 16px;
    line-height: 1.55;
    color: var(--iw-text);
}

.qv a:focus-visible,
.qv button:focus-visible
{
    outline: 2px solid var(--qv-accent);
    outline-offset: 3px;
}

/* Header */
.qv-header
{
    display: grid;
    justify-items: start;
    gap: 6px;
    padding: 72px 0 28px;
}

.qv-header__status
{
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 8px;
    padding: 4px 12px;
    border: 1px solid rgba(127, 249, 255, 0.35);
    border-radius: 999px;
    color: var(--iw-glow);
    font-family: 'JetBrains Mono', var(--iw-font-mono);
    font-size: 13px;
}

.qv-header__status span
{
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--iw-glow);
    box-shadow: 0 0 10px var(--iw-glow);
}

.qv-header__name
{
    margin: 0;
    font-size: clamp(34px, 6vw, 60px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.05;
}

.qv-header__role
{
    margin: 0;
    color: var(--iw-loc-station);
    font-size: clamp(18px, 2.4vw, 22px);
    font-weight: 600;
}

.qv-header__location
{
    margin: 0;
    color: var(--iw-text-dim);
}

.qv-header__contact
{
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 16px;
}

.qv-header__nav
{
    display: flex;
    flex-wrap: wrap;
    gap: 6px 18px;
    margin-top: 22px;
    font-family: 'JetBrains Mono', var(--iw-font-mono);
    font-size: 14px;
}

.qv-header__nav a
{
    color: var(--iw-text-dim);
    text-decoration: none;
}

.qv-header__nav a:hover
{
    color: var(--iw-text);
}

/* Buttons and links */
.qv-button
{
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 10px 18px;
    border: 1px solid var(--iw-border-strong);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
    color: var(--iw-text);
    font-weight: 600;
    text-decoration: none;
    transition: border-color 0.2s var(--iw-ease), background 0.2s var(--iw-ease);
}

.qv-button:hover
{
    border-color: var(--qv-accent);
    background: rgba(255, 255, 255, 0.08);
}

.qv-button--primary
{
    border-color: transparent;
    background: var(--iw-glow);
    color: var(--iw-ink);
}

.qv-button--primary:hover
{
    background: #b4fcff;
}

.qv-link
{
    color: var(--qv-accent);
    font-weight: 600;
    text-decoration: none;
}

.qv-link:hover
{
    text-decoration: underline;
}

/* Sections */
.qv-section
{
    padding: 36px 0 8px;
    border-top: 1px solid var(--iw-border);
    scroll-margin-top: 72px;
}

.qv-section--forge { --qv-accent: var(--iw-loc-forge); }
.qv-section--observatory { --qv-accent: var(--iw-loc-observatory); }
.qv-section--trophy { --qv-accent: var(--iw-loc-trophy); }
.qv-section--station { --qv-accent: var(--iw-loc-station); }

.qv-section__title
{
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0 0 20px;
    font-size: clamp(24px, 3.2vw, 32px);
    font-weight: 700;
}

.qv-section__title::before
{
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--qv-accent);
    box-shadow: 0 0 14px var(--qv-accent);
}

.qv-eyebrow
{
    margin: 0 0 6px;
    color: var(--qv-accent);
    font-family: 'JetBrains Mono', var(--iw-font-mono);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

/* Projects */
.qv-project
{
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: 24px;
    margin-bottom: 24px;
    padding: 18px;
    border: 1px solid var(--iw-border);
    border-radius: var(--iw-radius-lg);
    background: var(--iw-glass);
}

.qv-project__media video,
.qv-project__media img
{
    display: block;
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    border-radius: var(--iw-radius-md);
    background: #000;
}

.qv-project__title
{
    margin: 0 0 6px;
    font-size: 22px;
    font-weight: 700;
}

.qv-project__summary
{
    margin: 0 0 10px;
    font-weight: 500;
}

.qv-project__description
{
    margin: 0 0 12px;
    color: var(--iw-text-dim);
}

.qv-project__links
{
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 14px;
}

.qv-list
{
    margin: 0 0 12px;
    padding-left: 20px;
    color: var(--iw-text-dim);
}

.qv-chips
{
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.qv-chips li
{
    padding: 4px 12px;
    border: 1px solid var(--iw-border);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
    font-size: 14px;
}

/* Cards */
.qv-grid
{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
    margin: 0 0 24px;
    padding: 0;
    list-style: none;
}

.qv-card
{
    padding: 18px;
    border: 1px solid var(--iw-border);
    border-radius: var(--iw-radius-md);
    background: var(--iw-glass);
}

.qv-card__title
{
    margin: 0 0 4px;
    font-size: 17px;
    font-weight: 700;
}

.qv-card__text
{
    margin: 0 0 8px;
    color: var(--iw-text-dim);
}

.qv-cert__image img
{
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    margin-bottom: 12px;
    object-fit: cover;
    border-radius: var(--iw-radius-sm);
    background: rgba(255, 255, 255, 0.04);
}

/* About */
.qv-about
{
    display: grid;
    gap: 28px;
    margin-bottom: 24px;
}

.qv-about__intro
{
    display: grid;
    grid-template-columns: 120px minmax(0, 1fr);
    gap: 24px;
    align-items: start;
}

.qv-about__avatar
{
    width: 120px;
    height: 120px;
    border: 2px solid var(--iw-loc-station);
    border-radius: 50%;
    object-fit: cover;
}

.qv-about__greeting
{
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 700;
}

.qv-about__bio
{
    margin: 0 0 12px;
    color: var(--iw-text-dim);
}

.qv-timeline
{
    display: grid;
    gap: 18px;
    margin: 0;
    padding: 0 0 0 18px;
    border-left: 1px solid var(--iw-border-strong);
    list-style: none;
}

/* Footer */
.qv-footer
{
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid var(--iw-border);
    color: var(--iw-text-dim);
    font-size: 14px;
}

.qv-footer ul
{
    display: grid;
    gap: 4px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.qv-footer li
{
    display: flex;
    flex-wrap: wrap;
    gap: 0 6px;
}

.qv-footer a
{
    color: var(--iw-text);
}

@media (max-width: 760px)
{
    .qv-header { padding-top: 56px; }
    .qv-project { grid-template-columns: 1fr; padding: 14px; }
    .qv-about__intro { grid-template-columns: 1fr; }
    .qv-about__avatar { width: 88px; height: 88px; }
}
</style>
