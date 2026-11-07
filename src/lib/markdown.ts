/**
 * A small Markdown renderer for Field notes, with no dependency. It escapes
 * the whole source first and only then adds the tags it knows, so raw HTML in
 * a post is shown as text and never rendered. Links and images only accept
 * http(s), site paths, anchors and mailto, so nothing can run script.
 *
 * Supported: paragraphs, ## to #### headings (a stray # becomes ##), - and 1.
 * lists, > quotes, ``` code blocks, ---, **bold**, *italic*, `code`,
 * [links](url) and ![images](url). Same subset as the Rive-Foundry Logbook.
 */

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

/** Only links that cannot run script: http(s), site paths, anchors and mail. */
export function safeHref(href: string): string | null {
  const h = href.trim()
  if (/^(https?:\/\/|\/(?!\/)|#|mailto:)/i.test(h)) return h
  return null
}

const unescapeUrl = (s: string) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"')

/** Inline Markdown on already-escaped text. */
export function inline(text: string): string {
  const codes: string[] = []
  let s = text.replace(/`([^`]+)`/g, (_, c: string) => `\u0000${codes.push(c) - 1}\u0000`)
  s = s.replace(/!\[([^\]]*)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/g, (all, alt: string, src: string) => {
    const href = safeHref(unescapeUrl(src))
    return href ? `<img src="${escapeHtml(href)}" alt="${alt}" loading="lazy" decoding="async" />` : all
  })
  s = s.replace(/\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/g, (_, label: string, url: string) => {
    const href = safeHref(unescapeUrl(url))
    if (!href) return label
    const external = /^https?:\/\//i.test(href)
    return `<a href="${escapeHtml(href)}"${external ? ' rel="noopener noreferrer" target="_blank"' : ""}>${label}</a>`
  })
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*\w])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>")
  return s.replace(/\u0000(\d+)\u0000/g, (_, i: string) => `<code>${codes[Number(i)]}</code>`)
}

/** Block-level Markdown to HTML. */
export function renderMarkdown(md: string): string {
  const lines = escapeHtml(md.replace(/\r\n?/g, "\n")).split("\n")
  const out: string[] = []
  let para: string[] = []
  let list: { tag: "ul" | "ol"; items: string[] } | null = null
  /** Quote paragraphs; consecutive "> " lines form one paragraph, a bare ">" starts the next. */
  let quote: string[][] | null = null
  const flushQuote = () => {
    if (quote) {
      const paras = quote.filter((q) => q.length).map((q) => `<p>${inline(q.join(" "))}</p>`)
      if (paras.length) out.push(`<blockquote>${paras.join("")}</blockquote>`)
    }
    quote = null
  }
  const flushPara = () => {
    if (para.length) out.push(`<p>${inline(para.join(" "))}</p>`)
    para = []
  }
  const flushList = () => {
    if (list) out.push(`<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join("")}</${list.tag}>`)
    list = null
  }
  const flush = () => {
    flushPara()
    flushList()
    flushQuote()
  }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const fence = /^\s*```\s*([\w+-]*)/.exec(line)
    if (fence) {
      flush()
      const code: string[] = []
      while (++i < lines.length && !/^\s*```/.test(lines[i])) code.push(lines[i])
      const lang = fence[1] ? ` class="language-${fence[1]}"` : ""
      out.push(`<pre><code${lang}>${code.join("\n")}</code></pre>`)
      continue
    }
    const h = /^(#{1,4})\s+(.*?)\s*#*\s*$/.exec(line)
    if (h) {
      flush()
      const level = Math.max(2, h[1].length)
      out.push(`<h${level}>${inline(h[2])}</h${level}>`)
      continue
    }
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      flush()
      out.push("<hr />")
      continue
    }
    const q = /^\s*&gt;\s?(.*)$/.exec(line)
    if (q) {
      flushPara()
      flushList()
      quote ??= [[]]
      if (q[1].trim()) quote[quote.length - 1].push(q[1].trim())
      else quote.push([])
      continue
    }
    flushQuote()
    const li = /^\s*(?:([-*+])|(\d+)[.)])\s+(.*)$/.exec(line)
    if (li) {
      flushPara()
      const tag = li[1] ? "ul" : "ol"
      if (!list || list.tag !== tag) {
        flushList()
        list = { tag, items: [] }
      }
      list.items.push(li[3])
      continue
    }
    if (!line.trim()) {
      flush()
      continue
    }
    // An indented line right after a list item continues that item.
    if (list && /^\s{2,}\S/.test(line)) {
      list.items[list.items.length - 1] += ` ${line.trim()}`
      continue
    }
    flushList()
    para.push(line.trim())
  }
  flush()
  return out.join("\n")
}

/** Inline Markdown to plain text (for summaries, JSON-LD, RSS titles). */
export function plainText(md: string): string {
  return md
    .replace(/!\[([^\]]*)\]\((?:[^()\s]|\([^()\s]*\))*\)/g, "$1")
    .replace(/\[([^\]]+)\]\((?:[^()\s]|\([^()\s]*\))*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(^|[^*\w])\*([^*\s][^*]*)\*/g, "$1$2")
    .replace(/`([^`]+)`/g, "$1")
    .trim()
}
