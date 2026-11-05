import type { ReactNode } from 'react'
import { bodyFontStacks, type SectionDesign } from '../sectionDesigns'
import { headshots } from '../pages/headshots'

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

// A small picture of one design (headshots show the photo itself). For How
// we work together, Option A's versions are a1 / a2.
export default function DesignThumb({ section, id }: { section: string; id: string }) {
  if (section === 'aboutHeadshot') {
    const photo = headshots[id as SectionDesign<'aboutHeadshot'>]
    return <img className="sx-preview sx-preview--photo" src={photo.src} alt="" />
  }
  if (section === 'whyLuna') return <WhyPreview id={id as SectionDesign<'whyLuna'>} />
  if (section === 'intro') return <IntroPreview id={id as SectionDesign<'intro'>} />
  if (section.startsWith('cta')) {
    // Option C's backgrounds: "c" (Night Bordeaux) and "c-powder"
    if (id.startsWith('c')) return <CtaPreview id="c" bg={id === 'c-powder' ? C.powder : C.bordeaux} />
    return <CtaPreview id={id as SectionDesign<'cta'>} />
  }
  if (section === 'contact') return <ContactPreview id={id as SectionDesign<'contact'>} />
  if (section === 'services') return <ServicesPreview id={id as SectionDesign<'services'>} />
  if (section === 'bodyFont') return <FontPreview id={id as SectionDesign<'bodyFont'>} />
  return <WorkPreview id={id} />
}

// A type specimen, set in the font itself
function FontPreview({ id }: { id: SectionDesign<'bodyFont'> }) {
  return (
    <div className="sx-preview sx-preview--font" style={{ fontFamily: bodyFontStacks[id] }}>
      Aa
    </div>
  )
}

function ContactPreview({ id }: { id: SectionDesign<'contact'> }) {
  // Letter lines with blanks, drawn at a position and width
  const letter = (x: number, w: number) => (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={x} y={18 + i * 7} width={w * 0.5} height="2" fill={C.bordeaux} opacity="0.7" />
          <rect x={x + w * 0.55} y={19.5 + i * 7} width={w * 0.35} height="0.7" fill={C.crimson} />
        </g>
      ))}
      <rect x={x} y="54" width="16" height="4" rx="2" fill={C.crimson} />
    </>
  )
  return (
    <svg viewBox="0 0 120 64" className="sx-preview" aria-hidden="true">
      <rect width="120" height="64" fill={C.cream} />
      {id === 'a' && (
        <>
          <rect x="30" y="4" width="60" height="5" fill={C.bordeaux} />
          <rect x="22" y="12" width="76" height="48" rx="5" fill="none" stroke={C.bordeaux} strokeWidth="0.8" />
          {letter(28, 64)}
        </>
      )}
      {id === 'b' && (
        <>
          <rect x="6" y="6" width="38" height="8" fill={C.bordeaux} />
          <circle cx="30" cy="40" r="12" fill={C.powder} />
          <rect x="8" y="30" width="22" height="16" fill={C.crimson} transform="rotate(-4 19 38)" />
          <rect x="24" y="44" width="20" height="10" fill="#fff" transform="rotate(5 34 49)" />
          <rect x="52" y="8" width="62" height="52" rx="5" fill="#fff" stroke={C.bordeaux} strokeWidth="0.6" />
          {letter(58, 50)}
        </>
      )}
      {id === 'c' && (
        <>
          <rect width="48" height="64" fill={C.crimson} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="7" y={12 + i * 10} width={[30, 36, 16, 34][i]} height="7" fill={C.cream} />
          ))}
          {letter(56, 56)}
        </>
      )}
    </svg>
  )
}

