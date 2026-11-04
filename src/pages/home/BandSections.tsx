import { Link } from 'react-router-dom'
import { pillars } from '../../content'
import HowWeWork from './HowWeWork'
import NoteStatement from './NoteStatement'

// The sections below the homepage hero: statement (notebook page), Why Luna
// list, How we work together (HowWeWork, in the Round 2 design under
// review), CTA.

export default function BandSections() {
  return (
    <>
      <NoteStatement />

      <section className="section section--bordeaux">
        <div className="container moon-why">
          <h2>Why Luna</h2>
          <ol className="moon-list">
            {pillars.map((p, i) => (
              <li key={p.title}>
                <span className="moon-list__num">0{i + 1}</span>
                <span className="moon-list__title">{p.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

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
