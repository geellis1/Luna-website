import { useEffect, useId, useRef } from 'react'

// A glowing moon that slowly cycles through its phases, ringed by eight small
// outline moons (a lunar phase diagram). The ring moon matching the current
// phase lights up as the big moon passes through it.

const R = 100 // big moon radius (viewBox units)
const RING = 168 // distance of the small moons from center
const SMALL = 20 // small moon radius
const CYCLE_MS = 16000 // one full lunation
const STATIC_PHASE = 0.36 // waxing gibbous, for reduced motion

// Lit portion of a moon at phase p (0 = new, 0.5 = full, 1 = new again)
function litPath(p: number, r: number, cx = 0, cy = 0) {
  const k = Math.cos(2 * Math.PI * p)
  const rx = Math.max(Math.abs(k) * r, 0.001)
  const waxing = p < 0.5
  const outerSweep = waxing ? 1 : 0
  const termSweep = waxing ? (k > 0 ? 0 : 1) : k > 0 ? 1 : 0
  return (
    `M${cx} ${cy - r}` +
    `A${r} ${r} 0 0 ${outerSweep} ${cx} ${cy + r}` +
    `A${rx} ${r} 0 0 ${termSweep} ${cx} ${cy - r}Z`
  )
}

const ringPhases = Array.from({ length: 8 }, (_, i) => i / 8)

export default function MoonPhases({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '')
  const lit = useRef<SVGPathElement>(null)
  const glow = useRef<SVGPathElement>(null)
  const clip = useRef<SVGPathElement>(null)
  const ring = useRef<SVGGElement>(null)

  useEffect(() => {
    const set = (p: number) => {
      const d = litPath(p, R)
      lit.current?.setAttribute('d', d)
      glow.current?.setAttribute('d', d)
      clip.current?.setAttribute('d', d)
      const active = Math.round(p * 8) % 8
      ring.current?.querySelectorAll('.moon-ring__moon').forEach((el, i) => {
        el.classList.toggle('is-active', i === active)
      })
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      set(STATIC_PHASE)
      return
    }

    let frame = 0
    // Start just after new moon so the first thing you see is a crescent growing
    const start = performance.now() - CYCLE_MS * 0.04
    const tick = (now: number) => {
      set(((now - start) % CYCLE_MS) / CYCLE_MS)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <svg className={className} viewBox="-260 -260 520 520" aria-hidden="true">
      <defs>
        <radialGradient id={`lit${uid}`} cx="35%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#FFFDF8" />
          <stop offset="55%" stopColor="#F5F0E8" />
          <stop offset="100%" stopColor="#D9CFC0" />
        </radialGradient>
        <radialGradient id={`glow${uid}`}>
          <stop offset="0%" stopColor="#F5F0E8" />
          <stop offset="45%" stopColor="#DA1A10" />
          <stop offset="100%" stopColor="#741734" />
        </radialGradient>
        <filter id={`blur${uid}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="34" />
        </filter>
        <clipPath id={`clip${uid}`}>
          <path ref={clip} />
        </clipPath>
      </defs>

      {/* Phase ring */}
      <circle r={RING} className="moon-ring__orbit" />
      <g ref={ring}>
        {ringPhases.map((p, i) => {
          const a = (-90 + i * 45) * (Math.PI / 180)
          const x = Math.cos(a) * RING
          const y = Math.sin(a) * RING
          return (
            <g className="moon-ring__moon" key={i}>
              <circle cx={x} cy={y} r={SMALL} className="moon-ring__outline" />
              {p > 0 && <path d={litPath(p, SMALL, x, y)} className="moon-ring__lit" />}
            </g>
          )
        })}
      </g>

      {/* Big moon: glow, dark disc, lit portion */}
      <path ref={glow} fill={`url(#glow${uid})`} filter={`url(#blur${uid})`} transform="scale(1.35)" opacity="0.85" />
      <circle r={R} className="moon-big__disc" />
      <path ref={lit} fill={`url(#lit${uid})`} />
      {/* Faint craters, visible only on the lit side */}
      <g clipPath={`url(#clip${uid})`} fill="#8C7A70" fillOpacity="0.14">
        <circle cx="-34" cy="-30" r="20" />
        <circle cx="28" cy="-46" r="11" />
        <circle cx="40" cy="18" r="24" />
        <circle cx="-22" cy="44" r="14" />
        <circle cx="-58" cy="12" r="9" />
        <circle cx="6" cy="72" r="8" />
      </g>
    </svg>
  )
}
