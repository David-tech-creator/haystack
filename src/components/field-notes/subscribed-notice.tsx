"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

import { FIELD_NOTES } from "@/lib/content"

type State = keyof typeof FIELD_NOTES.subscribed

const isState = (v: string | null): v is State => v === "yes" || v === "expired" || v === "error"

function Notice() {
  const state = useSearchParams().get("subscribed")
  if (!isState(state)) return null
  const m = FIELD_NOTES.subscribed[state]
  return (
    <div
      id="subscribed"
      role={state === "yes" ? "status" : "alert"}
      className="card-stitch mb-10 rounded-md px-6 py-6 sm:px-8 lg:mb-12"
    >
      <h2 className="font-display text-h3 font-semibold">{m.title}</h2>
      <p className="mt-2 text-ink-soft">{m.body}</p>
    </div>
  )
}

/**
 * The answer to the link in the Field notes confirmation email
 * (/api/field-notes/confirm redirects here with ?subscribed=yes|expired|error).
 * Read on the client in its own Suspense boundary, so /field-notes stays static.
 */
export function SubscribedNotice() {
  return (
    <Suspense fallback={null}>
      <Notice />
    </Suspense>
  )
}
