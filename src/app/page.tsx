import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import EventBanner from "@/components/EventBanner";
import { getProducts, getGallery } from "@/lib/content";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";

export default function HomePage() {
  const featured = getProducts().filter((p) => p.inStock).slice(0, 3);
  const recentWork = getGallery().slice(0, 3);
  const heroImage = featured[0]?.images[0] ?? recentWork[0]?.image;

  return (
    <>
      {/* News / next event */}
      <EventBanner />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-steel-800">
        <div className="container-px grid items-center gap-10 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-forge-400">
              {site.location}
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-steel-50 sm:text-5xl">
              Hand-forged knives,
              <br />
              made one at a time.
            </h1>
            <p className="mt-5 max-w-md text-lg text-steel-300">
              Custom hunting, bushcraft, kitchen and collector blades — forged and
              finished by hand by Nicky Badenhorst.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/custom" className="btn-primary">Design your knife</Link>
              <Link href="/store" className="btn-secondary">Shop in-stock</Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-steel-800 bg-gradient-to-br from-steel-800 to-steel-950">
            {heroImage && (
              <Image
                src={asset(heroImage)}
                alt="A hand-forged knife by Nicky Badenhorst"
                fill
                priority
                className="object-contain p-6 drop-shadow-2xl"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            )}
          </div>
        </div>
      </section>

      {/* Process / value props */}
      <section className="container-px py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              title: "Made by hand",
              body: "Every knife is forged, ground and finished individually — no two are exactly alike.",
            },
            {
              title: "Built to use",
              body: "Field-ready steels, comfortable handles and proper heat treatment. Tools, not shelf-queens.",
            },
            {
              title: "Truly custom",
              body: "Choose a style and make it yours, or commission something completely your own.",
            },
          ].map((f) => (
            <div key={f.title} className="card p-6">
              <h3 className="font-serif text-lg text-forge-300">{f.title}</h3>
              <p className="mt-2 text-sm text-steel-300">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured in-stock */}
      {featured.length > 0 && (
        <section className="container-px py-12">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-2xl text-steel-50">In the store now</h2>
            <Link href="/store" className="text-sm text-forge-300 hover:underline">
              View all &rarr;
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recent work */}
      {recentWork.length > 0 && (
        <section className="container-px py-12">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-2xl text-steel-50">Recent work</h2>
            <Link href="/gallery" className="text-sm text-forge-300 hover:underline">
              See the gallery &rarr;
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {recentWork.map((item) => (
              <div key={item.slug} className="card overflow-hidden">
                <div className="relative aspect-[4/3] bg-gradient-to-b from-steel-800 to-steel-950">
                  <Image
                    src={asset(item.image)}
                    alt={item.title}
                    fill
                    className="object-contain p-4 drop-shadow-xl"
                    sizes="(min-width: 640px) 33vw, 100vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-steel-50">{item.title}</h3>
                  {item.caption && <p className="mt-1 text-sm text-steel-400">{item.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-px py-16">
        <div className="card flex flex-col items-center gap-4 bg-gradient-to-br from-steel-900 to-steel-950 p-10 text-center">
          <h2 className="font-serif text-3xl text-steel-50">Have something in mind?</h2>
          <p className="max-w-xl text-steel-300">
            Tell Nicky what you&apos;re after and he&apos;ll build it. Start with a
            template or design from scratch — you&apos;ll get a quote before anything
            is made.
          </p>
          <Link href="/custom" className="btn-primary mt-2">Start a custom order</Link>
        </div>
      </section>
    </>
  );
}
