"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Pose = { left: number; top: number; rotate: number };

type ExperienceCard = {
  title: string;
  meta: string;
  tag: string;
  image: string;
  alt: string;
  line: ReactNode;
  mobileLine: ReactNode;
  desktop: Pose;
  mobile: Pose;
};

const headingBase = "text-cream/60";
const headingAccent = "text-cream/85";
const headingAccentEm = "not-italic text-cream/85";
const headingItalic = "italic text-cream/85";

const cards: ExperienceCard[] = [
  {
    title: "Pottery for Beginners",
    meta: "Clay & Ceramics · Berlin",
    tag: "Beginner-friendly",
    image: "/images/experiences/pottery.png",
    alt: "Hands shaping clay on a pottery wheel",
    line: (
      <>
        Try a new <em className={headingItalic}>experience</em>,
      </>
    ),
    mobileLine: (
      <>
        Try a new <em className={headingItalic}>experience</em>,
      </>
    ),
    desktop: { left: 11.53, top: 4.6, rotate: -3.5 },
    mobile: { left: 11, top: 4.5, rotate: -5 },
  },
  {
    title: "Sunday Repair Café",
    meta: "Repair & Sustainability · London",
    tag: "Volunteer-led",
    image: "/images/experiences/repair-cafe.png",
    alt: "Neighbors repairing items together",
    line: (
      <>
        meet <em className={headingAccentEm}>your</em> people,
      </>
    ),
    mobileLine: (
      <>
        meet <em className={headingAccentEm}>your</em> neighbors,
      </>
    ),
    desktop: { left: 12.24, top: 23.02, rotate: 4.1 },
    mobile: { left: 17.9, top: 9.5, rotate: 2.5 },
  },
  {
    title: "Pasta Night with Neighbors",
    meta: "Food & Drink · London",
    tag: "Italian",
    image: "/images/experiences/pasta-night.png",
    alt: "Friends making fresh pasta together",
    line: <>see your neighborhood</>,
    mobileLine: (
      <>
        see your <em className={headingAccentEm}>community</em>
      </>
    ),
    desktop: { left: 4.27, top: 38.44, rotate: -6.4 },
    mobile: { left: 21.5, top: 17, rotate: -5.5 },
  },
  {
    title: "Neighborhood Photo Walk",
    meta: "Visual Arts · Berlin",
    tag: "Beginner-friendly",
    image: "/images/experiences/photo-walk.png",
    alt: "Friends walking through a park at sunset",
    line: <em className={headingItalic}>differently</em>,
    mobileLine: <em className={headingItalic}>differently</em>,
    desktop: { left: 12.14, top: 55.67, rotate: 4.75 },
    mobile: { left: 20.4, top: 22.5, rotate: 3 },
  },
];

const cardShadow = "shadow-[0_14px_34px_rgba(0,0,0,0.4)]";
const smoothRender =
  "[backface-visibility:hidden] [outline:1px_solid_transparent] will-change-transform";
const ctaClass =
  "text-left font-playfair italic uppercase leading-none tracking-[-0.075em] underline decoration-[1px] transition-opacity hover:opacity-80";

