"use client";

import { useSyncExternalStore } from "react";
import { withBasePath } from "@/config/environment";

type ConnectionLike = EventTarget & {
  saveData?: boolean;
  effectiveType?: string;
};

function getConnection(): ConnectionLike | undefined {
  return (navigator as Navigator & { connection?: ConnectionLike }).connection;
}

function computeShouldPlayVideo() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const connection = getConnection();
  const isDataSaver = Boolean(connection?.saveData);
  const isSlowConnection = connection?.effectiveType
    ? ["slow-2g", "2g"].includes(connection.effectiveType)
    : false;

  return !prefersReducedMotion && !isDataSaver && !isSlowConnection;
}

function subscribe(onChange: () => void) {
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = getConnection();
  motionQuery.addEventListener("change", onChange);
  connection?.addEventListener("change", onChange);
  return () => {
    motionQuery.removeEventListener("change", onChange);
    connection?.removeEventListener("change", onChange);
  };
}

function getServerSnapshot() {
  return false;
}

export function HeroBackground() {
  const shouldPlayVideo = useSyncExternalStore(
    subscribe,
    computeShouldPlayVideo,
    getServerSnapshot
  );

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
