import { useSectionDesign } from '../../sectionDesigns'
import IntroMics from './IntroMics'
import IntroPoster from './IntroPoster'

// The statement right under the homepage hero, in the Round 2 design picked
// in the Explore Designs panel: the poster collage in two color treatments
// (IntroPoster.tsx) or the press conference microphones (IntroMics.tsx).
export default function NoteStatement() {
  const [design] = useSectionDesign('intro')
  if (design === 'micsA') return <IntroMics image="a" />
  return <IntroPoster variant={design} />
}
