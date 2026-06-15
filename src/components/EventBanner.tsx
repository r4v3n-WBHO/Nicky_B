import { nextEvent } from "@/data/news";

/**
 * News strip for Nicky's next event. Rendered at the very top of the home page.
 * Returns null (renders nothing) when there's no active event.
 */
export default function EventBanner() {
  if (!nextEvent.active) return null;

  return (
    <section className="border-b border-forge-700/40 bg-gradient-to-r from-forge-900/40 via-steel-900 to-steel-900">
      <div className="container-px flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-6 items-center rounded-full bg-forge-600 px-2.5 text-xs font-bold uppercase tracking-wide text-white">
            {nextEvent.kicker}
          </span>
          <div>
            <p className="font-serif text-base text-steel-50 sm:text-lg">
              {nextEvent.title}
            </p>
            <p className="text-sm text-steel-300">
              <span className="font-semibold text-forge-300">{nextEvent.date}</span>
              {" · "}
              {nextEvent.location}
            </p>
            {nextEvent.blurb && (
              <p className="mt-0.5 text-sm text-steel-400">{nextEvent.blurb}</p>
            )}
          </div>
        </div>

        {nextEvent.link && (
          <a
            href={nextEvent.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary shrink-0 self-start sm:self-center"
          >
            {nextEvent.link.label}
          </a>
        )}
      </div>
    </section>
  );
}
