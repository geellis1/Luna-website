import { Link } from 'react-router-dom'
import HowWeWork from './HowWeWork'
import NoteStatement from './NoteStatement'
import WhyLuna from './WhyLuna'

// The sections below the homepage hero: statement (notebook page), Why Luna
// and How we work together (both in the Round 2 design under review), CTA.

export default function BandSections() {
  return (
    <>
      <NoteStatement />

      <WhyLuna />

      <HowWeWork />

      <section className="section section--cream moon-cta">
        <div className="container">
          <h2>Let's Work Together.</h2>
          <Link to="/contact" className="button button--crimson">
            Let's Chat
          </Link>
        </div>
      </section>
    </>
  )
}
