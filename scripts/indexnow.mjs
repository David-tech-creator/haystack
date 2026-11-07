#!/usr/bin/env node
/**
 * Ping IndexNow (Bing, and through it the engines that share the protocol)
 * with every URL in the live sitemap. Run by hand AFTER a production deploy:
 *
 *   node scripts/indexnow.mjs            # all URLs in the sitemap
 *   node scripts/indexnow.mjs /forward-deployed-engineers   # just these paths
 *
 * The key is INDEXNOW_KEY in src/lib/site.ts and is served at /<key>.txt.
 * ChatGPT search leans on Bing's index, so this is the fastest way to get new
 * pages seen by assistants.
 */
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const siteTs = readFileSync(fileURLToPath(new URL("../src/lib/site.ts", import.meta.url)), "utf8")
const key = siteTs.match(/INDEXNOW_KEY = "([a-f0-9]+)"/)?.[1]
const site = siteTs.match(/SITE_URL = "([^"]+)"/)?.[1]
if (!key || !site) throw new Error("INDEXNOW_KEY or SITE_URL not found in src/lib/site.ts")

const host = new URL(site).host
const keyLocation = `${site}/${key}.txt`

// Refuse to ping if the key file is not live yet (it ships with the deploy).
const keyRes = await fetch(keyLocation)
if (!keyRes.ok || (await keyRes.text()).trim() !== key) {
  console.error(`Key file not live at ${keyLocation}. Deploy first, then run this again.`)
  process.exit(1)
}

let urls = process.argv.slice(2).map((p) => (p.startsWith("http") ? p : `${site}${p}`))
if (urls.length === 0) {
  const xml = await (await fetch(`${site}/sitemap.xml`)).text()
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList: urls }),
})
console.log(`IndexNow ${res.status} ${res.statusText} for ${urls.length} URL(s):`)
for (const u of urls) console.log(`  ${u}`)
if (res.status >= 400) process.exit(1)
