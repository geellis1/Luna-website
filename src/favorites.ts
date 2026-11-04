import { useSyncExternalStore } from 'react'
import {
  labelOf,
  optionGroups,
  optionsQuery,
  recommendedPalette,
  resolvePalette,
  sanitizeOptions,
  type Options,
} from './options'

// Saved favorites and shareable review links for the Explore Designs panel.
//
// Favorites live in this browser only (localStorage), so nothing needs a
// server or an account. A review link carries everything in the URL itself:
// the design as the usual ?home=…&palette=… params (so it opens on any copy of
// the site, including Vercel), plus a small versioned "review" note with the
// name, feedback and preferred flag, base64url-encoded so any text survives.

export type Favorite = {
  id: string
  name: string
  note: string
  preferred: boolean
  savedAt: number
  config: Options
}

const KEY = 'luna-favorites'

// ---- Store (shared by the panel and the shared-link card) ----

let cache: Favorite[] | null = null
const listeners = new Set<() => void>()

function read(): Favorite[] {
  if (cache) return cache
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    cache = Array.isArray(raw)
      ? raw
          .filter((f) => f && typeof f === 'object' && typeof f.id === 'string')
          .map((f) => ({
            id: f.id,
            name: String(f.name ?? ''),
            note: String(f.note ?? ''),
            preferred: Boolean(f.preferred),
            savedAt: Number(f.savedAt) || Date.now(),
            config: sanitizeOptions(f.config),
          }))
      : []
  } catch {
    cache = []
  }
  return cache
}

function write(next: Favorite[]) {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // storage blocked: favorites last for this visit only
  }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  // Another tab saved or edited a favorite
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null
      l()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(l)
    window.removeEventListener('storage', onStorage)
  }
}

export const useFavorites = () => useSyncExternalStore(subscribe, read)

const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)

export function addFavorite(f: Omit<Favorite, 'id' | 'savedAt'>): Favorite {
  const fav = { ...f, id: newId(), savedAt: Date.now() }
  write([...clearPreferred(read(), fav.preferred), fav])
  return fav
}

export function updateFavorite(id: string, patch: Partial<Omit<Favorite, 'id'>>) {
  write(clearPreferred(read(), Boolean(patch.preferred)).map((f) => (f.id === id ? { ...f, ...patch } : f)))
}

export function removeFavorite(id: string) {
  write(read().filter((f) => f.id !== id))
}

// Only one favorite can be the preferred one
const clearPreferred = (list: Favorite[], when: boolean) =>
  when ? list.map((f) => (f.preferred ? { ...f, preferred: false } : f)) : list

// ---- Comparing and describing designs ----

// Two designs match when every choice that shows on the site matches
export const sameDesign = (a: Options, b: Options) =>
  optionsQuery(withPalette(a), true) === optionsQuery(withPalette(b), true)

// "auto" and the homepage's recommended palette look the same
const withPalette = (o: Options): Options => ({ ...o, palette: resolvePalette(o) })

export const findFavorite = (list: Favorite[], o: Options) => list.find((f) => sameDesign(f.config, o))

export const nextFavoriteName = (list: Favorite[]) => {
  let n = list.length + 1
  while (list.some((f) => f.name === `Favorite Option ${n}`)) n++
  return `Favorite Option ${n}`
}

// The five selections, in the panel's order, as plain words
export function summarize(o: Options): { title: string; value: string; muted?: boolean }[] {
  const palette = resolvePalette(o)
  const recommended = palette === recommendedPalette[o.home]
  const moonMenu = o.nav === 'menu'
  return [
    {
      title: optionGroups.home.title,
      value:
        labelOf('home', o.home) +
        (o.home === 'moons' ? ` · ${labelOf('moonColor', o.moonColor)} moons` : ''),
    },
    {
      title: optionGroups.palette.title,
      value: labelOf('palette', palette) + (recommended ? ' (Recommended)' : ''),
    },
    { title: optionGroups.nav.title, value: labelOf('nav', o.nav) },
    {
      title: optionGroups.menuLayout.title,
      value: moonMenu ? labelOf('menuLayout', o.menuLayout) : 'Moon Menu only',
      muted: !moonMenu,
    },
    {
      title: optionGroups.menuTrigger.title,
      value: moonMenu ? labelOf('menuTrigger', o.menuTrigger) : 'Moon Menu only',
      muted: !moonMenu,
    },
  ]
}

// ---- Review links ----

export type ReviewNote = { name: string; note: string; preferred: boolean }

const REVIEW_PARAM = 'review'

const toBase64Url = (text: string) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(text)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

const fromBase64Url = (code: string) => {
  const b64 = code.replace(/-/g, '+').replace(/_/g, '/')
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

// A link that opens this design on the homepage, with the note attached.
// Version 1: { v: 1, n: name, f: feedback, p: preferred (1/0) }
export function reviewLink(o: Options, note: ReviewNote) {
  const payload = { v: 1, n: note.name.trim(), f: note.note.trim(), p: note.preferred ? 1 : 0 }
  const q = optionsQuery(o, true) + `&${REVIEW_PARAM}=` + toBase64Url(JSON.stringify(payload))
  return window.location.origin + '/' + q
}

// The note in the current address, if any (ignores anything malformed)
export function readReviewNote(search = window.location.search): ReviewNote | null {
  const code = new URLSearchParams(search).get(REVIEW_PARAM)
  if (!code) return null
  try {
    const data = JSON.parse(fromBase64Url(code))
    if (!data || data.v !== 1) return null
    return {
      name: String(data.n ?? '').slice(0, 120),
      note: String(data.f ?? '').slice(0, 4000),
      preferred: data.p === 1,
    }
  } catch {
    return null
  }
}
