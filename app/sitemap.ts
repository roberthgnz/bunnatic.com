import type { MetadataRoute } from "next";
import { businessLandingEntries } from "@/lib/businessLandingData";
import { content } from "@/lib/content";
import { routing } from "@/i18n/routing";

const DEFAULT_BASE_URL = "http://localhost:3000";

function normalizeBaseUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }
    return url.toString().endsWith("/") ? url.toString() : `${url.toString()}/`;
  } catch {
    return null;
  }
}

function getBaseUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.APP_URL,
  ];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const normalized = normalizeBaseUrl(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return `${DEFAULT_BASE_URL}/`;
}

function withLocale(pathname: string, locale: string) {
  if (locale === routing.defaultLocale) {
    return pathname;
  }

  return pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
}

function toAbsoluteUrl(pathname: string, locale: string, baseUrl: string) {
  return new URL(withLocale(pathname, locale), baseUrl).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = routing.locales;

  const basePaths = ["/", "/crear", "/signin", "/signup"];

  const featurePaths = content.es.features.map(
    (feature) => `/caracteristicas/${feature.id}`
  );
  const alternativePaths = content.es.competitors.map(
    (competitor) => `/alternativa/${competitor.id}`
  );
  const businessPaths = businessLandingEntries.map(
    (entry) => `/negocio/${entry.slug}`
  );

  const allPaths = Array.from(
    new Set([...basePaths, ...featurePaths, ...alternativePaths, ...businessPaths])
  );

  const baseUrl = getBaseUrl();
  const lastModified = new Date();

  return allPaths.flatMap((pathname) =>
    locales.map((locale) => ({
      url: toAbsoluteUrl(pathname, locale, baseUrl),
      lastModified,
      alternates: {
        languages: Object.fromEntries(
          locales.map((targetLocale) => [
            targetLocale,
            toAbsoluteUrl(pathname, targetLocale, baseUrl),
          ])
        ),
      },
    }))
  );
}
