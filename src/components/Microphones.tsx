import { useId, type CSSProperties, type ReactNode } from 'react'

// Flat illustrated microphones for the Option B hero ("press conference").
// Each mic is drawn pointing up, head at the top, stand running off the bottom.

const C = {
  dark: '#1F0C10',
  dark2: '#3E1921',
  cream: '#F5F0E8',
  powder: '#9AB7D5',
  chartreuse: '#D5E272',
  steel: '#C9C2B8',
}

type MicType = 'dynamic' | 'stick' | 'condenser' | 'foam' | 'vintage' | 'ball'

// Mesh texture for grilles
function Mesh({ id, color }: { id: string; color: string }) {
  return (
    <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="6" fill={color} />
      <path d="M0 0H6M0 0V6" stroke={C.dark2} strokeOpacity="0.28" strokeWidth="1.2" />
    </pattern>
  )
}

// Clip, swivel and stand pole shared by every mic
const Mount = ({ top }: { top: number }) => (
  <>
    <rect x="30" y={top} width="20" height="24" fill={C.dark} />
    <circle cx="40" cy={top + 32} r="9" fill={C.dark2} />
    <rect x="37" y={top + 38} width="6" height={460 - top} fill={C.dark2} />
  </>
)

function Head({ type, mesh }: { type: MicType; mesh: string }) {
  switch (type) {
    case 'dynamic':
      return (
        <>
          <circle cx="40" cy="30" r="26" fill={`url(#${mesh})`} />
          <rect x="16" y="54" width="48" height="10" fill={C.steel} />
          <path d="M17 64H63L53 190H27Z" fill={C.dark} />
          <path d="M30 70L34 184" stroke={C.cream} strokeOpacity="0.2" strokeWidth="3" />
          <Mount top={190} />
        </>
      )
    case 'stick':
      return (
        <>
          <rect x="26" y="0" width="28" height="46" rx="14" fill={`url(#${mesh})`} />
          <rect x="30" y="44" width="20" height="146" fill={C.dark} />
          <rect x="12" y="62" width="56" height="46" fill={C.chartreuse} />
          <rect x="12" y="62" width="56" height="8" fill={C.dark2} fillOpacity="0.25" />
          <Mount top={190} />
        </>
      )
    case 'condenser':
      return (
        <>
          <rect x="22" y="0" width="36" height="100" rx="18" fill={`url(#${mesh})`} />
          <rect x="22" y="96" width="36" height="44" fill={C.powder} />
          <circle cx="40" cy="118" r="36" fill="none" stroke={C.dark} strokeWidth="5" />
          <path d="M8 104L22 110M72 104L58 110M8 132L22 126M72 132L58 126" stroke={C.cream} strokeWidth="2" />
          <rect x="34" y="152" width="12" height="38" fill={C.dark} />
          <Mount top={190} />
        </>
      )
    case 'foam':
      return (
        <>
          <ellipse cx="40" cy="44" rx="30" ry="44" fill={`url(#${mesh})`} />
          <rect x="31" y="86" width="18" height="104" fill={C.cream} />
          <rect x="31" y="86" width="18" height="12" fill={C.dark2} />
          <Mount top={190} />
        </>
      )
    case 'vintage':
      return (
        <>
          <rect x="12" y="8" width="56" height="112" rx="28" fill={C.steel} />
          <path
            d="M18 30H62M14 44H66M13 58H67M13 72H67M14 86H66M18 100H62"
            stroke={C.dark2}
            strokeWidth="5"
          />
          <rect x="37" y="8" width="6" height="112" fill={C.cream} />
          <path d="M14 112Q40 160 66 112" fill="none" stroke={C.dark} strokeWidth="6" />
          <rect x="35" y="134" width="10" height="56" fill={C.dark} />
          <Mount top={190} />
        </>
      )
    case 'ball':
      return (
        <>
          <circle cx="40" cy="36" r="32" fill={`url(#${mesh})`} />
          <rect x="35" y="66" width="10" height="124" fill={C.steel} />
          <Mount top={190} />
        </>
      )
  }
}

const meshColor: Record<MicType, string> = {
  dynamic: C.steel,
  stick: C.powder,
  condenser: C.cream,
  foam: C.dark,
  vintage: C.steel,
  ball: C.cream,
}

function Mic({ type }: { type: MicType }) {
  const mesh = `mesh${useId().replace(/:/g, '')}`
  return (
    <svg viewBox="0 -64 80 384" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <defs>
        <Mesh id={mesh} color={meshColor[type]} />
      </defs>
      {/* Sound waves, animated while the headline is "spoken" */}
      <g className="mic__waves" fill="none" stroke={C.cream} strokeWidth="3" strokeLinecap="round">
        <path d="M26 -14Q40 -24 54 -14" />
        <path d="M18 -32Q40 -48 62 -32" />
        <path d="M10 -50Q40 -72 70 -50" />
      </g>
      <Head type={type} mesh={mesh} />
    </svg>
  )
}

// Position (% from left), height (% of the row), tilt (deg) and arrival order.
// Back-row mics are shorter and drawn first so the front row overlaps them.
type Placement = { type: MicType; x: number; h: number; tilt: number; order: number; back?: boolean }
const lineup: Placement[] = [
  { type: 'ball', x: 12, h: 70, tilt: 14, order: 9, back: true },
  { type: 'stick', x: 30, h: 76, tilt: 7, order: 4, back: true },
  { type: 'dynamic', x: 50, h: 80, tilt: 0, order: 11, back: true },
  { type: 'condenser', x: 70, h: 74, tilt: -7, order: 6, back: true },
  { type: 'ball', x: 88, h: 70, tilt: -14, order: 10, back: true },
  { type: 'condenser', x: 4, h: 84, tilt: 18, order: 5 },
  { type: 'dynamic', x: 16, h: 94, tilt: 12, order: 1 },
  { type: 'stick', x: 27, h: 88, tilt: 8, order: 7 },
  { type: 'foam', x: 39, h: 100, tilt: 4, order: 3 },
  { type: 'vintage', x: 50, h: 96, tilt: 0, order: 0 },
  { type: 'ball', x: 61, h: 98, tilt: -4, order: 8 },
  { type: 'dynamic', x: 73, h: 92, tilt: -8, order: 2 },
  { type: 'stick', x: 84, h: 96, tilt: -12, order: 12 },
  { type: 'foam', x: 96, h: 84, tilt: -18, order: 13 },
]

export default function Microphones({ speaking, children }: { speaking: boolean; children?: ReactNode }) {
  return (
    <div className={`mics${speaking ? ' is-speaking' : ''}`}>
      {lineup.map((m, i) => (
        <div
          key={i}
          className={`mic${m.back ? ' mic--back' : ''}`}
          style={
            {
              left: `${m.x}%`,
              height: `${m.h}%`,
              '--tilt': `${m.tilt}deg`,
              '--delay': `${m.order * 0.09}s`,
              '--wave-delay': `${(i % 3) * 0.25}s`,
            } as CSSProperties
          }
        >
          <div className="mic__rise">
            <Mic type={m.type} />
          </div>
        </div>
      ))}
      {children}
    </div>
  )
}
