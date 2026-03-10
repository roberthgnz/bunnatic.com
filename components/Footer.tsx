"use client";

import { content } from "@/lib/content";
import { Zap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLanguage } from "./LanguageProvider";
import { getAlternativeSlug, getFeatureSlug, getLegalSlug } from "@/lib/pageSlugs";

export default function Footer() {
  const { language } = useLanguage();
  const t = content[language];
  const legalLinks =
    language === "es"
      ? [
          { label: "Aviso legal", href: `/${getLegalSlug("aviso-legal", "es")}` },
          { label: "Política de privacidad", href: `/${getLegalSlug("politica-privacidad", "es")}` },
          { label: "Política de cookies", href: `/${getLegalSlug("politica-cookies", "es")}` },
        ]
      : [
          { label: "Avís legal", href: `/${getLegalSlug("aviso-legal", "ca")}` },
          { label: "Política de privacitat", href: `/${getLegalSlug("politica-privacidad", "ca")}` },
          { label: "Política de cookies", href: `/${getLegalSlug("politica-cookies", "ca")}` },
        ];

  return (
    <footer className="bg-[#0a0a0a] py-16 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <Zap className="h-5 w-5 fill-emerald-500 text-emerald-500" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                {t.footer.logo}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-400 max-w-xs leading-relaxed">
              {language === 'es' ? 'La IA crea tu web usando los datos de tu negocio. Gratis para empezar.' : 'La IA crea la teva web utilitzant les dades del teu negoci. Gratis per començar.'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">{language === 'es' ? 'Características' : 'Característiques'}</h3>
            <ul className="flex flex-col gap-4 text-sm font-medium text-gray-400">
              {t.features?.map((feature) => (
                <li key={feature.id}>
                  <Link href={`/caracteristicas/${getFeatureSlug(feature.id, language)}`} className="hover:text-white transition-colors">
                    {feature.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">{language === 'es' ? 'Alternativas' : 'Alternatives'}</h3>
            <ul className="flex flex-col gap-4 text-sm font-medium text-gray-400">
              {t.competitors?.map((competitor) => (
                <li key={competitor.id}>
                  <Link href={`/alternativa/${getAlternativeSlug(competitor.id, language)}`} className="hover:text-white transition-colors">
                    {language === 'es' ? `Alternativa a ${competitor.name}` : `Alternativa a ${competitor.name}`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Legal</h3>
            <ul className="flex flex-col gap-4 text-sm font-medium text-gray-400">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm font-medium text-gray-500">
            {t.footer.copyright}
          </div>
        </div>
      </div>
    </footer>
  );
}
