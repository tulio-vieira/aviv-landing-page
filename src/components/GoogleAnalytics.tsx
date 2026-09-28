"use client";

import Script from "next/script";
import { useEffect } from "react";
import { environmentConfig } from "@/config/environment";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Loads the GA4 tag (gtag.js) when the current environment has a Measurement ID, and reports
 * clicks on any element marked with `data-analytics-event` as a GA event, e.g.:
 *
 *   <a href="..." data-analytics-event="contact_whatsapp" data-analytics-section="contato">
 *
 * A single delegated listener keeps the tracked components free of client-side code.
 */
export function GoogleAnalytics() {
  const gaId = environmentConfig.gaMeasurementId;

  useEffect(() => {
    if (!gaId) return;

    function handleClick(event: MouseEvent) {
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-analytics-event]");
      if (!target) return;
      window.gtag?.("event", target.dataset.analyticsEvent, {
        section: target.dataset.analyticsSection,
      });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [gaId]);

  if (!gaId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
