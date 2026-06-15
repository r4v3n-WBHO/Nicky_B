import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-px flex flex-col items-center py-28 text-center">
      <p className="font-serif text-6xl text-forge-400">404</p>
      <h1 className="mt-4 font-serif text-2xl text-steel-50">Page not found</h1>
      <p className="mt-2 max-w-sm text-steel-400">
        That page has been re-forged into something else, or never existed.
      </p>
      <Link href="/" className="btn-primary mt-6">Back home</Link>
    </div>
  );
}
