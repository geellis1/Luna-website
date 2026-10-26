import { Link } from 'react-router-dom'

export default function CtaBand() {
  return (
    <section className="section section--crimson cta-band">
      <div className="container">
        <h2>Let's Work Together</h2>
        <p className="lede">
          Every engagement begins with a conversation. Tell us about your work and your goals.
        </p>
        <Link to="/contact" className="button button--cream">
          Let's Work Together
        </Link>
      </div>
    </section>
  )
}
