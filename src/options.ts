import { createContext, useContext } from 'react'

// Design options Kelli can flip between while the site is in review.
// To add a home option: build the component in src/pages/home/, then list it
// here and in the `homes` map in src/pages/home/Home.tsx.
export const homeOptions = [
  { id: 'editorial', label: 'A · Editorial', note: 'Split hero, color-blocked sections' },
  { id: 'bold', label: 'B · Moon phases', note: 'Editorial type, animated moon phases' },
  { id: 'scrapbook', label: 'C · Scrapbook', note: 'Huge serif headline with photo cut-outs and a handwritten note' },
] as const

// Moon styles for option B (components in src/components/moons/)
export const moonStyles = [
  { id: 'ring', label: '1 · Phase ring', note: 'Glowing moon ringed by the eight phases' },
  { id: 'halo', label: '2 · Halo', note: 'Soft layered light, cool shadow side' },
  { id: 'collage', label: '3 · Collage cream', note: 'Cut-out moons in warm ivory' },
  { id: 'collage-powder', label: '4 · Collage powder', note: 'Cut-out moons in powder blue' },
  { id: 'collage-rose', label: '5 · Collage rose', note: 'Cut-out moons in rose' },
] as const

// Nav bar styles, on every page (variants live in src/components/Nav.tsx + index.css)
export const navStyles = [
  { id: 'classic', label: 'A · Classic', note: 'Full-width dark bar' },
  { id: 'pill', label: 'B · Floating pill', note: 'Rounded cream bar floating over the page' },
] as const

export type HomeOption = (typeof homeOptions)[number]['id']
export type MoonStyle = (typeof moonStyles)[number]['id']
export type NavStyle = (typeof navStyles)[number]['id']

// The switcher bar shows unless VITE_HIDE_OPTIONS=true is set (do that at launch).
export const showOptions = import.meta.env.VITE_HIDE_OPTIONS !== 'true'

export const HOME_KEY = 'luna-home-option'
export const MOON_KEY = 'luna-moon-style'
export const NAV_KEY = 'luna-nav-style'

// A ?home= / ?moon= / ?nav= link wins, then the viewer's last pick, then the first option
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

export const initialNav = () =>
  initial(
    'nav',
    NAV_KEY,
    navStyles.map((o) => o.id),
  )

// Query string that reproduces a set of picks (moon only matters on option B)
export function optionsQuery(home: HomeOption, moon: MoonStyle, nav: NavStyle) {
  const q = new URLSearchParams({ home })
  if (home === 'bold') q.set('moon', moon)
  q.set('nav', nav)
  return `?${q}`
}

export const OptionsContext = createContext<{
  home: HomeOption
  setHome: (o: HomeOption) => void
  moon: MoonStyle
  setMoon: (m: MoonStyle) => void
  nav: NavStyle
  setNav: (n: NavStyle) => void
}>({
  home: homeOptions[0].id,
  setHome: () => {},
  moon: moonStyles[0].id,
  setMoon: () => {},
  nav: navStyles[0].id,
  setNav: () => {},
})

export const useOptions = () => useContext(OptionsContext)
