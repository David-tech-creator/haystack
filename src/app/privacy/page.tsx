import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Section } from "@/components/ui/section"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Privacy",
  description: "How Haystack handles the details you send through the contact form, the FDE Club Switzerland form and the Field notes newsletter, under the Swiss Federal Act on Data Protection.",
  path: "/privacy",
})

export default function PrivacyPage() {
  return (
    <Section spacing="tight" labelledBy="privacy-title">
      <Container className="grid-12 gap-y-8">
        <aside className="col-span-12 lg:col-span-3">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <Eyebrow>Privacy</Eyebrow>
            <p className="mt-3 text-small text-ink-mute">Last updated: 7 November 2026.</p>
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
              What you type into the FDE Club Switzerland form: name, email, what you tell us about yourself or your talk,
              optionally your company, and whether you want Field notes, our newsletter, and the community chat.
            </li>
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

          <h2 id="fde-club">FDE Club Switzerland</h2>
          <p>
            Haystack runs <Link href="/forward-deployed-engineers">FDE Club Switzerland</Link>. When you join or offer a
            talk, we use your details to run the club: to invite you to meetups, to reply about your talk, and, only if you
            ticked the boxes, to send you the newsletter and invite you to the community chat once it opens. Haystack is also a
            recruitment agency, so we say this plainly: we never pass a member&apos;s details to an employer without asking
            that member first. You can leave the club at any time by telling us through the{" "}
            <Link href="/contact">contact form</Link>, and we delete your details.
          </p>
          <p id="newsletter">
            The newsletter is <Link href="/field-notes">Field notes</Link>: emails with David Vinkenroye&apos;s notes on
            forward deployed engineering and tech hiring in Switzerland, from FDE Club Switzerland. We use double opt-in: if
            you tick its box, we send you one email with a confirmation link, and only when you click it do we add your
            first name and email to our Field notes list in Resend. If you do not click, we keep nothing. Every Field notes
            email has an unsubscribe link, and you can also ask us to take you off the list through the{" "}
            <Link href="/contact">contact form</Link>.
          </p>

          <h2>Who processes it for us</h2>
          <ul>
            <li>
              <strong>Resend</strong> (Resend, Inc., USA) delivers the contact form and the FDE Club Switzerland form to our
              inbox, sends the Field notes confirmation email, keeps the Field notes mailing list and sends the Field notes
              emails.
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
            Enquiries stay in our inbox as long as the conversation is useful. Ask us and we delete them. Field notes
            subscribers stay on the list until they unsubscribe.
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
