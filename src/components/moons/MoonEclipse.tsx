import { useId, useRef } from 'react'
import { useMoonPhase } from './phase'

// Style 3 · Eclipse: flat, hard-edged color blocking (no gradients or blur).
// A cream disc over offset brand-color circles; a dark disc slides across it
// to make the phases, like a shadow passing over.

const R = 120

export default function MoonEclipse({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '')
  const shadow = useRef<SVGCircleElement>(null)

  useMoonPhase((p) => {
    // Waxing: shadow slides off to the left; waning: it slides back in from the right
    const x = p < 0.5 ? -4 * R * p : 4 * R * (1 - p)
    shadow.current?.setAttribute('cx', x.toFixed(2))
  })

  return (
    <svg className={className} viewBox="-260 -260 520 520" aria-hidden="true">
      <defs>
        <clipPath id={`disc${uid}`}>
          <circle r={R} />
        </clipPath>
      </defs>

      {/* Offset color blocks behind the moon */}
      <circle cx="46" cy="-38" r="196" fill="#741734" />
      <circle cx="-62" cy="58" r="150" fill="#DA1A10" />
      <circle cx="78" cy="88" r="74" fill="#D5E272" />
      <circle cx="-30" cy="-20" r="214" fill="none" stroke="#9AB7D5" strokeWidth="2" />

      {/* Moon */}
      <circle r={R} fill="#F5F0E8" />
      <g clipPath={`url(#disc${uid})`}>
        <circle ref={shadow} r={R} fill="#3E1921" />
      </g>
      <circle r={R} fill="none" stroke="#F5F0E8" strokeWidth="2" />
    </svg>
  )
}
