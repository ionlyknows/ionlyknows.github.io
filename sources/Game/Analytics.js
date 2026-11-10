// FR-17 / BR-10: GoatCounter (privacy-friendly, no cookies, no personal data).
// The site code comes from VITE_GOATCOUNTER_CODE; when it is empty this does nothing.
// No Three.js here: the phone 2D view imports this file too.
const CODE = (import.meta.env.VITE_GOATCOUNTER_CODE || '').trim()

let ready = null

function load()
{
    if(!CODE)
        return null

    if(!ready)
    {
        ready = new Promise((resolve) =>
        {
            const script = document.createElement('script')
            script.async = true
            script.src = 'https://gc.zgo.at/count.js'
            script.dataset.goatcounter = `https://${CODE}.goatcounter.com/count`
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.head.append(script)
        })
    }
    return ready
}

// track('project_open', { id: 'gdg-qa' }) → event "project_open/gdg-qa"
export function track(event, data = {})
{
    const loading = load()
    if(!loading)
        return

    const value = Object.values(data)[0]
    loading.then((loaded) =>
    {
        try
        {
            if(loaded)
                window.goatcounter?.count?.({ path: value ? `${event}/${value}` : event, title: event, event: true })
        }
        catch {}
    })
}

// Page view (count.js counts it on load)
export function initAnalytics()
{
    load()
}
