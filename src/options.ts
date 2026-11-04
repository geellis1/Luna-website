import { createContext, useContext } from 'react'

// Design options the client can compare while the site is in review. Each
// group is a section of the Explore the Designs panel
// (src/components/DesignDrawer.tsx), a ?param= in shared links, and (for
// page-wide ones) a data-* attribute on <html> that CSS keys off.
//
// To add a home option: build the component in src/pages/home/, then list it
// here, in the `homes` map in src/pages/home/Home.tsx, and give it a preview
// in src/components/DesignPreviews.tsx.

// `hidden` choices still work (and keep their code) but aren't offered
type Choice = { readonly id: string; readonly label: string; readonly note: string; readonly hidden?: boolean }

export const optionGroups = {
  home: {
    title: 'Homepage Design',
    param: 'home',
    choices: [
      { id: 'editorial', label: 'Editorial', note: 'Huge bold type with hand-drawn accents' },
      { id: 'moons', label: 'Moon Collage', note: 'Bold headline with a row of moons drawing in beneath it' },
      { id: 'scrapbook', label: 'Scrapbook', note: 'Tall serif headline with advocacy photos tucked behind' },
      { id: 'capsules', label: 'Capsules', note: 'Bold headline beside six photo and color capsules' },
      { id: 'handwritten', label: 'Handwritten', note: 'Sprawling red script behind a centered serif statement' },
    ],
  },
  // Moon Collage only: the color of the cut-out moons
  moonColor: {
    title: 'Moon Color',
    param: 'moon',
    choices: [
      { id: 'cream', label: 'Cream', note: 'Warm ivory moons' },
      { id: 'powder', label: 'Powder', note: 'Powder blue moons' },
      { id: 'rose', label: 'Rose', note: 'Rose moons' },
    ],
  },
  // Global color palette for every homepage hero (html[data-palette], see the
  // --p-* tokens in src/pages/home/home.css). "auto" means "use the selected
  // homepage's recommended palette" until the client picks one herself.
  palette: {
    title: 'Color Palette',
    param: 'palette',
    choices: [
      { id: 'auto', label: 'Recommended', note: 'The palette that suits each homepage', hidden: true },
      { id: 'classic', label: 'Burgundy & Cream', note: 'Deep burgundy with warm cream type' },
      { id: 'crimson', label: 'Deep Crimson', note: 'Rich crimson with cream type' },
      { id: 'chartreuse', label: 'Burgundy & Chartreuse', note: 'Burgundy with bright chartreuse type' },
      { id: 'sky', label: 'Burgundy & Sky Blue', note: 'Burgundy with soft powder-blue type' },
      { id: 'red', label: 'Burgundy & Red', note: 'Burgundy with bold red type' },
      { id: 'paper', label: 'Cream Paper', note: 'Light cream with burgundy type' },
    ],
  },
  // Nav style on every page (src/components/Nav.tsx + .nav--* in index.css)
  nav: {
    title: 'Navigation Style',
    param: 'nav',
    choices: [
      // Standard (circled hover) is the default. The classic bar and floating
      // pill are no longer offered; their code is kept.
      { id: 'circled', label: 'Standard Navigation', note: 'Links across the top, circled when you point at them' },
      { id: 'menu', label: 'Moon Menu', note: 'A crescent-moon button opens a large menu' },
      { id: 'pill', label: 'Floating Pill', note: 'A rounded bar floating over the page', hidden: true },
    ],
  },
  // Floating pill only (html[data-pill]); not offered while the pill is hidden
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
  // Moon Menu only
  menuLayout: {
    title: 'Menu Layout',
    param: 'menu',
    choices: [
      { id: 'takeover', label: 'Rounded Fullscreen Takeover', note: 'The menu fills the screen in a rounded panel' },
      { id: 'drawer', label: 'Right-side Drawer', note: 'The menu slides in from the right edge' },
    ],
  },
  menuTrigger: {
    title: 'Menu Button',
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
export type PaletteId = Exclude<OptionValue<'palette'>, 'auto'>

// Each homepage's recommended palette (used while the palette is "auto")
export const recommendedPalette: Record<HomeOption, PaletteId> = {
  editorial: 'crimson',
  moons: 'classic',
  scrapbook: 'classic',
  capsules: 'classic',
  handwritten: 'classic',
}

export const resolvePalette = (o: Pick<Options, 'palette' | 'home'>): PaletteId =>
  o.palette === 'auto' ? recommendedPalette[o.home] : o.palette

// Palettes with a light background (see-through navs switch to dark text)
export const lightPalettes: readonly PaletteId[] = ['paper']

// Human-readable label for a choice
export const labelOf = <K extends OptionKey>(key: K, id: OptionValue<K>) =>
  (optionGroups[key].choices as readonly Choice[]).find((c) => c.id === id)?.label ?? id

// The Explore Designs button shows unless VITE_HIDE_OPTIONS=true is set (do that at launch).
export const showOptions = import.meta.env.VITE_HIDE_OPTIONS !== 'true'

export const storageKey = (key: OptionKey) => `luna-option-${key}`

const isChoice = <K extends OptionKey>(key: K, v: unknown): v is OptionValue<K> =>
  (optionGroups[key].choices as readonly Choice[]).some((c) => c.id === v)

// A ?param= link wins, then the viewer's last pick, then the first choice
function initialValue<K extends OptionKey>(key: K): OptionValue<K> {
  const { param, choices } = optionGroups[key]
  const fromUrl = new URLSearchParams(window.location.search).get(param)
  if (isChoice(key, fromUrl)) return fromUrl
  try {
    const saved = localStorage.getItem(storageKey(key))
    if (isChoice(key, saved)) return saved
  } catch {
    // storage blocked: fall through to the default
  }
  return choices[0].id as OptionValue<K>
}

export const optionKeys = Object.keys(optionGroups) as OptionKey[]

export const initialOptions = (): Options =>
  Object.fromEntries(optionKeys.map((k) => [k, initialValue(k)])) as Options

export const defaultOptions = Object.fromEntries(
  optionKeys.map((k) => [k, optionGroups[k].choices[0].id]),
) as Options

// Keep only valid values from an untrusted object (e.g. a shared link), filling
// gaps with defaults
export function sanitizeOptions(raw: unknown): Options {
  const src = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  return Object.fromEntries(
    optionKeys.map((k) => [k, isChoice(k, src[k]) ? src[k] : defaultOptions[k]]),
  ) as Options
}

// Which choices matter right now (e.g. pill color only with the floating pill)
export function relevant(key: OptionKey, o: Options, onHome: boolean) {
  switch (key) {
    case 'moonColor':
      return onHome && o.home === 'moons'
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
  for (const key of optionKeys) {
    if (relevant(key, o, onHome)) q.set(optionGroups[key].param, o[key])
  }
  return `?${q}`
}

export const OptionsContext = createContext<
  Options & {
    set: <K extends OptionKey>(key: K, value: OptionValue<K>) => void
    setAll: (o: Options) => void
  }
>({ ...defaultOptions, set: () => {}, setAll: () => {} })

export const useOptions = () => useContext(OptionsContext)
