# Field notes

One Markdown file per post, written by David (or by the agent in
`nas/field-notes/`, in David's voice and first person). The file name is the
address: `swiss-fde-salaries.md` is published at `/field-notes/swiss-fde-salaries`.
A post goes live with the next deploy to `main`. This README is never published.

The format is the same one the Rive-Foundry Frontier agent writes
(`nas/frontier/src/validate.mjs`, `renderPost()`), with images under
`/field-notes/` instead of `/logbook/frontier/`.

## The file

```
---
title: Why Swiss FDE postings ask for German
date: 2026-11-20
summary: One or two sentences for the list, search results, RSS and link previews.
---

**The short version**

- First TL;DR bullet.
- Second bullet.
- Third bullet.

![What the image shows, as alt text](/field-notes/why-swiss-fde-postings-ask-for-german.jpg)

*Image: [Source name](https://example.com/where-the-image-came-from)*

The post itself, in Markdown. David's first person is fine here.

## A section heading

More text, [inline links](https://example.com), `code` and code blocks.

## Sources

- [Title of the source](https://example.com/page), Publisher name
- [Another source](https://example.com/other), Publisher name
```

### Front matter

One `key: value` per line between the two `---` lines. Values may be quoted;
colons inside a value are fine (only the first colon splits).

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Plain text. |
| `date` | yes | `YYYY-MM-DD`. Publication date; also `lastModified` in the sitemap. |
| `summary` | no | Plain text. Falls back to the first TL;DR bullet, then the first paragraph. |
| `updated` | no | `YYYY-MM-DD`, only if the post was revised later. |
| `draft` | no | `draft: true` keeps the file off the site. |

A file without a title, without a valid date, or with a file name that is not
lowercase words joined by single hyphens (`a-z`, `0-9`) is skipped, not fatal.

### Body

The parser lifts these out of the body when they come first, in this order
(blank lines between them are fine), and shows them in their own blocks:

1. **TL;DR**: a line `**The short version**` (also accepted: `## The short version`, `**TL;DR**`), then a `-` list.
2. **Figure**: a line holding only `![alt](/field-notes/<slug>.<ext>)`. The file goes in
   `public/field-notes/<slug>.<ext>`: `jpg`, `png` or `webp` (a sourced image, always with
   a credit) or `svg` (a diagram, no credit needed). Write real alt text. If the file is
   missing, the figure is dropped rather than shown broken.
3. **Credit**: right after the figure, `*Image: [Source](https://url)*` (also `Photo:`,
   `Diagram:`, `Credit:`; a plain `*Image: Source*` without a link works too).

and from the end:

4. **Sources**: the last `## Sources` heading and the list under it, one
   `- [Title](https://url), Publisher` per line. Shown as a numbered list and emitted as
   `citation` in the BlogPosting JSON-LD.

Anything else stays in the body. If the TL;DR or figure is missing, the post
still renders.

### What works in the body

- paragraphs, `## headings`, `### smaller headings` (a `#` heading becomes `##`; the title is the page's only h1)
- `**bold**`, `*italic*`, `` `code` ``, [links](https://example.com)
- lists with `-` or `1.`, `> quotes`, `---` rules
- code blocks between three backticks (a language after the backticks is kept as a class)
- more images: `![alt](/field-notes/other-image.webp)`

Raw HTML is never rendered: the whole file is escaped before the Markdown is
turned into tags, so `<script>` or `<div>` shows up as text. Links and images
only accept `https://`, `http://`, site paths (`/...`), `#anchors` and `mailto:`.
No tables, footnotes or nested lists.

## Where a post shows up

`/field-notes` (newest first), `/field-notes/<slug>` (with its own Open Graph
image), `/field-notes/rss.xml`, the "Latest field notes" strip on
`/forward-deployed-engineers` (three newest), `sitemap.xml`, `image-sitemap.xml`,
`llms.txt` and `llms-full.txt` (ten newest). All of them read
`src/lib/field-notes.ts`.

## House rules for the agent

Posts are bylined "David Vinkenroye, Haystack", so David's first person is
allowed (site copy elsewhere is "we"). No em or en dashes, no invented numbers
or claims (every figure needs a source in `## Sources`), no closing slogans.
