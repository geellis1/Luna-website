// Small schematic previews for the Explore Designs drawer: a mini picture of
// each homepage, navigation style and color combination, drawn in the brand
// palette so the client can compare them at a glance.

import type { HomeOption, OptionValue, PaletteId } from '../options'

const C = {
  crimson: '#741734',
  red: '#DA1A10',
  powder: '#9AB7D5',
  chartreuse: '#D5E272',
  bordeaux: '#3E1921',
  cream: '#F5F0E8',
  photo: '#8E7F78',
}

// Four headline "lines" as bars; widths in % of the preview
function Lines({ x, y, widths, h = 7, gap = 4, color = C.cream, accent }: {
  x: number
  y: number
  widths: number[]
  h?: number
  gap?: number
  color?: string
  accent?: { line: number; color: string }
}) {
  return (
    <>
      {widths.map((w, i) => (
        <rect
          key={i}
          x={x}
          y={y + i * (h + gap)}
          width={w}
          height={h}
          rx="1"
          fill={accent?.line === i ? accent.color : color}
        />
      ))}
    </>
  )
}

const frame = { viewBox: '0 0 160 100', 'aria-hidden': true as const, className: 'preview' }

export function HomePreview({ kind }: { kind: HomeOption }) {
  switch (kind) {
    case 'editorial':
      return (
        <svg {...frame}>
          <rect width="160" height="100" fill={C.crimson} />
          <Lines x={12} y={16} widths={[98, 120, 92, 56]} h={10} gap={4} accent={{ line: 3, color: C.powder }} />
          <rect x="12" y="27" width="98" height="1.6" fill={C.chartreuse} />
          <rect x="44" y="44" width="60" height="10" rx="1" fill={C.chartreuse} />
          <ellipse cx="74" cy="49" rx="36" ry="9" fill="none" stroke={C.cream} strokeWidth="1" />
          <rect x="12" y="80" width="136" height="0.6" fill={C.cream} opacity="0.35" />
          <rect x="12" y="86" width="30" height="7" rx="3.5" fill={C.cream} />
        </svg>
      )
    case 'moons':
      return (
        <svg {...frame}>
          <rect width="160" height="100" fill={C.bordeaux} />
          <Lines x={30} y={14} widths={[100, 100, 80]} h={9} gap={4} accent={{ line: 2, color: C.chartreuse }} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <circle
              key={i}
              cx={26 + i * 18}
              cy="64"
              r="7"
              fill={i === 0 ? 'none' : '#E6DCCF'}
              stroke={i === 4 ? C.chartreuse : C.cream}
              strokeWidth="1.2"
            />
          ))}
          <rect x="12" y="80" width="136" height="0.6" fill={C.cream} opacity="0.35" />
          <rect x="12" y="86" width="30" height="7" rx="3.5" fill={C.cream} />
        </svg>
      )
    case 'scrapbook':
      return (
        <svg {...frame}>
          <rect width="160" height="100" fill={C.bordeaux} />
          <rect x="104" y="10" width="16" height="20" fill={C.powder} opacity="0.85" />
          <rect x="16" y="32" width="22" height="16" fill={C.photo} />
          <rect x="62" y="50" width="16" height="16" fill={C.photo} opacity="0.9" />
          <rect x="128" y="46" width="22" height="16" fill={C.photo} />
          <Lines x={36} y={16} widths={[88, 98, 86, 52]} h={9} gap={3} />
          <path d="M112 70q8-4 18-1" fill="none" stroke={C.red} strokeWidth="1" />
          <rect x="12" y="80" width="136" height="0.6" fill={C.cream} opacity="0.35" />
          <rect x="12" y="86" width="30" height="7" rx="3.5" fill={C.cream} />
        </svg>
      )
    case 'handwritten':
      return (
        <svg {...frame}>
          <rect width="160" height="100" fill={C.bordeaux} />
          <g fill="none" stroke="#F0301F" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 40c6-16 10-22 12-10s-6 18 2 6 10-20 14-8-4 14 4 4 8-16 14-6" />
            <path d="M80 72c6-18 12-22 13-10s-6 16 2 4 9-18 13-6-3 12 5 2 9-16 14-6 6 10 14 4" />
          </g>
          <rect x="66" y="30" width="28" height="2.5" rx="1" fill={C.cream} />
          <Lines x={44} y={38} widths={[72, 64, 52]} h={6} gap={3} color={C.cream} />
          <rect x="12" y="80" width="136" height="0.6" fill={C.cream} opacity="0.35" />
          <rect x="12" y="86" width="30" height="7" rx="3.5" fill={C.cream} />
        </svg>
      )
    case 'capsules':
      return (
        <svg {...frame}>
          <rect width="160" height="100" fill={C.bordeaux} />
          <Lines x={12} y={20} widths={[62, 70, 56, 38]} h={8} gap={4} accent={{ line: 2, color: C.chartreuse }} />
          {[C.photo, C.red, C.photo, C.chartreuse, C.photo, C.powder].map((fill, i) => (
            <rect
              key={i}
              x={96 + (i % 3) * 18}
              y={10 + Math.floor(i / 3) * 33}
              width="14"
              height="30"
              rx="7"
              fill={fill}
            />
          ))}
          <rect x="12" y="80" width="136" height="0.6" fill={C.cream} opacity="0.35" />
          <rect x="12" y="86" width="30" height="7" rx="3.5" fill={C.cream} />
        </svg>
      )
  }
}

