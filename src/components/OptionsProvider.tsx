import { useEffect, useState, type ReactNode } from 'react'
import { initialOptions, OptionsContext, storageKey, type OptionKey, type Options, type OptionValue } from '../options'

export default function OptionsProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<Options>(initialOptions)

  // Page-wide styles key off these (e.g. the floating nav overlaps the first
  // section; pill color and headline color are pure CSS)
  useEffect(() => {
    const d = document.documentElement.dataset
    d.nav = options.nav
    d.pill = options.pill
    d.headline = options.headline
  }, [options.nav, options.pill, options.headline])

  const set = <K extends OptionKey>(key: K, value: OptionValue<K>) => {
    setOptions((o) => ({ ...o, [key]: value }))
    try {
      localStorage.setItem(storageKey(key), value)
    } catch {
      // not essential
    }
  }

  return <OptionsContext.Provider value={{ ...options, set }}>{children}</OptionsContext.Provider>
}
