import { useEffect, useRef, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { tiers } from '../../content'
import './how-we-work.css'

// Homepage "How we work together": the headline, paragraph and link on the
// left; on the right, three arches (Begin, Build, Sustain), all open at equal
// widths with everything showing (rounded cards on phones). When they come
// into view, the arches rise gently into place one after another.
// Styles: how-we-work.css.

const tones = ['powder', 'chartreuse', 'crimson'] as const
const items = tiers.map((t, i) => ({ ...t, num: `0${i + 1}`, tone: tones[i] }))

export default function HowWeWork() {
  const caps = useRef<HTMLDivElement>(null)

  // Mark the arches "in" once a quarter of them is on screen
  useEffect(() => {
    const el = caps.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="section section--cream hww" id="how-we-work">
      <div className="hww__layout">
        <div className="hww__intro">
          <h2 className="hww__title">How we work together</h2>
          {/* Placeholder copy */}
          <p className="hww__lede">
            Different missions call for different kinds of support. Whether you’re building
            capacity, launching a new initiative, or looking for a long-term thought partner, we
            meet you where you are.
          </p>
          <Link to="/services" className="text-link">
            Explore services
          </Link>
        </div>
        <div className="hww__stage">
          <div className="caps" ref={caps}>
            {items.map((item, i) => (
              <article
                key={item.id}
                className={`caps__item tone--${item.tone}`}
                style={{ '--i': i } as CSSProperties}
              >
                <div>
                  <p className="caps__kind">
                    {item.num} — {item.kind}
                  </p>
                  <h3 className="caps__title">{item.label}</h3>
                  <p className="caps__text">{item.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
