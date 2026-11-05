import { Link } from 'react-router-dom'
import { photoSrc, photos } from '../../photos'
import BandSections from './BandSections'

// Homepage: Scrapbook. A huge condensed serif headline on cream, with advocacy
// photos tucked behind the letters, each peeking out from a gap: past a line's
// end, past the left edge, or between lines. Deep color bands follow
// (BandSections). Hero styles live in home.css under "Hero: Scrapbook".
const lines = ['Equity-centered', 'advocacy strategy', 'for audacious', 'change.']

// Placeholder photos (src/photos.ts), in the order they're placed
const cutouts = (['capitol', 'rally', 'hands', 'meeting'] as const).map((key) => ({ key, ...photos[key] }))

const headline = lines.map((line, i) => (
  <span className="scrap-line" key={line}>
    <span style={{ animationDelay: `${0.2 + i * 0.22}s` }}>{line}</span>
  </span>
))

export default function HomeScrapbook() {
  return (
    <>
      <section className="scrap-hero">
        <div className="container scrap-hero__stage">

          <div className="scrap-hero__board">
            {/* Photos sit behind the letters */}
            {cutouts.map((ph) => (
              <div key={ph.key} className={`scrap-card scrap-card--${ph.key}`}>
                <img src={photoSrc(ph)} alt={ph.alt} loading="eager" />
              </div>
            ))}

            <h1 className="scrap-hero__title">{headline}</h1>
          </div>

          <div className="hero-foot scrap-hero__foot">
            <Link to="/contact" className="button button--hero">
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

      <BandSections />
    </>
  )
}
