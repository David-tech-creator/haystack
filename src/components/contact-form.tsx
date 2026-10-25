"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"

type Status = "idle" | "sending" | "sent" | "error"
type Field = "name" | "email" | "message"

const MESSAGES: Record<Field, string> = {
  name: "Please add your name",
  email: "That email looks off",
  message: "Tell us a little more",
}

function check(data: FormData): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {}
  if (String(data.get("name") ?? "").trim().length < 2) errors.name = MESSAGES.name
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(data.get("email") ?? "").trim())) errors.email = MESSAGES.email
  if (String(data.get("message") ?? "").trim().length < 10) errors.message = MESSAGES.message
  return errors
}

/**
 * Contact form. Real labels, 16px inputs (no iOS zoom), autocomplete hints.
 * With JavaScript it posts JSON and answers inline; without, it posts the
 * form to the same route, which redirects back with ?sent=1 or ?error=1.
 */
export function ContactForm({ initial }: { initial?: "sent" | "error" }) {
  const [status, setStatus] = useState<Status>(initial ?? "idle")
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const found = check(data)
    setErrors(found)
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0]
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setStatus("sending")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      })
      const json = (await res.json().catch(() => ({}))) as { success?: boolean }
      if (res.ok && json.success) {
        setStatus("sent")
        form.reset()
      } else setStatus("error")
    } catch {
      setStatus("error")
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="py-6 text-lg text-primary">
        Thanks. We will get back to you within one business day.
      </div>
    )
  }

  const field = (name: Field) =>
    errors[name] ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` } : {}

  return (
    <form action="/api/contact" method="post" noValidate onSubmit={onSubmit} className="relative grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="field">
          <span className="field-label">Name</span>
          <input name="name" type="text" required autoComplete="name" placeholder="Your name" className="input" {...field("name")} />
          {errors.name && (
            <span id="name-error" className="field-error">
              {errors.name}
            </span>
          )}
        </label>
        <label className="field">
          <span className="field-label">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="you@company.com"
            className="input"
            {...field("email")}
          />
          {errors.email && (
            <span id="email-error" className="field-error">
              {errors.email}
            </span>
          )}
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="field">
          <span className="field-label">
            Company <span className="font-normal text-primary/70">(optional)</span>
          </span>
          <input name="company" type="text" autoComplete="organization" placeholder="Company" className="input" />
        </label>
        <label className="field">
          <span className="field-label">
            Role(s) you are hiring for <span className="font-normal text-primary/70">(optional)</span>
          </span>
          <input name="roles" type="text" placeholder="e.g. Senior backend engineer, Head of data" className="input" />
        </label>
      </div>
      <label className="field">
        <span className="field-label">What would a great hire look like?</span>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="The team, the timeline, the first thing you would love this person to fix"
          className="input min-h-40 resize-y"
          {...field("message")}
        />
        {errors.message && (
          <span id="message-error" className="field-error">
            {errors.message}
          </span>
        )}
      </label>
      {/* honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={status === "sending"} className="btn-solid w-full sm:w-auto">
          {status === "sending" ? "Sending…" : "Send"}
        </button>
        <p className="text-sm text-primary/75">
          We use your details only to reply to you. See the{" "}
          <Link href="/privacy" className="link">
            privacy notice
          </Link>
          .
        </p>
      </div>
      {status === "error" && (
        <p role="alert" className="text-sm font-semibold text-[#9b2c1f]">
          That did not go through. Please try again in a minute.
        </p>
      )}
    </form>
  )
}
