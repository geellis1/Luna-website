import type { CSSProperties } from 'react'
import MoonCollage from '../components/moons/MoonCollage'
import Pillars from '../components/Pillars'
import CtaSection from './home/CtaSection'
import KelliBio from './KelliBio'

// Hero: a big centered headline whose letters rise into place, with a row of
// collage moons drawing in beneath it (styles: "About hero" in index.css)
const title = 'WHY LUNA?'

export default function About() {
  return (
    <>
      <section className="section section--bordeaux about-hero">
        <div className="container">
          <div className="about-hero__center">
            <h1 className="about-hero__title">
              <span className="sr-only">{title}</span>
              <span aria-hidden="true">
                {[...title].map((ch, i) =>
                  ch === ' ' ? (
                    ' '
                  ) : (
                    <span key={i} className="about-hero__char" style={{ '--i': i } as CSSProperties}>
                      {ch}
                    </span>
                  ),
                )}
              </span>
            </h1>
            <MoonCollage className="about-hero__moons" />
          </div>
          <p className="lede about-hero__lede">
            We understand what is at stake, and that limited capacity is often what stands between
            an organization and effective advocacy work. With experience spanning grassroots
            organizers, cross-sectional coalitions, public officials, and impacted communities, we
            bring the same clarity and care to every room we enter.
          </p>
          <Pillars />
        </div>
      </section>

      <KelliBio />

      <CtaSection section="ctaAbout" />
    </>
  )
}
