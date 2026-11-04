import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  homeOptions,
  moonStyles,
  navStyles,
  optionsQuery,
  showOptions,
  useOptions,
  type HomeOption,
  type MoonStyle,
  type NavStyle,
} from '../options'

type Choice<T> = { id: T; label: string; note: string }

// One labeled row of toggle buttons
function Group<T extends string>({
  title,
  hint,
  choices,
  value,
  onChoose,
}: {
  title: string
  hint?: string
  choices: readonly Choice<T>[]
  value: T
  onChoose: (id: T) => void
}) {
  return (
    <div className="options-bar__group">
      <span className="options-bar__title">
        {title}
        {hint && <span className="options-bar__hint"> {hint}</span>}
      </span>
      <div className="options-bar__choices" role="group" aria-label={title}>
        {choices.map((o) => (
          <button
            key={o.id}
            type="button"
            className="options-bar__choice"
            aria-pressed={o.id === value}
            title={o.note}
            onClick={() => onChoose(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

const OPEN_KEY = 'luna-options-open'

// Review-only panel for switching between design options: home page, moon
// style (while option B is showing) and nav bar (on every page). It floats
// over the page from a corner button, so the real layout is never pushed down.
export default function OptionsBar() {
  const { home, setHome, moon, setMoon, nav, setNav } = useOptions()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(() => {
    try {
      return localStorage.getItem(OPEN_KEY) === 'true'
    } catch {
      return false
    }
  })

  const toggle = () => {
    setOpen(!open)
    try {
      localStorage.setItem(OPEN_KEY, String(!open))
    } catch {
      // not essential
    }
  }

  if (!showOptions) return null

  const onHome = pathname === '/'

  const chooseHome = (id: HomeOption) => {
    setHome(id)
    navigate('/' + optionsQuery(id, moon, nav))
    window.scrollTo(0, 0)
  }
  const chooseMoon = (id: MoonStyle) => {
    setMoon(id)
    navigate('/' + optionsQuery(home, id, nav), { replace: true })
  }
  // Nav applies to every page, so stay where we are
  const chooseNav = (id: NavStyle) => {
    setNav(id)
    navigate(pathname + optionsQuery(home, moon, id), { replace: true })
  }

  const copyLink = async () => {
    const url = window.location.origin + pathname + optionsQuery(home, moon, nav)
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt('Copy this link:', url)
    }
  }

  return (
    <div className="options-dock">
      <button
        type="button"
        className="options-dock__toggle"
        aria-expanded={open}
        aria-controls="design-options"
        onClick={toggle}
      >
        {open ? 'Hide options' : 'Design options'}
      </button>
      {open && (
        <div id="design-options" className="options-bar" role="region" aria-label="Design options (preview only)">
          <div className="options-bar__inner">
            <Group
              title="Home"
              hint={onHome ? undefined : '(opens Home)'}
              choices={homeOptions}
              value={home}
              onChoose={chooseHome}
            />
            {onHome && home === 'bold' && (
              <Group title="Moon" choices={moonStyles} value={moon} onChoose={chooseMoon} />
            )}
            <Group title="Nav" choices={navStyles} value={nav} onChoose={chooseNav} />
            <button type="button" className="options-bar__copy" onClick={copyLink}>
              {copied ? 'Link copied' : 'Copy link'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
