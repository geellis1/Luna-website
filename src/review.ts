import { useSyncExternalStore } from 'react'
import { readDesign, sectionDesigns, type SectionKey } from './sectionDesigns'

// Round 2 design review: what the client can review, by page, and her
// favorites and comments.
//
// Every design has a stable key, "<section>:<design>" (e.g. "intro:a1",
// "howWeWork:a1"). Favorites and comments are stored under those keys in this
// browser (localStorage), so they survive refreshes and page changes. To
// share them, the whole review is packed into a link (/review?r=…) that opens
// a read-only summary on any browser or device; no account or server needed.

// ---------- Catalog: pages → sections → designs ----------

export type Design = {
  key: string // "<section>:<id>"
  section: SectionKey
  id: string // the design's own id (thumbnail id)
  name: string
  picks: Partial<Record<SectionKey, string>> // what previewing it sets
}
export type Section = { key: SectionKey; title: string; designs: Design[] }
export type Page = { id: string; title: string; path: string; sections: Section[] }

// Short, clear names for the panel (the full labels live in sectionDesigns)
const names: Record<string, string> = {
  'intro:a1': 'Poster Collage · Crimson',
  'intro:a2': 'Poster Collage · Powder Blue',
  'whyLuna:b': 'Editorial Typography',
  'whyLuna:c': 'Editorial Collage',
  'howWeWork:a1': 'Auto-Expanding Capsules',
  'howWeWork:a2': 'All-Open Capsules',
  'howWeWork:b': 'Rising Capsules',
  'howWeWork:c': 'Editorial Accordion',
  'cta:a': 'Rounded Invitation',
  'cta:b': 'Editorial Typography',
  'cta:c': 'Split Panel · A — Night Bordeaux Background',
  'cta:c-powder': 'Split Panel · B — Powder Blue Background',
  'aboutHeadshot:blazer': 'Houndstooth Blazer',
  'aboutHeadshot:glasses': 'Red Glasses',
  'aboutHeadshot:cardigan': 'Green Cardigan',
  'services:a': 'Option A — Horizontal Accordion',
  'services:b': 'Option B — Editorial Chapters',
  'footer:a': 'Option A — Editorial Colophon',
  'footer:b': 'Option B — Service Bands',
  'footer:c': 'Option C — Moon Wordmark',
  'bodyFont:system': 'Current — Apple System',
  'bodyFont:inter': 'Inter',
  'bodyFont:hanken': 'Hanken Grotesk',
  'bodyFont:schibsted': 'Schibsted Grotesk',
  'bodyFont:dm': 'DM Sans',
  'contact:a': 'Editorial Letter',
  'contact:b': 'Letter + Collage',
  'contact:c': 'Split Editorial',
}
// The hero and navigation are final and not offered here
const sectionTitles: Partial<Record<SectionKey, string>> = {
  cta: 'Let’s Work Together',
  ctaAbout: 'Let’s Work Together',
  ctaServices: 'Let’s Work Together',
  aboutHeadshot: 'Kelli’s Headshot',
  contact: 'Contact Page',
  services: 'Page Layout',
}

// Let's Work Together on each page, and the group holding its Option C
// backgrounds
const ctaBackgrounds = { cta: 'ctaC', ctaAbout: 'ctaAboutC', ctaServices: 'ctaServicesC' } as const
const isCta = (key: SectionKey): key is keyof typeof ctaBackgrounds => key in ctaBackgrounds

