import test from 'node:test';
import assert from 'node:assert/strict';
import { collect, findImage, genericImage, imageType, parseFeed, parseLinks, plainText } from '../src/collect.mjs';
import { collectJobs, fdeInSwitzerland, matchesLocation, matchesTitle, normalize } from '../src/jobs.mjs';
import { broadcastBody, indexNowUrls, newsletterHtml, newsletterText, postUrl } from '../src/publish.mjs';
import { due, parseDays, parseRunAt, zurich } from '../src/schedule.mjs';
import { cleanAlt, renderPost, slugify, validateFigure, validatePost } from '../src/validate.mjs';

const body = (extra = '') => `${'word '.repeat(300)}${extra}`;
const ok = { title: 'A fine title', summary: 'A fine summary.', tldr: ['One thing.', 'Two things.', 'Three things.'], body: body('[x](https://a.example/one)'), figure: { ext: 'svg', credit: null, alt: 'A diagram', svg: '<svg viewBox="0 0 10 10"><rect width="10" height="10"/></svg>' } };

// validate

test('a clean post passes', () => assert.deepEqual(validatePost(ok, ['https://a.example/one']), []));
test('a link we never read is refused', () => {
  const p = validatePost({ ...ok, body: body('[x](https://evil.example/pay)') }, ['https://a.example/one']);
  assert.ok(p.some((x) => x.includes('evil.example')));
});
test('forbidden names are refused', () => assert.ok(validatePost({ ...ok, body: body('at Antaes') }, []).some((x) => x.includes('forbidden'))));
test('raw HTML is refused, code spans are fine', () => {
  assert.ok(validatePost({ ...ok, body: body('<script>x</script>') }, []).some((x) => x.includes('HTML')));
  assert.deepEqual(validatePost({ ...ok, body: body('run `a<b`') }, []), []);
});
test('em dashes, en dashes and slop are refused', () => {
  assert.ok(validatePost({ ...ok, summary: 'one — two' }, []).includes('em dash'));
  assert.ok(validatePost({ ...ok, title: 'Zurich – Geneva' }, []).includes('en dash'));
  assert.ok(validatePost({ ...ok, tldr: ['a — b', 'c'] }, []).includes('em dash'));
  assert.ok(validatePost({ ...ok, body: body("here's the thing") }, []).some((x) => x.startsWith('slop')));
});
test('house rules: no clients, candidates, testimonials or pitch', () => {
  for (const bad of ['one of our clients asked', 'a candidate I placed last year', 'my candidates say', 'get in touch for a shortlist', 'a client of mine', 'book a call']) {
    assert.ok(validatePost({ ...ok, body: body(bad) }, []).some((x) => x.startsWith('house rule')), bad);
  }
  assert.deepEqual(validatePost({ ...ok, body: body('the customer\'s systems, a client library') }, []), []);
});
test('FDE Club at most once', () => {
  assert.deepEqual(validatePost({ ...ok, body: body('we talked about it at FDE Club') }, []), []);
  assert.ok(validatePost({ ...ok, summary: 'FDE Club notes.', body: body('more at FDE Club') }, []).some((x) => x.includes('FDE Club')));
});
test('a short post is refused', () => assert.ok(validatePost({ ...ok, body: 'too short' }, []).some((x) => x.startsWith('length'))));
test('slugify', () => assert.equal(slugify('Claude Code 3.0: what changed!'), 'claude-code-3-0-what-changed'));

