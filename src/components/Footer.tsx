import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { navLinks, tiers } from '../content'
import { useSectionDesign } from '../sectionDesigns'
import { litPath } from './moons/phase'
import './footer.css'

// Site footer, in the Round 2 design picked in the Explore Designs panel:
//   A Editorial Colophon: cream; the closing line set large, then ruled
//     columns (pages, services) and the small print
//   B Service Bands: Begin / Build / Sustain as full-width color bands that
//     link to each service, over a Night Bordeaux base
//   C Moon Wordmark: Night Bordeaux with tonight's actual moon phase and an
//     oversized LUNA cropped by the bottom edge
// Each builds in once when it scrolls into view. Styles: footer.css.

const year = new Date().getFullYear()
const services = tiers.map((t, i) => ({ ...t, num: `0${i + 1}` }))

export default function Footer() {
  const [design] = useSectionDesign('footer')
  const [ref, shown] = useInView<HTMLElement>()
  const className = `ft ft--${design}${shown ? ' is-in' : ''}`
  if (design === 'b') return <BandsFooter innerRef={ref} className={className} />
  if (design === 'c') return <MoonFooter innerRef={ref} className={className} />
  return <ColophonFooter innerRef={ref} className={className} />
}

type Props = { innerRef: React.RefObject<HTMLElement | null>; className: string }

// ---------- A · Editorial Colophon ----------
function ColophonFooter({ innerRef, className }: Props) {
  return (
    <footer ref={innerRef} className={className} id="site-footer">
      <div className="ft__wrap">
        <div className="ft-a__lead">
          <p className="ft-a__line">Every engagement begins with a conversation.</p>
          <Link to="/contact" className="ft-a__cta">
            Start a conversation <Arrow />
          </Link>
        </div>
        <div className="ft-a__cols">
          <Link to="/" className="ft__logo" aria-label="Luna Civic Strategies, home">
            <span className="ft__mark" />
          </Link>
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
                  <span className="ft__num">{s.num}</span> {s.label} <span className="ft__kind">{s.kind}</span>
                </Link>
              </li>
            ))}
          </Column>
          <BackToTop />
        </div>
        <SmallPrint />
      </div>
    </footer>
  )
}

// ---------- B · Service Bands ----------
function BandsFooter({ innerRef, className }: Props) {
  const tones = ['powder', 'chartreuse', 'crimson']
  return (
    <footer ref={innerRef} className={className} id="site-footer">
      <nav className="ft-b__bands" aria-label="Services">
        {services.map((s, i) => (
          <Link key={s.id} to={`/services#${s.id}`} className={`ft-b__band ft-b__band--${tones[i]}`}>
            <span className="ft__num">{s.num}</span>
            <span className="ft-b__name">{s.label}</span>
            <span className="ft-b__kind">{s.kind}</span>
            <Arrow />
          </Link>
        ))}
      </nav>
      <div className="ft-b__base">
        <div className="ft__wrap ft-b__row">
          <Link to="/" className="ft__logo" aria-label="Luna Civic Strategies, home">
            <span className="ft__mark" />
          </Link>
          <ul className="ft-b__links">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/contact" className="ft-b__talk">
                Start a conversation <Arrow />
              </Link>
            </li>
          </ul>
        </div>
        <div className="ft__wrap">
          <SmallPrint />
        </div>
      </div>
    </footer>
  )
}

// ---------- C · Moon Wordmark ----------
function MoonFooter({ innerRef, className }: Props) {
  const moon = tonightsMoon()
  return (
    <footer ref={innerRef} className={className} id="site-footer">
      <div className="ft__wrap ft-c__top">
        <figure className="ft-c__moon">
          <svg viewBox="-50 -50 100 100" aria-hidden="true">
            <circle r="44" className="ft-c__disc" />
            <path d={litPath(moon.phase, 44)} className="ft-c__lit" />
          </svg>
          <figcaption>
            <span>Tonight’s moon</span>
            {moon.name}
          </figcaption>
        </figure>
        <div className="ft-c__cols">
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
            <li className="ft-c__note">Every engagement begins with a conversation.</li>
            <li>
              <Link to="/contact" className="ft-c__cta">
                Start a conversation <Arrow />
              </Link>
            </li>
          </Column>
        </div>
      </div>
      <div className="ft__wrap">
        <SmallPrint />
      </div>
      <p className="ft-c__word" aria-hidden="true">
        Luna
      </p>
    </footer>
  )
}

// ---------- Shared pieces ----------

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="ft__col">
      <p className="ft__col-title">{title}</p>
      <ul className="ft__list">{children}</ul>
    </div>
  )
}

function SmallPrint() {
  return (
    <div className="ft__legal">
      <p>© {year} Luna Civic Strategies. All rights reserved.</p>
    </div>
  )
}

function BackToTop() {
  return (
    <button
      type="button"
      className="ft__top"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        })
      }
    >
      Back to top
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20V5M6 11l6-6 6 6" />
      </svg>
    </button>
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

// Tonight's moon phase (0 new → 0.5 full → 1) and its name, from the date
function tonightsMoon() {
  const synodic = 29.530588853
  const knownNew = Date.UTC(2000, 0, 6, 18, 14) // a new moon
  const days = (Date.now() - knownNew) / 86400000
  const phase = (((days / synodic) % 1) + 1) % 1
  const names = [
    'New moon',
    'Waxing crescent',
    'First quarter',
    'Waxing gibbous',
    'Full moon',
    'Waning gibbous',
    'Last quarter',
    'Waning crescent',
  ]
  return { phase, name: names[Math.round(phase * 8) % 8] }
}
