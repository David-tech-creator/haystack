/**
 * Field notes: one Markdown file per post in content/field-notes/, committed
 * by the agent in nas/field-notes/ (same format as the Rive-Foundry Frontier
 * agent; see content/field-notes/README.md). Read at build time, so a new
 * post goes live with the next deploy.
 *
 * The parser is deliberately tolerant: it pulls the TL;DR, the figure, its
 * credit and the Sources list out of the body when they are where the agent
 * puts them, and otherwise leaves everything in the body. A file it cannot
 * read (no title, no valid date, bad slug, draft) is skipped, never fatal.
 */
import fs from "node:fs"
import path from "node:path"
import { escapeHtml, inline, plainText, renderMarkdown, safeHref } from "./markdown"
import { FIELD_NOTES_PATH } from "./site"

export type FieldNoteFigure = {
  /** Site path (/field-notes/<slug>.webp) or an absolute https URL. */
  src: string
  alt: string
  credit?: { label: string; url?: string }
}

export type FieldNoteSource = { title: string; url?: string; source?: string }

export type FieldNote = {
  slug: string
  title: string
  /** YYYY-MM-DD */
  date: string
  /** YYYY-MM-DD, optional `updated:` field, else the date. */
  updated: string
  summary: string
  /** TL;DR bullets as inline HTML (built from escaped text). */
  tldr: string[]
  /** The same bullets as plain text, for JSON-LD, RSS and llms.txt. */
  tldrText: string[]
  figure?: FieldNoteFigure
  /** The body as HTML, built from escaped text by renderMarkdown. */
  html: string
  sources: FieldNoteSource[]
  words: number
  /** Rough reading time in minutes. */
  minutes: number
}

const DIR = path.join(process.cwd(), "content", "field-notes")
const PUBLIC = path.join(process.cwd(), "public")
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}/

/* Front matter --------------------------------------------------------------- */

function parseFrontmatter(src: string): { data: Record<string, string>; body: string } {
  const m = /^﻿?---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)([\s\S]*)$/.exec(src)
  if (!m) return { data: {}, body: src }
  const data: Record<string, string> = {}
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":")
    if (i < 1 || /^\s/.test(line)) continue
    const raw = line.slice(i + 1).trim()
    const quoted = /^(["'])([\s\S]*)\1$/.exec(raw)
    data[line.slice(0, i).trim().toLowerCase()] = quoted ? quoted[2] : raw
  }
  return { data, body: m[2] }
}

/* Body structure --------------------------------------------------------------- */

