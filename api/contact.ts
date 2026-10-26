// Vercel serverless function: receives the contact form and emails it via Resend.
// Required env vars (see .env.example): RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const SERVICE_OPTIONS = ['Training', 'Project-based Consulting', 'Sustained Engagement', 'Not sure yet']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error('Contact form is missing Resend environment variables.')
    return res.status(500).json({ error: 'The contact form is not configured yet. Please email us directly.' })
  }

  const body = (req.body ?? {}) as Record<string, unknown>

  // Honeypot filled in: pretend success so bots don't retry
  if (str(body.website)) return res.status(200).json({ ok: true })

  const firstName = str(body.firstName, 100)
  const lastName = str(body.lastName, 100)
  const organization = str(body.organization)
  const email = str(body.email)
  const phone = str(body.phone, 50)
  const details = str(body.details, 5000)
  const services = Array.isArray(body.services)
    ? body.services.filter((s): s is string => SERVICE_OPTIONS.includes(s as string))
    : []

  if (!firstName || !lastName) return res.status(400).json({ error: 'Please enter your first and last name.' })
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' })

  const rows: [string, string][] = [
    ['Name', `${firstName} ${lastName}`],
    ['Organization', organization || '—'],
    ['Email', email],
    ['Phone', phone || '—'],
    ['Interested in', services.length ? services.join(', ') : '—'],
    ['Other details', details || '—'],
  ]

  const html = `
    <h2 style="font-family:Georgia,serif;color:#741734">New inquiry from lunacivicstrategies.com</h2>
    <table cellpadding="8" style="border-collapse:collapse;font-family:sans-serif;font-size:15px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="font-weight:bold;vertical-align:top;color:#3E1921">${k}</td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
        )
        .join('')}
    </table>`
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n')

  const resend = new Resend(RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: CONTACT_FROM_EMAIL,
    to: CONTACT_TO_EMAIL,
    replyTo: email,
    subject: `New inquiry: ${firstName} ${lastName}${organization ? ` (${organization})` : ''}`,
    html,
    text,
  })

  if (error) {
    console.error('Resend error:', error)
    return res.status(502).json({ error: "We couldn't send your message. Please try again in a moment." })
  }

  return res.status(200).json({ ok: true })
}
