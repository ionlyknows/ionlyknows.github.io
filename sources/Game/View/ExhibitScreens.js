import * as THREE from 'three'

import exhibits from '../../content/exhibits.js'
import goals from '../../content/goals.js'
import { createCanvas, canvasTexture, text, roundRect, loadImage, drawCover, COLORS, MONO } from './ExhibitCanvas.js'

const has = (value) => Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && String(value).trim() !== ''

// Screens on the planets' exhibits (M6), drawn from content. Every empty field is hidden (BR-07).
// Each returns a mesh placed in the prop's local space (the caller multiplies by the prop matrix).
const screenMaterial = (texture) => new THREE.MeshBasicMaterial({ map: texture, color: new THREE.Color(0.88, 0.88, 0.88), toneMapped: true })

// The Forge: featured build. Title, role, problem, outcome, media and the architecture nodes
// (frontend → backend → database → deployment, only the ones that exist)
export function featuredBoard(project)
{
    const W = 2048
    const H = 1176 // 6.1 × 3.5 m
    const { canvas, ctx } = createCanvas(W, H)
    const texture = canvasTexture(canvas)
    const labels = exhibits.featured
    const nodes = [ 'frontend', 'backend', 'database', 'deployment' ].filter((key) => has(project.architecture?.[key])).map((key) => ({ label: labels[key], value: project.architecture[key] }))
    const media = project.media?.poster || (project.media?.type === 'image' ? project.media.src : '')

    const draw = (image) =>
    {
        const gradient = ctx.createLinearGradient(0, 0, W, H)
        gradient.addColorStop(0, '#0d1428')
        gradient.addColorStop(1, '#1a1020')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, W, H)

        const pad = 90
        const mediaWidth = image ? 860 : 0
        const textWidth = W - pad * 2 - (image ? mediaWidth + 70 : 0)
        let y = pad
        y = text(ctx, labels.eyebrow.toUpperCase(), pad, y, { size: 34, weight: 700, color: COLORS.accent, font: MONO, maxWidth: textWidth }) + 14
        y = text(ctx, project.title, pad, y, { size: 92, weight: 800, maxWidth: textWidth, maxLines: 2, lineHeight: 1.1 }) + 10
        if(has(project.role))
            y = text(ctx, project.role, pad, y, { size: 46, weight: 500, color: COLORS.glow, maxWidth: textWidth }) + 26
        for(const key of [ 'problem', 'outcome' ])
        {
            if(!has(project[key]))
                continue
            y = text(ctx, labels[key].toUpperCase(), pad, y, { size: 30, weight: 700, color: COLORS.dim, font: MONO, maxWidth: textWidth }) + 6
            y = text(ctx, project[key], pad, y, { size: 40, maxWidth: textWidth, maxLines: 3 }) + 22
        }
        if(!has(project.problem) && !has(project.outcome) && has(project.summary))
            y = text(ctx, project.summary, pad, y, { size: 40, color: COLORS.dim, maxWidth: textWidth, maxLines: 4 }) + 22

        if(image)
        {
            const mx = W - pad - mediaWidth
            const my = pad + 20
            const mh = mediaWidth * 9 / 16
            ctx.save()
            roundRect(ctx, mx, my, mediaWidth, mh, 24)
            ctx.clip()
            drawCover(ctx, image, mx, my, mediaWidth, mh)
            ctx.restore()
            ctx.strokeStyle = 'rgba(127, 249, 255, 0.5)'
            ctx.lineWidth = 4
            roundRect(ctx, mx, my, mediaWidth, mh, 24)
            ctx.stroke()
        }

        // Architecture: glowing nodes connected left to right along the bottom
        if(nodes.length)
        {
            const top = H - pad - 190
            text(ctx, labels.architecture.toUpperCase(), pad, top - 56, { size: 30, weight: 700, color: COLORS.dim, font: MONO })
            const gap = 70
            const width = Math.min(430, (W - pad * 2 - gap * (nodes.length - 1)) / nodes.length)
            nodes.forEach((node, i) =>
            {
                const x = pad + i * (width + gap)
                if(i > 0)
                {
                    ctx.strokeStyle = COLORS.glow
                    ctx.lineWidth = 6
                    ctx.shadowColor = COLORS.glow
                    ctx.shadowBlur = 18
                    ctx.beginPath()
                    ctx.moveTo(x - gap + 8, top + 95)
                    ctx.lineTo(x - 18, top + 95)
                    ctx.stroke()
                    ctx.beginPath()
                    ctx.moveTo(x - 32, top + 80)
                    ctx.lineTo(x - 14, top + 95)
                    ctx.lineTo(x - 32, top + 110)
                    ctx.stroke()
                }
                ctx.shadowColor = COLORS.glow
                ctx.shadowBlur = 30
                ctx.fillStyle = 'rgba(127, 249, 255, 0.12)'
                roundRect(ctx, x, top, width, 190, 28)
                ctx.fill()
                ctx.strokeStyle = COLORS.glow
                ctx.lineWidth = 5
                ctx.stroke()
                ctx.shadowBlur = 0
                text(ctx, node.label.toUpperCase(), x + 30, top + 28, { size: 28, weight: 700, color: COLORS.glow, font: MONO, maxWidth: width - 60 })
                text(ctx, node.value, x + 30, top + 78, { size: 40, weight: 600, maxWidth: width - 60, maxLines: 2, lineHeight: 1.15 })
            })
        }
        texture.needsUpdate = true
    }

    draw(null)
    loadImage(media).then((image) => { if(image) draw(image) })

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(6.1, 3.5), screenMaterial(texture))
    mesh.position.set(0, 2.75, 0.115)
    return mesh
}

