import { createApp } from 'vue'
import App from './App.vue'
import './styles/tokens.css'

export function createUIApp(bridge, game)
{
    const host = document.querySelector('.ui')
    if(!host)
        throw new Error('Unable to mount UI: .ui container was not found')

    const mountPoint = document.createElement('div')
    mountPoint.className = 'ui-app'
    host.append(mountPoint)

    return createApp(App, { bridge, game }).mount(mountPoint)
}
