import { ContactForm } from "@/components/contact-form"
import { StructuredData } from "@/components/structured-data"
import { Card } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { Frame } from "@/components/ui/frame"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { CONTACT } from "@/lib/content"
import { IMG } from "@/lib/images"
import { contactJsonLd, pageMetadata } from "@/lib/seo"

const DESCRIPTION =
  "Start a recruitment sprint with Haystack. Tell us about the role and we will reply within one business day."

export const metadata = pageMetadata({ title: "Contact", description: DESCRIPTION, path: "/contact" })

const n = (i: number) => String(i + 1).padStart(2, "0")

export default function ContactPage({ searchParams }: { searchParams: { sent?: string; error?: string } }) {
  const initial = searchParams.sent ? "sent" : searchParams.error ? "error" : undefined
  return (
    <>
      <StructuredData data={contactJsonLd(DESCRIPTION)} />
      <Section spacing="tight" labelledBy="contact-title">
        <Container className="grid-12 gap-y-12">
          <div className="col-span-12 lg:col-span-5">
            <SectionHeading
              as="h1"
              size="display"
              eyebrow={CONTACT.eyebrow}
              title={CONTACT.title}
              titleId="contact-title"
              lead={CONTACT.body}
            />

            <div className="mt-10 lg:mt-12">
              <h2 className="font-display text-h3 font-semibold">{CONTACT.expectTitle}</h2>
              <ol className="mt-5">
                {CONTACT.expect.map((item, i) => (
                  <li
                    key={item}
                    className="grid grid-cols-[3rem_1fr] items-baseline border-t border-line py-4 last:border-b"
                  >
                    <span className="step-n">{n(i)}</span>
                    <span className="text-ink">{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            <Frame
              image={IMG["envelope-thread"]}
              ratio="4/3"
              sizes="(min-width:1280px) 460px, 34vw"
              className="mt-12 hidden lg:block"
            />
          </div>

          <div id="form" className="col-span-12 scroll-mt-28 lg:col-span-6 lg:col-start-7">
            <Card padding="lg" className="shadow-raise">
              <ContactForm initial={initial} />
            </Card>
          </div>
        </Container>
      </Section>
    </>
  )
}
