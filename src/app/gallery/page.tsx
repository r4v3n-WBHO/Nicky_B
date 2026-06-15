import type { Metadata } from "next";
import Link from "next/link";
import ZoomImage from "@/components/ZoomImage";
import { getGallery } from "@/lib/content";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "The Work",
  description: "A gallery of hand-forged knives made by Nicky Badenhorst.",
};

export default function GalleryPage() {
  const gallery = getGallery();

  return (
    <div className="container-px py-14">
      <header className="max-w-2xl">
        <h1 className="font-serif text-3xl text-steel-50 sm:text-4xl">The Work</h1>
        <p className="mt-3 text-steel-300">
          A selection of knives Nicky has made over the years — commissions,
          one-offs and personal pieces. Like what you see?{" "}
          <Link href="/custom" className="text-forge-300 hover:underline">
            Commission your own.
          </Link>
        </p>
      </header>

      {gallery.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item) => (
            <figure key={item.slug} className="card overflow-hidden">
              <div className="relative aspect-[4/3] bg-gradient-to-b from-steel-800 to-steel-950">
                <ZoomImage
                  src={asset(item.image)}
                  alt={item.title}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <figcaption className="p-4">
                <h2 className="font-serif text-lg text-steel-50">{item.title}</h2>
                {item.caption && (
                  <p className="mt-1 text-sm text-steel-400">{item.caption}</p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-steel-400">Gallery pieces are coming soon.</p>
      )}
    </div>
  );
}
