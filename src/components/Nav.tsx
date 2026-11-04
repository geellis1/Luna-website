import { useLocation } from 'react-router-dom'
import EditorialMenu from './EditorialMenu'

// Pages whose first section is light (cream), so the see-through nav needs
// dark text
const lightTopPages = ['/', '/contact', '/review']

// Logo and crescent-moon menu button on the page; the button opens the menu
// as a drawer from the right (src/components/EditorialMenu.tsx)
export default function Nav() {
  const { pathname } = useLocation()
  return <EditorialMenu light={lightTopPages.includes(pathname)} />
}
