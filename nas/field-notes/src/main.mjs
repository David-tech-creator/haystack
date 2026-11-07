// The Field notes run. Started once by the container and stays up, checking the clock.
//   node src/main.mjs            the scheduler: FIELD_NOTES_DAYS (default Tue,Thu) at FIELD_NOTES_RUN_AT
//                                (default 08:30) Europe/Zurich, window until 12:00
//   node src/main.mjs run --dry  one run now; writes the post to /data/last-dry.md, publishes nothing
//   node src/main.mjs run        one run now, for real
// `touch /data/PAUSED` stops publishing with no deploy. At most one post a day.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { collect, sourceImage } from './collect.mjs';
import { collectJobs } from './jobs.mjs';
import { drawFigure, pick, readFull, write } from './pipeline.mjs';
import { publish, sendNewsletter, telegram } from './publish.mjs';
import { due, parseDays, parseRunAt, WINDOW_END, zurich } from './schedule.mjs';
import { renderPost, slugify } from './validate.mjs';

const DATA = process.env.FIELD_NOTES_DATA ?? '/data';
const STATE = join(DATA, 'state.json');
const DAYS = parseDays(process.env.FIELD_NOTES_DAYS || 'Tue,Thu');
const RUN_AT = parseRunAt(process.env.FIELD_NOTES_RUN_AT || '08:30');
const SOURCES = JSON.parse(readFileSync(new URL('../sources.json', import.meta.url), 'utf8'));
const JOBS = JSON.parse(readFileSync(new URL('../jobs.json', import.meta.url), 'utf8'));
const log = (s) => console.log(`${new Date().toISOString()} ${s}`);

const load = () => (existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : { seen: {}, posts: [], baselined: {} });
const save = (s) => writeFileSync(STATE, JSON.stringify(s, null, 1));

/** One run. Publishes at most one post, and only once a day. */
export async function runOnce({ dry = false } = {}) {
  const state = load();
  const { day } = zurich();
  const cutoff = Date.now() - 120 * 86_400_000;
  for (const [id, t] of Object.entries(state.seen)) if (t < cutoff) delete state.seen[id];

  if (!dry && existsSync(join(DATA, 'PAUSED'))) return log('[run] paused, nothing done');
  if (!dry && state.posts.some((p) => p.date === day)) return log('[run] already published today');

  const { items, failed } = await collect(SOURCES, state, log);
  const jobs = await collectJobs(JOBS, state, log);
  items.push(...jobs.items);
  failed.push(...jobs.failed);
  log(`[run] ${items.length} new items (${jobs.items.length} job postings), ${failed.length} sources unavailable${failed.length ? `: ${failed.join(', ')}` : ''}`);
  // Seen items are saved only on a real run: a dry run must not eat the news.
  if (!dry) save(state);
  if (!items.length) return log('[run] nothing new');

  try {
    await compose(items, state, day, dry);
  } catch (e) {
    // A failed run must not eat the news: the items wait for the next one.
    if (!dry && !state.posts.some((p) => p.date === day)) {
      for (const i of items) delete state.seen[i.id];
      save(state);
    }
    throw e;
  }
}

/** Picks from the new items, writes the post, and publishes it. */
async function compose(items, state, day, dry) {
  const choice = await pick(items, state.posts.slice(-14).map((p) => p.title));
  log(`[run] pick: publish=${choice.publish} ${choice.reason}`);
  if (!choice.publish) return;

  const picked = choice.item_ids.map((id) => items.find((i) => i.id === id)).filter(Boolean);
  if (!picked.some((i) => i.kind === 'official')) return log('[run] no official source behind the pick, dropped');
  const sources = await readFull(picked, log);
  const { post, problems } = await write(choice, sources, log);
  if (!post) {
    log(`[run] dropped after fact-check: ${problems.join(' | ').slice(0, 800)}`);
    if (!dry) await telegram(`Field notes: dropped today's post after the fact-check: ${problems.join(' | ').slice(0, 300)}`);
    return;
  }

  // The source's own image with a credit; a generated diagram when there is none.
  const photo = await sourceImage(sources, log);
  const drawn = photo ? null : await drawFigure(post, log);
  if (!photo && !drawn) {
    log('[run] dropped: no image and no diagram passed the checks');
    if (!dry) await telegram(`Field notes: wrote "${post.title}" but dropped it: no image and no diagram passed the checks.`);
    return;
  }
  const ext = photo ? photo.ext : 'svg';
  const asset = photo ? photo.bytes : drawn.svg;
  const figure = { ext, alt: (photo ?? drawn).alt, credit: photo ? { source: photo.source, url: photo.url } : null };
  log(`[run] image: ${photo ? `from ${photo.source}` : 'generated diagram'}`);
  const slug = slugify(post.title);
  const render = (name) => renderPost({ ...post, figure }, day, sources, name);
  if (dry) {
    writeFileSync(join(DATA, 'last-dry.md'), render(slug));
    writeFileSync(join(DATA, `last-dry.${ext}`), asset);
    return log(`[run] DRY: wrote ${join(DATA, 'last-dry.md')}: ${post.title}`);
  }
  const url = await publish({ slug, date: day, render, asset, ext, title: post.title }, DATA, log);
  state.posts.push({ date: day, title: post.title, url });
  save(state);
  await telegram(`Field notes: ${post.title}\n\n${post.summary}\n\n${url}`);
  await sendNewsletter({ ...post, url }, log).catch(async (e) => {
    log(`[newsletter] FAILED: ${e.message}`);
    await telegram(`Field notes: the post is live, but the newsletter did not go out: ${e.message.slice(0, 200)}`);
  });
  log(`[run] live: ${url}`);
}

async function scheduler() {
  log(`[scheduler] ${[...DAYS].join(', ')} at ${RUN_AT} Europe/Zurich, window until ${WINDOW_END}`);
  let lastDay = '';
  for (;;) {
    writeFileSync(join(DATA, 'heartbeat'), new Date().toISOString());
    const now = zurich();
    if (due(now, { days: DAYS, runAt: RUN_AT, lastDay })) {
      lastDay = now.day;
      try {
        await runOnce();
      } catch (e) {
        log(`[run] FAILED: ${e.stack ?? e}`);
        await telegram(`Field notes: job failed, nothing was published: ${String(e.message ?? e).slice(0, 300)}`);
      }
    }
    await new Promise((r) => setTimeout(r, 60_000));
  }
}

mkdirSync(join(DATA, 'home'), { recursive: true });
if (process.argv[2] === 'run') {
  await runOnce({ dry: process.argv.includes('--dry') });
  process.exit(0);
}
await scheduler();