function CtaPreview({ id, bg = C.cream }: { id: SectionDesign<'cta'>; bg?: string }) {
  return (
    <svg viewBox="0 0 120 64" className="sx-preview" aria-hidden="true">
      <rect width="120" height="64" fill={bg} />
      {id === 'a' && (
        <>
          <rect x="8" y="8" width="104" height="48" rx="7" fill={C.crimson} />
          <rect x="16" y="20" width="44" height="7" fill={C.cream} />
          <rect x="16" y="30" width="34" height="7" fill={C.cream} />
          <rect x="16" y="43" width="20" height="6" rx="3" fill={C.chartreuse} />
          <circle cx="92" cy="32" r="16" fill="none" stroke={C.cream} strokeWidth="0.8" opacity="0.6" />
          <circle cx="92" cy="32" r="8" fill={C.cream} />
        </>
      )}
      {id === 'b' && (
        <>
          <rect x="10" y="16" width="62" height="10" fill={C.bordeaux} />
          <rect x="30" y="30" width="54" height="10" fill={C.powder} />
          <rect x="10" y="48" width="30" height="2" fill={C.bordeaux} opacity="0.6" />
          <circle cx="100" cy="35" r="11" fill="none" stroke={C.bordeaux} strokeWidth="1.2" />
          <path d="M96 39l8-8M99 31h5v5" fill="none" stroke={C.bordeaux} strokeWidth="1.2" />
        </>
      )}
      {id === 'c' && (
        <>
          <path d="M15 8h45v48H15a7 7 0 0 1-7-7V15a7 7 0 0 1 7-7z" fill={C.crimson} />
          <path d="M60 8h45a7 7 0 0 1 7 7v34a7 7 0 0 1-7 7H60z" fill={C.powder} />
          <rect x="16" y="20" width="34" height="7" fill={C.cream} />
          <rect x="16" y="30" width="26" height="7" fill={C.cream} />
          <circle cx="86" cy="28" r="12" fill={C.cream} />
          <rect x="72" y="45" width="26" height="6" rx="3" fill={C.bordeaux} />
        </>
      )}
    </svg>
  )
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

function WhyPreview({ id }: { id: SectionDesign<'whyLuna'> }) {
  return id === 'b' ? (
    <svg viewBox="0 0 120 64" className="sx-preview" aria-hidden="true">
      <rect width="120" height="64" fill={C.bordeaux} />
      <rect x="8" y="9" width="70" height="11" fill={C.cream} />
      <rect x="30" y="24" width="82" height="11" fill={C.powder} />
      <rect x="8" y="39" width="56" height="11" fill={C.cream} />
      <rect x="70" y="39" width="30" height="11" fill={C.chartreuse} />
      <rect x="8" y="55" width="22" height="2" fill={C.cream} opacity="0.6" />
      <rect x="86" y="55" width="26" height="2" fill={C.cream} opacity="0.6" />
    </svg>
  ) : (
    <svg viewBox="0 0 120 64" className="sx-preview" aria-hidden="true">
      <rect width="120" height="64" fill={C.cream} />
      <circle cx="84" cy="30" r="22" fill={C.powder} />
      <rect x="62" y="12" width="30" height="36" fill="#8E7F78" transform="rotate(-4 77 30)" />
      <rect x="18" y="34" width="26" height="22" fill="#6f6560" transform="rotate(5 31 45)" />
      <rect x="40" y="8" width="16" height="16" fill={C.chartreuse} transform="rotate(10 48 16)" />
      <rect x="8" y="10" width="34" height="7" fill={C.bordeaux} />
      <rect x="8" y="20" width="26" height="7" fill={C.bordeaux} />
      <rect x="96" y="48" width="18" height="4" fill={C.crimson} />
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


// Services page: A three bands, the first open; B three full blocks,
// alternating sides
function ServicesPreview({ id }: { id: SectionDesign<'services'> }) {
  const on = [C.bordeaux, C.bordeaux, C.cream]
  return (
    <svg viewBox="0 0 120 64" className="sx-preview" aria-hidden="true">
      <rect width="120" height="64" fill={C.cream} />
      <rect x="10" y="4" width="50" height="5" fill={C.bordeaux} />
      {id === 'a' ? (
        <>
          <rect y="13" width="120" height="27" fill={tones[0]} />
          <rect x="8" y="17" width="36" height="7" fill={on[0]} />
          <rect x="64" y="18" width="46" height="2" fill={on[0]} opacity="0.7" />
          <rect x="64" y="23" width="40" height="2" fill={on[0]} opacity="0.7" />
          <rect x="64" y="28" width="44" height="2" fill={on[0]} opacity="0.7" />
          <rect y="40" width="120" height="12" fill={tones[1]} />
          <rect x="8" y="43" width="28" height="6" fill={on[1]} />
          <rect y="52" width="120" height="12" fill={tones[2]} />
          <rect x="8" y="55" width="38" height="6" fill={on[2]} />
        </>
      ) : (
        [0, 1, 2].map((i) => {
          const y = 13 + i * 17
          const nameX = i === 1 ? 70 : 8
          const textX = i === 1 ? 8 : 64
          return (
            <g key={i}>
              <rect y={y} width="120" height="17" fill={tones[i]} />
              <rect x={nameX} y={y + 4} width="42" height="9" fill={on[i]} />
              <rect x={textX} y={y + 4} width="44" height="2" fill={on[i]} opacity="0.7" />
              <rect x={textX} y={y + 8} width="38" height="2" fill={on[i]} opacity="0.7" />
              <rect x={textX} y={y + 12} width="42" height="1" fill={on[i]} opacity="0.5" />
            </g>
          )
        })
      )}
    </svg>
  )
}
