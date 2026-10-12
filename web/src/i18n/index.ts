/**
 * Minimal client-side i18n for the statically exported console.
 *
 * Source strings stay in Chinese in the code and double as lookup keys:
 *
 *   t("任务列表")                    → "Tasks" / "Tarefas"
 *   t("共 {n} 条", { n: total })     → "{n} total" / "{n} no total"
 *
 * Dictionaries live in ./messages/*.ts (one file per area, merged below) as
 * `{ "<zh source>": ["<en>", "<pt-BR>"] }`. A missing entry falls back to the
 * Chinese source, so untranslated text degrades visibly instead of breaking.
 *
 * The locale is resolved once, synchronously, when this module is first
 * evaluated (localStorage → browser language → English). That makes `t()` safe to
 * call at module scope (label maps, constants) as well as in render. Switching
 * language stores the choice and reloads the page so every module re-evaluates.
 */
import { MESSAGES } from "./messages";

export const LOCALES = ["en", "pt-BR", "zh-CN"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  "pt-BR": "Português (Brasil)",
  "zh-CN": "简体中文",
};

const STORAGE_KEY = "artex_locale";

export type Params = Record<string, string | number | null | undefined>;

function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && (LOCALES as readonly string[]).includes(v);
}

function detectLocale(): Locale {
  if (typeof window === "undefined") return "zh-CN";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // storage blocked — fall through to the browser language
  }
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const raw of langs) {
    const l = (raw || "").toLowerCase();
    if (l.startsWith("pt")) return "pt-BR";
    if (l.startsWith("zh")) return "zh-CN";
    if (l.startsWith("en")) return "en";
  }
  return "en";
}

const current: Locale = detectLocale();

export function getLocale(): Locale {
  return current;
}

/** Persists the choice and reloads so module-level labels pick it up too. */
export function setLocale(locale: Locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // ignore — the reload will just fall back to detection
  }
  window.location.reload();
}

const slot: 0 | 1 | null = current === "en" ? 0 : current === "pt-BR" ? 1 : null;

function interpolate(s: string, params?: Params): string {
  if (!params) return s;
  return s.replace(/\{(\w+)\}/g, (m, k: string) => {
    const v = params[k];
    return v === undefined || v === null ? m : String(v);
  });
}

/** Translates a Chinese source string into the active locale. */
export function t(src: string, params?: Params): string {
  if (slot !== null) {
    const hit = MESSAGES[src]?.[slot];
    if (hit) return interpolate(hit, params);
  }
  return interpolate(src, params);
}

/** BCP-47 tag for Intl / toLocaleString calls. */
export function intlLocale(): string {
  return current;
}
