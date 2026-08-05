import { useUIBridge } from './useUIBridge.js'

/**
 * Wires the global Escape key (emitted on UIBridge as 'escapePressed') to a
 * panel's own close handler. Each panel owns what "closing" means for it --
 * WorkPanel awaits a fly-back teleport first, About/Resume close immediately.
 */
export function usePanelEscape(onClose)
{
    const { listen } = useUIBridge()
    listen('escapePressed', onClose)
}
