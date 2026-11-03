import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <main className="overflow-x-clip">
      <section className="flex min-h-dvh flex-col overflow-x-clip bg-chocolate text-cream lg:min-h-[var(--screen)]">
        <Header />

        <div className="page-shell page-x flex flex-1 flex-col items-start justify-center py-16 lg:py-24">
          <p className="font-inter text-[12px] uppercase tracking-[0.18em] text-cream/70">
            Error 404
          </p>
          <h1 className="mt-5 max-w-[16ch] font-playfair text-[clamp(2.4rem,6vw,72px)] font-normal uppercase italic leading-[0.9] tracking-[-0.045em] lg:text-[clamp(2.4rem,calc(6*var(--dvw)),72px)]">
            This page got lost in the neighborhood
          </h1>
          <p className="mt-6 max-w-[36ch] font-inter text-[16px] leading-[1.35] text-cream/85 sm:text-[18px]">
            The link may be broken, or the page may have moved. Head back home
            and keep exploring NeighbrVille.
          </p>
          <Link
            href="/"
            className="mt-10 bg-cream px-5 py-3 font-inter text-[12px] font-medium uppercase tracking-[0.06em] text-chocolate transition-opacity hover:opacity-90"
          >
            Back to home
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
