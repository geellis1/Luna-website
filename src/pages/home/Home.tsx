import type { ComponentType } from 'react'
import { useOptions, type HomeOption } from '../../options'
import HomeBold from './HomeBold'
import HomeEditorial from './HomeEditorial'
import HomeHandwritten from './HomeHandwritten'
import HomeScrapbook from './HomeScrapbook'
import './home.css'

// Option D shares option B's page, with capsules beside the headline
const HomeCapsules = () => <HomeBold capsules />

const homes: Record<HomeOption, ComponentType> = {
  editorial: HomeEditorial,
  moons: HomeBold,
  scrapbook: HomeScrapbook,
  capsules: HomeCapsules,
  handwritten: HomeHandwritten,
}

export default function Home() {
  const { home } = useOptions()
  const Page = homes[home]
  return <Page />
}
