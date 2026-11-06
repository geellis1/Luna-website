import type { CSSProperties } from 'react'

// Moon Collage: a row of cut-out moon photos with rough chartreuse outlines,
// under the big centered headline of the About page hero. Crescents wax to a
// half and a full moon in the middle, then wane in mirror image. Pieces fade
// up into place left to right, then float gently.
// Art: public/moons/*.webp (transparent cut-outs, outline drawn in).

const H = 148 // drawn height of each piece, outline included (old moon size)
const GAP = 52 // space between the half and full moons and their neighbors
const TIGHT = 22 // crescents nest closer together
const PAD = 24 // room around the row for floating

// Left to right; the waning side is the waxing art mirrored. `aspect` is
// width ÷ height, `size` shrinks the outermost crescents a little.
type Piece = { src: string; aspect: number; size?: number; flip?: boolean }
const crescentThin = { src: '/moons/crescent-thin.webp', aspect: 171 / 360, size: 0.86 }
const crescent = { src: '/moons/crescent.webp', aspect: 190 / 360 }
const crescentWide = { src: '/moons/crescent-wide.webp', aspect: 177 / 360 }
const half = { src: '/moons/half.webp', aspect: 202 / 360 }
const full = { src: '/moons/full.webp', aspect: 361 / 360 }
const pieces: Piece[] = [
  crescentThin,
  crescent,
  crescentWide,
  half,
  full,
  { ...half, flip: true },
  { ...crescentWide, flip: true },
  { ...crescent, flip: true },
  { ...crescentThin, flip: true },
]
const isCrescent = (p: Piece) => p.src.includes('crescent')

let cursor = 0
const tiles = pieces.map((t, i) => {
  if (i > 0) cursor += isCrescent(t) && isCrescent(pieces[i - 1]) ? TIGHT : GAP
  const h = H * (t.size ?? 1)
  const w = t.aspect * h
  const x = cursor // left edge
  cursor += w
  return { ...t, x, w, h }
})
const rowWidth = cursor
const vbWidth = rowWidth + PAD * 2
const viewBox = `${-PAD} ${-H / 2 - PAD} ${vbWidth} ${H + PAD * 2}`
// The old row was this wide (viewBox units). The row is sized against it in
// CSS so the moons stay the same size on screen.
const OLD_ROW = 1257

export default function MoonCollage({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={viewBox} style={{ '--row': vbWidth / OLD_ROW } as CSSProperties} aria-hidden="true">
      {tiles.map((t, i) => (
        <g
          key={i}
          className="collage-tile"
          // Moons start once the headline has settled, then follow slowly
          style={{ '--delay': `${0.8 + i * 0.32}s`, '--float-delay': `${-i * 1.1}s` } as CSSProperties}
        >
          <image
            href={t.src}
            x={t.x}
            y={-t.h / 2}
            width={t.w}
            height={t.h}
            transform={t.flip ? `translate(${t.x * 2 + t.w} 0) scale(-1 1)` : undefined}
          />
        </g>
      ))}
    </svg>
  )
}
