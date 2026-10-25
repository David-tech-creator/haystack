/**
 * FAQ as native <details name="faq">: works without JavaScript, exclusive
 * where the browser supports `name`, the whole row is the tap target.
 */
export function Faq({
  items,
  defaultOpen,
  className,
}: {
  items: readonly { q: string; a: string }[]
  defaultOpen?: number
  className?: string
}) {
  return (
    <div className={className}>
      {items.map((f, i) => (
        <details key={f.q} name="faq" className="faq-item" open={i === defaultOpen || undefined}>
          <summary>
            <span className="font-display text-h3 font-medium">{f.q}</span>
            <span aria-hidden="true" className="faq-marker" />
          </summary>
          <p className="max-w-[40rem] pb-6 pr-12 text-ink-soft">{f.a}</p>
        </details>
      ))}
    </div>
  )
}
