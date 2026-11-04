import { useId, useRef } from 'react'
import { litPath, useMoonPhase } from './phase'

// Moon Halo: a recognizable, softly textured moon in brand tones (cream to
// muted rose, with burgundy seas and craters) inside one or two delicate
// orbital rings and a faint atmospheric glow. The lunar-phase detail is a
// crescent of shadow on the left that drifts slowly, so the moon always reads
// as a moon (never goes dark).
//
// The glow extends past the viewBox on purpose; the SVG has overflow: visible
// (see .lunar-hero__moon) so it fades out instead of ending in a box.

const R = 112

// Craters: [x, y, radius]. Each is a soft dark bowl with a faint lit rim.
const craters: [number, number, number][] = [
  [44, 40, 10],
  [-48, 18, 7],
  [12, -64, 6],
  [62, -28, 5.5],
  [-18, 70, 5],
  [-62, -40, 4.5],
  [30, 78, 4],
]

export default function MoonHalo({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '')
  const mask = useRef<SVGPathElement>(null)

  // Keep the phase within a waxing gibbous range so only a slim crescent of
  // shadow moves across the left edge
  useMoonPhase((p) => {
    const phase = 0.4 + 0.05 * Math.sin(2 * Math.PI * p)
    mask.current?.setAttribute('d', litPath(phase, R))
  })

  return (
    <svg className={className} viewBox="-260 -260 520 520" aria-hidden="true">
      <defs>
        <filter id={`glow${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="38" />
        </filter>
        <filter id={`terminator${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        {/* Fine surface grain in a muted burgundy */}
        <filter id={`grain${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" />
          <feColorMatrix
            values="0 0 0 0 0.45
                    0 0 0 0 0.09
                    0 0 0 0 0.20
                    1.6 0 0 0 -0.62"
          />
        </filter>
        {/* Lit surface: warm cream into a muted rose toward the limb */}
        <radialGradient id={`lit${uid}`} cx="58%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#F5F0E8" />
          <stop offset="55%" stopColor="#EEDDD3" />
          <stop offset="100%" stopColor="#D7B3AE" />
        </radialGradient>
        {/* Gentle limb darkening for dimension (not a glossy sphere) */}
        <radialGradient id={`limb${uid}`} cx="55%" cy="42%" r="62%">
          <stop offset="70%" stopColor="#741734" stopOpacity="0" />
          <stop offset="100%" stopColor="#741734" stopOpacity="0.22" />
        </radialGradient>
        <mask id={`lit-mask${uid}`}>
          <path ref={mask} fill="#fff" filter={`url(#terminator${uid})`} />
        </mask>
        <clipPath id={`disc${uid}`}>
          <circle r={R} />
        </clipPath>
      </defs>

      {/* Very soft atmospheric glow */}
      <circle r="190" fill="#741734" opacity="0.4" filter={`url(#glow${uid})`} />
      <circle r="130" fill="#E39AA6" opacity="0.12" filter={`url(#glow${uid})`} />

      {/* Two delicate orbital rings */}
      <circle r="160" fill="none" stroke="#F5F0E8" strokeOpacity="0.22" strokeWidth="1" />
      <ellipse rx="180" ry="168" fill="none" stroke="#E39AA6" strokeOpacity="0.16" strokeWidth="1" transform="rotate(-18)" />

      {/* Moon */}
      <g clipPath={`url(#disc${uid})`}>
        {/* Shadow side: burgundy with a faint crimson earthshine */}
        <circle r={R} fill="#3E1921" />
        <circle r={R} fill="#741734" opacity="0.45" />
        {/* Lit side through the soft-edged phase mask */}
        <g mask={`url(#lit-mask${uid})`}>
          <circle r={R} fill={`url(#lit${uid})`} />
          <rect x={-R} y={-R} width={R * 2} height={R * 2} filter={`url(#grain${uid})`} opacity="0.35" />
          {/* Seas: large soft darker patches */}
          <g fill="#741734">
            <ellipse cx="-24" cy="-24" rx="34" ry="24" opacity="0.13" transform="rotate(-20 -24 -24)" />
            <ellipse cx="28" cy="-6" rx="22" ry="28" opacity="0.11" />
            <ellipse cx="-6" cy="40" rx="30" ry="17" opacity="0.1" />
          </g>
          {/* Craters: dark bowl, lit lower-right rim */}
          {craters.map(([x, y, r]) => (
            <g key={`${x},${y}`}>
              <circle cx={x} cy={y} r={r} fill="#741734" opacity="0.2" />
              <path
                d={`M${x - r * 0.7} ${y + r * 0.7}A${r} ${r} 0 0 0 ${x + r * 0.7} ${y - r * 0.7}`}
                fill="none"
                stroke="#FFFDF8"
                strokeOpacity="0.6"
                strokeWidth="1.2"
              />
            </g>
          ))}
          <circle r={R} fill={`url(#limb${uid})`} />
        </g>
      </g>
      {/* A delicate illuminated edge defines the full circle */}
      <circle r={R} fill="none" stroke="#F5F0E8" strokeOpacity="0.35" strokeWidth="1" />
    </svg>
  )
}
