// Planet layout. Positions on a planet are { lat, long } in degrees.
// Names/descriptions live in sources/content/locations.js (same ids).
// Content points reference panels by type; the UI resolves the text.
// Prop types: rock, crystal, antenna, panel, telescope, floatingCrystal, monument, banner, duck, dish,
// exhibit, console, worker (State/PropShapes.js).
// eggs: easter eggs (M4, BR-11), interactive like content points but without a beacon.
// M6: featured (The Forge's featured-build exhibit), activities (one banner per activity in
// content/activities.js, from `start` in `step`s), workers (ambient crew standing at work), goals
// (The Observatory's goals console). `facing` is the { lat, long } the object turns toward.
// Prop size = collider radius (world units).
// M6b: `kind: 'station'` = Apeiron Station, the orbital museum. It has no surface: `center` is the
// layout position of its interior's origin (State/InteriorLayout.js, the planar walking floor),
// `radius` its core modules (routes keep clear of them), `reach` the solar arrays' tips.
export default [
    {
        id: 'station',
        kind: 'station',
        center: [ 67, 54, - 26 ], // orbit: 219.5 from Earth's centre (≈ 45° wide from here, about half the view through the +X windows)
        radius: 30,
        reach: 50,
        mapRadius: 15,
        color: '#c9d3df',
        accent: '#6fd6ff'
    },
    {
        // Signal Moon (the M1–M6 Home Station planetoid): About, Contact, the "Signal from home" dish
        id: 'moon',
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
            { type: 'rock', position: { lat: - 35, long: 60 }, size: 0.6 },
            { type: 'dish', position: { lat: 15, long: 130 }, size: 1 } // easter egg: faces Earth, far from the beacons
        ],
        eggs: [ { id: 'signal', position: { lat: 15, long: 130 } } ]
    },
    {
        id: 'forge',
        center: [ - 150, 30, - 60 ],
        radius: 20,
        color: '#ff8a3d',
        accent: '#ff9d5c',
        landingPoint: { lat: 0, long: 0 },
        launchPad: { lat: - 20, long: - 12 },
        contentPoints: [], // M6: projects live in the station; The Forge tells "How I build"
        featured: { position: { lat: 4, long: 24 }, facing: { lat: 0, long: 0 } },
        activities: { start: { lat: - 18, long: 0 }, step: { lat: 0, long: 11 }, facing: { lat: 0, long: 0 } },
        workers: [ { position: { lat: 12, long: 13 }, facing: { lat: 4, long: 24 } }, { position: { lat: - 6, long: 40 }, facing: { lat: - 14, long: 30 } } ],
        props: [
            { type: 'rock', position: { lat: 12, long: - 14 }, size: 1 },
            { type: 'rock', position: { lat: - 35, long: 60 }, size: 0.8 },
            { type: 'rock', position: { lat: 50, long: 150 }, size: 1.2 },
            { type: 'rock', position: { lat: - 70, long: - 110 }, size: 0.9 },
            { type: 'crystal', position: { lat: - 14, long: 30 }, size: 0.9 },
            { type: 'crystal', position: { lat: 65, long: - 60 }, size: 1.1 },
            { type: 'crystal', position: { lat: - 5, long: 175 }, size: 1 },
            { type: 'duck', position: { lat: 12, long: - 165 }, size: 1 } // easter egg: on the dark side
        ],
        eggs: [ { id: 'duck', position: { lat: 12, long: - 165 } } ]
    },
    {
        id: 'observatory',
        center: [ 60, - 60, - 170 ],
        radius: 18,
        color: '#2a9d8f',
        accent: '#5ff2e0',
        landingPoint: { lat: 0, long: 0 },
        launchPad: { lat: - 24, long: - 10 },
        contentPoints: [], // M6: skills live in the station; The Observatory tells "Where I'm going"
        goals: { position: { lat: 10, long: - 22 }, facing: { lat: 0, long: 0 } },
        // Kept flat and empty for the M7 exploration stations (no props here)
        reserved: { telescope: { lat: 5, long: 24 }, rover: { lat: - 18, long: 18 }, lab: { lat: 26, long: 22 }, radioDish: { lat: - 12, long: - 30 } },
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
    }
]

// Non-walkable Earth: Apeiron Station orbits above it (fixed relative to Earth, whose clouds drift
// beneath it), the Philippines beacon below the station. Same direction from the station as before
// the 2.5× size-up; far enough that the station's whole reach (arrays included) clears Earth's
// atmosphere shell (1.05 × radius) by 80, over 25% of the station's 100 size
export const earth = {
    center: [ 265, - 13, - 93 ],
    radius: 85,
    beacon: { lat: 12.88, long: 121.77 } // Philippines
}

export const spawnPlanetId = 'station' // M6b: visitors start docked in the station's hangar

// Direction toward the sun (world space, normalized in State/Planets.js). Every landing
// point, content point and launch pad sits on the day side (long within ±35° of +Z).
export const sunDirection = [ - 0.3, 0.25, 0.92 ]
