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
        glsl({ watch: true })
    ],
    server:
    {
        host: true,
        open: true
    }
})
