import { useState, type ReactNode } from 'react'
import { initialOption, OptionsContext, STORAGE_KEY, type HomeOption } from '../options'

export default function OptionsProvider({ children }: { children: ReactNode }) {
  const [home, setHomeState] = useState<HomeOption>(initialOption)
  const setHome = (o: HomeOption) => {
    setHomeState(o)
    try {
      localStorage.setItem(STORAGE_KEY, o)
    } catch {
      // not essential
    }
  }
  return <OptionsContext.Provider value={{ home, setHome }}>{children}</OptionsContext.Provider>
}
