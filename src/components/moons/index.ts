import type { ComponentType } from 'react'
import CollageCream, { CollagePowder, CollageRose } from './MoonCollage'
import MoonHalo from './MoonHalo'

// Moon Halo (home option B) shows the halo; the collage styles are kept for
// reference but no longer offered as client choices.
export const moons: Record<string, ComponentType<{ className?: string }>> = {
  halo: MoonHalo,
  collage: CollageCream,
  'collage-powder': CollagePowder,
  'collage-rose': CollageRose,
}
