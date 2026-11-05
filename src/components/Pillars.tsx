import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { pillars } from '../content'
import './pillars.css'

// The four "Why Luna" pillars as color boxes (Powder Blue, Chartreuse, Deep
// Crimson, cream) with soft corners and space between them. On first view
// they build in left to right: each box wipes up into place, then its
// number and title rise in. Each box is a card that turns over on click (or
// Enter / Space) to show its description; a turning-arrow mark in the corner
// says so, and hovering tips the card slightly. Styles: pillars.css.
const isPlaceholder = (text: string) => /^\[.*\]$/.test(text.trim())

export default function Pillars() {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const [flipped, setFlipped] = useState<number[]>([])

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
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const toggle = (i: number) => setFlipped((f) => (f.includes(i) ? f.filter((n) => n !== i) : [...f, i]))

  return (
    <div ref={ref} className={`pillar-boxes${shown ? ' is-in' : ''}`}>
      {pillars.map((p, i) => {
        const open = flipped.includes(i)
        return (
          <button
            type="button"
            className={`pillar-box pillar-box--${i + 1}${open ? ' is-flipped' : ''}`}
            key={p.title}
            style={{ '--i': i } as CSSProperties}
            aria-pressed={open}
            onClick={() => toggle(i)}
          >
            <span className="pillar-box__card">
              <span className="pillar-box__face pillar-box__face--front" aria-hidden={open}>
                <span className="pillar-box__num">0{i + 1}</span>
                <span className="pillar-box__text">
                  <span className="pillar-box__title">{p.title}</span>
                </span>
                <Hint />
              </span>
              <span className="pillar-box__face pillar-box__face--back" aria-hidden={!open}>
                <span className="pillar-box__num">0{i + 1}</span>
                {isPlaceholder(p.description) ? (
                  <span className="pillar-box__desc pillar-box__desc--soon">Description coming soon.</span>
                ) : (
                  <span className="pillar-box__desc">{p.description}</span>
                )}
                <Hint label="Back" />
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

// A turning arrow (with an optional label) in the card's bottom-right corner
function Hint({ label }: { label?: string }) {
  return (
    <span className="pillar-box__hint" aria-hidden={!label || undefined}>
      {label}
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 12a8 8 0 0 1 14-5.3M20 4v4h-4M20 12a8 8 0 0 1-14 5.3M4 20v-4h4" />
      </svg>
    </span>
  )
}
