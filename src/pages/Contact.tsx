import { useSectionDesign } from '../sectionDesigns'
import { EditorialLetter, LetterCollage, SplitEditorial } from './contact/ContactDesigns'
import ContactCurrent from './contact/ContactCurrent'

// Contact page, in the Round 2 design picked in the Explore Section Designs
// panel (A Editorial Letter, B Letter + Collage, C Split Editorial), or the
// page as it was, kept as the fallback. All submit the same way
// (contact/useContactForm.ts).
export default function Contact() {
  const [design] = useSectionDesign('contact')
  if (design === 'a') return <EditorialLetter />
  if (design === 'b') return <LetterCollage />
  if (design === 'c') return <SplitEditorial />
  return <ContactCurrent />
}
