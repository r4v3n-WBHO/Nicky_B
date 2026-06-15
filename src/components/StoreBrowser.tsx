"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/content";

/**
 * Client-side category filter for the in-stock products grid. Receives the
 * (serializable) product and category data from the server page.
 */
export default function StoreBrowser({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const [active, setActive] = useState<string>("All");

  // Only show category chips that actually have in-stock products.
  const usable = useMemo(() => {
    const present = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...categories.filter((c) => present.has(c))];
  }, [products, categories]);

  const filtered = useMemo(
    () => (active === "All" ? products : products.filter((p) => p.category === active)),
    [active, products],
  );

  return (
    <div>
      {usable.length > 2 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {usable.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                active === c
                  ? "border-forge-500 bg-forge-600 text-white"
                  : "border-steel-700 bg-steel-900/60 text-steel-300 hover:border-steel-500 hover:text-steel-100"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-steel-400">No knives in this category right now.</p>
      )}
    </div>
  );
}
