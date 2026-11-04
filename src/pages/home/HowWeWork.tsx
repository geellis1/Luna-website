import { useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { tiers } from '../../content'
import { useSectionDesign } from '../../sectionDesigns'
import './how-we-work.css'

// Homepage "How we work together", in the Round 2 design picked in the
// Explore Section Designs panel (src/sectionDesigns.ts):
//   A Expanding Capsules · B Rising Capsules · C Sliding Editorial Panels ·
//   D Original Cards (the design this replaced, unchanged)
// A–C share the layout: big burgundy headline + Explore services on the left,
// the interactive panels on the right. Styles: how-we-work.css.

const tones = ['powder', 'chartreuse', 'crimson'] as const
const items = tiers.map((t, i) => ({ ...t, num: `0${i + 1}`, tone: tones[i] }))
type Item = (typeof items)[number]

export default function HowWeWork() {
  const [design] = useSectionDesign('howWeWork')
  if (design === 'd') return <OriginalCards />
  const Panels = { a: ExpandingCapsules, b: RisingCapsules, c: SlidingPanels }[design]
  return (
    <section className="section section--cream hww" id="how-we-work">
      <div className="container hww__layout">
        <div className="hww__head">
          <h2 className="hww__title">How we work together</h2>
          <Link to="/services" className="text-link">
            Explore services
          </Link>
        </div>
        <Panels key={design} />
      </div>
    </section>
  )
}

// Left/Right (and Up/Down) arrows move between the three and open the one
// they land on; Home/End jump to the ends
function useArrowKeys(count: number, select: (i: number) => void) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKeyDown = (i: number) => (e: KeyboardEvent) => {
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? (i + 1) % count
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? (i - 1 + count) % count
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? count - 1
              : -1
    if (next < 0) return
    e.preventDefault()
    select(next)
    refs.current[next]?.focus()
  }
  const ref = (i: number) => (el: HTMLButtonElement | null) => {
    refs.current[i] = el
  }
  return { onKeyDown, ref }
}

function More({ item, className }: { item: Item; className: string }) {
  return (
    <Link to={`/services#${item.id}`} className={className}>
      More about {item.label}
    </Link>
  )
}

