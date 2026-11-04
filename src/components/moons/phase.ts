import { useEffect, useRef } from 'react'

// Shared moon-phase math and timing for every moon style.
// Phase p: 0 = new moon, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter.

const CYCLE_MS = 16000 // one full lunation
const STATIC_PHASE = 0.36 // waxing gibbous, shown when motion is reduced

// Lit portion of a moon of radius r at phase p
export function litPath(p: number, r: number, cx = 0, cy = 0) {
  const k = Math.cos(2 * Math.PI * p)
  const rx = Math.max(Math.abs(k) * r, 0.001)
  const waxing = p < 0.5
  const outerSweep = waxing ? 1 : 0
  const termSweep = waxing ? (k > 0 ? 0 : 1) : k > 0 ? 1 : 0
  return (
    `M${cx} ${cy - r}` +
    `A${r} ${r} 0 0 ${outerSweep} ${cx} ${cy + r}` +
    `A${rx} ${r} 0 0 ${termSweep} ${cx} ${cy - r}Z`
  )
}

// Just the terminator (the line between light and dark), top to bottom
export function terminatorPath(p: number, r: number, cx = 0, cy = 0) {
  const k = Math.cos(2 * Math.PI * p)
  const rx = Math.max(Math.abs(k) * r, 0.001)
  const waxing = p < 0.5
  // Same curve as in litPath, drawn in the opposite direction
  const sweep = waxing ? (k > 0 ? 1 : 0) : k > 0 ? 0 : 1
  return `M${cx} ${cy - r}A${rx} ${r} 0 0 ${sweep} ${cx} ${cy + r}`
}

// Calls onPhase every frame with the current phase (or once, statically,
// for reduced motion). onPhase should update the DOM directly via refs.
export function useMoonPhase(onPhase: (p: number) => void) {
  const cb = useRef(onPhase)
  useEffect(() => {
    cb.current = onPhase
  })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cb.current(STATIC_PHASE)
      return
    }
    let frame = 0
    // Start just after new moon so the first thing you see is a crescent growing
    const start = performance.now() - CYCLE_MS * 0.04
    const tick = (now: number) => {
      cb.current(((now - start) % CYCLE_MS) / CYCLE_MS)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])
}
