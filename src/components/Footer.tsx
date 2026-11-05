import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navLinks, tiers } from '../content'
import { moonOn } from './moons/tonight'
import { litPath } from './moons/phase'
import './footer.css'

// Site footer: Night Bordeaux with tonight's moon phase, the page and service
// links, a closing line and the small print. On the home page a
// cream band leads into it: "Every engagement begins with a conversation."
// (its two key words in Powder Blue) with a Powder Blue circular Let's Chat
// button. Builds in once when it scrolls into view.
// Styles: footer.css.

const year = new Date().getFullYear()
const services = tiers.map((t, i) => ({ ...t, num: `0${i + 1}` }))

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
              Every <span className="ft-lead__accent">engagement</span> begins with a{' '}
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
          <div className="ft__cols">
            <Column title="Pages">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </Column>
            <Column title="Services">
              {services.map((s) => (
                <li key={s.id}>
                  <Link to={`/services#${s.id}`}>
                    <span className="ft__num">{s.num}</span> {s.label}
                  </Link>
                </li>
              ))}
            </Column>
            <Column title="Work with us">
              <li className="ft__note">Every engagement begins with a conversation.</li>
              <li>
                <Link to="/contact" className="ft__cta">
                  Start a conversation <Arrow />
                </Link>
              </li>
            </Column>
          </div>
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

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="ft__col">
      <p className="ft__col-title">{title}</p>
      <ul className="ft__list">{children}</ul>
    </div>
  )
}

function Arrow() {
  return (
    <svg className="ft__arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
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
