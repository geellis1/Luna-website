import type { ReactNode } from 'react'
import type { SectionDesign } from '../sectionDesigns'

// Small pictures of each Round 2 design, drawn in the brand colors, for the
// Explore Designs panel, favorites and the shared review page.

const C = {
  powder: '#9AB7D5',
  chartreuse: '#D5E272',
  crimson: '#741734',
  red: '#DA1A10',
  bordeaux: '#3E1921',
  cream: '#F5F0E8',
}
const tones = [C.powder, C.chartreuse, C.crimson]

// A small picture of one design. For How
// we work together, Option A's versions are a1 / a2.
export default function DesignThumb({ section, id }: { section: string; id: string }) {
  if (section === 'intro') return <IntroPreview id={id as SectionDesign<'intro'>} />
  return <WorkPreview id={id} />
}

function IntroPreview({ id }: { id: SectionDesign<'intro'> }) {
  const a1 = id === 'a1'
  return (
    <svg viewBox="0 0 120 64" className="sx-preview" aria-hidden="true">
      <rect width="120" height="64" fill={a1 ? C.cream : C.bordeaux} />
      <rect x="8" y="7" width="74" height="52" fill={a1 ? C.crimson : C.powder} />
      <rect x="14" y="22" width="50" height="8" fill={a1 ? C.cream : C.bordeaux} />
      <rect x="14" y="32" width="38" height="8" fill={a1 ? C.cream : C.bordeaux} />
      <rect x="14" y="42" width="46" height="8" fill={a1 ? C.cream : C.bordeaux} />
      <rect x="76" y="3" width="30" height="46" fill={a1 ? C.powder : C.crimson} transform="rotate(-4 91 26)" />
      <rect x="6" y="9" width="20" height="9" fill={a1 ? '#fff' : C.cream} transform="rotate(-8 16 13)" />
      <rect x="40" y="50" width="30" height="11" fill={C.chartreuse} transform="rotate(-3 55 55)" />
    </svg>
  )
}

function WorkPreview({ id }: { id: string }) {
  const frame = (children: ReactNode) => (
    <svg viewBox="0 0 120 64" className="sx-preview" aria-hidden="true">
      <rect width="120" height="64" fill={C.cream} />
      <rect x="8" y="12" width="28" height="5" rx="1" fill={C.bordeaux} />
      <rect x="8" y="20" width="22" height="5" rx="1" fill={C.bordeaux} />
      <rect x="8" y="28" width="26" height="5" rx="1" fill={C.bordeaux} />
      {children}
    </svg>
  )
  if (id === 'a2') {
    return frame(
      <>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${42 + i * 24} 58V24a11 11 0 0 1 22 0v34z`} fill={tones[i]} />
        ))}
        <rect x="46" y="42" width="12" height="3" fill={C.bordeaux} />
        <rect x="70" y="42" width="12" height="3" fill={C.bordeaux} />
        <rect x="94" y="42" width="12" height="3" fill={C.cream} />
      </>,
    )
  }
  switch (id === 'a1' ? 'a' : id) {
    case 'a':
      return frame(
        <>
          <path d="M42 58V27a17 17 0 0 1 34 0v31z" fill={tones[0]} />
          <path d="M79 58V22a7.5 7.5 0 0 1 15 0v36z" fill={tones[1]} />
          <path d="M97 58V22a7.5 7.5 0 0 1 15 0v36z" fill={tones[2]} />
          <rect x="47" y="40" width="18" height="4" fill={C.bordeaux} />
          <rect x="47" y="47" width="22" height="2" fill={C.bordeaux} opacity="0.6" />
        </>,
      )
    case 'b':
      return frame(
        <>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={50 + i * 20} y={i === 0 ? 4 : 9} width="16" height="40" rx="8" fill={tones[i]} />
          ))}
          <rect x="50" y="50" width="22" height="3" fill={C.bordeaux} />
          <rect x="50" y="56" width="34" height="2" fill={C.bordeaux} opacity="0.6" />
        </>,
      )
    case 'c':
      return frame(
        <>
          <rect x="44" y="10" width="44" height="46" fill={tones[0]} />
          <rect x="89" y="10" width="10" height="46" fill={tones[1]} />
          <rect x="100" y="10" width="10" height="46" fill={tones[2]} />
          <rect x="48" y="16" width="26" height="6" fill={C.bordeaux} />
          <rect x="60" y="42" width="24" height="2" fill={C.bordeaux} opacity="0.6" />
          <rect x="60" y="46" width="20" height="2" fill={C.bordeaux} opacity="0.6" />
        </>,
      )
  }
}


