import { useEffect, useRef, useState } from 'react'
import './intro-poster.css'

// Intro Section, option A: an editorial poster assembled from overlapping
// pieces of paper (after a Good Call Studio poster). A powder-blue canvas; a
// tall crimson headline panel tilted over its top-right edge; a peach
// handwritten note upper left; the intro paragraph on a pale chartreuse sheet
// lower left; "From mission to movement." huge along the canvas bottom.
// Pieces assemble in turn as the section scrolls into view, then stay put.
// Styles: intro-poster.css.

const lede =
  'Progress is possible in even the most unlikely places, but it requires more than good intentions. It takes unwavering vision. It takes strategy grounded in lived experience. It takes technology to modernize movements. It takes commitment to the long game. And it takes someone who has been inside this work, not advising from a distance.'

// The headline broken like the poster's "EVERY / THING / YOU / NEED …",
// with a gap before the last lines; "ABOUT   IT." is spread to full width
const headline = ['We', 'help', 'you', 'do', null, 'some', 'thing', ['about', 'it.']] as const

export default function IntroPoster() {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} id="intro-statement" className={`section poster${shown ? ' is-in' : ''}`}>
      <div className="poster__stage">
        {/* On phones the frame is the portrait poster and the sheet tucks
            under its lower edge; on wider screens the frame dissolves and
            every piece is placed on the stage */}
        <div className="poster__frame">
          <div className="poster__canvas" aria-hidden="true" />

          <p className="poster__brand">Luna Civic Strategies</p>
          <p className="poster__aside">
            <span aria-hidden="true">(</span>
            <span>Equity-centered advocacy strategy for audacious change.</span>
            <span aria-hidden="true">)</span>
          </p>

          <div className="poster__panel">
            <h2 className="poster__headline">
              <span className="sr-only">We help you do something about it.</span>
              <span aria-hidden="true">
                {headline.map((line, i) =>
                  line === null ? (
                    <span key={i} className="poster__gap" />
                  ) : typeof line === 'string' ? (
                    <span key={i} className="poster__hline">
                      {line}
                    </span>
                  ) : (
                    <span key={i} className="poster__hline poster__hline--spread">
                      <span>{line[0]}</span>
                      <span>{line[1]}</span>
                    </span>
                  ),
                )}
              </span>
            </h2>
          </div>

          <p className="poster__note">Your mission has policy implications.</p>

          <p className="poster__big">
            <span>From mission</span> <span>to movement.</span>
          </p>
        </div>

        <div className="poster__sheet">
          <p>{lede}</p>
        </div>
      </div>
    </section>
  )
}
