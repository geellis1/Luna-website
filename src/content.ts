// Site copy lives here so it can be edited without touching layout code.
// Any string wrapped in [square brackets] is placeholder copy: it renders
// highlighted in chartreuse until it's replaced with the final text.

export const pillars = [
  {
    title: 'First-Hand Experience',
    description:
      'Built and led legislative advocacy work for a statewide gender equity nonprofit in one of the most conservative legislatures in the country.',
  },
  {
    title: 'An equity lens that is integrated, not an afterthought',
    description: '[Description coming soon]',
  },
  {
    title: 'Intelligence-driven strategy',
    description:
      'Customized legislative tools that give clients a strategic edge and enhance efforts using lawmaker analysis, committee intelligence, and predictive insight.',
  },
  {
    title: 'Movement Awareness',
    description:
      "This work doesn't happen in a vacuum. Every engagement is informed by an understanding of where social movements are, where power is shifting, and what that means for the strategy in front of us. We build for the moment we're in and the one that's coming.",
  },
]

export const tiers = [
  {
    id: 'begin',
    label: 'Begin',
    kind: 'Training',
    summary: 'Trainings built on a foundation of experience, evidence, and equity.',
    description:
      'For organizations ready to learn how this works, your team gets the foundational knowledge and practical skills to engage in policy advocacy with confidence. Understanding the legislative process, knowing what your organization can and can’t do, developing organizational positions, crafting testimony, and building the relationships that actually matter.',
    listHeading: 'Signature offerings',
    items: ['Mission to Movement', 'Inside the Capitol', 'Custom trainings available upon request'],
  },
  {
    id: 'build',
    label: 'Build',
    kind: 'Project-based',
    summary: 'Project-based engagements to design or bolster your advocacy.',
    description:
      'For organizations ready to go deeper, we work alongside you to build or sharpen your advocacy strategy. We start with your specific context: your issue, your relationships, your political environment, and your capacity. Then we build something that fits.',
    listHeading: 'This might look like',
    items: [
      'Advocacy program design from the ground up',
      'Bill risk/reward analysis and campaign strategy',
      'Power mapping and legislator landscape analysis',
      'Coalition structure, facilitation, and shared agenda-setting',
      'Constituent base activation',
      'Data-to-action translation',
    ],
  },
  {
    id: 'sustain',
    label: 'Sustain',
    kind: 'Retainer',
    summary: 'Retainer-based engagements for consistent thought partnership.',
    description:
      'For organizations that need a seasoned partner in their corner, not just at the start, but all the way through. You get consistent access, real-time guidance, and a strategist who knows your work well enough to move with you when things shift.',
    listHeading: 'What’s included',
    items: [
      'Regular strategy sessions tailored to your priorities',
      'Access to Luna Civic Strategies legislative intelligence tools',
      'Strategic guidance and issue monitoring during active legislative periods',
      'Committee analysis and lawmaker landscape briefings',
      'Coaching and preparation for testimony, meetings, and public engagement',
    ],
  },
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

// The full intro paragraph (the homepage intro's original long copy), kept
// for future use
export const introLongCopy =
  'Progress is possible in even the most unlikely places, but it requires more than good intentions. It takes unwavering vision. It takes strategy grounded in lived experience. It takes technology to modernize movements. It takes commitment to the long game. And it takes someone who has been inside this work, not advising from a distance.'