const TLDR_RE = /^\s*(?:#{2,4}\s*)?(?:\*\*|__)?\s*(?:the short version|tl;?\s?dr|in short)\s*:?\s*(?:\*\*|__)?\s*:?\s*$/i
const LIST_RE = /^\s*(?:[-*+]|\d+[.)])\s+(.*)$/
const FIGURE_RE = /^\s*!\[([^\]]*)\]\(((?:[^()\s]|\([^()\s]*\))+)(?:\s+"[^"]*")?\)\s*$/
const CREDIT_RE = /^\s*([*_])\s*(?:image|photo|picture|diagram|illustration|chart|figure|credit|source)s?\s*:\s*(.+?)\s*\1\s*$/i
const SOURCES_RE = /^\s*(?:#{2,4}\s*(?:sources|references)\s*:?|(?:\*\*|__)(?:sources|references):?(?:\*\*|__)\s*:?)\s*$/i
const LINK_RE = /^\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/
/** "Title, Publisher": a comma, colon, middle dot or any dash between the link and the publisher. */
const SOURCE_SEP = new RegExp(`^\\s*[,:;|${String.fromCharCode(0xb7, 0x2013, 0x2014)}-]\\s*`)

function parseCredit(text: string): FieldNoteFigure["credit"] {
  const link = /^(.*?)\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)(.*)$/.exec(text)
  if (link) {
    const url = safeHref(link[3]) ?? undefined
    const label = plainText(`${link[1]}${link[2]}${link[4]}`).replace(/\s+/g, " ").trim()
    return { label, url }
  }
  return { label: plainText(text) }
}

function parseSource(line: string): FieldNoteSource | null {
  const item = LIST_RE.exec(line)
  const text = (item ? item[1] : line).trim()
  if (!text) return null
  const link = LINK_RE.exec(text)
  if (!link) return { title: plainText(text) }
  const rest = text.slice(link[0].length).replace(SOURCE_SEP, "").trim()
  return { title: plainText(link[1]), url: safeHref(link[2]) ?? undefined, source: rest ? plainText(rest) : undefined }
}

/** A local figure must exist in public/, or it is dropped (no broken image on the page). */
function figureExists(src: string) {
  if (/^https?:\/\//i.test(src)) return true
  const file = path.join(PUBLIC, decodeURIComponent(src.split(/[?#]/)[0]))
  return file.startsWith(PUBLIC) && fs.existsSync(file)
}

type Parts = { tldr: string[]; figure?: FieldNoteFigure; body: string; sources: FieldNoteSource[] }

function splitBody(md: string): Parts {
  const lines = md.replace(/\r\n?/g, "\n").split("\n")

  // Sources: the last "## Sources" heading and the list after it.
  let sources: FieldNoteSource[] = []
  let end = lines.length
  for (let i = lines.length - 1; i >= 0; i--) {
    if (SOURCES_RE.test(lines[i])) {
      sources = lines
        .slice(i + 1)
        .filter((l) => l.trim())
        .map(parseSource)
        .filter((s): s is FieldNoteSource => s !== null)
      end = i
      break
    }
  }

  // Head: the TL;DR block, the figure and its credit, in any order, before the first other line.
  const tldr: string[] = []
  let figure: FieldNoteFigure | undefined
  let i = 0
  const skipBlank = () => {
    while (i < end && !lines[i].trim()) i++
  }
  for (;;) {
    skipBlank()
    if (i >= end) break
    const line = lines[i]
    if (!tldr.length && TLDR_RE.test(line)) {
      i++
      skipBlank()
      while (i < end) {
        const li = LIST_RE.exec(lines[i])
        if (li) tldr.push(li[1].trim())
        else if (tldr.length && /^\s{2,}\S/.test(lines[i])) tldr[tldr.length - 1] += ` ${lines[i].trim()}`
        else break
        i++
      }
      continue
    }
    const fig = !figure ? FIGURE_RE.exec(line) : null
    if (fig) {
      const src = safeHref(fig[2])
      i++
      if (src && figureExists(src)) figure = { src, alt: plainText(fig[1]) }
      skipBlank()
      const credit = i < end ? CREDIT_RE.exec(lines[i]) : null
      if (credit) {
        if (figure) figure.credit = parseCredit(credit[2])
        i++
      }
      continue
    }
    break
  }

  return { tldr, figure, body: lines.slice(i, end).join("\n").trim(), sources }
}

/** First paragraph of the body as plain text, for posts without a summary. */
function firstParagraph(body: string) {
  const para = body.split(/\n\s*\n/).find((p) => p.trim() && !/^\s*(#|!\[|```|>|[-*+]\s|\d+[.)]\s)/.test(p))
  const text = plainText((para ?? "").replace(/\s+/g, " "))
  return text.length > 220 ? `${text.slice(0, 217).replace(/\s+\S*$/, "")}...` : text
}

/* Reading ---------------------------------------------------------------------- */

let cache: FieldNote[] | undefined

function readPost(file: string): FieldNote | null {
  const slug = file.replace(/\.md$/i, "")
  if (!SLUG_RE.test(slug)) return null
  let src: string
  try {
    src = fs.readFileSync(path.join(DIR, file), "utf8")
  } catch {
    return null
  }
  const { data, body } = parseFrontmatter(src.replace(/\r\n?/g, "\n"))
  const date = DATE_RE.exec(data.date ?? "")?.[0]
  if (data.draft === "true" || !data.title || !date) return null
  const updated = DATE_RE.exec(data.updated ?? "")?.[0]
  const parts = splitBody(body)
  const words = `${parts.tldr.join(" ")} ${parts.body}`.split(/\s+/).filter(Boolean).length
  return {
    slug,
    title: data.title,
    date,
    updated: updated && updated > date ? updated : date,
    summary: data.summary || (parts.tldr[0] ? plainText(parts.tldr[0]) : firstParagraph(parts.body)),
    tldr: parts.tldr.map((t) => inline(escapeHtml(t))),
    tldrText: parts.tldr.map(plainText),
    figure: parts.figure,
    html: renderMarkdown(parts.body),
    sources: parts.sources,
    words,
    minutes: Math.max(1, Math.round(words / 220)),
  }
}

/** Published posts, newest first. The README, drafts and unreadable files are skipped. */
export function getFieldNotes(): FieldNote[] {
  if (cache) return cache
  let files: string[] = []
  try {
    files = fs.readdirSync(DIR).filter((f) => /\.md$/i.test(f) && f.toLowerCase() !== "readme.md")
  } catch {
    files = []
  }
  const posts = files
    .map(readPost)
    .filter((p): p is FieldNote => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)))
  // Re-read on every request in dev, so a new file shows up without a restart.
  if (process.env.NODE_ENV === "production") cache = posts
  return posts
}

export const getFieldNote = (slug: string) => getFieldNotes().find((p) => p.slug === slug)

export const fieldNotePath = (slug: string) => `${FIELD_NOTES_PATH}/${slug}`

/** The newest post date, or undefined while there are none. */
export const latestFieldNoteDate = () => getFieldNotes().reduce<string | undefined>((d, p) => (!d || p.updated > d ? p.updated : d), undefined)

/** Pixel size of a local figure, read with sharp (SVG included). Null when unknown. */
export async function figureSize(src: string): Promise<{ width: number; height: number } | null> {
  if (/^https?:\/\//i.test(src)) return null
  try {
    const { default: sharp } = await import("sharp")
    const meta = await sharp(path.join(PUBLIC, decodeURIComponent(src.split(/[?#]/)[0]))).metadata()
    return meta.width && meta.height ? { width: meta.width, height: meta.height } : null
  } catch {
    return null
  }
}
