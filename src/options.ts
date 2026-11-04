import { createContext, useContext } from 'react'

// Design options Kelli can flip between while the site is in review.
// To add a home option: build the component in src/pages/home/, then list it
// here and in the `homes` map in src/pages/home/Home.tsx.
export const homeOptions = [
  { id: 'editorial', label: 'A · Editorial', note: 'Split hero, color-blocked sections' },
  { id: 'bold', label: 'B · Moon phases', note: 'Editorial type, animated moon phases' },
  { id: 'moonrise', label: 'C · Moonrise', note: 'Cream hero, centered moon' },
] as const

// Moon styles for option B (components in src/components/moons/)
export const moonStyles = [
  { id: 'ring', label: '1 · Phase ring', note: 'Glowing moon ringed by the eight phases' },
  { id: 'halo', label: '2 · Halo', note: 'Soft layered light, cool shadow side' },
  { id: 'eclipse', label: '3 · Eclipse', note: 'Flat color blocks, sliding shadow' },
  { id: 'line', label: '4 · Line art', note: 'Fine-line astronomical drawing' },
  { id: 'collage', label: '5 · Collage', note: 'Cut-out moons, hand-drawn outlines' },
] as const

export type HomeOption = (typeof homeOptions)[number]['id']
export type MoonStyle = (typeof moonStyles)[number]['id']

// The switcher bar shows unless VITE_HIDE_OPTIONS=true is set (do that at launch).
export const showOptions = import.meta.env.VITE_HIDE_OPTIONS !== 'true'

export const HOME_KEY = 'luna-home-option'
export const MOON_KEY = 'luna-moon-style'

// A ?home= / ?moon= link wins, then the viewer's last pick, then the first option
function initial<T extends string>(param: string, key: string, ids: readonly T[]): T {
  const isId = (v: unknown): v is T => ids.includes(v as T)
  const fromUrl = new URLSearchParams(window.location.search).get(param)
  if (isId(fromUrl)) return fromUrl
  try {
    const saved = localStorage.getItem(key)
    if (isId(saved)) return saved
  } catch {
    // storage blocked: fall through to the default
  }
  return ids[0]
}

export const initialHome = () =>
  initial(
    'home',
    HOME_KEY,
    homeOptions.map((o) => o.id),
  )

export const initialMoon = () =>
  initial(
    'moon',
    MOON_KEY,
    moonStyles.map((o) => o.id),
  )

export const OptionsContext = createContext<{
  home: HomeOption
  setHome: (o: HomeOption) => void
  moon: MoonStyle
  setMoon: (m: MoonStyle) => void
}>({ home: homeOptions[0].id, setHome: () => {}, moon: moonStyles[0].id, setMoon: () => {} })

export const useOptions = () => useContext(OptionsContext)