test('a clean figure passes, an active one does not', () => {
  assert.deepEqual(validateFigure(ok.figure), []);
  assert.ok(validateFigure({ alt: 'x', svg: '<svg viewBox="0 0 1 1"><script>x()</script></svg>' }).length);
  assert.ok(validateFigure({ alt: 'x', svg: '<svg viewBox="0 0 1 1" onload="x()"></svg>' }).length);
  assert.ok(validateFigure({ alt: 'x', svg: '<svg viewBox="0 0 1 1"><image href="https://evil.example/a.png"/></svg>' }).length);
  assert.ok(validateFigure({ alt: 'x', svg: '<svg viewBox="0 0 1 1"><style>*{}</style></svg>' }).length);
});
test('cleanAlt makes long or messy alt text pass', () => {
  const long = `A diagram [one] of ${'many settings, '.repeat(30)}end`;
  const a = cleanAlt(`${long}\nsecond line`);
  assert.ok(a.length <= 240 && !/[\r\n\]]/.test(a));
  assert.deepEqual(validateFigure({ svg: '<svg viewBox="0 0 1 1"></svg>', alt: a }), []);
  assert.equal(cleanAlt('Short alt.'), 'Short alt.');
});

// renderPost: the site parser is written against this exact shape.

test('the rendered post is byte for byte the Frontier format, with Field notes paths', () => {
  const md = renderPost(ok, '2026-11-10', [{ title: 'Notes [v2]', url: 'https://a.example/one', source: 'A' }, { title: 'B', url: 'https://b.example', source: 'Bee' }], 'a-fine-title');
  const expected = `---
title: A fine title
date: 2026-11-10
summary: A fine summary.
---

**The short version**

- One thing.
- Two things.
- Three things.

![A diagram](/field-notes/a-fine-title.svg)

${ok.body.trim()}

## Sources

- [Notes v2](https://a.example/one), A
- [B](https://b.example), Bee
`;
  assert.equal(md, expected);
});
test('a source image is credited with a link', () => {
  const md = renderPost({ ...ok, figure: { ext: 'jpg', alt: 'Hero', credit: { source: 'OpenAI', url: 'https://openai.com/x' } } }, '2026-11-10', [], 'p');
  assert.match(md, /!\[Hero\]\(\/field-notes\/p\.jpg\)\n\n\*Image: \[OpenAI\]\(https:\/\/openai\.com\/x\)\*\n\n/);
});
test('live URL and IndexNow list', () => {
  assert.equal(postUrl('p'), 'https://www.haystack.agency/field-notes/p');
  assert.deepEqual(indexNowUrls(postUrl('p')), ['https://www.haystack.agency/field-notes/p', 'https://www.haystack.agency/field-notes', 'https://www.haystack.agency/field-notes/rss.xml']);
});
test('newsletter HTML escapes, links the post and carries the Resend unsubscribe tag', () => {
  const h = newsletterHtml({ summary: 'A <b> & c', tldr: ['one', 'two'], url: 'https://www.haystack.agency/field-notes/p' });
  assert.match(h, /A &lt;b&gt; &amp; c/);
  assert.match(h, /<li[^>]*>one<\/li>/);
  assert.match(h, /href="https:\/\/www\.haystack\.agency\/field-notes\/p"[^>]*>Read the post</);
  assert.match(h, /Written by an agent I built, in my voice\./);
  assert.match(h, /href="\{\{\{RESEND_UNSUBSCRIBE_URL\}\}\}"/);
});
test('newsletter text carries the post link and the Resend unsubscribe tag', () => {
  const t = newsletterText({ summary: 'S', tldr: ['one', 'two'], url: 'https://www.haystack.agency/field-notes/p' });
  assert.match(t, /^S\n\n- one\n- two\n\nRead the post: https:\/\/www\.haystack\.agency\/field-notes\/p\n/);
  assert.match(t, /Unsubscribe: \{\{\{RESEND_UNSUBSCRIBE_URL\}\}\}$/);
});
test('Resend broadcast goes to the segment, caps the name at 70 and sets reply_to only when given', () => {
  const env = { NEWSLETTER_SEGMENT_ID: 'seg_1', NEWSLETTER_FROM: 'David <d@haystack.agency>' };
  const post = { title: 'x'.repeat(100), summary: 'S', tldr: ['one'], url: 'https://www.haystack.agency/field-notes/p' };
  const b = broadcastBody(post, env);
  assert.equal(b.segment_id, 'seg_1');
  assert.equal(b.from, 'David <d@haystack.agency>');
  assert.equal(b.subject, post.title);
  assert.equal(b.name.length, 70);
  assert.ok(b.name.startsWith('Field notes: '));
  assert.ok(b.html.includes('{{{RESEND_UNSUBSCRIBE_URL}}}') && b.text.includes('{{{RESEND_UNSUBSCRIBE_URL}}}'));
  assert.equal('reply_to' in b, false);
  assert.equal(broadcastBody(post, { ...env, NEWSLETTER_REPLY_TO: 'd@haystack.agency' }).reply_to, 'd@haystack.agency');
});

