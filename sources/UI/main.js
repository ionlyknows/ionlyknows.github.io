import { createApp } from 'vue'
import App from './App.vue'
import './styles/tokens.css'

export function createUIApp(bridge, game)
{
    const host = document.querySelector('.ui')
    if(!host)
        throw new Error('Unable to mount UI: .ui container was not found')

    const mountPoint = document.createElement('div')
    // tokens.css styles this element by id (#ui-root: fixed, inset:0,
    // z-index:10, pointer-events:none passthrough to the canvas). Keep the
    // class too as a stable, non-styling hook for anything else that wants
    // to select "the UI app root" (e.g. tests).
    mountPoint.id = 'ui-root'
    mountPoint.className = 'ui-app'
    host.append(mountPoint)

    return createApp(App, { bridge, game }).mount(mountPoint)
}
