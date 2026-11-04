import type { ComponentType } from 'react'
import { useOptions, type HomeOption } from '../../options'
import HomeBold from './HomeBold'
import HomeEditorial from './HomeEditorial'
import HomeScrapbook from './HomeScrapbook'
import './home.css'

const homes: Record<HomeOption, ComponentType> = {
  editorial: HomeEditorial,
  bold: HomeBold,
  scrapbook: HomeScrapbook,
}

export default function Home() {
  const { home } = useOptions()
  const Page = homes[home]
  return <Page />
}
