"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CircleCheck, Eye, EyeOff, MapPin, Sparkles, Zap } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSignupSchema, type SignupFormValues } from "@/lib/validations/signup";
import { cn } from "@/lib/utils";
import { signup } from "@/lib/supabase/actions";
import { toast } from "sonner";
import { trackFunnelEvent } from "@/lib/funnelEvents";

import { createClient } from "@/lib/supabase/client";

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

const signUpContent = {
  es: {
    navbar: {
      logo: "Bunnatic",
    },
    crear: {
      back: "Volver",
    },
    signup: {
      title: "Crear cuenta",
      subtitle: "Empieza a gestionar tu negocio online.",
      existingAccountText: "Iniciar sesión",
      or: "¿Ya tienes cuenta?",
      nameLabel: "Nombre completo",
      emailLabel: "Correo electrónico",
      passwordLabel: "Contraseña",
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña",
      nameHint: "Tu nombre real.",
      emailHint: "Para notificaciones importantes.",
      passwordHint: "8+ caracteres, mayúscula y número.",
      signupButton: "Crear cuenta",
      signupButtonLoading: "Creando...",
      securityNote: "Datos seguros y cifrados.",
      stepBadge: "Registro",
      socialGoogle: "Continuar con Google",
      orDivider: "O regístrate con correo",
      validation: {
        nameRequired: "Requerido",
        nameMin: "Mínimo 2 caracteres",
        nameMax: "Máximo 80 caracteres",
        emailRequired: "Requerido",
        emailInvalid: "Correo inválido",
        passwordRequired: "Requerida",
        passwordMin: "Mínimo 8 caracteres",
        passwordUppercase: "Falta mayúscula",
        passwordLowercase: "Falta minúscula",
        passwordNumber: "Falta número",
      },
    },
  },
  ca: {
    navbar: {
      logo: "Bunnatic",
    },
    crear: {
      back: "Tornar",
    },
    signup: {
      title: "Crear compte",
      subtitle: "Comença a gestionar el teu negoci online.",
      existingAccountText: "Iniciar sessió",
      or: "Ja tens compte?",
      nameLabel: "Nom complet",
      emailLabel: "Correu electrònic",
      passwordLabel: "Contrasenya",
      showPassword: "Mostra la contrasenya",
      hidePassword: "Amaga la contrasenya",
      nameHint: "El teu nom real.",
      emailHint: "Per notificacions importants.",
      passwordHint: "8+ caràcters, majúscula i número.",
      signupButton: "Crear compte",
      signupButtonLoading: "Creant...",
      securityNote: "Dades segures i xifrades.",
      stepBadge: "Registre",
      socialGoogle: "Continua amb Google",
      orDivider: "O registra't amb correu",
      validation: {
        nameRequired: "Requerit",
        nameMin: "Mínim 2 caràcters",
        nameMax: "Màxim 80 caràcters",
        emailRequired: "Requerit",
        emailInvalid: "Correu invàlid",
        passwordRequired: "Requerida",
        passwordMin: "Mínim 8 caràcters",
        passwordUppercase: "Falta majúscula",
        passwordLowercase: "Falta minúscula",
        passwordNumber: "Falta número",
      },
    },
  },
} as const;

const REDIRECT_KEYS = new Set(["redirect", "next", "returnTo", "to"]);
const CONTEXT_KEYS = ["plan", "planSuggested", "source", "draftId", "sector", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

function normalizeInternalPath(path: string) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/dashboard";
  }
  return path;
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <SignUpContent />
    </Suspense>
  );
}

