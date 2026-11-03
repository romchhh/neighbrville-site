"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";

const photos = [
  {
    src: "/images/community/library.png",
    alt: "Sunlit neighborhood bookshop",
    box: { left: "2.8%", top: "20.4%", width: "12%", height: "19.1%" },
  },
  {
    src: "/images/community/circle.png",
    alt: "Neighbors sitting together in a circle",
    box: { left: "24.4%", top: "11.6%", width: "12.8%", height: "14.2%" },
  },
  {
    src: "/images/community/watercolor.png",
    alt: "Hands painting with watercolors",
    box: { left: "52.9%", top: "8.6%", width: "14.5%", height: "12.6%" },
  },
  {
    src: "/images/community/workshop.png",
    alt: "People gathered around a workshop table",
    box: { left: "80.3%", top: "16.8%", width: "11.1%", height: "18%" },
  },
  {
    src: "/images/community/performance.png",
    alt: "A neighbor performing on a rug",
    box: { left: "9.6%", top: "53.3%", width: "8.9%", height: "18.3%" },
  },
  {
    src: "/images/community/books.png",
    alt: "Stacks of books on a wooden table",
    box: { left: "85.3%", top: "47.7%", width: "11.7%", height: "19.4%" },
  },
  {
    src: "/images/community/makers.png",
    alt: "A shared makers table under pendant lamps",
    box: { left: "25%", top: "70.1%", width: "14.6%", height: "12%" },
  },
  {
    src: "/images/community/pottery.png",
    alt: "Hands shaping a clay pot",
    box: { left: "52.5%", top: "63.5%", width: "9.1%", height: "15.8%" },
  },
  {
    src: "/images/community/repair.png",
    alt: "Neighbors repairing things together",
    box: { left: "72.6%", top: "74.3%", width: "12.4%", height: "10.5%" },
  },
];

