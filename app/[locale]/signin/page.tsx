"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Zap } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSigninSchema, type SigninFormValues } from "@/lib/validations/signin";
import { cn } from "@/lib/utils";
import { login } from "@/lib/supabase/actions";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { routing } from "@/i18n/routing";

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const signInContent = {
  es: {
    navbar: {
      logo: "Bunnatic",
    },
    signin: {
      title: "Inicia sesión",
      subtitle: "Bienvenido de nuevo a Bunnatic",
      newAccountText: "Crear una cuenta nueva",
      or: "¿No tienes cuenta?",
      emailLabel: "Correo electrónico",
      passwordLabel: "Contraseña",
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña",
      rememberMe: "Recordarme",
      forgotPassword: "¿Olvidaste tu contraseña?",
      loginButton: "Entrar",
      loginButtonLoading: "Entrando...",
      socialGoogle: "Continuar con Google",
      orDivider: "O entra con correo",
      securityNote: "Datos seguros y cifrados.",
      validation: {
        emailRequired: "El correo es requerido",
        emailInvalid: "Correo electrónico inválido",
        passwordRequired: "La contraseña es requerida",
      },
    },
  },
  ca: {
    navbar: {
      logo: "Bunnatic",
    },
    signin: {
      title: "Inicia sessió",
      subtitle: "Benvingut de nou a Bunnatic",
      newAccountText: "Crear un compte nou",
      or: "No tens compte?",
      emailLabel: "Correu electrònic",
      passwordLabel: "Contrasenya",
      showPassword: "Mostra la contrasenya",
      hidePassword: "Amaga la contrasenya",
      rememberMe: "Recorda'm",
      forgotPassword: "Has oblidat la teva contrasenya?",
      loginButton: "Entrar",
      loginButtonLoading: "Entrant...",
      socialGoogle: "Continua amb Google",
      orDivider: "O entra amb correu",
      securityNote: "Dades segures i xifrades.",
      validation: {
        emailRequired: "El correu és requerit",
        emailInvalid: "Correu electrònic invàlid",
        passwordRequired: "La contrasenya és requerida",
      },
    },
  },
} as const;

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <SignInContent />
    </Suspense>
  );
}

function SignInContent() {
  const { language } = useLanguage();
  const t = signInContent[language];
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const localePrefix = useMemo(() => {
    return language === routing.defaultLocale ? "" : `/${language}`;
  }, [language]);
  const homeHref = localePrefix || "/";

  const flow = useMemo(() => {
    const redirectRaw =
      searchParams.get("redirect") ??
      searchParams.get("next") ??
      searchParams.get("returnTo") ??
      searchParams.get("to") ??
      "/dashboard";

    return redirectRaw.startsWith(`/${language}/`)
      ? redirectRaw
      : `${localePrefix}${redirectRaw}`;
  }, [localePrefix, language, searchParams]);

  const signupHref = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    const qs = params.toString();
    return `${localePrefix}/signup${qs ? `?${qs}` : ""}`;
  }, [localePrefix, searchParams]);

  const schema = useMemo(() => createSigninSchema(t.signin.validation), [t.signin.validation]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SigninFormValues) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await login(formData);

    if (result?.error) {
      toast.error(result.error);
    } else {
      router.push(flow);
    }
  }

  const handleSocialLogin = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(flow)}`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href={homeHref} className="flex items-center justify-center gap-2 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 shadow-sm">
            <Zap className="h-6 w-6 fill-emerald-600 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">{t.navbar.logo}</span>
        </Link>
        
        <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {t.signin.title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w-sm mx-auto">
          {t.signin.subtitle}
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[420px]">
        <div className="bg-white px-6 py-8 shadow-xl shadow-slate-200/40 sm:rounded-3xl sm:px-10 border border-slate-100">
          
          <div className="mb-8">
            <Button
              variant="outline"
              type="button"
              className="w-full h-12 gap-3 text-base font-medium text-slate-700 hover:bg-slate-50 border-slate-200 rounded-xl transition-all hover:border-slate-300"
              onClick={handleSocialLogin}
            >
              <GoogleLogo />
              {t.signin.socialGoogle}
            </Button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-medium tracking-wide">
                {t.signin.orDivider}
              </span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-gray-900 ml-1">{t.signin.emailLabel}</label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={cn(
                    "h-11 rounded-xl bg-slate-50 border-slate-200 px-4 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500/20",
                    errors.email ? "border-rose-300 focus:border-rose-300 focus:ring-rose-500/20" : "focus:border-emerald-500"
                  )}
                  placeholder={t.signin.emailLabel}
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email ? <p className="text-xs font-medium text-rose-600 ml-1">{errors.email.message}</p> : null}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-gray-900 ml-1">{t.signin.passwordLabel}</label>
                  <a href="#" className="text-xs font-medium text-emerald-600 hover:text-emerald-500">
                    {t.signin.forgotPassword}
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...register("password")}
                    className={cn(
                      "h-11 rounded-xl bg-slate-50 border-slate-200 px-4 pr-11 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500/20",
                      errors.password ? "border-rose-300 focus:border-rose-300 focus:ring-rose-500/20" : "focus:border-emerald-500"
                    )}
                    placeholder={t.signin.passwordLabel}
                    aria-invalid={Boolean(errors.password)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-transparent"
                    aria-label={showPassword ? t.signin.hidePassword : t.signin.showPassword}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password ? <p className="text-xs font-medium text-rose-600 ml-1">{errors.password.message}</p> : null}
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="default"
                type="submit"
                disabled={!isValid || isSubmitting}
                className={cn(
                  "group relative flex w-full h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5",
                  !isValid || isSubmitting
                    ? "cursor-not-allowed bg-emerald-300 shadow-none hover:translate-y-0"
                    : "bg-emerald-500 hover:bg-emerald-400"
                )}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {t.signin.loginButtonLoading}
                  </div>
                ) : (
                  <>
                    {t.signin.loginButton}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-center text-xs text-slate-500 mt-4">
              {t.signin.securityNote}
            </p>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            {t.signin.or}{" "}
            <Link href={signupHref} className="font-semibold text-emerald-600 hover:text-emerald-500 hover:underline underline-offset-4">
              {t.signin.newAccountText}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
