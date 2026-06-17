/**
 * Renders a block of schema.org structured data (JSON-LD) into the page.
 * Search engines read this to show richer results (product availability,
 * breadcrumbs, the maker/brand). Safe in the static export — it's just a
 * <script> tag. The `<` escaping prevents the JSON from breaking out of the
 * script element.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
