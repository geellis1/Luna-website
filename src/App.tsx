import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Nav from './components/Nav'
import SectionExplorer from './components/SectionExplorer'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/home/Home'
import ReviewPage from './pages/review/ReviewPage'
import Services from './pages/Services'
import { bodyFontStacks, useSectionDesign } from './sectionDesigns'

const titles: Record<string, string> = {
  '/': 'Luna Civic Strategies',
  '/about': 'About | Luna Civic Strategies',
  '/services': 'Services | Luna Civic Strategies',
  '/contact': 'Contact | Luna Civic Strategies',
  '/review': 'Design Review | Luna Civic Strategies',
}

// Scroll to top (or to #anchor) and set the tab title on each page change
function RouteEffects() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    document.title = titles[pathname] ?? titles['/']
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

// The Body Font pick, applied to the whole site's body copy
function BodyFont() {
  const [font] = useSectionDesign('bodyFont')
  useEffect(() => {
    document.documentElement.style.setProperty('--font-sans', bodyFontStacks[font])
  }, [font])
  return null
}

export default function App() {
  return (
    <>
      <RouteEffects />
      <BodyFont />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <SectionExplorer />
    </>
  )
}
