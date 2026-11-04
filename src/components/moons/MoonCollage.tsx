import { useId, useRef, type CSSProperties } from 'react'
import { litPath, useMoonPhase } from './phase'

// Style 5 · Collage: a row of cut-out moons with rough, hand-drawn outlines,
// under a big centered headline. Pieces drop into place left to right, then
// float gently; a chartreuse outline tracks the current phase along the row.
// The moon surface is generated (fractal noise), not a photo.

const R = 68 // tile moon radius
const GAP = 142 // spacing between tile centers

// Left to right: the (empty) new moon, then waxing through full and waning
const tiles = [0, 0.07, 0.16, 0.25, 0.38, 0.5, 0.62, 0.75, 0.86].map((p, i) => ({
  p,
  x: (i - 4) * GAP,
  y: 0,
  tilt: [-3, 4, -2, 2, -3, 1, -2, 3, -4][i],
}))

// Which tile is nearest the current phase (wrapping around new moon)
const nearest = (p: number) => {
  let best = 0
  let dist = 2
  tiles.forEach((t, i) => {
    const d = Math.min(Math.abs(t.p - p), 1 - Math.abs(t.p - p))
    if (d < dist) {
      dist = d
      best = i
    }
  })
  return best
}

export default function MoonCollage({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '')
  const grid = useRef<SVGGElement>(null)

  useMoonPhase((p) => {
    const active = nearest(p)
    grid.current?.querySelectorAll('.collage-tile').forEach((el, i) => {
      el.classList.toggle('is-active', i === active)
    })
  })

  return (
    <svg className={className} viewBox="-660 -92 1320 184" aria-hidden="true">
      <defs>
        {/* Moon surface: fine grain plus darker "maria" patches, warm grey */}
        <filter id={`surface${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" seed="4" result="grain" />
          <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" seed="11" result="maria" />
          {/* Noise is colored and semi-transparent: flatten each to opaque grey first */}
          <feColorMatrix
            in="maria"
            values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1"
            result="mariaGrey"
          />
          <feComponentTransfer in="mariaGrey" result="mariaShapes">
            <feFuncR type="discrete" tableValues="1 1 1 0.66 0.58" />
            <feFuncG type="discrete" tableValues="1 1 1 0.66 0.58" />
            <feFuncB type="discrete" tableValues="1 1 1 0.66 0.58" />
          </feComponentTransfer>
          <feColorMatrix
            in="grain"
            values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1"
            result="greyGrain"
          />
          {/* Contrast, tinted slightly warm toward cream */}
          <feComponentTransfer in="greyGrain" result="contrast">
            <feFuncR type="linear" slope="1.6" intercept="0.02" />
            <feFuncG type="linear" slope="1.56" intercept="0.01" />
            <feFuncB type="linear" slope="1.48" intercept="-0.01" />
          </feComponentTransfer>
          <feBlend in="contrast" in2="mariaShapes" mode="multiply" result="grey" />
          {/* Map grey to brand tints: shadows Deep Crimson, highlights a light
              rose cream so the moons glow against the Night Bordeaux background */}
          <feColorMatrix
            in="grey"
            values="0.52 0 0 0 0.45
                    0.80 0 0 0 0.09
                    0.72 0 0 0 0.20
                    0    0 0 0 1"
            result="moon"
          />
          <feComposite in="moon" in2="SourceAlpha" operator="in" />
        </filter>
        {/* Wobbly, chalky edges for the outlines */}
        <filter id={`rough${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="2" />
          <feDisplacementMap in="SourceGraphic" scale="7" />
        </filter>
        {tiles.map((t, i) => (
          <clipPath id={`tile${uid}-${i}`} key={i}>
            <path d={litPath(t.p, R, t.x, t.y)} />
          </clipPath>
        ))}
      </defs>

      <g ref={grid}>
        {tiles.map((t, i) => {
          const shape = t.p === 0 ? `M${t.x - R} ${t.y}a${R} ${R} 0 1 0 ${R * 2} 0a${R} ${R} 0 1 0 ${-R * 2} 0` : litPath(t.p, R, t.x, t.y)
          return (
            <g
              key={i}
              className="collage-tile"
              style={{ '--tilt': `${t.tilt}deg`, '--delay': `${0.25 + i * 0.12}s` } as CSSProperties}
            >
              {t.p !== 0 && (
                <g clipPath={`url(#tile${uid}-${i})`}>
                  <circle cx={t.x} cy={t.y} r={R} fill="#fff" filter={`url(#surface${uid})`} />
                </g>
              )}
              <g filter={`url(#rough${uid})`} fill="none" strokeLinejoin="round">
                <path d={shape} className="collage-tile__line" strokeWidth="6" />
                <path
                  d={shape}
                  className="collage-tile__line"
                  strokeWidth="1.5"
                  transform={`translate(3 -2) rotate(1.5 ${t.x} ${t.y})`}
                />
              </g>
            </g>
          )
        })}
      </g>
    </svg>
  )
}
