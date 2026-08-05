import { inject } from 'vue'

export const UI_BRIDGE_KEY = Symbol('ui-bridge')

export function useUIBridge()
{
    const bridge = inject(UI_BRIDGE_KEY)
    if(!bridge)
        throw new Error('UIBridge has not been provided')

    return {
        bridge,
        emit: bridge.emit.bind(bridge),
        listen: bridge.on.bind(bridge)
    }
}
