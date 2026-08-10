<template>
    <aside class="iw-certificate-hint" :class="{ 'iw-certificate-hint--above': above }" role="status" aria-live="polite">
        <img class="iw-certificate-hint__ghost" src="/social/Ghost.png" alt="" />
        <p>{{ message }}</p>
    </aside>
</template>

<script setup>
defineProps({
    message: { type: String, required: true },
    above: { type: Boolean, default: false }
})
</script>

<style scoped>
.iw-certificate-hint
{
    position: fixed;
    right: max(24px, env(safe-area-inset-right));
    top: 50%;
    display: flex;
    align-items: center;
    gap: 12px;
    width: min(315px, calc(100vw - 40px));
    padding: 12px 18px 12px 10px;
    border: 1px solid rgba(255, 193, 120, 0.52);
    border-radius: 16px;
    background: rgba(11, 15, 20, 0.9);
    box-shadow: 0 14px 36px rgba(0, 0, 0, 0.34);
    color: #fff4e8;
    transform: translateY(-50%);
}

.iw-certificate-hint__ghost
{
    width: 62px;
    height: 62px;
    flex: 0 0 auto;
    object-fit: contain;
}

.iw-certificate-hint p
{
    margin: 0;
    font: 700 13px/1.35 var(--iw-font-mono);
    letter-spacing: 0.055em;
}

.iw-certificate-hint--above
{
    top: calc(50% - 94px);
}

.iw-certificate-hint-enter-active,
.iw-certificate-hint-leave-active
{
    transition: opacity 0.62s var(--iw-ease), transform 0.82s var(--iw-ease);
}

.iw-certificate-hint-enter-from,
.iw-certificate-hint-leave-to
{
    opacity: 0;
    transform: translate(120%, -50%);
}

@media (max-width: 640px)
{
    .iw-certificate-hint
    {
        top: auto;
        bottom: 84px;
        right: 16px;
        transform: none;
    }

    .iw-certificate-hint-enter-from,
    .iw-certificate-hint-leave-to
    {
        transform: translateX(120%);
    }

    .iw-certificate-hint--above
    {
        top: auto;
        bottom: 172px;
    }
}
</style>
