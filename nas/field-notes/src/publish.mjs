// Getting a finished post live: commit one Markdown file and one image to main (Vercel deploys), wait for
// production to serve it, tell search engines. Only content/field-notes/ and public/field-notes/ are touched.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const SITE = 'https://www.haystack.agency';
const HOST = 'www.haystack.agency';
const REPO = 'git@github.com:David-tech-creator/haystack.git';
const INDEXNOW_KEY = '221582928817ed5a8047f735f91a9971';
export const POSTS_DIR = 'content/field-notes';
export const IMAGES_DIR = 'public/field-notes';

const sshCmd = (data) => `ssh -i ${data}/ssh/id_ed25519 -o UserKnownHostsFile=${data}/ssh/known_hosts -o StrictHostKeyChecking=accept-new -o IdentitiesOnly=yes`;

export const postUrl = (name) => `${SITE}/field-notes/${name}`;
export const indexNowUrls = (url) => [url, `${SITE}/field-notes`, `${SITE}/field-notes/rss.xml`];

export async function publish({ slug, date, render, asset, ext, title }, data, log = console.log) {
  const dir = join(data, 'repo');
  rmSync(dir, { recursive: true, force: true });
  const env = { ...process.env, GIT_SSH_COMMAND: sshCmd(data) };
  const git = (...args) => execFileSync('git', args, { cwd: dir, env, stdio: 'pipe' }).toString();
  execFileSync('git', ['clone', '--quiet', '--depth', '1', '--branch', 'main', REPO, dir], { env, stdio: 'pipe' });
  mkdirSync(join(dir, POSTS_DIR), { recursive: true });
  mkdirSync(join(dir, IMAGES_DIR), { recursive: true });
  let name = slug;
  for (let n = 2; existsSync(join(dir, POSTS_DIR, `${name}.md`)); n++) name = `${slug}-${n}`;
  const rel = `${POSTS_DIR}/${name}.md`;
  const img = `${IMAGES_DIR}/${name}.${ext}`;
  writeFileSync(join(dir, rel), render(name));
  writeFileSync(join(dir, img), asset);
  git('add', '--', rel, img);
  git('-c', `user.name=${process.env.GIT_NAME}`, '-c', `user.email=${process.env.GIT_EMAIL}`, 'commit', '-q', '-m', `Field notes: ${title}`);
  git('push', '-q', 'origin', 'HEAD:main');
  log(`[publish] pushed ${rel}`);

  const url = postUrl(name);
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 15_000));
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
      if (res.ok && (await res.text()).includes(date.slice(0, 4))) {
        await fetch('https://api.indexnow.org/IndexNow', {
          method: 'POST', headers: { 'content-type': 'application/json; charset=utf-8' },
          body: JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`, urlList: indexNowUrls(url) }),
          signal: AbortSignal.timeout(15_000),
        }).catch((e) => log(`[publish] indexnow: ${e.message}`));
        return url;
      }
    } catch { /* still deploying */ }
  }
  throw new Error(`pushed, but ${url} is not live after 15 minutes`);
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The newsletter's HTML. {{ unsubscribe }} is Brevo's own unsubscribe link, filled in per recipient. */
export function newsletterHtml({ summary, tldr, url }) {
  const bullets = tldr.map((t) => `<li style="margin:0 0 8px">${esc(t)}</li>`).join('');
  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#F6F1E7"><div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5;color:#1A2136;max-width:560px;margin:0 auto"><p>${esc(summary)}</p><ul style="padding-left:20px">${bullets}</ul><p><a href="${esc(url)}" style="color:#1A2136;font-weight:bold;text-decoration:underline;text-decoration-color:#C29A3E">Read the post</a></p><p style="font-size:13px;color:#4A5068;margin-top:32px">Written by an agent I built, in my voice. <a href="{{ unsubscribe }}" style="color:#4A5068">Unsubscribe</a></p></div></body></html>`;
}

/** One Brevo campaign to the Field notes list, sent now. A failure here never takes the post down. */
export async function sendNewsletter({ title, summary, tldr, url }, log = console.log) {
  const key = process.env.BREVO_API_KEY, list = Number(process.env.BREVO_FIELD_NOTES_LIST_ID), from = process.env.NEWSLETTER_FROM_EMAIL;
  if (!key || !list || !from) { log('[newsletter] not configured, skipped'); return; }
  const api = (path, body) => fetch(`https://api.brevo.com/v3${path}`, {
    method: 'POST', headers: { 'api-key': key, 'content-type': 'application/json', accept: 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(30_000),
  });
  const campaign = {
    name: `Field notes: ${title}`.slice(0, 200),
    subject: title,
    sender: { name: process.env.NEWSLETTER_FROM_NAME || 'David from Haystack', email: from },
    recipients: { listIds: [list] },
    htmlContent: newsletterHtml({ summary, tldr, url }),
  };
  if (process.env.NEWSLETTER_REPLY_TO) campaign.replyTo = process.env.NEWSLETTER_REPLY_TO;
  const made = await api('/emailCampaigns', campaign);
  if (!made.ok) throw new Error(`campaign create: HTTP ${made.status} ${(await made.text()).slice(0, 200)}`);
  const { id } = await made.json();
  const sent = await api(`/emailCampaigns/${id}/sendNow`);
  if (!sent.ok) throw new Error(`campaign ${id} send: HTTP ${sent.status} ${(await sent.text()).slice(0, 200)}`);
  log(`[newsletter] sent campaign ${id}`);
}

/** A message to David. Always prefixed, so he can tell it from Frontier's. */
export async function telegram(message) {
  const text = message.startsWith('Field notes:') ? message : `Field notes: ${message}`;
  const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_OWNER_ID;
  if (!token || !chat) { console.error(`[telegram] not configured, David was not told: ${text.slice(0, 120)}`); return; }
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chat, text: text.slice(0, 3500) }),
    signal: AbortSignal.timeout(15_000),
  }).catch((e) => console.error(`[telegram] failed: ${e.message}`));
}
