import { useEffect, useRef, useState } from 'react'
import './intro-mics.css'

// Intro Section, "Microphones": on Powder Blue, an editorial headline above
// a Deep Crimson circle holding a short statement, with a cluster of press
// microphones rising from the section's bottom edge over the circle's lower
// fifth. On first view the headline fades in, the circle settles, the
// statement appears, then the microphones rise into place.
// Image A is public/intro-mics-a.webp (Adobe Stock 76367953, cut out of its
// white background). A second photo (Image B) can be added to `images`.
// The original long paragraph is kept in content.ts (introLongCopy).
// Styles: intro-mics.css.

const images = {
  a: { src: '/intro-mics-a.webp', width: 1240, height: 594 },
}

export default function IntroMics({ image }: { image: keyof typeof images }) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)
  const img = images[image]

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
    <section ref={ref} id="intro-statement" className={`section mics${shown ? ' is-in' : ''}`}>
      <h2 className="mics__title">We help you do something about it.</h2>
      <div className="mics__stage" style={{ '--ratio': img.height / img.width } as React.CSSProperties}>
        <div className="mics__circle">
          <p className="mics__text">
            <span className="mics__small">
              Progress takes more than <br />
              good intentions.
            </span>
            <span className="mics__big">
              It takes <em>vision.</em>
            </span>
            <span className="mics__big">Experience.</span>
            <span className="mics__big">
              <em>Commitment.</em>
            </span>
            <span className="mics__small mics__small--accent">And people who know the work.</span>
          </p>
        </div>
        <img
          className="mics__img"
          src={img.src}
          alt="A cluster of press microphones on stands"
          width={img.width}
          height={img.height}
          loading="lazy"
        />
      </div>
    </section>
  )
}