// schedule

test('days parse from env, in any case, and nonsense is refused', () => {
  assert.deepEqual([...parseDays('Tue,Thu')], ['Tue', 'Thu']);
  assert.deepEqual([...parseDays('monday, friday')], ['Mon', 'Fri']);
  assert.deepEqual([...parseDays()], ['Tue', 'Thu']);
  assert.throws(() => parseDays('Tue,Funday'));
  assert.throws(() => parseDays(''));
  assert.equal(parseRunAt('8:30'), '08:30');
  assert.equal(parseRunAt(), '08:30');
  assert.throws(() => parseRunAt('25:00'));
  assert.throws(() => parseRunAt('half eight'));
});
test('zurich time and weekday, summer and winter', () => {
  assert.deepEqual(zurich(new Date('2026-11-10T07:30:00Z')), { day: '2026-11-10', time: '08:30', weekday: 'Tue' });
  assert.deepEqual(zurich(new Date('2026-07-09T06:30:00Z')), { day: '2026-07-09', time: '08:30', weekday: 'Thu' });
  assert.deepEqual(zurich(new Date('2026-11-10T23:30:00Z')), { day: '2026-11-11', time: '00:30', weekday: 'Wed' });
});
test('due only on the chosen days, inside the window, once a day', () => {
  const cfg = { days: parseDays('Tue,Thu'), runAt: '08:30', lastDay: '' };
  const at = (iso) => zurich(new Date(iso));
  assert.ok(due(at('2026-11-10T07:30:00Z'), cfg)); // Tue 08:30
  assert.ok(due(at('2026-11-12T10:59:00Z'), cfg)); // Thu 11:59
  assert.ok(!due(at('2026-11-10T07:29:00Z'), cfg)); // Tue 08:29
  assert.ok(!due(at('2026-11-10T11:00:00Z'), cfg)); // Tue 12:00
  assert.ok(!due(at('2026-11-11T07:30:00Z'), cfg)); // Wed
  assert.ok(!due(at('2026-11-09T07:30:00Z'), cfg)); // Mon
  assert.ok(!due(at('2026-11-10T08:00:00Z'), { ...cfg, lastDay: '2026-11-10' })); // already ran today
  assert.ok(due(at('2026-11-11T07:30:00Z'), { ...cfg, days: parseDays('Wed') }));
});

// jobs

