import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  optionGroups,
  optionsQuery,
  showOptions,
  useOptions,
  type OptionKey,
  type Options,
  type OptionValue,
} from '../options'
import { ComboPreview, HomePreview, NavPreview } from './DesignPreviews'

// Review-only "Explore Designs" button and drawer, for the client to compare
// homepage, navigation and color choices. Every choice updates the live site
// immediately and is written into the URL, so "Share This Design" copies a
// link that reproduces it. Hidden at launch with VITE_HIDE_OPTIONS=true.

const defaults = Object.fromEntries(
  (Object.keys(optionGroups) as OptionKey[]).map((k) => [k, optionGroups[k].choices[0].id]),
) as Options

export default function DesignDrawer() {
  const { set, ...options } = useOptions()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
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
      toggle?.focus()
    }
  }, [open])

  if (!showOptions) return null

  const onHome = pathname === '/'

  const applyAll = (next: Options, goHome: boolean) => {
    if (goHome) {
      navigate('/' + optionsQuery(next, true))
      window.scrollTo(0, 0)
    } else {
      navigate(pathname + optionsQuery(next, onHome), { replace: true })
    }
  }

  const choose = <K extends OptionKey>(key: K, value: OptionValue<K>) => {
    set(key, value)
    // Picking a homepage design always shows the homepage
    applyAll({ ...options, [key]: value }, key === 'home')
  }

  const share = async () => {
    // Includes every choice, so the link reproduces this design anywhere
    const url = window.location.origin + pathname + optionsQuery(options, true)
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.prompt('Copy this link to share the design:', url)
    }
  }

  const reset = () => {
    ;(Object.keys(defaults) as OptionKey[]).forEach((k) => set(k, defaults[k] as never))
    setConfirmReset(false)
    applyAll(defaults, false)
  }

  const { home, nav, pill, headline, menuLayout, menuTrigger } = optionGroups

  // Settings that belong to one navigation style, shown beneath it
  const subGroups = { menuLayout, menuTrigger } as const

  return (
    <>
      <button
        ref={opener}
        type="button"
        className={`explore-btn${open ? ' is-hidden' : ''}`}
        aria-expanded={open}
        aria-controls="design-drawer"
        onClick={() => setOpen(true)}
      >
        Explore Designs
      </button>

      <aside
        id="design-drawer"
        className={`drawer${open ? ' is-open' : ''}`}
        aria-label="Explore the designs"
        aria-hidden={!open}
        inert={!open}
      >
        <header className="drawer__head">
          <div>
            <p className="drawer__eyebrow">Luna Civic Strategies</p>
            <h2 className="drawer__title">Explore the Designs</h2>
          </div>
          <button
            ref={closer}
            type="button"
            className="drawer__close"
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 4l12 12M16 4 4 16" />
            </svg>
          </button>
        </header>

        <div className="drawer__body">
          <p className="drawer__intro">
            Choose a design in each section. The website updates as you go, so you can close this
            panel and look around.
          </p>

          <section className="drawer__section">
            <h3 className="drawer__heading">
              <span>01</span> {home.title}
            </h3>
            {!onHome && <p className="drawer__hint">Choosing one opens the homepage.</p>}
            <div className="drawer__cards">
              {home.choices.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="choice-card"
                  aria-pressed={options.home === c.id}
                  onClick={() => choose('home', c.id)}
                >
                  <HomePreview kind={c.id} />
                  <span className="choice-card__label">{c.label}</span>
                  <span className="choice-card__note">{c.note}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="drawer__section">
            <h3 className="drawer__heading">
              <span>02</span> {nav.title}
            </h3>
            <div className="drawer__list">
              {nav.choices.map((c) => (
                <div key={c.id} className="choice-row-wrap">
                  <button
                    type="button"
                    className="choice-row"
                    aria-pressed={options.nav === c.id}
                    onClick={() => choose('nav', c.id)}
                  >
                    <NavPreview kind={c.id} />
                    <span>
                      <span className="choice-card__label">{c.label}</span>
                      <span className="choice-card__note">{c.note}</span>
                    </span>
                  </button>
                  {c.id === 'pill' && (
                    <div className={`choice-sub${options.nav === 'pill' ? ' is-open' : ''}`}>
                      <div className="choice-sub__inner" inert={options.nav !== 'pill'}>
                        <p className="choice-sub__title">{pill.title}</p>
                        <div className="swatches" role="group" aria-label={pill.title}>
                          {pill.choices.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              className="swatch"
                              aria-pressed={options.pill === p.id}
                              title={p.note}
                              onClick={() => choose('pill', p.id)}
                            >
                              <span className={`swatch__chip swatch__chip--${p.id}`} />
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {c.id === 'menu' && (
                    <div className={`choice-sub${options.nav === 'menu' ? ' is-open' : ''}`}>
                      <div className="choice-sub__inner" inert={options.nav !== 'menu'}>
                        {(Object.keys(subGroups) as (keyof typeof subGroups)[]).map((key) => (
                          <div key={key}>
                            <p className="choice-sub__title">{subGroups[key].title}</p>
                            <div className="swatches" role="group" aria-label={subGroups[key].title}>
                              {subGroups[key].choices.map((o) => (
                                <button
                                  key={o.id}
                                  type="button"
                                  className="swatch swatch--text"
                                  aria-pressed={options[key] === o.id}
                                  title={o.note}
                                  onClick={() => choose(key, o.id as OptionValue<typeof key>)}
                                >
                                  {o.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="drawer__section">
            <h3 className="drawer__heading">
              <span>03</span> {headline.title}
            </h3>
            <p className="drawer__hint">Used on the Moon Halo, Scrapbook and Capsules homepages.</p>
            <div className="drawer__cards">
              {headline.choices.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="choice-card"
                  aria-pressed={options.headline === c.id}
                  onClick={() => choose('headline', c.id)}
                >
                  <ComboPreview kind={c.id} />
                  <span className="choice-card__label">{c.label}</span>
                  <span className="choice-card__note">{c.note}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <footer className="drawer__foot">
          {confirmReset ? (
            <div className="drawer__confirm" role="alert">
              <span>Go back to the original design?</span>
              <button type="button" className="drawer__link" onClick={reset}>
                Reset
              </button>
              <button type="button" className="drawer__link" onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button type="button" className="drawer__share" onClick={share}>
                {copied ? 'Link copied' : 'Share This Design'}
              </button>
              <button type="button" className="drawer__link" onClick={() => setConfirmReset(true)}>
                Reset to Default
              </button>
            </>
          )}
          <span className="sr-only" aria-live="polite">
            {copied ? 'Link copied to clipboard' : ''}
          </span>
        </footer>
      </aside>
    </>
  )
}
