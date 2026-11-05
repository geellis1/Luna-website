import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { photoSrc, photos } from '../../photos'
import BandSections from './BandSections'

// Homepage: Scrapbook. A huge condensed serif headline on cream, with advocacy
// photos tucked behind the letters, each peeking out from a gap: past a line's
// end, past the left edge, or between lines. A handwritten note writes itself
// on. Deep color bands follow (BandSections). Hero styles live in home.css
// under "Hero: Scrapbook".
const lines = ['Equity-centered', 'advocacy strategy', 'for audacious', 'change.']

// Placeholder photos (src/photos.ts), in the order they're placed
const cutouts = (['capitol', 'rally', 'hands', 'meeting'] as const).map((key) => ({ key, ...photos[key] }))
const note = ['Built for', 'the moment', 'we are in.']

const headline = lines.map((line, i) => (
  <span className="scrap-line" key={line}>
    <span style={{ animationDelay: `${0.2 + i * 0.22}s` }}>{line}</span>
  </span>
))

// The note sits just past the end of "change.", level with that line but
// never higher than the bottom of the photo above it. Measured from the
// headline itself, since the lines wrap differently at each window size.
function useNotePlacement() {
  const board = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = board.current
    if (!el) return
    const place = () => {
      const line = el.querySelector<HTMLElement>('h1 .scrap-line:last-child')
      const photo = el.querySelector<HTMLElement>('.scrap-card--meeting')
      if (!line || !photo) return
      const box = el.getBoundingClientRect()
      const words = line.firstElementChild?.firstChild
      if (!words) return
      const text = document.createRange()
      text.selectNodeContents(words)
      const end = text.getBoundingClientRect().right - box.left
      const top = Math.max(line.getBoundingClientRect().top - box.top, photo.offsetTop + photo.offsetHeight + 12)
      el.style.setProperty('--note-x', `${Math.round(end)}px`)
      el.style.setProperty('--note-y', `${Math.round(top)}px`)
    }
    place()
    document.fonts.ready.then(place)
    const ro = new ResizeObserver(place)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return board
}

export default function HomeScrapbook() {
  const board = useNotePlacement()
  return (
    <>
      <section className="scrap-hero">
        <div className="container scrap-hero__stage">

          <div ref={board} className="scrap-hero__board">
            {/* Photos sit behind the letters */}
            {cutouts.map((ph) => (
              <div key={ph.key} className={`scrap-card scrap-card--${ph.key}`}>
                <img src={photoSrc(ph)} alt={ph.alt} loading="eager" />
              </div>
            ))}

            <h1 className="scrap-hero__title">{headline}</h1>

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
