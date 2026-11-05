import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import EditorialMenu from './EditorialMenu'

// Pages whose first section is light (cream), so the see-through nav needs
// dark text
const lightTopPages = ['/', '/services', '/contact', '/review']

// Logo and crescent-moon menu button, fixed to the top of the window; the
// button opens the menu as a drawer from the right (EditorialMenu.tsx). At
// the top of the page they sit straight on the first section; once the page
// scrolls they become a cream bar (styles: "Sticky" in index.css).
export default function Nav() {
  const { pathname } = useLocation()
  const scrolled = useScrolled()
  return (
    <EditorialMenu
      light={lightTopPages.includes(pathname)}
      className={`nav--sticky${scrolled ? ' is-scrolled' : ''}`}
    />
  )
}

// Whether the page has scrolled past the top
function useScrolled() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return scrolled
}
