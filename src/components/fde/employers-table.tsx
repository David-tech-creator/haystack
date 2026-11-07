import { FDE_HUB } from "@/lib/content"
import { FDE_EMPLOYERS, formatDate } from "@/lib/site"

/**
 * Where FDEs are hired in Switzerland: a real <table> (assistants lift tables
 * well), one row per checked posting, each linking to its source. Narrow
 * screens scroll it sideways inside a focusable region.
 */
export function EmployersTable() {
  const c = FDE_HUB.hiring.columns
  return (
    <div
      role="region"
      aria-labelledby="hiring-title"
      tabIndex={0}
      className="relative -mx-4 overflow-x-auto border-y border-line bg-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink sm:mx-0 sm:rounded-md sm:border"
    >
      <table className="w-full min-w-[46rem] border-collapse text-left">
        <caption className="sr-only">Companies with forward deployed engineer roles in Switzerland, with sources</caption>
        <thead className="bg-linen">
          <tr className="text-label font-display font-semibold uppercase text-ink-mute">
            <th scope="col" className="px-5 py-4">{c.company}</th>
            <th scope="col" className="px-5 py-4">{c.city}</th>
            <th scope="col" className="px-5 py-4">{c.title}</th>
            <th scope="col" className="px-5 py-4">{c.source}</th>
            <th scope="col" className="px-5 py-4">{c.checked}</th>
          </tr>
        </thead>
        <tbody>
          {FDE_EMPLOYERS.map((e) => (
            <tr key={e.sourceUrl} className="border-t border-line align-top">
              <th scope="row" className="px-5 py-4 font-display font-semibold text-ink">
                {e.company}
              </th>
              <td className="px-5 py-4 text-ink-soft">{e.city}</td>
              <td className="px-5 py-4 text-ink">{e.title}</td>
              <td className="px-5 py-4">
                <a href={e.sourceUrl} target="_blank" rel="noopener noreferrer" className="link whitespace-nowrap">
                  Posting<span className="sr-only">: {e.title} at {e.company} (opens in a new tab)</span>
                </a>
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-ink-soft">
                <time dateTime={e.checked}>{formatDate(e.checked)}</time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
