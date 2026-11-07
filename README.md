# haystack.agency

Haystack is a small tech recruitment agency in Geneva. This is its website: Next.js 14 (App Router) and Tailwind 3, server-rendered, with real event photography and CSS-only motion. The only client JavaScript beyond the Next runtime is the phone menu, the nav's current-page marker and the contact form.

## Run it

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm lint
pnpm build    # production build
pnpm start
```

## Contact form

The form posts to `src/app/api/contact/route.ts`, which sends the message through the Resend email API (`POST https://api.resend.com/emails`, `src/lib/contact.ts`), with the visitor as reply-to. It escapes all input, has a honeypot field and a small per-instance rate limit, and also works without JavaScript (plain form post, redirect back to `/contact?sent=1` or `/contact?error=1#form`).

Environment variables (set in Vercel, never committed):

- `RESEND_API_KEY`
- `CONTACT_FORM_FROM_NAME` (default `Haystack`)
- `CONTACT_FORM_FROM_EMAIL` (default `david.v@haystack.agency`, a send-only address on the verified domain; replies go to the visitor)
- `CONTACT_FORM_TO` (default `davidvinkenroye@gmail.com`; the old david.v@haystack.agency mailbox no longer exists)
- `NEWSLETTER_SECRET` (any long random string; signs the Field notes confirmation links)
- `NEWSLETTER_SEGMENT_ID` (the Resend segment for Field notes subscribers)
- `NEWSLETTER_FROM` (e.g. `David Vinkenroye <david.v@haystack.agency>`)
- `NEWSLETTER_REPLY_TO` (e.g. `davidvinkenroye@gmail.com`; must be a real inbox)

The sending domain `haystack.agency` must be verified in Resend (DNS records from the Resend dashboard), or Resend refuses to send from it.

## FDE Club Switzerland

