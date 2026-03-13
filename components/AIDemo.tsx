'use client'

import { content } from '@/lib/content'
import { Bot, User, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function AIDemo() {
  const t = content

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl lg:max-w-none">
          <h2 className="text-2xl leading-[1.15] font-extrabold tracking-tight text-slate-900 sm:text-4xl sm:whitespace-pre-line md:text-5xl">
            {t.aiDemo.title}
          </h2>

          <Card className="mx-auto mt-8 max-w-2xl rounded-2xl border border-slate-200 bg-white p-0 shadow-sm sm:mt-12">
            <CardContent className="flex flex-col gap-4 rounded-2xl p-4 sm:gap-6 sm:p-6">
              <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3 sm:gap-3 sm:pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 sm:h-10 sm:w-10">
                  <Sparkles className="h-4 w-4 text-emerald-700 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                    {t.aiDemo.assistantName}
                  </h3>
                  <p className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 sm:text-xs">
                    <span className="h-2 w-2 rounded-full bg-emerald-700" />
                    {t.aiDemo.onlineStatus}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:gap-5">
                {t.aiDemo.chat.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex max-w-[94%] items-end gap-2 sm:max-w-[85%] sm:gap-3 ${
                        msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8 ${
                          msg.type === 'user'
                            ? 'bg-slate-900 text-white'
                            : 'bg-emerald-700 text-white'
                        }`}
                      >
                        {msg.type === 'user' ? (
                          <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        ) : (
                          <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        )}
                      </div>
                      <div
                        className={`rounded-xl border px-3.5 py-2.5 text-xs leading-relaxed sm:px-5 sm:py-3 sm:text-sm ${
                          msg.type === 'user'
                            ? 'border-slate-200 bg-slate-100 text-slate-800'
                            : 'border-emerald-200 bg-emerald-50 font-medium text-emerald-900'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-sm font-medium text-slate-500 sm:mt-12 sm:text-base">
            {t.aiDemo.caption}
          </p>
        </div>
      </div>
    </section>
  )
}
