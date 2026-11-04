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
// while its parent design is selected (e.g. A1/A2 under Option A)
type Group = {
  title: string
  param: string
  anchor: string
  path?: string // the page the section is on (default: the homepage)
  choices: readonly Choice[]
  parent?: { key: string; choice: string }
}

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
  whyLuna: {
    title: 'Why Luna',
    param: 'why',
    anchor: 'why-luna',
    choices: [
      { id: 'b', label: 'B — Editorial Typography', note: 'Oversized type set like a magazine spread' },
      { id: 'c', label: 'C — Editorial Collage', note: 'Layered paper, photos and type that assemble' },
    ],
  },
  howWeWork: {
    title: 'How We Work Together',
    param: 'work',
    anchor: 'how-we-work',
    choices: [
      { id: 'a', label: 'A — Expanding Capsules', note: 'Tall capsules; the one you choose widens to tell its story' },
      { id: 'b', label: 'B — Rising Capsules', note: 'Equal capsules with a symbol each; the one you choose rises' },
      { id: 'c', label: 'C — Sliding Editorial Panels', note: 'Architectural panels that slide open like a folder' },
    ],
  },
  cta: {
    title: 'Let’s Work Together — CTA',
    param: 'cta',
    anchor: 'cta',
    choices: [
      { id: 'a', label: 'A — Rounded Invitation', note: 'A large burgundy panel with an orbital moon' },
      { id: 'b', label: 'B — Editorial Typography', note: 'Oversized type and a big circular arrow' },
      { id: 'c', label: 'C — Split-Panel Graphic', note: 'Burgundy and powder halves with a moving moon' },
    ],
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
      { id: 'b', label: 'Option B — Editorial Color Blocks', note: 'Three full-width color blocks, all open, alternating' },
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
  // Option A's two versions
  howWeWorkA: {
    title: 'Option A',
    param: 'workA',
    anchor: 'how-we-work',
    parent: { key: 'howWeWork', choice: 'a' },
    choices: [
      { id: 'a1', label: 'A1 — Auto-Expanding', note: 'One open at a time, moving on by itself' },
      { id: 'a2', label: 'A2 — All Open', note: 'All three open side by side' },
    ],
  },
} as const satisfies Record<string, Group>

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
