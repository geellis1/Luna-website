import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Copy from '../../components/Copy'
import { tiers } from '../../content'
import CtaSection from '../home/CtaSection'
import './services.css'

// Services page: a Horizontal Accordion in the homepage panels' look (Begin
// Powder Blue, Build Chartreuse, Sustain Deep Crimson; big uppercase display
// names). It keeps the #begin / #build / #sustain anchors the homepage links
// to, and ends with the Let's Work Together invitation (home/CtaSection.tsx).
// Styles: services.css.

const tones = ['powder', 'chartreuse', 'crimson'] as const
const services = tiers.map((t, i) => ({ ...t, num: `0${i + 1}`, tone: tones[i] }))
type Service = (typeof services)[number]

// Compact editorial intro, so the colored bands start within the first screen
function Intro() {
  return (
    <section className="section svc-intro" id="services-top">
      <div className="svc-intro__inner">
        <p className="svc-intro__kicker">Services</p>
        <h1 className="svc-intro__title">How we work together</h1>
        <p className="svc-intro__lede">
          We meet you where you are and have an engagement model built for your stage. Whether you're building your
          first advocacy program or running an active legislative campaign, we can meet you there.
        </p>
        <nav className="svc-intro__index" aria-label="Services">
          {services.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              <span>{s.num}</span> {s.label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}

// What every layout says about a service: the one-line summary, the full
// description, the list of offerings and a link to start a conversation
function Details({ service }: { service: Service }) {
  return (
    <>
      <p className="svc-summary">{service.summary}</p>
      <p className="svc-desc">
        <Copy text={service.description} />
      </p>
      <h3 className="svc-list__heading">{service.listHeading}</h3>
      <ul className="svc-list">
        {service.items.map((item, i) => (
          <li key={i}>
            <Copy text={item} />
          </li>
        ))}
      </ul>
      <Link to="/contact" className="svc-cta">
        Start a Conversation
        <Arrow />
      </Link>
    </>
  )
}

function Arrow(): ReactNode {
  return (
    <svg className="svc-arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  )
}

// ---------- A · Horizontal Accordion ----------
// Full-bleed bands stacked with no gaps. Closed, each shows its number, a
// big name, its category and a +; open, it grows to show the details in two
// columns. All closed at first (unless a link points to one); one open at a
// time; clicking the open one closes it.
// Opening a band scrolls to its top, just under the sticky nav. The band
// that was open closes at the same time, so if it sits above this one, the
// target is where this band will be once that one has folded away.
function settleAtTop(band: HTMLElement | null, wasOpen: string) {
  if (!band) return
  const navH = 80 // the sticky nav's height once the page has scrolled
  let top = band.getBoundingClientRect().top + window.scrollY
  const prev = wasOpen ? document.getElementById(wasOpen) : null
  if (prev && prev.compareDocumentPosition(band) & Node.DOCUMENT_POSITION_FOLLOWING) {
    top -= prev.querySelector('.svc-band__panel')?.getBoundingClientRect().height ?? 0
  }
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const behavior = smooth ? 'smooth' : 'auto'
  window.scrollTo({ top: top - navH, behavior })
  // Once the bands have finished folding and growing, nudge the last few
  // pixels (the closing band's name also shrinks)
  window.setTimeout(() => {
    const off = band.getBoundingClientRect().top - navH
    if (Math.abs(off) > 2) window.scrollBy({ top: off, behavior })
  }, 650)
}

export function ServicesAccordion() {
  const { hash } = useLocation()
  const fromHash = services.find((s) => `#${s.id}` === hash)?.id
  const [choice, setChoice] = useState<{ hash: string; id: string } | null>(null)
  const open = choice?.hash === hash ? choice.id : (fromHash ?? '')

  // Arriving at #build (e.g. from the homepage): glide to it once it's open
  useEffect(() => {
    if (!fromHash) return
    const t = window.setTimeout(() => document.getElementById(fromHash)?.scrollIntoView({ block: 'start' }), 60)
    return () => window.clearTimeout(t)
  }, [fromHash])

  return (
    <div className="svc svc--a">
      <Intro />
      <div className="svc-acc">
        {services.map((s) => {
          const isOpen = open === s.id
          return (
            <section key={s.id} id={s.id} className={`svc-band tone--${s.tone}${isOpen ? ' is-open' : ''}`}>
              <h2 className="svc-band__heading">
                <button
                  type="button"
                  className="svc-band__toggle"
                  aria-expanded={isOpen}
                  aria-controls={`svc-${s.id}`}
                  onClick={(e) => {
                    if (!isOpen) settleAtTop(e.currentTarget.closest('section'), open)
                    setChoice({ hash, id: isOpen ? '' : s.id })
                  }}
                >
                  <span className="svc-band__num">{s.num}</span>
                  <span className="svc-band__name">{s.label}</span>
                  <span className="svc-band__kind">{s.kind}</span>
                  <span className="svc-band__icon" aria-hidden="true" />
                </button>
              </h2>
              <div className="svc-band__panel" id={`svc-${s.id}`}>
                <div className="svc-band__inner" inert={!isOpen}>
                  <div className="svc-band__body">
                    <Details service={s} />
                  </div>
                </div>
              </div>
            </section>
          )
        })}
      </div>
      <CtaSection />
    </div>
  )
}
