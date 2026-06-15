import { getEvent } from "@/lib/content";

/**
 * News strip for Nicky's next event. Rendered at the top of the home page.
 * Content comes from content/event.json (editable in the CMS). Renders nothing
 * when the event is toggled off or has no title.
 */
export default function EventBanner() {
  const event = getEvent();
  if (!event.active || !event.title) return null;

  return (
    <section className="border-b border-forge-700/40 bg-gradient-to-r from-forge-900/40 via-steel-900 to-steel-900">
      <div className="container-px flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          {event.kicker && (
            <span className="mt-0.5 flex h-6 items-center rounded-full bg-forge-600 px-2.5 text-xs font-bold uppercase tracking-wide text-white">
              {event.kicker}
            </span>
          )}
          <div>
            <p className="font-serif text-base text-steel-50 sm:text-lg">{event.title}</p>
            <p className="text-sm text-steel-300">
              {event.date && <span className="font-semibold text-forge-300">{event.date}</span>}
              {event.date && event.location && " · "}
              {event.location}
            </p>
            {event.blurb && <p className="mt-0.5 text-sm text-steel-400">{event.blurb}</p>}
          </div>
        </div>

        {event.linkLabel && event.linkHref && (
          <a
            href={event.linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary shrink-0 self-start sm:self-center"
          >
            {event.linkLabel}
          </a>
        )}
      </div>
    </section>
  );
}
