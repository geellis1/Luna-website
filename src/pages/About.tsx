import MoonCollage from '../components/moons/MoonCollage'
import Pillars from '../components/Pillars'
import CtaSection from './home/CtaSection'
import KelliBio from './KelliBio'

// Page header, laid out like the Services header (small label, large title on
// the left, intro on the right) in cream on Night Bordeaux, with a row of
// collage moons beneath it (styles: "About header" in index.css)
export default function About() {
  return (
    <>
      <section className="section section--bordeaux about-head">
        <div className="about-head__wrap">
          <div className="about-head__inner">
            <p className="about-head__kicker">About</p>
            <h1 className="about-head__title">Why Luna?</h1>
            <p className="about-head__lede">
              We understand what is at stake, and that limited capacity is often what stands between
              an organization and effective advocacy work. With experience spanning grassroots
              organizers, cross-sectional coalitions, public officials, and impacted communities, we
              bring the same clarity and care to every room we enter.
            </p>
          </div>
          <div className="about-head__moons">
            <MoonCollage className="about-head__collage" />
          </div>
          <div className="about-head__pillars">
            <Pillars />
          </div>
        </div>
      </section>

      <KelliBio />

      <CtaSection />
    </>
  )
}
