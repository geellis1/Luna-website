import { useId, useRef, type CSSProperties } from 'react'
import { litExtent, litPath, useMoonPhase } from './phase'

// Moon Collage: a row of cut-out moons with rough, hand-drawn outlines, under
// the big centered headline of the About page hero. Pieces fade up into place left to right, then
// float gently; a chartreuse outline tracks the current phase along the row.
// The moon surface is generated (fractal noise), not a photo.

const R = 68 // tile moon radius
const SPACE = 44 // equal gap between the visible edges of neighboring moons
const PAD = 24 // room around the row for outlines and floating

// Left to right: the (empty) new moon, then waxing through full and waning.
// Crescents are much narrower than full moons, so each moon is placed by its
// visible width rather than on a fixed grid, giving even gaps between shapes.
const phases = [0, 0.07, 0.16, 0.25, 0.38, 0.5, 0.62, 0.75, 0.86]
const extents = phases.map((p) => litExtent(p, R))
const rowWidth = extents.reduce((w, e) => w + e.right - e.left, 0) + SPACE * (phases.length - 1)
let cursor = -rowWidth / 2
const tiles = phases.map((p, i) => {
  const { left, right } = extents[i]
  const x = cursor - left // moon center, so its visible left edge sits at cursor
  cursor += right - left + SPACE
  return { p, x, y: 0 }
})
const viewBox = `${-rowWidth / 2 - PAD} ${-R - PAD} ${rowWidth + PAD * 2} ${(R + PAD) * 2}`

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

// Grey surface → brand tint, as color-matrix rows (output = slope × grey + offset).
// Shadows go dark, highlights go to the named color.
const tints = {
  // Night Bordeaux shadows → warm ivory cream
  cream: '0.60 0 0 0 0.36  0.76 0 0 0 0.18  0.71 0 0 0 0.20  0 0 0 0 1',
  // Deep blue-crimson shadows → light powder blue
  powder: '0.61 0 0 0 0.24  0.72 0 0 0 0.18  0.66 0 0 0 0.30  0 0 0 0 1',
  // Deep Crimson shadows → light rose cream
  rose: '0.52 0 0 0 0.45  0.80 0 0 0 0.09  0.72 0 0 0 0.20  0 0 0 0 1',
}
type Tint = keyof typeof tints

// Cream moons by default; powder and rose are the other tints from review
export default function MoonCollage({ className, tint = 'cream' }: { className?: string; tint?: Tint }) {
  const uid = useId().replace(/:/g, '')
  const grid = useRef<SVGGElement>(null)

  useMoonPhase((p) => {
    const active = nearest(p)
    grid.current?.querySelectorAll('.collage-tile').forEach((el, i) => {
      el.classList.toggle('is-active', i === active)
    })
  })

  return (
    <svg className={className} viewBox={viewBox} aria-hidden="true">
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
          {/* Map grey to the chosen brand tint */}
          <feColorMatrix in="grey" values={tints[tint]} result="moon" />
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
              // Moons start once the headline has settled, then follow slowly
              style={{ '--delay': `${2 + i * 0.5}s`, '--float-delay': `${-i * 1.1}s` } as CSSProperties}
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
