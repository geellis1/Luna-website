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
} as const satisfies Record<string, { title: string; param: string; anchor: string; choices: readonly Choice[] }>

export type SectionKey = keyof typeof sectionDesigns
export type SectionDesign<K extends SectionKey> = (typeof sectionDesigns)[K]['choices'][number]['id']

// The Explore Designs button shows unless VITE_HIDE_OPTIONS=true is set
export const showSectionDesigns = import.meta.env.VITE_HIDE_OPTIONS !== 'true'

const storageKey = (key: SectionKey) => `luna-section-${key}`

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
