import { NextResponse } from "next/server"

import { sendContactMessage } from "@/lib/contact"

export async function POST(request: Request) {
  const body = await request.json()
  const { name, email, company, roles, message } = body

  if (!name || !email || !message) {
    return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
  }

  const result = await sendContactMessage({ name, email, company, roles, message })

  return NextResponse.json(result)
}
