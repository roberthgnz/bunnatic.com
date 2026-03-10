"use client";

import { content } from "@/lib/content";
import { motion } from "motion/react";
import { Bot, User, Sparkles } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { Card, CardContent } from "@/components/ui/card";

export default function AIDemo() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-24 lg:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl lg:max-w-none">
          <h2 className="text-2xl font-extrabold leading-[1.15] tracking-tight text-gray-900 sm:text-4xl md:text-5xl sm:whitespace-pre-line">
            {t.aiDemo.title}
          </h2>

          <Card className="relative mt-8 mx-auto max-w-2xl rounded-[1.75rem] bg-white/60 p-0 px-3 py-3 shadow-2xl ring-1 ring-gray-900/5 backdrop-blur-xl sm:mt-12 sm:rounded-[2.5rem] sm:px-4 sm:py-4 sm:p-8">
            {/* Decorative elements */}
            <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-purple-200/50 blur-3xl sm:-left-12 sm:-top-12 sm:h-40 sm:w-40" />
            <div className="absolute -right-8 -bottom-8 h-28 w-28 rounded-full bg-emerald-200/50 blur-3xl sm:-right-12 sm:-bottom-12 sm:h-40 sm:w-40" />
            
            <CardContent className="relative flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:gap-6 sm:rounded-3xl sm:p-6">
              {/* Chat Header */}
              <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3 sm:gap-3 sm:pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 sm:h-10 sm:w-10">
                  <Sparkles className="h-4 w-4 text-emerald-600 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 sm:text-base">{t.aiDemo.assistantName}</h3>
                  <p className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 sm:text-xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {t.aiDemo.onlineStatus}
                  </p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex flex-col gap-3 sm:gap-5">
                {t.aiDemo.chat.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.4 }}
                    className={`flex w-full ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[94%] items-end gap-2 sm:max-w-[85%] sm:gap-3 ${
                        msg.type === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full shadow-sm sm:h-8 sm:w-8 ${
                          msg.type === "user"
                            ? "bg-gray-900 text-white"
                            : "bg-emerald-500 text-white"
                        }`}
                      >
                        {msg.type === "user" ? (
                          <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        ) : (
                          <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        )}
                      </div>
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm sm:px-5 sm:py-3 sm:text-sm ${
                          msg.type === "user"
                            ? "bg-gray-100 text-gray-800 rounded-br-sm"
                            : "bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-bl-sm font-medium"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-sm font-medium text-gray-500 sm:mt-12 sm:text-base">
            {t.aiDemo.caption}
          </p>
        </div>
      </div>
    </section>
  );
}
