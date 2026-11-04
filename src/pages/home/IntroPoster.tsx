import { useEffect, useRef, useState } from 'react'
import './intro-poster.css'

// Intro Section: an editorial poster assembled from overlapping pieces of
// paper (after a Good Call Studio poster), in two color treatments:
//   a1 cream section, Deep Crimson base poster, powder-blue statement panel
//   a2 Night Bordeaux section, powder-blue base poster, crimson panel
// "Your mission deserves movement." fills the base poster; "We help you do
// something about it." runs down the tilted panel over its top-right corner;
// a handwritten note and the intro paragraph sit on paper over the edges.
// On first view: base poster → panel → notes → main type. Brand colors only.
// Styles: intro-poster.css.

const lede =
  'Progress is possible in even the most unlikely places, but it requires more than good intentions. It takes unwavering vision. It takes strategy grounded in lived experience. It takes technology to modernize movements. It takes commitment to the long game. And it takes someone who has been inside this work, not advising from a distance.'

// Broken like the poster's "EVERY / THING / YOU / NEED …", with a gap
// before the last lines; "ABOUT  IT." is spread to the panel's full width
const panelLines = ['We', 'help', 'you', 'do', null, 'some', 'thing', ['about', 'it.']] as const
const mainLines = ['Your mission', 'deserves', 'movement.']

export default function IntroPoster({ variant }: { variant: 'a1' | 'a2' }) {
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
    <section
      ref={ref}
      id="intro-statement"
      className={`section poster poster--${variant}${shown ? ' is-in' : ''}`}
    >
      <div className="poster__stage">
        {/* On phones the frame is a portrait poster and the sheet tucks under
            its lower edge; on wider screens the frame dissolves and every
            piece is placed on the stage */}
        <div className="poster__frame">
          <div className="poster__canvas" aria-hidden="true" />

          <h2 className="poster__main">
            {mainLines.map((line, i) => (
              <span key={line} className="poster__mask">
                <span style={{ transitionDelay: `${1.25 + i * 0.12}s` }}>{line}</span>
              </span>
            ))}
          </h2>

          <div className="poster__panel">
            <p className="poster__headline">
              <span className="sr-only">We help you do something about it.</span>
              <span aria-hidden="true">
                {panelLines.map((line, i) =>
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
            </p>
          </div>

          <p className="poster__note">Your mission has policy implications.</p>
        </div>

        <div className="poster__sheet">
          <p>{lede}</p>
        </div>
      </div>
    </section>
  )
}