// A section's designs; How we work together's Option A is listed as its two
// versions (A1 / A2), each setting both the design and the version
function designsOf(key: SectionKey): Design[] {
  if (key === 'howWeWork') {
    return [
      ...sectionDesigns.howWeWorkA.choices.map((v) => ({
        key: `howWeWork:${v.id}`,
        section: key,
        id: v.id,
        name: names[`howWeWork:${v.id}`],
        picks: { howWeWork: 'a', howWeWorkA: v.id },
      })),
      ...sectionDesigns.howWeWork.choices
        .filter((c) => c.id !== 'a')
        .map((c) => ({
          key: `howWeWork:${c.id}`,
          section: key,
          id: c.id,
          name: names[`howWeWork:${c.id}`],
          picks: { howWeWork: c.id },
        })),
    ]
  }
  // Let's Work Together's Option C is listed as its two section backgrounds;
  // Night Bordeaux keeps C's original key, so earlier notes on C carry over
  if (isCta(key)) {
    const bgKey = ctaBackgrounds[key]
    return [
      ...sectionDesigns[key].choices
        .filter((c) => c.id !== 'c')
        .map((c) => ({ key: `${key}:${c.id}`, section: key, id: c.id, name: names[`cta:${c.id}`], picks: { [key]: c.id } })),
      ...sectionDesigns[bgKey].choices.map((v) => {
        const id = v.id === 'bordeaux' ? 'c' : `c-${v.id}`
        return { key: `${key}:${id}`, section: key, id, name: names[`cta:${id}`], picks: { [key]: 'c', [bgKey]: v.id } }
      }),
    ]
  }
  return sectionDesigns[key].choices.map((c) => ({
    key: `${key}:${c.id}`,
    section: key,
    id: c.id,
    name: names[`${key}:${c.id}`] ?? c.label,
    picks: { [key]: c.id },
  }))
}

const section = (key: SectionKey): Section => ({
  key,
  title: sectionTitles[key] ?? sectionDesigns[key].title,
  designs: designsOf(key),
})

export const pages: Page[] = [
  { id: 'home', title: 'Home', path: '/', sections: (['intro', 'whyLuna', 'howWeWork', 'cta'] as const).map(section) },
  { id: 'about', title: 'About', path: '/about', sections: [section('aboutHeadshot'), section('ctaAbout')] },
  { id: 'services', title: 'Services', path: '/services', sections: [section('services'), section('ctaServices')] },
  { id: 'contact', title: 'Contact', path: '/contact', sections: [section('contact')] },
  // On every page: previewing stays on the page being viewed (path '')
  { id: 'everywhere', title: 'Every Page', path: '', sections: [section('bodyFont'), section('footer')] },
]

export const pageForPath = (pathname: string) => pages.find((p) => p.path === pathname) ?? pages[0]

const allDesigns = pages.flatMap((p) => p.sections.flatMap((s) => s.designs.map((d) => ({ page: p, section: s, design: d }))))
export const findDesign = (key: string) => allDesigns.find((d) => d.design.key === key)

// The design of a section that's showing now
export function currentDesignKey(key: SectionKey, search: string) {
  const value = readDesign(key, search)
  if (key === 'howWeWork' && value === 'a') return `howWeWork:${readDesign('howWeWorkA', search)}`
  if (isCta(key) && value === 'c') return readDesign(ctaBackgrounds[key], search) === 'powder' ? `${key}:c-powder` : `${key}:c`
  return `${key}:${value}`
}

// ---------- Favorites and comments (this browser) ----------

export type Review = { favorites: string[]; comments: Record<string, string> }

const KEY = 'luna-review'
const empty: Review = { favorites: [], comments: {} }
const known = (k: unknown): k is string => typeof k === 'string' && !!findDesign(k)

// Keep only designs that still exist, in a clean shape
function clean(raw: unknown): Review {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const favorites = Array.isArray(r.favorites) ? [...new Set(r.favorites.filter(known))] : []
  const comments: Record<string, string> = {}
  if (r.comments && typeof r.comments === 'object') {
    for (const [k, v] of Object.entries(r.comments as Record<string, unknown>)) {
      if (known(k) && typeof v === 'string' && v.trim()) comments[k] = v.slice(0, 2000)
    }
  }
  return { favorites, comments }
}

let cache: Review | null = null
const listeners = new Set<() => void>()

function read(): Review {
  if (cache) return cache
  try {
    cache = clean(JSON.parse(localStorage.getItem(KEY) ?? 'null'))
  } catch {
    cache = empty
  }
  return cache
}

