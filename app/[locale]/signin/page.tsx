"use client";

import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/LanguageProvider";
import { login } from "@/lib/supabase/actions";
import { toast } from "sonner";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const signInContent = {
  es: {
    navbar: {
      logo: "Bunnatic",
    },
    crear: {
      back: "Volver",
    },
    signin: {
      title: "Inicia sesión",
      newAccountText: "crea una cuenta nueva",
      or: "O",
      emailLabel: "Correo electrónico",
      passwordLabel: "Contraseña",
      rememberMe: "Recordarme",
      forgotPassword: "¿Olvidaste tu contraseña?",
      loginButton: "Entrar",
    },
  },
  ca: {
    navbar: {
      logo: "Bunnatic",
    },
    crear: {
      back: "Tornar",
    },
    signin: {
      title: "Inicia sessió",
      newAccountText: "crea un compte nou",
      or: "O",
      emailLabel: "Correu electrònic",
      passwordLabel: "Contrasenya",
      rememberMe: "Recorda'm",
      forgotPassword: "Has oblidat la teva contrasenya?",
      loginButton: "Entrar",
    },
  },
} as const;

export default function SignInPage() {
  const { language } = useLanguage();
  const t = signInContent[language];
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const localePrefix = useMemo(() => {
    const locale = pathname.split("/")[1];
    return locale ? `/${locale}` : "";
  }, [pathname]);
  const homeHref = localePrefix || "/";

  const flow = useMemo(() => {
    const redirectRaw =
      searchParams.get("redirect") ??
      searchParams.get("next") ??
      searchParams.get("returnTo") ??
      searchParams.get("to") ??
      "/crear";

    return redirectRaw.startsWith(`/${pathname.split("/")[1]}/`)
      ? redirectRaw
      : `${localePrefix}${redirectRaw}`;
  }, [localePrefix, pathname, searchParams]);

  const signupHref = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    const qs = params.toString();
    return `${localePrefix}/signup${qs ? `?${qs}` : ""}`;
  }, [localePrefix, searchParams]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      router.push(flow);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-gray-900 flex flex-col">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={homeHref} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <Zap className="h-5 w-5 fill-emerald-600 text-emerald-600" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">{t.navbar.logo}</span>
          </Link>
          <Link href={homeHref} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900">
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
              {t.signin.or} <Link href={signupHref} className="font-medium text-emerald-600 hover:text-emerald-500">{t.signin.newAccountText}</Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
              <Button
                variant="default"
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-full bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {loading ? "..." : t.signin.loginButton}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
