import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useSectionDesign } from '../sectionDesigns'
import EditorialMenu from './EditorialMenu'

// Pages whose first section is light (cream), so the see-through nav needs
// dark text
const lightTopPages = ['/', '/services', '/contact', '/review']

// Logo and crescent-moon menu button; the button opens the menu as a drawer
// from the right (src/components/EditorialMenu.tsx). At the top of the page
// they sit straight on the first section. How they behave as the page
// scrolls is a Round 2 choice (Explore Designs · Navigation):
//   A Sticky: fixed to the top, becoming a cream bar once scrolled
//   B Floating Pill: once scrolled, logo and menu float in a centered pill
//   C Hide and Return: a cream bar that slides away while scrolling down and
//     comes back on any scroll up
export default function Nav() {
  const { pathname } = useLocation()
  const [mode] = useSectionDesign('nav')
  const { scrolled, hidden } = useScrollState()
  const classes = [`nav--${mode}`, scrolled && 'is-scrolled', mode === 'c' && hidden && 'is-hidden']
  return <EditorialMenu light={lightTopPages.includes(pathname)} className={classes.filter(Boolean).join(' ')} />
}

// Whether the page has scrolled past the top, and whether the latest scroll
// was downward (past the nav), for hiding it
function useScrollState() {
  const [state, setState] = useState({ scrolled: false, hidden: false })
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const delta = y - last
      // Ignore tiny jitters (trackpads, iOS bounce)
      if (Math.abs(delta) < 4 && y > 0) return
      setState({ scrolled: y > 24, hidden: delta > 0 && y > 120 })
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return state
}
