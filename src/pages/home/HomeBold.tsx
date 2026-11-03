import { Link } from 'react-router-dom'
import CtaBand from '../../components/CtaBand'
import MoonPlaceholder from '../../components/MoonPlaceholder'
import { pillars, tiers } from '../../content'

// Option B: oversized type, a moon cropped off the edge, solid color tiles.
const tileColors = ['tile--powder', 'tile--chartreuse', 'tile--crimson', 'tile--bordeaux']

export default function HomeBold() {
  return (
    <>
      <section className="section--crimson bold-hero">
        <MoonPlaceholder className="bold-hero__moon" />
        <div className="container bold-hero__inner">
          <h1 className="bold-hero__title">
            Equity-centered advocacy strategy for <em>audacious</em> change.
          </h1>
          <div className="bold-hero__foot">
            <p className="lede">
              Working alongside nonprofits and coalitions ready to move from mission to movement:
              building advocacy programs that are strategic, values-driven, and built for the
              current political reality.
            </p>
            <Link to="/contact" className="button button--cream">
              Let's Work Together
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container bold-statement">
          <h2>Your mission has policy implications. We help you do something about it.</h2>
          <p className="lede">
            Progress is possible in even the most unlikely places, but it requires more than good
            intentions. It takes unwavering vision. It takes strategy grounded in lived experience.
            It takes technology to modernize movements. It takes commitment to the long game. And
            it takes someone who has been inside this work, not advising from a distance.
          </p>
        </div>
      </section>

      <section className="section section--cream bold-why">
        <div className="container">
          <p className="eyebrow">Why Luna</p>
          <div className="bold-tiles">
            {pillars.map((p, i) => (
              <div className={`tile ${tileColors[i]}`} key={p.title}>
                <span className="tile__num">0{i + 1}</span>
                <h3>{p.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--bordeaux">
        <div className="container">
          <div className="section-head">
            <h2>How we work together</h2>
            <Link to="/services" className="text-link">
              Explore services →
            </Link>
          </div>
          {tiers.map((t) => (
            <Link to={`/services#${t.id}`} className="bold-row" key={t.id}>
              <span className="bold-row__label">{t.label}</span>
              <span className="bold-row__text">
                <span className="bold-row__kind">{t.kind}</span>
                {t.summary}
              </span>
              <span className="bold-row__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  )
}
