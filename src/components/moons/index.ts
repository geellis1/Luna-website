import type { ComponentType } from 'react'
import type { MoonStyle } from '../../options'
import MoonCollage from './MoonCollage'
import MoonEclipse from './MoonEclipse'
import MoonHalo from './MoonHalo'
import MoonLine from './MoonLine'
import MoonRing from './MoonRing'

export const moons: Record<MoonStyle, ComponentType<{ className?: string }>> = {
  ring: MoonRing,
  halo: MoonHalo,
  eclipse: MoonEclipse,
  line: MoonLine,
  collage: MoonCollage,
}
