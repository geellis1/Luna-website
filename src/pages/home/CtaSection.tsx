import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './cta.css'

// "Let's Work Together" invitation before the footer on About and Services.
// The type is the design: "Let's Work" large in burgundy, "Together." in
// powder-blue italic set in from the right and tucked up under it, a small
// annotation, and a circular Let's Chat button that leads to the contact
// page. Builds in once it's well on screen. Styles: cta.css.

const support =
  'Every engagement begins with a conversation. Tell us about your work and your goals. We’ll take it from there.'

export default function CtaSection() {
  const ref = useRef<HTMLElement>(null)
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
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <section ref={ref} id="cta" className={`cta${shown ? ' is-in' : ''}`}>
      <div className="cta-b">
        <p className="cta-b__note">
          <span>( Next step )</span>
          <span>{support}</span>
        </p>
        <h2 className="cta-b__title">
          <span className="cta__mask">
            <span>Let’s Work</span>
          </span>
          <span className="cta-b__together">Together.</span>
        </h2>
        <Link to="/contact" className="cta-b__circle">
          <span className="cta-b__circle-label">Let’s Chat</span>
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M8 24 24 8M11 8h13v13" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
