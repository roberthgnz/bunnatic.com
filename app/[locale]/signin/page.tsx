"use client";

import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/lib/content";

export default function SignInPage() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-gray-900 flex flex-col">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <Zap className="h-5 w-5 fill-emerald-600 text-emerald-600" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">{t.navbar.logo}</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            {t.crear.back}
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 sm:p-10 shadow-xl ring-1 ring-gray-200">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {t.signin.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t.signin.or} <Link href="/signup" className="font-medium text-emerald-600 hover:text-emerald-500">{t.signin.newAccountText}</Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" action="/crear" method="GET">
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">{t.signin.emailLabel}</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-t-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                  placeholder={t.signin.emailLabel}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">{t.signin.passwordLabel}</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded-b-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                  placeholder={t.signin.passwordLabel}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  {t.signin.rememberMe}
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                  {t.signin.forgotPassword}
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-full bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors"
              >
                {t.signin.loginButton}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