test('job titles: forward deployed and kin only', () => {
  for (const t of ['Forward Deployed Engineer - Zurich', 'Sr. Forward-Deployed Engineer', 'Sr. Engagement Manager, FDE', 'Deployment Strategist', 'Solutions Architect, AI Platform', 'Solution Architect - Generative AI', 'Applied AI Engineer']) assert.ok(matchesTitle(t), t);
  for (const t of ['Account Executive', 'Solutions Architect, Mainframe', 'Research Engineer', 'Confidential Computing Engineer', 'Head of Deployment']) assert.ok(!matchesTitle(t), t);
});
test('job locations: Swiss cities and the country, in their spellings', () => {
  for (const l of ['Zurich, Switzerland', 'Zürich, CH', 'Genève', 'Geneva', 'Lausanne', 'Basel', 'Zug', 'Bern', 'Remote | Switzerland', 'Paris | Zurich HQ']) assert.ok(matchesLocation(l), l);
  for (const l of ['San Francisco, CA', 'Munich, Germany', 'Bernardsville, NJ', 'Remote, Europe', '']) assert.ok(!matchesLocation(l), l);
});
test('each ATS normalizes, and the filter needs both title and place', () => {
  const gh = normalize('greenhouse', { jobs: [{ title: 'Forward Deployed Engineer', absolute_url: 'https://g/1', location: { name: 'Zürich, CH' }, first_published: '2026-11-01T10:00:00Z' }, { title: 'Forward Deployed Engineer', absolute_url: 'https://g/2', location: { name: 'London' } }] });
  assert.deepEqual(fdeInSwitzerland(gh).map((p) => p.url), ['https://g/1']);
  assert.equal(gh[0].date, '2026-11-01');
  const ashby = normalize('ashby', { jobs: [{ title: 'FDE', jobUrl: 'https://a/1', location: 'Paris', isListed: true, secondaryLocations: [{ location: 'Zurich', address: { postalAddress: { addressCountry: 'Switzerland' } } }], publishedAt: '2026-11-02T00:00:00Z', descriptionPlain: 'Build agents.' }, { title: 'FDE', jobUrl: 'https://a/2', location: 'Zurich', isListed: false }] });
  assert.deepEqual(fdeInSwitzerland(ashby).map((p) => p.url), ['https://a/1']);
  assert.equal(ashby[0].text, 'Build agents.');
  const lever = normalize('lever', [{ text: 'Forward Deployed Software Engineer', hostedUrl: 'https://l/1', categories: { location: 'Remote' }, country: 'CH', createdAt: Date.parse('2026-11-03T00:00:00Z') }, { text: 'Deployment Strategist', hostedUrl: 'https://l/2', categories: { location: 'Denver, CO', allLocations: ['Denver, CO'] }, country: 'US' }]);
  assert.deepEqual(fdeInSwitzerland(lever).map((p) => p.url), ['https://l/1']);
  assert.equal(lever[0].date, '2026-11-03');
  const wk = normalize('workable', { jobs: [{ title: 'Forward Deployed Engineer', url: 'https://w/1', city: 'Zürich', country: 'Switzerland', published_on: '2026-08-05' }] });
  assert.deepEqual(fdeInSwitzerland(wk).map((p) => p.url), ['https://w/1']);
  assert.throws(() => normalize('nope', {}));
});
test('a board is baselined on its first read, then only new postings come through, as official', async (t) => {
  let jobs = [{ title: 'Forward Deployed Engineer', absolute_url: 'https://g/old', location: { name: 'Zurich' } }];
  t.mock.method(globalThis, 'fetch', async () => ({ ok: true, json: async () => ({ jobs }) }));
  const state = { seen: {}, baselined: {} };
  const boards = [{ id: 'acme', name: 'Acme', ats: 'greenhouse', board: 'acme' }];
  const first = await collectJobs(boards, state, () => {});
  assert.equal(first.items.length, 0);
  assert.equal(state.baselined['jobs:acme'], true);
  jobs = [...jobs, { title: 'Applied AI Engineer', absolute_url: 'https://g/new', location: { name: 'Geneva' } }, { title: 'Recruiter', absolute_url: 'https://g/x', location: { name: 'Geneva' } }];
  const second = await collectJobs(boards, state, () => {});
  assert.equal(second.items.length, 1);
  assert.equal(second.items[0].kind, 'official');
  assert.equal(second.items[0].url, 'https://g/new');
  assert.match(second.items[0].title, /^Acme is hiring: Applied AI Engineer \(Geneva\)$/);
  assert.equal((await collectJobs(boards, state, () => {})).items.length, 0);
});
test('a board that fails is reported, not fatal', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => ({ ok: false, status: 404 }));
  const r = await collectJobs([{ id: 'gone', name: 'Gone', ats: 'ashby', board: 'gone' }], { seen: {}, baselined: {} }, () => {});
  assert.deepEqual(r, { items: [], failed: ['jobs:gone'] });
});

