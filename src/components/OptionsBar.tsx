import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { homeOptions, showOptions, useOptions, type HomeOption } from '../options'

// Review-only bar above the nav for switching between home page options.
export default function OptionsBar() {
  const { home, setHome } = useOptions()
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

  const choose = (id: HomeOption) => {
    setHome(id)
    navigate(`/?home=${id}`)
    window.scrollTo(0, 0)
  }

  const copyLink = async () => {
    const url = `${window.location.origin}/?home=${home}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt('Copy this link:', url)
    }
  }

  const current = homeOptions.find((o) => o.id === home)

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
        <span className="options-bar__note">{current?.note}</span>
        <button type="button" className="options-bar__copy" onClick={copyLink}>
          {copied ? 'Link copied' : 'Copy link'}
        </button>
      </div>
    </div>
  )
}
