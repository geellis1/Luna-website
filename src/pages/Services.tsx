import { useSectionDesign } from '../sectionDesigns'
import { ServicesAccordion, ServicesBlocks } from './services/ServicesDesigns'

// Services page, in the Round 2 layout picked in the Explore Designs panel:
// A Horizontal Accordion or B Editorial Chapters. Both carry the same
// content (tiers in content.ts) and end with the shared CTA band.
export default function Services() {
  const [design] = useSectionDesign('services')
  if (design === 'b') return <ServicesBlocks />
  return <ServicesAccordion />
}
