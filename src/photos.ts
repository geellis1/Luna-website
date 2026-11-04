// Placeholder advocacy photos, free under the Unsplash license and loaded from
// Unsplash for now; to be swapped for final images and saved into /public.
// Used by the homepage hero (Scrapbook).

export const unsplash = (id: string, width = 640) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=70`

export const photos = {
  capitol: { id: '1602364438008-9aa4242284b8', alt: 'State capitol dome' },
  rally: { id: '1591824353737-61237487acf4', alt: 'People rallying with a "Time for change" sign' },
  hands: { id: '1582213782179-e0d53f98f2ca', alt: 'Hands stacked together in a circle' },
  meeting: { id: '1515187029135-18ee286d815b', alt: 'A community meeting' },
}

export type PhotoKey = keyof typeof photos
