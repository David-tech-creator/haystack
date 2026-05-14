"use server"

import { sendContactMessage } from "@/lib/contact"

export async function ContactFormAction(values: {
  name: string
  email: string
  company?: string
  project?: string
  message: string
}) {
  return sendContactMessage(values)
}
