import { useEffect, useState, type ReactNode } from 'react'
import {
  initialOptions,
  optionKeys,
  OptionsContext,
  resolvePalette,
  storageKey,
  type OptionKey,
  type Options,
  type OptionValue,
} from '../options'

const remember = (key: OptionKey, value: string) => {
  try {
    localStorage.setItem(storageKey(key), value)
  } catch {
    // not essential
  }
}

export default function OptionsProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<Options>(initialOptions)
  const palette = resolvePalette(options)

  // Page-wide styles key off these (e.g. the floating nav overlaps the first
  // section; pill color and the hero palette are pure CSS)
  useEffect(() => {
    const d = document.documentElement.dataset
    d.nav = options.nav
    d.pill = options.pill
    d.palette = palette
  }, [options.nav, options.pill, palette])

  const set = <K extends OptionKey>(key: K, value: OptionValue<K>) => {
    setOptions((o) => ({ ...o, [key]: value }))
    remember(key, value)
  }

  // Restore a whole combination at once (a favorite or a shared design)
  const setAll = (next: Options) => {
    setOptions(next)
    optionKeys.forEach((k) => remember(k, next[k]))
  }

  return (
    <OptionsContext.Provider value={{ ...options, set, setAll }}>{children}</OptionsContext.Provider>
  )
}
