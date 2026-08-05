/** Framework-agnostic event bridge between the game and UI. */
class UIBridge
{
    static instance

    static getInstance()
    {
        if(!UIBridge.instance)
            UIBridge.instance = new UIBridge()

        return UIBridge.instance
    }

    constructor()
    {
        this.listeners = new Map()
    }

    on(event, listener)
    {
        const listeners = this.listeners.get(event) || new Set()
        listeners.add(listener)
        this.listeners.set(event, listeners)
        return () => this.off(event, listener)
    }

    off(event, listener)
    {
        const listeners = this.listeners.get(event)
        if(!listeners)
            return

        listeners.delete(listener)
        if(listeners.size === 0)
            this.listeners.delete(event)
    }

    emit(event, ...args)
    {
        this.listeners.get(event)?.forEach((listener) => listener(...args))
    }
}

export default UIBridge
