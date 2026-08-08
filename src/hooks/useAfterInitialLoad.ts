"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("load", onChange);
  return () => window.removeEventListener("load", onChange);
}

function getSnapshot() {
  return document.readyState === "complete";
}

function getServerSnapshot() {
  return false;
}

// True once the window "load" event has fired, so lazy-loaded assets
// (carousel full images, hero video) don't compete with initial-page resources.
export function useAfterInitialLoad() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
