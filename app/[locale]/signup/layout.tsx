import type { Metadata } from "next";
import { buildPageMetadata, type SeoLocale } from "@/lib/seo";

type SignUpLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: SignUpLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: SeoLocale = locale === "ca" ? "ca" : "es";

  return buildPageMetadata({
    locale: safeLocale,
    title: safeLocale === "ca" ? "Crear compte | Wibloz" : "Crear cuenta | Wibloz",
    description:
      safeLocale === "ca"
        ? "Crea el teu compte de Wibloz i activa una web preparada per captar clients locals."
        : "Crea tu cuenta de Wibloz y activa una web preparada para captar clientes locales.",
    esPath: "/signup",
    caPath: "/signup",
    noindex: true,
  });
}

export default function SignUpLayout({ children }: SignUpLayoutProps) {
  return children;
}
