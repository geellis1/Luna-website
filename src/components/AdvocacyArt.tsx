// Placeholder "photos" for the Scrapbook hero: flat, brand-colored advocacy
// scenes drawn in SVG. Swap each for a real photo (an <img>) when they're chosen.

const C = {
  crimson: '#741734',
  red: '#DA1A10',
  powder: '#9AB7D5',
  chartreuse: '#D5E272',
  bordeaux: '#3E1921',
  cream: '#F5F0E8',
}

type Props = { className?: string }

// State capitol dome against a powder-blue sky
export function Capitol({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 200 240" role="img" aria-label="Placeholder: state capitol">
      <rect width="200" height="240" fill={C.powder} />
      <circle cx="152" cy="52" r="18" fill={C.cream} opacity="0.7" />
      <g fill={C.bordeaux}>
        <rect x="99" y="34" width="2" height="22" />
        <path d="M101 35h14l-4 4 4 4h-14z" fill={C.red} />
        <rect x="93" y="56" width="14" height="14" />
        <path d="M60 118a40 46 0 0 1 80 0z" />
        <rect x="56" y="118" width="88" height="10" />
        {[64, 76, 88, 100, 112, 124, 136].map((x) => (
          <rect key={x} x={x - 3} y="128" width="6" height="34" />
        ))}
        <rect x="52" y="162" width="96" height="8" />
        <path d="M14 170h172v12H14z" />
        <rect x="14" y="182" width="172" height="58" />
      </g>
      <g fill={C.powder} opacity="0.55">
        {[30, 54, 78, 114, 138, 162].map((x) => (
          <rect key={x} x={x - 6} y="192" width="12" height="20" />
        ))}
      </g>
    </svg>
  )
}

// A rally: signs held up over a crowd
export function Rally({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 200 240" role="img" aria-label="Placeholder: rally with signs">
      <rect width="200" height="240" fill={C.chartreuse} />
      <g fill={C.bordeaux}>
        <rect x="46" y="70" width="3" height="100" />
        <rect x="108" y="46" width="3" height="120" />
        <rect x="160" y="84" width="3" height="90" />
      </g>
      <rect x="18" y="40" width="60" height="40" fill={C.cream} />
      <rect x="74" y="20" width="72" height="36" fill={C.red} />
      <rect x="132" y="62" width="58" height="34" fill={C.crimson} />
      <g fill={C.bordeaux} opacity="0.75">
        <rect x="26" y="52" width="44" height="5" />
        <rect x="26" y="62" width="30" height="5" />
        <rect x="140" y="72" width="40" height="4" fill={C.cream} />
        <rect x="140" y="81" width="26" height="4" fill={C.cream} />
      </g>
      <g fill={C.cream}>
        <rect x="84" y="31" width="52" height="5" />
        <rect x="84" y="41" width="36" height="5" />
      </g>
      <g fill={C.bordeaux}>
        {[
          [20, 186, 15],
          [52, 178, 16],
          [86, 190, 14],
          [118, 176, 16],
          [150, 188, 15],
          [182, 180, 15],
        ].map(([x, y, r]) => (
          <g key={x}>
            <circle cx={x} cy={y} r={r * 0.62} />
            <path d={`M${x - r} 240v-${240 - y - r}a${r} ${r} 0 0 1 ${r * 2} 0V240z`} />
          </g>
        ))}
      </g>
    </svg>
  )
}

// A megaphone mid-shout
export function Megaphone({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 200 240" role="img" aria-label="Placeholder: megaphone">
      <rect width="200" height="240" fill={C.red} />
      <g transform="rotate(-18 100 120)">
        <path d="M54 104h22l58-30v92l-58-30H54z" fill={C.cream} />
        <rect x="40" y="102" width="16" height="36" rx="3" fill={C.bordeaux} />
        <rect x="132" y="70" width="10" height="100" rx="3" fill={C.bordeaux} />
        <path d="M74 136l-6 34h14l8-30z" fill={C.bordeaux} />
      </g>
      <g fill="none" stroke={C.cream} strokeWidth="5" strokeLinecap="round">
        <path d="M156 66q16 18 12 42" />
        <path d="M170 50q26 30 18 70" />
      </g>
    </svg>
  )
}

// A ballot going into the box
export function Ballot({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 200 240" role="img" aria-label="Placeholder: ballot box">
      <rect width="200" height="240" fill={C.crimson} />
      <g transform="rotate(-8 100 70)">
        <rect x="64" y="22" width="72" height="92" fill={C.cream} />
        <rect x="76" y="38" width="12" height="12" fill="none" stroke={C.bordeaux} strokeWidth="3" />
        <path d="M78 44l4 4 8-10" fill="none" stroke={C.red} strokeWidth="4" strokeLinecap="round" />
        <rect x="96" y="41" width="30" height="5" fill={C.bordeaux} opacity="0.6" />
        <rect x="76" y="62" width="12" height="12" fill="none" stroke={C.bordeaux} strokeWidth="3" />
        <rect x="96" y="65" width="24" height="5" fill={C.bordeaux} opacity="0.6" />
      </g>
      <rect x="30" y="108" width="140" height="104" fill={C.powder} />
      <rect x="30" y="108" width="140" height="16" fill={C.bordeaux} />
      <rect x="62" y="113" width="76" height="6" rx="3" fill={C.crimson} />
      <path d="M78 152h44M78 166h30" stroke={C.bordeaux} strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}
