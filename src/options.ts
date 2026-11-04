import { createContext, useContext } from 'react'

// Design options the client can compare while the site is in review. Each
// group is shown in the Explore Designs drawer (src/components/DesignDrawer.tsx),
// is a ?param= in shared links, and (for page-wide ones) a data-* attribute on
// <html> that CSS keys off.
//
// To add a home option: build the component in src/pages/home/, then list it
// here, in the `homes` map in src/pages/home/Home.tsx, and give it a preview
// in src/components/DesignPreviews.tsx.

type Choice = { readonly id: string; readonly label: string; readonly note: string }

export const optionGroups = {
  home: {
    title: 'Homepage Design',
    param: 'home',
    choices: [
      { id: 'editorial', label: 'Editorial', note: 'Huge bold type with hand-drawn accents' },
      { id: 'bold', label: 'Moon Halo', note: 'Bold headline beside a softly glowing moon' },
      { id: 'scrapbook', label: 'Scrapbook', note: 'Tall serif headline with advocacy photos tucked behind' },
      { id: 'capsules', label: 'Capsules', note: 'Bold headline beside six photo and color capsules' },
    ],
  },
  // Color combination = the big hero headline color on Moon Halo, Scrapbook
  // and Capsules (html[data-headline]); shown as curated palettes
  headline: {
    title: 'Color Combinations',
    param: 'headline',
    choices: [
      { id: 'cream', label: 'Classic Cream', note: 'Cream headline on burgundy, chartreuse accents' },
      { id: 'chartreuse', label: 'Chartreuse Pop', note: 'Chartreuse headline on burgundy, cream accents' },
      { id: 'powder', label: 'Powder Calm', note: 'Powder blue headline on burgundy, chartreuse accents' },
      { id: 'red', label: 'Bold Red', note: 'Bold red headline on burgundy (lower contrast)' },
    ],
  },
  // Nav bar style on every page (src/components/Nav.tsx + .nav--* in index.css)
  nav: {
    title: 'Navigation Style',
    param: 'nav',
    choices: [
      // Circled Hover is the default (first). The classic bar is no longer
      // offered; its styles (.nav--classic) are kept in Nav.tsx / index.css.
      { id: 'circled', label: 'Circled Hover', note: 'Links turn italic and get circled on hover' },
      { id: 'pill', label: 'Floating Pill', note: 'A rounded bar floating over the page' },
      { id: 'menu', label: 'Editorial Fullscreen Menu', note: 'A crescent moon button opens a large editorial menu' },
    ],
  },
  // Floating pill only (html[data-pill])
  pill: {
    title: 'Pill Color',
    param: 'pill',
    choices: [
      { id: 'cream', label: 'Cream', note: 'Cream with burgundy text' },
      { id: 'powder', label: 'Powder', note: 'Powder blue with burgundy text' },
      { id: 'chartreuse', label: 'Chartreuse', note: 'Chartreuse with burgundy text' },
      { id: 'crimson', label: 'Crimson', note: 'Deep Crimson with cream text' },
      { id: 'smoked', label: 'Smoked', note: 'See-through Night Bordeaux with cream text' },
    ],
  },
  // Editorial Fullscreen Menu only
  menuLayout: {
    title: 'Menu Layout',
    param: 'menu',
    choices: [
      { id: 'takeover', label: 'Rounded Fullscreen Takeover', note: 'A large rounded panel over the whole page' },
      { id: 'drawer', label: 'Right-side Half Panel', note: 'Slides in from the right, half the screen wide' },
    ],
  },
  menuTrigger: {
    title: 'Menu Trigger',
    param: 'trigger',
    choices: [
      { id: 'moon', label: 'Crescent Moon', note: 'A crescent moon in a thin circle' },
      { id: 'moon-lines', label: 'Crescent Moon + Menu Lines', note: 'The crescent moon with two menu lines' },
    ],
  },
} as const satisfies Record<string, { title: string; param: string; choices: readonly Choice[] }>

export type OptionKey = keyof typeof optionGroups
export type OptionValue<K extends OptionKey> = (typeof optionGroups)[K]['choices'][number]['id']
export type Options = { [K in OptionKey]: OptionValue<K> }

export type HomeOption = OptionValue<'home'>

// The Explore Designs button shows unless VITE_HIDE_OPTIONS=true is set (do that at launch).
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

// Which choices matter right now (e.g. pill color only with the floating pill)
export function relevant(key: OptionKey, o: Options, onHome: boolean) {
  switch (key) {
    case 'headline':
      return onHome && (o.home === 'bold' || o.home === 'scrapbook' || o.home === 'capsules')
    case 'pill':
      return o.nav === 'pill'
    case 'menuLayout':
    case 'menuTrigger':
      return o.nav === 'menu'
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
