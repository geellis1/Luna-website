import { useEffect, useRef, useState } from 'react'
import './intro-mics.css'

// Intro Section, "Press Conference": the headline above a large Night
// Bordeaux circle, with a bank of microphones rising over the circle's lower
// edge and standing on the section's bottom edge; the intro paragraph sits
// inside the circle. On first view the headline rises, the circle comes up
// like a moon, then the microphones slide up into place.
// The image is public/intro-mics.png: the microphones cut out of the
// reference poster (circle and background removed, white outlines kept).
// Styles: intro-mics.css.

const lede =
  'Progress is possible in even the most unlikely places, but it requires more than good intentions. It takes unwavering vision. It takes strategy grounded in lived experience. It takes technology to modernize movements. It takes commitment to the long game. And it takes someone who has been inside this work, not advising from a distance.'

export default function IntroMics() {
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
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} id="intro-statement" className={`section mics${shown ? ' is-in' : ''}`}>
      <h2 className="mics__title">
        <span className="mics__mask">
          <span>We help you do</span>
        </span>
        <span className="mics__mask">
          <span>something about it.</span>
        </span>
      </h2>
      <div className="mics__stage">
        <span className="mics__circle" aria-hidden="true" />
        <p className="mics__lede">{lede}</p>
        <img
          className="mics__img"
          src="/intro-mics.png"
          alt="A bank of press microphones"
          width="736"
          height="424"
          loading="lazy"
        />
      </div>
    </section>
  )
}
