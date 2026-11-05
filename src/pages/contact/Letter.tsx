import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { serviceOptions } from '../../content'
import { useContactForm } from './useContactForm'

// The contact form written as a letter: each field sits inside a sentence as
// an underlined blank (a real, labeled input), and the services are tags
// (real checkboxes, so several can be chosen). Name, organization, email and
// at least one service are required; phone and the note are marked
// optional. A missing field is underlined in red and named in a message
// above the button. Once sent, the letter gives way to a confirmation in the
// same place. Styles: contact.css.

// How the services read in the letter (the submitted values stay the same)
const serviceLabel = (s: string) => (s === 'Not sure yet' ? 'Not Sure Yet' : s)

type BlankProps = {
  name: string
  label: string
  width: string
  type?: string
  autoComplete?: string
  required?: boolean
  optional?: boolean // says "(optional)" in the blank
  invalid?: boolean
  after?: string // punctuation that follows the blank, kept with it on phones
}

// One underlined blank in a sentence; the label is for screen readers, the
// placeholder names the blank for everyone else
function Blank({ name, label, width, type = 'text', autoComplete, required, optional, invalid, after }: BlankProps) {
  return (
    <span className={`blank${invalid ? ' is-missing' : ''}`} style={{ '--w': width } as CSSProperties}>
      <label className="sr-only" htmlFor={`letter-${name}`}>
        {label}
        {required ? ' (required)' : optional ? ' (optional)' : ''}
      </label>
      <input
        id={`letter-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        placeholder={`${label.toLowerCase()}${optional ? ' (optional)' : ''}`}
        className="blank__input"
      />
      {after}
    </span>
  )
}

// Each paragraph of the letter fades up in turn as the letter comes into view
function Line({ i, children, className = '' }: { i: number; children: ReactNode; className?: string }) {
  return (
    <div className={`letter__line ${className}`} style={{ '--i': i } as CSSProperties}>
      {children}
    </div>
  )
}

// What's required, in the order it appears, with how the message names it
const requiredFields = [
  { name: 'firstName', says: 'your first name' },
  { name: 'lastName', says: 'your last name' },
  { name: 'organization', says: 'your organization' },
  { name: 'services', says: 'what you’re interested in exploring' },
  { name: 'email', says: 'your email' },
] as const
type Required = (typeof requiredFields)[number]['name']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// "a", "a and b", "a, b and c"
const list = (items: string[]) =>
  items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`

export default function Letter() {
  const { status, error, handleSubmit } = useContactForm()
  const [missing, setMissing] = useState<Required[]>([])
  const [badEmail, setBadEmail] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const data = new FormData(e.currentTarget)
    const gaps = requiredFields
      .filter(({ name }) => (name === 'services' ? !data.getAll('services').length : !String(data.get(name) ?? '').trim()))
      .map((f) => f.name)
    const email = String(data.get('email') ?? '').trim()
    const emailWrong = !!email && !EMAIL_RE.test(email)
    setMissing(gaps)
    setBadEmail(emailWrong)
    if (gaps.length || emailWrong) {
      e.preventDefault()
      // Take them to the first one
      const first = gaps[0] ?? 'email'
      e.currentTarget.querySelector<HTMLElement>(first === 'services' ? '.tag input' : `[name="${first}"]`)?.focus()
      return
    }
    handleSubmit(e)
  }

  // A field stops being flagged as soon as it's filled in
  const clearOne = (name: string) => {
    if (name === 'email') setBadEmail(false)
    setMissing((m) => m.filter((n) => n !== name))
  }

  if (status === 'success') return <Received />

  const isMissing = (name: Required) => missing.includes(name)
  const problem = missing.length
    ? `Almost there. Please add ${list(requiredFields.filter((f) => isMissing(f.name)).map((f) => f.says))}.`
    : badEmail
      ? 'Please check your email address.'
      : ''

  return (
    <form
      className="letter"
      onSubmit={onSubmit}
      noValidate
      onInput={(e) => clearOne((e.target as HTMLInputElement).name)}
    >
      <Line i={0} className="letter__greet">
        Hello Luna,
      </Line>
      <Line i={1}>
        My name is{' '}
        <Blank name="firstName" label="First name" width="8.5ch" autoComplete="given-name" required invalid={isMissing('firstName')} />{' '}
        <Blank name="lastName" label="Last name" width="9ch" autoComplete="family-name" required invalid={isMissing('lastName')} after="," /> and
        I’m reaching out on behalf of{' '}
        <Blank name="organization" label="Organization" width="14ch" autoComplete="organization" required invalid={isMissing('organization')} after="." />
      </Line>

      <Line i={2}>
        <fieldset
          className={`letter__services${isMissing('services') ? ' is-missing' : ''}`}
          aria-required="true"
          aria-invalid={isMissing('services') || undefined}
        >
          <legend>We’re interested in exploring:</legend>
          <div className="tags">
            {serviceOptions.map((s) => (
              <label key={s} className="tag">
                <input type="checkbox" name="services" value={s} />
                <span>{serviceLabel(s)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </Line>

      <Line i={3}>
        <label htmlFor="letter-details" className="letter__prompt">
          Here’s a little more about what we’re working toward: <span className="letter__optional">(optional)</span>
        </label>
        <textarea id="letter-details" name="details" className="letter__area" rows={4} />
      </Line>

      <Line i={4}>
        You can reach me by email at{' '}
        <Blank name="email" label="Email" width="17ch" type="email" autoComplete="email" required invalid={isMissing('email') || badEmail} />{' '}
        or by phone at{' '}
        <Blank name="phone" label="Phone" width="15ch" type="tel" autoComplete="tel" optional after="." />
      </Line>

      <Line i={5} className="letter__sign">
        Looking forward to connecting.
      </Line>

      {/* Spam trap: hidden from people, bots fill it in */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="letter-website">Website</label>
        <input id="letter-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {problem && (
        <p className="letter__status letter__status--error" role="alert">
          {problem}
        </p>
      )}
      {!problem && status === 'error' && (
        <p className="letter__status letter__status--error" role="alert">
          {error}
        </p>
      )}

      <Line i={6}>
        <button type="submit" className="button letter__send" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send Your Note'}
        </button>
      </Line>
    </form>
  )
}

// Once sent: the letter gives way to this, in the same place. A crescent
// draws itself into a full moon, then "Received." rises in and the line
// follows. Focus moves here so screen readers announce it.
function Received() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.focus()
  }, [])
  return (
    <div ref={ref} className="received" role="status" tabIndex={-1}>
      <svg className="received__moon" viewBox="0 0 100 100" aria-hidden="true">
        <circle className="received__ring" cx="50" cy="50" r="46" pathLength="100" />
        <circle className="received__disc" cx="50" cy="50" r="34" />
      </svg>
      <p className="received__title">
        <span>Received.</span>
      </p>
      <p className="received__line">Every great engagement starts exactly like this.</p>
    </div>
  )
}
