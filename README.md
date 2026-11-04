# Luna Civic Strategies: Marketing Website

Public marketing site for Luna Civic Strategies (lunacivicstrategies.com).
React + Vite, deployed on Vercel, contact form delivered by Resend.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173. Note: `npm run dev` serves the pages only; the contact form API
(`/api/contact`) runs on Vercel. To test the form locally, use `npx vercel dev` with a `.env` file.

## Where things live

| What | Where |
| --- | --- |
| Colors and fonts (brand tokens) | `src/index.css`, top of file |
| Page copy, pillars, service tiers, bio | `src/content.ts` |
| Pages | `src/pages/` (Home, About, Services, Contact) |
| Nav, footer, shared sections | `src/components/` |
| Contact form email (Resend) | `api/contact.ts` |

## Swapping in real assets

- **Copy:** any text in `src/content.ts` wrapped in `[square brackets]` is a placeholder and shows
  highlighted in chartreuse on the site. Replace it with the final copy.
- **Logo:** `public/logo-white.png` (white, used on the dark nav and footer). Replace that file to update it everywhere.
- **Hero illustration:** replace `src/components/MoonPlaceholder.tsx` with the Luna line-art SVG.
- **Kelli's photo:** replace the `photo-placeholder` div in `src/pages/About.tsx`.
- **Fonts:** change `--font-serif` and `--font-sans` in `src/index.css`.

## Deploy (Vercel)

1. Import this GitHub repo in Vercel (framework preset: Vite).
2. In Resend, verify the domain `lunacivicstrategies.com` and create an API key.
3. In Vercel → Settings → Environment Variables, add the values from `.env.example`:
   `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (Kelli's inbox), `CONTACT_FROM_EMAIL`.
4. Add the custom domain `lunacivicstrategies.com` in Vercel → Settings → Domains.

## Design

The site uses the design Kelli chose in review: the **Scrapbook** homepage in
the **Cream Paper** colors, with the **Moon Menu** (crescent moon + menu lines)
opening as a **right-side drawer**.

The full design explorer she reviewed (five homepages, color palettes, nav and
menu options, favorites and shareable review links) is kept on the
`brainstorm` branch and frozen at the tag `design-explorer-v1`, as a reference
for future projects.