// The Forge: an activity's title (and role · year) printed on both sides of its banner cloth
export function bannerLabel(activity)
{
    const { canvas, ctx } = createCanvas(600, 350)
    ctx.fillStyle = '#b3263f'
    ctx.fillRect(0, 0, 600, 350)
    let y = 50
    y = text(ctx, activity.title, 300, y, { size: 64, weight: 800, maxWidth: 540, maxLines: 3, align: 'center', lineHeight: 1.1 }) + 16
    const meta = [ activity.role, activity.year ].filter(has).join(' · ')
    if(meta)
        text(ctx, meta, 300, y, { size: 36, color: '#ffe3e8', maxWidth: 540, align: 'center' })
    const texture = canvasTexture(canvas)
    const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.85, side: THREE.DoubleSide })
    const group = new THREE.Group()
    for(const side of [ 1, - 1 ])
    {
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(1.14, 0.665), material)
        plane.position.set(0.62, 2.5, 0.017 * side)
        if(side < 0)
            plane.rotation.y = Math.PI
        group.add(plane)
    }
    return group
}

// The Observatory: goals console (currently learning, next, goal); empty parts hidden
export function goalsScreen()
{
    const labels = exhibits.goals
    const { canvas, ctx } = createCanvas(1024, 600)
    ctx.fillStyle = '#071a1c'
    ctx.fillRect(0, 0, 1024, 600)
    let y = 48
    y = text(ctx, labels.title.toUpperCase(), 56, y, { size: 30, weight: 700, color: '#7ff9ec', font: MONO }) + 18
    for(const key of [ 'currentlyLearning', 'next' ])
    {
        if(!has(goals[key]))
            continue
        y = text(ctx, labels[key], 56, y, { size: 30, weight: 700, color: COLORS.dim }) + 4
        y = text(ctx, goals[key].filter(has).join(' · '), 56, y, { size: 44, weight: 600, maxWidth: 912, maxLines: 3 }) + 22
    }
    if(has(goals.goal))
    {
        y = text(ctx, labels.goal, 56, y, { size: 30, weight: 700, color: COLORS.dim }) + 4
        text(ctx, goals.goal, 56, y, { size: 40, maxWidth: 912, maxLines: 3 })
    }
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.0), screenMaterial(canvasTexture(canvas)))
    // On the console's tilted screen (State/PropShapes.js `console`)
    mesh.position.set(0, 1.45 + 0.343 * 0.065, - 0.1 + 0.939 * 0.065)
    mesh.rotation.x = - 0.35
    return mesh
}

export function createScreen(screen)
{
    if(screen.kind === 'featured')
        return featuredBoard(screen.project)
    if(screen.kind === 'banner')
        return bannerLabel(screen.activity)
    if(screen.kind === 'goals')
        return goalsScreen()
    return null
}
