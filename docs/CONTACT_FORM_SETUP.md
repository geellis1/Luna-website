# Contact form setup

When someone sends the contact form at lunacivicstrategies.com/contact:

1. **An email goes to Kelli** at `kelli@lunacivicstrategies.com`, from `website@lunacivicstrategies.com`, with the subject *New Contact Form Submission — Luna Civic Strategies*. Hitting Reply answers the person who wrote in.
2. **A row is added to her Google Sheet** ([Contact form submissions](https://docs.google.com/spreadsheets/d/1je9A_gd11WlBN7OLwSyFePBB1tvsvVOkZRD-lUPYddM/edit)) on a tab called **Submissions**: Timestamp, First Name, Last Name, Email, Organization, Interested In, Phone, Working Toward.

The email is the important one: if the sheet can't be reached, the person still sees "Received." and Kelli still gets the email. The problem shows up in Vercel's logs.

The code: `api/contact.ts` (the website side) and `scripts/google-sheets-webhook.gs` (the sheet side).

---

## Part 1: Resend (email)

`RESEND_API_KEY` is already in Vercel. Two things to confirm in [Resend](https://resend.com):

1. **Domains → `lunacivicstrategies.com` shows "Verified".** Resend only sends from a verified domain. If it isn't there yet, click **Add Domain**, enter `lunacivicstrategies.com`, and add the DNS records it lists in **Namecheap → Domain List → Manage → Advanced DNS** (usually a few TXT records and one MX record on a `send` subdomain). Then click **Verify** in Resend.
2. **The API key has "Sending access"** (or Full access).

---

## Part 2: Google Sheets (logging)

### 1. Make a secret

The secret stops anyone else from writing to the sheet. In Terminal, run:

```bash
openssl rand -hex 24
```

Copy the result. You'll paste it in two places: steps 4 and 7.

### 2. Open the sheet's script editor

Open [the sheet](https://docs.google.com/spreadsheets/d/1je9A_gd11WlBN7OLwSyFePBB1tvsvVOkZRD-lUPYddM/edit), signed in as the Google account that owns it, then **Extensions → Apps Script**.

### 3. Paste the code

Delete everything in `Code.gs`, paste the whole contents of `scripts/google-sheets-webhook.gs`, and click **Save** (the disk icon). Rename the project at the top if you like, for example "Luna contact form".

### 4. Save the secret in the script

Click the **gear icon (Project Settings)** on the left, scroll to **Script Properties**, then **Add script property**:

- Property: `SHARED_SECRET`
- Value: the secret from step 1

Click **Save script properties**.

### 5. Check it works (optional)

Back in the editor (the `< >` icon), pick **testRow** in the function dropdown at the top and click **Run**. The first time, Google asks for permission: **Review permissions → choose the account → Advanced → Go to Luna contact form (unsafe) → Allow**. ("Unsafe" just means Google hasn't reviewed this private script.) A **Submissions** tab appears in the sheet with headers and a test row. Delete the test row.

### 6. Deploy it as a web app

Click **Deploy → New deployment**, then the gear next to "Select type" → **Web app**:

- Description: `Contact form`
- Execute as: **Me**
- Who has access: **Anyone**

Click **Deploy** (authorize again if asked). Copy the **Web app URL**. It ends in `/exec`.

"Anyone" only means the website can reach it without a Google login. It does nothing without the secret, and it can only add rows, never read the sheet.

### 7. Add the two values to Vercel

In Vercel: **luna-website → Settings → Environment Variables**, add both for **Production** (and Preview, if you want preview links to log too):

| Name | Value |
|---|---|
| `SHEETS_WEBHOOK_URL` | the Web app URL from step 6 |
| `SHEETS_WEBHOOK_SECRET` | the secret from step 1 |

### 8. Redeploy

Environment variables only apply to new deployments. In Vercel go to **Deployments**, open the menu (⋯) on the latest Production deployment, and choose **Redeploy**.

### 9. Test it

Send the form at lunacivicstrategies.com/contact. Within a few seconds:

- the page shows "Received."
- Kelli's inbox has the email
- the **Submissions** tab has a new row

If the email arrives but no row appears, check Vercel → **Logs** for "Google Sheets logging failed".

---

## Changing the script later

Edit the code in Apps Script, then **Deploy → Manage deployments → pencil (Edit) → Version: New version → Deploy**. This keeps the same URL, so Vercel needs no changes. Choosing "New deployment" instead creates a new URL, which would then need updating in Vercel.
