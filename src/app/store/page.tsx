import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import StoreBrowser from "@/components/StoreBrowser";
import TrustInfo from "@/components/TrustInfo";
import { getProducts, getCategories, getInfo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Store",
  description: "Hand-made knives currently available to buy from Nicky Badenhorst.",
};

export default function StorePage() {
  const products = getProducts();
  const categories = getCategories().map((c) => c.name);
  const info = getInfo();
  const available = products.filter((p) => p.inStock);
  const sold = products.filter((p) => !p.inStock);

  return (
    <div className="container-px py-10 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="font-serif text-3xl text-steel-50 sm:text-4xl">Store</h1>
        <p className="mt-3 text-steel-300">
          Each piece is hand-made and one-of-a-kind — once it&apos;s gone, it&apos;s
          gone. <span className="text-steel-200">Prices are on enquiry</span>: message
          Nicky for the price and to arrange payment &amp; delivery. Looking for
          something specific?{" "}
          <Link href="/custom" className="text-forge-300 hover:underline">
            Order a custom knife.
          </Link>
        </p>
        <TrustInfo className="mt-4" lines={[info.payments, info.guarantee]} />
      </header>

      {available.length > 0 ? (
        <StoreBrowser products={available} categories={categories} />
      ) : (
        <div className="card mt-10 p-8 text-center text-steel-300">
          <p>Nothing in stock right now — but new pieces are added regularly.</p>
          <Link href="/custom" className="btn-primary mt-4">Commission a knife</Link>
        </div>
      )}

      {sold.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-xl text-steel-300">Recently sold</h2>
          <p className="mt-1 text-sm text-steel-500">
            Sold pieces — a similar one can be made to order.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 opacity-70 sm:gap-6 lg:grid-cols-3">
            {sold.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
