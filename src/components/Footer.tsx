import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navLinks } from '../content'
import { moonOn } from './moons/tonight'
import { litPath } from './moons/phase'
import './footer.css'

// Site footer: Night Bordeaux with tonight's moon phase on the left, the page
// links and a Start a Conversation link on the right, then the small print. On the home page a
// cream band leads into it: "Every engagement begins with a conversation."
// ("conversation" in Powder Blue) with a Powder Blue circular Let's Chat
// button. Builds in once when it scrolls into view.
// Styles: footer.css.

const year = new Date().getFullYear()

export default function Footer() {
  const { pathname } = useLocation()
  const [ref, shown] = useInView<HTMLElement>()
  // Worked out once, when the footer first renders
  const [moon] = useState(() => moonOn(new Date()))
  return (
    <footer ref={ref} className={`ft${shown ? ' is-in' : ''}`} id="site-footer">
      {pathname === '/' && (
        <div className="ft-lead">
          <div className="ft__wrap ft-lead__row">
            <p className="ft-lead__line">
              Every engagement begins with a{' '}
              <span className="ft-lead__accent">conversation</span>.
            </p>
            <Link to="/contact" className="ft-lead__chat">
              <span className="ft-lead__chat-label">Let’s Chat</span>
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M8 24 24 8M11 8h13v13" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      <div className="ft__body">
        <div className="ft__wrap ft__top">
          <figure className="ft__moon">
            <svg viewBox="-50 -50 100 100" aria-hidden="true">
              <circle r="44" className="ft__disc" />
              <path d={litPath(moon.phase, 44)} className="ft__lit" />
            </svg>
            <figcaption>
              <span>Tonight’s moon</span>
              {moon.name}
            </figcaption>
          </figure>
          <nav className="ft__nav" aria-label="Footer">
            <ul className="ft__links">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
            <Link to="/contact" className="text-link ft__cta">
              Start a Conversation
            </Link>
          </nav>
        </div>
        <div className="ft__wrap">
          <div className="ft__legal">
            <p>© {year} Luna Civic Strategies. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

// True once the footer has come into view
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, shown] as const
}
