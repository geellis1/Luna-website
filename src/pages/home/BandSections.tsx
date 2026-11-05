import HowWeWork from './HowWeWork'
import NoteStatement from './NoteStatement'
import WhyLuna from './WhyLuna'

// The sections below the homepage hero: the intro statement, Why Luna and
// How we work together. (The footer's lead-in band closes the page.)

export default function BandSections() {
  return (
    <>
      <NoteStatement />

      <WhyLuna />

      <HowWeWork />
    </>
  )
}
