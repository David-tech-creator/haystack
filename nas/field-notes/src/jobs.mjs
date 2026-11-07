// Forward deployed openings in Switzerland, from the public job-board APIs of the companies in jobs.json.
// No model here and no login: each ATS publishes its board as JSON. A posting is primary evidence that
// the role exists, so a new match becomes an item of kind "official".
import { hash, plainText, UA } from './collect.mjs';

export const TITLE = /forward[- ]deployed|\bFDE\b|deployment strategist|solutions? architect.*\bAI\b|applied AI engineer/i;
export const SWISS = /\b(switzerland|schweiz|suisse|svizzera|zurich|zürich|zuerich|geneva|genève|geneve|genf|lausanne|basel|zug|bern|berne)\b/i;

export const matchesTitle = (title) => TITLE.test(title ?? '');
export const matchesLocation = (location) => SWISS.test(location ?? '');

const joined = (...parts) => [...new Set(parts.flat().filter((x) => typeof x === 'string' && x.trim()).map((x) => x.trim()))].join(' | ');

/** One ATS response, as a list of { title, url, location, date, text }. */
export function normalize(ats, body) {
  if (ats === 'greenhouse') {
    return (body.jobs ?? []).map((j) => ({
      title: j.title, url: j.absolute_url,
      location: joined(j.location?.name, (j.offices ?? []).map((o) => o.location ?? o.name)),
      date: (j.first_published ?? j.updated_at ?? '').slice(0, 10), text: '',
    }));
  }
  if (ats === 'ashby') {
    return (body.jobs ?? []).filter((j) => j.isListed !== false).map((j) => {
      const addr = j.address?.postalAddress ?? {};
      const second = (j.secondaryLocations ?? []).map((s) => [s.location, s.address?.postalAddress?.addressLocality, s.address?.postalAddress?.addressCountry]);
      return {
        title: j.title, url: j.jobUrl,
        location: joined(j.location, addr.addressLocality, addr.addressCountry, second.flat()),
        date: (j.publishedAt ?? '').slice(0, 10), text: String(j.descriptionPlain ?? '').slice(0, 3000),
      };
    });
  }
  if (ats === 'lever') {
    return (Array.isArray(body) ? body : []).map((j) => ({
      title: j.text, url: j.hostedUrl,
      location: joined(j.categories?.location, j.categories?.allLocations ?? [], j.country === 'CH' ? 'Switzerland' : ''),
      date: j.createdAt ? new Date(Number(j.createdAt)).toISOString().slice(0, 10) : '',
      text: String(j.descriptionPlain ?? j.openingPlain ?? '').slice(0, 3000),
    }));
  }
  if (ats === 'workable') {
    return (body.jobs ?? []).map((j) => ({
      title: j.title, url: j.url ?? j.shortlink,
      location: joined(j.city, j.state, j.country, (j.locations ?? []).map((l) => [l.city, l.region, l.country])),
      date: j.published_on ?? '', text: '',
    }));
  }
  throw new Error(`unknown ats ${ats}`);
}

export function boardUrl({ ats, board }) {
  return {
    greenhouse: `https://boards-api.greenhouse.io/v1/boards/${board}/jobs`,
    ashby: `https://api.ashbyhq.com/posting-api/job-board/${board}`,
    lever: `https://api.lever.co/v0/postings/${board}?mode=json`,
    workable: `https://apply.workable.com/api/v1/widget/accounts/${board}`,
  }[ats];
}

/** Postings that are forward deployed and in Switzerland. */
export const fdeInSwitzerland = (postings) => postings.filter((p) => p.url && matchesTitle(p.title) && matchesLocation(p.location));

/** New matching postings since the last run. The first read of a board is a baseline: what is open
 *  already is not news. `state.seen` and `state.baselined` are updated here, saved by the caller. */
export async function collectJobs(boards, state, log = console.log) {
  const items = [];
  const failed = [];
  for (const b of boards) {
    const id = `jobs:${b.id}`;
    try {
      const res = await fetch(boardUrl(b), { headers: { 'user-agent': UA, accept: 'application/json' }, signal: AbortSignal.timeout(30_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const found = fdeInSwitzerland(normalize(b.ats, await res.json()));
      const baseline = !state.baselined?.[id];
      let fresh = 0;
      for (const p of found) {
        const key = hash(`${id}|${p.url}`);
        // Postings stay open for months: refresh the mark on every read so the 120-day prune in
        // main.mjs never lets a long-open role come back as "new".
        const known = Boolean(state.seen[key]);
        state.seen[key] = Date.now();
        if (known) continue;
        if (baseline) continue;
        items.push({
          id: key, source: `${b.name} careers`, kind: 'official', job: true,
          title: `${b.name} is hiring: ${plainText(p.title)} (${p.location})`.slice(0, 200),
          url: p.url, date: p.date,
          text: `Job posting on ${b.name}'s public careers board. Title: ${plainText(p.title)}. Location: ${p.location}. Published: ${p.date || 'unknown'}.\n${plainText(p.text)}`.slice(0, 4000),
        });
        fresh += 1;
      }
      state.baselined = { ...state.baselined, [id]: true };
      log(`[jobs] ${b.id}: ${found.length} matching${baseline ? ' (baseline)' : ''}, ${fresh} new`);
    } catch (e) {
      failed.push(id);
      log(`[jobs] ${b.id}: skipped (${e.message})`);
    }
  }
  return { items, failed };
}
