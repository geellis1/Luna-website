import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useSectionDesign } from '../../sectionDesigns'
import IntroPoster from './IntroPoster'

// The statement right under the homepage hero. Half of it is handwritten on
// a large torn notebook page; the headline and paragraph sit beside it in
// cream, on Deep Crimson (a step between the cream hero and the Night
// Bordeaux Why Luna below). The page settles in, the handwriting writes
// itself on line by line, then the headline rises in.
// Styles: "Note statement" in home.css.
//
// Round 2 review: this is the Intro Section's "Advocacy Notebook" option; the
// others are the poster collage in two color treatments (IntroPoster.tsx).

export default function NoteStatement() {
  const [design] = useSectionDesign('intro')
  return design === 'notebook' ? <NotebookStatement /> : <IntroPoster variant={design} />
}

function NotebookStatement() {
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
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} id="intro-statement" className={`section note-statement${shown ? ' is-shown' : ''}`}>
      <div className="note-statement__inner">
        <div className="paper">
          <span className="paper__holes" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} />
            ))}
          </span>
          {/* Written on line by line once the page has settled */}
          <h2 className="paper__text">
            <span className="sr-only">Your mission has policy implications.</span>
            <span aria-hidden="true">
              {['Your mission', 'has policy', 'implications.'].map((line, i) => (
                <span key={line} className="paper__line" style={{ '--i': i } as CSSProperties}>
                  {line}
                </span>
              ))}
            </span>
          </h2>
        </div>

        <div className="note-statement__mono">
          <p className="note-statement__big">
            {['We help you', 'do something', 'about it.'].map((line, i) => (
              <span key={line} className="note-statement__mask">
                <span style={{ '--i': i } as CSSProperties}>{line}</span>
              </span>
            ))}
          </p>
          <p className="note-statement__body">
            Progress is possible in even the most unlikely places, but it requires more than good
            intentions. It takes unwavering vision. It takes strategy grounded in lived experience.
            It takes technology to modernize movements. It takes commitment to the long game. And
            it takes someone who has been inside this work, not advising from a distance.
          </p>
        </div>
      </div>
    </section>
  )
}
