// Planet layout. Positions on a planet are { lat, long } in degrees.
// Names/descriptions live in sources/content/locations.js (same ids).
// Content points reference panels by type; the UI resolves the text.
// Prop types: rock, crystal, antenna, panel, telescope, floatingCrystal, monument, banner.
// Prop size = collider radius (world units).
export default [
    {
        id: 'station',
        center: [ 0, 0, 0 ],
        radius: 14,
        color: '#9aa6b5',
        accent: '#6fd6ff',
        landingPoint: { lat: 0, long: 0 },
        launchPad: { lat: - 28, long: 8 },
        contentPoints: [
            { id: 'about', position: { lat: 0, long: 32 }, opens: 'about' },
            { id: 'contact', position: { lat: 28, long: - 22 }, opens: 'contact' }
        ],
        props: [
            { type: 'antenna', position: { lat: 38, long: - 40 }, size: 0.7 }, // signal tower by Contact
            { type: 'antenna', position: { lat: - 40, long: 120 }, size: 0.7 },
            { type: 'panel', position: { lat: 12, long: 75 }, size: 1 },
            { type: 'panel', position: { lat: - 10, long: - 70 }, size: 1 },
            { type: 'panel', position: { lat: 55, long: 150 }, size: 1 },
            { type: 'rock', position: { lat: - 65, long: - 20 }, size: 0.8 },
            { type: 'rock', position: { lat: 20, long: - 150 }, size: 0.7 },
            { type: 'rock', position: { lat: - 35, long: 60 }, size: 0.6 }
        ]
    },
    {
        id: 'forge',
        center: [ - 150, 30, - 60 ],
        radius: 20,
        color: '#ff8a3d',
        accent: '#ff9d5c',
        landingPoint: { lat: 0, long: 0 },
        launchPad: { lat: - 20, long: - 12 },
        contentPoints: [
            { id: 'work', position: { lat: 0, long: 22 }, opens: 'work' }
        ],
        props: [
            { type: 'rock', position: { lat: 12, long: - 14 }, size: 1 },
            { type: 'rock', position: { lat: - 35, long: 60 }, size: 0.8 },
            { type: 'rock', position: { lat: 50, long: 150 }, size: 1.2 },
            { type: 'rock', position: { lat: - 70, long: - 110 }, size: 0.9 },
            { type: 'crystal', position: { lat: - 14, long: 30 }, size: 0.9 },
            { type: 'crystal', position: { lat: 65, long: - 60 }, size: 1.1 },
            { type: 'crystal', position: { lat: - 5, long: 175 }, size: 1 }
        ]
    },
    {
        id: 'observatory',
        center: [ 60, - 60, - 170 ],
        radius: 18,
        color: '#2a9d8f',
        accent: '#5ff2e0',
        landingPoint: { lat: 0, long: 0 },
        launchPad: { lat: - 24, long: - 10 },
        contentPoints: [
            { id: 'skills', position: { lat: 5, long: 24 }, opens: 'skills' }
        ],
        props: [
            { type: 'telescope', position: { lat: 20, long: - 30 }, size: 1 },
            { type: 'telescope', position: { lat: - 30, long: 40 }, size: 1.1 },
            { type: 'telescope', position: { lat: 50, long: 120 }, size: 1 },
            { type: 'floatingCrystal', position: { lat: 10, long: 60 }, size: 0.8 },
            { type: 'floatingCrystal', position: { lat: - 45, long: 170 }, size: 1 },
            { type: 'floatingCrystal', position: { lat: 60, long: - 80 }, size: 0.9 },
            { type: 'crystal', position: { lat: 30, long: 10 }, size: 0.7 },
            { type: 'rock', position: { lat: - 60, long: - 60 }, size: 0.8 }
        ]
    },
    {
        id: 'trophy',
        center: [ - 60, 90, 130 ],
        radius: 11,
        color: '#d9a93f',
        accent: '#ffd76a',
        landingPoint: { lat: 0, long: 0 },
        launchPad: { lat: - 35, long: - 10 },
        contentPoints: [
            { id: 'achievements', position: { lat: 0, long: 35 }, opens: 'achievements' },
            { id: 'activities', position: { lat: 35, long: - 25 }, opens: 'activities' }
        ],
        props: [
            { type: 'monument', position: { lat: 30, long: 90 }, size: 0.8 },
            { type: 'monument', position: { lat: - 40, long: 60 }, size: 0.7 },
            { type: 'monument', position: { lat: - 20, long: 160 }, size: 0.9 },
            { type: 'banner', position: { lat: 15, long: - 60 }, size: 0.5 },
            { type: 'banner', position: { lat: - 60, long: - 90 }, size: 0.5 },
            { type: 'banner', position: { lat: 60, long: 40 }, size: 0.5 },
            { type: 'rock', position: { lat: 70, long: - 150 }, size: 0.55 }
        ]
    }
]

// Non-walkable background globe near the Home Station
export const earth = {
    center: [ 117, 37, - 43 ], // in view behind the About beacon from the spawn camera
    radius: 34,
    beacon: { lat: 12.88, long: 121.77 } // Philippines
}

export const spawnPlanetId = 'station'

// Direction toward the sun (world space, normalized in State/Planets.js). Every landing
// point, content point and launch pad sits on the day side (long within ±35° of +Z).
export const sunDirection = [ - 0.3, 0.25, 0.92 ]
