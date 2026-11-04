import type { CSSProperties, ReactNode } from 'react'
import { serviceOptions } from '../../content'
import { useContactForm } from './useContactForm'

// The contact form written as a letter: each field sits inside a sentence as
// an underlined blank (a real, labeled input), and the services are tags
// (real checkboxes, so several can be chosen). Same fields, names and
// submission as the original form. Used by all three Round 2 contact designs;
// each styles it through its own wrapper. Styles: contact.css.

// How the services read in the letter (the submitted values stay the same)
const serviceLabel = (s: string) => (s === 'Not sure yet' ? 'Not Sure Yet' : s)

type BlankProps = {
  name: string
  label: string
  width: string
  type?: string
  autoComplete?: string
  required?: boolean
  after?: string // punctuation that follows the blank, kept with it on phones
}

// One underlined blank in a sentence; the label is for screen readers, the
// placeholder names the blank for everyone else
function Blank({ name, label, width, type = 'text', autoComplete, required, after }: BlankProps) {
  return (
    <span className="blank" style={{ '--w': width } as CSSProperties}>
      <label className="sr-only" htmlFor={`letter-${name}`}>
        {label}
        {required ? ' (required)' : ''}
      </label>
      <input
        id={`letter-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        placeholder={label.toLowerCase()}
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

export default function Letter() {
  const { status, error, handleSubmit } = useContactForm()
  return (
    <form className="letter" onSubmit={handleSubmit}>
      <Line i={0} className="letter__greet">
        Hello Luna,
      </Line>
      <Line i={1}>
        My name is <Blank name="firstName" label="First name" width="8.5ch" autoComplete="given-name" required />{' '}
        <Blank name="lastName" label="Last name" width="9ch" autoComplete="family-name" required after="," /> and
        I’m reaching out on behalf of{' '}
        <Blank name="organization" label="Organization" width="14ch" autoComplete="organization" after="." />
      </Line>

      <Line i={2}>
        <fieldset className="letter__services">
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
          Here’s a little more about what we’re working toward:
        </label>
        <textarea id="letter-details" name="details" className="letter__area" rows={4} />
      </Line>

      <Line i={4}>
        You can reach me by email at{' '}
        <Blank name="email" label="Email" width="17ch" type="email" autoComplete="email" required /> or by phone
        at <Blank name="phone" label="Phone" width="11ch" type="tel" autoComplete="tel" after="." />
      </Line>

      <Line i={5} className="letter__sign">
        Looking forward to connecting.
      </Line>

      {/* Spam trap: hidden from people, bots fill it in */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="letter-website">Website</label>
        <input id="letter-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {status === 'success' && (
        <p className="letter__status letter__status--success" role="status">
          Thank you! Your message is on its way. We’ll be in touch soon.
        </p>
      )}
      {status === 'error' && (
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
