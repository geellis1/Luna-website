// The moon's actual phase at a given moment, worked out in the browser from
// the date (no outside service). Uses the Sun–Moon elongation with the main
// corrections for the Moon's and Earth's uneven orbits (Jean Meeus,
// Astronomical Algorithms, ch. 47–48), good to within about an hour of the
// published phase times. Phase: 0 new → 0.25 first quarter → 0.5 full →
// 0.75 last quarter → 1.

const rad = Math.PI / 180

export function moonPhase(date: Date) {
  // Julian centuries since J2000
  const t = (date.getTime() / 86400000 + 2440587.5 - 2451545) / 36525
  const d = 297.8501921 + 445267.1114034 * t - 0.0018819 * t * t // mean elongation
  const m = 357.5291092 + 35999.0502909 * t - 0.0001536 * t * t // Sun's mean anomaly
  const mm = 134.9633964 + 477198.8675055 * t + 0.0087414 * t * t // Moon's mean anomaly
  // True elongation of the Moon from the Sun
  const e =
    d +
    6.289 * Math.sin(mm * rad) -
    2.1 * Math.sin(m * rad) +
    1.274 * Math.sin((2 * d - mm) * rad) +
    0.658 * Math.sin(2 * d * rad) +
    0.214 * Math.sin(2 * mm * rad) +
    0.11 * Math.sin(d * rad)
  return ((((e % 360) + 360) % 360) / 360)
}

// The phase and its name. The four main phases are moments, so each is named
// only within about half a day of it; between them the moon is a crescent or
// gibbous.
export function moonOn(date: Date) {
  const phase = moonPhase(date)
  const near = (target: number) => Math.abs(((phase - target + 1.5) % 1) - 0.5) < 0.017
  const name = near(0)
    ? 'New moon'
    : near(0.25)
      ? 'First quarter'
      : near(0.5)
        ? 'Full moon'
        : near(0.75)
          ? 'Last quarter'
          : phase < 0.25
            ? 'Waxing crescent'
            : phase < 0.5
              ? 'Waxing gibbous'
              : phase < 0.75
                ? 'Waning gibbous'
                : 'Waning crescent'
  return { phase, name }
}
