import type { ComponentType } from 'react'
import { useOptions, type HomeOption } from '../../options'
import HomeBold from './HomeBold'
import HomeEditorial from './HomeEditorial'
import HomeMoonrise from './HomeMoonrise'
import './home.css'

const homes: Record<HomeOption, ComponentType> = {
  editorial: HomeEditorial,
  bold: HomeBold,
  moonrise: HomeMoonrise,
}

export default function Home() {
  const { home } = useOptions()
  const Page = homes[home]
  return <Page />
}
