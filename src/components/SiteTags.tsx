"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

import {
  COOKIE_CONSENT_EVENT,
  hasAnalyticsConsent,
  type CookieConsentState,
} from "@/lib/cookie-consent";

type MarketingIds = {
  gtmId: string;
  gaId: string;
  adsId: string;
};

function useAnalyticsAllowed() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(hasAnalyticsConsent());

    function onConsent(event: Event) {
      const detail = (event as CustomEvent<CookieConsentState>).detail;
      setAllowed(detail?.choice === "accepted");
    }

    window.addEventListener(COOKIE_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
  }, []);

  return allowed;
}

/** Loads GTM / gtag only after the visitor accepts analytics cookies. */
export function SiteTags({ gtmId, gaId, adsId }: MarketingIds) {
  const allowed = useAnalyticsAllowed();
  const gtm = gtmId.trim();
  const ga = gaId.trim();
  const ads = adsId.trim();

  if (!allowed) return null;

  return (
    <>
      {gtm ? (
        <Script id="gtm-loader" strategy="afterInteractive">{`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtm}');
        `}</Script>
      ) : null}

      {ga || ads ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga || ads}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${ga ? `gtag('config', '${ga}');` : ""}
${ads ? `gtag('config', '${ads}');` : ""}
          `}</Script>
        </>
      ) : null}
    </>
  );
}
