import { NextResponse } from "next/server"

import { readToken } from "@/lib/newsletter"
import { FIELD_NOTES_PATH, SITE_URL } from "@/lib/site"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type State = "yes" | "expired" | "error"

const back = (state: State) => NextResponse.redirect(`${SITE_URL}${FIELD_NOTES_PATH}?subscribed=${state}#subscribed`, 303)

/**
 * The link in the Field notes confirmation email (see src/lib/newsletter.ts):
 * adds the reader to the Field notes segment in Resend, then sends them to
 * /field-notes with ?subscribed=yes, expired or error.
 */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? ""
  const key = process.env.RESEND_API_KEY
  const secret = process.env.NEWSLETTER_SECRET
  const segment = process.env.NEWSLETTER_SEGMENT_ID
  if (!key || !secret || !segment) {
    console.error("Field notes confirm: RESEND_API_KEY, NEWSLETTER_SECRET or NEWSLETTER_SEGMENT_ID not set.")
    return back("error")
  }
  const subscriber = readToken(token, secret)
  if (!subscriber) return back("expired")

  try {
    const res = await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        email: subscriber.email,
        ...(subscriber.firstName ? { first_name: subscriber.firstName } : {}),
        unsubscribed: false,
        segments: [{ id: segment }],
      }),
      signal: AbortSignal.timeout(8000),
    })
    // 409: already a contact, so they confirmed before
    if (!res.ok && res.status !== 409) {
      console.error("Field notes confirm: Resend answered", res.status, (await res.text().catch(() => "")).slice(0, 300))
      return back("error")
    }
  } catch {
    console.error("Field notes confirm: request to Resend failed")
    return back("error")
  }
  return back("yes")
}
