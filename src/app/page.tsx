import dynamic from "next/dynamic";

import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MobileSectionSnap } from "@/components/MobileSectionSnap";
import { JsonLd, faqJsonLd } from "@/components/JsonLd";
import { ValueSection } from "@/components/ValueSection";
import { faqs } from "@/lib/faq";

const ExperiencesSection = dynamic(
  () =>
    import("@/components/ExperiencesSection").then((mod) => mod.ExperiencesSection),
  { ssr: true },
);

const CommunitySection = dynamic(
  () =>
    import("@/components/CommunitySection").then((mod) => mod.CommunitySection),
  { ssr: true },
);

const JoinSection = dynamic(
  () => import("@/components/JoinSection").then((mod) => mod.JoinSection),
  { ssr: true },
);

export default function Home() {
  return (
    <>
      {/* Outside overflow-clip so position:fixed stays viewport-bound site-wide */}
      <Header />
      <MobileSectionSnap />
      <main className="overflow-x-clip">
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-cream focus:px-4 focus:py-2 focus:text-chocolate"
        >
          Skip to content
        </a>
        <JsonLd data={faqJsonLd([...faqs])} />
        <section
          id="hero"
          className="snap-block flex min-h-svh flex-col overflow-y-visible bg-chocolate max-lg:overflow-x-visible lg:min-h-[var(--screen)] lg:overflow-x-clip"
        >
          {/* In-flow header space, inside the snap so the first screen is exactly one viewport */}
          <div
            className="shrink-0 max-lg:h-[var(--header-space)] lg:py-2"
            aria-hidden
          >
            <div className="hidden h-[32px] lg:block" />
          </div>
          <Hero />
        </section>
        <ValueSection />
        <ExperiencesSection />
        <CommunitySection />
        <JoinSection />
        <FaqSection />
        <Footer />
      </main>
    </>
  );
}
