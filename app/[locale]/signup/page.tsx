"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CircleCheck, Eye, EyeOff, MapPin, Sparkles, Zap } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { createSignupSchema, type SignupFormValues } from "@/lib/validations/signup";
import { cn } from "@/lib/utils";

const signUpContent = {
  es: {
    navbar: {
      logo: "Wibloz",
    },
    crear: {
      back: "Volver",
    },
    signup: {
      title: "Crear cuenta",
      subtitle: "Introduce tus datos para acceder al panel de Wibloz.",
      existingAccountText: "Iniciar sesión",
      or: "¿Ya tienes cuenta?",
      nameLabel: "Nombre completo",
      emailLabel: "Correo electrónico",
      passwordLabel: "Contraseña",
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña",
      nameHint: "Nombre y apellidos del titular de la cuenta.",
      emailHint: "Usaremos este correo para acceso y notificaciones clave.",
      passwordHint: "Mínimo 8 caracteres con mayúscula, minúscula y número.",
      signupButton: "Crear cuenta y continuar",
      signupButtonLoading: "Creando cuenta...",
      securityNote: "Tus datos viajan cifrados y se procesan de forma segura.",
      trust1: "Acceso seguro",
      trust2: "Validación en tiempo real",
      trust3: "Configuración guiada",
      stepBadge: "Registro",
      validation: {
        nameRequired: "El nombre es obligatorio.",
        nameMin: "El nombre debe tener al menos 2 caracteres.",
        nameMax: "El nombre no puede superar 80 caracteres.",
        emailRequired: "El correo es obligatorio.",
        emailInvalid: "Introduce un correo válido.",
        passwordRequired: "La contraseña es obligatoria.",
        passwordMin: "Debe tener al menos 8 caracteres.",
        passwordUppercase: "Incluye al menos una mayúscula.",
        passwordLowercase: "Incluye al menos una minúscula.",
        passwordNumber: "Incluye al menos un número.",
      },
    },
  },
  ca: {
    navbar: {
      logo: "Wibloz",
    },
    crear: {
      back: "Tornar",
    },
    signup: {
      title: "Crear compte",
      subtitle: "Introdueix les teves dades per accedir al panell de Wibloz.",
      existingAccountText: "Iniciar sessió",
      or: "Ja tens compte?",
      nameLabel: "Nom complet",
      emailLabel: "Correu electrònic",
      passwordLabel: "Contrasenya",
      showPassword: "Mostra la contrasenya",
      hidePassword: "Amaga la contrasenya",
      nameHint: "Nom i cognoms del titular del compte.",
      emailHint: "Farem servir aquest correu per accés i notificacions clau.",
      passwordHint: "Mínim 8 caràcters amb majúscula, minúscula i número.",
      signupButton: "Crear compte i continuar",
      signupButtonLoading: "Creant compte...",
      securityNote: "Les teves dades viatgen xifrades i es processen de forma segura.",
      trust1: "Accés segur",
      trust2: "Validació en temps real",
      trust3: "Configuració guiada",
      stepBadge: "Registre",
      validation: {
        nameRequired: "El nom és obligatori.",
        nameMin: "El nom ha de tenir almenys 2 caràcters.",
        nameMax: "El nom no pot superar 80 caràcters.",
        emailRequired: "El correu és obligatori.",
        emailInvalid: "Introdueix un correu vàlid.",
        passwordRequired: "La contrasenya és obligatòria.",
        passwordMin: "Ha de tenir almenys 8 caràcters.",
        passwordUppercase: "Inclou almenys una majúscula.",
        passwordLowercase: "Inclou almenys una minúscula.",
        passwordNumber: "Inclou almenys un número.",
      },
    },
  },
} as const;

const REDIRECT_KEYS = new Set(["redirect", "next", "returnTo", "to"]);
const CONTEXT_KEYS = ["plan", "source", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

function normalizeInternalPath(path: string) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/crear";
  }
  return path;
}

