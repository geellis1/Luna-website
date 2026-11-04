import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { sectionDesigns, showSectionDesigns, useApplyDesigns } from '../sectionDesigns'
import {
  buildSummary,
  currentDesignKey,
  pageForPath,
  pages,
  previewingNow,
  setComment,
  shareLink,
  summaryText,
  toggleFavorite,
  useReview,
  type Design,
  type Page,
  type Review,
  type Section,
  type SummaryPage,
} from '../review'
import DesignThumb from './DesignThumb'
import './section-explorer.css'

// Round 2 client review: the "Explore Designs" drawer. Designs are listed by
// page (one page open at a time, starting with the page she's on), then by
// section. Clicking a design previews it on the site and glides to it; the
// heart saves it as a favorite and the speech bubble opens a note on it,
// both separate from what's being previewed. My Favorites and Review & Share
// gather it all up; sharing packs the review into a link (see src/review.ts).
// Hidden at launch with VITE_HIDE_OPTIONS=true.

type View = 'browse' | 'favorites' | 'review'

const plural = (n: number, one: string) => `${n} ${n === 1 ? one : `${one}s`}`
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function SectionExplorer() {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<View>('browse')
  const review = useReview()
  const { pathname, search } = useLocation()
  const apply = useApplyDesigns()
  const opener = useRef<HTMLButtonElement>(null)
  const closer = useRef<HTMLButtonElement>(null)
  const body = useRef<HTMLDivElement>(null)

  // The open page: the one she's viewing, unless she's opened (or closed)
  // another while on this page
  const routePage = pageForPath(pathname)
  const [pageChoice, setPageChoice] = useState<{ path: string; id: string } | null>(null)
  const openPage = pageChoice?.path === pathname ? pageChoice.id : routePage.id
  const togglePage = (id: string) => setPageChoice({ path: pathname, id: openPage === id ? '' : id })

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

  // Each view starts at the top
  useEffect(() => {
    body.current?.scrollTo(0, 0)
  }, [view])

  // The shared review page is read-only
  if (!showSectionDesigns || pathname === '/review') return null

  const favoriteCount = review.favorites.length
  const commentCount = Object.keys(review.comments).length

  // Show a design (opening its page if she's elsewhere), then glide to it
  const preview = (page: Page, design: Design) => {
    const otherPage = page.path !== pathname
    apply(design.picks, page.path)
    window.setTimeout(
      () =>
        document
          .getElementById(sectionDesigns[design.section].anchor)
          ?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' }),
      otherPage ? 350 : 60,
    )
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
        {favoriteCount > 0 && (
          <span className="sx-btn__count" aria-label={`, ${plural(favoriteCount, 'favorite')}`}>
            <Heart filled /> {favoriteCount}
          </span>
        )}
      </button>

      <aside
        id="section-explorer"
        className={`sx-drawer${open ? ' is-open' : ''}`}
        aria-label="Explore designs"
        aria-hidden={!open}
        inert={!open}
      >
        <header className="sx-head">
          <div className="sx-head__text">
            {view !== 'browse' && (
              <button type="button" className="sx-back" onClick={() => setView('browse')}>
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M10 3 5 8l5 5" />
                </svg>
                All designs
              </button>
            )}
            <h2 className="sx-title">
              {view === 'browse' ? 'Explore Designs' : view === 'favorites' ? 'My Favorites' : 'Review & Share'}
            </h2>
            <p className="sx-subtitle">
              {view === 'browse'
                ? 'Explore the options, save what you love, and share your thoughts.'
                : view === 'favorites'
                  ? 'Everything you’ve saved, by page and section.'
                  : 'Your favorites and comments, ready to send.'}
            </p>
          </div>
          <button ref={closer} type="button" className="sx-close" aria-label="Close" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 5l10 10M15 5 5 15" />
            </svg>
          </button>
        </header>

        {view === 'browse' && (
          <div className="sx-tools">
            <p className="sx-progress" aria-live="polite">
              <span className="sx-progress__label">Design Review</span>
              {plural(favoriteCount, 'favorite')} saved · {plural(commentCount, 'comment')}
            </p>
            <div className="sx-actions">
              <button type="button" className="sx-action" onClick={() => setView('favorites')}>
                <Heart filled={favoriteCount > 0} />
                My Favorites ({favoriteCount})
              </button>
              <button type="button" className="sx-action sx-action--solid" onClick={() => setView('review')}>
                Review &amp; Share
              </button>
            </div>
          </div>
        )}

        <div className="sx-body" ref={body}>
          {view === 'browse' &&
            pages.map((page) => (
              <PageGroup
                key={page.id}
                page={page}
                open={openPage === page.id}
                onToggle={() => togglePage(page.id)}
                search={search}
                review={review}
                onPreview={(d) => preview(page, d)}
              />
            ))}
          {view === 'favorites' && <Favorites review={review} search={search} onPreview={preview} />}
          {view === 'review' && <ReviewShare review={review} search={search} />}
        </div>
      </aside>
    </>
  )
}

