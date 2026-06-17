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
        <div className="container-px grid items-center gap-6 py-8 sm:gap-10 sm:py-16 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forge-400 sm:text-sm">
              {site.location}
            </p>
            <h1 className="mt-2 font-serif text-3xl leading-tight text-steel-50 sm:mt-3 sm:text-5xl">
              Handmade knives, made one at a time.
            </h1>
            <p className="mt-3 max-w-md text-base text-steel-300 sm:mt-5 sm:text-lg">
              Custom hunting, bushcraft, kitchen and collector blades — shaped and
              finished by hand by Nicky Badenhorst.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 sm:mt-8">
              <Link href="/custom" className="btn-primary">Design your knife</Link>
              <Link href="/store" className="btn-secondary">Shop in-stock</Link>
            </div>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-steel-800 bg-gradient-to-br from-steel-800 to-steel-950 sm:aspect-[4/3] sm:rounded-2xl">
            {heroImage && (
              <Image
                src={asset(heroImage)}
                alt="A handmade knife by Nicky Badenhorst"
                fill
                priority
                className="object-contain p-4 drop-shadow-2xl sm:p-6"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            )}
          </div>
        </div>
      </section>

      {/* Process / value props */}
      <section className="container-px py-10 sm:py-16">
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-8">
          {[
            {
              title: "Made by hand",
              body: "Every knife is shaped, ground and finished individually — no two are exactly alike.",
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
        <section className="container-px py-8 sm:py-12">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-2xl text-steel-50">In the store now</h2>
            <Link href="/store" className="text-sm text-forge-300 hover:underline">
              View all &rarr;
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recent work */}
      {recentWork.length > 0 && (
        <section className="container-px py-8 sm:py-12">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-2xl text-steel-50">Recent work</h2>
            <Link href="/gallery" className="text-sm text-forge-300 hover:underline">
              See the gallery &rarr;
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
            {recentWork.map((item) => (
              <div key={item.slug} className="card overflow-hidden">
                <div className="relative aspect-[4/3] bg-gradient-to-b from-steel-800 to-steel-950">
                  <Image
                    src={asset(item.image)}
                    alt={item.title}
                    fill
                    className="object-contain p-3 drop-shadow-xl sm:p-4"
                    sizes="(min-width: 640px) 33vw, 50vw"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-serif text-base text-steel-50 sm:text-lg">{item.title}</h3>
                  {item.caption && <p className="mt-1 text-sm text-steel-400">{item.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-px py-10 sm:py-16">
        <div className="card flex flex-col items-center gap-4 bg-gradient-to-br from-steel-900 to-steel-950 p-6 text-center sm:p-10">
          <h2 className="font-serif text-2xl text-steel-50 sm:text-3xl">Have something in mind?</h2>
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