function SignUpContent() {
  const { language } = useLanguage();
  const t = signUpContent[language];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

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
      "/dashboard";

    const [targetPathRaw, targetQueryRaw = ""] = redirectRaw.split("?");
    const safeTargetPath = normalizeInternalPath(targetPathRaw || "/dashboard");
    const targetQuery = new URLSearchParams(targetQueryRaw);

    for (const [key, value] of searchParams.entries()) {
      if (REDIRECT_KEYS.has(key)) {
        continue;
      }
      if (!targetQuery.has(key)) {
        targetQuery.set(key, value);
      }
    }

    const plan = searchParams.get("plan") ?? searchParams.get("planSuggested");
    const source = searchParams.get("source");

    if (safeTargetPath === "/checkout" && plan && !targetQuery.has("plan")) {
      targetQuery.set("plan", plan);
    }

    const serialized = targetQuery.toString();
    const targetWithQuery = `${safeTargetPath}${serialized ? `?${serialized}` : ""}`;
    const destination = targetWithQuery.startsWith(`/${pathname.split("/")[1]}/`)
      ? targetWithQuery
      : `${localePrefix}${targetWithQuery}`;

    return { destination, safeTargetPath, plan, source };
  }, [localePrefix, pathname, searchParams]);

  const signinHref = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    const qs = params.toString();
    return `${localePrefix}/signin${qs ? `?${qs}` : ""}`;
  }, [localePrefix, searchParams]);

  const schema = useMemo(() => createSignupSchema(t.signup.validation), [t.signup.validation]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const passwordValue = useWatch({ control, name: "password" }) ?? "";
  const passwordChecks = [
    { label: t.signup.validation.passwordMin, valid: passwordValue.length >= 8 },
    { label: t.signup.validation.passwordUppercase, valid: /[A-Z]/.test(passwordValue) },
    { label: t.signup.validation.passwordLowercase, valid: /[a-z]/.test(passwordValue) },
    { label: t.signup.validation.passwordNumber, valid: /[0-9]/.test(passwordValue) },
  ];

  useEffect(() => {
    trackFunnelEvent("signup_started", {
      locale: language,
      source: flow.source ?? "",
      plan: flow.plan ?? "",
      has_draft: Boolean(searchParams.get("draftId")),
    });
  }, [flow.plan, flow.source, language, searchParams]);

  async function onSubmit(data: SignupFormValues) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("name", data.name);

    const result = await signup(formData);

    if (result?.error) {
      toast.error(result.error);
    } else {
      trackFunnelEvent("signup_completed", {
        locale: language,
        source: flow.source ?? "",
        plan: flow.plan ?? "",
      });
      router.push(flow.destination);
    }
  }

  const handleSocialLogin = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(flow.destination)}`,
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
          {t.signup.title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w-sm mx-auto">
          {t.signup.subtitle}
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
              {t.signup.socialGoogle}
            </Button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-medium tracking-wide">
                {t.signup.orDivider}
              </span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium text-gray-900 ml-1">{t.signup.nameLabel}</label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register("name")}
                  className={cn(
                    "h-11 rounded-xl bg-slate-50 border-slate-200 px-4 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500/20",
                    errors.name ? "border-rose-300 focus:border-rose-300 focus:ring-rose-500/20" : "focus:border-emerald-500"
                  )}
                  placeholder={t.signup.nameLabel}
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name ? <p className="text-xs font-medium text-rose-600 ml-1">{errors.name.message}</p> : null}
              </div>
              
              <div className="space-y-1.5">
                <label htmlFor="email-address" className="text-sm font-medium text-gray-900 ml-1">{t.signup.emailLabel}</label>
                <Input
                  id="email-address"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={cn(
                    "h-11 rounded-xl bg-slate-50 border-slate-200 px-4 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500/20",
                    errors.email ? "border-rose-300 focus:border-rose-300 focus:ring-rose-500/20" : "focus:border-emerald-500"
                  )}
                  placeholder={t.signup.emailLabel}
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email ? <p className="text-xs font-medium text-rose-600 ml-1">{errors.email.message}</p> : null}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium text-gray-900 ml-1">{t.signup.passwordLabel}</label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...register("password")}
                    className={cn(
                      "h-11 rounded-xl bg-slate-50 border-slate-200 px-4 pr-11 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500/20",
                      errors.password ? "border-rose-300 focus:border-rose-300 focus:ring-rose-500/20" : "focus:border-emerald-500"
                    )}
                    placeholder={t.signup.passwordLabel}
                    aria-invalid={Boolean(errors.password)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-transparent"
                    aria-label={showPassword ? t.signup.hidePassword : t.signup.showPassword}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="grid gap-x-4 gap-y-1 grid-cols-2 pt-1 px-1">
                  {passwordChecks.map((rule) => (
                    <div
                      key={rule.label}
                      className={cn(
                        "flex items-center gap-1.5 text-[10px] transition-colors duration-200",
                        rule.valid ? "text-emerald-600 font-medium" : "text-gray-400"
                      )}
                    >
                      <div className={cn(
                        "h-1 w-1 rounded-full transition-all duration-200",
                        rule.valid ? "bg-emerald-500" : "bg-gray-300"
                      )} />
                      {rule.label}
                    </div>
                  ))}
                </div>
                {errors.password ? <p className="text-xs font-medium text-rose-600 ml-1">{errors.password.message}</p> : null}
              </div>
            </div>

            {CONTEXT_KEYS.map((key) => {
              const value = searchParams.get(key);
              if (!value) {
                return null;
              }
              return <input key={key} type="hidden" name={key} value={value} />;
            })}

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
                    {t.signup.signupButtonLoading}
                  </div>
                ) : (
                  <>
                    {t.signup.signupButton}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-center text-xs text-slate-500 mt-4">
              {t.signup.securityNote}
            </p>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            {t.signup.or}{" "}
            <Link href={signinHref} className="font-semibold text-emerald-600 hover:text-emerald-500 hover:underline underline-offset-4">
              {t.signup.existingAccountText}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
