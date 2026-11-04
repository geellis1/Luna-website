import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  defaultOptions,
  labelOf,
  optionGroups,
  optionsQuery,
  recommendedPalette,
  resolvePalette,
  showOptions,
  useOptions,
  type OptionKey,
  type Options,
  type OptionValue,
} from '../options'
import {
  addFavorite,
  findFavorite,
  nextFavoriteName,
  removeFavorite,
  reviewLink,
  summarize,
  updateFavorite,
  useFavorites,
  type Favorite,
} from '../favorites'
import {
  HomePreview,
  MenuLayoutPreview,
  NavPreview,
  PalettePreview,
  TriggerPreview,
} from './DesignPreviews'

// Review-only "Explore Designs" button and panel, for the client to compare
// homepage, color, navigation and menu choices. Every choice updates the live
// site immediately. She can save combinations as favorites (this browser
// only, see src/favorites.ts) and share a link that reopens a design with her
// name and notes. Hidden at launch with VITE_HIDE_OPTIONS=true.

type Section = 'home' | 'palette' | 'nav' | 'menuLayout' | 'menuTrigger'
type View = 'explore' | 'save' | 'favorites' | 'review'

const descriptions: Record<Section, string> = {
  home: 'Choose the overall look of your homepage.',
  palette: 'Explore different color combinations.',
  nav: 'Choose how visitors navigate your website.',
  menuLayout: 'Choose how the menu opens.',
  menuTrigger: 'Choose the button that opens your menu.',
}

const visible = <K extends OptionKey>(key: K) =>
  (optionGroups[key].choices as readonly { id: OptionValue<K>; label: string; note: string; hidden?: boolean }[]).filter(
    (c) => !c.hidden,
  )

