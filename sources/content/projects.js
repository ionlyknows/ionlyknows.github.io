// The only place project data lives. Empty fields are hidden (BR-07);
// a project without title or summary is not shown at all.
// Optional (M6, The Forge's featured-build exhibit): problem, outcome,
// architecture: { frontend, backend, database, deployment }. Filled only from data already here
// (the stack); everything else stays empty until Jefferson writes it.
export default [
    {
        id: 'interactive-3d-portfolio',
        title: 'Interactive 3D Portfolio',
        summary: 'A custom portfolio experience with 3D visuals, animated transitions, and interactive navigation.',
        description: 'An interactive 3D portfolio that combines immersive visuals, polished UI, and smooth navigation to showcase creative development work.',
        role: 'Creative Developer',
        stack: [ 'Three.js', 'Vue.js', 'GSAP' ],
        keyFeatures: [ '3D world exploration', 'Animated transitions', 'Interactive navigation' ],
        media: {
            type: 'video',
            src: '/media/projects/world.mp4',
            poster: '/media/projects/3d-portfolio.webp',
            alt: 'Interactive 3D Portfolio world demonstration'
        },
        repoUrl: '',
        demoUrl: '',
        status: 'Live',
        featured: true,
        order: 1,
        problem: '',
        outcome: '',
        architecture: { frontend: 'Three.js · Vue.js · GSAP', backend: '', database: '', deployment: '' }
    },
    {
        id: 'onsite-event-registration-system',
        title: 'Onsite Event Registration System',
        summary: 'Manage, organize, and track on-site event registration and attendee records.',
        description: 'On-Site Event Registration System is a system designed for managing on-site event registration and tracking attendee records. It allows staff to efficiently register attendees, record their information, monitor registration status, and manage attendee records throughout the event.',
        role: 'Developer',
        stack: [ 'Java', 'Swing', 'JSON' ],
        keyFeatures: [ 'Attendee registration', 'Check-in tracking', 'Record management' ],
        media: {
            type: 'video',
            src: '/media/projects/onsite.mp4',
            poster: '/media/projects/onsite-event-registration-system.webp',
            alt: 'Onsite Event Registration System demonstration'
        },
        repoUrl: 'https://github.com/ionlyknows/OnsiteRegistrationSystem-2025',
        demoUrl: 'https://drive.google.com/file/d/1sMgAcB-Ov99gvSC_WX1v8r-GWxa8QfVJ/view',
        status: 'Completed',
        featured: true,
        order: 2,
        problem: '',
        outcome: '',
        architecture: { frontend: 'Swing', backend: 'Java', database: 'JSON', deployment: '' }
    },
    {
        id: 'gdg-qa',
        title: 'GDG on Campus Website QA',
        summary: 'Pre-launch website QA to identify UI inconsistencies, usability issues, and functional bugs.',
        description: 'QA work for the GDG on Campus website, including usability testing and functional verification before launch.',
        role: 'QA Tester',
        stack: [ 'Manual Testing', 'Figma', 'Browser DevTools' ],
        keyFeatures: [ 'UI review', 'Usability testing', 'Functional validation' ],
        media: {
            type: 'video',
            src: '/media/projects/gdg-qa.mp4',
            poster: '/media/projects/gdg-qa.webp',
            alt: 'GDG on Campus website QA demonstration'
        },
        repoUrl: '',
        demoUrl: 'https://drive.google.com/file/d/1taHoPhAJQBGC4hRNDBNudTvpGzq68a5g/view',
        status: 'Live',
        featured: true,
        order: 3
    },

    // TBD: Jefferson fills these in later. Hidden until title + summary exist.
    { id: 'sourcerer-crusade', title: '', summary: '', description: '', role: '', stack: [], keyFeatures: [], media: null, repoUrl: '', demoUrl: '', status: '', featured: false, order: null },
    { id: 'requisito', title: '', summary: '', description: '', role: '', stack: [], keyFeatures: [], media: null, repoUrl: '', demoUrl: '', status: '', featured: false, order: null },
    { id: 'payroll-system', title: '', summary: '', description: '', role: '', stack: [], keyFeatures: [], media: null, repoUrl: '', demoUrl: '', status: '', featured: false, order: null }
]
