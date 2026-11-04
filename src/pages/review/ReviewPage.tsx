import { Link, useLocation } from 'react-router-dom'
import { SummaryList } from '../../components/SectionExplorer'
import { buildSummary, findDesign, readShared, type Design } from '../../review'
import { sectionDesigns, type SectionKey } from '../../sectionDesigns'
import './review.css'

// A shared design review (/review?r=…): the favorites and comments someone
// saved in the Explore Designs panel, read-only, on any device. Everything
// is in the link itself (see src/review.ts).

// A link that opens the site with these designs showing
function hrefFor(path: string, picks: Partial<Record<SectionKey, string>>) {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(picks)) q.set(sectionDesigns[k as SectionKey].param, v)
  return `${path}?${q}`
}

const openDesign = (d: Design) => {
  const found = findDesign(d.key)
  return hrefFor(found?.page.path ?? '/', d.picks)
}

export default function ReviewPage() {
  const { search } = useLocation()
  const shared = readShared(search)
  const summary = shared ? buildSummary(shared.review, shared.previewing) : []
  const favorites = shared?.review.favorites.length ?? 0
  const comments = shared ? Object.keys(shared.review.comments).length : 0

  // The home page as it was being previewed
  const previewPicks = Object.values(shared?.previewing ?? {}).reduce<Partial<Record<SectionKey, string>>>(
    (all, key) => ({ ...all, ...findDesign(key)?.design.picks }),
    {},
  )

  return (
    <section className="section review-page">
      <div className="review-page__inner">
        <p className="review-page__kicker">Round 2 · Design Review</p>
        <h1 className="review-page__title">Design feedback</h1>
        {summary.length ? (
          <>
            <p className="review-page__lede">
              {favorites} favorite{favorites === 1 ? '' : 's'} · {comments} comment{comments === 1 ? '' : 's'}. Click a
              design’s name to open it on the site.
            </p>
            <SummaryList summary={summary} linkTo={openDesign} />
            <p className="review-page__foot">
              <a className="review-page__btn" href={hrefFor('/', previewPicks)}>
                Open the site as it was being previewed
              </a>
            </p>
          </>
        ) : (
          <p className="review-page__lede">
            This review link is empty or incomplete. Ask for the link to be shared again, or{' '}
            <Link to="/">go to the home page</Link>.
          </p>
        )}
      </div>
    </section>
  )
}
