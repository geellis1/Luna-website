import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink } from 'react-router-dom'
import { navLinks } from '../content'

// The site nav. Closed, it's the logo and a crescent-moon button (with two
// menu lines) sitting on the page. Open, large editorial rows slide in as a
// drawer attached to the right edge. Rendered into <body> so it sits above
// every page element.

const CLOSE_MS = 340 // covers the closing animation

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// A crescent moon in a thin circle; when `closing` it turns into an ×
function MoonMark({ closing = false }: { closing?: boolean }) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg className={`moon-mark${closing ? ' is-x' : ''}`} viewBox="0 0 44 44" aria-hidden="true">
      <defs>
        <mask id={`cut${uid}`}>
          <rect width="44" height="44" fill="#fff" />
          <circle cx="27" cy="17.8" r="9.8" fill="#000" />
        </mask>
      </defs>
      <circle className="moon-mark__ring" cx="22" cy="22" r="21" />
      <circle className="moon-mark__crescent" cx="20.5" cy="22.5" r="11" mask={`url(#cut${uid})`} />
      <path className="moon-mark__x" d="M16 16l12 12M28 16 16 28" />
    </svg>
  )
}

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
          className={`moon-trigger${open ? ' is-open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="editorial-menu"
          onClick={() => setOpen(true)}
        >
          <MoonMark closing={open} />
          <span className="moon-trigger__lines" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      {open &&
        createPortal(
          <div className={`ed-menu ed-menu--drawer${closing ? ' is-closing' : ''}`}>
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
                <button ref={closeButton} type="button" className="ed-menu__close" onClick={close}>
                  Close
                  <MoonMark closing />
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

              <p className="ed-menu__tagline">From Mission to Movement</p>
            </div>
          </div>,
          document.body,
        )}
    </header>
  )
}