// ---------- Browse: page → section → designs ----------

function PageGroup({ page, open, onToggle, search, review, onPreview }: {
  page: Page
  open: boolean
  onToggle: () => void
  search: string
  review: Review
  onPreview: (d: Design) => void
}) {
  // A page with a single section shows its designs straight away
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(page.sections.length === 1 ? [page.sections[0].key] : []),
  )
  const toggle = (key: string) =>
    setOpenSections((s) => {
      const next = new Set(s)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  const favs = page.sections.reduce((n, s) => n + s.designs.filter((d) => review.favorites.includes(d.key)).length, 0)

  return (
    <section className={`sx-page${open ? ' is-open' : ''}`}>
      <h3 className="sx-page__heading">
        <button type="button" className="sx-page__toggle" aria-expanded={open} onClick={onToggle}>
          <span className="sx-page__title">{page.title}</span>
          <span className="sx-page__meta">
            {page.sections.length ? plural(page.sections.length, 'section') : 'Final'}
            {favs > 0 && (
              <span className="sx-page__favs" aria-label={`, ${plural(favs, 'favorite')}`}>
                <Heart filled /> {favs}
              </span>
            )}
          </span>
          <Chevron />
        </button>
      </h3>
      <div className="sx-collapse">
        <div className="sx-collapse__inner" inert={!open}>
          {page.sections.length === 0 ? (
            <p className="sx-empty sx-empty--page">No new options for this page in Round 2.</p>
          ) : (
            page.sections.map((s) => (
              <SectionGroup
                key={s.key}
                section={s}
                open={openSections.has(s.key)}
                onToggle={() => toggle(s.key)}
                current={currentDesignKey(s.key, search)}
                review={review}
                onPreview={onPreview}
              />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

function SectionGroup({ section, open, onToggle, current, review, onPreview }: {
  section: Section
  open: boolean
  onToggle: () => void
  current: string
  review: Review
  onPreview: (d: Design) => void
}) {
  const showing = section.designs.find((d) => d.key === current)
  return (
    <div className={`sx-sec${open ? ' is-open' : ''}`}>
      <button type="button" className="sx-sec__toggle" aria-expanded={open} onClick={onToggle}>
        <span className="sx-sec__text">
          <span className="sx-sec__title">{section.title}</span>
          {showing && <span className="sx-sec__showing">Showing {showing.name}</span>}
        </span>
        <span className="sx-sec__count">{section.designs.length}</span>
        <Chevron />
      </button>
      <div className="sx-collapse">
        <div className="sx-collapse__inner" inert={!open}>
          <ul className="sx-opts">
            {section.designs.map((d) => (
              <DesignOption
                key={d.key}
                design={d}
                selected={d.key === current}
                favorite={review.favorites.includes(d.key)}
                comment={review.comments[d.key]}
                onPreview={() => onPreview(d)}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// One design: thumbnail + name (click to preview), heart, comment
function DesignOption({ design, selected, favorite, comment, onPreview }: {
  design: Design
  selected: boolean
  favorite: boolean
  comment?: string
  onPreview: () => void
}) {
  const [editing, setEditing] = useState(false)
  return (
    <li className={`sx-opt${selected ? ' is-selected' : ''}`}>
      <div className="sx-opt__row">
        <button type="button" className="sx-opt__main" aria-pressed={selected} onClick={onPreview}>
          <span className="sx-opt__thumb">
            <DesignThumb section={design.section} id={design.id} />
            {selected && <span className="sx-opt__check" aria-hidden="true" />}
          </span>
          <span className="sx-opt__name">
            {design.name}
            <span className="sx-opt__state">{selected ? 'Showing now' : 'Preview'}</span>
          </span>
        </button>
        <div className="sx-opt__icons">
          <HeartButton designKey={design.key} name={design.name} on={favorite} />
          <button
            type="button"
            className={`sx-icon sx-comment${comment ? ' has-note' : ''}`}
            aria-expanded={editing}
            aria-label={comment ? `Edit your comment on ${design.name}` : `Comment on ${design.name}`}
            title={comment ? 'Edit comment' : 'Add a comment'}
            onClick={() => setEditing((e) => !e)}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 4.5h12a1.5 1.5 0 0 1 1.5 1.5v6.5a1.5 1.5 0 0 1-1.5 1.5H9l-3.5 3v-3H4a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 4 4.5z" />
            </svg>
          </button>
        </div>
      </div>
      {editing && <CommentBox designKey={design.key} name={design.name} onDone={() => setEditing(false)} />}
    </li>
  )
}

function HeartButton({ designKey, name, on }: { designKey: string; name: string; on: boolean }) {
  return (
    <button
      type="button"
      className={`sx-icon sx-heart${on ? ' is-on' : ''}`}
      aria-pressed={on}
      aria-label={`Favorite ${name}`}
      title={on ? 'Remove from favorites' : 'Add to favorites'}
      onClick={() => toggleFavorite(designKey)}
    >
      <Heart filled={on} />
    </button>
  )
}

// A note on one design, saved as she types
function CommentBox({ designKey, name, onDone }: { designKey: string; name: string; onDone: () => void }) {
  const review = useReview()
  const [text, setText] = useState(review.comments[designKey] ?? '')
  return (
    <div className="sx-note">
      <label className="sr-only" htmlFor={`note-${designKey}`}>
        Your comment on {name}
      </label>
      <textarea
        id={`note-${designKey}`}
        value={text}
        rows={3}
        maxLength={2000}
        autoFocus
        placeholder="Tell us what you like, what you’d change, or what you’d like to combine with another option..."
        onChange={(e) => {
          setText(e.target.value)
          setComment(designKey, e.target.value)
        }}
      />
      <div className="sx-note__foot">
        <span className="sx-note__status" aria-live="polite">
          {text.trim() ? 'Saved' : ''}
        </span>
        {text.trim() && (
          <button
            type="button"
            className="sx-link"
            onClick={() => {
              setText('')
              setComment(designKey, '')
            }}
          >
            Remove
          </button>
        )}
        <button type="button" className="sx-link" onClick={onDone}>
          Done
        </button>
      </div>
    </div>
  )
}

// ---------- My Favorites ----------

function Favorites({ review, search, onPreview }: {
  review: Review
  search: string
  onPreview: (page: Page, d: Design) => void
}) {
  const [editing, setEditing] = useState<string | null>(null)
  const groups = buildSummary({ favorites: review.favorites, comments: {} })
  if (!groups.length) {
    return (
      <p className="sx-empty">
        Tap the heart on any design to save it here. Save as many as you like, even several in the same section.
      </p>
    )
  }
  return (
    <div className="sx-group-list">
      {groups.map(({ page, sections }) => (
        <section key={page.id} className="sx-group">
          <h3 className="sx-group__title">{page.title}</h3>
          {sections.map((s) => (
            <div key={s.section.key} className="sx-group__sec">
              <p className="sx-group__sec-title">{s.section.title}</p>
              <ul className="sx-favs">
                {s.items.map(({ design }) => {
                  const comment = review.comments[design.key]
                  const showing = currentDesignKey(design.section, search) === design.key
                  return (
                    <li key={design.key} className="sx-fav">
                      <div className="sx-fav__row">
                        <span className="sx-fav__thumb">
                          <DesignThumb section={design.section} id={design.id} />
                        </span>
                        <p className="sx-fav__name">{design.name}</p>
                        <button
                          type="button"
                          className="sx-link sx-fav__remove"
                          aria-label={`Remove ${design.name} from favorites`}
                          onClick={() => toggleFavorite(design.key)}
                        >
                          Remove
                        </button>
                      </div>
                      {editing === design.key ? (
                        <CommentBox designKey={design.key} name={design.name} onDone={() => setEditing(null)} />
                      ) : (
                        comment && <p className="sx-quote">“{comment}”</p>
                      )}
                      <div className="sx-fav__actions">
                        <button
                          type="button"
                          className="sx-chip sx-chip--solid"
                          disabled={showing}
                          onClick={() => onPreview(page, design)}
                        >
                          {showing ? 'Showing now' : 'Preview'}
                        </button>
                        {editing !== design.key && (
                          <button type="button" className="sx-chip" onClick={() => setEditing(design.key)}>
                            {comment ? 'Edit comment' : 'Add comment'}
                          </button>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

// ---------- Review & Share ----------

function ReviewShare({ review, search }: { review: Review; search: string }) {
  const [copied, setCopied] = useState<'' | 'link' | 'text'>('')
  const [fallback, setFallback] = useState<{ kind: 'link' | 'text'; value: string } | null>(null)
  const previewing = previewingNow(search)
  const summary = buildSummary(review, previewing)

  const copy = async (kind: 'link' | 'text') => {
    const value = kind === 'link' ? shareLink(review, previewing) : summaryText(summary)
    try {
      await navigator.clipboard.writeText(value)
      setCopied(kind)
      setFallback(null)
      window.setTimeout(() => setCopied(''), 2400)
    } catch {
      // No clipboard access: show it to copy by hand
      setFallback({ kind, value })
    }
  }

  if (!summary.length) {
    return (
      <p className="sx-empty">
        Nothing to share yet. Save favorites with the heart, or leave a comment on any design, and they’ll be gathered
        here.
      </p>
    )
  }

  return (
    <div className="sx-review">
      <SummaryList summary={summary} />
      <div className="sx-share">
        <button type="button" className="sx-action sx-action--solid" onClick={() => copy('link')}>
          {copied === 'link' ? 'Link copied' : 'Share Feedback'}
        </button>
        <button type="button" className="sx-action" onClick={() => copy('text')}>
          {copied === 'text' ? 'Summary copied' : 'Copy Feedback Summary'}
        </button>
        <p className="sx-share__note">
          Share Feedback copies a link to a read-only summary of your favorites and comments that opens on any device.
          Paste it into an email or text.
        </p>
        {fallback && (
          <label className="sx-share__fallback">
            <span>Copy this {fallback.kind === 'link' ? 'link' : 'summary'}:</span>
            {fallback.kind === 'link' ? (
              <input readOnly value={fallback.value} onFocus={(e) => e.currentTarget.select()} autoFocus />
            ) : (
              <textarea readOnly rows={8} value={fallback.value} onFocus={(e) => e.currentTarget.select()} autoFocus />
            )}
          </label>
        )}
        <span className="sr-only" aria-live="polite">
          {copied ? 'Copied to clipboard' : ''}
        </span>
      </div>
    </div>
  )
}

// The summary by page and section (also the shared review page's content);
// `linkTo` makes each design a link that opens it on the site
export function SummaryList({ summary, linkTo }: { summary: SummaryPage[]; linkTo?: (d: Design) => string }) {
  return (
    <div className="sx-group-list">
      {summary.map(({ page, sections }) => (
        <section key={page.id} className="sx-group">
          <h3 className="sx-group__title">{page.title}</h3>
          {sections.map((s) => (
            <div key={s.section.key} className="sx-group__sec">
              <p className="sx-group__sec-title">{s.section.title}</p>
              <ul className="sx-sum">
                {s.items.map(({ design, favorite, comment }) => (
                  <li key={design.key} className="sx-sum__item">
                    <span className="sx-sum__thumb">
                      <DesignThumb section={design.section} id={design.id} />
                    </span>
                    <div className="sx-sum__text">
                      <p className="sx-sum__name">
                        {linkTo ? <a href={linkTo(design)}>{design.name}</a> : design.name}
                        {favorite && (
                          <span className="sx-sum__fav">
                            <Heart filled /> Favorite
                          </span>
                        )}
                      </p>
                      {comment && <p className="sx-quote">“{comment}”</p>}
                    </div>
                  </li>
                ))}
              </ul>
              {s.previewing && <p className="sx-sum__showing">Was previewing: {s.previewing.name}</p>}
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

// ---------- Small pieces ----------

export function Heart({ filled = false }: { filled?: boolean }) {
  return (
    <svg className={`sx-heart-icon${filled ? ' is-filled' : ''}`} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 16.5S3 12.4 3 7.6A3.6 3.6 0 0 1 10 6a3.6 3.6 0 0 1 7 1.6c0 4.8-7 8.9-7 8.9z" />
    </svg>
  )
}

function Chevron() {
  return (
    <svg className="sx-chevron" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 6 8 10.5 12.5 6" />
    </svg>
  )
}
