import { Resend } from "resend"

export type ContactPayload = {
  name: string
  email: string
  company?: string
  roles?: string
  message: string
}

const resendKey = process.env.RESEND_API_KEY
const resendFrom = process.env.CONTACT_FORM_FROM ?? "Haystack <david.v@haystack.agency>"
const resendTo = process.env.CONTACT_FORM_TO ?? "david.v@haystack.agency"
const resend = resendKey ? new Resend(resendKey) : null

export async function sendContactMessage(payload: ContactPayload) {
  console.log("Contact submission", payload)

  if (!resend) {
    return { success: true }
  }

  try {
    await resend.emails.send({
      from: resendFrom,
      to: [resendTo],
      replyTo: payload.email,
      subject: `New sprint request from ${payload.name}`,
      text: `Name: ${payload.name}\nEmail: ${payload.email}\nCompany: ${payload.company ?? ""}\nRoles: ${payload.roles ?? ""}\n\nMessage:\n${payload.message}`,
      html: `
        <p><strong>Name:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
        ${payload.company ? `<p><strong>Company:</strong> ${payload.company}</p>` : ""}
        ${payload.roles ? `<p><strong>Roles:</strong> ${payload.roles}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${payload.message.replace(/\n/g, "<br/>")}</p>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to send contact email", error)
    return { success: false }
  }
}
