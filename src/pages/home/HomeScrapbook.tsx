import { Link } from 'react-router-dom'
import { Ballot, Capitol, Megaphone, Rally } from '../../components/AdvocacyArt'
import { pillars, tiers } from '../../content'

// Option C: Scrapbook. A huge condensed serif headline on cream, with
// advocacy "photo" cut-outs tucked around it (some behind the letters, some in
// front) and a handwritten note that writes itself on. Deep color bands follow.
// Hero styles live in home.css under "Option C".
const tierAccents = ['card--powder', 'card--chartreuse', 'card--red']

const lines = ['Equity-centered', 'advocacy strategy', 'for audacious', 'change.']
const note = ["Let's move from", 'mission to', 'movement.']

export default function HomeScrapbook() {
  return (
    <>
      <section className="scrap-hero">
        <div className="container scrap-hero__stage">
          <p className="scrap-hero__eyebrow">Advocacy strategy for nonprofits and coalitions</p>

          <div className="scrap-hero__board">
            {/* Behind the letters */}
            <Rally className="scrap-card scrap-card--rally" />
            <Ballot className="scrap-card scrap-card--ballot" />

            <h1 className="scrap-hero__title">
              {lines.map((line, i) => (
                <span className="scrap-line" key={line}>
                  <span style={{ animationDelay: `${0.2 + i * 0.22}s` }}>{line}</span>
                </span>
              ))}
            </h1>

            {/* In front of the letters */}
            <Capitol className="scrap-card scrap-card--capitol" />
            <Megaphone className="scrap-card scrap-card--megaphone" />

            <p className="scrap-hero__note">
              {note.map((line, i) => (
                <span key={line} style={{ animationDelay: `${2.6 + i * 0.8}s` }}>
                  {line}
                </span>
              ))}
              <svg className="scrap-hero__scribble" viewBox="0 0 160 16" aria-hidden="true">
                <path d="M3 10c30-6 60-8 90-4s45 2 64-5" />
              </svg>
            </p>
          </div>

          <div className="scrap-hero__foot">
            <Link to="/contact" className="button button--crimson">
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
