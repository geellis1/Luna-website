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
} as const satisfies Record<string, Group>

export type SectionKey = keyof typeof sectionDesigns
export type SectionDesign<K extends SectionKey> = (typeof sectionDesigns)[K]['choices'][number]['id']

// The Explore Designs button shows while reviewing: on this computer
// (localhost) and on Vercel preview links (*.vercel.app). The real domain
// never shows it, and VITE_HIDE_OPTIONS=true hides it everywhere.
const reviewHost = /(^localhost$|^127\.0\.0\.1$|\.vercel\.app$)/.test(window.location.hostname)
export const showSectionDesigns = reviewHost && import.meta.env.VITE_HIDE_OPTIONS !== 'true'

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
