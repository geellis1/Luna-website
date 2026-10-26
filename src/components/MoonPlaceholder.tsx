// Stand-in for the Luna line-art illustration. Replace with the final SVG.
export default function MoonPlaceholder() {
  return (
    <svg
      className="hero__art"
      viewBox="0 0 400 400"
      role="img"
      aria-label="Illustration placeholder"
      fill="none"
      stroke="#F5F0E8"
      strokeWidth="2"
    >
      <circle cx="200" cy="200" r="180" />
      <circle cx="200" cy="200" r="140" strokeDasharray="4 8" />
      <path d="M250 70a140 140 0 1 0 0 260a110 110 0 1 1 0-260z" stroke="#D5E272" strokeWidth="3" />
      <text
        x="200"
        y="385"
        textAnchor="middle"
        fill="#F5F0E8"
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
