import { Link } from 'react-router-dom'
import MoonPlaceholder from '../../components/MoonPlaceholder'
import { pillars, tiers } from '../../content'

// Option C: light cream hero with a centered moon, then deep color bands.
const tierAccents = ['card--powder', 'card--chartreuse', 'card--red']

export default function HomeMoonrise() {
  return (
    <>
      <section className="section--cream moon-hero">
        <div className="container moon-hero__inner">
          <MoonPlaceholder className="moon-hero__art" color="#741734" accent="#DA1A10" />
          <h1>Equity-centered advocacy strategy for audacious change.</h1>
          <p className="lede">
            Working alongside nonprofits and coalitions ready to move from mission to movement:
            building advocacy programs that are strategic, values-driven, and built for the current
            political reality.
          </p>
          <Link to="/contact" className="button button--crimson">
            Let's Work Together
          </Link>
        </div>
      </section>

      <section className="section section--crimson moon-statement">
        <div className="container">
          <h2>Your mission has policy implications. We help you do something about it.</h2>
          <p className="lede">
            Progress is possible in even the most unlikely places, but it requires more than good
            intentions. It takes unwavering vision. It takes strategy grounded in lived experience.
            It takes technology to modernize movements. It takes commitment to the long game. And
            it takes someone who has been inside this work, not advising from a distance.
          </p>
        </div>
      </section>

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

      <section className="section section--cream">
        <div className="container">
          <div className="section-head">
            <h2>How we work together</h2>
            <Link to="/services" className="text-link">
              Explore services →
            </Link>
          </div>
          <div className="grid-3">
            {tiers.map((t, i) => (
              <Link to={`/services#${t.id}`} className={`moon-card ${tierAccents[i]}`} key={t.id}>
                <div className="moon-card__band" />
                <div className="moon-card__body">
                  <div className="tier-card__kind">{t.kind}</div>
                  <div className="tier-card__label">{t.label}</div>
                  <p>{t.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
