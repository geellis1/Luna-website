// Site copy lives here so it can be edited without touching layout code.
// Any string wrapped in [square brackets] is placeholder copy: it renders
// highlighted in chartreuse until it's replaced with the final text.

export const pillars = [
  {
    title: 'First-Hand Experience',
    description: '[Full description from existing site]',
  },
  {
    title: 'An equity lens that is integrated, not an afterthought',
    description: '[Full description from existing site]',
  },
  {
    title: 'Intelligence-driven strategy',
    description: '[Full description from existing site]',
  },
  {
    title: 'Movement Awareness',
    description: '[Full description from existing site]',
  },
]

export const tiers = [
  {
    id: 'begin',
    label: 'Begin',
    kind: 'Training',
    summary: 'Trainings built on a foundation of experience, evidence, and equity.',
    description: '[Full BEGIN description from existing site]',
    listHeading: 'Signature offerings',
    items: ['[Signature offering]', '[Signature offering]', '[Signature offering]'],
  },
  {
    id: 'build',
    label: 'Build',
    kind: 'Project-based',
    summary: 'Project-based engagements to design or bolster your advocacy.',
    description: '[Full BUILD description from existing site]',
    listHeading: 'Engagements include',
    items: ['[Engagement]', '[Engagement]', '[Engagement]', '[Engagement]'],
  },
  {
    id: 'sustain',
    label: 'Sustain',
    kind: 'Retainer',
    summary: 'Retainer-based engagements for consistent thought partnership.',
    description: '[Full SUSTAIN description from existing site]',
    listHeading: 'Retainers include',
    items: ['[Retainer offering]', '[Retainer offering]', '[Retainer offering]'],
  },
]

export const bio = [
  '[Kelli bio paragraph 1, from existing site]',
  '[Kelli bio paragraph 2, from existing site]',
  '[Kelli bio paragraph 3, from existing site]',
]

// Keep in sync with the checkbox values the contact API accepts (api/contact.ts).
export const serviceOptions = [
  'Training',
  'Project-based Consulting',
  'Sustained Engagement',
  'Not sure yet',
]

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
]
