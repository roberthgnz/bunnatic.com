import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { LegalLocale, LegalPageKey } from "@/lib/legalContent";
import { legalContent } from "@/lib/legalContent";

type LegalPageProps = {
  locale: LegalLocale;
  pageKey: LegalPageKey;
};

export default function LegalPage({ locale, pageKey }: LegalPageProps) {
  const page = legalContent[locale][pageKey];

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar />

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{page.title}</h1>
          <p className="mt-4 text-sm font-medium text-gray-500">
            {page.lastUpdatedLabel}: {page.lastUpdatedDate}
          </p>
          <p className="mt-5 max-w-3xl text-base leading-7 text-gray-700">{page.intro}</p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
          <div className="space-y-10">
            {page.sections.map((section) => (
              <article key={section.title} className="space-y-3">
                <h2 className="text-xl font-semibold tracking-tight text-gray-900">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-7 text-gray-700">
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-700">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
