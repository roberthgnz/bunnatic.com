import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { legalContent, type LegalLocale } from "@/lib/legalContent";
import { getLegalSlug } from "@/lib/pageSlugs";
import { buildPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

type LegalRouteProps = {
  params: Promise<{ locale: string }>;
};

function isLegalLocale(locale: string): locale is LegalLocale {
  return locale === "es" || locale === "ca";
}

export async function generateMetadata({ params }: LegalRouteProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: LegalLocale = locale === "ca" ? "ca" : "es";

  return buildPageMetadata({
    locale: safeLocale,
    title: `${legalContent[safeLocale]["politica-cookies"].title} | Wibloz`,
    description:
      safeLocale === "ca"
        ? "Revisa la política de cookies de Wibloz i com pots gestionar el teu consentiment."
        : "Revisa la política de cookies de Wibloz y cómo puedes gestionar tu consentimiento.",
    esPath: `/${getLegalSlug("politica-cookies", "es")}`,
    caPath: `/${getLegalSlug("politica-cookies", "ca")}`,
  });
}

export default async function PoliticaCookiesPage({ params }: LegalRouteProps) {
  const { locale } = await params;

  if (!isLegalLocale(locale)) {
    notFound();
  }

  return <LegalPage locale={locale} pageKey="politica-cookies" />;
}
