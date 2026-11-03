import { Fragment, useEffect, useState } from 'react'

type Segment = { text: string; em?: boolean }

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Types a headline out letter by letter. Every letter is rendered from the start
// (unrevealed ones are invisible), so the lines never reflow while typing.
export default function TypedHeadline({
  segments,
  startDelay = 0,
  speed = 38,
  className,
  onStart,
  onDone,
}: {
  segments: Segment[]
  startDelay?: number
  speed?: number
  className?: string
  onStart?: () => void
  onDone?: () => void
}) {
  const total = segments.reduce((n, s) => n + s.text.length, 0)
  const [shown, setShown] = useState(() => (reducedMotion() ? total : 0))

  useEffect(() => {
    if (reducedMotion()) {
      onDone?.()
      return
    }
    let timer: number
    let n = 0
    const start = window.setTimeout(() => {
      onStart?.()
      timer = window.setInterval(() => {
        n += 1
        setShown(n)
        if (n >= total) {
          window.clearInterval(timer)
          onDone?.()
        }
      }, speed)
    }, startDelay)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(timer)
    }
    // Runs once per mount; replays when the page is revisited
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let i = 0
  const typing = shown < total
  return (
    <h1 className={className}>
      <span className="sr-only">{segments.map((s) => s.text).join('')}</span>
      <span aria-hidden="true">
        {typing && shown === 0 && <span className="typed__caret" />}
        {segments.map((s, si) => {
          const letters = [...s.text].map((ch) => {
            const idx = i++
            return (
              <Fragment key={idx}>
                <span className={idx < shown ? undefined : 'typed--hidden'}>{ch}</span>
                {typing && idx === shown - 1 && <span className="typed__caret" />}
              </Fragment>
            )
          })
          return s.em ? <em key={si}>{letters}</em> : <Fragment key={si}>{letters}</Fragment>
        })}
      </span>
    </h1>
  )
}
