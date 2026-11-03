import { Link } from 'react-router-dom'
import CtaBand from '../../components/CtaBand'
import MoonPlaceholder from '../../components/MoonPlaceholder'
import Pillars from '../../components/Pillars'
import { tiers } from '../../content'

export default function HomeEditorial() {
  return (
    <>
      <section className="section--crimson hero">
        <div className="container split">
          <div>
            <h1>Equity-centered advocacy strategy for audacious change.</h1>
            <p className="lede">
              Working alongside nonprofits and coalitions ready to move from mission to movement:
              building advocacy programs that are strategic, values-driven, and built for the
              current political reality.
            </p>
            <Link to="/contact" className="button button--cream">
              Let's Work Together
            </Link>
          </div>
          <MoonPlaceholder />
        </div>
      </section>

      <section className="section section--cream statement">
        <div className="container">
          <h2>Your mission has policy implications. We help you do something about it.</h2>
          <div className="statement__body">
            <div className="statement__rule" aria-hidden="true" />
            <p className="lede">
              Progress is possible in even the most unlikely places, but it requires more than good
              intentions. It takes unwavering vision. It takes strategy grounded in lived
              experience. It takes technology to modernize movements. It takes commitment to the
              long game. And it takes someone who has been inside this work, not advising from a
              distance.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--bordeaux">
        <div className="container">
          <p className="eyebrow">Why Luna</p>
          <Pillars showDescriptions={false} />
        </div>
      </section>

      <section className="section section--cream">
        <div className="container">
          <div className="section-head">
            <h2>How we work together</h2>
            <Link to="/services" className="text-link">
              Explore services →
            </Link>
          </div>
          <div className="grid-3">
            {tiers.map((t) => (
              <Link to={`/services#${t.id}`} className="tier-card" key={t.id}>
                <div className="tier-card__label">{t.label}</div>
                <div className="tier-card__kind">{t.kind}</div>
                <p>{t.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
