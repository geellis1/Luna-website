import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { photoSrc, photos } from '../../photos'
import { useSectionDesign } from '../../sectionDesigns'
import BandSections from './BandSections'

// Homepage: Scrapbook. A huge condensed serif headline on cream, with advocacy
// photos tucked behind the letters, each peeking out from a gap: past a line's
// end, past the left edge, or between lines. A handwritten note writes itself
// on. Deep color bands follow (BandSections). Hero styles live in home.css
// under "Hero: Scrapbook".
const lines = ['Equity-centered', 'advocacy strategy', 'for audacious', 'change.']

// Placeholder photos (src/photos.ts), in the order they're placed
const cutouts = (['capitol', 'rally', 'hands', 'meeting'] as const).map((key) => ({ key, ...photos[key] }))
const note = ["Let's move from", 'mission to', 'movement.']

const headline = lines.map((line, i) => (
  <span className="scrap-line" key={line}>
    <span style={{ animationDelay: `${0.2 + i * 0.22}s` }}>{line}</span>
  </span>
))

// Option A: each photo sits over the headline and carries its own copy of it,
// lined up with the real one, so letters crossing a photo show in cream. The
// copy is placed from the photo's offset in the board, kept current on resize.
function useAlignedCopies(on: boolean) {
  const board = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = board.current
    if (!on || !el) return
    const place = () => {
      el.style.setProperty('--board-w', `${el.offsetWidth}px`)
      el.querySelectorAll<HTMLElement>('.scrap-card').forEach((card) => {
        card.style.setProperty('--ox', `${card.offsetLeft}px`)
        card.style.setProperty('--oy', `${card.offsetTop}px`)
      })
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(el)
    return () => ro.disconnect()
  }, [on])
  return board
}

export default function HomeScrapbook() {
  const [design] = useSectionDesign('hero')
  const copies = design === 'a'
  const board = useAlignedCopies(copies)
  return (
    <>
      <section id="hero" className={`scrap-hero scrap-hero--${design}`}>
        <div className="container scrap-hero__stage">

          <div ref={board} className="scrap-hero__board">
            {cutouts.map((ph) => (
              <div key={ph.key} className={`scrap-card scrap-card--${ph.key}`}>
                <img src={photoSrc(ph)} alt={ph.alt} loading="eager" />
                {copies && (
                  <div className="scrap-hero__title scrap-card__copy" aria-hidden="true">
                    {headline}
                  </div>
                )}
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
