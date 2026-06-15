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
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)} aria-label={site.name}>
          <Image
            src={asset("/nicky_b_logo_white.png")}
            alt={site.name}
            width={243}
            height={208}
            className="h-12 w-auto sm:h-14"
            priority
          />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <nav className="flex items-center gap-1">
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
          <a
            href={`tel:${site.phoneHref}`}
            className="btn-primary ml-2 px-3 py-2 lg:px-4"
            aria-label={`Call ${site.phone}`}
          >
            <PhoneIcon />
            <span className="hidden lg:inline">{site.phone}</span>
          </a>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <a
            href={`tel:${site.phoneHref}`}
            aria-label={`Call ${site.phone}`}
            className="inline-flex items-center gap-1.5 rounded-md bg-forge-600 px-3 py-2 text-sm font-semibold text-white hover:bg-forge-500"
          >
            <PhoneIcon />
            Call
          </a>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-steel-200 hover:bg-steel-800"
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
            <a
              href={`tel:${site.phoneHref}`}
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 justify-center"
            >
              <PhoneIcon />
              Call {site.phone}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
