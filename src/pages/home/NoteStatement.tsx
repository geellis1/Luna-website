import { useSectionDesign } from '../../sectionDesigns'
import IntroPoster from './IntroPoster'

// The statement right under the homepage hero, in the Round 2 design picked
// in the Explore Designs panel: the poster collage in two color treatments
// (IntroPoster.tsx).
export default function NoteStatement() {
  const [design] = useSectionDesign('intro')
  return <IntroPoster variant={design} />
}
