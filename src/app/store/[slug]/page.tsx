import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProduct } from "@/data/products";
import { asset } from "@/lib/asset";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProduct(params.slug);
  if (!product) return { title: "Not found" };
  return { title: product.name, description: product.tagline };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const enquiry = `Hi Nicky, I'm interested in the "${product.name}". Is it still available, and what's the price?`;

  return (
    <div className="container-px py-14">
      <Link href="/store" className="text-sm text-steel-400 hover:text-forge-300">
        &larr; Back to store
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-steel-800 bg-gradient-to-b from-steel-800 to-steel-950">
            <Image
              src={asset(product.images[0])}
              alt={product.name}
              fill
              priority
              className="object-contain p-6 drop-shadow-2xl"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            {!product.inStock && (
              <span className="absolute left-4 top-4 rounded bg-steel-950/80 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-steel-300">
                Sold
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1).map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-steel-800 bg-gradient-to-b from-steel-800 to-steel-950">
                  <Image src={asset(src)} alt={`${product.name} ${i + 2}`} fill className="object-contain p-2" sizes="120px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <span className="inline-block rounded bg-steel-800 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-forge-300">
              {product.category}
            </span>
          )}
          <h1 className="mt-3 font-serif text-3xl text-steel-50">{product.name}</h1>
          <p className="mt-2 text-lg text-steel-300">{product.tagline}</p>
          <p className="mt-4 text-lg font-medium text-forge-300">
            {product.inStock ? "Enquire for price" : "Sold"}
          </p>

          <p className="mt-6 text-steel-300">{product.description}</p>

          {product.specs.length > 0 && (
            <dl className="mt-6 divide-y divide-steel-800 rounded-lg border border-steel-800">
              {product.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                  <dt className="text-steel-400">{s.label}</dt>
                  <dd className="text-right text-steel-100">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {product.inStock ? (
              <Link
                href={`/contact?about=${encodeURIComponent(enquiry)}`}
                className="btn-primary"
              >
                Enquire to buy
              </Link>
            ) : (
              <span className="btn-secondary cursor-default">This piece has sold</span>
            )}
            <Link href="/custom" className="btn-secondary">
              Order one like it
            </Link>
          </div>
          <p className="mt-3 text-sm text-steel-500">
            No online checkout — Nicky arranges payment &amp; delivery with you directly.
          </p>
        </div>
      </div>
    </div>
  );
}
