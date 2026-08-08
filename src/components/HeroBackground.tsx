"use client";

import { useSyncExternalStore } from "react";
import { withBasePath } from "@/config/environment";
import { useAfterInitialLoad } from "@/hooks/useAfterInitialLoad";
import { useSlowConnection } from "@/hooks/useSlowConnection";

function subscribeReducedMotion(onChange: () => void) {
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  motionQuery.addEventListener("change", onChange);
  return () => motionQuery.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot() {
  return false;
}

export function HeroBackground() {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerSnapshot
  );
  const isSlowConnection = useSlowConnection();
  const afterInitialLoad = useAfterInitialLoad();

  // Poster loads first for everyone; video only takes over once eligible
  // (motion/connection preferences) and the initial page load has settled.
  const shouldPlayVideo = !prefersReducedMotion && !isSlowConnection && afterInitialLoad;

  return (
    <div className="absolute inset-0">
      {shouldPlayVideo ? (
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={withBasePath("/images/hero-poster.webp")}
        >
          <source src={withBasePath("/videos/hero.webm")} type="video/webm" />
          <source src={withBasePath("/videos/hero.mp4")} type="video/mp4" />
        </video>
      ) : (
        <img
          src={withBasePath("/images/hero-poster.webp")}
          alt="Pessoa lendo um livro em uma poltrona, cercada por estantes cheias de livros"
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
      )}
      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
    </div>
  );
}
