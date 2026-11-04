import { useId, useRef } from 'react'
import { litPath, useMoonPhase } from './phase'

// Style 2 · Halo: dreamy, layered light. Blurred crimson and red auras, soft
// cream and powder rings, and a mottled moon whose shadow side is a cool
// powder blue with a soft terminator.

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
        <filter id={`soft${uid}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <filter id={`ringblur${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id={`edge${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        {/* Mottled surface: fractal noise tinted to cream / powder */}
        <filter id={`mottle${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="7" />
          <feColorMatrix
            values="0 0 0 0 0.60
                    0 0 0 0 0.72
                    0 0 0 0 0.84
                    2 0 0 0 -0.7"
          />
        </filter>
        <filter id={`haze${uid}`}>
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <radialGradient id={`lit${uid}`} cx="45%" cy="58%" r="72%">
          <stop offset="0%" stopColor="#FBEDE2" />
          <stop offset="60%" stopColor="#F3D8CB" />
          <stop offset="100%" stopColor="#E5A9A2" />
        </radialGradient>
        <linearGradient id={`band${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9AB7D5" stopOpacity="0.85" />
          <stop offset="35%" stopColor="#9AB7D5" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#9AB7D5" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`dark${uid}`} cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#9AB7D5" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#9AB7D5" stopOpacity="0.18" />
        </radialGradient>
        <mask id={`mask${uid}`}>
          <path ref={mask} fill="#fff" filter={`url(#edge${uid})`} />
        </mask>
        <clipPath id={`disc${uid}`}>
          <circle r={R} />
        </clipPath>
      </defs>

      {/* Auras */}
      <circle r="235" fill="#741734" opacity="0.55" filter={`url(#soft${uid})`} />
      <circle cy="14" r="180" fill="#DA1A10" opacity="0.32" filter={`url(#soft${uid})`} />
      <path ref={aura} fill="#F5F0E8" opacity="0.35" transform="scale(1.3)" filter={`url(#soft${uid})`} />

      {/* Soft nested rings, slightly offset like light through glass */}
      <circle r="168" fill="none" stroke="#F5F0E8" strokeOpacity="0.35" strokeWidth="10" filter={`url(#ringblur${uid})`} />
      <ellipse cy="-8" rx="134" ry="128" fill="none" stroke="#9AB7D5" strokeOpacity="0.6" strokeWidth="4" filter={`url(#ringblur${uid})`} />
      <circle cy="10" r="124" fill="none" stroke="#DA1A10" strokeOpacity="0.45" strokeWidth="6" filter={`url(#ringblur${uid})`} />

      {/* Moon: cool shadow side, then the lit side through a soft-edged mask */}
      <g clipPath={`url(#disc${uid})`}>
        <circle r={R} fill="#3E1921" />
        <circle r={R} fill={`url(#dark${uid})`} />
        <g mask={`url(#mask${uid})`} filter={`url(#haze${uid})`}>
          <circle r={R} fill={`url(#lit${uid})`} />
          {/* Cool powder band across the top, like light through tinted glass */}
          <circle r={R} fill={`url(#band${uid})`} />
          <rect x={-R} y={-R} width={R * 2} height={R * 2} filter={`url(#mottle${uid})`} opacity="0.7" />
        </g>
      </g>
    </svg>
  )
}
