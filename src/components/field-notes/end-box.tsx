import { ButtonLink } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eyebrow } from "@/components/ui/eyebrow"
import { FIELD_NOTES } from "@/lib/content"

/** The fixed box at the end of every post: join the club, or hire an FDE. */
export function EndBox() {
  const { join, hire } = FIELD_NOTES.end
  return (
    <div className="grid gap-5 md:grid-cols-2 md:gap-6">
      <div data-tone="deep" className="h-full">
        <Card tone="deep" padding="lg" stitch className="flex h-full flex-col">
          <Eyebrow>{join.eyebrow}</Eyebrow>
          <h3 className="mt-4 text-h3 font-semibold text-on-deep">{join.title}</h3>
          <p className="mt-3 text-on-deep-soft">{join.body}</p>
          <div className="mt-auto pt-7">
            <ButtonLink href={join.cta.href} arrow className="w-full sm:w-auto">
              {join.cta.label}
            </ButtonLink>
          </div>
        </Card>
      </div>
      <Card padding="lg" className="flex h-full flex-col">
        <Eyebrow>{hire.eyebrow}</Eyebrow>
        <h3 className="mt-4 text-h3 font-semibold">{hire.title}</h3>
        <p className="mt-3 text-ink-soft">{hire.body}</p>
        <div className="mt-auto pt-7">
          <ButtonLink href={hire.cta.href} variant="secondary" arrow className="w-full sm:w-auto">
            {hire.cta.label}
          </ButtonLink>
        </div>
      </Card>
    </div>
  )
}
