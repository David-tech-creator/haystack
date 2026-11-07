import { Fragment } from "react"

/**
 * Renders copy that carries citation markers like "[3]": the marker becomes
 * a small superscript link to the matching item in the Sources list
 * (id="source-3"). Plain text everywhere else, so the copy stays readable in
 * llms-full.txt too.
 */
export function Cited({ text }: { text: string }) {
  const parts = text.split(/\s?\[(\d+)\]/)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <sup key={i} className="ml-0.5 text-[0.7em] font-semibold">
            <a href={`#source-${part}`} className="link" aria-label={`Source ${part}`}>
              {part}
            </a>
          </sup>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}

/** Drops citation markers, for places that cannot link (JSON-LD, meta tags). */
export const stripCites = (text: string) => text.replace(/\s?\[\d+\]/g, "")
