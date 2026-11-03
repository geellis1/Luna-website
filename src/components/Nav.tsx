import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { navLinks } from '../content'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link to="/" className="logo" onClick={close}>
          <img src="/logo-white.png" alt="Luna Civic Strategies" width="900" height="300" />
        </Link>
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
        <ul id="nav-links" className={`nav__links${open ? ' open' : ''}`}>
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end onClick={close}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