// collect

test('feeds: old entries dropped, atom and rss both read', () => {
  const now = Date.parse('2026-11-01T12:00:00Z');
  const rss = `<item><title>New</title><link>https://a.example/new</link><pubDate>Sat, 31 Oct 2026 10:00:00 GMT</pubDate><description><![CDATA[<p>Hi &amp; bye</p>]]></description></item><item><title>Old</title><link>https://a.example/old</link><pubDate>Sat, 03 Oct 2026 10:00:00 GMT</pubDate></item>`;
  const atom = `<entry><title>Rel</title><link rel="alternate" href="https://a.example/rel"/><updated>2026-10-31T10:00:00Z</updated><content type="html">&lt;p&gt;notes&lt;/p&gt;</content></entry>`;
  const r = parseFeed(rss, now);
  assert.equal(r.length, 1);
  assert.equal(r[0].text, 'Hi & bye');
  assert.equal(parseFeed(atom, now)[0].url, 'https://a.example/rel');
  assert.equal(parseFeed(atom, now)[0].text, 'notes');
});
test('feeds: the window covers the gap from Thursday to Tuesday', () => {
  const rss = '<item><title>Thu</title><link>https://a.example/thu</link><pubDate>Thu, 05 Nov 2026 09:00:00 GMT</pubDate></item>';
  assert.equal(parseFeed(rss, Date.parse('2026-11-10T07:30:00Z')).length, 1);
});
test('undated feeds are kept only when the source says so, and are baselined', async (t) => {
  const xml = '<item><title>No date</title><link>https://a.example/nd</link><description>x</description></item>';
  assert.equal(parseFeed(xml).length, 0);
  assert.equal(parseFeed(xml, Date.now(), { undated: true }).length, 1);
  t.mock.method(globalThis, 'fetch', async () => ({ ok: true, text: async () => xml }));
  const state = { seen: {}, baselined: {} };
  const src = [{ id: 'gd', name: 'GD', kind: 'official', type: 'feed', undated: true, url: 'https://a.example/feed' }];
  assert.equal((await collect(src, state, () => {})).items.length, 0);
  assert.equal(state.baselined.gd, true);
});
test('listing pages keep only article links', () => {
  const h = '<a href="/news/one"><span>The first long headline</span></a><a href="/about">About</a><a href="/news/">All</a>';
  assert.deepEqual(parseLinks(h, 'https://a.example/news', 'https://a.example/news/').map((x) => x.url), ['https://a.example/news/one']);
});
test('plainText drops scripts', () => assert.equal(plainText('<p>a</p><script>b()</script><p>c</p>'), 'a c'));
test('share images are found, stock cards are not wanted', () => {
  assert.equal(findImage('<meta property="og:image" content="/a/hero.png">', 'https://a.example/post'), 'https://a.example/a/hero.png');
  assert.equal(findImage('<meta content="https://a.example/b.jpg" name="twitter:image">', 'https://a.example/'), 'https://a.example/b.jpg');
  assert.equal(findImage('<meta name="description" content="x">', 'https://a.example/'), null);
  assert.ok(genericImage('https://opengraph.githubassets.com/1/a/b'));
  assert.ok(genericImage('https://a.example/images/logo.png'));
  assert.ok(!genericImage('https://a.example/images/gpt-launch-hero.png'));
});
test('only real raster images pass', () => {
  assert.equal(imageType(Buffer.from([0xff, 0xd8, 0xff])), 'jpg');
  assert.equal(imageType(Buffer.from([0x89, 0x50, 0x4e, 0x47])), 'png');
  assert.equal(imageType(Buffer.from('<svg onload="x()">')), null);
});
