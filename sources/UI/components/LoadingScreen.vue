<template>
    <div class="iw-loading" role="status" aria-live="polite" aria-label="Loading portfolio">
        <div class="iw-loading__content">
            <p class="iw-loading__eyebrow">// initializing portfolio</p>
            <p class="iw-loading__title">Loading World</p>
            <div class="iw-loading__track" aria-hidden="true"><span /></div>
        </div>
    </div>
</template>

<style scoped>
.iw-loading
{
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    z-index: 100;
    background: radial-gradient(circle at 50% 35%, #172b39 0%, #080d16 48%, #03060c 100%);
    color: var(--iw-text, #efffff);
}

.iw-loading__content
{
    width: min(300px, calc(100vw - 48px));
}

.iw-loading__eyebrow
{
    margin: 0 0 10px;
    color: #8ffbff;
    font-family: var(--iw-font-mono, monospace);
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
}

.iw-loading__title
{
    margin: 0 0 20px;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.iw-loading__track
{
    height: 2px;
    overflow: hidden;
    background: rgba(143, 251, 255, 0.2);
}

.iw-loading__track span
{
    display: block;
    width: 42%;
    height: 100%;
    background: #ff2e63;
    animation: iw-loading-sweep 1.15s ease-in-out infinite;
}

@keyframes iw-loading-sweep
{
    from { transform: translateX(-110%); }
    to { transform: translateX(350%); }
}
</style>
