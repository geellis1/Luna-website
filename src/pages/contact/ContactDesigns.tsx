import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import Letter from './Letter'
import './contact.css'

// The contact page: Split Editorial, a huge statement on crimson beside the
// letter form (Letter.tsx). Styles: contact.css.

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
