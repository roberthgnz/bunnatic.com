'use client'

import { content } from '@/lib/content'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function FAQ() {
  const t = content

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:mb-12 sm:text-4xl md:text-5xl">
            {t.faq.title}
          </h2>
          <Accordion
            type="single"
            collapsible
            className="mt-6 space-y-3 sm:mt-10 sm:space-y-4"
          >
            {t.faq.questions.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-b-0 border-slate-200 bg-white px-4 transition-colors hover:bg-slate-100 sm:rounded-2xl sm:px-6"
              >
                <AccordionTrigger className="flex w-full items-center justify-between py-3 text-slate-900 hover:no-underline **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-slate-500 sm:py-4 sm:**:data-[slot=accordion-trigger-icon]:size-5">
                  <span className="text-base leading-6 font-semibold sm:text-lg sm:leading-7">
                    {faq.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="pb-4 text-sm leading-6 text-slate-600 sm:pb-6 sm:text-base sm:leading-7">
                    {faq.a}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
