import { cn } from "@/lib/utils"
import { Reveal } from "./reveal"

const n = (i: number) => String(i + 1).padStart(2, "0")

/**
 * Numbered steps as an <ol>. `rail`: hairline rows (number, title, body side by
 * side from lg). `grid`: 1 / 2 / 5 columns, each item under a hairline.
 */
export function StepList({
  steps,
  variant = "rail",
  headingLevel: H = "h3",
  className,
}: {
  steps: readonly { title: string; body: string }[]
  variant?: "rail" | "grid"
  headingLevel?: "h3" | "h4"
  className?: string
}) {
  if (variant === "grid") {
    return (
      <ol className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-5", className)}>
        {steps.map((s, i) => (
          <Reveal as="li" key={s.title} delay={(i % 4) as 0 | 1 | 2 | 3} className="border-t border-line pt-5">
            <span className="step-n">{n(i)}</span>
            <H className="mt-4 text-h3">{s.title}</H>
            <p className="mt-2 text-ink-soft">{s.body}</p>
          </Reveal>
        ))}
      </ol>
    )
  }
  return (
    <ol className={className}>
      {steps.map((s, i) => (
        <Reveal
          as="li"
          key={s.title}
          delay={(i % 4) as 0 | 1 | 2 | 3}
          className="grid grid-cols-[4.5rem_1fr] items-baseline gap-y-2 border-t border-line py-6 last:border-b lg:grid-cols-[4.5rem_minmax(0,0.75fr)_1.5fr] lg:gap-x-8 lg:py-8"
        >
          <span className="step-n">{n(i)}</span>
          <H className="text-h3">{s.title}</H>
          <p className="col-start-2 max-w-[38rem] text-ink-soft lg:col-start-3 lg:row-start-1">{s.body}</p>
        </Reveal>
      ))}
    </ol>
  )
}
