import { createHmac, timingSafeEqual } from "node:crypto"

import { SITE_URL } from "@/lib/site"

/**
 * Field notes newsletter, double opt-in through Resend.
 *
 * Ticking the newsletter box on the FDE Club form sends one confirmation email
 * and stores nothing. The link in it carries the email, the first name and an
 * expiry, signed with NEWSLETTER_SECRET. Only a click on that link
 * (/api/field-notes/confirm) adds the person to the Resend segment
 * NEWSLETTER_SEGMENT_ID. Resend adds the unsubscribe link to every broadcast.
 *
 * Env vars (set in Vercel, never committed): RESEND_API_KEY, NEWSLETTER_SECRET,
 * NEWSLETTER_SEGMENT_ID, NEWSLETTER_FROM, NEWSLETTER_REPLY_TO.
 */

export const CONFIRM_PATH = "/api/field-notes/confirm"

const TTL_MS = 7 * 24 * 60 * 60 * 1000

export type Subscriber = { email: string; firstName?: string }

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url")
}

export function makeToken(s: Subscriber, secret: string, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ e: s.email, n: s.firstName, x: now + TTL_MS })).toString("base64url")
  return `${payload}.${sign(payload, secret)}`
}

/** The subscriber in a valid, unexpired token; null otherwise. */
export function readToken(token: string, secret: string, now = Date.now()): Subscriber | null {
  const [payload, sig] = token.split(".")
  if (!payload || !sig) return null
  const want = Buffer.from(sign(payload, secret))
  const got = Buffer.from(sig)
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null
  try {
    const { e, n, x } = JSON.parse(Buffer.from(payload, "base64url").toString())
    if (typeof e !== "string" || typeof x !== "number" || x <= now) return null
    return { email: e, firstName: typeof n === "string" && n ? n : undefined }
  } catch {
    return null
  }
}

/**
 * Sends the Field notes confirmation email. Never throws and never fails the
 * FDE Club sign-up: unconfigured means skip and log, and any Resend error is
 * logged and swallowed.
 */
export async function sendFieldNotesConfirmation(p: { name: string; email: string }): Promise<{ sent: boolean }> {
  const key = process.env.RESEND_API_KEY
  const secret = process.env.NEWSLETTER_SECRET
  const from = process.env.NEWSLETTER_FROM
  if (!key || !secret || !from) {
    console.info("Field notes: RESEND_API_KEY, NEWSLETTER_SECRET or NEWSLETTER_FROM not set, confirmation email skipped.")
    return { sent: false }
  }
  const firstName = p.name.split(/\s+/)[0] || undefined
  const link = `${SITE_URL}${CONFIRM_PATH}?token=${encodeURIComponent(makeToken({ email: p.email, firstName }, secret))}`
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: [p.email],
        reply_to: process.env.NEWSLETTER_REPLY_TO || undefined,
        subject: "Confirm Field notes",
        text: [
          `Hi ${firstName ?? "there"},`,
          "",
          "You asked for Field notes, the newsletter of FDE Club Switzerland: my notes on forward deployed engineering and tech hiring in Switzerland.",
          "",
          "One click and you are in:",
          link,
          "",
          "The link works for 7 days. If it was not you, ignore this email and you will not hear from us again.",
          "",
          "David",
          "Haystack, Geneva",
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) {
      console.error("Field notes: Resend answered", response.status, (await response.text().catch(() => "")).slice(0, 300))
      return { sent: false }
    }
    return { sent: true }
  } catch {
    console.error("Field notes: request to Resend failed")
    return { sent: false }
  }
}
