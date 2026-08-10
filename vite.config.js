import glsl from 'vite-plugin-glsl'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import path from 'path'

const dirname = path.resolve()

export default defineConfig({
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
        // File watching is only useful during local development.
        glsl({ watch: process.env.NODE_ENV !== 'production' })
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
})
