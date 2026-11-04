// Small schematic previews for the Explore Designs drawer: a mini picture of
// each homepage, navigation style and color combination, drawn in the brand
// palette so the client can compare them at a glance.

import type { HomeOption, OptionValue } from '../options'

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
    case 'bold':
      return (
        <svg {...frame}>
          <defs>
            <radialGradient id="pv-halo">
              <stop offset="0%" stopColor="#F3D3CC" />
              <stop offset="55%" stopColor="#E39AA6" />
              <stop offset="100%" stopColor={C.crimson} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="160" height="100" fill={C.bordeaux} />
          <circle cx="122" cy="40" r="30" fill="url(#pv-halo)" opacity="0.7" />
          <circle cx="122" cy="40" r="15" fill="#F1D9CF" />
          <circle cx="122" cy="40" r="22" fill="none" stroke={C.powder} strokeWidth="0.8" opacity="0.7" />
          <Lines x={12} y={20} widths={[74, 84, 66, 44]} h={8} gap={4} accent={{ line: 2, color: C.chartreuse }} />
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
          <rect x="44" y="4" width="72" height="34" fill={C.cream} />
          <Logo x={8} y={6} color={C.cream} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x="50" y={9 + i * 7} width={[26, 22, 30, 28][i]} height="4.5" fill={C.bordeaux} />
              <rect x="50" y={15 + i * 7} width="60" height="0.4" fill={C.bordeaux} />
              <path d={`M103 ${11.2 + i * 7}h7m-2-2 2 2-2 2`} fill="none" stroke={C.bordeaux} strokeWidth="0.6" />
            </g>
          ))}
        </svg>
      )
  }
}

// Color combination: headline color on burgundy, with its accent
const combos: Record<OptionValue<'headline'>, { headline: string; accent: string }> = {
  cream: { headline: C.cream, accent: C.chartreuse },
  chartreuse: { headline: C.chartreuse, accent: C.cream },
  powder: { headline: C.powder, accent: C.chartreuse },
  red: { headline: C.red, accent: C.cream },
}

export function ComboPreview({ kind }: { kind: OptionValue<'headline'> }) {
  const { headline, accent } = combos[kind]
  return (
    <svg viewBox="0 0 120 56" aria-hidden="true" className="preview">
      <rect width="120" height="56" fill={C.bordeaux} />
      <text x="10" y="36" fontFamily="Georgia, serif" fontWeight="700" fontSize="26" fill={headline}>
        Aa
      </text>
      <rect x="10" y="42" width="34" height="2" fill={accent} />
      <circle cx="78" cy="28" r="9" fill={headline} />
      <circle cx="100" cy="28" r="9" fill={accent} />
    </svg>
  )
}