const navFrame = { viewBox: '0 0 120 40', 'aria-hidden': true as const, className: 'preview' }
const Logo = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <rect x={x} y={y} width="18" height="7" rx="1" fill={color} />
)
const Links = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <>
    {[0, 1, 2].map((i) => (
      <rect key={i} x={x + i * 12} y={y} width="9" height="2.5" rx="1" fill={color} />
    ))}
  </>
)

export function NavPreview({ kind }: { kind: OptionValue<'nav'> }) {
  switch (kind) {
    case 'pill':
      return (
        <svg {...navFrame}>
          <rect width="120" height="40" fill={C.bordeaux} />
          <rect x="6" y="5" width="108" height="12" rx="6" fill={C.cream} />
          <Logo x={12} y={7.5} color={C.bordeaux} />
          <Links x={46} y={9.8} color={C.bordeaux} />
          <rect x="88" y="7.5" width="22" height="7" rx="3.5" fill="none" stroke={C.bordeaux} strokeWidth="0.8" />
        </svg>
      )
    case 'circled':
      return (
        <svg {...navFrame}>
          <rect width="120" height="40" fill={C.bordeaux} />
          <Logo x={8} y={6} color={C.cream} />
          <Links x={78} y={8.5} color={C.cream} />
          <ellipse cx="94.5" cy="9.7" rx="7" ry="4" fill="none" stroke={C.cream} strokeWidth="0.7" />
        </svg>
      )
    case 'menu':
      return (
        <svg {...navFrame}>
          <rect width="120" height="40" fill={C.bordeaux} />
          <Logo x={8} y={6} color={C.cream} />
          <Crescent cx={107} cy={10} r={6} />
        </svg>
      )
  }
}

// The Moon Menu's crescent button: a thin ring around a crescent
function Crescent({ cx, cy, r, lines = false }: { cx: number; cy: number; r: number; lines?: boolean }) {
  const k = r / 21
  return (
    <g transform={`translate(${cx - 22 * k} ${cy - 22 * k}) scale(${k})`}>
      <circle cx="22" cy="22" r="21" fill="none" stroke={C.cream} strokeWidth={1.6 / k / 2} />
      <path
        d="M22 10.5a11.5 11.5 0 1 0 9.5 18A10 10 0 0 1 22 10.5z"
        fill={C.cream}
        transform={lines ? 'translate(-5 0)' : undefined}
      />
      {lines && (
        <g stroke={C.cream} strokeWidth="2.2" strokeLinecap="round">
          <path d="M28 18h8M28 26h8" />
        </g>
      )}
    </g>
  )
}

export function MenuLayoutPreview({ kind }: { kind: OptionValue<'menuLayout'> }) {
  const rows = (x: number, w: number) =>
    [0, 1, 2, 3].map((i) => (
      <g key={i}>
        <rect x={x} y={9 + i * 7} width={[26, 22, 30, 28][i] * (w / 60)} height="4.5" fill={C.bordeaux} />
        <rect x={x} y={15 + i * 7} width={w} height="0.4" fill={C.bordeaux} />
      </g>
    ))
  return (
    <svg {...navFrame}>
      <rect width="120" height="40" fill={C.bordeaux} />
      {kind === 'takeover' ? (
        <>
          <rect x="4" y="3" width="112" height="34" rx="3" fill={C.cream} />
          {rows(12, 96)}
        </>
      ) : (
        <>
          <rect width="64" height="40" fill={C.bordeaux} opacity="0.6" />
          <path d="M64 0H120V40H64a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" fill={C.cream} />
          {rows(66, 48)}
        </>
      )}
    </svg>
  )
}

export function TriggerPreview({ kind }: { kind: OptionValue<'menuTrigger'> }) {
  return (
    <svg {...navFrame}>
      <rect width="120" height="40" fill={C.bordeaux} />
      <Crescent cx={60} cy={20} r={13} lines={kind === 'moon-lines'} />
    </svg>
  )
}

// Color palette: the palette's own tokens (index.css), so the swatch always
// matches the site: background, headline, accent and button colors
export function PalettePreview({ kind }: { kind: PaletteId }) {
  const v = (token: string) => ({ fill: `var(--p-${token})` })
  return (
    <svg viewBox="0 0 120 56" aria-hidden="true" className="preview" data-palette={kind}>
      <rect width="120" height="56" style={v('bg')} />
      <text x="10" y="36" fontFamily="Georgia, serif" fontWeight="700" fontSize="26" style={v('ink')}>
        Aa
      </text>
      <rect x="10" y="42" width="34" height="2" style={v('accent')} />
      <circle cx="78" cy="28" r="9" style={v('accent')} />
      <rect x="92" y="21" width="20" height="14" rx="7" style={v('btn-bg')} />
    </svg>
  )
}
