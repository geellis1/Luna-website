import { useId, useRef } from 'react'
import { litPath, terminatorPath, useMoonPhase } from './phase'

// Style 4 · Line art: a fine-line astronomical drawing. Hatched lit side,
// a chartreuse terminator, tick marks, and a marker that travels the orbit.

const R = 104
const ORBIT = 176

const ticks = Array.from({ length: 48 }, (_, i) => i)

export default function MoonLine({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '')
  const lit = useRef<SVGPathElement>(null)
  const term = useRef<SVGPathElement>(null)
  const marker = useRef<SVGCircleElement>(null)

  useMoonPhase((p) => {
    lit.current?.setAttribute('d', litPath(p, R))
    term.current?.setAttribute('d', terminatorPath(p, R))
    const a = (-90 + p * 360) * (Math.PI / 180)
    marker.current?.setAttribute('cx', (Math.cos(a) * ORBIT).toFixed(2))
    marker.current?.setAttribute('cy', (Math.sin(a) * ORBIT).toFixed(2))
  })

  return (
    <svg
      className={className}
      viewBox="-260 -260 520 520"
      aria-hidden="true"
      fill="none"
      stroke="#F5F0E8"
      strokeWidth="1"
    >
      <defs>
        <pattern id={`hatch${uid}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <path d="M0 0V7" stroke="#F5F0E8" strokeWidth="1.4" />
        </pattern>
      </defs>

      {/* Outer instrument rings */}
      <circle r="236" strokeOpacity="0.25" />
      <circle r={ORBIT} strokeOpacity="0.5" strokeDasharray="2 6" />
      <circle r="132" strokeOpacity="0.35" />
      <g strokeOpacity="0.5">
        {ticks.map((i) => {
          const a = (i * 7.5 * Math.PI) / 180
          const len = i % 6 === 0 ? 16 : 7
          return (
            <line
              key={i}
              x1={Math.cos(a) * 236}
              y1={Math.sin(a) * 236}
              x2={Math.cos(a) * (236 - len)}
              y2={Math.sin(a) * (236 - len)}
            />
          )
        })}
      </g>
      <path d="M-250 0H-140M140 0H250M0 -250V-140M0 140V250" strokeOpacity="0.2" />

      {/* Moon */}
      <path ref={lit} fill={`url(#hatch${uid})`} stroke="none" />
      <circle r={R} strokeWidth="1.5" />
      <path ref={term} stroke="#D5E272" strokeWidth="2.5" />
      <circle ref={marker} r="7" fill="#D5E272" stroke="none" />
    </svg>
  )
}
