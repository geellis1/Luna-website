import { useSectionDesign } from '../sectionDesigns'
import { EditorialLetter, LetterCollage, SplitEditorial } from './contact/ContactDesigns'

// Contact page, in the Round 2 design picked in the Explore Section Designs
// panel: A Editorial Letter, B Letter + Collage or C Split Editorial. All
// submit the same way (contact/useContactForm.ts).
export default function Contact() {
  const [design] = useSectionDesign('contact')
  if (design === 'b') return <LetterCollage />
  if (design === 'c') return <SplitEditorial />
  return <EditorialLetter />
}
