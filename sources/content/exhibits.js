// Labels on 3D exhibits (M6): station room signs, the hangar console, the featured-build board, the goals console and
// the hologram. Text only; the content itself comes from the other content files.
export default {
    rooms: { projects: 'Projects', certificates: 'Certificates', photos: 'Photos', skills: 'Skills', hangar: 'Hangar', cupola: 'Cupola' },
    // Generic stencil labels on the station's racks and hatches (decoration, no agency names)
    labels: [ 'STOWAGE A1', 'STOWAGE B4', 'LIFE SUPPORT', 'O2 SUPPLY', 'FIRE PORT', 'POWER BUS 2', 'CAUTION HOT', 'HANDHOLD' ],
    hangar: { console: 'Destinations' }, // M6b: the hangar console (opens the destination picker)
    featured: { eyebrow: 'How I build', problem: 'Problem', outcome: 'Outcome', architecture: 'Architecture', frontend: 'Frontend', backend: 'Backend', database: 'Database', deployment: 'Deployment' },
    goals: { title: 'Where I\'m going', currentlyLearning: 'Currently learning', next: 'Next', goal: 'Goal' },
    // Hologram bodies that are not locations (names only; locations use locations.js)
    hologram: { sun: { name: 'Sun', description: '' }, earth: { name: 'Earth', description: '' } }
}
