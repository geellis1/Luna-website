import { useState } from 'react'
import { addFavorite, findFavorite, readReviewNote, useFavorites } from '../favorites'
import { showOptions, useOptions } from '../options'

// When a review link is opened, a small card in the corner shows the name,
// feedback and preferred flag that came with it. The design itself is already
// showing (the link's ?home=…&palette=… params). Review-only, like the panel.

export default function SharedNote() {
  // Read once, so the card stays while the viewer explores further
  const [note] = useState(readReviewNote)
  const [closed, setClosed] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const { set: _set, setAll: _setAll, ...options } = useOptions()
  const favorites = useFavorites()

  if (!showOptions || !note || closed) return null

  const saved = Boolean(findFavorite(favorites, options))
  const long = note.note.length > 160

  return (
    <aside className="shared-note" aria-label="Shared design notes">
      <div className="shared-note__head">
        <p className="shared-note__eyebrow">
          Shared design{note.preferred && <span className="shared-note__flag">★ Preferred</span>}
        </p>
        <button type="button" className="shared-note__close" aria-label="Hide notes" onClick={() => setClosed(true)}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5 5l10 10M15 5 5 15" />
          </svg>
        </button>
      </div>
      {note.name && <p className="shared-note__name">{note.name}</p>}
      {note.note && (
        <p className={`shared-note__text${long && !expanded ? ' is-clipped' : ''}`}>{note.note}</p>
      )}
      <div className="shared-note__actions">
        {long && (
          <button type="button" className="drawer__link" onClick={() => setExpanded((e) => !e)}>
            {expanded ? 'Show less' : 'Read all'}
          </button>
        )}
        {saved ? (
          <span className="shared-note__saved">In your favorites</span>
        ) : (
          <button
            type="button"
            className="drawer__link"
            onClick={() =>
              addFavorite({ name: note.name || 'Shared design', note: note.note, preferred: false, config: options })
            }
          >
            Add to my favorites
          </button>
        )}
      </div>
    </aside>
  )
}
