import type { CSSProperties } from 'react'
import { photos, unsplash, type PhotoKey } from '../../photos'

// Style 1 · Capsules: six tall capsules (3 × 2) beside the headline, in a
// checkerboard of advocacy photos and solid brand colors. They fade up into
// place one by one. Sized to the space beside the headline (see
// .lunar-hero__capsules in home.css).

type Tile = { photo: PhotoKey } | { color: 'red' | 'chartreuse' | 'powder' }

const tiles: Tile[] = [
  { photo: 'rally' },
  { color: 'red' },
  { photo: 'meeting' },
  { color: 'chartreuse' },
  { photo: 'hands' },
  { color: 'powder' },
]

export default function MoonCapsules({ className }: { className?: string }) {
  return (
    <div className={`capsules ${className ?? ''}`}>
      {tiles.map((t, i) => {
        const style = { '--i': i } as CSSProperties
        return 'photo' in t ? (
          <img
            key={i}
            className="capsule capsule--photo"
            src={unsplash(photos[t.photo].id, 480)}
            alt={photos[t.photo].alt}
            style={style}
          />
        ) : (
          <span key={i} className={`capsule capsule--${t.color}`} style={style} aria-hidden="true" />
        )
      })}
    </div>
  )
}
