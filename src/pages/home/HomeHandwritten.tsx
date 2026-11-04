import { Link } from 'react-router-dom'
import BandSections from './BandSections'

// Option E: Handwritten. On cream, huge red brush script ("mission to /
// movement.") sprawls across the background and writes itself on; a small
// eyebrow and a centered serif statement sit on top. Hero styles live in
// home.css under "Option E".

export default function HomeHandwritten() {
  return (
    <>
      <section className="hand-hero">
        <div className="hand-hero__script" aria-hidden="true">
          <span className="hand-hero__word hand-hero__word--1">mission to</span>
          <span className="hand-hero__word hand-hero__word--2">movement.</span>
        </div>

        <div className="container hand-hero__stage">
          <div className="hand-hero__center">
            <p className="hand-hero__eyebrow">Luna Civic Strategies</p>
            <h1 className="hand-hero__title">
              Equity-centered advocacy strategy for <em>audacious change.</em>
            </h1>
          </div>

          <div className="hero-foot hand-hero__foot">
            <Link to="/contact" className="button button--hero">
              Let's Work Together
            </Link>
            <p>
              Working alongside nonprofits and coalitions ready to move from mission to movement:
              building advocacy programs that are strategic, values-driven, and built for the current
              political reality.
            </p>
          </div>
        </div>
      </section>

      <BandSections />
    </>
  )
}
