import { Link } from 'react-router-dom'
import CtaBand from '../../components/CtaBand'
import { moons } from '../../components/moons'
import { pillars, tiers } from '../../content'
import { useOptions } from '../../options'

// Option B: editorial hero with a glowing moon cycling through its phases.
// Headline lines are staggered like a magazine cover and slide up in turn.
// The hero fills the first screen (see .lunar-hero in home.css).
const tileColors = ['tile--powder', 'tile--chartreuse', 'tile--crimson', 'tile--bordeaux']

export default function HomeBold() {
  const { moon } = useOptions()
  const Moon = moons[moon]
  // The collage moons run in a row under a big centered headline; every
  // other style sits beside the headline on the right
  const row = moon.startsWith('collage')
  const title = (
    <h1 className="lunar-hero__title">
      <span className="lunar-line lunar-line--1">Equity-centered</span>{' '}
      <span className="lunar-line lunar-line--2">advocacy strategy</span>{' '}
      <span className="lunar-line lunar-line--3">
        for <em>audacious</em>
      </span>{' '}
      <span className="lunar-line lunar-line--4">change.</span>
    </h1>
  )
  return (
    <>
      <section className={`lunar-hero${row ? ' lunar-hero--row' : ''}`}>
        {!row && <Moon key={moon} className={`lunar-hero__moon lunar-hero__moon--${moon}`} />}
        <div className="container lunar-hero__stage">
          {row ? (
            <div className="lunar-hero__center">
              {title}
              <Moon key={moon} className="lunar-hero__row" />
            </div>
          ) : (
            title
          )}
          <div className="lunar-hero__foot">
            <Link to="/contact" className="button button--cream">
              Let's Work Together
            </Link>
            <p>
              Working alongside nonprofits and coalitions ready to move from mission to movement:
              building advocacy programs that are strategic, values-driven, and built for the
              current political reality.
            </p>
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
