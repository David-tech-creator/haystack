# haystack.agency

Haystack is a small tech recruitment agency in Geneva. This is its website: Next.js 14 (App Router), Tailwind 3, and one three.js particle field that tells the story as you scroll.

## Run it

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build
pnpm start
```

## Contact form

The form posts to `src/app/api/contact/route.ts`, which sends the message through the Brevo transactional API (`src/lib/contact.ts`). It escapes all input, has a honeypot field and a small per-instance rate limit, and also works without JavaScript (plain form post, redirect back to `/contact?sent=1`).

Environment variables (set in Vercel, never committed):

- `BREVO_API_KEY`
- `CONTACT_FORM_FROM_NAME`
- `CONTACT_FORM_FROM_EMAIL`
- `CONTACT_FORM_TO`

## Where things live

- `src/lib/site.ts`: facts (URL, LinkedIn, city). `src/lib/content.ts`: all copy. Pages, JSON-LD (`src/lib/seo.ts`), `llms.txt`, `llms-full.txt` and the sitemap read from these two files.
- `src/components/particles/`: the engine (`engine.ts`, `shaders.ts`, per-device placement in `layout.ts`, static SVG fallbacks in `static.tsx`).
- `src/lib/formations/`: the shapes. `strands.ts` rebuilds the logo mark from numbers; the particles and the SVG fallback both use it.

## The particle story

Sections opt in with `data-formation`:

| formation | section | what it does |
| --- | --- | --- |
| `haystack` | hero, what we do | straw falls in and forms the logo mark, one gold straw |
| `sweep` | the five sprint steps | a search line walks the steps; the step under it opens; the gold straw flares on Shortlist |
| `needle` | what we look for | the stack settles into a pile, a needle rises out of it |
| `thread` | Inside Haystack (dark) | a running stitch crosses the section, the needle leading |
| `stitch` | the shortlist note | the thread sews around the three cards in order (`data-outline-target` lists their ids) |
| `loose` | FAQ, 404 | the thread rolls into a small ball |
| `contact` | closing CTA, contact form | a stitched outline around the target, a gold knot, the needle parked |

Each formation writes `--<name>-ready` (0..1) on `<html>` for text reveals. Reduced motion or no WebGL2: no canvas, static SVGs and CSS stitches instead. On touch devices three.js loads after the page has painted. Portrait phones do not pin the stage: each section opens with a window for its shape and the copy follows.

## Deploy

Vercel, region fra1, deployed from git. Old routes (`/solutions`, `/cases`, `/roles`, `/jobs`) redirect permanently in `next.config.mjs`.
