"use client";

import { useEffect, useState } from "react";

import { faqs } from "@/lib/faq";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const node = document.getElementById("faq");
    if (!node) return;

    const update = () => {
      const rect = node.getBoundingClientRect();
      const visible =
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      document.documentElement.classList.toggle(
        "faq-open",
        visible > window.innerHeight * 0.55,
      );
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.documentElement.classList.remove("faq-open");
    };
  }, []);

  return (
    <section
      id="faq"
      className="snap-block scroll-mt-[var(--header-space)] bg-chocolate text-cream lg:min-h-[var(--screen)]"
    >
      <div className="page-shell page-x grid grid-cols-1 gap-8 py-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-12 lg:py-24">
        <h2 className="font-playfair text-[clamp(2rem,9vw,64px)] font-normal uppercase leading-[0.9] tracking-[-0.045em] lg:sticky lg:top-[var(--header-space)] lg:self-start lg:text-[length:var(--section-title)]">
          <span className="block whitespace-nowrap">
            Frequently <span className="italic">asked</span>
          </span>
          <span className="block">questions</span>
        </h2>

        <div className="min-w-0">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={item.question} className="border-b border-ivory/30">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-3.5 text-left text-ivory lg:gap-6 lg:py-5"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="font-inter text-[12px] font-medium uppercase tracking-[0.06em] sm:text-[15px] lg:text-[18px] lg:tracking-[0.04em]">
                    {item.question}
                  </span>
                  <span
                    aria-hidden
                    className="shrink-0 font-inter text-[20px] leading-none text-ivory lg:text-[26px]"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[680px] pb-5 font-inter text-[16px] leading-[1.4] text-ivory sm:text-[18px]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
