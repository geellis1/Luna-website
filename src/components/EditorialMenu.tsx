import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink } from 'react-router-dom'
import { navLinks } from '../content'

// Nav option D: Editorial menu. Closed, it's just the logo and a MENU button
// sitting on the page (like the circled nav). Open, a near-fullscreen cream
// panel shows four oversized numbered rows. Rendered into <body> so it sits
// above every page element, including the design options panel.

const CLOSE_MS = 320

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function EditorialMenu({ light }: { light: boolean }) {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  const close = () => {
    if (!open || closing) return
    if (reducedMotion()) {
      setOpen(false)
      return
    }
    setClosing(true)
    window.setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, CLOSE_MS)
  }

  // While open: lock page scroll, focus CLOSE, close on Escape, keep Tab inside
  useEffect(() => {
    if (!open) return
    const opener = menuButton.current
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      } else if (e.key === 'Tab' && panel.current) {
        const items = panel.current.querySelectorAll<HTMLElement>('a[href], button')
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKey)
      opener?.focus()
    }
    // close() only changes state; re-binding on each render isn't needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, closing])

  return (
    <header className={`nav nav--menu${light ? ' nav--on-light' : ''}`}>
      <div className="container nav__inner">
        <Link to="/" className="logo">
          <span className="logo__mark" role="img" aria-label="Luna Civic Strategies" />
        </Link>
        <button
          ref={menuButton}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="editorial-menu"
          onClick={() => setOpen(true)}
        >
          Menu
          <span className="menu-toggle__icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      {open &&
        createPortal(
          <div className={`ed-menu${closing ? ' is-closing' : ''}`}>
            <div className="ed-menu__backdrop" onClick={close} />
            <div
              ref={panel}
              id="editorial-menu"
              className="ed-menu__panel"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
            >
              <div className="ed-menu__top">
                <Link to="/" className="logo" onClick={close}>
                  <span className="logo__mark" role="img" aria-label="Luna Civic Strategies" />
                </Link>
                <button ref={closeButton} type="button" className="ed-menu__close" onClick={close}>
                  Close
                </button>
              </div>

              <nav aria-label="Main">
                <ol className="ed-menu__list">
                  {navLinks.map((l, i) => (
                    <li key={l.to} style={{ '--i': i } as CSSProperties}>
                      <NavLink to={l.to} end className="ed-menu__row" onClick={close}>
                        <span className="ed-menu__num">0{i + 1}</span>
                        <span className="ed-menu__label">{l.label}</span>
                        <svg className="ed-menu__arrow" viewBox="0 0 64 32" aria-hidden="true">
                          <path d="M2 16h58M44 2l16 14-16 14" />
                        </svg>
                      </NavLink>
                    </li>
                  ))}
                </ol>
              </nav>

              <p className="ed-menu__tagline">From mission to movement.</p>
            </div>
          </div>,
          document.body,
        )}
    </header>
  )
}
