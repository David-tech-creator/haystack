import { ContactForm } from "@/components/contact-form"
import { Eyebrow } from "@/components/sections"
import { StructuredData } from "@/components/structured-data"
import { CONTACT } from "@/lib/content"
import { contactJsonLd, pageMetadata } from "@/lib/seo"

const DESCRIPTION =
  "Start a recruitment sprint with Haystack. Tell us about the role and we will reply within one business day."

export const metadata = pageMetadata({ title: "Contact", description: DESCRIPTION, path: "/contact" })

export default function ContactPage({ searchParams }: { searchParams: { sent?: string; error?: string } }) {
  const initial = searchParams.sent ? "sent" : searchParams.error ? "error" : undefined
  return (
    <>
      <StructuredData data={contactJsonLd(DESCRIPTION)} />
      {/* the thread stitches around the form, the needle parks at its corner */}
      <section
        data-formation="contact"
        data-outline-target="contact-form-box"
        aria-labelledby="contact-title"
        className="pb-20 pt-[calc(var(--header-h)+3rem)] lg:pb-28 lg:pt-[calc(var(--header-h)+5rem)]"
      >
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          <div>
            <Eyebrow>{CONTACT.eyebrow}</Eyebrow>
            <h1 id="contact-title" className="mt-5 text-[2.35rem] leading-[1.08] sm:text-5xl lg:text-6xl">
              {CONTACT.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary/80">{CONTACT.body}</p>
            <div className="card mt-8 p-6">
              <h2 className="text-xl">{CONTACT.expectTitle}</h2>
              <ul className="mt-4 space-y-3">
                {CONTACT.expect.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.6em] h-2 w-2 flex-none rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div id="form" className="scroll-mt-28">
            <div id="contact-form-box" className="card outline-target bg-paper/95 p-6 sm:p-8">
              <ContactForm initial={initial} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
