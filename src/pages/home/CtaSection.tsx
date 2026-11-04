import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { litPath, useMoonPhase } from '../../components/moons/phase'
import { useSectionDesign } from '../../sectionDesigns'
import './cta.css'

// Homepage "Let's Work Together" invitation, in the Round 2 design picked in
// the Explore Section Designs panel: A Rounded Invitation, B Editorial
// Typography or C Split-Panel Graphic. All lead to the contact page.
// Styles: cta.css.

const support = 'Every engagement begins with a conversation. Tell us about your work and your goals.'

export default function CtaSection() {
  const [design] = useSectionDesign('cta')
  if (design === 'b') return <TypeInvitation />
  if (design === 'c') return <SplitInvitation />
  return <RoundedInvitation />
}

// The section and an .is-in class added once it's well on screen
function Section({ variant, children }: { variant: string; children: ReactNode }) {
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
    <section ref={ref} id="cta" className={`cta cta--${variant}${shown ? ' is-in' : ''}`}>
      {children}
    </section>
  )
}

// ---------- A · Rounded Invitation ----------
// A large burgundy panel with rounded corners: the headline big on the left,
// a line of support and a chartreuse button; on the right, an orbital moon
// running off the panel's edge. The panel eases up to full size as it comes
// into view, the headline rises out of a mask and the orbits draw in.
function RoundedInvitation() {
  return (
    <Section variant="a">
      <div className="cta-a">
        <div className="cta-a__text">
          <h2 className="cta-a__title">
            <span className="cta__mask">
              <span>Let’s Work</span>
            </span>
            <span className="cta__mask">
              <span>Together.</span>
            </span>
          </h2>
          <p className="cta-a__support">{support}</p>
          <Link to="/contact" className="button cta-a__button">
            Let’s Chat
          </Link>
        </div>
        <svg className="cta-a__orbit" viewBox="-200 -200 400 400" aria-hidden="true">
          <circle className="cta-a__ring" r="190" pathLength="100" />
          <circle className="cta-a__ring cta-a__ring--2" r="135" pathLength="100" />
          <circle className="cta-a__ring cta-a__ring--3" r="84" pathLength="100" />
          <circle className="cta-a__disc" r="52" />
          <path className="cta-a__moon" d={litPath(0.14, 52)} />
          <circle className="cta-a__dot" cx="0" cy="-135" r="6" />
        </svg>
      </div>
    </Section>
  )
}

// ---------- B · Editorial Typography ----------
// The type is the design: "Let's Work" huge in burgundy, "Together." in
// powder-blue italic set in from the right and tucked up under it, a small
// annotation, and a large circular arrow that leads to the contact page.
function TypeInvitation() {
  return (
    <Section variant="b">
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
    </Section>
  )
}

// ---------- C · Split-Panel Graphic ----------
// One rounded container split in two: burgundy with the headline and support
// on the left; powder blue with a large moon whose phase slowly drifts, an
// orbit, and the button on the right. The halves slide in toward each other.
function DriftingMoon() {
  const lit = useRef<SVGPathElement>(null)
  // A gentle sway around a waxing gibbous, so the moon never goes dark
  useMoonPhase((p) => {
    lit.current?.setAttribute('d', litPath(0.36 + 0.05 * Math.sin(2 * Math.PI * p), 120))
  })
  return (
    <svg className="cta-c__moon" viewBox="-200 -200 400 400" aria-hidden="true">
      <circle className="cta-c__orbit" r="170" />
      <circle className="cta-c__shadow" r="120" />
      <path ref={lit} className="cta-c__lit" d={litPath(0.36, 120)} />
      <circle className="cta-c__sat" cx="148" cy="-84" r="8" />
    </svg>
  )
}

function SplitInvitation() {
  return (
    <Section variant="c">
      <div className="cta-c">
        <div className="cta-c__left">
          <h2 className="cta-c__title">
            <span className="cta__mask">
              <span>Let’s Work</span>
            </span>
            <span className="cta__mask">
              <span>Together.</span>
            </span>
          </h2>
          <p className="cta-c__support">{support}</p>
        </div>
        <div className="cta-c__right">
          <DriftingMoon />
          <Link to="/contact" className="button cta-c__button">
            Let’s Chat
          </Link>
        </div>
      </div>
    </Section>
  )
}
