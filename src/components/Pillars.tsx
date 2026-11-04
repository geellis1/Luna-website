import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { pillars } from '../content'
import Copy from './Copy'
import './pillars.css'

// The four "Why Luna" pillars as color boxes (Powder Blue, Chartreuse, Deep
// Crimson, cream) with soft corners and space between them. On first view
// they build in left to right: each box wipes up into place, then its
// number and title rise in. A description shows only once it's real copy
// (not a [placeholder]). Styles: pillars.css.
const isPlaceholder = (text: string) => /^\[.*\]$/.test(text.trim())

export default function Pillars() {
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
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`pillar-boxes${shown ? ' is-in' : ''}`}>
      {pillars.map((p, i) => (
        <div className={`pillar-box pillar-box--${i + 1}`} key={p.title} style={{ '--i': i } as CSSProperties}>
          <div className="pillar-box__num">0{i + 1}</div>
          <div className="pillar-box__text">
            <h3 className="pillar-box__title">{p.title}</h3>
            {!isPlaceholder(p.description) && (
              <p className="pillar-box__desc">
                <Copy text={p.description} />
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
