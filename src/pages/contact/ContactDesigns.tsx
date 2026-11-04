import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import Letter from './Letter'
import './contact.css'

// The three Round 2 contact page directions, each built around the same
// letter form (Letter.tsx):
//   A Editorial Letter: the letter alone, framed like stationery
//   B Letter + Collage: layered paper pieces beside the letter
//   C Split Editorial: a huge statement on crimson beside the letter
// Styles: contact.css.

// The page section, with .is-in added once it comes into view
function Page({ variant, children }: { variant: string; children: ReactNode }) {
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
      { threshold: 0.05 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <section ref={ref} id="contact-page" className={`ct ct--${variant}${shown ? ' is-in' : ''}`}>
      {children}
    </section>
  )
}

// Masked lines that rise in turn
function Lines({ lines, className, start = 0 }: { lines: ReactNode[]; className: string; start?: number }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className={`ct__mask ${className}`}>
          <span style={{ '--d': start + i } as CSSProperties}>{line}</span>
        </span>
      ))}
    </>
  )
}

// ---------- A · Editorial Letter ----------
// Intimate and elegant: a headline, then the letter on a sheet of
// stationery with a thin Night Bordeaux border and rounded corners.
export function EditorialLetter() {
  return (
    <Page variant="a">
      <div className="ct-a">
        <h1 className="ct-a__title">
          <span className="sr-only">Every movement begins with a conversation.</span>
          <span aria-hidden="true">
            <Lines lines={['Every movement', <>begins with a <em>conversation.</em></>]} className="ct-a__line" />
          </span>
        </h1>
        <div className="ct-a__sheet">
          <Letter />
        </div>
      </div>
    </Page>
  )
}

// ---------- B · Letter + Collage ----------
// Creative and layered: on the left a headline and a few paper pieces (a
// handwritten note, a crimson poster slip, a powder moon, a chartreuse
// strip) that settle in and drift slightly as the page scrolls; on the right
// the letter in a rounded frame, which stays put.
export function LetterCollage() {
  const collage = useRef<HTMLDivElement>(null)

  // A little depth: two pieces drift with the scroll
  useEffect(() => {
    const el = collage.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const p = (window.innerHeight / 2 - (r.top + r.height / 2)) / window.innerHeight
      el.style.setProperty('--p', Math.max(-1, Math.min(1, p)).toFixed(3))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <Page variant="b">
      <div className="ct-b">
        <div className="ct-b__side">
          <h1 className="ct-b__title">
            <span className="sr-only">Let’s make moves.</span>
            <span aria-hidden="true">
              <Lines lines={['Let’s make', <em key="m">moves.</em>]} className="ct-b__line" />
            </span>
          </h1>
          <p className="ct-b__lede">
            Every engagement begins with a conversation. Tell us about your work and your goals.
            We’ll take it from there.
          </p>
          <div ref={collage} className="ct-b__collage" aria-hidden="true">
            <span className="ct-b__moon" />
            <p className="ct-b__poster">
              From mission
              <br />
              to movement.
            </p>
            <span className="ct-b__strip" />
            <p className="ct-b__note">
              <span>Your mission</span>
              <span>has policy</span>
              <span>implications.</span>
            </p>
          </div>
        </div>
        <div className="ct-b__frame">
          <Letter />
        </div>
      </div>
    </Page>
  )
}

// ---------- C · Split Editorial ----------
// Bold and architectural: a Deep Crimson panel with a huge statement in
// cream (lines rise in one by one) and one handwritten accent; on the right
// the letter on cream, unframed and clean.
export function SplitEditorial() {
  return (
    <Page variant="c">
      <div className="ct-c">
        <div className="ct-c__panel">
          <div className="ct-c__panel-inner">
            <h1 className="ct-c__title">
              <span className="sr-only">Let’s turn your mission into movement.</span>
              <span aria-hidden="true">
                <Lines lines={['Let’s turn', 'your mission', 'into', 'movement.']} className="ct-c__line" />
              </span>
            </h1>
            <p className="ct-c__hand">Every engagement begins with a conversation.</p>
          </div>
        </div>
        <div className="ct-c__form">
          <Letter />
        </div>
      </div>
    </Page>
  )
}
