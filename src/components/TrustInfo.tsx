/**
 * A small reassurance list (lead time / guarantee / payments). Pass the lines
 * you want to show on a given page. Renders nothing if there are none.
 */
export default function TrustInfo({
  lines,
  className = "",
}: {
  lines: Array<string | undefined>;
  className?: string;
}) {
  const items = lines.filter((l): l is string => Boolean(l && l.trim()));
  if (items.length === 0) return null;

  return (
    <ul className={`space-y-2 text-sm text-steel-400 ${className}`}>
      {items.map((line, i) => (
        <li key={i} className="flex gap-2">
          <svg
            className="mt-0.5 h-4 w-4 flex-none text-forge-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}
