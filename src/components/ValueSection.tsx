import Image from "next/image";

export function ValueSection() {
  return (
    <section
      id="about"
      className="snap-block grid min-h-svh grid-cols-1 overflow-x-clip lg:min-h-[var(--screen)] lg:grid-cols-2 lg:items-stretch"
    >
      <div className="relative h-[42svh] min-h-[240px] lg:h-auto lg:min-h-full">
        <Image
          src="/images/sections/park-community.png"
          alt="Neighbors gathered in a circle in the park"
          fill
          className="object-cover object-center brightness-[1.12]"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      <div className="page-x relative flex min-h-[58svh] flex-col bg-cream py-8 text-chocolate lg:h-full lg:min-h-[var(--screen)] lg:px-[50px] lg:py-[50px]">
        <h2 className="relative z-10 shrink-0 font-playfair text-[clamp(1.85rem,8.4vw,2.55rem)] font-normal uppercase leading-[0.92] tracking-[-0.045em] lg:text-[length:var(--section-title)] lg:leading-[0.9]">
          <span className="block lg:hidden">
            A <span className="italic">city</span> can feel like a
          </span>
          <span className="block lg:hidden">
            <span className="italic">village</span> again
          </span>
          <span className="hidden whitespace-nowrap lg:block">
            A <span className="italic">city</span> can feel like
          </span>
          <span className="hidden whitespace-nowrap lg:block">
            a <span className="italic">village</span> again
          </span>
        </h2>

        <div
          className="relative z-[1] flex min-h-0 flex-1 items-center justify-between gap-1 font-inter text-[clamp(0.5625rem,2.55vw,0.8125rem)] uppercase tracking-[0.06em] text-chocolate sm:gap-2 sm:tracking-[0.07em] lg:gap-3 lg:pr-10 lg:text-[13px] lg:tracking-[0.08em]"
        >
          <span className="shrink-0 whitespace-nowrap">Shared interests</span>
          <span className="shrink-0" aria-hidden>/</span>
          <span className="shrink-0 whitespace-nowrap">
            Stronger communities
          </span>
        </div>

        <p className="relative z-10 mt-auto max-w-[34rem] shrink-0 font-inter text-[15px] leading-[1.35] text-chocolate lg:hidden">
          Your neighborhood is full of people doing interesting things, places
          waiting to be discovered and initiatives bringing others together
        </p>

        <p className="relative z-10 hidden max-w-[36rem] shrink-0 font-inter text-[14px] leading-[1.22] text-chocolate lg:block lg:text-[15px]">
          NeighbrVille is a platform for discovering everything your local
          community has to offer. From creative workshops and hobby groups to
          cultural events and grassroots initiatives, find things to do, people
          to meet and organizations to discover. Explore your interests, get
          involved and be part of what makes your neighborhood unique.
        </p>
      </div>
    </section>
  );
}
