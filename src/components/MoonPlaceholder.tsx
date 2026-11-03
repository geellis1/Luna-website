// Stand-in for the Luna line-art illustration. Replace with the final SVG.
export default function MoonPlaceholder({
  color = '#F5F0E8',
  accent = '#D5E272',
  className = 'hero__art',
}: {
  color?: string
  accent?: string
  className?: string
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      role="img"
      aria-label="Illustration placeholder"
      fill="none"
      stroke={color}
      strokeWidth="2"
    >
      <circle cx="200" cy="200" r="180" />
      <circle cx="200" cy="200" r="140" strokeDasharray="4 8" />
      <path d="M250 70a140 140 0 1 0 0 260a110 110 0 1 1 0-260z" stroke={accent} strokeWidth="3" />
      <text
        x="200"
        y="385"
        textAnchor="middle"
        fill={color}
        stroke="none"
        fontSize="11"
        letterSpacing="3"
        fontFamily="sans-serif"
      >
        ILLUSTRATION PLACEHOLDER
      </text>
    </svg>
  )
}
