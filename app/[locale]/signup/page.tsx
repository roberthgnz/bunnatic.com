"use client";

import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const signUpContent = {
  es: {
    navbar: {
      logo: "Nova Web",
    },
    crear: {
      back: "Volver",
    },
    signup: {
      title: "Crea tu cuenta",
      existingAccountText: "inicia sesión si ya tienes una",
      or: "O",
      nameLabel: "Nombre completo",
      emailLabel: "Correo electrónico",
      passwordLabel: "Contraseña",
      signupButton: "Registrarse y empezar",
    },
  },
  ca: {
    navbar: {
      logo: "Nova Web",
    },
    crear: {
      back: "Tornar",
    },
    signup: {
      title: "Crea el teu compte",
      existingAccountText: "inicia sessió si ja en tens una",
      or: "O",
      nameLabel: "Nom complet",
      emailLabel: "Correu electrònic",
      passwordLabel: "Contrasenya",
      signupButton: "Registrar-se i començar",
    },
  },
} as const;

export default function SignUpPage() {
  const { language } = useLanguage();
  const t = signUpContent[language];

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
              {t.signup.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t.signup.or} <Link href="/signin" className="font-medium text-emerald-600 hover:text-emerald-500">{t.signup.existingAccountText}</Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" action="/crear" method="GET">
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="name" className="sr-only">{t.signup.nameLabel}</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="relative block w-full rounded-t-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                  placeholder={t.signup.nameLabel}
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">{t.signup.emailLabel}</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                  placeholder={t.signup.emailLabel}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">{t.signup.passwordLabel}</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="relative block w-full rounded-b-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                  placeholder={t.signup.passwordLabel}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-full bg-emerald-500 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
              >
                {t.signup.signupButton}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
