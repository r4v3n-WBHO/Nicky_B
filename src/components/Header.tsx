"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";

const nav = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "The Work" },
  { href: "/store", label: "Store" },
  { href: "/custom", label: "Custom Order" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-steel-800 bg-steel-950/85 backdrop-blur">
      <div className="container-px flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="rounded bg-white p-1">
            <Image
              src={asset("/nicky_b_logo.jpg")}
              alt={site.name}
              width={44}
              height={44}
              className="h-9 w-auto"
              priority
            />
          </span>
          <span className="hidden font-serif text-lg tracking-wide text-steel-50 sm:block">
            {site.shortName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-steel-800 text-forge-300"
                  : "text-steel-300 hover:bg-steel-800/60 hover:text-steel-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-steel-200 hover:bg-steel-800 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-steel-800 bg-steel-950 md:hidden">
          <div className="container-px flex flex-col py-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2.5 text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-steel-800 text-forge-300"
                    : "text-steel-300 hover:bg-steel-800/60"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
