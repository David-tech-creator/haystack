/**
 * Contact form and FDE Club form delivery through the Resend email API.
 * Env vars (set in Vercel, never committed): RESEND_API_KEY,
 * CONTACT_FORM_FROM_NAME, CONTACT_FORM_FROM_EMAIL, CONTACT_FORM_TO.
 * The sending domain (haystack.agency) must be verified in Resend.
 */
export type ContactPayload = {
  name: string
  email: string
  company?: string
  roles?: string
  message: string
  /** Where the enquiry came from: "fde" for "Hire an FDE" links. Tags the email subject. */
  topic?: ContactTopic
}

export const CONTACT_TOPICS = ["fde"] as const
export type ContactTopic = (typeof CONTACT_TOPICS)[number]
export const isContactTopic = (v: unknown): v is ContactTopic =>
  typeof v === "string" && (CONTACT_TOPICS as readonly string[]).includes(v)

const resendEndpoint = "https://api.resend.com/emails"

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")

/** Strips line breaks from single-line fields (subject and headers). */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim()

export const LIMITS = { name: 120, email: 200, company: 160, roles: 240, message: 5000 }

export function validateContact(input: unknown): { ok: true; data: ContactPayload } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "Invalid request" }
  const o = input as Record<string, unknown>
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "")
  const name = oneLine(str(o.name, LIMITS.name))
  const email = oneLine(str(o.email, LIMITS.email))
  const company = oneLine(str(o.company, LIMITS.company))
  const roles = oneLine(str(o.roles, LIMITS.roles))
  const message = str(o.message, LIMITS.message)
  if (name.length < 2) return { ok: false, error: "Please add your name" }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, error: "That email looks off" }
  if (message.length < 10) return { ok: false, error: "Tell us a little more" }
  const topic = isContactTopic(o.topic) ? o.topic : undefined
  return { ok: true, data: { name, email, company: company || undefined, roles: roles || undefined, message, topic } }
}

type Email = { subject: string; text: string; html: string; replyTo: { email: string; name: string } }

/** Sends one email to Haystack's inbox through Resend. Shared by the contact form and the FDE Club form. */
async function sendToInbox(mail: Email, label: string): Promise<{ success: boolean }> {
  const resendKey = process.env.RESEND_API_KEY
  const fromName = process.env.CONTACT_FORM_FROM_NAME ?? "Haystack"
  const fromEmail = process.env.CONTACT_FORM_FROM_EMAIL ?? "david.v@haystack.agency"
  const toEmail = process.env.CONTACT_FORM_TO ?? "david.v@haystack.agency"

  if (!resendKey) {
    console.error(`${label}: RESEND_API_KEY is not configured, message not sent.`)
    return { success: false }
  }

  try {
    const response = await fetch(resendEndpoint, {
      method: "POST",
      headers: { authorization: `Bearer ${resendKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: `${oneLine(fromName).replace(/[<>"]/g, "")} <${fromEmail}>`,
        to: [toEmail],
        reply_to: mail.replyTo.email,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      }),
    })

    if (!response.ok) {
      console.error(`${label}: Resend answered`, response.status, (await response.text().catch(() => "")).slice(0, 300))
      return { success: false }
    }
    return { success: true }
  } catch {
    console.error(`${label}: request to Resend failed`)
    return { success: false }
  }
}

export async function sendContactMessage(payload: ContactPayload): Promise<{ success: boolean }> {
  const e = {
    name: escapeHtml(payload.name),
    email: escapeHtml(payload.email),
    company: payload.company ? escapeHtml(payload.company) : "",
    roles: payload.roles ? escapeHtml(payload.roles) : "",
    message: escapeHtml(payload.message).replace(/\n/g, "<br/>"),
  }
  const tag = payload.topic === "fde" ? "[Hire an FDE] " : ""
  return sendToInbox(
    {
      subject: `${tag}New sprint request from ${payload.name}`,
      replyTo: { email: payload.email, name: payload.name },
      text: `${tag ? `Topic: Hire an FDE (from FDE Club Switzerland)\n` : ""}Name: ${payload.name}\nEmail: ${payload.email}\nCompany: ${payload.company ?? ""}\nRole(s): ${payload.roles ?? ""}\n\nWhat a great hire looks like:\n${payload.message}`,
      html: `${tag ? "<p><strong>Topic:</strong> Hire an FDE (from FDE Club Switzerland)</p>\n" : ""}<p><strong>Name:</strong> ${e.name}</p>
<p><strong>Email:</strong> ${e.email}</p>
${e.company ? `<p><strong>Company:</strong> ${e.company}</p>` : ""}
${e.roles ? `<p><strong>Role(s):</strong> ${e.roles}</p>` : ""}
<p><strong>What a great hire looks like:</strong></p>
<p>${e.message}</p>`,
    },
    "Contact form",
  )
}

/* FDE Club Switzerland sign-ups ------------------------------------------- */

export type FdeClubKind = "join" | "speak"

export type FdeClubPayload = {
  kind: FdeClubKind
  name: string
  email: string
  about: string
  company?: string
  newsletter: boolean
  chat: boolean
}

export const FDE_LIMITS = { name: 120, email: 200, company: 160, about: 3000 }

const checked = (v: unknown) => v === true || v === "on" || v === "true" || v === "yes"

export function validateFdeClub(input: unknown): { ok: true; data: FdeClubPayload } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "Invalid request" }
  const o = input as Record<string, unknown>
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "")
  const name = oneLine(str(o.name, FDE_LIMITS.name))
  const email = oneLine(str(o.email, FDE_LIMITS.email))
  const company = oneLine(str(o.company, FDE_LIMITS.company))
  const about = str(o.about, FDE_LIMITS.about)
  const kind: FdeClubKind = o.kind === "speak" ? "speak" : "join"
  if (name.length < 2) return { ok: false, error: "Please add your name" }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, error: "That email looks off" }
  if (about.length < 10) return { ok: false, error: "Tell us a little more" }
  return {
    ok: true,
    data: { kind, name, email, about, company: company || undefined, newsletter: checked(o.newsletter), chat: checked(o.chat) },
  }
}

export async function sendFdeClubSignup(p: FdeClubPayload): Promise<{ success: boolean }> {
  const tag = p.kind === "speak" ? "[FDE Club speaker]" : "[FDE Club join]"
  const yn = (b: boolean) => (b ? "yes" : "no")
  const e = {
    name: escapeHtml(p.name),
    email: escapeHtml(p.email),
    company: p.company ? escapeHtml(p.company) : "",
    about: escapeHtml(p.about).replace(/\n/g, "<br/>"),
  }
  return sendToInbox(
    {
      subject: `${tag} ${p.name}`,
      replyTo: { email: p.email, name: p.name },
      text: `${tag}\nName: ${p.name}\nEmail: ${p.email}\nCompany: ${p.company ?? ""}\nNewsletter: ${yn(p.newsletter)}\nCommunity chat: ${yn(p.chat)}\n\n${p.kind === "speak" ? "Talk idea" : "About"}:\n${p.about}`,
      html: `<p><strong>${tag}</strong></p>
<p><strong>Name:</strong> ${e.name}</p>
<p><strong>Email:</strong> ${e.email}</p>
${e.company ? `<p><strong>Company:</strong> ${e.company}</p>` : ""}
<p><strong>Newsletter:</strong> ${yn(p.newsletter)}<br/><strong>Community chat:</strong> ${yn(p.chat)}</p>
<p><strong>${p.kind === "speak" ? "Talk idea" : "About"}:</strong></p>
<p>${e.about}</p>`,
    },
    "FDE Club form",
  )
}
