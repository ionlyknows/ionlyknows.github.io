import glsl from 'vite-plugin-glsl'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import path from 'path'
import profile from './sources/content/profile.js'

const dirname = path.resolve()

// Page description from content (no text in code): role · program, school
const description = [ profile.role, [ profile.program, profile.school ].filter(Boolean).join(', ') ].filter(Boolean).join(' · ')
const escape = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const metaFromContent = {
    name: 'apeiron-meta',
    transformIndexHtml: (html) => html.replaceAll('%APEIRON_DESCRIPTION%', escape(description))
}

export default defineConfig(({ command }) => ({
    resolve:
    {
        alias:
        {
            '@' : path.resolve(dirname, './sources/Game')
        }
    },
    plugins:
    [
        vue(),
        metaFromContent,
        // File watching is only useful during local development. Keeping it
        // off for builds also avoids recursively scanning unrelated folders.
        glsl({ watch: command === 'serve' })
    ],
    build:
    {
        target: 'es2020',
        sourcemap: false,
        cssCodeSplit: true,
        reportCompressedSize: false
    },
    server:
    {
        host: true,
        open: true
    }
}))
