import { useState, type FormEvent } from 'react'
import { serviceOptions } from '../content'

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      organization: data.get('organization'),
      email: data.get('email'),
      phone: data.get('phone'),
      services: data.getAll('services'),
      details: data.get('details'),
      website: data.get('website'), // honeypot
    }

    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok || !body.ok) {
        throw new Error(body.error || 'Something went wrong. Please try again.')
      }
      form.reset()
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  return (
    <section className="section section--cream">
      <div className="container split contact">
        <div>
          <h1>Let's Chat.</h1>
          <p className="lede">
            Every engagement begins with a conversation. Tell us about your work and your goals.
            We'll take it from there.
          </p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" name="firstName" autoComplete="given-name" required />
          </div>
          <div className="field">
            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" name="lastName" autoComplete="family-name" required />
          </div>
          <div className="field field--full">
            <label htmlFor="organization">Organization</label>
            <input id="organization" name="organization" autoComplete="organization" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" />
          </div>
          <fieldset className="field field--full">
            <legend>What services are you interested in?</legend>
            <div className="checks">
              {serviceOptions.map((opt) => (
                <label className="check" key={opt}>
                  <input type="checkbox" name="services" value={opt} />
                  {opt}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="field field--full">
            <label htmlFor="details">Other details</label>
            <textarea id="details" name="details" />
          </div>

          {/* Spam trap: hidden from people, bots fill it in */}
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          {status === 'success' && (
            <p className="form__status form__status--success" role="status">
              Thank you! Your message is on its way. We'll be in touch soon.
            </p>
          )}
          {status === 'error' && (
            <p className="form__status form__status--error" role="alert">
              {error}
            </p>
          )}

          <div className="field--full">
            <button type="submit" className="button button--crimson" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
