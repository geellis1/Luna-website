import { createContext, useContext } from 'react'

// Design options Kelli can flip between while the site is in review.
// To add one: build the component in src/pages/home/, then list it here
// and in the `homes` map in src/pages/home/Home.tsx.
export const homeOptions = [
  { id: 'editorial', label: 'A · Editorial', note: 'Split hero, color-blocked sections' },
  { id: 'bold', label: 'B · Bold type', note: 'Press-conference mics, typed headline' },
  { id: 'moonrise', label: 'C · Moonrise', note: 'Cream hero, centered moon' },
] as const

export type HomeOption = (typeof homeOptions)[number]['id']

// The switcher bar shows unless VITE_HIDE_OPTIONS=true is set (do that at launch).
export const showOptions = import.meta.env.VITE_HIDE_OPTIONS !== 'true'

export const STORAGE_KEY = 'luna-home-option'
const isOption = (v: unknown): v is HomeOption => homeOptions.some((o) => o.id === v)

// A ?home= link wins, then the viewer's last pick, then option A
export function initialOption(): HomeOption {
  const fromUrl = new URLSearchParams(window.location.search).get('home')
  if (isOption(fromUrl)) return fromUrl
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isOption(saved)) return saved
  } catch {
    // storage blocked: fall through to the default
  }
  return homeOptions[0].id
}

export const OptionsContext = createContext<{
  home: HomeOption
  setHome: (o: HomeOption) => void
}>({ home: homeOptions[0].id, setHome: () => {} })

export const useOptions = () => useContext(OptionsContext)
