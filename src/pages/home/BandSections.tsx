import CtaSection from './CtaSection'
import HowWeWork from './HowWeWork'
import NoteStatement from './NoteStatement'
import WhyLuna from './WhyLuna'

// The sections below the homepage hero: the intro statement, Why Luna, How
// we work together and the invitation (each in the Round 2 design under
// review).

export default function BandSections() {
  return (
    <>
      <NoteStatement />

      <WhyLuna />

      <HowWeWork />

      <CtaSection />
    </>
  )
}
