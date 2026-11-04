import type { ComponentType } from 'react'
import type { MoonStyle } from '../../options'
import CollageCream, { CollagePowder, CollageRose } from './MoonCollage'
import MoonCapsules from './MoonCapsules'
import MoonHalo from './MoonHalo'

export const moons: Record<MoonStyle, ComponentType<{ className?: string }>> = {
  capsules: MoonCapsules,
  halo: MoonHalo,
  collage: CollageCream,
  'collage-powder': CollagePowder,
  'collage-rose': CollageRose,
}
