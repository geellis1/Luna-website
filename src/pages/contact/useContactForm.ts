import { useState, type FormEvent } from 'react'

// Contact form submission, shared by every contact page design: posts the
// fields to /api/contact (which emails them via Resend) and tracks the status.
// The field names are the API's: firstName, lastName, organization, email,
// phone, services (any of serviceOptions), details, website (spam trap).

export type Status = 'idle' | 'sending' | 'success' | 'error'

export function useContactForm() {
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

  return { status, error, handleSubmit }
}
