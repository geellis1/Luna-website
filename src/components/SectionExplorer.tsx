import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  sectionDesigns,
  pathOf,
  sectionKeys,
  showSectionDesigns,
  subGroupsOf,
  useSectionDesign,
  type SectionDesign,
  type SectionKey,
} from '../sectionDesigns'
import { headshots } from '../pages/headshots'
import './section-explorer.css'

// Round 2 review panel: "Explore Section Designs". A small button bottom-right
// opens a drawer listing each homepage section under review and its designs.
// Choosing one updates the live section immediately; "View Section" closes
// the drawer and glides to it so nothing covers it while she looks.
// Hidden at launch with VITE_HIDE_OPTIONS=true.

const C = {
  powder: '#9AB7D5',
  chartreuse: '#D5E272',
  crimson: '#741734',
  red: '#DA1A10',
  bordeaux: '#3E1921',
  cream: '#F5F0E8',
}
const tones = [C.powder, C.chartreuse, C.crimson]

// Small pictures of each design, drawn in the brand colors (headshots show
// the photo itself)
function Preview({ section, id }: { section: SectionKey; id: string }) {
  if (section === 'aboutHeadshot') {
    const photo = headshots[id as SectionDesign<'aboutHeadshot'>]
    return <img className="sx-preview sx-preview--photo" src={photo.src} alt="" />
  }
  if (section === 'whyLuna') return <WhyPreview id={id as SectionDesign<'whyLuna'>} />
  if (section === 'intro') return <IntroPreview id={id as SectionDesign<'intro'>} />
  if (section === 'cta') return <CtaPreview id={id as SectionDesign<'cta'>} />
  return <WorkPreview id={id as SectionDesign<'howWeWork'>} />
}

