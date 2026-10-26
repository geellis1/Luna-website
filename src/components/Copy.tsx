// Renders site copy; [bracketed] placeholder text is highlighted so it's easy to spot.
export default function Copy({ text }: { text: string }) {
  if (/^\[.*\]$/.test(text)) {
    return <span className="placeholder-copy">{text}</span>
  }
  return <>{text}</>
}
