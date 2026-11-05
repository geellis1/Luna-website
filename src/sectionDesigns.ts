import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// Round 2 design review: alternative designs for individual homepage sections.
// Round 1 (hero, nav, colors, type, buttons) is final and isn't offered here.
//
// Each entry is a section with alternative designs. The pick is kept in the
// address (?work=a) so a link reproduces it, and in this browser so it
// survives a refresh. The Explore Designs panel lists them by page via
// src/review.ts. To add a section later: list it here, render its designs
// with useSectionDesign(key), add it to a page in review.ts and give its
// designs thumbnails in components/DesignThumb.tsx.

type Choice = { readonly id: string; readonly label: string; readonly note: string }
// A group with a `parent` is a set of sub-designs, shown in the panel only
// while its parent design is selected (e.g. Option C's backgrounds)
type Group = {
  title: string
  param: string
  anchor: string
  path?: string // the page the section is on (default: the homepage)
  choices: readonly Choice[]
  parent?: { key: string; choice: string }
}

// Let's Work Together: the same three designs (and Option C's two section
// backgrounds) on Home, About and Services, each page picking its own
const ctaChoices = [
  { id: 'a', label: 'A — Rounded Invitation', note: 'A large burgundy panel with an orbital moon' },
  { id: 'b', label: 'B — Editorial Typography', note: 'Oversized type and a big circular arrow' },
  { id: 'c', label: 'C — Split-Panel Graphic', note: 'Burgundy and powder halves with a moving moon' },
] as const
const ctaBgChoices = [
  { id: 'bordeaux', label: 'A — Night Bordeaux Background', note: 'The card framed on Night Bordeaux' },
  { id: 'powder', label: 'B — Powder Blue Background', note: 'The card on Powder Blue' },
] as const

export const sectionDesigns = {
  // The statement right under the hero ("We help you do something about it")
  intro: {
    title: 'Intro Section',
    param: 'intro',
    anchor: 'intro-statement',
    choices: [
      { id: 'a1', label: 'Poster Collage A1 — Cream / Deep Crimson', note: 'A crimson poster with layered paper on cream' },
      { id: 'a2', label: 'Poster Collage A2 — Night Bordeaux / Powder Blue', note: 'A powder-blue poster on Night Bordeaux' },
    ],
  },
  cta: {
    title: 'Let’s Work Together — CTA',
    param: 'cta',
    anchor: 'cta',
    choices: ctaChoices,
  },
  ctaAbout: {
    title: 'About · Let’s Work Together',
    param: 'ctaAbout',
    anchor: 'cta',
    path: '/about',
    choices: ctaChoices,
  },
  ctaServices: {
    title: 'Services · Let’s Work Together',
    param: 'ctaServices',
    anchor: 'cta',
    path: '/services',
    choices: ctaChoices,
  },
  contact: {
    title: 'Contact Page — Three Directions',
    param: 'contact',
    anchor: 'contact-page',
    path: '/contact',
    choices: [
      { id: 'a', label: 'Option A: Editorial Letter', note: 'The form as a letter on framed stationery' },
      { id: 'b', label: 'Option B: Letter + Collage', note: 'Layered paper pieces beside the letter' },
      { id: 'c', label: 'Option C: Split Editorial', note: 'A huge statement on crimson beside the letter' },
    ],
  },
  services: {
    title: 'Services · Page Layout',
    param: 'services',
    anchor: 'services-top',
    path: '/services',
    choices: [
      { id: 'a', label: 'Option A — Horizontal Accordion', note: 'Three full-width color bands; one opens at a time' },
      { id: 'b', label: 'Option B — Editorial Chapters', note: 'Three magazine-spread chapters, all open, alternating' },
    ],
  },

  // On every page: the typeface for body copy (headlines keep theirs)
  bodyFont: {
    title: 'Body Font',
    param: 'font',
    anchor: '',
    choices: [
      { id: 'system', label: 'Current — Apple System', note: 'The device’s own font (San Francisco on Apple)' },
      { id: 'inter', label: 'Inter', note: 'Clean and open; the common free stand-in for Helvetica' },
      { id: 'hanken', label: 'Hanken Grotesk', note: 'A tighter, more traditional grotesque' },
      { id: 'schibsted', label: 'Schibsted Grotesk', note: 'Grotesque with a little editorial character' },
      { id: 'dm', label: 'DM Sans', note: 'Geometric and friendly, slightly rounder' },
    ],
  },
  aboutHeadshot: {
    title: 'About · Kelli’s Headshot',
    param: 'photo',
    anchor: 'kelli',
    path: '/about',
    choices: [
      { id: 'blazer', label: 'A — Houndstooth Blazer', note: 'The current photo' },
      { id: 'glasses', label: 'B — Red Glasses', note: 'Warm, outdoors, red cat-eye glasses' },
      { id: 'cardigan', label: 'C — Green Cardigan', note: 'Big smile, dark backdrop' },
    ],
  },
  // CTA Option C's section backgrounds (per page)
  ctaC: {
    title: 'Option C · Background',
    param: 'ctaBg',
    anchor: 'cta',
    parent: { key: 'cta', choice: 'c' },
    choices: ctaBgChoices,
  },
  ctaAboutC: {
    title: 'Option C · Background',
    param: 'ctaAboutBg',
    anchor: 'cta',
    path: '/about',
    parent: { key: 'ctaAbout', choice: 'c' },
    choices: ctaBgChoices,
  },
  ctaServicesC: {
    title: 'Option C · Background',
    param: 'ctaServicesBg',
    anchor: 'cta',
    path: '/services',
    parent: { key: 'ctaServices', choice: 'c' },
    choices: ctaBgChoices,
  },
} as const satisfies Record<string, Group>

