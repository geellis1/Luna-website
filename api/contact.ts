// Vercel serverless function: receives the contact form, emails it to Kelli
// via Resend, and logs it to her Google Sheet through a Google Apps Script
// webhook (scripts/google-sheets-webhook.gs).
//
// Env vars (see .env.example; set them in Vercel → Settings → Environment
// Variables):
//   RESEND_API_KEY         required
//   SHEETS_WEBHOOK_URL     the Apps Script web app URL (logging is skipped if unset)
//   SHEETS_WEBHOOK_SECRET  the same secret saved in the Apps Script
//   CONTACT_TO_EMAIL       optional; defaults to kelli@lunacivicstrategies.com
//   CONTACT_FROM_EMAIL     optional; defaults to website@lunacivicstrategies.com
//
// The email is what matters: if the sheet can't be reached, the submission
// still goes through and the problem is logged in Vercel.
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const SERVICE_OPTIONS = ['Training', 'Project-based Consulting', 'Sustained Engagement', 'Not sure yet']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// TEMPORARY for testing: switch back to 'kelli@lunacivicstrategies.com'
const TO = 'ellis.gradi@gmail.com'
const FROM = 'Luna Civic Strategies <website@lunacivicstrategies.com>'
const SUBJECT = 'New Contact Form Submission — Luna Civic Strategies'

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

type Submission = {
  firstName: string
  lastName: string
  email: string
  organization: string
  interestedIn: string
  phone: string
  workingToward: string
}

// The email: every field, with phone and "working toward" only when given
function sendEmail(resend: Resend, s: Submission) {
  const rows: [string, string][] = [
    ['First Name', s.firstName],
    ['Last Name', s.lastName],
    ['Email', s.email],
    ['Organization', s.organization],
    ['Interested In', s.interestedIn],
    ...(s.phone ? [['Phone', s.phone] as [string, string]] : []),
    ...(s.workingToward ? [['Working Toward', s.workingToward] as [string, string]] : []),
  ]
  const html = `
    <h2 style="font-family:Georgia,serif;color:#741734">New contact form submission</h2>
    <table cellpadding="8" style="border-collapse:collapse;font-family:sans-serif;font-size:15px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="font-weight:bold;vertical-align:top;color:#3E1921;white-space:nowrap">${k}</td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
        )
        .join('')}
    </table>`
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n')
  return resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL || FROM,
    to: process.env.CONTACT_TO_EMAIL || TO,
    replyTo: s.email,
    subject: SUBJECT,
    html,
    text,
  })
}

// The sheet: one row per submission, posted to the Apps Script web app.
// Gives up after 8 seconds so a slow sheet never holds up the form.
async function logToSheet(s: Submission) {
  const url = process.env.SHEETS_WEBHOOK_URL
  if (!url) return
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: process.env.SHEETS_WEBHOOK_SECRET ?? '', ...s }),
    redirect: 'follow',
    signal: AbortSignal.timeout(8000),
  })
  const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
  if (!res.ok || !body.ok) throw new Error(`Sheet webhook: ${res.status} ${body.error ?? ''}`.trim())
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const { RESEND_API_KEY } = process.env
  if (!RESEND_API_KEY) {
    console.error('Contact form is missing RESEND_API_KEY.')
    return res.status(500).json({ error: 'The contact form is not configured yet. Please email us directly.' })
  }

  const body = (req.body ?? {}) as Record<string, unknown>

  // Honeypot filled in: pretend success so bots don't retry
  if (str(body.website)) return res.status(200).json({ ok: true })

  const services = Array.isArray(body.services)
    ? body.services.filter((s): s is string => SERVICE_OPTIONS.includes(s as string))
    : []
  const submission: Submission = {
    firstName: str(body.firstName, 100),
    lastName: str(body.lastName, 100),
    email: str(body.email),
    organization: str(body.organization),
    interestedIn: services.join(', '),
    phone: str(body.phone, 50),
    workingToward: str(body.details, 5000),
  }

  if (!submission.firstName || !submission.lastName) {
    return res.status(400).json({ error: 'Please enter your first and last name.' })
  }
  if (!submission.organization) return res.status(400).json({ error: 'Please enter your organization.' })
  if (!EMAIL_RE.test(submission.email)) return res.status(400).json({ error: 'Please enter a valid email address.' })
  if (!services.length) return res.status(400).json({ error: 'Please choose what you’re interested in exploring.' })

  // Email and sheet at the same time; only the email decides the outcome
  const [email, sheet] = await Promise.allSettled([sendEmail(new Resend(RESEND_API_KEY), submission), logToSheet(submission)])

  if (sheet.status === 'rejected') console.error('Google Sheets logging failed:', sheet.reason)

  const emailError = email.status === 'rejected' ? email.reason : email.value.error
  if (emailError) {
    console.error('Resend error:', emailError)
    return res.status(502).json({ error: "We couldn't send your message. Please try again in a moment." })
  }

  return res.status(200).json({ ok: true })
}
