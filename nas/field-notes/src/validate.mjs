// The last check before a post goes live, in plain code so a page cannot talk its way past it.

// Names that must never appear: David's employers and family, as in Frontier.
const NEVER = [/\bTheodore\b/i, /\bRajnak\b/i, /\bAntaes\b/i, /\bCapgemini\b/i, /\bExpedia\b/i, /\bMeridian\b/i];
// Haystack house rules: no clients, no candidates, no testimonials, no sales pitch.
const HOUSE = [
  /\b(our|my) clients?\b/i, /\bclients? (of (mine|ours)|I work with|we work with)\b/i, /\b(our|my) candidates?\b/i,
  /\bcandidates? I (placed|met|spoke)\b/i, /\bI (placed|recruited|hired for)\b/i, /\btestimonial/i,
  /\b(contact us|get in touch|book a call|reach out to (me|us)|we can help|hire (through|with) (us|Haystack))\b/i,
];
const SLOP = [
  /here'?s the thing/i, /\bdelve\b/i, /\bgame.?changer\b/i, /\bin today'?s\b/i, /\blandscape\b/i, /\bgroundbreaking\b/i,
  /\bit'?s worth noting\b/i, /\bunlock(s|ing)?\b/i, /\bseamless(ly)?\b/i, /\brevolutioni[sz]e/i, /\bnot just\b.{0,40}\bbut\b/i,
];

export const linksIn = (md) => [...md.matchAll(/https?:\/\/[^\s)\]>"']+/g)].map((m) => m[0].replace(/[.,;:]+$/, ''));

export function slugify(s) {
  return s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');
}

/** Problems with a post; an empty list means it may go out. `allowed` is every URL we actually read. */
export function validatePost({ title, summary, tldr = [], body }, allowed) {
  const problems = [];
  if (tldr.length < 2 || tldr.length > 4 || tldr.some((t) => !t || t.length > 200 || /[\r\n]/.test(t))) problems.push('bad short version');
  const words = body.split(/\s+/).filter(Boolean).length;
  if (!title || title.length > 110 || /[\r\n]/.test(title)) problems.push('bad title');
  if (!summary || summary.length > 280 || /[\r\n]/.test(summary)) problems.push('bad summary');
  if (words < 200 || words > 1000) problems.push(`length ${words} words`);
  if (/<[a-z!/]/i.test(body.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, ''))) problems.push('raw HTML in the body');
  if (/^---/m.test(body)) problems.push('frontmatter marker in the body');
  const all = `${title}\n${summary}\n${tldr.join('\n')}\n${body}`;
  if (/—/.test(all)) problems.push('em dash');
  if (/–/.test(all)) problems.push('en dash');
  for (const re of NEVER) if (re.test(all)) problems.push(`forbidden name: ${re.source}`);
  for (const re of HOUSE) if (re.test(all)) problems.push(`house rule: ${re.source}`);
  for (const re of SLOP) if (re.test(all)) problems.push(`slop: ${re.source}`);
  const club = (all.match(/FDE Club/gi) ?? []).length;
  if (club > 1) problems.push(`FDE Club mentioned ${club} times, at most once`);
  const known = new Set([...allowed].map((u) => u.replace(/\/$/, '')));
  for (const u of linksIn(body)) if (!known.has(u.replace(/\/$/, ''))) problems.push(`link we never read: ${u}`);
  return problems;
}

/** Alt text in one line, without brackets, cut at a word under 240 characters. */
export function cleanAlt(alt) {
  const s = String(alt ?? '').replace(/[\r\n]+/g, ' ').replace(/[[\]]/g, '').replace(/\s+/g, ' ').trim();
  if (s.length <= 240) return s;
  const cut = s.slice(0, 237);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:]$/, '')}...`;
}

/** Problems with a diagram. It is shown through <img>, and it is still checked like untrusted text. */
export function validateFigure({ svg, alt }) {
  const problems = [];
  const s = (svg ?? '').trim();
  if (!/^<svg\b/.test(s) || !s.endsWith('</svg>')) problems.push('figure is not one svg element');
  if (!/\bviewBox=/.test(s)) problems.push('figure has no viewBox');
  if (s.length > 40_000) problems.push('figure is too big');
  if (/<(script|image|foreignObject|iframe|a|use|style)\b|\son[a-z]+\s*=|href\s*=|url\(\s*['"]?http/i.test(s)) problems.push('figure has something it must not');
  if (!alt || alt.length > 240 || /[\r\n\]]/.test(alt)) problems.push('bad figure alt text');
  return problems;
}

/** The post file. Byte for byte the shape of Frontier's renderPost(): the site parser depends on it.
 *  Only the image path differs: images live in public/field-notes/, served at /field-notes/. */
export function renderPost({ title, summary, tldr, body, figure }, date, sources, slug) {
  const credit = figure.credit ? `\n\n*Image: [${figure.credit.source}](${figure.credit.url})*` : '';
  const list = sources.map((s) => `- [${s.title.replace(/[[\]]/g, '')}](${s.url}), ${s.source}`).join('\n');
  const short = tldr.map((t) => `- ${t}`).join('\n');
  return `---\ntitle: ${title}\ndate: ${date}\nsummary: ${summary}\n---\n\n**The short version**\n\n${short}\n\n![${figure.alt}](/field-notes/${slug}.${figure.ext})${credit}\n\n${body.trim()}\n\n## Sources\n\n${list}\n`;
}
