import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  sectionDesigns,
  showSectionDesigns,
  useSectionDesign,
  type SectionDesign,
  type SectionKey,
} from '../sectionDesigns'
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

// Small pictures of each design, drawn in the brand colors
function Preview({ id }: { id: SectionDesign<'howWeWork'> }) {
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
          <path d="M44 56V22a14 18 0 0 1 28 0v34z" fill={tones[0]} />
          <path d="M75 56V22a8 12 0 0 1 16 0v34z" fill={tones[1]} />
          <path d="M94 56V22a8 12 0 0 1 16 0v34z" fill={tones[2]} />
          <rect x="48" y="40" width="16" height="4" fill={C.bordeaux} />
          <rect x="48" y="47" width="20" height="2" fill={C.bordeaux} opacity="0.6" />
        </>,
      )
    case 'b':
      return frame(
        <>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={46 + i * 22} y={i === 0 ? 6 : 12} width="18" height="38" rx="9" fill={tones[i]} />
          ))}
          <circle cx="55" cy="16" r="3" fill="none" stroke={C.bordeaux} strokeWidth="1" />
          <rect x="46" y="50" width="40" height="2.5" fill={C.bordeaux} />
          <rect x="46" y="55" width="30" height="2" fill={C.bordeaux} opacity="0.6" />
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
    case 'd':
      return (
        <svg viewBox="0 0 120 64" className="sx-preview" aria-hidden="true">
          <rect width="120" height="64" fill={C.cream} />
          <rect x="8" y="8" width="44" height="5" rx="1" fill={C.bordeaux} />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={8 + i * 36} y="20" width="32" height="36" fill="#fff" stroke={C.bordeaux} strokeWidth="1" />
              <rect x={8 + i * 36} y="20" width="32" height="4" fill={[C.powder, C.chartreuse, C.red][i]} />
              <rect x={12 + i * 36} y="30" width="16" height="4" fill={C.bordeaux} />
            </g>
          ))}
        </svg>
      )
  }
}

function SectionChoices<K extends SectionKey>({ id, index, onView }: { id: K; index: number; onView: (anchor: string) => void }) {
  const section = sectionDesigns[id]
  const [value, set] = useSectionDesign(id)
  return (
    <section className="sx-section">
      <h3 className="sx-section__title">
        <span>{String(index + 1).padStart(2, '0')}</span> {section.title}
      </h3>
      <div className="sx-options" role="group" aria-label={section.title}>
        {section.choices.map((c) => (
          <button
            key={c.id}
            type="button"
            className="sx-option"
            aria-pressed={value === c.id}
            onClick={() => set(c.id as SectionDesign<K>)}
          >
            <Preview id={c.id as SectionDesign<'howWeWork'>} />
            <span className="sx-option__text">
              <span className="sx-option__label">{c.label}</span>
              <span className="sx-option__note">{c.note}</span>
            </span>
          </button>
        ))}
      </div>
      <button type="button" className="sx-view" onClick={() => onView(section.anchor)}>
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

  // Close the drawer, then glide to the section (on the homepage)
  const view = (anchor: string) => {
    setOpen(false)
    const go = () =>
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (pathname === '/') {
      go()
    } else {
      navigate('/' + search)
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
          {(Object.keys(sectionDesigns) as SectionKey[]).map((k, i) => (
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
