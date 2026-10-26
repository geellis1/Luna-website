import Copy from '../components/Copy'
import CtaBand from '../components/CtaBand'
import Pillars from '../components/Pillars'
import { bio } from '../content'

export default function About() {
  return (
    <>
      <section className="section section--bordeaux page-hero">
        <div className="container">
          <h1>WHY LUNA?</h1>
          <p className="lede">
            We understand what is at stake, and that limited capacity is often what stands between
            an organization and effective advocacy work. With experience spanning grassroots
            organizers, cross-sectional coalitions, public officials, and impacted communities, we
            bring the same clarity and care to every room we enter.
          </p>
          <div style={{ marginTop: 'clamp(48px, 6vw, 88px)' }}>
            <Pillars />
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container split">
          {/* Photo placeholder: replace with Kelli's headshot */}
          <div className="photo-placeholder">Photo placeholder</div>
          <div>
            <h2>Hi, I'm Kelli.</h2>
            {bio.map((p, i) => (
              <p key={i}>
                <Copy text={p} />
              </p>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