function CtaPreview({ id }: { id: SectionDesign<'cta'> }) {
  return (
    <svg viewBox="0 0 120 64" className="sx-preview" aria-hidden="true">
      <rect width="120" height="64" fill={C.cream} />
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
  return id === 'poster' ? (
    <svg viewBox="0 0 120 64" className="sx-preview" aria-hidden="true">
      <rect width="120" height="64" fill={C.cream} />
      <rect x="10" y="7" width="72" height="52" fill={C.powder} />
      <rect x="74" y="3" width="26" height="46" fill={C.crimson} transform="rotate(-4 87 26)" />
      <rect x="8" y="16" width="24" height="12" fill="#F3D2C1" transform="rotate(-9 20 22)" />
      <rect x="8" y="34" width="36" height="16" fill="#EEF2C4" transform="rotate(6 26 42)" />
      <rect x="14" y="52" width="58" height="5" fill={C.bordeaux} />
    </svg>
  ) : (
    <svg viewBox="0 0 120 64" className="sx-preview" aria-hidden="true">
      <rect width="120" height="64" fill={C.powder} />
      <rect x="12" y="10" width="34" height="44" fill="#ece8e1" transform="rotate(-3 29 32)" />
      <rect x="56" y="18" width="50" height="6" fill="#1f3a57" />
      <rect x="56" y="27" width="40" height="6" fill="#1f3a57" />
      <rect x="56" y="38" width="46" height="2" fill="#1f3a57" opacity="0.6" />
      <rect x="56" y="43" width="40" height="2" fill="#1f3a57" opacity="0.6" />
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

function WorkPreview({ id }: { id: SectionDesign<'howWeWork'> }) {
  const frame = (children: ReactNode) => (
    <svg viewBox="0 0 120 64" className="sx-preview" aria-hidden="true">
      <rect width="120" height="64" fill={C.cream} />
      <rect x="8" y="12" width="28" height="5" rx="1" fill={C.bordeaux} />
      <rect x="8" y="20" width="22" height="5" rx="1" fill={C.bordeaux} />
      <rect x="8" y="28" width="26" height="5" rx="1" fill={C.bordeaux} />
      {children}
    </svg>
  )
  switch (id) {
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

// Versions of one design (e.g. A1 / A2), as a pair of text buttons
function SubChoices<K extends SectionKey>({ id }: { id: K }) {
  const group = sectionDesigns[id]
  const [value, set] = useSectionDesign(id)
  return (
    <div className="sx-subchoices" role="group" aria-label={group.title}>
      {group.choices.map((c) => (
        <button
          key={c.id}
          type="button"
          className="sx-subchoice"
          aria-pressed={value === c.id}
          title={c.note}
          onClick={() => set(c.id as SectionDesign<K>)}
        >
          <span className="sx-subchoice__label">{c.label}</span>
          <span className="sx-subchoice__note">{c.note}</span>
        </button>
      ))}
    </div>
  )
}

function SectionChoices<K extends SectionKey>({ id, index, onView }: { id: K; index: number; onView: (key: SectionKey) => void }) {
  const section = sectionDesigns[id]
  const [value, set] = useSectionDesign(id)
  return (
    <section className="sx-section">
      <h3 className="sx-section__title">
        <span>{String(index + 1).padStart(2, '0')}</span> {section.title}
      </h3>
      <div className="sx-options" role="group" aria-label={section.title}>
        {section.choices.map((c) => (
          <div key={c.id} className="sx-option-wrap">
            <button
              type="button"
              className="sx-option"
              aria-pressed={value === c.id}
              onClick={() => set(c.id as SectionDesign<K>)}
            >
              <Preview section={id} id={c.id} />
              <span className="sx-option__text">
                <span className="sx-option__label">{c.label}</span>
                <span className="sx-option__note">{c.note}</span>
              </span>
            </button>
            {/* This design's own versions, opening beneath it while it's chosen */}
            {subGroupsOf(id, c.id).map((k) => (
              <div key={k} className={`sx-sub${value === c.id ? ' is-open' : ''}`}>
                <div className="sx-sub__inner" inert={value !== c.id}>
                  <SubChoices id={k} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button type="button" className="sx-view" onClick={() => onView(id)}>
        View Section
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
        </svg>
      </button>
    </section>
  )
}

export default function SectionExplorer() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const opener = useRef<HTMLButtonElement>(null)
  const closer = useRef<HTMLButtonElement>(null)

  // Focus the close button on open; Escape closes; focus returns on close
  useEffect(() => {
    if (!open) return
    const toggle = opener.current
    closer.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      toggle?.focus({ preventScroll: true })
    }
  }, [open])

  if (!showSectionDesigns) return null

  // Close the drawer, then glide to the section (opening its page first)
  const view = (key: SectionKey) => {
    setOpen(false)
    const path = pathOf(key)
    const go = () =>
      document
        .getElementById(sectionDesigns[key].anchor)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (pathname === path) {
      go()
    } else {
      navigate(path + search)
      window.setTimeout(go, 350)
    }
  }

  const copy = async () => {
    // Every section's pick, so the link reproduces this review
    const q = new URLSearchParams()
    const current = new URLSearchParams(search)
    ;(Object.keys(sectionDesigns) as SectionKey[]).forEach((k) => {
      const { param } = sectionDesigns[k]
      const v = current.get(param) ?? localStorage.getItem(`luna-section-${k}`)
      if (v) q.set(param, v)
    })
    const url = `${window.location.origin}/?${q}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      window.prompt('Copy this link to share:', url)
    }
  }

  return (
    <>
      <button
        ref={opener}
        type="button"
        className={`sx-btn${open ? ' is-hidden' : ''}`}
        aria-expanded={open}
        aria-controls="section-explorer"
        onClick={() => setOpen(true)}
      >
        Explore Designs
      </button>

      <aside
        id="section-explorer"
        className={`sx-drawer${open ? ' is-open' : ''}`}
        aria-label="Explore section designs"
        aria-hidden={!open}
        inert={!open}
      >
        <header className="sx-head">
          <div>
            <h2 className="sx-title">Explore Section Designs</h2>
            <p className="sx-subtitle">Round 2 · Interactive Section Concepts</p>
          </div>
          <button ref={closer} type="button" className="sx-close" aria-label="Close" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 5l10 10M15 5 5 15" />
            </svg>
          </button>
        </header>

        <div className="sx-body">
          {sectionKeys.map((k, i) => (
            <SectionChoices key={k} id={k} index={i} onView={view} />
          ))}
        </div>

        <footer className="sx-foot">
          <button type="button" className="sx-link" onClick={copy}>
            {copied ? 'Link copied' : 'Copy a link to these designs'}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? 'Link copied to clipboard' : ''}
          </span>
        </footer>
      </aside>
    </>
  )
}