`/forward-deployed-engineers` is the hub for FDE Club Switzerland (Switzerland's first club for forward deployed engineers, started by Haystack); `/forward-deployed-engineers/what-is-a-forward-deployed-engineer` is the evergreen guide. Facts live in `src/lib/site.ts` (`FDE_CLUB`, `FDE_UPDATED`, `FDE_EMPLOYERS`, `FDE_EVENTS`), copy in `src/lib/content.ts` (`FDE_DEFINITION`, `FDE_HUB`, `FDE_CLUB_FAQ`, `FDE_GUIDE`, `FDE_GUIDE_FAQ`, `FDE_SOURCES`), components in `src/components/fde/`. Re-check every employer row on its source before bumping `FDE_UPDATED`. `FDE_EVENTS` stays empty until a meetup date and venue are confirmed; no Event JSON-LD is emitted until then.

The join form posts to `src/app/api/fde-club/route.ts` and reuses the Resend pipeline in `src/lib/contact.ts` (same env vars). Emails are tagged `[FDE Club join]` or `[FDE Club speaker]`; `/contact?topic=fde` prefills the role and tags the email `[Hire an FDE]`. Without JavaScript the form redirects to `/forward-deployed-engineers?joined=1#join` or `?error=1#join`. The form reads `?joined`, `?error` and `?kind=speak` on the client (`useSearchParams` in a Suspense boundary), so the hub stays a static page served from the CDN; do not read `searchParams` in the page itself.

## Field notes

`/field-notes` is David's bylined blog on forward deployed engineering and tech hiring in Switzerland. Posts are Markdown files in `content/field-notes/` (format in the README there), committed by the agent in `nas/field-notes/`, with images in `public/field-notes/`. `src/lib/field-notes.ts` reads them at build time (`src/lib/markdown.ts` renders the body from escaped text, so no raw HTML is ever rendered); a new post goes live with the next deploy. The index, posts, `/field-notes/rss.xml`, the sitemaps, `llms.txt`, `llms-full.txt`, the BlogPosting JSON-LD and the "Latest field notes" strip on the FDE hub all read from there. The author's Person `@id` is the one on rive-foundry.com (`AUTHOR` in `site.ts`). Field notes is in the footer, not in the main nav. With zero posts the index shows an empty state and the hub strip is hidden.

Newsletter (double opt-in): when the newsletter box on the FDE Club form is ticked, `/api/fde-club` also sends a confirmation email through Resend (`sendFieldNotesConfirmation` in `src/lib/newsletter.ts`) and stores nothing. The link carries the email, first name and a 7 day expiry, signed with HMAC (`NEWSLETTER_SECRET`). `/api/field-notes/confirm` checks it, adds the person to the Resend segment `NEWSLETTER_SEGMENT_ID` (`POST /contacts`; 409 means already a contact, which is fine) and redirects to `/field-notes?subscribed=yes`, `expired` or `error`, shown by `SubscribedNotice` on the client so the page stays static. The join form tells people who ticked the box to check their inbox (no JS: `?joined=1&newsletter=1#join`). Without `RESEND_API_KEY`, `NEWSLETTER_SECRET` or `NEWSLETTER_FROM` the email is skipped and logged; a Resend error never fails the sign-up. The NAS agent sends each new note as a Resend broadcast to the same segment (see `nas/field-notes/README.md`).

## Where things live

- `src/lib/site.ts`: facts (URL, LinkedIn, city, brand colours). `src/lib/content.ts`: all copy, with the house copy rules in its header. Pages, JSON-LD (`src/lib/seo.ts`), `llms.txt`, `llms-full.txt` and the sitemap read from these two files.
- `src/app/`: one folder per route (`/`, `/process`, `/about`, `/contact`, `/privacy`) with its own Open Graph image, plus the 404 page. `globals.css` holds the design tokens and the component classes (buttons, cards, frames, stitches, header, menu, form).
- `src/components/home/`: the home page sections. `src/components/sections.tsx`: the closing call to action on the home, process and about pages.
- `src/components/ui/`: small server components (`Section`, `Container`, `SectionHeading`, `Frame`, `Button`, `Card`, `StepList`, `CheckList`, `Faq`, `Stitch`, `Reveal`, `HaystackMark`).
- `src/components/site/`: header, footer, phone menu and nav links.
- `src/lib/formations/strands.ts` (with `random.ts`): rebuilds the logo mark from numbers. The SVG mark and the Open Graph images both draw from it.
- `src/lib/og.tsx`: the Open Graph image template (a full-bleed editorial image under a navy gradient, the mark, the page title and the brand line). Cards are re-encoded as JPEG with sharp so they stay well under the size limits of WhatsApp and Slack previews.

## Images

Every image on the site is an editorial illustration in one documentary daylight style: people at work in Swiss offices, labs, plants and campuses, generated with fal.ai `fal-ai/nano-banana-pro` and chosen by David on 7 November 2026 after the Romandy CTO event photos and the earlier still lifes. They show no real clients, candidates or events, so they carry no captions, and alt text describes the scene only. Photos are served through `next/image` (AVIF or WebP, responsive `sizes`, blur placeholders). Each page has one priority image; everything else is lazy.

The pipeline lives in `scripts/images/`:

1. `photos.json` lists each photo: `id` (a descriptive slug, which is also the file name), the absolute path of the 2K PNG original (in `~/Pictures/Haystack site 2026-11/`, not in git), the slot it fills, its alt text, its focal point `position` (CSS object-position), and for the two Open Graph photos an `og` name. The `grade` is neutral: the images are already in palette.
2. `node scripts/images/photos.cjs` (from the repo root, on a machine that has the originals) applies the EXIF orientation, resizes to 2400px on the long edge, grades, strips metadata and writes `public/images/site/<id>.webp` (quality 78), the 1200x630 crops `og-default.jpg` and `og-fde.jpg`, and regenerates `src/lib/images.ts` (sizes, alt text, focal points, blur placeholders, `OG_IMAGES`). Do not edit `images.ts` by hand.
3. `<Frame>` uses the photo's `position` unless a page passes its own, and takes `overlay="navy"` or `overlay="navy-strong"` when text sits on or next to the photo. `ogImage(title, "fde")` in `src/lib/og.tsx` picks the FDE photo; the default is the meetup around a laptop.

To swap an image: generate a new one in the same style, point its entry at it (or add an entry), rerun the script, then check the crop at every ratio the slot uses.

The earlier generated still lifes (`prompts.json`, `generate.py`, `selection.json`, `optimize.cjs`) are kept for reference only. Do not run `optimize.cjs`: it would overwrite `images.ts` with ids the site no longer uses.

Logo source files live in `public/brand/` (used by the JSON-LD) and `public/images/` (originals, not used by the pages).

## Search and AI assistants

- `src/lib/seo.ts` builds one JSON-LD graph per page with stable `@id`s: Haystack, the FDE Club (a sub-organisation), the two services, the `DefinedTerm` for "forward deployed engineer", the guide `Article`, FAQs, breadcrumbs and the employer `ItemList`. Every page gets `dateModified` and a `primaryImageOfPage`.
- `src/lib/page-images.ts` says which photos each page shows (first = primary). It feeds the JSON-LD and `/image-sitemap.xml`. Change it when a Frame changes.
- `robots.ts` allows search and AI crawlers by name and lists both sitemaps. `/llms.txt` and `/llms-full.txt` come from `src/lib/llms.ts`.
- Dates: bump `CONTENT_UPDATED` (recruitment pages) or `FDE_UPDATED` (FDE pages, only after re-checking every employer row) in `src/lib/site.ts`. The sitemap, JSON-LD and llms files follow.
- IndexNow: the key is `INDEXNOW_KEY` in `site.ts`, served from `public/<key>.txt`. After a production deploy, run `node scripts/indexnow.mjs` (or pass paths) to ping Bing and friends. It refuses to run until the key file is live.
- Outside the repo: verify the site in Google Search Console and Bing Webmaster Tools and submit both sitemaps; check the Vercel firewall does not block AI bots; run the Rich Results test on the hub and the guide.

## Motion

No animation library. Above the fold, the hero lead and buttons settle in once on load (`.enter`); the h1 and the priority image are never animated so they do not delay LCP. Below the fold, `<Reveal>` uses CSS scroll-driven animations (`animation-timeline: view()`); browsers without support simply show the content. `prefers-reduced-motion` turns all of it off.

## Deploy

Vercel, region fra1, deployed from git. Old routes (`/solutions`, `/cases`, `/roles`, `/jobs`, `/imprint`) redirect in `next.config.mjs`.
