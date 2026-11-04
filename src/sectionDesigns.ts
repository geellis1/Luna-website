import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// Round 2 design review: alternative designs for individual homepage sections.
// Round 1 (hero, nav, colors, type, buttons) is final and isn't offered here.
//
// Each entry is a section of the Explore Section Designs panel
// (src/components/SectionExplorer.tsx). The pick is kept in the address
// (?work=a) so a link reproduces it, and in this browser so it survives a
// refresh. To add a section later: list it here, render its designs with
// useSectionDesign(key), and give its options previews in SectionExplorer.

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
  howWeWork: {
    title: 'How We Work Together',
    param: 'work',
    anchor: 'how-we-work',
    choices: [
      { id: 'a', label: 'A — Expanding Capsules', note: 'Tall capsules; the one you choose widens to tell its story' },
      { id: 'b', label: 'B — Rising Capsules', note: 'Equal capsules with a symbol each; the one you choose rises' },
      { id: 'c', label: 'C — Sliding Editorial Panels', note: 'Architectural panels that slide open like a folder' },
      { id: 'd', label: 'D — Original Cards', note: 'The current three cards, for comparison' },
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

// The current design for a section, and a setter that updates the page in
// place (no reload) and the address. A ?param= link wins, then this browser's
// last pick, then the first design.
export function useSectionDesign<K extends SectionKey>(key: K) {
  const { param, choices } = sectionDesigns[key]
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()
  const fromUrl = new URLSearchParams(search).get(param)
  const value: SectionDesign<K> = isChoice(key, fromUrl)
    ? fromUrl
    : (readStored(key) ?? (choices[0].id as SectionDesign<K>))

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
