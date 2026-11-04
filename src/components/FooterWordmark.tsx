"use client";

import { useLayoutEffect, useRef, useState } from "react";

const MAX_FONT_PX = 299.28;

export function FooterWordmark() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [fontSizePx, setFontSizePx] = useState<number | null>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const text = textRef.current;
    if (!wrap || !text) return;

    let frame = 0;

    const fit = () => {
      const maxWidth = wrap.clientWidth;
      if (!maxWidth) return;

      let lo = 12;
      let hi = MAX_FONT_PX;

      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        text.style.fontSize = `${mid}px`;
        if (text.scrollWidth <= maxWidth) lo = mid;
        else hi = mid - 1;
      }

      text.style.fontSize = `${lo}px`;
      setFontSizePx((current) => (current === lo ? current : lo));
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    };

    fit();
    if (document.fonts?.ready) {
      void document.fonts.ready.then(schedule);
    }

    const observer = new ResizeObserver(schedule);
    observer.observe(wrap);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative z-10 -mt-1 w-full pb-[env(safe-area-inset-bottom,0px)] lg:mt-0"
    >
      <p
        ref={textRef}
        aria-label="Neighbrville"
        className="footer-wordmark-text block w-max max-w-full whitespace-nowrap font-playfair font-normal uppercase italic leading-none tracking-[-0.07em] text-chocolate"
        style={{
          fontSize: fontSizePx ? `${fontSizePx}px` : "min(299.28px, 48vw)",
        }}
      >
        NEIGHBRVILLE
      </p>
    </div>
  );
}
