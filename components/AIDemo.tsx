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
    <section className="bg-slate-50 py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl lg:max-w-none">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl sm:whitespace-pre-line leading-[1.1]">
            {t.aiDemo.title}
          </h2>

          <Card className="mt-16 mx-auto max-w-2xl rounded-[2.5rem] bg-white/60 p-0 px-4 py-4 shadow-2xl ring-1 ring-gray-900/5 backdrop-blur-xl sm:p-8">
            {/* Decorative elements */}
            <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-purple-200/50 blur-3xl" />
            <div className="absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-emerald-200/50 blur-3xl" />
            
            <CardContent className="relative flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              {/* Chat Header */}
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t.aiDemo.assistantName}</h3>
                  <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {t.aiDemo.onlineStatus}
                  </p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex flex-col gap-5">
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
                      className={`flex max-w-[85%] items-end gap-3 ${
                        msg.type === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full shadow-sm ${
                          msg.type === "user"
                            ? "bg-gray-900 text-white"
                            : "bg-emerald-500 text-white"
                        }`}
                      >
                        {msg.type === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={`rounded-2xl px-5 py-3 text-sm shadow-sm leading-relaxed ${
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

          <p className="mt-12 text-center text-base font-medium text-gray-500">
            {t.aiDemo.caption}
          </p>
        </div>
      </div>
    </section>
  );
}
