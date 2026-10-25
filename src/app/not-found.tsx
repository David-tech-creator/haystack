import Link from "next/link"

export default function NotFound() {
  return (
    <section data-formation="loose" aria-labelledby="nf-title" className="fm-flow flex min-h-[80vh] items-center">
      <div className="wrap pt-16">
        <p className="eyebrow">404</p>
        <h1 id="nf-title" className="mt-5 text-4xl leading-tight sm:text-5xl lg:text-6xl">
          Not in this haystack.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-primary/80">This page does not exist, or it moved.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link href="/" className="btn-solid">
            Back home
          </Link>
          <Link href="/contact" className="btn-outline">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  )
}
