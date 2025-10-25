import { Resend } from "resend"

export type ContactPayload = {
  name: string
  email: string
  company?: string
  roles?: string
  message: string
}

const resendKey = process.env.RESEND_API_KEY
const resend = resendKey ? new Resend(resendKey) : null

export async function sendContactMessage(payload: ContactPayload) {
  console.log("Contact submission", payload)

  if (!resend) {
    return { success: true }
  }

  try {
    await resend.emails.send({
      from: "Haystack <hello@haystack.example>",
      to: "hello@haystack.example",
      replyTo: payload.email,
      subject: `New sprint request from ${payload.name}`,
      text: `Name: ${payload.name}\nEmail: ${payload.email}\nCompany: ${payload.company}\nRoles: ${payload.roles}\n\nMessage:\n${payload.message}`,
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to send contact email", error)
    return { success: false }
  }
}
