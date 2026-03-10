import type { MetadataRoute } from "next";
import { businessLandingEntries } from "@/lib/businessLandingData";
import { content } from "@/lib/content";
import { routing } from "@/i18n/routing";
import { getBaseUrl } from "@/lib/seo";
import {
  getAlternativeSlug,
  getFeatureSlug,
  getLegalSlug,
  type Locale,
} from "@/lib/pageSlugs";

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
  const locales = [...routing.locales] as Locale[];
  const baseUrl = getBaseUrl();
  const lastModified = new Date();
  const pathGroups: Array<Record<Locale, string>> = [];

  const basePaths = ["/", "/crear", "/signin", "/signup"];
  basePaths.forEach((path) => {
    pathGroups.push({ es: path, ca: path });
  });

  const legalIds = ["aviso-legal", "politica-privacidad", "politica-cookies"];
  legalIds.forEach((legalId) => {
    pathGroups.push({
      es: `/${getLegalSlug(legalId, "es")}`,
      ca: `/${getLegalSlug(legalId, "ca")}`,
    });
  });

  content.es.features.forEach((feature) => {
    pathGroups.push({
      es: `/caracteristicas/${getFeatureSlug(feature.id, "es")}`,
      ca: `/caracteristicas/${getFeatureSlug(feature.id, "ca")}`,
    });
  });

  content.es.competitors.forEach((competitor) => {
    pathGroups.push({
      es: `/alternativa/${getAlternativeSlug(competitor.id, "es")}`,
      ca: `/alternativa/${getAlternativeSlug(competitor.id, "ca")}`,
    });
  });

  businessLandingEntries.forEach((entry) => {
    pathGroups.push({
      es: `/negocio/${entry.slugs.es}`,
      ca: `/negocio/${entry.slugs.ca}`,
    });
  });

  return pathGroups.flatMap((pathsByLocale) =>
    locales.map((locale) => ({
      url: toAbsoluteUrl(pathsByLocale[locale], locale, baseUrl),
      lastModified,
      changeFrequency: "weekly",
      priority: pathsByLocale[locale] === "/" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((targetLocale) => [
            targetLocale,
            toAbsoluteUrl(pathsByLocale[targetLocale], targetLocale, baseUrl),
          ])
        ),
      },
    }))
  );
}
