import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  optionGroups,
  optionsQuery,
  relevant,
  showOptions,
  useOptions,
  type OptionKey,
  type Options,
  type OptionValue,
} from '../options'

type Choice = { readonly id: string; readonly label: string; readonly note: string }

// One labeled row of toggle buttons
function Group({
  title,
  hint,
  choices,
  value,
  onChoose,
}: {
  title: string
  hint?: string
  choices: readonly Choice[]
  value: string
  onChoose: (id: string) => void
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
const keys = Object.keys(optionGroups) as OptionKey[]

// Review-only panel for switching between design options (home page, moon
// style, headline color, nav bar and its color/corners). It floats over the
// page from a corner button, so the real layout is never pushed down.
export default function OptionsBar() {
  const { set, ...options } = useOptions()
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

  const choose = <K extends OptionKey>(key: K, value: OptionValue<K>) => {
    set(key, value)
    const next: Options = { ...options, [key]: value }
    if (key === 'home') {
      // Picking a home option always opens Home
      navigate('/' + optionsQuery(next, true))
      window.scrollTo(0, 0)
    } else {
      navigate(pathname + optionsQuery(next, onHome), { replace: true })
    }
  }

  const copyLink = async () => {
    const url = window.location.origin + pathname + optionsQuery(options, onHome)
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
            {keys
              .filter((key) => relevant(key, options, onHome))
              .map((key) => (
                <Group
                  key={key}
                  title={optionGroups[key].title}
                  hint={key === 'home' && !onHome ? '(opens Home)' : undefined}
                  choices={optionGroups[key].choices}
                  value={options[key]}
                  onChoose={(id) => choose(key, id as OptionValue<typeof key>)}
                />
              ))}
            <button type="button" className="options-bar__copy" onClick={copyLink}>
              {copied ? 'Link copied' : 'Copy link'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
