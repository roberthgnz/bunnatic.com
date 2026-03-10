"use client";

import { content } from "@/lib/content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "./LanguageProvider";

export default function FAQ() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section className="bg-[#0a0a0a] py-24 sm:py-32 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl text-center mb-16">
            {t.faq.title}
          </h2>
          <Accordion type="single" collapsible className="mt-10 space-y-4">
            {t.faq.questions.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-2xl border-b-0 border border-white/10 bg-white/5 px-6 backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <AccordionTrigger className="flex w-full items-center justify-between py-4 text-white hover:no-underline **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:text-gray-400">
                  <span className="text-lg font-semibold leading-7">{faq.q}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="pb-6 text-base leading-7 text-gray-400">{faq.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
