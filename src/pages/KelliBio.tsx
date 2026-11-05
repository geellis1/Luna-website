// About page: "Hi, I'm Kelli." Magazine-style spread with Kelli's cut-out
// portrait in the middle and her bio wrapping around her silhouette on both
// sides. Each column floats an invisible half of her silhouette (a traced
// polygon) that the text flows around; the photo sits over the center line.
// On phones it's photo, then text.
// Styles: "Kelli" in index.css.

import { kelliPhoto as photo } from './headshots'

export default function KelliBio() {
  return (
    <section className="section kelli" id="kelli">
      <div className="container">
        <h2 className="kelli__title">Hi, I’m Kelli.</h2>

        <div className="kelli__spread">
          <img
            className="kelli__photo"
            src={photo.src}
            alt={photo.alt}
            width="960"
            height="1200"
          />

          <div className="kelli__col kelli__col--left">
            <span className="kelli__wrap kelli__wrap--left" aria-hidden="true" style={{ shapeOutside: `${photo.left} border-box` }} />
            <p className="kelli__lead">
              For better or for worse, I am an optimist, a visionary, and I believe wholeheartedly in
              the radical power of imagination.
            </p>
            <p>
              <strong>
                If we can’t picture a better world, one where our friends, our family, and our
                neighbors can thrive, how can we ever build it?
              </strong>
            </p>
            <p>
              But I’m also not ignorant. Systems of power have been set up, intentionally or not,
              that exclude, oppress, and ignore. The consequences manifest in the social and
              community issues we are surrounded by every day. I believe it takes a village to fix
              this. And not just to alleviate immediate need, but to change the systems and
              structures that create that need in the first place.
            </p>
            <h3 className="kelli__subhead">That belief is what brought me to this work.</h3>
            <p>
              For nearly a decade, I led AWAKE Tennessee, a statewide gender equity policy and
              advocacy nonprofit. I built its legislative presence, its training infrastructure, its
              funder relationships, and its reputation in a supermajority Republican legislature,
              during some of the most hostile sessions for gender equity policy in Tennessee’s
              history.
            </p>
          </div>

          <div className="kelli__col kelli__col--right">
            <span className="kelli__wrap kelli__wrap--right" aria-hidden="true" style={{ shapeOutside: `${photo.right} border-box` }} />
            <p>
              My approach is grounded in intersectional feminist theory, collective action
              frameworks, and a deep commitment to centering the people most impacted by policy in
              every strategy we build.{' '}
              <strong>
                I believe that communities closest to the problem should be integral to the
                solution,
              </strong>{' '}
              and that the role of a strategist is to build the conditions for their power.
            </p>
            <p>
              I also believe equity work deserves the same tools and strategic investment as any
              other field of practice. I’ve built legislative intelligence technology specifically
              for this work, grounded in first-hand experience of what advocacy in hostile
              environments actually requires.
            </p>
            <p>
              <strong>
                I started Luna Civic Strategies because I believe to solve our biggest problems, we
                must look upstream and imagine something different. I’d love to help you do that.
              </strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
