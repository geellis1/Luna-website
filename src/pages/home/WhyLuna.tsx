import { useEffect, useRef, type CSSProperties } from 'react'
import { pillars } from '../../content'
import './why-luna.css'

// Homepage "Why Luna": Editorial Typography, with the four reasons and the
// About page's intro as supporting text. Styles: why-luna.css.

const lede =
  'We understand what is at stake, and that limited capacity is often what stands between an organization and effective advocacy work. With experience spanning grassroots organizers, cross-sectional coalitions, public officials, and impacted communities, we bring the same clarity and care to every room we enter.'

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

export default function WhyLuna() {
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
