"use client";

import { Zap } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { usePathname } from "next/navigation";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  const pathname = usePathname() ?? "/";
  const locale = pathname.split("/").filter(Boolean)[0];
  const hasLocale = locale === "es" || locale === "ca";
  const localePrefix = hasLocale ? `/${locale}` : "";

  const t = {
    es: {
      help: "¿Necesitas ayuda?",
      contact: "Contáctanos",
      copyright: "© 2024 Bunnatic. Todos los derechos reservados.",
      terms: "Términos",
      privacy: "Privacidad",
    },
    ca: {
      help: "Necessites ajuda?",
      contact: "Contacta'ns",
      copyright: "© 2024 Bunnatic. Tots els drets reservats.",
      terms: "Termes",
      privacy: "Privacitat",
    },
  }[language === "ca" ? "ca" : "es"];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Simple Navbar */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href={localePrefix || "/"} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                <Zap className="h-5 w-5 fill-emerald-600 text-emerald-600" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Bunnatic
              </span>
            </Link>
            
            <div className="text-xs sm:text-sm text-gray-500">
              {t.help}{" "}
              <a 
                href="mailto:hello@bunnatic.com" 
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                {t.contact}
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-500">
            <p>{t.copyright}</p>
            <div className="flex gap-4 sm:gap-6">
              <Link 
                href={`${localePrefix}/aviso-legal`}
                className="hover:text-gray-900 transition-colors"
              >
                {t.terms}
              </Link>
              <Link 
                href={`${localePrefix}/politica-privacidad`}
                className="hover:text-gray-900 transition-colors"
              >
                {t.privacy}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
