import { pillars } from '../content'
import Copy from './Copy'

export default function Pillars({ showDescriptions = true }: { showDescriptions?: boolean }) {
  return (
    <div className="grid-4">
      {pillars.map((p, i) => (
        <div className="pillar" key={p.title}>
          <div className="pillar__num">0{i + 1}</div>
          <h3>{p.title}</h3>
          {showDescriptions && (
            <p>
              <Copy text={p.description} />
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
