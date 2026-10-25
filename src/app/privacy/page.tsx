import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Section } from "@/components/ui/section"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Privacy",
  description: "How Haystack handles the details you send through the contact form, under the Swiss Federal Act on Data Protection.",
  path: "/privacy",
})

export default function PrivacyPage() {
  return (
    <Section spacing="tight" labelledBy="privacy-title">
      <Container className="grid-12 gap-y-8">
        <aside className="col-span-12 lg:col-span-3">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <Eyebrow>Privacy</Eyebrow>
            <p className="mt-3 text-small text-ink-mute">Last updated: 25 October 2026.</p>
          </div>
        </aside>
        <article className="prose prose-lg col-span-12 max-w-none lg:col-span-7 lg:col-start-4 prose-headings:text-ink prose-h2:mt-12 prose-h2:border-t prose-h2:border-line prose-h2:pt-8 prose-h2:font-display prose-h2:text-h3 prose-h2:font-semibold prose-p:max-w-[38rem] prose-p:text-ink-soft prose-li:text-ink-soft prose-strong:text-ink">
          <h1 id="privacy-title" className="!mb-0 font-display text-display font-medium">
            Privacy notice
          </h1>
          <p className="lead !mt-6 text-lead">
            This notice explains what happens to the details you send us. It follows the Swiss Federal Act on Data
            Protection (revFADP / nDSG). Short version: we use them to reply to you, and that is it.
          </p>

          <h2>Who is responsible</h2>
          <p>
            Haystack is not yet a registered company. Until it is, the person responsible for your data is David
            Vinkenroye, Geneva, Switzerland. The quickest way to reach us about your data is the{" "}
            <Link href="/contact">contact form</Link>; mention “privacy” and it reaches the right person.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>What you type into the contact form: name, email, and optionally company, roles and your message.</li>
            <li>
              Standard server logs kept by our host (IP address, time, page requested) for security and to keep the site
              running.
            </li>
          </ul>
          <p>No tracking cookies, no advertising pixels, no analytics profiles.</p>

          <h2>Why, and on what basis</h2>
          <p>
            To answer your enquiry and, if we work together, to run the recruitment sprint you asked for. If you are a
            candidate, to talk with you about roles you might want next.
          </p>

          <h2>Who processes it for us</h2>
          <ul>
            <li>
              <strong>Brevo</strong> (Sendinblue SAS, France) delivers the contact form to our inbox.
            </li>
            <li>
              <strong>Vercel</strong> (Vercel Inc., USA) hosts this website; requests are served from its Frankfurt
              region.
            </li>
          </ul>
          <p>
            Where data leaves Switzerland, it goes to countries with adequate protection or under the standard
            contractual clauses these providers offer.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Enquiries stay in our inbox as long as the conversation is useful. Ask us and we delete them.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask what we hold about you, have it corrected or deleted, and object to its use. Send the request
            through the <Link href="/contact">contact form</Link>. You can also contact the Federal Data Protection and
            Information Commissioner (FDPIC).
          </p>
        </article>
      </Container>
    </Section>
  )
}
