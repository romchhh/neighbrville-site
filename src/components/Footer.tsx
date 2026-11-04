import Link from "next/link";
import type { ReactNode } from "react";

import { getSiteSettings } from "@/lib/admin/settings";

import { FooterWordmark } from "./FooterWordmark";

const menu = [
  { href: "/#about", label: "About" },
  { href: "/#experiences", label: "Experiences" },
  { href: "/#village", label: "The Village" },
  { href: "/#faq", label: "FAQ" },
];

const columnLabel =
  "font-inter text-[13px] font-normal uppercase leading-none tracking-[0.04em]";
const columnLink =
  "font-inter text-[15px] font-normal leading-none transition-opacity hover:opacity-70";
const columnListGap = "gap-4";
const columnTitleGap = "mt-8";

function DesktopColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="hidden h-full min-h-0 flex-col justify-start lg:flex">
      <p className={columnLabel}>{title}</p>
      {children}
    </div>
  );
}

export function Footer() {
  const settings = getSiteSettings();
  const email = settings.email || "hello@neighbrville.com";
  const socials = [
    { href: settings.socialInstagram, label: "Instagram" },
    { href: settings.socialTiktok, label: "TikTok" },
  ].filter((item) => Boolean(item.href));

  return (
    <footer className="relative z-30 snap-block isolate overflow-hidden bg-cream text-chocolate">
      <div className="page-shell page-x relative z-10 flex flex-col gap-10 py-14 lg:grid lg:min-h-[17.5rem] lg:grid-cols-[minmax(0,0.7fr)_minmax(0,0.75fr)_minmax(0,1fr)_minmax(0,2.2fr)] lg:items-stretch lg:gap-x-14 lg:py-16">
        <DesktopColumn title="Menu">
          <ul className={`${columnTitleGap} flex flex-col ${columnListGap}`}>
            {menu.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={columnLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </DesktopColumn>

        <DesktopColumn title="Socials">
          <ul className={`${columnTitleGap} flex flex-col ${columnListGap}`}>
            {socials.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={columnLink}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </DesktopColumn>

        <DesktopColumn title="Contact">
          <ul className={`${columnTitleGap} flex flex-col ${columnListGap}`}>
            <li>
              <a
                href={`mailto:${email}`}
                className={`${columnLink} whitespace-nowrap`}
              >
                {email}
              </a>
            </li>
          </ul>
        </DesktopColumn>

        <div className="hidden h-full min-h-0 flex-col justify-start lg:flex">
          <p className="-mt-[0.18em] font-playfair text-[length:var(--section-title)] font-normal not-italic uppercase leading-[0.84] tracking-[-0.045em]">
            <span className="block whitespace-nowrap">
              Find <span className="italic">your</span> people
            </span>
            <span className="block whitespace-nowrap text-right">
              feel <span className="italic">at home</span>
            </span>
          </p>
          <div className="mt-auto flex items-end justify-between gap-6 font-inter text-[13px] leading-none">
            <p>©2026 All rights reserved</p>
            <Link href="/privacy" className="transition-opacity hover:opacity-70">
              Privacy Policy
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-10 lg:hidden">
          <p className="font-playfair text-[clamp(2.5rem,10vw,3.35rem)] font-normal not-italic uppercase leading-[0.92] tracking-[-0.045em]">
            <span className="block">
              Find <span className="italic">your</span> people
            </span>
            <span className="block text-right">
              feel <span className="italic">at home</span>
            </span>
          </p>
          <div>
            <p className={columnLabel}>Socials</p>
            <ul className={`${columnTitleGap} flex flex-col ${columnListGap}`}>
              {socials.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-inter text-[13px] uppercase leading-none tracking-[0.04em] transition-opacity hover:opacity-70"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className={columnLabel}>Contact</p>
            <ul className={`${columnTitleGap} flex flex-col ${columnListGap}`}>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="font-inter text-[13px] uppercase leading-none tracking-[0.04em] transition-opacity hover:opacity-70"
                >
                  {email}
                </a>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-between gap-6 font-inter text-[12px] leading-none">
            <p>©2026 All rights reserved</p>
            <Link href="/privacy" className="transition-opacity hover:opacity-70">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      <FooterWordmark />
    </footer>
  );
}
