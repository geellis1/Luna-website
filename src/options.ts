import { createContext, useContext } from 'react'

// Design options Kelli can flip between while the site is in review. Each
// group is a row in the Design options panel, a ?param= in shareable links,
// and (for page-wide ones) a data-* attribute on <html> that CSS keys off.
//
// To add a home option: build the component in src/pages/home/, then list it
// here and in the `homes` map in src/pages/home/Home.tsx.

type Choice = { readonly id: string; readonly label: string; readonly note: string }

export const optionGroups = {
  home: {
    title: 'Home',
    param: 'home',
    choices: [
      { id: 'editorial', label: 'A · Editorial', note: 'Split hero, color-blocked sections' },
      { id: 'bold', label: 'B · Moon phases', note: 'Editorial type, animated moon phases' },
      { id: 'scrapbook', label: 'C · Scrapbook', note: 'Huge serif headline with photo cut-outs and a handwritten note' },
    ],
  },
  // Moon styles for option B (components in src/components/moons/)
  moon: {
    title: 'Moon',
    param: 'moon',
    choices: [
      { id: 'ring', label: '1 · Phase ring', note: 'Glowing moon ringed by the eight phases' },
      { id: 'halo', label: '2 · Halo', note: 'Soft layered light, cool shadow side' },
      { id: 'collage', label: '3 · Collage cream', note: 'Cut-out moons in warm ivory' },
      { id: 'collage-powder', label: '4 · Collage powder', note: 'Cut-out moons in powder blue' },
      { id: 'collage-rose', label: '5 · Collage rose', note: 'Cut-out moons in rose' },
    ],
  },
  // Big hero headline color on home options B and C (html[data-headline])
  headline: {
    title: 'Headline',
    param: 'headline',
    choices: [
      { id: 'cream', label: 'Cream', note: 'Warm cream (current)' },
      { id: 'chartreuse', label: 'Chartreuse', note: 'Chartreuse' },
      { id: 'powder', label: 'Powder', note: 'Powder blue' },
      { id: 'red', label: 'Bold Red', note: 'Bold Red (lower contrast on burgundy)' },
    ],
  },
  // Nav bar style on every page (src/components/Nav.tsx + .nav--* in index.css)
  nav: {
    title: 'Nav',
    param: 'nav',
    choices: [
      { id: 'classic', label: 'A · Classic', note: 'Full-width dark bar' },
      { id: 'pill', label: 'B · Floating pill', note: 'Rounded bar floating over the page' },
    ],
  },
  // Floating pill only (html[data-pill], html[data-corners])
  pill: {
    title: 'Pill color',
    param: 'pill',
    choices: [
      { id: 'cream', label: 'Cream', note: 'Cream with burgundy text (current)' },
      { id: 'powder', label: 'Powder', note: 'Powder blue with burgundy text' },
      { id: 'chartreuse', label: 'Chartreuse', note: 'Chartreuse with burgundy text' },
      { id: 'crimson', label: 'Crimson', note: 'Deep Crimson with cream text' },
      { id: 'smoked', label: 'Smoked', note: 'See-through Night Bordeaux with cream text' },
    ],
  },
  corners: {
    title: 'Corners',
    param: 'corners',
    choices: [
      { id: 'rounded', label: 'Rounded', note: 'Fully rounded ends' },
      { id: 'square', label: 'Square', note: 'Square corners' },
    ],
  },
} as const satisfies Record<string, { title: string; param: string; choices: readonly Choice[] }>

export type OptionKey = keyof typeof optionGroups
export type OptionValue<K extends OptionKey> = (typeof optionGroups)[K]['choices'][number]['id']
export type Options = { [K in OptionKey]: OptionValue<K> }

export type HomeOption = OptionValue<'home'>
export type MoonStyle = OptionValue<'moon'>

// The options panel shows unless VITE_HIDE_OPTIONS=true is set (do that at launch).
export const showOptions = import.meta.env.VITE_HIDE_OPTIONS !== 'true'

export const storageKey = (key: OptionKey) => `luna-option-${key}`

// A ?param= link wins, then the viewer's last pick, then the first choice
function initialValue<K extends OptionKey>(key: K): OptionValue<K> {
  const { param, choices } = optionGroups[key]
  const ids = choices.map((c) => c.id) as readonly string[]
  const isId = (v: unknown): v is OptionValue<K> => ids.includes(v as string)
  const fromUrl = new URLSearchParams(window.location.search).get(param)
  if (isId(fromUrl)) return fromUrl
  try {
    const saved = localStorage.getItem(storageKey(key))
    if (isId(saved)) return saved
  } catch {
    // storage blocked: fall through to the default
  }
  return choices[0].id as OptionValue<K>
}

const keys = Object.keys(optionGroups) as OptionKey[]

export const initialOptions = (): Options =>
  Object.fromEntries(keys.map((k) => [k, initialValue(k)])) as Options

// Which rows apply right now (e.g. moon only on home option B)
export function relevant(key: OptionKey, o: Options, onHome: boolean) {
  switch (key) {
    case 'moon':
      return onHome && o.home === 'bold'
    case 'headline':
      return onHome && (o.home === 'bold' || o.home === 'scrapbook')
    case 'pill':
    case 'corners':
      return o.nav === 'pill'
    default:
      return true
  }
}

// Query string that reproduces the picks that matter on this page
export function optionsQuery(o: Options, onHome: boolean) {
  const q = new URLSearchParams()
  for (const key of keys) {
    if (relevant(key, o, onHome)) q.set(optionGroups[key].param, o[key])
  }
  return `?${q}`
}

export const OptionsContext = createContext<
  Options & { set: <K extends OptionKey>(key: K, value: OptionValue<K>) => void }
>({
  ...(Object.fromEntries(keys.map((k) => [k, optionGroups[k].choices[0].id])) as Options),
  set: () => {},
})

export const useOptions = () => useContext(OptionsContext)
