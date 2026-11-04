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

An **Explore Designs** button (bottom-right) opens a panel with five sections:
Homepage Design, Color Palette, Navigation Style, Menu Layout and Menu Button.
Every choice updates the site immediately and is written into the URL.
**Reset to default** returns to the original choices.

- **Color palettes** apply to every homepage hero through the `--p-*` tokens in
  `src/index.css` (`html[data-palette]`). Each homepage has a recommended
  palette (`recommendedPalette` in `src/options.ts`), used until the client
  picks one herself.
- **Save to Favorites** keeps the whole combination with an optional name and
  note. Favorites live in that browser's localStorage (`luna-favorites`), so
  they don't follow the client to another device.
- **Review & Share Selections** saves the design and copies a link that opens it
  anywhere, with her name, feedback and preferred flag shown in a small card.
  The design travels as the usual URL params; the note is a versioned,
  base64url-encoded `review` param (`src/favorites.ts`). No database needed.
- Choices are defined in `optionGroups` in `src/options.ts`; the panel is
  `src/components/DesignDrawer.tsx` with previews in `DesignPreviews.tsx`.
- Not offered to the client but kept in the code: the Classic navigation bar,
  the Floating Pill nav and the Moon Halo illustration.
- At launch, set `VITE_HIDE_OPTIONS=true` in Vercel to hide the button and drawer.
