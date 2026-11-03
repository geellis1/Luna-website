import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CtaBand from '../../components/CtaBand'
import TypedHeadline from '../../components/TypedHeadline'
import { pillars, tiers } from '../../content'

// Option B: a press-conference hero. The microphones rise into view, then the
// headline types out as if they're speaking it. Solid color tiles below.
// Headline + mics are sized to fit the first screen (see .bold-hero in home.css).
const tileColors = ['tile--powder', 'tile--chartreuse', 'tile--crimson', 'tile--bordeaux']

const headline = [
  { text: 'Equity-centered advocacy strategy for ' },
  { text: 'audacious', em: true },
  { text: ' change.' },
]

export default function HomeBold() {
  const [micsReady, setMicsReady] = useState(false)
  const [done, setDone] = useState(false)

  // Don't wait forever on a slow image: start anyway after 2.5s
  useEffect(() => {
    const t = window.setTimeout(() => setMicsReady(true), 2500)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <>
      <section className="section--crimson bold-hero">
        <div className="container bold-hero__stage">
          <TypedHeadline
            className="bold-hero__title"
            segments={headline}
            active={micsReady}
            startDelay={700}
            onDone={() => setDone(true)}
          />
          <div className={`bold-hero__mics${micsReady ? ' is-in' : ''}`}>
            <img
              src="/press-mics-960.webp"
              srcSet="/press-mics-960.webp 960w, /press-mics-1884.webp 1884w"
              sizes="(max-width: 1200px) 100vw, 1200px"
              width="1884"
              height="835"
              alt=""
              fetchPriority="high"
              ref={(img) => {
                if (img?.complete) setMicsReady(true)
              }}
              onLoad={() => setMicsReady(true)}
            />
          </div>
        </div>
      </section>

      <section className="section--crimson bold-intro">
        <div className="container">
          <div className={`bold-hero__foot${done ? ' is-in' : ''}`}>
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
