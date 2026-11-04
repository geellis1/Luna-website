import { useId, useRef } from 'react'
import { litPath, useMoonPhase } from './phase'

// Style 2 · Halo: dreamy, layered light in brand tints. Blurred crimson and red
// auras, soft cream / powder / red / chartreuse rings, and a moon that warms
// from cream into crimson pinks, with a crimson shadow side washed in powder
// blue and a soft terminator.
//
// The auras extend past the viewBox on purpose; the SVG has overflow: visible
// (see .lunar-hero__moon) so the glow fades out instead of ending in a box.

const R = 112

export default function MoonHalo({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '')
  const mask = useRef<SVGPathElement>(null)
  const aura = useRef<SVGPathElement>(null)

  useMoonPhase((p) => {
    const d = litPath(p, R)
    mask.current?.setAttribute('d', d)
    aura.current?.setAttribute('d', d)
  })

  return (
    <svg className={className} viewBox="-260 -260 520 520" aria-hidden="true">
      <defs>
        <filter id={`soft${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="34" />
        </filter>
        <filter id={`ringblur${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id={`edge${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        {/* Mottled surface: fractal noise tinted Deep Crimson */}
        <filter id={`mottle${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="7" />
          <feColorMatrix
            values="0 0 0 0 0.45
                    0 0 0 0 0.09
                    0 0 0 0 0.20
                    2 0 0 0 -0.75"
          />
        </filter>
        <filter id={`haze${uid}`}>
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        {/* Lit side: cream core warming into red and crimson tints */}
        <radialGradient id={`lit${uid}`} cx="45%" cy="62%" r="72%">
          <stop offset="0%" stopColor="#F5F0E8" />
          <stop offset="35%" stopColor="#F3D3CC" />
          <stop offset="72%" stopColor="#E39AA6" />
          <stop offset="100%" stopColor="#B5577A" />
        </radialGradient>
        <linearGradient id={`band${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9AB7D5" stopOpacity="0.8" />
          <stop offset="30%" stopColor="#9AB7D5" stopOpacity="0.4" />
          <stop offset="55%" stopColor="#9AB7D5" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`dark${uid}`} cx="50%" cy="25%" r="85%">
          <stop offset="0%" stopColor="#9AB7D5" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#9AB7D5" stopOpacity="0.06" />
        </radialGradient>
        <mask id={`mask${uid}`}>
          <path ref={mask} fill="#fff" filter={`url(#edge${uid})`} />
        </mask>
        <clipPath id={`disc${uid}`}>
          <circle r={R} />
        </clipPath>
      </defs>

      {/* Auras */}
      <circle r="210" fill="#741734" opacity="0.7" filter={`url(#soft${uid})`} />
      <circle cy="16" r="160" fill="#DA1A10" opacity="0.38" filter={`url(#soft${uid})`} />
      <path ref={aura} fill="#E39AA6" opacity="0.4" transform="scale(1.3)" filter={`url(#soft${uid})`} />

      {/* Soft nested rings, slightly offset like light through glass */}
      <circle r="172" fill="none" stroke="#F5F0E8" strokeOpacity="0.2" strokeWidth="10" filter={`url(#ringblur${uid})`} />
      <ellipse cy="6" rx="152" ry="147" fill="none" stroke="#D5E272" strokeOpacity="0.45" strokeWidth="2" filter={`url(#ringblur${uid})`} />
      <ellipse cy="-8" rx="134" ry="128" fill="none" stroke="#9AB7D5" strokeOpacity="0.6" strokeWidth="4" filter={`url(#ringblur${uid})`} />
      <circle cy="10" r="124" fill="none" stroke="#DA1A10" strokeOpacity="0.55" strokeWidth="6" filter={`url(#ringblur${uid})`} />

      {/* Moon: crimson shadow side, then the lit side through a soft-edged mask */}
      <g clipPath={`url(#disc${uid})`}>
        <circle r={R} fill="#741734" />
        <circle r={R} fill={`url(#dark${uid})`} />
        <g mask={`url(#mask${uid})`} filter={`url(#haze${uid})`}>
          <circle r={R} fill={`url(#lit${uid})`} />
          {/* Cool powder band across the top, like light through tinted glass */}
          <circle r={R} fill={`url(#band${uid})`} />
          <rect x={-R} y={-R} width={R * 2} height={R * 2} filter={`url(#mottle${uid})`} opacity="0.45" />
        </g>
      </g>
    </svg>
  )
}
