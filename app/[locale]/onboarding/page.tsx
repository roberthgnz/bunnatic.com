"use client";

import { Suspense, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageProvider";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { trackFunnelEvent } from "@/lib/funnelEvents";
import { useSearchParams } from "next/navigation";

type StepItem = {
  id: "confirm_data" | "connect_channel" | "publish_domain";
  labelEs: string;
  labelCa: string;
};

const steps: StepItem[] = [
  {
    id: "confirm_data",
    labelEs: "Confirmar datos del negocio",
    labelCa: "Confirmar dades del negoci",
  },
  {
    id: "connect_channel",
    labelEs: "Conectar WhatsApp o teléfono",
    labelCa: "Connectar WhatsApp o telèfon",
  },
  {
    id: "publish_domain",
    labelEs: "Publicar dominio",
    labelCa: "Publicar domini",
  },
];

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <OnboardingContent />
    </Suspense>
  );
}

function OnboardingContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") ?? "starter";
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const doneCount = useMemo(
    () => steps.filter((step) => completed[step.id]).length,
    [completed]
  );

  function toggleStep(stepId: StepItem["id"]) {
    setCompleted((prev) => {
      const nextState = !prev[stepId];
      const next = { ...prev, [stepId]: nextState };
      if (nextState) {
        trackFunnelEvent("onboarding_step_completed", {
          locale: language,
          plan,
          step_id: stepId,
          completed_count: Object.values(next).filter(Boolean).length,
        });
      }
      return next;
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-gray-900">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {language === "es" ? "Activa tu web en minutos" : "Activa la teva web en minuts"}
          </h1>
          <p className="mt-3 text-gray-600">
            {language === "es"
              ? "Completa estos 3 pasos para conseguir el primer resultado en menos de 24h."
              : "Completa aquests 3 passos per obtenir el primer resultat en menys de 24h."}
          </p>
          <p className="mt-2 text-sm text-emerald-700">
            {language === "es" ? "Plan activo:" : "Pla actiu:"} {plan.toUpperCase()}
          </p>

          <div className="mt-8 space-y-3">
            {steps.map((step) => {
              const isDone = Boolean(completed[step.id]);
              return (
                <Button
                  key={step.id}
                  type="button"
                  variant="outline"
                  onClick={() => toggleStep(step.id)}
                  className={`h-auto w-full justify-between rounded-2xl px-4 py-4 text-left ${
                    isDone ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-gray-200 bg-white"
                  }`}
                >
                  <span>{language === "es" ? step.labelEs : step.labelCa}</span>
                  <CheckCircle2 className={`h-5 w-5 ${isDone ? "text-emerald-600" : "text-gray-300"}`} />
                </Button>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
            {language === "es"
              ? `Progreso: ${doneCount}/3 pasos completados`
              : `Progrés: ${doneCount}/3 passos completats`}
          </div>
        </div>
      </div>
    </main>
  );
}
