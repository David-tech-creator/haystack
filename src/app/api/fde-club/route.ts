import { NextResponse } from "next/server"

import { sendFdeClubSignup, validateFdeClub } from "@/lib/contact"
import { sendFieldNotesConfirmation } from "@/lib/newsletter"
import { clientIp, rateLimiter } from "@/lib/rate-limit"
import { FDE_PATH } from "@/lib/site"

export const runtime = "nodejs"

/** 5 sign-ups per IP per 10 minutes, per server instance. */
const limited = rateLimiter({ windowMs: 10 * 60 * 1000, max: 5 })

/**
 * FDE Club Switzerland join and speaker form. Same pipeline as the contact
 * form (Resend, honeypot, rate limit); the email to Haystack is tagged
 * "[FDE Club join]" or "[FDE Club speaker]". Without JavaScript the form
 * posts plain form data and gets a 303 back to the hub.
 *
 * A ticked newsletter box also sends the Field notes confirmation email
 * (double opt-in, src/lib/newsletter.ts), in parallel. That step can never
 * fail the request: only the email to our inbox decides success.
 */
export async function POST(request: Request) {
  const isForm = !(request.headers.get("content-type") ?? "").includes("application/json")
  const back = (state: "joined" | "error", newsletter = false) =>
    NextResponse.redirect(new URL(`${FDE_PATH}?${state}=1${newsletter ? "&newsletter=1" : ""}#join`, request.url), 303)

  let body: unknown
  try {
    body = isForm ? Object.fromEntries(await request.formData()) : await request.json()
  } catch {
    return isForm ? back("error") : NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
  }

  // honeypot: people never see this field, bots fill it in
  const trap = body && typeof body === "object" ? (body as Record<string, unknown>).website : undefined
  if (typeof trap === "string" && trap.trim() !== "") return isForm ? back("joined") : NextResponse.json({ success: true })

  if (limited(clientIp(request))) {
    return isForm
      ? back("error")
      : NextResponse.json({ success: false, error: "Too many messages, try again later" }, { status: 429 })
  }

  const parsed = validateFdeClub(body)
  if (!parsed.ok) return isForm ? back("error") : NextResponse.json({ success: false, error: parsed.error }, { status: 400 })

  const [result] = await Promise.all([
    sendFdeClubSignup(parsed.data),
    parsed.data.newsletter
      ? sendFieldNotesConfirmation(parsed.data).catch(() => ({ sent: false }))
      : Promise.resolve({ sent: false }),
  ])
  if (isForm) return result.success ? back("joined", parsed.data.newsletter) : back("error")
  return NextResponse.json(result, { status: result.success ? 200 : 502 })
}
