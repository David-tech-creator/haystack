import { NextResponse } from "next/server"

import { sendContactMessage, validateContact } from "@/lib/contact"

export const runtime = "nodejs"

/**
 * Best-effort rate limit: 5 messages per IP per 10 minutes, per server
 * instance. Enough to stop a script hammering one lambda; not a security
 * boundary.
 */
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function limited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k)
  }
  return recent.length > MAX_PER_WINDOW
}

export async function POST(request: Request) {
  // Without JavaScript the form posts plain form data; answer with a redirect
  // back to the contact page instead of JSON.
  const isForm = !(request.headers.get("content-type") ?? "").includes("application/json")
  const back = (state: "sent" | "error") => NextResponse.redirect(new URL(`/contact?${state}=1#form`, request.url), 303)

  let body: unknown
  try {
    body = isForm ? Object.fromEntries(await request.formData()) : await request.json()
  } catch {
    return isForm ? back("error") : NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
  }

  if (isForm) {
    const trap = (body as Record<string, unknown>).website
    if (typeof trap === "string" && trap.trim() !== "") return back("sent")
    const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown"
    if (limited(ip)) return back("error")
    const parsed = validateContact(body)
    if (!parsed.ok) return back("error")
    const result = await sendContactMessage(parsed.data)
    return back(result.success ? "sent" : "error")
  }

  // honeypot: people never see this field, bots fill it in
  const trap = body && typeof body === "object" ? (body as Record<string, unknown>).website : undefined
  if (typeof trap === "string" && trap.trim() !== "") return NextResponse.json({ success: true })

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown"
  if (limited(ip)) {
    return NextResponse.json({ success: false, error: "Too many messages, try again later" }, { status: 429 })
  }

  const parsed = validateContact(body)
  if (!parsed.ok) return NextResponse.json({ success: false, error: parsed.error }, { status: 400 })

  const result = await sendContactMessage(parsed.data)
  return NextResponse.json(result, { status: result.success ? 200 : 502 })
}
