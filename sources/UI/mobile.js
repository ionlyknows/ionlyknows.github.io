import { createApp } from 'vue'
import MobileApp from './MobileApp.vue'
import './styles/tokens.css'

// Phone / no-WebGL entry: only Vue + content (BR-01, NFR-03)
export function createMobileApp()
{
    document.querySelector('.game')?.remove()
    document.documentElement.classList.add('is-2d')

    const mountPoint = document.createElement('div')
    mountPoint.id = 'mobile-root'
    document.body.append(mountPoint)
    createApp(MobileApp).mount(mountPoint)
}
