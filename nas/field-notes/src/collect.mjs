// Reading the sources. No model here: plain fetches, and a clean local Chromium for the few pages that
// need one (no browser service, no login: an empty profile on every run). A page that blocks it is
// skipped, not worked around.
import { createHash } from 'node:crypto';
import { chromium } from 'playwright-core';

export const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0 Safari/537.36';
// Runs are twice a week, so a feed entry must survive the longest gap (Thursday to Tuesday).
const MAX_AGE_DAYS = 6;

export const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16);

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
export function decode(s) {
  return s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (all, e) => {
    if (e[0] === '#') {
      const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : all;
    }
    return ENTITIES[e.toLowerCase()] ?? all;
  });
}

export function plainText(html) {
  const unescaped = html.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  // Atom escapes its HTML, so decode first when that is what we were given.
  const raw = /&lt;\/?[a-z]/i.test(unescaped) ? decode(unescaped) : unescaped;
  const s = raw
    .replace(/<(script|style|noscript|svg|nav|footer|header)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  return decode(s).replace(/\s+/g, ' ').trim();
}

const tag = (block, name) => new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, 'i').exec(block)?.[1] ?? '';

/** RSS and Atom entries, newest kept, older than the window dropped. A feed whose entries carry no
 *  date at all (`undated`) keeps them all, and "new" then means not seen on an earlier run. */
export function parseFeed(xml, now = Date.now(), { undated = false } = {}) {
  const blocks = xml.match(/<(item|entry)[ >][\s\S]*?<\/\1>/gi) ?? [];
  const out = [];
  for (const b of blocks) {
    const title = plainText(tag(b, 'title'));
    const href = /<link\b[^>]*\bhref="([^"]+)"/i.exec(b)?.[1] ?? plainText(tag(b, 'link'));
    const when = Date.parse(plainText(tag(b, 'pubDate') || tag(b, 'published') || tag(b, 'updated') || tag(b, 'dc:date')));
    if (!title || !/^https?:\/\//.test(href)) continue;
    if (!Number.isFinite(when) && !undated) continue;
    if (Number.isFinite(when) && now - when > MAX_AGE_DAYS * 86_400_000) continue;
    const text = plainText(tag(b, 'content:encoded') || tag(b, 'content') || tag(b, 'description') || tag(b, 'summary'));
    out.push({ title, url: decode(href), date: Number.isFinite(when) ? new Date(when).toISOString().slice(0, 10) : '', text: text.slice(0, 4000) });
  }
  return out;
}

/** Article links on a listing page. These carry no date, so "new" means not seen on an earlier run. */
export function parseLinks(html, base, prefix) {
  const seen = new Map();
  for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"#]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    let url;
    try { url = new URL(decode(m[1]), base).href.split('?')[0].replace(/\/$/, ''); } catch { continue; }
    if (!url.startsWith(prefix) || url.length <= prefix.length) continue;
    const title = plainText(m[2]).slice(0, 200);
    if (title.length > (seen.get(url)?.length ?? 8)) seen.set(url, title);
  }
  return [...seen].map(([url, title]) => ({ title, url, date: '', text: '' }));
}

async function plainFetch(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' }, redirect: 'follow', signal: AbortSignal.timeout(25_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function browserFetch(url) {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 40_000 });
    await page.waitForTimeout(3000);
    if (!res || res.status() >= 400) throw new Error(`HTTP ${res?.status() ?? 'no response'}`);
    return await page.content();
  } finally {
    await browser.close();
  }
}

export async function readPage(url, { browser = false } = {}) {
  return browser ? browserFetch(url) : plainFetch(url);
}

/** The page's own share image, from its Open Graph or Twitter tags. */
export function findImage(html, base) {
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const prop = /\b(?:property|name)=["'](og:image(?::secure_url)?|twitter:image(?::src)?)["']/i.test(m[0]);
    const content = /\bcontent=["']([^"']+)["']/i.exec(m[0])?.[1];
    if (!prop || !content) continue;
    try { return new URL(decode(content), base).href; } catch { /* next tag */ }
  }
  return null;
}

/** Stock cards and logos say nothing about the story, so a diagram does better. */
export const genericImage = (url) => /opengraph\.githubassets|githubassets\.com|avatars\.githubusercontent|\b(default|logo|favicon|placeholder|og-image|social-share|share-image)\b/i.test(url);

export function imageType(b) {
  if (b[0] === 0xff && b[1] === 0xd8) return 'jpg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png';
  if (b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP') return 'webp';
  return null;
}

/** The image of the story's own lead source, with who to credit. A footnote source never supplies
 *  it: a Mistral picture on a Claude Code post is worse than none. Null means use a diagram. */
export async function sourceImage(sources, log = console.log) {
  const s = sources.find((x) => x.kind === 'official');
  if (!s?.image || genericImage(s.image)) return null;
  try {
    const res = await fetch(s.image, { headers: { 'user-agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(25_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const bytes = Buffer.from(await res.arrayBuffer());
    const ext = imageType(bytes);
    if (!ext || bytes.length < 15_000 || bytes.length > 4_000_000) throw new Error(`unusable, ${ext ?? 'unknown type'}, ${bytes.length} bytes`);
    return { bytes, ext, alt: `Image from ${s.source}: ${s.title}`.replace(/[[\]\r\n]/g, '').slice(0, 200), source: s.source, url: s.url };
  } catch (e) {
    log(`[image] ${s.image}: ${e.message}`);
    return null;
  }
}

/** Everything new since the last run. `state.seen` is updated by the caller after a good run. */
export async function collect(sources, state, log = console.log) {
  const items = [];
  const failed = [];
  for (const src of sources) {
    try {
      const body = await readPage(src.url, { browser: src.browser });
      let found;
      if (src.type === 'feed') found = parseFeed(body, Date.now(), { undated: src.undated });
      else if (src.type === 'page') found = parseLinks(body, src.url, src.linkPrefix);
      else found = [{ title: src.name, url: src.url, date: '', text: plainText(body).slice(0, 12_000), whole: hash(plainText(body)) }];
      // A listing page's first read is a baseline: what is already there is not news.
      const baseline = (src.type !== 'feed' || src.undated) && !state.baselined?.[src.id];
      let fresh = 0;
      for (const it of found) {
        const id = hash(`${src.id}|${it.whole ?? it.url}`);
        if (state.seen[id]) continue;
        state.seen[id] = Date.now();
        if (baseline) continue;
        items.push({ ...it, id, source: src.name, kind: src.kind });
        fresh += 1;
      }
      state.baselined = { ...state.baselined, [src.id]: true };
      log(`[collect] ${src.id}: ${found.length} read, ${fresh} new`);
    } catch (e) {
      failed.push(src.id);
      log(`[collect] ${src.id}: skipped (${e.message})`);
    }
  }
  return { items, failed };
}
