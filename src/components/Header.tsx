"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#experiences", label: "Experiences" },
  { href: "/#village", label: "The Village" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const scrollY = window.scrollY;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.documentElement.classList.add("menu-open");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.classList.remove("menu-open");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="page-x fixed inset-x-0 top-0 z-[200] bg-chocolate pb-3.5 pt-[calc(0.875rem+var(--header-top-inset))] sm:pb-3.5 sm:pt-[calc(0.875rem+var(--header-top-inset))] lg:pb-2 lg:pt-[calc(0.5rem+var(--header-top-inset))]">
        <div className="page-shell relative flex items-center justify-between gap-2 sm:gap-4">
          <Link
            href="/#hero"
            className="relative z-10 shrink-0"
            onClick={(event) => {
              setMenuOpen(false);
              if (window.location.pathname !== "/") return;
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Image
              src="/brand/logo.svg"
              alt="NeighbrVille"
              width={153}
              height={38}
              priority
              className="h-[36px] w-auto sm:h-[34px] lg:h-[32px]"
            />
          </Link>

          <nav
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex lg:gap-10"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-inter text-[13px] font-normal leading-[1.1] text-ivory transition-opacity hover:opacity-75"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="relative z-10 hidden min-w-0 shrink items-center gap-3 md:flex">
            <Link
              href="/?as=neighbr#join"
              className="bg-cream px-5 py-2.5 font-inter text-[13px] font-medium leading-none whitespace-nowrap text-chocolate transition-opacity hover:opacity-90 lg:px-6 lg:text-[14px]"
            >
              Join as a Neighbr
            </Link>
            <Link
              href="/?as=partner#join"
              className="border border-cream px-5 py-2.5 font-inter text-[13px] font-normal leading-none whitespace-nowrap text-cream transition-colors hover:bg-cream/10 lg:px-6 lg:text-[14px]"
            >
              Become a Partner
            </Link>
          </div>

          <button
            type="button"
            className="relative z-10 flex h-11 w-11 items-center justify-center md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="flex w-[26px] flex-col items-end gap-[7px]">
              <span
                className={`block h-[2px] w-[26px] bg-cream transition-transform duration-200 ${
                  menuOpen ? "translate-y-[9px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] bg-cream transition-all duration-200 ${
                  menuOpen ? "w-[26px] opacity-0" : "w-[15px]"
                }`}
              />
              <span
                className={`block h-[2px] w-[26px] bg-cream transition-transform duration-200 ${
                  menuOpen ? "-translate-y-[9px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        {menuOpen ? (
          <div className="fixed inset-x-0 top-[var(--header-space)] bottom-0 z-[200] overflow-y-auto border-t border-cream/15 bg-chocolate px-[var(--page-gutter-x)] pb-10 pt-7 md:hidden">
            <div className="page-shell">
              <nav className="flex flex-col gap-6" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-inter text-[22px] text-ivory"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-10 grid grid-cols-2 gap-3.5">
                <Link
                  href="/?as=neighbr#join"
                  onClick={() => setMenuOpen(false)}
                  className="bg-cream px-3.5 py-5 text-center font-inter text-[15px] font-medium leading-none text-chocolate"
                >
                  Join as a Neighbr
                </Link>
                <Link
                  href="/?as=partner#join"
                  onClick={() => setMenuOpen(false)}
                  className="border border-cream px-3.5 py-5 text-center font-inter text-[15px] font-normal leading-none text-cream"
                >
                  Become a Partner
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </header>
    </>
  );
}
