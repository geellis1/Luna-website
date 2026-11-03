import { Link } from 'react-router-dom'
import { navLinks } from '../content'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Link to="/" className="logo logo--footer">
          <img src="/logo-white.png" alt="Luna Civic Strategies" width="900" height="300" />
        </Link>
        <ul className="footer__links">
          {navLinks.map((l) => (
            <li key={l.to}>
              <Link to={l.to}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <p className="footer__legal">© {year} Luna Civic Strategies. All rights reserved.</p>
      </div>
    </footer>
  )
}
