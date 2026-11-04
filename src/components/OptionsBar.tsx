import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  homeOptions,
  moonStyles,
  showOptions,
  useOptions,
  type HomeOption,
  type MoonStyle,
} from '../options'

// Review-only bar above the nav for switching between home page options,
// plus a second row of moon styles while option B is showing.
export default function OptionsBar() {
  const { home, setHome, moon, setMoon } = useOptions()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const bar = useRef<HTMLDivElement>(null)

  // Publish the bar's height as --options-h so full-screen heroes can subtract it
  useEffect(() => {
    const el = bar.current
    if (!el) return
    const root = document.documentElement.style
    const publish = () => root.setProperty('--options-h', `${el.offsetHeight}px`)
    publish()
    const ro = new ResizeObserver(publish)
    ro.observe(el)
    return () => {
      ro.disconnect()
      root.removeProperty('--options-h')
    }
  }, [])

  if (!showOptions) return null

  const showMoons = home === 'bold' && pathname === '/'
  const linkFor = (h: HomeOption, m: MoonStyle) => (h === 'bold' ? `/?home=${h}&moon=${m}` : `/?home=${h}`)

  const choose = (id: HomeOption) => {
    setHome(id)
    navigate(linkFor(id, moon))
    window.scrollTo(0, 0)
  }

  const chooseMoon = (id: MoonStyle) => {
    setMoon(id)
    navigate(linkFor(home, id), { replace: true })
  }

  const copyLink = async () => {
    const url = window.location.origin + linkFor(home, moon)
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt('Copy this link:', url)
    }
  }

  const current = showMoons ? moonStyles.find((o) => o.id === moon) : homeOptions.find((o) => o.id === home)

  return (
    <div ref={bar} className="options-bar" role="region" aria-label="Design options (preview only)">
      <div className="container options-bar__inner">
        <span className="options-bar__title">
          Home page option{pathname !== '/' && <span className="options-bar__hint"> (opens Home)</span>}
        </span>
        <div className="options-bar__choices" role="group" aria-label="Home page option">
          {homeOptions.map((o) => (
            <button
              key={o.id}
              type="button"
              className="options-bar__choice"
              aria-pressed={o.id === home}
              title={o.note}
              onClick={() => choose(o.id)}
            >
              {o.label}
            </button>
          ))}
        </div>
        {showMoons && (
          <>
            <span className="options-bar__title">Moon</span>
            <div className="options-bar__choices" role="group" aria-label="Moon style">
              {moonStyles.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className="options-bar__choice"
                  aria-pressed={o.id === moon}
                  title={o.note}
                  onClick={() => chooseMoon(o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </>
        )}
        <span className="options-bar__note">{current?.note}</span>
        <button type="button" className="options-bar__copy" onClick={copyLink}>
          {copied ? 'Link copied' : 'Copy link'}
        </button>
      </div>
    </div>
  )
}
