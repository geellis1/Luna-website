import { useEffect, useRef, type CSSProperties } from 'react'
import { pillars } from '../../content'
import { photos, unsplash, type PhotoKey } from '../../photos'
import { useSectionDesign } from '../../sectionDesigns'
import './why-luna.css'

// Homepage "Why Luna", in the Round 2 design picked in the Explore Section
// Designs panel: B Editorial Typography or C Editorial Collage. Both use the
// same four reasons and the About page's intro as supporting text.
// Styles: why-luna.css.

const lede =
  'We understand what is at stake, and that limited capacity is often what stands between an organization and effective advocacy work. With experience spanning grassroots organizers, cross-sectional coalitions, public officials, and impacted communities, we bring the same clarity and care to every room we enter.'

export default function WhyLuna() {
  const [design] = useSectionDesign('whyLuna')
  return design === 'c' ? <Collage key="c" /> : <TypeSpread key="b" />
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Adds .is-in to each [data-reveal] element inside the section as it scrolls
// into view (once), so pieces animate in as the visitor reaches them
function useReveal() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const targets = root.querySelectorAll<HTMLElement>('[data-reveal]')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.25, rootMargin: '0px 0px -8% 0px' },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])
  return ref
}

// ---------- B · Editorial Typography ----------
// A typographic spread on burgundy with a clear grid: "Why Luna." large at
// the top left with the intro beside it, then the four reasons in a
// two-column grid, all in the site's serif at one size. Each reason has one
// italic key word that warms to powder blue once it's in; hovering (or
// focusing) a reason brings up its short description. The heading rises in
// first, then the reasons, one after another, out of masks.

// The reasons, with the one word in each that carries the accent
const reasons: { lead: string; key: string; tail: string }[] = [
  { lead: 'First-Hand ', key: 'Experience', tail: '' },
  { lead: 'An equity lens that is ', key: 'integrated,', tail: ' not an afterthought' },
  { lead: '', key: 'Intelligence-driven', tail: ' strategy' },
  { lead: '', key: 'Movement', tail: ' Awareness' },
]

function TypeSpread() {
  const ref = useReveal()
  return (
    <section ref={ref} className="section why why--b" id="why-luna">
      <div className="why__wrap">
        <header className="why-b__head" data-reveal>
          <h2 className="why-b__title">
            <span className="why-b__mask">
              <span>Why Luna.</span>
            </span>
          </h2>
          <p className="why-b__lede">{lede}</p>
        </header>

        <ol className="why-b__grid">
          {reasons.map((r, i) => {
            // A short description, once it's real copy (not a [placeholder])
            const note = /^\[.*\]$/.test(pillars[i].description) ? null : pillars[i].description
            return (
              <li
                key={pillars[i].title}
                className="why-b__item"
                data-reveal
                tabIndex={note ? 0 : undefined}
                style={{ '--i': i } as CSSProperties}
              >
                <span className="why-b__num">0{i + 1}</span>
                <span className="why-b__mask">
                  <span className="why-b__phrase">
                    {r.lead}
                    <em className="why-b__key">{r.key}</em>
                    {r.tail}
                  </span>
                </span>
                {note && <span className="why-b__note">{note}</span>}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

// ---------- C · Editorial Collage ----------
// A layered composition on burgundy: "Why Luna" with a paper moon behind it,
// torn-edge black-and-white advocacy photos (placeholders), cut-paper shapes
// and the four reasons on label-maker style paper strips. Pieces assemble as
// the section comes into view, then drift at different depths as the page
// scrolls. Hovering a strip straightens it; hovering a photo brings it into
// color.

type Piece = { className: string; depth: number; delay: number; from: [number, number, number] }

// [x offset, y offset, rotation] each piece starts from before assembling
const shapes: Piece[] = [
  { className: 'why-c__circle', depth: -24, delay: 0.1, from: [0, 40, 0] },
  { className: 'why-c__half', depth: 30, delay: 0.5, from: [40, -30, 30] },
  { className: 'why-c__bar', depth: -14, delay: 0.7, from: [-60, 0, -8] },
]

const photoPieces: (Piece & { photo: PhotoKey })[] = [
  { photo: 'rally', className: 'why-c__photo why-c__photo--1', depth: 18, delay: 0.25, from: [-40, 50, -12] },
  { photo: 'capitol', className: 'why-c__photo why-c__photo--2', depth: -30, delay: 0.4, from: [50, 40, 12] },
  { photo: 'hands', className: 'why-c__photo why-c__photo--3', depth: 12, delay: 0.55, from: [0, 60, -6] },
]

const strips: (Piece & { num: string; text: string })[] = [
  { num: '01', text: 'First-Hand Experience', className: 'why-c__strip why-c__strip--1', depth: 8, delay: 0.9, from: [-80, 0, -10] },
  {
    num: '02',
    text: 'An equity lens that is integrated, not an afterthought',
    className: 'why-c__strip why-c__strip--2',
    depth: -10,
    delay: 1.05,
    from: [80, 0, 8],
  },
  { num: '03', text: 'Intelligence-driven strategy', className: 'why-c__strip why-c__strip--3', depth: 14, delay: 1.2, from: [80, 0, 10] },
  { num: '04', text: 'Movement Awareness', className: 'why-c__strip why-c__strip--4', depth: -6, delay: 1.35, from: [-80, 0, -8] },
]

const pieceStyle = (p: Piece, i = 0) =>
  ({
    '--depth': p.depth,
    '--delay': `${p.delay}s`,
    '--fx': `${p.from[0]}px`,
    '--fy': `${p.from[1]}px`,
    '--fr': `${p.from[2]}deg`,
    '--i': i,
  }) as CSSProperties

function Collage() {
  const ref = useReveal()

  // Depth: as the section crosses the screen, set --p from -1 (entering
  // below) to 1 (leaving above); each layer moves by --p × its depth
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion()) return
    let frame = 0
    const update = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const p = (window.innerHeight / 2 - (r.top + r.height / 2)) / (window.innerHeight / 2 + r.height / 2)
      el.style.setProperty('--p', Math.max(-1, Math.min(1, p)).toFixed(3))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [ref])

  return (
    <section ref={ref} className="section why why--c" id="why-luna">
      <div className="why__wrap">
        <div className="why-c__stage" data-reveal>
          <div className="why-c__intro">
            <h2 className="why-c__title">
              <span className="why-c__why">Why</span>
              <span className="why-c__luna">
                <span className="why-c__moon" aria-hidden="true" />
                Luna
              </span>
            </h2>
            <p className="why-c__lede">{lede}</p>
          </div>

          <div className="why-c__collage" aria-hidden="true">
            {shapes.map((s) => (
              <span key={s.className} className={`why-c__piece ${s.className}`} style={pieceStyle(s)} />
            ))}
            {photoPieces.map((p) => (
              <figure key={p.photo} className={`why-c__piece ${p.className}`} style={pieceStyle(p)}>
                <img src={unsplash(photos[p.photo].id, 520)} alt="" loading="lazy" />
                <span className="why-c__tape" />
              </figure>
            ))}
          </div>

          <ol className="why-c__strips">
            {strips.map((s, i) => (
              <li key={s.num} className={`why-c__piece ${s.className}`} style={pieceStyle(s, i)}>
                <span className="why-c__strip-num">{s.num}</span>
                <span className="why-c__strip-text">{s.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
