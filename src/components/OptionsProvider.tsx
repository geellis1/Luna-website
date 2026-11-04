import { useEffect, useState, type ReactNode } from 'react'
import {
  HOME_KEY,
  initialHome,
  initialMoon,
  initialNav,
  MOON_KEY,
  NAV_KEY,
  OptionsContext,
  type HomeOption,
  type MoonStyle,
  type NavStyle,
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
  const [nav, setNavState] = useState<NavStyle>(initialNav)

  // Page-level styles key off this (e.g. the floating nav overlaps the first section)
  useEffect(() => {
    document.documentElement.dataset.nav = nav
  }, [nav])

  const setHome = (o: HomeOption) => {
    setHomeState(o)
    remember(HOME_KEY, o)
  }
  const setMoon = (m: MoonStyle) => {
    setMoonState(m)
    remember(MOON_KEY, m)
  }
  const setNav = (n: NavStyle) => {
    setNavState(n)
    remember(NAV_KEY, n)
  }

  return (
    <OptionsContext.Provider value={{ home, setHome, moon, setMoon, nav, setNav }}>
      {children}
    </OptionsContext.Provider>
  )
}
