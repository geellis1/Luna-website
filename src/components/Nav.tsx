import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { navLinks } from '../content'
import { useOptions } from '../options'

// Nav bar in the style picked in the options bar:
// classic: full-width Night Bordeaux bar with the white logo
// pill: rounded cream bar floating over the page, logo recolored to Night
//   Bordeaux, links centered, outlined CTA on the right
export default function Nav() {
  const { nav } = useOptions()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const pill = nav === 'pill'

  return (
    <header className={`nav nav--${nav}`}>
      <div className="container nav__inner">
        <Link to="/" className="logo" onClick={close}>
          {pill ? (
            // Same white logo file, painted Night Bordeaux through a CSS mask
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
