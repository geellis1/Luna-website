import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import CtaBand from '../../components/CtaBand'
import Pillars from '../../components/Pillars'
import NoteStatement from './NoteStatement'
import { tiers } from '../../content'

// Option A: Editorial. Text only: a huge bold headline across the full width.
// Lines rise in, then a hand-drawn underline and circle draw themselves on.
// Styles: "Option A" in home.css.

// A word with a hand-drawn mark that draws on after load
function Marked({ kind, children }: { kind: 'underline' | 'circle'; children: ReactNode }) {
  return (
    <span className={`ed-mark ed-mark--${kind}`}>
      {children}
      <svg viewBox={kind === 'circle' ? '0 0 100 40' : '0 0 100 12'} preserveAspectRatio="none" aria-hidden="true">
        {kind === 'circle' ? (
          <path d="M55 4C83 3 99 12 97 23 94 35 63 39 36 37 12 35 1 27 4 17 7 7 30 2 62 6" />
        ) : (
          <path d="M2 8C18 4 34 9 50 6S82 4 98 7" />
        )}
      </svg>
    </span>
  )
}

export default function HomeEditorial() {
  return (
    <>
      <section className="hero ed-hero">
        <div className="container">
          <div className="ed-hero__title-wrap">
            <h1 className="ed-hero__title">
              <span className="sr-only">Equity-centered advocacy strategy for audacious change.</span>
              <span aria-hidden="true">
                <span className="ed-hero__line">
                  <Marked kind="underline">Equity-centered</Marked>
                </span>
                <span className="ed-hero__line">advocacy strategy</span>
                <span className="ed-hero__line">
                  for{' '}
                  <span className="ed-hero__accent">
                    <Marked kind="circle">audacious</Marked>
                  </span>
                </span>
                <span className="ed-hero__line ed-hero__powder">change.</span>
              </span>
            </h1>
          </div>
          <div className="hero-foot editorial-hero__foot">
            <Link to="/contact" className="button button--hero">
              Let's Work Together
            </Link>
            <p>
              Working alongside nonprofits and coalitions ready to move from mission to movement:
              building advocacy programs that are strategic, values-driven, and built for the
              current political reality.
            </p>
          </div>
        </div>
      </section>

      <NoteStatement />

      <section className="section section--bordeaux">
        <div className="container">
          <p className="eyebrow">Why Luna</p>
          <Pillars showDescriptions={false} />
        </div>
      </section>

      <section className="section section--cream">
        <div className="container">
          <div className="section-head">
            <h2>How we work together</h2>
            <Link to="/services" className="text-link">
              Explore services
            </Link>
          </div>
          <div className="grid-3">
            {tiers.map((t) => (
              <Link to={`/services#${t.id}`} className="tier-card" key={t.id}>
                <div className="tier-card__label">{t.label}</div>
                <div className="tier-card__kind">{t.kind}</div>
                <p>{t.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
