// Content for the About panel (sources/UI/components/panels/AboutPanel.vue)
// and, for name/role only, the Resume panel. Source of truth for layout is
// the Figma "Build Now" About Me HUD design -- see AboutPanel.vue.

export default {
    name: 'Jefferson F. Laspiñas',
    role: 'Frontend-Backend Developer',
    status: 'Available',

    hero: {
        greeting: 'Hello!',
        bio: [
            'I\'m a Computer Science student at the University of the Immaculate Conception (UIC) who enjoys turning ideas into meaningful tech experiences. I\'m passionate about software development, web technologies, 3D and interactive experiences, and emerging technologies. My love for games also inspires me to explore immersive interfaces and create projects that are engaging, intuitive, and fun to use.',
            'I\'m continuously learning about artificial intelligence, cybersecurity, and blockchain while exploring new technologies and building projects that challenge my skills and creativity. For me, development is more than just writing code—it\'s about creating, experimenting, solving problems, and bringing ideas to life.'
        ],
        avatarImage: '/avatar.jpg'
    },

    quickInfo: [
        { label: 'Location', value: 'Philippines' },
        { label: 'School', value: 'University of the Immaculate Conception' },
        { label: 'College Year', value: '2nd Year' },
        { label: 'Education', value: 'BS Computer Science' }
    ],

    skills: [
        { group: 'programming languages', items: [ 'Java', 'JavaScript', 'HTML5', 'CSS3', 'SQL (Basic)' ] },
        { group: 'tools & platforms', items: [ 'Git', 'GitHub', 'VS Code', 'Figma', 'Canva', 'Photoshop' ] },
        { group: 'networking & IT', items: [ 'Computer Hardware Servicing', 'LAN/WAN Configuration', 'Network Troubleshooting', 'Software Installation', 'System Maintenance', 'Technical Support' ] },
        { group: 'professional skills', items: [ 'UI/UX Design', 'Quality Assurance (QA)', 'Responsive Web Design', 'Problem Solving', 'Communication', 'Photo Editor' ] }
    ],

    projects: [
        {
            num: 'Project 01',
            title: 'Interactive 3D Portfolio',
            desc: 'A custom portfolio experience built with 3D visuals, animated transitions, and interactive navigation.',
            tags: [ 'Three.js', 'Vue.js', 'GSAP' ],
            image: '/3D.png',
            imageAlt: 'Screenshot of the custom 3D portfolio experience',
            liveUrl: 'https://yknowjeff.github.io/',
            repoUrl: 'https://github.com/Yknowjeff/Yknowjeff.github.io'
        },
        {
            num: 'Project 02',
            title: 'Onsite Event Registration System',
            desc: 'A desktop app for walk-in event registration, attendee check-in, and queue management.',
            tags: [ 'Java', 'Swing', 'JSON' ],
            image: '/projects/onsite-event-registration-system.png',
            imageAlt: 'Screenshot of an event registration desktop app',
            liveUrl: '',
            repoUrl: 'https://github.com/ionlyknows/OnsiteRegistrationSystem-2025'
        },
        {
            num: 'Project 03',
            title: 'GDG on Campus Website QA',
            desc: 'Performed pre-launch QA to identify UI inconsistencies, usability issues, and functional bugs.',
            tags: [ 'Manual Testing', 'Figma', 'Browser DevTools' ],
            image: '/Guilds.png',
            imageAlt: 'Screenshot of the GDG on Campus website QA project',
            liveUrl: 'https://guilds.uic.edu.ph/',
            repoUrl: ''
        }
    ],

    activities: [
        {
            num: '01',
            title: 'Fashion Blog',
            role: 'Developer',
            year: '2026',
            desc: 'Created a fashion blog page to showcase editorial content with structured layout and visual hierarchy.',
            url: 'https://yknowjeff.github.io/Prelim/Fashion%20Blog/'
        },
        {
            num: '02',
            title: 'Wine Festival Schedule',
            role: 'Developer',
            year: '2026',
            desc: 'Built a schedule page for a wine festival, presenting sessions and event details in a clean, accessible format.',
            url: 'https://yknowjeff.github.io/Prelim/Wine%20Festival%20Schedule/'
        },
        {
            num: '03',
            title: 'Davies Burger Menu',
            role: 'Developer',
            year: '2026',
            desc: 'Designed a restaurant menu page for a burger concept with a polished product presentation and navigation.',
            url: 'https://yknowjeff.github.io/Prelim/Davies%20Burger/'
        }
    ],

    experience: [
        {
            period: '2025 — Present',
            title: 'Computer Science Student',
            place: 'University of the Immaculate Conception',
            desc: 'Studying software development, algorithms, data structures, web systems, and project design while building practical applications.'
        },
        {
            period: '2026 — Present',
            title: 'Secretary',
            place: 'Google Developer Groups on Campus (GDG on Campus) — University of the Immaculate Conception',
            bullets: [
                'Maintain organizational records, meeting minutes, documents, and official communications.',
                'Coordinate schedules, announcements, and correspondence for events, workshops, and team activities.',
                'Support the planning and documentation of technical events and collaborative activities within the campus developer community.'
            ]
        },
        {
            period: '2026 — Present',
            title: 'Core QA Team',
            place: 'Google Developer Groups on Campus (QA Team) — University of the Immaculate Conception',
            bullets: [
                'Conduct website testing to identify UI inconsistencies, usability issues, and functional bugs.',
                'Support quality improvements and ensure a smooth user experience before launch.'
            ]
        }
    ],

    achievements: [
        {
            year: '2026',
            label: 'Introduction to Generative AI',
            imageUrl: '/certificates/introduction-to-generative-ai.jpg',
            imageAlt: 'Introduction to Generative AI certificate',
            issuer: 'Google Cloud',
            credentialId: 'LNHLUKO4UAKP',
            credentialUrl: 'https://www.coursera.org/account/accomplishments/verify/LNHLUKO4UAKP?utm_source=ln&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course'
        },
        {
            year: '2026',
            label: 'Generative AI for Everyone',
            imageUrl: '/certificates/generative-ai-for-everyone.jpg',
            imageAlt: 'Generative AI certificate',
            issuer: 'DeepLearning.AI',
            credentialId: 'ZP56F8AY9LKP',
            credentialUrl: 'https://www.coursera.org/account/accomplishments/verify/ZP56F8AY9LKP?utm_source=ln&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course'
        },
        {
            year: '2026',
            label: 'Foundations of Cybersecurity',
            imageUrl: '/certificates/foundations-of-cybersecurity.jpg',
            imageAlt: 'Cybersecurity certificate',
            issuer: 'Google',
            credentialId: 'X5JDV6EK6IWR',
            credentialUrl: 'https://www.coursera.org/account/accomplishments/verify/X5JDV6EK6IWR?utm_source=ln&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course'
        },
        {
            year: '2026',
            label: 'Connect and Protect',
            imageUrl: '/certificates/connect-and-protect.jpg',
            imageAlt: 'Connect and Protect certificate',
            issuer: 'Google',
            credentialId: '5FIDD6BW4BZB',
            credentialUrl: 'https://www.coursera.org/account/accomplishments/verify/5FIDD6BW4BZB?utm_source=ln&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course'
        },
        {
            year: '2026',
            label: 'Artificial Intelligence',
            imageUrl: '/certificates/introduction-to-ai.jpg',
            imageAlt: 'Artificial Intelligence certificate',
            issuer: 'IBM',
            credentialId: '6BKXRXP9DO25',
            credentialUrl: 'https://www.coursera.org/account/accomplishments/verify/6BKXRXP9DO25?utm_source=ln&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course'
        }
    ],

    education: {
        school: 'University of the Immaculate Conception',
        degree: 'Bachelor of Science in Computer Science',
        period: '2025 — Present'
    },

    resumeCta: {
        heading: 'Want the complete picture?',
        text: 'Download my resume for a concise overview of my skills, projects, experience, and academic background.',
        buttonLabel: 'Download Resume',
        path: '/resume.pdf'
    },

    contact: {
        heading: 'Let\'s Build Something.',
        subheading: 'Have an idea? Let\'s talk.',
        email: 'its.jeffersonlaspinas@gmail.com',
        github: 'https://github.com/ionlyknows',
        linkedin: 'https://www.linkedin.com/in/jefferson-laspi%C3%B1as-b5463139a/',
        facebook: 'https://www.facebook.com/its.laspinasjefferson'
    }
}
