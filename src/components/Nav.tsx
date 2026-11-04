import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { navLinks } from '../content'
import { useOptions } from '../options'

// Pages whose first section is light, so a see-through nav needs dark text
const lightTopPages = ['/contact']

// Nav bar in the style picked in the options bar:
// classic: full-width Night Bordeaux bar with the white logo
// pill: rounded bar floating over the page, logo recolored through a mask,
//   links centered, outlined CTA on the right
// circled: no bar, just logo and links on the page; a hovered link turns
//   italic serif inside a drawn circle
export default function Nav() {
  const { nav } = useOptions()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const pill = nav === 'pill'
  const masked = pill || nav === 'circled'
  const light = nav === 'circled' && lightTopPages.includes(pathname)

  return (
    <header className={`nav nav--${nav}${light ? ' nav--on-light' : ''}`}>
      <div className="container nav__inner">
        <Link to="/" className="logo" onClick={close}>
          {masked ? (
            // Same white logo file, painted in the nav's text color through a CSS mask
            <span className="logo__mark" role="img" aria-label="Luna Civic Strategies" />
          ) : (
            <img src="/logo-white.png" alt="Luna Civic Strategies" width="900" height="300" />
          )}
        </Link>
        <ul id="nav-links" className={`nav__links${open ? ' open' : ''}`}>
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end onClick={close}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        {pill && (
          <Link to="/contact" className="nav__cta" onClick={close}>
            Let's Work Together
          </Link>
        )}
        <button
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
