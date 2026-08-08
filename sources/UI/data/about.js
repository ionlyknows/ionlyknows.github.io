// Content for the About panel (sources/UI/components/panels/AboutPanel.vue)
// and, for name/role only, the Resume panel. Source of truth for layout is
// the Figma "Build Now" About Me HUD design -- see AboutPanel.vue.

export default {
    name: 'Jefferson F. LaspiÃ±as',
    role: 'Creative Developer',
    status: 'Available',

    hero: {
        greeting: 'Hello!',
        bio: [
            'I\'m a Computer Science student and creative developer interested in building interactive websites, applications, and digital experiences.',
            'I enjoy combining programming, design, and interactive technologies to create projects that are both functional and engaging.'
        ],
        avatarCaption: 'CS Student'
    },

    quickInfo: [
        { label: 'Location', value: 'Philippines' },
        { label: 'Education', value: 'Bachelor of Science in Computer Science' },
        { label: 'Focus', tags: [ 'Web Development', 'Interactive Experiences', 'UI/UX', 'Creative Technology' ] }
    ],

    skills: [
        { group: 'development', items: [ 'JavaScript', 'HTML', 'CSS', 'Java', 'Vue.js' ] },
        { group: '3d / interactive', items: [ 'Three.js', 'WebGL', 'WebGPU', 'GSAP' ] },
        { group: 'tools', items: [ 'Git', 'GitHub', 'VS Code', 'Figma' ] }
    ],

    // Independent from sources/UI/data/projects.js (which drives the Work
    // billboard) -- About tells the same story in its own scrollable list,
    // per the Figma design. Swap `image` for local screenshots when ready;
    // these are placeholder Unsplash photos carried over from the design file.
    //
    // liveUrl / repoUrl: PLACEHOLDERS. Leave as '' until you have the real
    // link -- AboutPanel.vue hides a project's Live Site / Repository button
    // whenever its URL is empty (renders a disabled state instead), so an
    // empty string never produces a dead or fake link. Fill these in with
    // your actual deployed URL and GitHub repo URL when ready.
    projects: [
        {
            num: 'Project 01',
            title: '3D Interactive Portfolio',
            desc: 'An immersive 3D portfolio experience designed around exploration and interaction.',
            tags: [ 'Three.js', 'WebGL', 'JavaScript' ],
            image: 'https://images.unsplash.com/photo-1760008486593-a85315610136?w=600&h=360&fit=crop&auto=format',
            imageAlt: '3D abstract shapes representing an interactive portfolio',
            liveUrl: '',
            repoUrl: ''
        },
        {
            num: 'Project 02',
            title: 'Event Registration System',
            desc: 'Desktop application for managing walk-in registration and attendee check-ins.',
            tags: [ 'Java', 'Swing', 'JSON' ],
            image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=600&h=360&fit=crop&auto=format',
            imageAlt: 'Dashboard monitoring screen for event management',
            liveUrl: '',
            repoUrl: ''
        },
        {
            num: 'Project 03',
            title: 'Canteen Ordering System',
            desc: 'Desktop ordering application designed to simplify canteen transactions.',
            tags: [ 'Java', 'GUI' ],
            image: 'https://images.unsplash.com/photo-1760888549280-4aef010720bd?w=600&h=360&fit=crop&auto=format',
            imageAlt: 'Food ordering app on a smartphone',
            liveUrl: '',
            repoUrl: ''
        }
    ],

    activities: [
        {
            num: '01',
            title: 'University Event',
            role: 'Organizer / Contributor',
            year: '2026',
            desc: 'Participated in planning and coordinating university activities while working with different teams.'
        },
        {
            num: '02',
            title: 'Programming Activity',
            role: 'Participant / Developer',
            year: '2026',
            desc: 'Participated in programming activities involving problem solving, development, and collaboration.'
        },
        {
            num: '03',
            title: 'Community Activity',
            role: 'Participant',
            year: '2026',
            desc: 'Participated in collaborative school and community-oriented activities.'
        }
    ],

    experience: [
        {
            period: '2026 â€” Present',
            title: 'Computer Science Student',
            place: 'University of the Immaculate Conception',
            desc: 'Developing software projects and studying programming, algorithms, data structures, web development, and software engineering.'
        }
    ],

    // Placeholders, per the Figma spec ("use placeholders where actual
    // information is unavailable, do not invent achievements").
    achievements: [
        { year: '2026', label: 'Programming / Academic Achievement' },
        { year: '2026', label: 'Project Recognition' },
        { year: '2026', label: 'Competition / Event' },
        { year: '2026', label: 'Certification' }
    ],

    education: {
        school: 'University of the Immaculate Conception',
        degree: 'Bachelor of Science in Computer Science',
        period: '2025 â€” Present'
    },

    resumeCta: {
        heading: 'Want the complete picture?',
        text: 'Download my resume for a concise overview of my education, skills, projects, activities, achievements, and experience.',
        buttonLabel: 'Download Resume',
        path: '/resume.pdf'
    },

    contact: {
        heading: 'Let\'s Build Something.',
        subheading: 'Have an idea? Let\'s talk.',
        email: 'your-email@example.com',
        github: 'https://github.com/yourusername',
        linkedin: 'https://linkedin.com/in/yourusername'
    }
}