const marqueeItems = [
  "Libraries",
  "Studios",
  "Community Centers",
  "Makerspaces",
  "Cafés",
  "Parks",
  "Galleries",
  "Kitchens",
  "Workshops",
  "Neighborhoods",
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeOut(t: number) {
  return 1 - (1 - t) ** 3;
}

type CardMotion = {
  opacity: number;
  zIndex: number;
  pointerEvents: "auto" | "none";
  left: string;
  top: string;
  transform: string;
};

function cardStackMotion(
  index: number,
  progress: number,
  target: Pose,
  lifted: boolean,
  stack: { left: number; top: number; rotateBoost: number },
): CardMotion {
  const cursor = progress * (cards.length - 1);
  const local = cursor - index;
  const enter = clamp((local + 0.45) / 0.45, 0, 1);
  const depth = clamp(local, 0, 2.5);
  const t = easeOut(enter);

  const stackTop = stack.top + index * 2.5 - depth * 0.8;
  const left = (1 - t) * stack.left + t * target.left;
  const top = (1 - t) * stackTop + t * target.top;
  const rotate =
    (1 - t) * (target.rotate + stack.rotateBoost) +
    t * (target.rotate - depth * 0.25);
  const scale =
    ((1 - t) * 0.93 + t * Math.max(0.92, 1 - depth * 0.02)) *
    (lifted ? 1.06 : 1);

  return {
    opacity: t,
    zIndex: lifted ? 40 : index + 2,
    pointerEvents: enter > 0.35 ? "auto" : "none",
    left: `${left}%`,
    top: `${top}%`,
    transform: `rotate(${rotate}deg) scale(${scale}) translateZ(0)`,
  };
}

/** 0 at the previous line, 1 on this line, fading into the next. No step jumps. */
function lineOpacity(index: number, progress: number) {
  const cursor = progress * (cards.length - 1);
  const dist = cursor - index;
  if (dist < -0.45) return 0.2;
  const focus = 1 - Math.min(Math.abs(dist) / 0.85, 1);
  return 0.22 + focus * 0.78;
}

function headlineLineClass(
  isActive: boolean,
  isRevealed: boolean,
  canSwitchCards: boolean,
) {
  return `block w-full text-left uppercase transition-[opacity,color] duration-300 ease-out disabled:cursor-default ${
    isActive
      ? headingAccent
      : isRevealed
        ? canSwitchCards
          ? "opacity-35 active:opacity-70"
          : "opacity-35"
        : "opacity-20"
  }`;
}

function ExperienceMarquee() {
  return (
    <div
      className="experience-marquee-band relative z-10 flex w-full shrink-0 items-center overflow-x-clip overflow-y-hidden bg-chocolate lg:relative lg:z-50"
      aria-hidden
    >
      <div className="experience-marquee-track flex w-max animate-marquee items-center whitespace-nowrap will-change-transform">
        {[0, 1].map((copy) => (
          <p
            key={copy}
            className="experience-marquee-line m-0 flex items-center font-playfair text-[clamp(1.5rem,6.8vw,2.15rem)] not-italic uppercase leading-none tracking-[-0.04em] text-ivory lg:text-[clamp(1.6rem,calc(3.4*var(--dvw)),3.15rem)]"
          >
            {marqueeItems.map((item, index) => (
              <span key={`${copy}-${item}`} className="inline-flex items-center">
                <span
                  className={`px-3 sm:px-4 lg:px-5 ${index % 2 === 0 ? "not-italic" : "italic"}`}
                >
                  {item}
                </span>
                <span aria-hidden>·</span>
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}

function DesktopStack({
  progress,
  activeIndex,
  canSwitchCards,
  onHover,
}: {
  progress: number;
  activeIndex: number;
  canSwitchCards: boolean;
  onHover: (index: number | null) => void;
}) {
  return (
    <div
      className="absolute left-[45cqw] top-[4.5cqw] aspect-[850/680] w-[54.6cqw]"
    >
      {cards.map((card, index) => {
        const isActive = activeIndex === index;
        const motion = cardStackMotion(
          index,
          progress,
          card.desktop,
          isActive,
          { left: 26, top: 14, rotateBoost: index % 2 === 0 ? 10 : -10 },
        );

        return (
          <article
            key={card.title}
            className={`absolute w-[83.6%] origin-top-left bg-cream text-chocolate [container-type:inline-size] ${cardShadow} ${smoothRender} ${
              canSwitchCards && motion.opacity > 0.35
                ? "cursor-pointer"
                : "pointer-events-none"
            }`}
            style={{
              left: motion.left,
              top: motion.top,
              height: "38.62%",
              zIndex: motion.zIndex,
              opacity: motion.opacity,
              pointerEvents:
                canSwitchCards && motion.pointerEvents === "auto"
                  ? "auto"
                  : "none",
              transform: motion.transform,
            }}
            onClick={() => {
              if (canSwitchCards) onHover(index);
            }}
            onMouseEnter={() => {
              if (canSwitchCards) onHover(index);
            }}
            onMouseLeave={() => {
              if (canSwitchCards) onHover(null);
            }}
            onFocus={() => {
              if (canSwitchCards) onHover(index);
            }}
            onBlur={() => {
              if (canSwitchCards) onHover(null);
            }}
            tabIndex={canSwitchCards && motion.opacity > 0.4 ? 0 : -1}
          >
            <div className="absolute left-[3.6cqw] top-[2.2cqw] max-w-[42cqw]">
              <h3 className="font-inter text-[3.1cqw] font-semibold uppercase leading-[1.08] tracking-[-0.01em]">
                {card.title}
              </h3>
              <p className="mt-[1.8cqw] font-inter text-[1.87cqw] leading-[1.2]">
                {card.meta}
              </p>
            </div>

            <span className="absolute bottom-[2.1cqw] left-[3.6cqw] rounded-[0.45cqw] border border-chocolate px-[1cqw] py-[0.55cqw] font-inter text-[1.87cqw] leading-none">
              {card.tag}
            </span>

            <div className="absolute bottom-[2.15cqw] right-[3.38cqw] top-[2.39cqw] w-[47.7cqw] overflow-hidden">
              <Image
                src={card.image}
                alt={card.alt}
                fill
                sizes="30vw"
                className="object-cover"
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}

function MobileStack({
  progress,
  activeIndex,
  canSwitchCards,
  onActivate,
}: {
  progress: number;
  activeIndex: number;
  canSwitchCards: boolean;
  onActivate: (index: number) => void;
}) {
  return (
    <div className="relative h-full min-h-0 w-full">
      {cards.map((card, index) => {
        const isActive = activeIndex === index;
        const motion = cardStackMotion(
          index,
          progress,
          card.mobile,
          isActive,
          { left: 18, top: 22, rotateBoost: index % 2 === 0 ? 11 : -11 },
        );

        return (
          <article
            key={card.title}
            role="button"
            tabIndex={motion.pointerEvents === "auto" ? 0 : -1}
            aria-pressed={isActive}
            aria-label={card.alt}
            className={`absolute w-[74%] origin-top-left touch-manipulation overflow-visible bg-cream text-chocolate [container-type:inline-size] ${cardShadow} ${smoothRender}`}
            style={{
              left: motion.left,
              top: motion.top,
              zIndex: motion.zIndex,
              opacity: motion.opacity,
              pointerEvents:
                motion.pointerEvents === "auto" ? "auto" : "none",
              transform: motion.transform,
            }}
            onClick={() => {
              if (!canSwitchCards || motion.pointerEvents !== "auto") return;
              onActivate(index);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onActivate(index);
              }
            }}
          >
            <div className="flex flex-col px-[11cqw] pb-[9cqw] pt-[10cqw]">
              <div className="relative h-[60cqw] w-full shrink-0 overflow-hidden">
                <Image
                  src={card.image}
                  alt={isActive ? card.alt : ""}
                  fill
                  sizes="70vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-[8cqw] font-inter text-[5.6cqw] font-semibold uppercase leading-[1.08] tracking-[-0.02em]">
                {card.title}
              </h3>
              <p className="mt-[2cqw] font-inter text-[4.35cqw] leading-[1.22]">
                {card.meta}
              </p>
              <span className="mt-[6cqw] self-start rounded-[1.3cqw] border border-chocolate px-[2.8cqw] py-[1.4cqw] font-inter text-[3.9cqw] leading-none">
                {card.tag}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function ExperiencesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeMobile, setActiveMobile] = useState<number | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  const scrollIndex = reduceMotion
    ? cards.length - 1
    : Math.round(progress * (cards.length - 1));
  const storyComplete = progress >= 0.92 || scrollIndex >= cards.length - 1;
  const canSwitchCards = reduceMotion || storyComplete;
  const activeIndex = canSwitchCards ? (hovered ?? scrollIndex) : scrollIndex;
  const mobileActive = canSwitchCards
    ? (activeMobile ?? scrollIndex)
    : scrollIndex;

  useEffect(() => {
    if (!canSwitchCards && hovered !== null) setHovered(null);
  }, [canSwitchCards, hovered]);

  useEffect(() => {
    if (!canSwitchCards && activeMobile !== null) setActiveMobile(null);
  }, [canSwitchCards, activeMobile]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  // Same idea as desktop: sticky panel + scroll progress. No JS pin state.
  useEffect(() => {
    if (reduceMotion) {
      setProgress(1);
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;

    const readPinTop = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) return 0;
      const header = document.querySelector("header")?.offsetHeight;
      if (header != null && header > 0) return header;
      const space = getComputedStyle(document.documentElement).getPropertyValue(
        "--header-space",
      );
      const parsed = Number.parseFloat(space);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const pinTop = readPinTop();
      const total = Math.max(rect.height - vh, 1);
      const next =
        rect.top > pinTop
          ? 0
          : rect.bottom <= vh + 1
            ? 1
            : clamp(pinTop - rect.top, 0, total) / total;

      setProgress((current) =>
        Math.abs(current - next) < 0.002 ? current : next,
      );
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduceMotion]);

  const motionProgress = reduceMotion ? 1 : progress;

  return (
    <section
      id="experiences"
      ref={sectionRef}
      className={`relative bg-chocolate text-cream max-lg:overflow-visible lg:z-20 lg:overflow-x-clip ${
        reduceMotion ? "snap-block" : "h-[280vh] lg:h-[calc(400vh/var(--page-scale))]"
      }`}
    >
      {!reduceMotion ? (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {Array.from({ length: cards.length }, (_, index) => (
            <div
              key={index}
              className="snap-step"
              style={{ height: `${100 / cards.length}%` }}
            />
          ))}
        </div>
      ) : null}

      <span className="sr-only">
        Try a new experience, meet your people, see your neighborhood
        differently
      </span>

      <div
        className={
          reduceMotion
            ? "relative z-20 bg-chocolate lg:hidden"
            : "sticky top-[var(--header-space)] z-20 bg-chocolate lg:hidden"
        }
      >
        <div className="page-shell page-x mx-auto w-full max-w-[520px] overflow-visible [container-type:inline-size]">
          <div className="flex flex-col items-stretch overflow-visible pb-2 pt-[3svh] text-left">
            <p className="shrink-0 font-inter text-[2.56cqw] uppercase leading-none text-ivory">
              Find something that feels like you
            </p>

            <h2
              className={`relative z-20 mt-[1.6svh] w-full shrink-0 text-left font-playfair text-[7.8cqw] font-normal uppercase leading-[1.02] tracking-[-0.045em] text-cream`}
            >
              {cards.map((card, index) => {
                const isActive = mobileActive === index;

                return (
                  <button
                    key={`mobile-${card.title}`}
                    type="button"
                    disabled={!canSwitchCards}
                    className="block w-full text-left uppercase disabled:cursor-default"
                    style={{ opacity: lineOpacity(index, motionProgress) }}
                    onClick={() => {
                      if (!canSwitchCards) return;
                      setActiveMobile((current) =>
                        current === index ? null : index,
                      );
                    }}
                    aria-pressed={isActive}
                  >
                    {card.mobileLine}
                  </button>
                );
              })}
            </h2>

            <div className="relative mt-[1.5svh] h-[calc(118cqw+3.5rem)] w-full shrink-0 overflow-visible">
              <MobileStack
                progress={motionProgress}
                activeIndex={mobileActive}
                canSwitchCards={canSwitchCards}
                onActivate={(index) =>
                  setActiveMobile((current) =>
                    current === index ? null : index,
                  )
                }
              />
            </div>

            <div className="relative z-10 mt-2 flex shrink-0 flex-col items-center text-center">
              <p className="max-w-[88cqw] font-inter text-[2.9cqw] leading-[1.25] text-ivory">
                Your neighborhood is full of people doing interesting things,
                places waiting to be discovered and initiatives bringing others
                together
              </p>

              <Link
                href="/?as=neighbr#join"
                className={`mt-[3cqw] text-center text-[7.4cqw] underline-offset-[1.9cqw] ${ctaClass}`}
              >
                Join the waitlist
              </Link>
            </div>

            <div className="mt-6 shrink-0 -mx-[var(--page-gutter-x)] w-[calc(100%+2*var(--page-gutter-x))]">
              <ExperienceMarquee />
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          reduceMotion
            ? "relative hidden h-[var(--screen)] grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto] overflow-x-clip lg:grid"
            : "sticky top-0 relative hidden h-[var(--screen)] grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto] overflow-x-clip lg:grid"
        }
      >
        <p className="absolute left-[50px] top-[88px] z-20 font-inter text-[13px] font-normal uppercase leading-none text-ivory">
          Find something that feels like you
        </p>

        <h2
          className={`absolute left-[50px] top-[116px] z-20 text-left font-playfair text-[60px] font-normal uppercase leading-[0.9] tracking-[-0.07em] ${headingBase}`}
        >
          {cards.map((card, index) => {
            const isActive = activeIndex === index;
            const isRevealed = index <= scrollIndex;

            return (
              <button
                key={card.title}
                type="button"
                disabled={!canSwitchCards}
                className={`whitespace-nowrap ${headlineLineClass(
                  isActive,
                  isRevealed,
                  canSwitchCards,
                )}`}
                onMouseEnter={() => {
                  if (canSwitchCards) setHovered(index);
                }}
                onMouseLeave={() => {
                  if (canSwitchCards) setHovered(null);
                }}
                onFocus={() => {
                  if (canSwitchCards) setHovered(index);
                }}
                onBlur={() => {
                  if (canSwitchCards) setHovered(null);
                }}
                onClick={() => {
                  if (!canSwitchCards) return;
                  setHovered((current) => (current === index ? null : index));
                }}
                aria-pressed={isActive}
              >
                {card.line}
              </button>
            );
          })}
        </h2>

        <div className="page-shell relative z-0 w-full self-start overflow-visible pb-[calc(clamp(2rem,5vh,3.5rem)/var(--page-scale))] [container-type:inline-size]">
          <div className="relative" style={{ height: "max(50.5cqw, 580px)" }}>
            <DesktopStack
              progress={motionProgress}
              activeIndex={activeIndex}
              canSwitchCards={canSwitchCards}
              onHover={setHovered}
            />
            <div className="absolute bottom-6 left-[50px] z-20">
              <p className="max-w-[28rem] font-inter text-[15px] font-normal leading-[1.2] text-ivory">
                Discover events in different languages, practice a new language,
                explore another culture, and learn through experience — all
                without leaving your city
              </p>
              <Link
                href="/?as=neighbr#join"
                className={`mt-3 inline-block text-[28px] underline-offset-[6px] ${ctaClass}`}
                onClick={() => {
                  document.documentElement.classList.add("join-open");
                }}
              >
                Join the waitlist
              </Link>
            </div>
          </div>
        </div>

        <div aria-hidden className="min-h-0" />

        <div className="relative z-30 min-w-0 self-end isolation-isolate">
          <ExperienceMarquee />
        </div>
      </div>
    </section>
  );
}
