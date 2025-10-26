export type ContactPayload = {
  name: string
  email: string
  company?: string
  roles?: string
  message: string
}

const brevoKey = process.env.BREVO_API_KEY
const brevoFromName = process.env.CONTACT_FORM_FROM_NAME ?? "Haystack"
const brevoFromEmail = process.env.CONTACT_FORM_FROM_EMAIL ?? "david.v@haystack.agency"
const brevoToEmail = process.env.CONTACT_FORM_TO ?? "david.v@haystack.agency"

const brevoEndpoint = "https://api.brevo.com/v3/smtp/email"

export async function sendContactMessage(payload: ContactPayload) {
  console.log("Contact submission", payload)

  if (!brevoKey) {
    console.error("BREVO_API_KEY is not configured. Contact form submission skipped.")
    return { success: false }
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
        sender: {
          name: brevoFromName,
          email: brevoFromEmail,
        },
        to: [{ email: brevoToEmail }],
        replyTo: {
          email: payload.email,
        },
        subject: `New sprint request from ${payload.name}`,
        textContent: `Name: ${payload.name}\nEmail: ${payload.email}\nCompany: ${payload.company ?? ""}\nRoles: ${payload.roles ?? ""}\n\nMessage:\n${payload.message}`,
        htmlContent: `
          <p><strong>Name:</strong> ${payload.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
          ${payload.company ? `<p><strong>Company:</strong> ${payload.company}</p>` : ""}
          ${payload.roles ? `<p><strong>Roles:</strong> ${payload.roles}</p>` : ""}
          <p><strong>Message:</strong></p>
          <p>${payload.message.replace(/\n/g, "<br/>")}</p>
        `,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Brevo API error", response.status, errorText)
      return { success: false }
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to send contact email via Brevo", error)
    return { success: false }
  }
}
