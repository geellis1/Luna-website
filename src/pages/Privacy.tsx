import './privacy.css'

// Privacy Policy for the Luna Client Dashboard. Public (no sign-in): Google
// checks it before approving the dashboard's "Sign in with Google". Cream
// header like the Services intro, then the policy in one readable column.
// Styles: privacy.css.
const email = 'kelli@lunacivicstrategies.com'

export default function Privacy() {
  return (
    <article className="section privacy">
      <header className="privacy__head">
        <h1 className="privacy__title">Privacy Policy: Luna Client Dashboard</h1>
        <p className="privacy__date">Effective November 16, 2026</p>
      </header>

      <div className="privacy__body">
        <p>
          Luna Civic Strategies provides a private, sign-in-only dashboard to our clients for following
          Tennessee legislation and our analyses. This policy explains what information the dashboard
          collects and how we use it.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            Your sign-in email address. We use it to confirm you are an authorized client and to show you
            the information prepared for your organization. If you sign in with Google, Google shares your
            email address and basic profile (name and profile picture) with our sign-in service. We don’t
            receive your Google password or any other Google account data.
          </li>
          <li>Your name and organization, as you or we provided them when setting up your account.</li>
          <li>
            What you do in the dashboard: the bills you add to your watchlist, analyses you request, and
            maps you save in the Legislative Toolkit. We keep these so the dashboard works for you and so
            we can respond to your requests.
          </li>
          <li>
            Display preferences, such as light or dark mode, which are stored only in your own browser.
          </li>
        </ul>

        <h2>How we use it</h2>
        <p>
          We use this information only to provide the dashboard: signing you in, showing you your
          organization’s materials, and handling your requests. We do not sell, rent or share your
          information with anyone for marketing, and we don’t use it for advertising.
        </p>

        <h2>Service providers</h2>
        <p>
          The dashboard runs on Cloudflare, which handles sign-in and hosting and keeps standard security
          logs of sign-ins. Pages load fonts from Google Fonts, which receives your IP address the way any
          website visit does. Bill information comes from public sources such as the Tennessee General
          Assembly and LegiScan; we don’t send them your information.
        </p>

        <h2>How long we keep it</h2>
        <p>
          We keep your account information for as long as you’re a client. When a client account is
          closed, we delete its sign-in access, watchlist, requests and the materials shared with it.
        </p>

        <h2>Your choices</h2>
        <p>
          You can ask us at any time to see, correct or delete the information we hold about you by
          contacting us at <a href={`mailto:${email}`}>{email}</a>.
        </p>

        <h2>Changes</h2>
        <p>If we change this policy, we’ll update the date above and post the new version on this page.</p>
      </div>
    </article>
  )
}
