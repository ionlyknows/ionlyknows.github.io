import * as THREE from 'three'

// Canvas helpers for text and images on 3D exhibits (M6). All text comes from sources/content/.
export const FONT = 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif'
export const MONO = '"JetBrains Mono", Consolas, "Liberation Mono", monospace'
export const COLORS = { ink: '#0b1020', panel: '#121a2e', text: '#eef3ff', dim: '#a9b4c8', glow: '#7ff9ff', accent: '#ff9d5c', gold: '#ffcf5a' }

const imageCache = new Map()

export function createCanvas(width, height)
{
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return { canvas, ctx: canvas.getContext('2d') }
}

export function canvasTexture(canvas)
{
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    return texture
}

// Word-wrap to at most `maxLines` lines (the last one ends with … when cut)
export function wrap(ctx, text, maxWidth, maxLines = Infinity)
{
    const words = String(text).split(/\s+/).filter(Boolean)
    const lines = []
    let line = ''
    for(const word of words)
    {
        const next = line ? `${line} ${word}` : word
        if(ctx.measureText(next).width > maxWidth && line)
        {
            lines.push(line)
            line = word
        }
        else
            line = next
    }
    if(line)
        lines.push(line)
    if(lines.length > maxLines)
    {
        const kept = lines.slice(0, maxLines)
        let last = kept[maxLines - 1]
        while(ctx.measureText(`${last}…`).width > maxWidth && last.length > 1)
            last = last.slice(0, - 1)
        kept[maxLines - 1] = `${last.trimEnd()}…`
        return kept
    }
    return lines
}

// Draws wrapped text, returns the y after the last line
export function text(ctx, value, x, y, { size = 32, weight = 400, color = COLORS.text, font = FONT, maxWidth = 1000, lineHeight = 1.3, maxLines = Infinity, align = 'left' } = {})
{
    ctx.font = `${weight} ${size}px ${font}`
    ctx.fillStyle = color
    ctx.textAlign = align
    ctx.textBaseline = 'top'
    const lines = wrap(ctx, value, maxWidth, maxLines)
    for(const line of lines)
    {
        ctx.fillText(line, x, y)
        y += size * lineHeight
    }
    return y
}

export function roundRect(ctx, x, y, width, height, radius)
{
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.arcTo(x + width, y, x + width, y + height, radius)
    ctx.arcTo(x + width, y + height, x, y + height, radius)
    ctx.arcTo(x, y + height, x, y, radius)
    ctx.arcTo(x, y, x + width, y, radius)
    ctx.closePath()
}

export function loadImage(src)
{
    if(!src)
        return Promise.resolve(null)
    if(!imageCache.has(src))
    {
        imageCache.set(src, new Promise((resolve) =>
        {
            const image = new Image()
            image.decoding = 'async'
            image.onload = () => resolve(image)
            image.onerror = () =>
            {
                console.warn(`[ExhibitCanvas] Could not load ${src}`)
                resolve(null)
            }
            image.src = src
        }))
    }
    return imageCache.get(src)
}

// object-fit: cover
export function drawCover(ctx, image, x, y, width, height)
{
    const scale = Math.max(width / image.width, height / image.height)
    const sw = width / scale
    const sh = height / scale
    ctx.drawImage(image, (image.width - sw) / 2, (image.height - sh) / 2, sw, sh, x, y, width, height)
}

// A flat label (sign, caption): transparent background, centred text
export function labelTexture(value, { width = 1024, height = 256, size = 120, weight = 700, color = COLORS.text, font = FONT, glow = null } = {})
{
    const { canvas, ctx } = createCanvas(width, height)
    ctx.font = `${weight} ${size}px ${font}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    if(glow)
    {
        ctx.shadowColor = glow
        ctx.shadowBlur = size * 0.35
    }
    ctx.fillStyle = color
    const lines = wrap(ctx, value, width * 0.94, 2)
    const lineHeight = size * 1.1
    lines.forEach((line, i) => ctx.fillText(line, width / 2, height / 2 + (i - (lines.length - 1) / 2) * lineHeight))
    return canvasTexture(canvas)
}
