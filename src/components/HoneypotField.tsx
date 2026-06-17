/**
 * Spam trap for the FormSubmit-backed forms. Hidden from real visitors
 * (display:none, off the tab order, ignored by assistive tech) but bots tend to
 * fill every field — FormSubmit silently discards any submission whose `_honey`
 * field has a value. Render it inside a form, then read `_honey` and pass it to
 * submitInquiry() as `honeypot`.
 */
export default function HoneypotField() {
  return (
    <input
      type="text"
      name="_honey"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="hidden"
    />
  );
}