export default function DesignDrawer() {
  const { set, setAll, ...options } = useOptions()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const favorites = useFavorites()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<View>('explore')
  const [section, setSection] = useState<Section | null>('home')
  const [toast, setToast] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const opener = useRef<HTMLButtonElement>(null)
  const closer = useRef<HTMLButtonElement>(null)
  const body = useRef<HTMLDivElement>(null)

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

  // Each view starts at the top
  useEffect(() => {
    body.current?.scrollTo(0, 0)
  }, [view])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(''), 3200)
    return () => window.clearTimeout(t)
  }, [toast])

  if (!showOptions) return null

  // Once the previous section has folded away, bring the opened one's heading
  // to the top of the panel
  const revealSection = (toggle: HTMLElement) => {
    window.setTimeout(() => {
      const scroller = body.current
      if (!scroller) return
      const top = toggle.getBoundingClientRect().top - scroller.getBoundingClientRect().top
      scroller.scrollBy({ top: top - 8, behavior: 'smooth' })
    }, 320)
  }

  const onHome = pathname === '/'
  const current = findFavorite(favorites, options)

  const show = (next: Options, goHome: boolean) => {
    if (goHome) {
      navigate('/' + optionsQuery(next, true))
      window.scrollTo(0, 0)
    } else {
      navigate(pathname + optionsQuery(next, onHome), { replace: true })
    }
  }

  const choose = <K extends OptionKey>(key: K, value: OptionValue<K>) => {
    const next = { ...options, [key]: value }
    set(key, value)
    // Menu layout and button belong to the Moon Menu, so picking one shows it
    if ((key === 'menuLayout' || key === 'menuTrigger') && options.nav !== 'menu') {
      next.nav = 'menu'
      set('nav', 'menu')
    }
    // Picking a homepage design always shows the homepage
    show(next, key === 'home')
  }

  const restore = (f: Favorite) => {
    setAll(f.config)
    show(f.config, true)
    setToast(`Showing “${f.name}”`)
  }

  const reset = () => {
    setAll(defaultOptions)
    setConfirmReset(false)
    show(defaultOptions, false)
  }

  const { home, palette, nav, menuLayout, menuTrigger, moonColor } = optionGroups
  const resolved = resolvePalette(options)
  const recommended = recommendedPalette[options.home]
  const summary = summarize(options)

  const sections: { id: Section; title: string; summary: string; content: ReactNode }[] = [
    {
      id: 'home',
      title: home.title,
      summary: summary[0].value,
      content: (
        <>
          {!onHome && <p className="drawer__hint">Choosing one opens the homepage.</p>}
          <div className="drawer__cards">
            {visible('home').map((c) => (
              <ChoiceCard key={c.id} on={options.home === c.id} onClick={() => choose('home', c.id)} label={c.label} note={c.note}>
                <HomePreview kind={c.id} />
              </ChoiceCard>
            ))}
          </div>
          <div className={`choice-sub${options.home === 'moons' ? ' is-open' : ''}`}>
            <div className="choice-sub__inner" inert={options.home !== 'moons'}>
              <p className="choice-sub__title">Moon Collage · {moonColor.title}</p>
              <div className="swatches" role="group" aria-label={moonColor.title}>
                {moonColor.choices.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className="swatch"
                    aria-pressed={options.moonColor === m.id}
                    title={m.note}
                    onClick={() => choose('moonColor', m.id)}
                  >
                    <span className={`swatch__chip swatch__chip--moon-${m.id}`} />
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'palette',
      title: palette.title,
      summary: summary[1].value,
      content: (
        <div className="drawer__cards">
          {visible('palette').map((c) => (
            <ChoiceCard
              key={c.id}
              on={resolved === c.id}
              onClick={() => choose('palette', c.id)}
              label={c.label}
              note={c.note}
              badge={c.id === recommended ? 'Recommended' : undefined}
            >
              <PalettePreview kind={c.id as Exclude<typeof c.id, 'auto'>} />
            </ChoiceCard>
          ))}
        </div>
      ),
    },
    {
      id: 'nav',
      title: nav.title,
      summary: summary[2].value,
      content: (
        <div className="drawer__list">
          {visible('nav').map((c) => (
            <ChoiceRow key={c.id} on={options.nav === c.id} onClick={() => choose('nav', c.id)} label={c.label} note={c.note}>
              <NavPreview kind={c.id} />
            </ChoiceRow>
          ))}
        </div>
      ),
    },
    {
      id: 'menuLayout',
      title: menuLayout.title,
      summary: labelOf('menuLayout', options.menuLayout),
      content: (
        <>
          {options.nav !== 'menu' && <p className="drawer__hint">Used with the Moon Menu. Choosing one switches to it.</p>}
          <div className="drawer__list">
            {visible('menuLayout').map((c) => (
              <ChoiceRow
                key={c.id}
                on={options.nav === 'menu' && options.menuLayout === c.id}
                onClick={() => choose('menuLayout', c.id)}
                label={c.label}
                note={c.note}
              >
                <MenuLayoutPreview kind={c.id} />
              </ChoiceRow>
            ))}
          </div>
        </>
      ),
    },
    {
      id: 'menuTrigger',
      title: menuTrigger.title,
      summary: labelOf('menuTrigger', options.menuTrigger),
      content: (
        <>
          {options.nav !== 'menu' && <p className="drawer__hint">Used with the Moon Menu. Choosing one switches to it.</p>}
          <div className="drawer__list">
            {visible('menuTrigger').map((c) => (
              <ChoiceRow
                key={c.id}
                on={options.nav === 'menu' && options.menuTrigger === c.id}
                onClick={() => choose('menuTrigger', c.id)}
                label={c.label}
                note={c.note}
              >
                <TriggerPreview kind={c.id} />
              </ChoiceRow>
            ))}
          </div>
        </>
      ),
    },
  ]

  const titles: Record<View, string> = {
    explore: 'Explore the Designs',
    save: 'Save to Favorites',
    favorites: 'Your Favorites',
    review: 'Review & Share',
  }

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
            {view === 'explore' ? (
              <p className="drawer__eyebrow">Luna Civic Strategies</p>
            ) : (
              <button type="button" className="drawer__back" onClick={() => setView('explore')}>
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M10 3 5 8l5 5" />
                </svg>
                Back to designs
              </button>
            )}
            <h2 className="drawer__title">{titles[view]}</h2>
          </div>
          <button ref={closer} type="button" className="drawer__close" aria-label="Close" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 4l12 12M16 4 4 16" />
            </svg>
          </button>
        </header>

        <div className="drawer__body" ref={body}>
          {view === 'explore' && (
            <>
              <p className="drawer__intro">The website updates as you choose. Close this panel anytime to look around.</p>
              <div className="accordion">
                {sections.map((s, i) => {
                  const isOpen = section === s.id
                  return (
                    <section key={s.id} className={`accordion__item${isOpen ? ' is-open' : ''}`}>
                      <h3 className="accordion__heading">
                        <button
                          type="button"
                          className="accordion__toggle"
                          aria-expanded={isOpen}
                          aria-controls={`acc-${s.id}`}
                          onClick={(e) => {
                            setSection(isOpen ? null : s.id)
                            if (!isOpen) revealSection(e.currentTarget)
                          }}
                        >
                          <span className="accordion__num">{String(i + 1).padStart(2, '0')}</span>
                          <span className="accordion__text">
                            <span className="accordion__title">{s.title}</span>
                            <span className="accordion__summary">{isOpen ? descriptions[s.id] : s.summary}</span>
                          </span>
                          <svg className="accordion__chevron" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M3.5 6 8 10.5 12.5 6" />
                          </svg>
                        </button>
                      </h3>
                      <div className="accordion__panel" id={`acc-${s.id}`}>
                        <div className="accordion__inner" inert={!isOpen}>
                          {s.content}
                        </div>
                      </div>
                    </section>
                  )
                })}
              </div>
              <div className="drawer__more">
                <button type="button" className="drawer__link" onClick={() => setView('favorites')}>
                  Saved Favorites{favorites.length ? ` (${favorites.length})` : ''}
                </button>
                {confirmReset ? (
                  <span className="drawer__confirm" role="alert">
                    Go back to the original design?
                    <button type="button" className="drawer__link" onClick={reset}>
                      Reset
                    </button>
                    <button type="button" className="drawer__link" onClick={() => setConfirmReset(false)}>
                      Cancel
                    </button>
                  </span>
                ) : (
                  <button type="button" className="drawer__link drawer__link--quiet" onClick={() => setConfirmReset(true)}>
                    Reset to default
                  </button>
                )}
              </div>
            </>
          )}

          {view === 'save' && (
            <SaveForm
              existing={current}
              defaultName={nextFavoriteName(favorites)}
              summary={summary}
              onDone={(name) => {
                setView('explore')
                setToast(`Saved “${name}” to your favorites`)
              }}
              options={options}
            />
          )}

          {view === 'favorites' && (
            <FavoritesList
              favorites={favorites}
              currentId={current?.id}
              onRestore={restore}
              onToast={setToast}
            />
          )}

          {view === 'review' && (
            <ReviewForm
              existing={current}
              defaultName={nextFavoriteName(favorites)}
              summary={summary}
              options={options}
              onToast={setToast}
            />
          )}
        </div>

        {view === 'explore' && (
          <footer className="drawer__foot">
            <button type="button" className="drawer__primary" onClick={() => setView('save')}>
              <Heart filled={Boolean(current)} />
              {current ? 'Saved to Favorites' : 'Save to Favorites'}
            </button>
            <button type="button" className="drawer__secondary" onClick={() => setView('review')}>
              Review &amp; Share Selections
            </button>
          </footer>
        )}

        <div className={`drawer__toast${toast ? ' is-shown' : ''}${view === 'explore' ? ' is-raised' : ''}`} role="status" aria-live="polite">
          {toast}
          {toast && view !== 'favorites' && (
            <button type="button" className="drawer__link" onClick={() => setView('favorites')}>
              View favorites
            </button>
          )}
        </div>
      </aside>
    </>
  )
}

