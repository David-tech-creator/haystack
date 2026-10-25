# haystack.agency

Haystack is a small tech recruitment agency in Geneva. This is its website: Next.js 14 (App Router) and Tailwind 3, server-rendered, with editorial still images and CSS-only motion. The only client JavaScript beyond the Next runtime is the phone menu, the nav's current-page marker and the contact form.

## Run it

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm lint
pnpm build    # production build
pnpm start
```

## Contact form

The form posts to `src/app/api/contact/route.ts`, which sends the message through the Brevo transactional API (`src/lib/contact.ts`). It escapes all input, has a honeypot field and a small per-instance rate limit, and also works without JavaScript (plain form post, redirect back to `/contact?sent=1` or `/contact?error=1#form`).

Environment variables (set in Vercel, never committed):

- `BREVO_API_KEY`
- `CONTACT_FORM_FROM_NAME`
- `CONTACT_FORM_FROM_EMAIL`
- `CONTACT_FORM_TO`

## Where things live

- `src/lib/site.ts`: facts (URL, LinkedIn, city, brand colours). `src/lib/content.ts`: all copy, with the house copy rules in its header. Pages, JSON-LD (`src/lib/seo.ts`), `llms.txt`, `llms-full.txt` and the sitemap read from these two files.
- `src/app/`: one folder per route (`/`, `/process`, `/about`, `/contact`, `/privacy`) with its own Open Graph image, plus the 404 page. `globals.css` holds the design tokens and the component classes (buttons, cards, frames, stitches, header, menu, form).
- `src/components/home/`: the home page sections. `src/components/sections.tsx`: the closing call to action on the home, process and about pages.
- `src/components/ui/`: small server components (`Section`, `Container`, `SectionHeading`, `Frame`, `Button`, `Card`, `StepList`, `CheckList`, `Faq`, `Stitch`, `Reveal`, `HaystackMark`).
- `src/components/site/`: header, footer, phone menu and nav links.
- `src/lib/formations/strands.ts` (with `random.ts`): rebuilds the logo mark from numbers. The SVG mark and the Open Graph images both draw from it.
- `src/lib/og.tsx`: the Open Graph image template (cream paper, the mark, the page title, the hero photograph on the right).

## Images

Every photograph is an art-directed still life (straw, a gold needle, navy thread, linen, cream paper) generated with OpenAI `gpt-image-2.5`, then optimised with sharp. They are served through `next/image` (AVIF or WebP, responsive `sizes`, blur placeholders). Each page has one priority image; everything else is lazy.

The pipeline lives in `scripts/images/`:

1. `prompts.json` holds the prompt, size and alt text for each image id.
2. `generate.py <id> [suffix]` calls the Images API with `OPENAI_API_KEY` from the environment and writes a raw PNG to `scripts/images/raw/` (git-ignored).
3. `selection.json` names the raw take chosen for each id.
4. `node scripts/images/optimize.cjs scripts/images/selection.json` writes the WebP files to `public/images/site/`, the OG crop `og-needle.jpg`, and regenerates `src/lib/images.ts` (sizes, alt text, blur placeholders). Do not edit `images.ts` by hand.

Logo source files live in `public/brand/` (used by the JSON-LD) and `public/images/` (originals, not used by the pages).

## Motion

No animation library. Above the fold, the hero lead and buttons settle in once on load (`.enter`); the h1 and the priority image are never animated so they do not delay LCP. Below the fold, `<Reveal>` uses CSS scroll-driven animations (`animation-timeline: view()`); browsers without support simply show the content. `prefers-reduced-motion` turns all of it off.

## Deploy

Vercel, region fra1, deployed from git. Old routes (`/solutions`, `/cases`, `/roles`, `/jobs`, `/imprint`) redirect in `next.config.mjs`.
