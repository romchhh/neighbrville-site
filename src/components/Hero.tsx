"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { imageBlur } from "@/lib/image-blur";

/*
  Desktop: `lift` and `ml` are fractions of the polaroid width (--pw),
  so the whole row scales together with the section.
*/
const polaroids = [
  {
    src: "/images/hero/polaroid-03.webp",
    alt: "Neighbors grilling together outdoors",
    rotate: -14,
    lift: 0.004,
    ml: 0,
    zIndex: 1,
  },
  {
    src: "/images/hero/polaroid-05.webp",
    alt: "Friends gathered in a living room",
    rotate: -5,
    lift: 0,
    ml: 0.1,
    zIndex: 4,
  },
  {
    src: "/images/hero/polaroid-02.webp",
    alt: "Neighbors embracing at a gathering",
    rotate: 3,
    lift: 0.081,
    ml: -0.028,
    zIndex: 2,
  },
  {
    src: "/images/hero/polaroid-01.webp",
    alt: "Friends talking around a picnic table",
    rotate: 7,
    lift: 0.064,
    ml: -0.15,
    zIndex: 5,
  },
  {
    src: "/images/hero/polaroid-04.webp",
    alt: "Hands shaping clay on a pottery wheel",
    rotate: 10,
    lift: -0.162,
    ml: -0.13,
    zIndex: 3,
  },
];

const mobilePolaroids = [
  {
    src: "/images/hero/polaroid-03.webp",
    alt: "Neighbors grilling together outdoors",
    className: "left-[5%] top-[8.6%] w-[30.8%]",
    rotate: -12,
    zIndex: 1,
  },
  {
    src: "/images/hero/polaroid-05.webp",
    alt: "Friends gathered in a living room",
    className: "left-[33.5%] top-[1.2%] w-[31%]",
    rotate: 2,
    zIndex: 2,
  },
  {
    src: "/images/hero/polaroid-01.webp",
    alt: "Friends talking around a picnic table",
    className: "left-[62.5%] top-[10%] w-[30.8%]",
    rotate: 12,
    zIndex: 3,
  },
  {
    src: "/images/hero/polaroid-02.webp",
    alt: "Neighbors embracing at a gathering",
    className: "left-[18%] top-[41%] w-[35%]",
    rotate: -9,
    zIndex: 10,
  },
  {
    src: "/images/hero/polaroid-04.webp",
    alt: "Hands shaping clay on a pottery wheel",
    className: "left-[47.5%] top-[42%] w-[35%]",
    rotate: 7,
    zIndex: 11,
  },
];

