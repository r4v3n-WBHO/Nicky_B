import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/content";
import { asset } from "@/lib/asset";

export default function ProductCard({ product }: { product: Product }) {
  const cover = product.images[0];

  return (
    <Link
      href={`/store/${product.slug}`}
      className="card group overflow-hidden transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-steel-800">
        {cover ? (
          <Image
            src={asset(cover)}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-steel-500">
            Photo coming soon
          </div>
        )}
        {!product.inStock && (
          <span className="absolute left-3 top-3 rounded bg-steel-950/80 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-steel-300">
            Sold
          </span>
        )}
        {product.category && (
          <span className="absolute right-3 top-3 rounded bg-forge-600/90 px-2 py-1 text-xs font-semibold text-white">
            {product.category}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg text-steel-50">{product.name}</h3>
        {product.tagline && (
          <p className="mt-1 line-clamp-2 text-sm text-steel-400">{product.tagline}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-medium text-forge-300">
            {product.inStock ? "Enquire for price" : "Sold"}
          </span>
          <span className="text-sm text-steel-400 group-hover:text-forge-300">
            View &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
