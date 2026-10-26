import Copy from '../components/Copy'
import CtaBand from '../components/CtaBand'
import { tiers } from '../content'

export default function Services() {
  return (
    <>
      <section className="section section--crimson page-hero">
        <div className="container">
          <h1>LET'S WORK TOGETHER.</h1>
          <p className="lede">
            We meet you where you are and have an engagement model built for your stage. Whether
            you're building your first advocacy program or running an active legislative campaign,
            we can meet you there.
          </p>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container">
          {tiers.map((t) => (
            <article className="tier" id={t.id} key={t.id}>
              <div>
                <div className="tier__label">{t.label.toUpperCase()}</div>
                <div className="tier__kind">{t.kind}</div>
              </div>
              <div>
                <p className="lede">{t.summary}</p>
                <p>
                  <Copy text={t.description} />
                </p>
                <h3>{t.listHeading}</h3>
                <ul>
                  {t.items.map((item, i) => (
                    <li key={i}>
                      <Copy text={item} />
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  )
}
