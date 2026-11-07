"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState, type FormEvent } from "react"

type Status = "idle" | "sending" | "sent" | "error"
type Field = "name" | "email" | "about"
type Kind = "join" | "speak"

const MESSAGES: Record<Field, string> = {
  name: "Please add your name",
  email: "That email looks off",
  about: "Tell us a little more",
}

function check(data: FormData): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {}
  if (String(data.get("name") ?? "").trim().length < 2) errors.name = MESSAGES.name
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(data.get("email") ?? "").trim())) errors.email = MESSAGES.email
  if (String(data.get("about") ?? "").trim().length < 10) errors.about = MESSAGES.about
  return errors
}

/**
 * Reads ?joined, ?error and ?kind=speak after hydration (and on client-side
 * navigation, e.g. the "Offer a talk" link) without making the page dynamic.
 * Inside its own Suspense boundary so the form itself is in the static HTML.
 */
function QuerySync({ onStatus, onKind }: { onStatus: (s: Status) => void; onKind: (k: Kind) => void }) {
  const q = useSearchParams()
  const joined = q.get("joined")
  const error = q.get("error")
  const kind = q.get("kind")
  useEffect(() => {
    if (joined) onStatus("sent")
    else if (error) onStatus("error")
    if (kind === "speak") onKind("speak")
  }, [joined, error, kind, onStatus, onKind])
  return null
}

/**
 * FDE Club Switzerland join form (and speaker offers). Same pattern as the
 * contact form: real labels, 16px inputs, inline answers with JavaScript, and
 * a plain form post without it (the route redirects back with ?joined=1 or
 * ?error=1). Opt-ins start unticked. The query (?joined, ?error, ?kind=speak)
 * is read here after hydration, so the hub page itself stays static and
 * cacheable on the CDN.
 */
export function JoinForm() {
  const [status, setStatus] = useState<Status>("idle")
  const [kind, setKind] = useState<Kind>("join")
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
      const res = await fetch("/api/fde-club", {
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

  const sync = (
    <Suspense fallback={null}>
      <QuerySync onStatus={setStatus} onKind={setKind} />
    </Suspense>
  )

  if (status === "sent") {
    return (
      <div role="status" className="card-stitch rounded-md px-6 py-8 sm:px-8">
        <h3 className="font-display text-h3 font-semibold">You are on the list.</h3>
        <p className="mt-3 text-lead text-ink-soft">
          Thanks for joining FDE Club Switzerland. We will be in touch before the first meetup.
        </p>
        {sync}
      </div>
    )
  }

  const clearError = (e: FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name as Field
    if (!errors[name]) return
    setErrors((prev) => {
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const field = (name: Field) =>
    errors[name] ? { "aria-invalid": true as const, "aria-describedby": `fde-${name}-error` } : {}

  const speak = kind === "speak"

  return (
    <form action="/api/fde-club" method="post" noValidate onSubmit={onSubmit} onInput={clearError} className="relative grid gap-6">
      {sync}
      <fieldset>
        <legend className="field-label">I would like to</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(
            [
              { value: "join", label: "Join the club" },
              { value: "speak", label: "Offer a talk" },
            ] as const
          ).map((o) => (
            <label
              key={o.value}
              className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-sm border border-line bg-raised px-4 has-[:checked]:border-ink has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
            >
              <input
                type="radio"
                name="kind"
                value={o.value}
                checked={kind === o.value}
                onChange={() => setKind(o.value)}
                className="h-5 w-5 flex-none accent-[#1A2136]"
              />
              <span className="font-display font-semibold text-ink">{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="fde-name" className="field-label">
            Name
          </label>
          <input id="fde-name" name="name" type="text" required autoComplete="name" placeholder="Your name" className="input" {...field("name")} />
          {errors.name && (
            <span id="fde-name-error" className="field-error">
              {errors.name}
            </span>
          )}
        </div>
        <div className="field">
          <label htmlFor="fde-email" className="field-label">
            Email
          </label>
          <input
            id="fde-email"
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
            <span id="fde-email-error" className="field-error">
              {errors.email}
            </span>
          )}
        </div>
      </div>

      <div className="field">
        <label htmlFor="fde-about" className="field-label">
          {speak ? "What would you talk about?" : "Tell us about yourself"}
        </label>
        <textarea
          id="fde-about"
          name="about"
          required
          rows={5}
          placeholder={
            speak
              ? "The deployment, what broke, what you learned"
              : "What you work on, and whether you are an FDE, moving into the role or building an FDE team"
          }
          className="input"
          {...field("about")}
        />
        {errors.about && (
          <span id="fde-about-error" className="field-error">
            {errors.about}
          </span>
        )}
      </div>

      <label className="field">
        <span className="field-label">
          Company <span className="font-normal text-ink-mute">(optional)</span>
        </span>
        <input name="company" type="text" autoComplete="organization" placeholder="Company" className="input" />
      </label>

      <fieldset className="grid gap-3">
        <legend className="field-label">Keep me posted</legend>
        <label className="mt-3 flex cursor-pointer items-start gap-3 text-ink">
          <input type="checkbox" name="newsletter" className="mt-1 h-5 w-5 flex-none accent-[#1A2136]" />
          <span>Send me Field notes, the FDE Club Switzerland newsletter</span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-ink">
          <input type="checkbox" name="chat" className="mt-1 h-5 w-5 flex-none accent-[#1A2136]" />
          <span>Invite me to the community chat when it opens</span>
        </label>
      </fieldset>

      {/* honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full flex-none sm:w-auto">
          {status === "sending" ? "Sending…" : speak ? "Offer my talk" : "Join the club"}
        </button>
        <p className="max-w-[24rem] text-small text-ink-mute">
          We use your details only for the club, and never pass them to an employer without asking you first. See the{" "}
          <Link href="/privacy#fde-club" className="link">
            privacy notice
          </Link>
          .
        </p>
      </div>
      {status === "error" && (
        <p role="alert" className="field-error">
          That did not go through. Please try again in a minute.
        </p>
      )}
    </form>
  )
}
