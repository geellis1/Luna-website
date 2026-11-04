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

A **Design options** button in the bottom-right corner opens a panel for switching
between home page options, moon styles (home option B), headline color (B and C),
nav bar styles, and the floating pill's color. It floats
over the page, so the real layout is never pushed down. Each combination has a
shareable link (e.g. `/?home=bold&moon=collage&nav=pill`); **Copy link** copies it.

- Options are listed in `optionGroups` in `src/options.ts`. Home options are components in
  `src/pages/home/`, moon styles in `src/components/moons/`, nav styles in
  `src/components/Nav.tsx` plus `.nav--<style>` rules in `src/index.css`.
- At launch, set `VITE_HIDE_OPTIONS=true` in Vercel (or delete the unused options) to hide it.
