import { useEffect, useRef, useState } from 'react'
import { useSectionDesign } from '../../sectionDesigns'
import IntroPoster from './IntroPoster'

// The statement right under the homepage hero. Half of it is handwritten on
// a torn notebook page; the rest sits beside it, monochrome: one deep tone of
// the section's own background color (powder blue, so it breaks from the
// cream hero). The page settles into place as it scrolls into view.
// Styles: "Note statement" in home.css.
//
// Round 2 review: this is option B of the Intro Section; option A is the
// editorial poster collage (IntroPoster.tsx).

export default function NoteStatement() {
  const [design] = useSectionDesign('intro')
  return design === 'notebook' ? <NotebookStatement /> : <IntroPoster />
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
      <div className="container note-statement__inner">
        <div className="paper">
          <span className="paper__holes" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} />
            ))}
          </span>
          <h2 className="paper__text">Your mission has policy implications.</h2>
        </div>

        <div className="note-statement__mono">
          <p className="note-statement__big">We help you do something about it.</p>
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
