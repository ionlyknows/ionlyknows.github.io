// Planet layout. Positions on a planet are { lat, long } in degrees.
// Content points reference panels by type; the UI resolves the text.
export default [
    {
        id: 'forge',
        name: 'The Forge',
        center: [ 0, 0, 0 ],
        radius: 20,
        color: '#ff8a3d',
        landingPoint: { lat: 0, long: 0 },
        contentPoints: [
            { id: 'work', position: { lat: 0, long: 22 }, opens: 'work' }
        ],
        // type: 'rock' | 'crystal'; size = collider radius (world units)
        props: [
            { type: 'rock', position: { lat: 12, long: -14 }, size: 1.4 },
            { type: 'rock', position: { lat: -35, long: 60 }, size: 1.1 },
            { type: 'rock', position: { lat: 50, long: 150 }, size: 1.6 },
            { type: 'rock', position: { lat: -70, long: -110 }, size: 1.2 },
            { type: 'crystal', position: { lat: -14, long: 30 }, size: 0.9 },
            { type: 'crystal', position: { lat: 65, long: -60 }, size: 1.1 },
            { type: 'crystal', position: { lat: -5, long: 175 }, size: 1 }
        ]
    }
]
