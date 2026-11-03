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

## Design options (review mode)

A chartreuse bar above the nav lets reviewers switch between home page options.
Each option has a shareable link, e.g. `/?home=bold`, and the bar's **Copy link** button copies it.

- Options are listed in `src/options.ts`; each one is a component in `src/pages/home/`.
- At launch, set `VITE_HIDE_OPTIONS=true` in Vercel (or delete the unused options) to hide the bar.
