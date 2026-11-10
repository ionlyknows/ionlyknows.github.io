import projects from '../content/projects.js'

// BR-07: empty string, empty array, null or missing = hidden
export const has = (value) => Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && String(value).trim() !== ''

// BR-07: a project without title or summary is not rendered.
// BR-08: featured projects first, then by `order`.
export const visibleProjects = projects
    .filter((project) => project.title && project.summary)
    .sort((a, b) => (b.featured - a.featured) || ((a.order ?? Infinity) - (b.order ?? Infinity)))
