import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import { litPath } from '../../components/moons/phase'
import { tiers } from '../../content'
import { useSectionDesign } from '../../sectionDesigns'
import './how-we-work.css'

// Homepage "How we work together", in the Round 2 design picked in the
// Explore Section Designs panel (src/sectionDesigns.ts):
//   A Expanding Capsules (A1 auto-expanding / A2 all open) · B Rising
//   Capsules · C Editorial Accordion · D Original Cards (unchanged)
// A, B and C share a wide two-column layout with an intro paragraph.
// Styles: how-we-work.css.

const tones = ['powder', 'chartreuse', 'crimson'] as const
const items = tiers.map((t, i) => ({ ...t, num: `0${i + 1}`, tone: tones[i] }))
type Item = (typeof items)[number]

export default function HowWeWork() {
  const [design] = useSectionDesign('howWeWork')
  const [aVersion] = useSectionDesign('howWeWorkA')
  if (design === 'd') return <OriginalCards />
  if (design === 'a') {
    return (
      <WideSection variant="a">
        {aVersion === 'a2' ? <AllOpenCapsules /> : <ExpandingCapsules />}
      </WideSection>
    )
  }
  if (design === 'b') {
    return (
      <WideSection variant="b">
        <RisingCapsules />
      </WideSection>
    )
  }
  return (
    <WideSection variant="c">
      <SlidingPanels />
    </WideSection>
  )
}

// Wide editorial layout: headline, paragraph and link as one block on the
// left, the interactive design on the right (proportions per design)
function WideSection({ variant, children }: { variant: 'a' | 'b' | 'c'; children: ReactNode }) {
  return (
    <section className={`section section--cream hww hww-wide hww--${variant}`} id="how-we-work">
      <div className="hww-wide__layout">
        <div className="hww-wide__intro">
          <h2 className="hww__title">How we work together</h2>
          {/* Placeholder copy */}
          <p className="hww-wide__lede">
            Different missions call for different kinds of support. Whether you’re building
            capacity, launching a new initiative, or looking for a long-term thought partner, we
            meet you where you are.
          </p>
          <Link to="/services" className="text-link">
            Explore services
          </Link>
        </div>
        <div className="hww-wide__stage">{children}</div>
      </div>
    </section>
  )
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Moves on to the next item every few seconds while the group is on screen.
// Pauses while hovered, focused or off screen; stops for good once the
// visitor picks one. Off with reduced motion, and (optionally) on phones,
// where a changing accordion would push the page around.
function useAutoCycle(count: number, { interval = 4500, skipOnPhones = false } = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [auto, setAuto] = useState(true)
  const [inView, setInView] = useState(false)
  const [held, setHeld] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.35,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!auto || !inView || held || reducedMotion()) return
    if (skipOnPhones && window.matchMedia('(max-width: 640px)').matches) return
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % count), interval)
    return () => window.clearTimeout(t)
  }, [auto, inView, held, index, count, interval, skipOnPhones])

  const choose = (i: number) => {
    setAuto(false)
    setIndex(i)
  }
  const hold = {
    onPointerEnter: () => setHeld(true),
    onPointerLeave: () => setHeld(false),
    onFocus: () => setHeld(true),
    onBlur: (e: FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false)
    },
  }
  return { ref, index, choose, hold }
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

// ---------- A1 · Auto-Expanding Capsules ----------
// Three tall arches with true semicircular tops. The open one widens; the
// others keep a substantial width showing their number and a vertical title.
// The story fades in only once the capsule is nearly full width; the + turns
// into a −. Cycles Begin → Build → Sustain by itself until someone picks one.
function ExpandingCapsules() {
  const { ref, index: open, choose, hold } = useAutoCycle(items.length, { skipOnPhones: true })
  const keys = useArrowKeys(items.length, choose)
  return (
    <div ref={ref} className="caps-a" {...hold}>
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
              onClick={() => choose(i)}
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

// ---------- A2 · All Open ----------
// The same arches, all three open at equal widths with everything showing.
// They rise in one after another when the section comes into view; hovering
// lifts a capsule's text slightly and nudges its arrow.
function AllOpenCapsules() {
  const ref = useRef<HTMLDivElement>(null)
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
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`caps-a2${shown ? ' is-shown' : ''}`}>
      {items.map((item, i) => (
        <article
          key={item.id}
          className={`caps-a2__item tone--${item.tone}`}
          style={{ '--i': i } as CSSProperties}
        >
          <div className="caps-a2__content">
            <p className="caps-a__kind">
              {item.num} — {item.kind}
            </p>
            <h3 className="caps-a2__title">{item.label}</h3>
            <p className="caps-a2__text">{item.summary}</p>
            <More item={item} className="text-link caps-a2__more" />
          </div>
        </article>
      ))}
    </div>
  )
}

// ---------- B · Rising Capsules ----------
// Three oversized, fully rounded pills. The chosen one rises and gains a
// burgundy ring; its moon-phase mark draws itself in. Beneath the pills, one
// reserved area (aligned to the group's left edge) shows the chosen
// engagement; all three are stacked there and cross-fade, so its height never
// changes. Cycles by itself until someone picks one.

// One mark system: the same circle, line weight and position on every pill,
// filled to a different moon phase: a crescent to begin, half to build, full
// to sustain
const phases = { powder: 0.15, chartreuse: 0.25, crimson: 0.5 } as const
function Phase({ tone }: { tone: Item['tone'] }) {
  return (
    <svg className="phase" viewBox="0 0 64 64" aria-hidden="true">
      <circle className="phase__ring" cx="32" cy="32" r="26" pathLength="100" />
      <path className="phase__lit" d={litPath(phases[tone], 18, 32, 32)} />
    </svg>
  )
}

function RisingCapsules() {
  const { ref, index: active, choose, hold } = useAutoCycle(items.length)
  const keys = useArrowKeys(items.length, choose)
  return (
    <div ref={ref} className="caps-b" {...hold}>
      <div className="caps-b__row">
        {items.map((item, i) => (
          <button
            key={item.id}
            ref={keys.ref(i)}
            type="button"
            className={`caps-b__item tone--${item.tone}${active === i ? ' is-active' : ''}`}
            aria-pressed={active === i}
            aria-controls="caps-b-detail"
            onClick={() => choose(i)}
            onKeyDown={keys.onKeyDown(i)}
          >
            <Phase tone={item.tone} />
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
            <h3 className="caps-b__heading">{item.label}</h3>
            <p className="caps-b__text">{item.summary}</p>
            <More item={item} className="text-link caps-b__more" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- C · Editorial Accordion ----------
// Three full-height, square-cornered color blocks with hairline gaps. The open
// one takes 70% of the width; the other two share the rest, showing a
// centered vertical title, their number and an arrow. The open panel's
// number and type sit at the top, a very large title beneath, and the
// description and link at the bottom; they fade in once it has opened.
// Cycles Begin → Build → Sustain every 4s until someone picks one.
function SlidingPanels() {
  const { ref, index: open, choose, hold } = useAutoCycle(items.length, {
    interval: 4000,
    skipOnPhones: true,
  })
  const keys = useArrowKeys(items.length, choose)
  return (
    <div ref={ref} className="panels-c" {...hold}>
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
              onClick={() => choose(i)}
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
