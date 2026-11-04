import { useState, type ReactNode } from 'react'
import {
  HOME_KEY,
  initialHome,
  initialMoon,
  MOON_KEY,
  OptionsContext,
  type HomeOption,
  type MoonStyle,
} from '../options'

const remember = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // not essential
  }
}

export default function OptionsProvider({ children }: { children: ReactNode }) {
  const [home, setHomeState] = useState<HomeOption>(initialHome)
  const [moon, setMoonState] = useState<MoonStyle>(initialMoon)

  const setHome = (o: HomeOption) => {
    setHomeState(o)
    remember(HOME_KEY, o)
  }
  const setMoon = (m: MoonStyle) => {
    setMoonState(m)
    remember(MOON_KEY, m)
  }

  return (
    <OptionsContext.Provider value={{ home, setHome, moon, setMoon }}>{children}</OptionsContext.Provider>
  )
}