function PolaroidFrame({
  src,
  alt,
  priority = false,
  sizes,
  compact = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`bg-white shadow-[0_10px_18px_rgba(0,0,0,0.28)] ${
        compact
          ? "px-[5px] pt-[5px] pb-[22px]"
          : "p-2 pb-8 lg:p-[10px] lg:pb-11"
      }`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[#ece7df]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={72}
          className="object-cover"
          priority={priority}
          placeholder={imageBlur[src] ? "blur" : "empty"}
          blurDataURL={imageBlur[src]}
        />
      </div>
    </div>
  );
}

export function Hero() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeMobile, setActiveMobile] = useState<number | null>(null);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* ───────────── Mobile ───────────── */}
      {/* Header space already lives in #hero — keep only a tight top gap here
          so the whole composition fits one svh. */}
      <div className="page-x flex min-h-0 flex-1 flex-col justify-between overflow-visible pb-6 pt-2 lg:hidden">
        <div className="page-shell flex min-h-0 flex-1 flex-col justify-between overflow-visible">
          {/* Headline + photos share one flex slot so justify-between
              can't stretch the gap between them. */}
          <div className="relative isolate shrink-0">
            <h1 className="hero-mobile-headline relative z-30 bg-chocolate text-left font-playfair text-[clamp(2.35rem,9.6vw,3.1rem)] font-normal uppercase leading-[0.86] tracking-[-0.055em] text-cream max-[740px]:pb-0.5">
              <span className="block whitespace-nowrap">
                Become an <span className="italic">active</span>
              </span>
              <span className="flex items-end justify-between gap-2">
                <span>participant</span>
                <span className="shrink-0 pb-[0.08em] text-right font-inter text-[11px] font-normal normal-case leading-none tracking-[0.01em] text-ivory">
                  Launching Early 2027
                </span>
              </span>
            </h1>

            <div
              className={`relative left-1/2 mt-1 aspect-[312/220] w-screen max-w-[440px] -translate-x-1/2 overflow-visible ${
                activeMobile !== null ? "z-30" : "z-10"
              }`}
            >
              {mobilePolaroids.map((photo, index) => {
                const isActive = activeMobile === index;

                return (
                  <button
                    key={photo.src}
                    type="button"
                    aria-label={photo.alt}
                    className={`absolute origin-center touch-manipulation transition-transform duration-300 ease-out ${photo.className}`}
                    style={{
                      zIndex: isActive ? 50 : photo.zIndex,
                      transform: `rotate(${photo.rotate}deg) scale(${isActive ? 1.24 : 1})`,
                    }}
                    aria-pressed={isActive}
                    onClick={() =>
                      setActiveMobile((current) =>
                        current === index ? null : index,
                      )
                    }
                  >
                    <PolaroidFrame
                      src={photo.src}
                      alt=""
                      priority={index < 2}
                      sizes="(max-width: 440px) 46vw, 200px"
                      compact
                    />
                  </button>
                  );
                })}
            </div>

            <p className="relative z-20 mt-[clamp(5px,1.45vw,8px)] bg-chocolate pt-px text-right font-playfair text-[clamp(2.35rem,9.6vw,3.1rem)] font-normal uppercase leading-[0.86] tracking-[-0.055em] text-cream">
              <span className="block translate-x-2.5 whitespace-nowrap">
                <span className="italic">In</span> your local
              </span>
              <span className="mt-0.5 flex items-end justify-between">
                <span className="shrink-0 pb-[0.08em] font-inter text-[11px] font-normal normal-case leading-none tracking-[0.01em] text-ivory">
                  London &amp; Berlin
                </span>
                <span className="translate-x-2.5 italic">community</span>
              </span>
            </p>
          </div>

          <div className="mt-auto flex shrink-0 flex-col items-center pt-6">
            <p className="w-full max-w-[36ch] text-center font-inter text-[14px] leading-[1.26] text-ivory">
              Your neighborhood is full of places, people,
              <br />
              and initiatives to discover
            </p>
            <p className="mt-1 text-center font-inter text-[11px] font-medium uppercase tracking-[0.03em] text-ivory">
              NeighbrVille helps you find them
            </p>

            <div className="mt-3 grid w-full grid-cols-2 gap-3.5">
              <Link
                href="/?as=neighbr#join"
                className="bg-cream px-3.5 py-[1.3125rem] text-center font-inter text-[16px] font-medium leading-none text-chocolate transition-opacity hover:opacity-90"
              >
                Join as a Neighbr
              </Link>
              <Link
                href="/?as=partner#join"
                className="border border-cream px-3.5 py-[1.3125rem] text-center font-inter text-[16px] font-normal leading-none text-cream transition-colors hover:bg-cream/10"
              >
                Become a Partner
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────── Desktop ───────────── */}
      <div className="relative hidden min-h-0 w-full flex-1 lg:block">
        {/* Match Header: page-x outside, page-shell inside — side copy aligns
            with logo (left) and Join button (right). */}
        <div className="absolute inset-0 page-x">
          <div className="page-shell relative mx-auto h-full [--pw:clamp(178px,calc(14.4*var(--dvw)),244px)]">
            <p className="absolute left-0 top-[22%] -translate-y-1/2 whitespace-nowrap text-left font-inter text-[15px] leading-[1.28] text-ivory">
              Your neighborhood is full of places,
              <br />
              people, and initiatives to discover
            </p>

            <h1 className="absolute left-1/2 top-[22%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center font-playfair text-[length:var(--hero-title)] font-normal uppercase leading-[0.9] tracking-[-0.07em] text-cream">
              <span className="block">
                Become an <span className="italic">active</span>
              </span>
              <span className="block">
                participant <span className="italic">in</span> your local
              </span>
              <span className="block italic">community</span>
            </h1>

            <p className="absolute right-0 top-[22%] -translate-y-1/2 whitespace-nowrap text-right font-inter text-[15px] leading-[1.28] text-ivory">
              NeighbrVille helps you find them,
              <br />
              connect, and build community
            </p>

            <div className="absolute inset-x-0 top-[56%] z-10 flex -translate-y-1/2 items-center justify-center">
              {polaroids.map((photo, index) => {
                const isHovered = hovered === index;

                return (
                  <div
                    key={photo.src}
                    className="relative w-[var(--pw)] shrink-0 cursor-pointer transition-[transform,filter] duration-300 ease-out"
                    style={{
                      marginLeft: `calc(var(--pw) * ${photo.ml})`,
                      zIndex: isHovered ? 50 : photo.zIndex,
                      transform: `translateY(calc(var(--pw) * ${photo.lift} - ${isHovered ? 10 : 0}px)) rotate(${photo.rotate}deg) scale(${isHovered ? 1.1 : 1})`,
                    }}
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(index)}
                    onBlur={() => setHovered(null)}
                    tabIndex={0}
                  >
                    <div
                      className={`bg-white p-2 pb-8 transition-shadow duration-300 lg:p-[10px] lg:pb-11 ${
                        isHovered
                          ? "shadow-[0_24px_48px_rgba(0,0,0,0.45)]"
                          : "shadow-[0_16px_34px_rgba(0,0,0,0.32)]"
                      }`}
                    >
                      <div className="relative aspect-square w-full overflow-hidden bg-[#ece7df]">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes="(max-width: 1280px) 240px, 312px"
                          quality={72}
                          className={`object-cover transition-transform duration-300 ease-out ${
                            isHovered ? "scale-105" : "scale-100"
                          }`}
                          priority={index < 2}
                          placeholder={imageBlur[photo.src] ? "blur" : "empty"}
                          blurDataURL={imageBlur[photo.src]}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="absolute inset-x-0 bottom-[50px] z-20 text-center">
              <p className="font-inter text-[12px] leading-[1.1] text-ivory lg:text-[13px]">
                Launching Early 2027 · London &amp; Berlin
              </p>
              <p className="mt-4 font-inter text-[11px] font-medium uppercase leading-[1.1] tracking-[0.04em] text-ivory lg:text-[12px] lg:tracking-[0.05em]">
                Free to join. No commitment required
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}