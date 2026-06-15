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
      <div className="container-px flex flex-col gap-2 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-3">
        <div className="flex items-start gap-2.5">
          {event.kicker && (
            <span className="mt-0.5 inline-flex h-5 shrink-0 items-center whitespace-nowrap rounded-full bg-forge-600 px-2 text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs">
              {event.kicker}
            </span>
          )}
          <div className="min-w-0">
            <p className="font-serif text-sm leading-tight text-steel-50 sm:text-base">
              {event.title}
            </p>
            <p className="text-xs text-steel-300 sm:text-sm">
              {event.date && <span className="font-semibold text-forge-300">{event.date}</span>}
              {event.date && event.location && " · "}
              {event.location}
            </p>
            {event.blurb && (
              <p className="mt-0.5 hidden text-sm text-steel-400 sm:block">{event.blurb}</p>
            )}
          </div>
        </div>

        {event.linkLabel && event.linkHref && (
          <a
            href={event.linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary w-full justify-center py-2 sm:w-auto sm:shrink-0"
          >
            {event.linkLabel}
          </a>
        )}
      </div>
    </section>
  );
}