// Each body font's stack (the free ones load from Google Fonts in index.html)
const systemSans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
export const bodyFontStacks: Record<(typeof sectionDesigns)['bodyFont']['choices'][number]['id'], string> = {
  system: systemSans,
  inter: `'Inter', ${systemSans}`,
  hanken: `'Hanken Grotesk', ${systemSans}`,
  schibsted: `'Schibsted Grotesk', ${systemSans}`,
  dm: `'DM Sans', ${systemSans}`,
}

export type SectionKey = keyof typeof sectionDesigns
export type SectionDesign<K extends SectionKey> = (typeof sectionDesigns)[K]['choices'][number]['id']

// The Explore Designs button shows unless VITE_HIDE_OPTIONS=true is set
export const showSectionDesigns = import.meta.env.VITE_HIDE_OPTIONS !== 'true'

const storageKey = (key: SectionKey) => `luna-section-${key}`

// Top-level sections, and the sub-designs that belong to a section's choice
export const pathOf = (key: SectionKey) => (sectionDesigns[key] as Group).path ?? '/'

export const sectionKeys = (Object.keys(sectionDesigns) as SectionKey[]).filter(
  (k) => !(sectionDesigns[k] as Group).parent,
)
export const subGroupsOf = (key: SectionKey, choice: string) =>
  (Object.keys(sectionDesigns) as SectionKey[]).filter((k) => {
    const parent = (sectionDesigns[k] as Group).parent
    return parent?.key === key && parent.choice === choice
  })

const isChoice = <K extends SectionKey>(key: K, v: unknown): v is SectionDesign<K> =>
  (sectionDesigns[key].choices as readonly Choice[]).some((c) => c.id === v)

const readStored = <K extends SectionKey>(key: K) => {
  try {
    const v = localStorage.getItem(storageKey(key))
    return isChoice(key, v) ? v : null
  } catch {
    return null
  }
}

// A section's current design: a ?param= link wins, then this browser's last
// pick, then the first design
export function readDesign<K extends SectionKey>(key: K, search: string): SectionDesign<K> {
  const fromUrl = new URLSearchParams(search).get(sectionDesigns[key].param)
  if (isChoice(key, fromUrl)) return fromUrl
  return readStored(key) ?? (sectionDesigns[key].choices[0].id as SectionDesign<K>)
}

// Applies several sections' designs at once (one navigation), optionally
// opening another page; remembered in this browser like any other pick
export function useApplyDesigns() {
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()
  return (picks: Partial<Record<SectionKey, string>>, path = pathname) => {
    const q = new URLSearchParams(search)
    ;(Object.keys(picks) as SectionKey[]).forEach((k) => {
      const v = picks[k]
      if (!isChoice(k, v)) return
      try {
        localStorage.setItem(storageKey(k), v)
      } catch {
        // not essential
      }
      q.set(sectionDesigns[k].param, v)
    })
    navigate(
      { pathname: path, search: `?${q}`, hash: path === pathname ? hash : '' },
      { replace: path === pathname, preventScrollReset: path === pathname },
    )
  }
}

// The current design for a section, and a setter that updates the page in
// place (no reload) and the address
export function useSectionDesign<K extends SectionKey>(key: K) {
  const { param } = sectionDesigns[key]
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()
  const fromUrl = new URLSearchParams(search).get(param)
  const value = readDesign(key, search)

  // A shared link's pick becomes this browser's pick too
  useEffect(() => {
    if (isChoice(key, fromUrl) && fromUrl !== readStored(key)) {
      try {
        localStorage.setItem(storageKey(key), fromUrl)
      } catch {
        // not essential
      }
    }
  }, [key, fromUrl])

  const set = (next: SectionDesign<K>) => {
    try {
      localStorage.setItem(storageKey(key), next)
    } catch {
      // not essential
    }
    // Updating the address re-renders everyone using this section's design
    const q = new URLSearchParams(search)
    q.set(param, next)
    navigate({ pathname, search: `?${q}`, hash }, { replace: true, preventScrollReset: true })
  }

  return [value, set] as const
}
