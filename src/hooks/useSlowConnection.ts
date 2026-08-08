"use client";

import { useSyncExternalStore } from "react";

type ConnectionLike = EventTarget & {
  saveData?: boolean;
  effectiveType?: string;
};

function getConnection(): ConnectionLike | undefined {
  return (navigator as Navigator & { connection?: ConnectionLike }).connection;
}

function computeIsSlowConnection() {
  const connection = getConnection();
  const isDataSaver = Boolean(connection?.saveData);
  const isSlowEffectiveType = connection?.effectiveType
    ? ["slow-2g", "2g"].includes(connection.effectiveType)
    : false;

  return isDataSaver || isSlowEffectiveType;
}

function subscribe(onChange: () => void) {
  const connection = getConnection();
  connection?.addEventListener("change", onChange);
  return () => connection?.removeEventListener("change", onChange);
}

function getServerSnapshot() {
  return false;
}

// True when the user has data-saver enabled or is on a slow-2g/2g connection.
export function useSlowConnection() {
  return useSyncExternalStore(subscribe, computeIsSlowConnection, getServerSnapshot);
}
