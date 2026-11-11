// Easter eggs (M4, BR-11): toast text. The game logic is in sources/Game/State/Eggs.js.
// `signal` adds Jefferson's location from profile.js (hidden when empty, BR-07).
export default {
    duck: { toast: 'Bug found!' },
    signal: { toast: 'Signal from home', withLocation: true },
    dance: { toast: 'Secret dance!' },
    all: 'All secrets found',
    counter: 'secrets'
}