// ---- Pieces ----

function ChoiceCard({ on, onClick, label, note, badge, children }: {
  on: boolean
  onClick: () => void
  label: string
  note: string
  badge?: string
  children: ReactNode
}) {
  return (
    <button type="button" className="choice-card" aria-pressed={on} onClick={onClick}>
      {children}
      <span className="choice-card__label">{label}</span>
      {badge && <span className="choice-card__badge">{badge}</span>}
      <span className="choice-card__note">{note}</span>
    </button>
  )
}

function ChoiceRow({ on, onClick, label, note, children }: {
  on: boolean
  onClick: () => void
  label: string
  note: string
  children: ReactNode
}) {
  return (
    <button type="button" className="choice-row" aria-pressed={on} onClick={onClick}>
      {children}
      <span>
        <span className="choice-card__label">{label}</span>
        <span className="choice-card__note">{note}</span>
      </span>
    </button>
  )
}

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg className="heart" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M10 16.5S3 12.4 3 7.6A3.6 3.6 0 0 1 10 6a3.6 3.6 0 0 1 7 1.6c0 4.8-7 8.9-7 8.9z"
        fill={filled ? 'currentColor' : 'none'}
      />
    </svg>
  )
}

function Summary({ items }: { items: ReturnType<typeof summarize> }) {
  return (
    <dl className="summary">
      {items.map((s, i) => (
        <div key={s.title} className={s.muted ? 'is-muted' : undefined}>
          <dt>
            <span>{String(i + 1).padStart(2, '0')}</span> {s.title}
          </dt>
          <dd>{s.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function SaveForm({ existing, defaultName, summary, options, onDone }: {
  existing?: Favorite
  defaultName: string
  summary: ReturnType<typeof summarize>
  options: Options
  onDone: (name: string) => void
}) {
  const [name, setName] = useState(existing?.name ?? defaultName)
  const [note, setNote] = useState(existing?.note ?? '')

  const save = (e: FormEvent) => {
    e.preventDefault()
    const n = name.trim() || defaultName
    if (existing) updateFavorite(existing.id, { name: n, note })
    else addFavorite({ name: n, note, preferred: false, config: options })
    onDone(n)
  }

  return (
    <form className="drawer-form" onSubmit={save}>
      <p className="drawer__intro">
        {existing
          ? 'This design is already in your favorites. You can rename it or add a note.'
          : 'Keep this combination to come back to. Saving doesn’t lock anything in, so keep exploring.'}
      </p>
      <Summary items={summary} />
      <label className="field">
        <span>Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={defaultName} maxLength={80} />
      </label>
      <label className="field">
        <span>
          Notes <em>optional</em>
        </span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="What do you like about it?"
          maxLength={2000}
        />
      </label>
      <button type="submit" className="drawer__primary">
        {existing ? 'Update Favorite' : 'Save to Favorites'}
      </button>
    </form>
  )
}

function FavoritesList({ favorites, currentId, onRestore, onToast }: {
  favorites: Favorite[]
  currentId?: string
  onRestore: (f: Favorite) => void
  onToast: (msg: string) => void
}) {
  const [editing, setEditing] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  // Shown when the browser won't let us copy to the clipboard
  const [shownLink, setShownLink] = useState<{ id: string; url: string } | null>(null)

  if (!favorites.length) {
    return (
      <p className="drawer__intro">
        Nothing saved yet. When a combination catches your eye, choose “Save to Favorites” to keep it here.
      </p>
    )
  }

  const copy = async (f: Favorite) => {
    const url = reviewLink(f.config, f)
    try {
      await navigator.clipboard.writeText(url)
      onToast('Link copied')
    } catch {
      setShownLink({ id: f.id, url })
    }
  }

  return (
    <ul className="favorites">
      {favorites.map((f) => (
        <li key={f.id} className={`favorite${f.preferred ? ' is-preferred' : ''}`}>
          <div className="favorite__head">
            <div>
              <p className="favorite__name">{f.name}</p>
              <p className="favorite__meta">
                {f.preferred && <span className="favorite__flag">★ Preferred</span>}
                {f.id === currentId && <span className="favorite__flag favorite__flag--now">Showing now</span>}
                Saved {new Date(f.savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <button
              type="button"
              className="favorite__star"
              aria-pressed={f.preferred}
              title={f.preferred ? 'Your preferred design' : 'Mark as preferred'}
              onClick={() => updateFavorite(f.id, { preferred: !f.preferred })}
            >
              {f.preferred ? '★' : '☆'}
              <span className="sr-only">{f.preferred ? 'Preferred' : 'Mark as preferred'}</span>
            </button>
          </div>
          <Summary items={summarize(f.config)} />

          {editing === f.id ? (
            <EditFavorite favorite={f} onClose={() => setEditing(null)} />
          ) : (
            f.note && <p className="favorite__note">{f.note}</p>
          )}

          {shownLink?.id === f.id && (
            <label className="field favorite__link">
              <span>Link to share</span>
              <input readOnly value={shownLink.url} onFocus={(e) => e.currentTarget.select()} autoFocus />
            </label>
          )}

          {deleting === f.id ? (
            <div className="drawer__confirm" role="alert">
              Remove “{f.name}”?
              <button
                type="button"
                className="drawer__link"
                onClick={() => {
                  removeFavorite(f.id)
                  setDeleting(null)
                }}
              >
                Remove
              </button>
              <button type="button" className="drawer__link" onClick={() => setDeleting(null)}>
                Keep
              </button>
            </div>
          ) : (
            editing !== f.id && (
              <div className="favorite__actions">
                <button type="button" className="drawer__chip drawer__chip--solid" onClick={() => onRestore(f)}>
                  View this design
                </button>
                <button type="button" className="drawer__chip" onClick={() => setEditing(f.id)}>
                  Edit
                </button>
                <button type="button" className="drawer__chip" onClick={() => copy(f)}>
                  Copy link
                </button>
                <button type="button" className="drawer__link drawer__link--quiet" onClick={() => setDeleting(f.id)}>
                  Remove
                </button>
              </div>
            )
          )}
        </li>
      ))}
    </ul>
  )
}

function EditFavorite({ favorite, onClose }: { favorite: Favorite; onClose: () => void }) {
  const [name, setName] = useState(favorite.name)
  const [note, setNote] = useState(favorite.note)
  return (
    <form
      className="drawer-form drawer-form--inline"
      onSubmit={(e) => {
        e.preventDefault()
        updateFavorite(favorite.id, { name: name.trim() || favorite.name, note })
        onClose()
      }}
    >
      <label className="field">
        <span>Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoFocus />
      </label>
      <label className="field">
        <span>Notes</span>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={2000} />
      </label>
      <div className="favorite__actions">
        <button type="submit" className="drawer__chip drawer__chip--solid">
          Save changes
        </button>
        <button type="button" className="drawer__link" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function ReviewForm({ existing, defaultName, summary, options, onToast }: {
  existing?: Favorite
  defaultName: string
  summary: ReturnType<typeof summarize>
  options: Options
  onToast: (msg: string) => void
}) {
  const [name, setName] = useState(existing?.name ?? defaultName)
  const [note, setNote] = useState(existing?.note ?? '')
  const [preferred, setPreferred] = useState(existing?.preferred ?? false)
  const [link, setLink] = useState('')

  const share = async (e: FormEvent) => {
    e.preventDefault()
    const n = name.trim() || defaultName
    // Sharing also keeps the design in her favorites
    if (existing) updateFavorite(existing.id, { name: n, note, preferred })
    else addFavorite({ name: n, note, preferred, config: options })
    const url = reviewLink(options, { name: n, note, preferred })
    setLink(url)
    try {
      await navigator.clipboard.writeText(url)
      onToast('Saved, and the link is copied')
    } catch {
      onToast('Saved. Copy the link below to share it')
    }
  }

  return (
    <form className="drawer-form" onSubmit={share}>
      <p className="drawer__intro">Here’s what you’ve chosen. Add a note, then share a link that opens this exact design.</p>
      <Summary items={summary} />
      <label className="field">
        <span>Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={defaultName} maxLength={80} />
      </label>
      <label className="field">
        <span>
          Feedback <em>optional</em>
        </span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder="Anything you’d like to change, or what you love"
          maxLength={2000}
        />
      </label>
      <label className="check">
        <input type="checkbox" checked={preferred} onChange={(e) => setPreferred(e.target.checked)} />
        <span>This is my preferred design</span>
      </label>
      {existing && <p className="drawer__hint">Already in your favorites as “{existing.name}”.</p>}
      <button type="submit" className="drawer__primary">
        {link ? 'Copy Link Again' : 'Save & Copy Share Link'}
      </button>
      {link && (
        <label className="field">
          <span>Your link</span>
          <input readOnly value={link} onFocus={(e) => e.currentTarget.select()} />
        </label>
      )}
    </form>
  )
}
