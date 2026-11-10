// Boot: decide the device FIRST, then load only what it needs (BR-01, NFR-03).
// Phones/tablets (coarse pointer AND no hover) and browsers without WebGL 2 get the
// Vue 2D view; everything in Game/ (and Three.js) is a separate chunk for desktop only.
const isPhone = window.matchMedia('(pointer: coarse)').matches && window.matchMedia('(hover: none)').matches

function hasWebGL2()
{
    try
    {
        const context = document.createElement('canvas').getContext('webgl2')
        context?.getExtension('WEBGL_lose_context')?.loseContext()
        return !!context
    }
    catch
    {
        return false
    }
}

if(isPhone || !hasWebGL2())
    import('./UI/mobile.js').then(({ createMobileApp }) => createMobileApp())
else
    import('./desktop.js')
