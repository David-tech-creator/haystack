/**
 * Contact form delivery through the Brevo transactional email API.
 * Env vars (set in Vercel, never committed): BREVO_API_KEY,
 * CONTACT_FORM_FROM_NAME, CONTACT_FORM_FROM_EMAIL, CONTACT_FORM_TO.
 */
export type ContactPayload = {
  name: string
  email: string
  company?: string
  roles?: string
  message: string
}

const brevoEndpoint = "https://api.brevo.com/v3/smtp/email"

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
  return { ok: true, data: { name, email, company: company || undefined, roles: roles || undefined, message } }
}

export async function sendContactMessage(payload: ContactPayload): Promise<{ success: boolean }> {
  const brevoKey = process.env.BREVO_API_KEY
  const fromName = process.env.CONTACT_FORM_FROM_NAME ?? "Haystack"
  const fromEmail = process.env.CONTACT_FORM_FROM_EMAIL ?? "david.v@haystack.agency"
  const toEmail = process.env.CONTACT_FORM_TO ?? "david.v@haystack.agency"

  if (!brevoKey) {
    console.error("Contact form: BREVO_API_KEY is not configured, message not sent.")
    return { success: false }
  }

  const e = {
    name: escapeHtml(payload.name),
    email: escapeHtml(payload.email),
    company: payload.company ? escapeHtml(payload.company) : "",
    roles: payload.roles ? escapeHtml(payload.roles) : "",
    message: escapeHtml(payload.message).replace(/\n/g, "<br/>"),
  }

  try {
    const response = await fetch(brevoEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "api-key": brevoKey,
      },
      body: JSON.stringify({
        sender: { name: fromName, email: fromEmail },
        to: [{ email: toEmail }],
        replyTo: { email: payload.email, name: payload.name },
        subject: `New sprint request from ${payload.name}`,
        textContent: `Name: ${payload.name}\nEmail: ${payload.email}\nCompany: ${payload.company ?? ""}\nRole(s): ${payload.roles ?? ""}\n\nWhat a great hire looks like:\n${payload.message}`,
        htmlContent: `<p><strong>Name:</strong> ${e.name}</p>
<p><strong>Email:</strong> ${e.email}</p>
${e.company ? `<p><strong>Company:</strong> ${e.company}</p>` : ""}
${e.roles ? `<p><strong>Role(s):</strong> ${e.roles}</p>` : ""}
<p><strong>What a great hire looks like:</strong></p>
<p>${e.message}</p>`,
      }),
    })

    if (!response.ok) {
      console.error("Contact form: Brevo answered", response.status)
      return { success: false }
    }
    return { success: true }
  } catch {
    console.error("Contact form: request to Brevo failed")
    return { success: false }
  }
}
