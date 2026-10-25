import Link from "next/link"
import type { CSSProperties, ReactNode } from "react"
import { CTA, FAQ } from "@/lib/content"

/** Text in a sticky section fades in once its particle shape has formed. */
export function ready(formation: string, height?: string): CSSProperties {
  return {
    ["--ready" as string]: `var(--${formation}-ready, 1)`,
    ...(height ? { ["--fm-h" as string]: height } : {}),
  } as CSSProperties
}

export function Eyebrow({ children, as: Tag = "p" }: { children: ReactNode; as?: "p" | "span" }) {
  return <Tag className="eyebrow">{children}</Tag>
}

/** FAQ as native <details>: works without JavaScript, the whole row is the tap target. */
export function FaqList() {
  return (
    <div className="border-t border-line">
      {FAQ.map((f) => (
        <details key={f.q} className="qa">
          <summary>{f.q}</summary>
          <div>
            <p>{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  )
}

/**
 * Closing call to action. The field stitches an outline around the primary
 * button (data-outline-target) and parks the needle beside it.
 */
export function CtaSection({
  eyebrow = CTA.eyebrow,
  title = CTA.title,
  secondary = CTA.secondary,
}: {
  eyebrow?: string
  title?: string
  secondary?: { label: string; href: string } | null
}) {
  return (
    <section
      data-formation="contact"
      data-outline-target="contact-cta"
      data-formation-start="0.15"
      aria-labelledby="cta-title"
      className="fm-flow flex min-h-[78vh] items-center"
    >
      <div className="wrap text-center">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id="cta-title" className="mx-auto mt-5 max-w-3xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-9 sm:flex-row sm:gap-10">
          <Link id="contact-cta" href={CTA.primary.href} className="btn-solid outline-target w-full max-w-xs sm:w-auto">
            {CTA.primary.label}
          </Link>
          {secondary && (
            <Link href={secondary.href} className="btn-outline w-full max-w-xs sm:w-auto">
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
