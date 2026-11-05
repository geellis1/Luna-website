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

// The note sits just past the end of "change.", below the photo above it.
// Measured from the headline itself, since the lines wrap differently at each
// window size: it starts level with the last line and then steps down until
// none of its (tilted) words come within 16px of the headline's letters.
function useNotePlacement() {
  const board = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = board.current
    if (!el) return
    const textRects = (node: Node | null | undefined) => {
      if (!node) return []
      const range = document.createRange()
      range.selectNodeContents(node)
      return [...range.getClientRects()]
    }
    const place = () => {
      const line = el.querySelector<HTMLElement>('h1 .scrap-line:last-child')
      const photo = el.querySelector<HTMLElement>('.scrap-card--meeting')
      const note = el.querySelector<HTMLElement>('.scrap-hero__note')
      if (!line || !photo || !note) return
      const box = el.getBoundingClientRect()
      const end = textRects(line.firstElementChild?.firstChild)[0]
      if (!end) return
      el.style.setProperty('--note-x', `${Math.round(end.right - box.left)}px`)

      // Each headline line's letters only: the browser's text box includes the
      // font's full ascent and descent, far above and below the capitals
      const h1 = el.querySelector('h1')
      if (!h1) return
      const pen = document.createElement('canvas').getContext('2d')
      if (!pen) return
      const style = getComputedStyle(h1)
      pen.font = `${style.fontSize} ${style.fontFamily}`
      const headline = [...el.querySelectorAll('h1 .scrap-line > span')].flatMap((s) => {
        const ink = pen.measureText((s.textContent ?? '').toUpperCase())
        return textRects(s.firstChild).map((r) => {
          const baseline = r.top + ink.fontBoundingBoxAscent
          return { left: r.left, right: r.right, top: baseline - ink.actualBoundingBoxAscent, bottom: baseline + ink.actualBoundingBoxDescent }
        })
      })
      const pad = 16
      const touches = () =>
        [...note.querySelectorAll('span')]
          .flatMap((s) => textRects(s.firstChild))
          .some((w) =>
            headline.some(
              (h) => w.left < h.right + pad && h.left < w.right + pad && w.top < h.bottom + pad && h.top < w.bottom + pad,
            ),
          )
      let top = Math.max(photo.offsetTop + photo.offsetHeight + 12, end.top - box.top)
      for (let step = 0; step < 60; step++) {
        el.style.setProperty('--note-y', `${Math.round(top)}px`)
        if (!touches()) break
        top += 4
      }

      // How far the note hangs below the headline, so the row beneath can
      // leave room for it
      const hang = note.getBoundingClientRect().bottom - el.getBoundingClientRect().bottom
      el.parentElement?.style.setProperty('--note-hang', `${Math.max(0, Math.round(hang))}px`)
    }
    place()
    document.fonts.ready.then(place)
    // Again once the headline lines have risen into place
    el.addEventListener('animationend', place)
    const ro = new ResizeObserver(place)
    ro.observe(el)
    return () => {
      ro.disconnect()
      el.removeEventListener('animationend', place)
    }
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
