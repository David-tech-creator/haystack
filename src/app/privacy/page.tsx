import Link from "next/link"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Privacy",
  description: "How Haystack handles the details you send through the contact form, under the Swiss Federal Act on Data Protection.",
  path: "/privacy",
})

export default function PrivacyPage() {
  return (
    <section className="pb-24 pt-[calc(var(--header-h)+3rem)] lg:pt-[calc(var(--header-h)+5rem)]">
      <div className="wrap">
        <article className="prose prose-lg max-w-3xl prose-headings:font-display prose-headings:font-medium prose-headings:text-primary prose-p:text-primary/85 prose-li:text-primary/85">
          <p className="eyebrow not-prose">Privacy</p>
          <h1>Privacy notice</h1>
          <p>
            This notice explains what happens to the details you send us. It follows the Swiss Federal Act on Data
            Protection (revFADP / nDSG). Short version: we use them to reply to you, and that is it.
          </p>

          <h2>Who is responsible</h2>
          <p>
            Haystack, Geneva, Switzerland. The quickest way to reach us about your data is the{" "}
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

          <p className="text-sm">Last updated: 25 October 2026.</p>
        </article>
      </div>
    </section>
  )
}
