import type { Metadata } from "next";
import { buildPageMetadata, type SeoLocale } from "@/lib/seo";

type SignInLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: SignInLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: SeoLocale = locale === "ca" ? "ca" : "es";

  return buildPageMetadata({
    locale: safeLocale,
    title: safeLocale === "ca" ? "Iniciar sessió | Bunnatic" : "Iniciar sesión | Bunnatic",
    description:
      safeLocale === "ca"
        ? "Accedeix al teu compte de Bunnatic per gestionar la teva web i captar més clients."
        : "Accede a tu cuenta de Bunnatic para gestionar tu web y captar más clientes.",
    esPath: "/signin",
    caPath: "/signin",
    noindex: true,
  });
}

export default function SignInLayout({ children }: SignInLayoutProps) {
  return children;
}