function write(next: Review) {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // storage blocked: kept for this visit only
  }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  // Another tab changed the review
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null
      l()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(l)
    window.removeEventListener('storage', onStorage)
  }
}

export const useReview = () => useSyncExternalStore(subscribe, read)

export function toggleFavorite(key: string) {
  const r = read()
  const favorites = r.favorites.includes(key) ? r.favorites.filter((k) => k !== key) : [...r.favorites, key]
  write({ ...r, favorites })
}

export function setComment(key: string, text: string) {
  const r = read()
  const comments = { ...r.comments }
  if (text.trim()) comments[key] = text.slice(0, 2000)
  else delete comments[key]
  write({ ...r, comments })
}

// ---------- Summary (drawer, shared page and copied text) ----------

export type SummarySection = {
  section: Section
  previewing?: Design
  items: { design: Design; favorite: boolean; comment?: string }[]
}
export type SummaryPage = { page: Page; sections: SummarySection[] }

// Only sections with a favorite or a comment, in page order; `previewing`
// is the design each section was showing when the review was made
export function buildSummary(review: Review, previewing: Record<string, string> = {}): SummaryPage[] {
  return pages
    .map((page) => ({
      page,
      sections: page.sections
        .map((s) => ({
          section: s,
          previewing: s.designs.find((d) => d.key === previewing[s.key]),
          items: s.designs
            .filter((d) => review.favorites.includes(d.key) || review.comments[d.key])
            .map((d) => ({ design: d, favorite: review.favorites.includes(d.key), comment: review.comments[d.key] })),
        }))
        .filter((s) => s.items.length),
    }))
    .filter((p) => p.sections.length)
}

// The review as plain text, for email or a message
export function summaryText(summary: SummaryPage[]) {
  if (!summary.length) return 'No favorites or comments yet.'
  const lines = ['Luna Civic Strategies — Design Review', '']
  for (const { page, sections } of summary) {
    lines.push(page.title.toUpperCase())
    for (const s of sections) {
      lines.push(`  ${s.section.title}`)
      const favs = s.items.filter((i) => i.favorite).map((i) => i.design.name)
      if (favs.length) lines.push(`    Favorite${favs.length > 1 ? 's' : ''}: ${favs.join(', ')}`)
      for (const i of s.items) {
        if (i.comment) lines.push(`    Comment on ${i.design.name}: “${i.comment}”`)
      }
      if (s.previewing) lines.push(`    Previewing: ${s.previewing.name}`)
    }
    lines.push('')
  }
  return lines.join('\n').trim()
}

// ---------- Sharing: the review packed into a link ----------

type Packed = { v: 1; f: string[]; c: Record<string, string>; p: Record<string, string> }

const toBase64Url = (text: string) =>
  btoa(Array.from(new TextEncoder().encode(text), (b) => String.fromCharCode(b)).join(''))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

const fromBase64Url = (code: string) =>
  new TextDecoder().decode(Uint8Array.from(atob(code.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)))

// What each section is showing right now, for the shared summary
export function previewingNow(search: string) {
  const out: Record<string, string> = {}
  pages.forEach((p) => p.sections.forEach((s) => (out[s.key] = currentDesignKey(s.key, search))))
  return out
}

export function shareLink(review: Review, previewing: Record<string, string>) {
  const packed: Packed = { v: 1, f: review.favorites, c: review.comments, p: previewing }
  return `${window.location.origin}/review?r=${toBase64Url(JSON.stringify(packed))}`
}

// A shared review from a link (ignores anything malformed)
export function readShared(search: string): { review: Review; previewing: Record<string, string> } | null {
  const code = new URLSearchParams(search).get('r')
  if (!code) return null
  try {
    const data = JSON.parse(fromBase64Url(code))
    if (!data || data.v !== 1) return null
    const previewing: Record<string, string> = {}
    if (data.p && typeof data.p === 'object') {
      for (const [k, v] of Object.entries(data.p as Record<string, unknown>)) if (known(v)) previewing[k] = v
    }
    return { review: clean({ favorites: data.f, comments: data.c }), previewing }
  } catch {
    return null
  }
}