export default function SignUpPage() {
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

  const flow = useMemo(() => {
    const redirectRaw =
      searchParams.get("redirect") ??
      searchParams.get("next") ??
      searchParams.get("returnTo") ??
      searchParams.get("to") ??
      "/crear";

    const [targetPathRaw, targetQueryRaw = ""] = redirectRaw.split("?");
    const safeTargetPath = normalizeInternalPath(targetPathRaw || "/crear");
    const targetQuery = new URLSearchParams(targetQueryRaw);

    for (const [key, value] of searchParams.entries()) {
      if (REDIRECT_KEYS.has(key)) {
        continue;
      }
      if (!targetQuery.has(key)) {
        targetQuery.set(key, value);
      }
    }

    const serialized = targetQuery.toString();
    const targetWithQuery = `${safeTargetPath}${serialized ? `?${serialized}` : ""}`;
    const destination = targetWithQuery.startsWith(`/${pathname.split("/")[1]}/`)
      ? targetWithQuery
      : `${localePrefix}${targetWithQuery}`;

    const plan = searchParams.get("plan");
    const source = searchParams.get("source");

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

  function onSubmit() {
    router.push(flow.destination);
  }

  return (
    <main className="min-h-screen bg-slate-100 font-sans text-gray-900 flex flex-col">
      <nav className="border-b border-slate-200 bg-white">
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

      <div className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-2xl gap-6">
          <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100">
                {t.signup.stepBadge}
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                {t.signup.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600">{t.signup.subtitle}</p>
              <p className="mt-2 text-sm text-gray-600">
                {t.signup.or}{" "}
                <Link href={signinHref} className="font-medium text-emerald-600 hover:text-emerald-500">
                  {t.signup.existingAccountText}
                </Link>
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-sm font-medium text-gray-800">{t.signup.nameLabel}</label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    {...register("name")}
                    className={cn(
                      "block w-full rounded-xl border px-3 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40 sm:text-sm",
                      errors.name ? "border-rose-400 bg-rose-50/40" : "border-gray-300 bg-white"
                    )}
                    placeholder={t.signup.nameLabel}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby="name-help name-error"
                  />
                  <p id="name-help" className="text-xs text-gray-500">{t.signup.nameHint}</p>
                  {errors.name ? <p id="name-error" className="text-xs font-medium text-rose-600">{errors.name.message}</p> : null}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email-address" className="text-sm font-medium text-gray-800">{t.signup.emailLabel}</label>
                  <input
                    id="email-address"
                    type="email"
                    autoComplete="email"
                    {...register("email")}
                    className={cn(
                      "block w-full rounded-xl border px-3 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40 sm:text-sm",
                      errors.email ? "border-rose-400 bg-rose-50/40" : "border-gray-300 bg-white"
                    )}
                    placeholder={t.signup.emailLabel}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby="email-help email-error"
                  />
                  <p id="email-help" className="text-xs text-gray-500">{t.signup.emailHint}</p>
                  {errors.email ? <p id="email-error" className="text-xs font-medium text-rose-600">{errors.email.message}</p> : null}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-sm font-medium text-gray-800">{t.signup.passwordLabel}</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      {...register("password")}
                      className={cn(
                        "block w-full rounded-xl border px-3 py-3 pr-11 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40 sm:text-sm",
                        errors.password ? "border-rose-400 bg-rose-50/40" : "border-gray-300 bg-white"
                      )}
                      placeholder={t.signup.passwordLabel}
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby="password-help password-error"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-700"
                      aria-label={showPassword ? t.signup.hidePassword : t.signup.showPassword}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p id="password-help" className="text-xs text-gray-500">{t.signup.passwordHint}</p>
                  <div className="grid gap-1 sm:grid-cols-2">
                    {passwordChecks.map((rule) => (
                      <p
                        key={rule.label}
                        className={cn("text-xs", rule.valid ? "text-emerald-700" : "text-gray-500")}
                      >
                        {rule.valid ? "✓" : "○"} {rule.label}
                      </p>
                    ))}
                  </div>
                  {errors.password ? <p id="password-error" className="text-xs font-medium text-rose-600">{errors.password.message}</p> : null}
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 ring-1 ring-slate-200">
                {t.signup.securityNote}
              </div>

              {CONTEXT_KEYS.map((key) => {
                const value = searchParams.get(key);
                if (!value) {
                  return null;
                }
                return <input key={key} type="hidden" name={key} value={value} />;
              })}

              <div>
                <Button
                  variant="default"
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={cn(
                    "group relative flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
                    !isValid || isSubmitting
                      ? "cursor-not-allowed bg-emerald-300"
                      : "bg-emerald-500 hover:bg-emerald-400"
                  )}
                >
                  {isSubmitting ? t.signup.signupButtonLoading : t.signup.signupButton}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 ring-1 ring-emerald-100">
                  <CircleCheck className="h-3.5 w-3.5 text-emerald-600" />
                  {t.signup.trust1}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 ring-1 ring-emerald-100">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  {t.signup.trust2}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 ring-1 ring-emerald-100">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  {t.signup.trust3}
                </span>
              </div>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}