// ---------- A · Expanding Capsules ----------
// Three tall arched capsules. The open one widens; the others narrow to show
// just their number and a vertical title. The title turns horizontal and the
// type, description and link rise into view; the + becomes a −.
function ExpandingCapsules() {
  const [open, setOpen] = useState(0)
  const keys = useArrowKeys(items.length, setOpen)
  return (
    <div className="caps-a">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.id} className={`caps-a__item tone--${item.tone}${isOpen ? ' is-open' : ''}`}>
            <button
              ref={keys.ref(i)}
              type="button"
              className="caps-a__toggle"
              aria-expanded={isOpen}
              aria-controls={`caps-a-${item.id}`}
              onClick={() => setOpen(i)}
              onKeyDown={keys.onKeyDown(i)}
            >
              <span className="caps-a__num">{item.num}</span>
              <span className="caps-a__vtitle">{item.label}</span>
              <span className="caps-a__icon" aria-hidden="true" />
            </button>
            <div className="caps-a__content" id={`caps-a-${item.id}`} aria-hidden={!isOpen} inert={!isOpen}>
              <p className="caps-a__kind">
                {item.num} — {item.kind}
              </p>
              <h3 className="caps-a__title">{item.label}</h3>
              <p className="caps-a__text">{item.summary}</p>
              <More item={item} className="caps-a__more" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ---------- B · Rising Capsules ----------
// Three equal capsules, each with a small geometric symbol. The chosen one
// rises and gains a burgundy ring while its symbol moves; its description
// shows in the space beneath (all three are stacked there and cross-fade, so
// nothing below shifts).
function Symbol({ tone }: { tone: Item['tone'] }) {
  switch (tone) {
    // Begin: a seed, with a ring that opens around it
    case 'powder':
      return (
        <svg className="sym sym--seed" viewBox="0 0 64 64" aria-hidden="true">
          <circle className="sym__ring" cx="32" cy="32" r="22" />
          <circle className="sym__dot" cx="32" cy="32" r="6" />
        </svg>
      )
    // Build: three blocks that settle into a stack
    case 'chartreuse':
      return (
        <svg className="sym sym--blocks" viewBox="0 0 64 64" aria-hidden="true">
          <rect className="sym__block" x="14" y="44" width="36" height="10" style={{ '--n': 0 } as CSSProperties} />
          <rect className="sym__block" x="18" y="31" width="28" height="10" style={{ '--n': 1 } as CSSProperties} />
          <rect className="sym__block" x="22" y="18" width="20" height="10" style={{ '--n': 2 } as CSSProperties} />
        </svg>
      )
    // Sustain: a steady orbit
    case 'crimson':
      return (
        <svg className="sym sym--orbit" viewBox="0 0 64 64" aria-hidden="true">
          <circle className="sym__ring" cx="32" cy="32" r="20" />
          <g className="sym__orbiter">
            <circle cx="32" cy="12" r="5" />
          </g>
        </svg>
      )
  }
}

function RisingCapsules() {
  const [active, setActive] = useState(0)
  const keys = useArrowKeys(items.length, setActive)
  return (
    <div className="caps-b">
      <div className="caps-b__row">
        {items.map((item, i) => (
          <button
            key={item.id}
            ref={keys.ref(i)}
            type="button"
            className={`caps-b__item tone--${item.tone}${active === i ? ' is-active' : ''}`}
            aria-pressed={active === i}
            aria-controls="caps-b-detail"
            onClick={() => setActive(i)}
            onKeyDown={keys.onKeyDown(i)}
          >
            <Symbol tone={item.tone} />
            <span className="caps-b__label">
              <span className="caps-b__num">{item.num}</span>
              <span className="caps-b__title">{item.label}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="caps-b__detail" id="caps-b-detail" aria-live="polite">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`caps-b__copy${active === i ? ' is-active' : ''}`}
            aria-hidden={active !== i}
            inert={active !== i}
          >
            <p className="caps-b__kind">
              {item.num} — {item.kind}
            </p>
            <p className="caps-b__text">{item.summary}</p>
            <More item={item} className="caps-b__more" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- C · Sliding Editorial Panels ----------
// Three square-cornered panels butted together like folder spines. The open
// one slides wide; the content sweeps in from its left edge like a sheet,
// with the title set big and horizontal across the top. Closed panels show a
// vertical title, their number and an arrow pointing the way they'd open.
function SlidingPanels() {
  const [open, setOpen] = useState(0)
  const keys = useArrowKeys(items.length, setOpen)
  return (
    <div className="panels-c">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.id} className={`panel-c tone--${item.tone}${isOpen ? ' is-open' : ''}`}>
            <button
              ref={keys.ref(i)}
              type="button"
              className="panel-c__spine"
              aria-expanded={isOpen}
              aria-controls={`panel-c-${item.id}`}
              onClick={() => setOpen(i)}
              onKeyDown={keys.onKeyDown(i)}
            >
              <span className="panel-c__num">{item.num}</span>
              <Arrow />
              <span className="panel-c__vtitle">{item.label}</span>
            </button>
            <div className="panel-c__sheet" id={`panel-c-${item.id}`} aria-hidden={!isOpen} inert={!isOpen}>
              <div className="panel-c__top">
                <span className="panel-c__meta">
                  {item.num} — {item.kind}
                </span>
                <Arrow />
              </div>
              <h3 className="panel-c__title">{item.label}</h3>
              <div className="panel-c__body">
                <p className="panel-c__text">{item.summary}</p>
                <More item={item} className="panel-c__more" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Arrow(): ReactNode {
  return (
    <svg className="panel-c__arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  )
}

// ---------- D · Original Cards ----------
// The section exactly as it was (styles: .moon-card in home.css)
const tierAccents = ['card--powder', 'card--chartreuse', 'card--red']

function OriginalCards() {
  return (
    <section className="section section--cream" id="how-we-work">
      <div className="container">
        <div className="section-head">
          <h2>How we work together</h2>
          <Link to="/services" className="text-link">
            Explore services
          </Link>
        </div>
        <div className="grid-3">
          {tiers.map((t, i) => (
            <Link to={`/services#${t.id}`} className={`moon-card ${tierAccents[i]}`} key={t.id}>
              <div className="moon-card__band" />
              <div className="moon-card__body">
                <div className="tier-card__kind">{t.kind}</div>
                <div className="tier-card__label">{t.label}</div>
                <p>{t.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