function InteractivePhoto({
  src,
  alt,
  className,
  style,
  sizes = "280px",
  shadow = "shadow-[0_14px_30px_rgba(0,0,0,0.28)]",
}: {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
  shadow?: string;
}) {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const lifted = active || hovered;

  return (
    <button
      type="button"
      className={`absolute overflow-hidden bg-[#3a2416] transition-transform duration-300 ease-out ${shadow} ${className ?? ""}`}
      style={{
        ...style,
        zIndex: lifted ? 40 : 1,
        transform: lifted ? "scale(1.22)" : "scale(1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={() => setActive((open) => !open)}
      aria-pressed={active}
      aria-label={alt}
    >
      <Image src={src} alt="" fill sizes={sizes} className="object-cover" />
    </button>
  );
}

export function CommunitySection() {
  return (
    <section
      id="village"
      className="relative snap-block overflow-x-clip bg-chocolate text-cream lg:relative lg:z-10 lg:scroll-mt-8"
    >
      <div className="page-shell page-x hidden lg:block lg:pt-44">
        <div className="relative aspect-[1440/860] w-full overflow-hidden lg:overflow-visible">
          {photos.map((photo) => (
            <InteractivePhoto
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              style={photo.box}
            />
          ))}

          <div className="pointer-events-none absolute inset-x-[10%] top-[32.4%] z-10 text-center">
            <p className="font-inter text-[12px] font-normal uppercase tracking-[0.24em] text-ivory">
              Built by the neighborhood
            </p>

            <h2 className="mx-auto mt-6 max-w-[1000px] font-playfair text-[length:var(--section-title)] font-normal uppercase leading-[0.9] tracking-[-0.045em]">
              <span className="block whitespace-nowrap">
                Everything your <span className="italic font-normal">community</span>
              </span>
              <span className="block whitespace-nowrap">
                <span className="italic font-normal">has to</span> offer in{" "}
                <span className="italic font-normal text-cream/40">one place</span>
              </span>
            </h2>

            <p className="mt-7 whitespace-nowrap font-inter text-[13px] font-normal uppercase tracking-[0.06em] text-ivory">
              You offer events, spaces, programs, or something else entirely?
            </p>

            <p className="mx-auto mt-1 max-w-[470px] font-inter text-[14px] font-normal leading-[1.35] text-ivory">
              NeighbrVille helps more people discover it! Whether you host events
              or contribute to your local life in broader ways, you belong here
            </p>
          </div>

          <Link
            href="/?as=partner#join"
            onClick={() => {
              document.documentElement.classList.add("join-open");
            }}
            className="absolute bottom-[9.4%] left-1/2 z-30 -translate-x-1/2 font-playfair text-[clamp(1.35rem,calc(1.7*var(--dvw)),1.85rem)] font-normal italic uppercase leading-none tracking-[-0.03em] underline decoration-[1px] underline-offset-[7px] transition-opacity hover:opacity-80"
          >
            Become a partner
          </Link>
        </div>
      </div>

      <div className="overflow-x-clip pb-10 pt-6 lg:hidden">
        {/* Top photo cluster — reserved height so absolute photos can't
            collide with the copy below even when they scale up. */}
        <div className="relative z-0 mx-auto aspect-[440/240] w-full max-w-[440px]">
          {[
            {
              src: "/images/community/circle.png",
              alt: "Neighbors sitting together in a circle",
              className: "left-[22.7%] top-[0%] w-[26.1%] aspect-[3/2]",
            },
            {
              src: "/images/community/workshop.png",
              alt: "People gathered around a workshop table",
              className: "left-[76.4%] top-[6%] w-[20%] aspect-square",
            },
            {
              src: "/images/community/library.png",
              alt: "Sunlit neighborhood bookshop",
              className: "left-0 top-[36%] w-[21.8%] aspect-[96/93]",
            },
            {
              src: "/images/community/watercolor.png",
              alt: "Hands painting with watercolors",
              className: "left-[53.4%] top-[52%] w-[27.5%] aspect-[121/63]",
            },
          ].map((photo) => (
            <InteractivePhoto
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              className={photo.className}
              sizes="180px"
              shadow="shadow-[0_12px_24px_rgba(0,0,0,0.28)]"
            />
          ))}
        </div>

        <div className="page-x relative z-10 mx-auto mt-8 max-w-[420px] text-center">
          <p className="font-inter text-[11px] font-normal uppercase tracking-[0.18em] text-ivory">
            Built by the neighborhood
          </p>
          <h2 className="mt-5 font-playfair text-[clamp(1.7rem,7.6vw,2.35rem)] font-normal uppercase leading-[0.95] tracking-[-0.04em]">
            <span className="block">Everything your</span>
            <span className="block">
              community <span className="italic font-normal">has to</span>
            </span>
            <span className="block">
              offer in <span className="italic font-normal text-cream/40">one place</span>
            </span>
          </h2>
          <p className="mx-auto mt-6 whitespace-nowrap font-inter text-[clamp(9px,2.8vw,11px)] font-normal uppercase leading-none tracking-[0.02em] text-ivory">
            Have events, spaces, or programs to offer?
          </p>
          <p className="mx-auto mt-2 max-w-[360px] font-inter text-[13px] font-normal leading-[1.35] text-ivory">
            NeighbrVille helps more people discover it! Whether you host events
            or contribute to your local life in broader ways, you belong here
          </p>
        </div>

        {/* Bottom photo cluster — starts below the copy, with its own
            reserved frame so these photos never climb into the text. */}
        <div className="relative z-0 mx-auto mt-12 aspect-[440/300] w-full max-w-[440px]">
          {[
            {
              src: "/images/community/performance.png",
              alt: "A neighbor performing on a rug",
              className: "left-[4.5%] top-[4%] w-[17.3%] aspect-[4/5]",
            },
            {
              src: "/images/community/pottery.png",
              alt: "Hands shaping a clay pot",
              className: "left-[36.6%] top-[30%] w-[18%] aspect-square",
            },
            {
              src: "/images/community/repair.png",
              alt: "Neighbors repairing things together",
              className: "left-[67.5%] top-[12%] w-[33.6%] aspect-[37/20]",
            },
            {
              src: "/images/community/makers.png",
              alt: "A shared makers table under pendant lamps",
              className: "left-0 top-[68%] w-[38.4%] aspect-[2/1]",
            },
            {
              src: "/images/community/books.png",
              alt: "Stacks of books on a wooden table",
              className: "left-[70.9%] top-[60%] w-[19.5%] aspect-square",
            },
          ].map((photo) => (
            <InteractivePhoto
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              className={photo.className}
              sizes="200px"
              shadow="shadow-[0_12px_24px_rgba(0,0,0,0.28)]"
            />
          ))}
        </div>

        <div className="page-x relative z-10 mt-8 text-center">
          <Link
            href="/?as=partner#join"
            onClick={() => {
              document.documentElement.classList.add("join-open");
            }}
            className="font-playfair text-[clamp(1.7rem,7vw,2.1rem)] font-normal italic uppercase leading-none tracking-[-0.03em] underline decoration-[1px] underline-offset-[7px]"
          >
            Become a partner
          </Link>
        </div>
      </div>
    </section>
  );
}