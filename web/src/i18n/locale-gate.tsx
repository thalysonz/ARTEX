"use client";

import * as React from "react";

import { APP_CONFIG } from "@/config/app-config";

import { getLocale } from "./index";

// Nothing to subscribe to: the value only differs between server and client.
const subscribe = () => () => undefined;

/**
 * Defers rendering to the client. The static export prerenders HTML with the
 * Chinese source strings, while the browser may resolve another locale; skipping
 * the prerendered tree avoids hydration mismatches between the two.
 */
export function LocaleGate({ children }: { children: React.ReactNode }) {
  const hydrated = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  React.useEffect(() => {
    document.documentElement.lang = getLocale();
    // The prerendered <title> comes from build-time metadata (Chinese source).
    document.title = APP_CONFIG.meta.title;
  }, []);
  return hydrated ? children : null;
}
