/** Raw PNG as uploaded — no Next/Image, no CSS filters. Filename bumps bust cache. */
const parkSrc = "/images/sections/about-gathering-v2.png";

export function ValueSection() {
  return (
    <section
      id="about"
      className="snap-block grid min-h-svh grid-cols-1 overflow-x-clip lg:min-h-[var(--screen)] lg:grid-cols-2 lg:items-stretch"
    >
      <div className="relative h-[42svh] min-h-[240px] bg-chocolate lg:h-auto lg:min-h-full">
        {/* eslint-disable-next-line @next/next/no-img-element -- keep original PNG unprocessed */}
        <img
          src={parkSrc}
          alt="Neighbors gathered in a circle in the park"
          className="absolute inset-0 h-full w-full object-cover object-center"
          decoding="async"
          fetchPriority="low"
          style={{ filter: "none" }}
        />
      </div>

      {/* Desktop: pl 50px from photo split; pr = page gutter so right
          subtitle lines up with header Join buttons (same as Hero). */}
      <div className="page-x relative flex min-h-[58svh] flex-col bg-cream py-8 text-chocolate lg:h-full lg:min-h-[var(--screen)] lg:pl-[50px] lg:py-[50px]">
        <h2 className="relative z-10 shrink-0 font-playfair text-[clamp(1.85rem,8.4vw,2.55rem)] font-normal uppercase leading-[0.92] tracking-[-0.045em] lg:text-[length:var(--section-title)] lg:leading-[0.9]">
          {/* Mobile: “A” of “a village” starts the second line */}
          <span className="block lg:hidden">
            A <span className="italic">city</span> can feel like
          </span>
          <span className="block lg:hidden">
            a <span className="italic">village</span> again
          </span>
          <span className="hidden whitespace-nowrap lg:block">
            A <span className="italic">city</span> can feel like
          </span>
          <span className="hidden whitespace-nowrap lg:block">
            a <span className="italic">village</span> again
          </span>
        </h2>

        <div className="relative z-[1] flex min-h-0 flex-1 items-center justify-between gap-1.5 font-inter text-[clamp(0.5rem,2.35vw,0.8125rem)] uppercase leading-[1.25] tracking-[0.01em] text-chocolate sm:gap-3 sm:tracking-[0.03em] lg:gap-4 lg:text-[13px] lg:tracking-[0.02em]">
          <span className="min-w-0 max-w-[46%] shrink text-left">
            <span className="block whitespace-nowrap">We live closer together</span>
            <span className="block whitespace-nowrap">than ever</span>
          </span>
          <span className="shrink-0 px-0.5" aria-hidden>
            |
          </span>
          <span className="min-w-0 max-w-[50%] shrink text-right">
            <span className="block whitespace-nowrap">
              yet many of us feel more
            </span>
            <span className="block whitespace-nowrap">
              disconnected than before
            </span>
          </span>
        </div>

        {/* Mobile: original shorter copy, natural wrap */}
        <p className="relative z-10 mt-auto max-w-[34rem] shrink-0 font-inter text-[14px] leading-[1.35] text-chocolate lg:hidden">
          NeighbrVille is a platform for discovering what your local community
          has to offer. From workshops and hobby groups to cultural events and
          local initiatives, find things to do, people to meet and ways to get
          involved
        </p>

        {/* Desktop: full copy in exactly 5 lines */}
        <p className="relative z-10 mt-auto hidden max-w-[36rem] shrink-0 font-inter text-[14px] leading-[1.22] text-chocolate lg:block">
          NeighbrVille is a platform for discovering everything your local
          <br />
          community has to offer. From creative workshops and hobby groups
          <br />
          to cultural events and grassroots initiatives, find things to do, people
          <br />
          to meet and organizations to discover. Explore your interests, get
          <br />
          involved and be part of what makes your neighborhood unique.
        </p>
      </div>
    </section>
  );
}
