'use client'

import { content } from '@/lib/content'
import {
  CheckCircle2,
  Globe,
  MapPin,
  MessageCircle,
  Search,
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { Card, CardContent } from '@/components/ui/card'

export default function HowItWorks() {
  const { language } = useLanguage()
  const t = content[language]
  const steps = [...t.howItWorks.steps].sort(
    (a, b) => Number(a.number) - Number(b.number)
  )
  const stepAccent = ['bg-emerald-700', 'bg-slate-700', 'bg-slate-700']

  return (
    <section className="border-b border-slate-200 bg-white py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {t.howItWorks.title}
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600 sm:mt-4 sm:text-lg sm:leading-8">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl sm:mt-14 lg:mt-16 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-4 sm:gap-6 lg:max-w-none lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => (
              <Card
                key={step.title}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <CardContent className="p-5 sm:p-7">
                  <dt className="flex items-center gap-x-3 text-base leading-7 font-bold text-slate-900 sm:text-lg">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-md text-sm text-white sm:h-10 sm:w-10 sm:text-base ${
                        stepAccent[index] ?? 'bg-emerald-700'
                      }`}
                    >
                      {step.number}
                    </span>
                    {step.title}
                  </dt>
                  <dd className="mt-3 text-sm leading-relaxed text-slate-600 sm:mt-4 sm:text-base">
                    <p>{step.description}</p>

                    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:mt-6 sm:p-5">
                      {index === 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 sm:text-sm">
                            <Search className="h-4 w-4 text-slate-400" />
                            <span>{step.mockup?.input}</span>
                          </div>
                          <div className="flex items-center gap-2 px-1 text-xs font-medium text-slate-800 sm:text-sm">
                            <MapPin className="h-4 w-4 text-emerald-700" />
                            <span>{step.mockup?.result}</span>
                          </div>
                        </div>
                      )}

                      {index === 1 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold text-slate-900 sm:text-sm">
                            <Globe className="h-4 w-4 text-slate-700" />
                            {step.mockup?.title}
                          </div>
                          <ul className="space-y-3 text-xs font-medium text-slate-600 sm:text-sm">
                            {step.mockup?.items?.map((item, i) => (
                              <li key={i} className="flex items-center gap-3">
                                <CheckCircle2 className="h-4 w-4 text-emerald-700 sm:h-5 sm:w-5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {index === 2 && (
                        <div className="space-y-4">
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800 sm:text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {step.mockup?.tag}
                          </div>
                          <div className="rounded-lg border border-slate-200 bg-white p-3 sm:p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 sm:h-9 sm:w-9">
                                <MessageCircle className="h-4 w-4" />
                              </div>
                              <p className="text-xs leading-snug font-medium text-slate-700 sm:text-sm">
                                {step.mockup?.chat}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </dd>
                </CardContent>
              </Card>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
