"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  applyBusinessSourceGeneration,
  buildBusinessSourcePreview as buildBusinessSourcePreviewAction,
  getGenerationEntitlement,
} from "@/lib/supabase/actions";
import type {
  BusinessSourcePreview,
  GenerationEntitlement,
  SourceBlock,
  SourceType,
} from "@/lib/businessSourceGeneration";
import { trackFunnelEvent } from "@/lib/funnelEvents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin, Search } from "lucide-react";

type PlaceSearchResult = {
  place_id: string;
  name: string;
  formatted_address: string;
};

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function getProfileHasContent(preview: BusinessSourcePreview): boolean {
  const { profile } = preview;
  return [profile.name, profile.category, profile.description, profile.address, profile.phone, profile.website]
    .some((value) => value.trim().length > 0);
}

function getDefaultSelectedBlocks(preview: BusinessSourcePreview): Set<SourceBlock> {
  const next = new Set<SourceBlock>();

  if (getProfileHasContent(preview)) {
    next.add("profile");
  }
  if (preview.services.length > 0) {
    next.add("services");
  }
  if (preview.hours.length > 0) {
    next.add("hours");
  }

  return next;
}

export default function SourceGenerationPanel({
  businessId,
  locale,
}: {
  businessId: string;
  locale: string;
}) {
  const router = useRouter();
  const safeLocale = locale === "ca" ? "ca" : "es";
  const [sourceType, setSourceType] = useState<SourceType>("google");
  const [googleQuery, setGoogleQuery] = useState("");
  const [googleResults, setGoogleResults] = useState<PlaceSearchResult[]>([]);
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<BusinessSourcePreview | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<Set<SourceBlock>>(new Set());
  const [entitlement, setEntitlement] = useState<GenerationEntitlement | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isBuildingPreview, setIsBuildingPreview] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);

  const t = useMemo(
    () =>
      ({
        es: {
          title: "Generar desde fuente",
          subtitle:
            "Usa los datos reales de tu negocio desde Google My Business o desde tu web para regenerar información.",
          sourceLabel: "Fuente de datos",
          sourceGoogle: "Google My Business",
          sourceUrl: "URL del sitio",
          quotaUnlimited: "Generaciones ilimitadas en tu plan",
          quotaLimited: "Generaciones usadas este mes",
          searchPlaceholder: "Ej: Restaurante Casa Pepe Madrid",
          searchButton: "Buscar en Google",
          searching: "Buscando...",
          selectBusiness: "Selecciona un negocio para generar preview",
          urlPlaceholder: "https://tu-negocio.com",
          crawlButton: "Analizar URL",
          crawling: "Analizando...",
          previewTitle: "Preview generado",
          blocksTitle: "Aplicar por bloques",
          blockProfile: "Perfil (nombre, categoría, descripción, contacto)",
          blockServices: "Servicios",
          blockHours: "Horarios",
          noPreview: "Aún no hay preview generado.",
          noServices: "No se detectaron servicios en la fuente.",
          noHours: "No se detectaron horarios en la fuente.",
          applyButton: "Aplicar bloques seleccionados",
          applying: "Aplicando...",
          limitReached: "Has alcanzado el límite mensual de tu plan Starter.",
          limitReachedHint: "Sube de plan para generación ilimitada.",
          errorSearch: "No se pudo buscar en Google.",
          errorDetails: "No se pudieron cargar los detalles del negocio.",
          errorCrawl: "No se pudo analizar la URL indicada.",
          errorPreview: "No se pudo construir el preview.",
          success: "Información actualizada correctamente.",
        },
        ca: {
          title: "Generar des de font",
          subtitle:
            "Fes servir les dades reals del teu negoci des de Google My Business o des del teu web per regenerar informació.",
          sourceLabel: "Font de dades",
          sourceGoogle: "Google My Business",
          sourceUrl: "URL del lloc",
          quotaUnlimited: "Generacions il·limitades al teu pla",
          quotaLimited: "Generacions usades aquest mes",
          searchPlaceholder: "Ex: Restaurant Casa Pepe Barcelona",
          searchButton: "Cercar a Google",
          searching: "Cercant...",
          selectBusiness: "Selecciona un negoci per generar la vista prèvia",
          urlPlaceholder: "https://el-teu-negoci.com",
          crawlButton: "Analitzar URL",
          crawling: "Analitzant...",
          previewTitle: "Vista prèvia generada",
          blocksTitle: "Aplicar per blocs",
          blockProfile: "Perfil (nom, categoria, descripció, contacte)",
          blockServices: "Serveis",
          blockHours: "Horaris",
          noPreview: "Encara no hi ha vista prèvia generada.",
          noServices: "No s'han detectat serveis a la font.",
          noHours: "No s'han detectat horaris a la font.",
          applyButton: "Aplicar blocs seleccionats",
          applying: "Aplicant...",
          limitReached: "Has arribat al límit mensual del teu pla Starter.",
          limitReachedHint: "Canvia de pla per generar sense límits.",
          errorSearch: "No s'ha pogut cercar a Google.",
          errorDetails: "No s'han pogut carregar els detalls del negoci.",
          errorCrawl: "No s'ha pogut analitzar la URL indicada.",
          errorPreview: "No s'ha pogut construir la vista prèvia.",
          success: "Informació actualitzada correctament.",
        },
      })[safeLocale],
    [safeLocale]
  );

  const loadEntitlement = async () => {
    const result = await getGenerationEntitlement();
    if ("error" in result) {
      return;
    }
    setEntitlement(result.entitlement);
  };

  useEffect(() => {
    void loadEntitlement();
  }, []);

  const isLimitReached = Boolean(entitlement?.isLimited && (entitlement.remaining ?? 0) <= 0);
  const hasSelectableBlocks = selectedBlocks.size > 0;

  const resetGeneratedState = () => {
    setPreview(null);
    setSelectedBlocks(new Set());
  };

  const handleSourceChange = (nextSource: SourceType) => {
    if (sourceType === nextSource) return;
    setSourceType(nextSource);
    setGoogleResults([]);
    resetGeneratedState();

    trackFunnelEvent("source_selected", {
      source_type: nextSource,
      locale: safeLocale,
    });
  };

  const handleGoogleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!googleQuery.trim()) return;

    setIsSearching(true);
    setGoogleResults([]);
    resetGeneratedState();

    try {
      const response = await fetch(
        `/api/places/search?q=${encodeURIComponent(googleQuery.trim())}&lang=${safeLocale}`
      );
      const data = (await response.json()) as { results?: PlaceSearchResult[]; error?: string };

      if (!response.ok) {
        throw new Error(data.error || t.errorSearch);
      }

      setGoogleResults(Array.isArray(data.results) ? data.results : []);
    } catch (error) {
      console.error(error);
      toast.error(t.errorSearch);
    } finally {
      setIsSearching(false);
    }
  };

  const buildPreviewFromPayload = async (nextSourceType: SourceType, sourcePayload: unknown) => {
    setIsBuildingPreview(true);
    resetGeneratedState();

    try {
      const result = await buildBusinessSourcePreviewAction({
        sourceType: nextSourceType,
        sourcePayload,
      });

      if ("error" in result || !result.preview) {
        throw new Error("Preview error");
      }

      const nextPreview = result.preview;
      const defaultBlocks = getDefaultSelectedBlocks(nextPreview);

      setPreview(nextPreview);
      setSelectedBlocks(defaultBlocks);
      trackFunnelEvent("preview_generated", {
        source_type: nextSourceType,
        locale: safeLocale,
      });
    } catch (error) {
      console.error(error);
      toast.error(t.errorPreview);
    } finally {
      setIsBuildingPreview(false);
    }
  };

  const handleSelectGoogleResult = async (result: PlaceSearchResult) => {
    setIsBuildingPreview(true);
    try {
      const response = await fetch(
        `/api/places/details?place_id=${encodeURIComponent(result.place_id)}&lang=${safeLocale}`
      );
      const data = (await response.json()) as { result?: unknown; error?: string };

      if (!response.ok || !data.result) {
        throw new Error(data.error || t.errorDetails);
      }

      await buildPreviewFromPayload("google", data.result);
    } catch (error) {
      console.error(error);
      toast.error(t.errorDetails);
      setIsBuildingPreview(false);
    }
  };

  const handleCrawlUrl = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedUrl = url.trim();

    if (!trimmedUrl || !isValidHttpUrl(trimmedUrl)) {
      toast.error(t.errorCrawl);
      return;
    }

    setIsCrawling(true);
    resetGeneratedState();

    try {
      const startResponse = await fetch("/api/places/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmedUrl, lang: safeLocale }),
      });
      const startData = (await startResponse.json()) as { jobId?: string; error?: string };

      if (!startResponse.ok || !startData.jobId) {
        throw new Error(startData.error || t.errorCrawl);
      }

      const timeoutMs = 90_000;
      const intervalMs = 1_200;
      const startedAt = Date.now();
      let crawlResult: unknown = null;

      while (Date.now() - startedAt < timeoutMs) {
        await new Promise((resolve) => window.setTimeout(resolve, intervalMs));

        const statusResponse = await fetch(
          `/api/places/crawl?jobId=${encodeURIComponent(startData.jobId)}&url=${encodeURIComponent(trimmedUrl)}`,
          { cache: "no-store" }
        );
        const statusData = (await statusResponse.json()) as {
          status?: string;
          result?: unknown;
          error?: string;
        };

        if (!statusResponse.ok) {
          throw new Error(statusData.error || t.errorCrawl);
        }

        if (statusData.status === "completed" && statusData.result) {
          crawlResult = statusData.result;
          break;
        }
      }

      if (!crawlResult) {
        throw new Error(t.errorCrawl);
      }

      await buildPreviewFromPayload("url", crawlResult);
    } catch (error) {
      console.error(error);
      toast.error(t.errorCrawl);
    } finally {
      setIsCrawling(false);
    }
  };

  const toggleBlock = (block: SourceBlock) => {
    setSelectedBlocks((prev) => {
      const next = new Set(prev);
      if (next.has(block)) {
        next.delete(block);
      } else {
        next.add(block);
      }
      return next;
    });
  };

  const handleApply = async () => {
    if (!preview) return;

    if (isLimitReached) {
      trackFunnelEvent("limit_blocked", {
        source_type: sourceType,
        locale: safeLocale,
      });
      toast.error(t.limitReached);
      return;
    }

    const blocks = Array.from(selectedBlocks);
    if (blocks.length === 0) return;

    setIsApplying(true);
    trackFunnelEvent("apply_submitted", {
      source_type: sourceType,
      locale: safeLocale,
      blocks_count: blocks.length,
    });

    try {
      const result = await applyBusinessSourceGeneration({
        businessId,
        sourceType,
        selectedBlocks: blocks,
        previewPayload: preview,
      });

      if ("error" in result && result.error) {
        if (result.limitBlocked) {
          trackFunnelEvent("limit_blocked", {
            source_type: sourceType,
            locale: safeLocale,
          });
        }
        toast.error(result.error);
        if (result.entitlement) {
          setEntitlement(result.entitlement);
        }
        return;
      }

      toast.success(t.success);
      trackFunnelEvent("apply_success", {
        source_type: sourceType,
        locale: safeLocale,
        blocks_count: blocks.length,
      });

      if (result.entitlement) {
        setEntitlement(result.entitlement);
      } else {
        await loadEntitlement();
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(t.errorPreview);
    } finally {
      setIsApplying(false);
    }
  };

  const quotaLabel = entitlement?.isLimited
    ? `${entitlement.usedThisMonth}/${entitlement.monthlyLimit}`
    : t.quotaUnlimited;

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>{t.title}</CardTitle>
        <p className="text-sm text-slate-600">{t.subtitle}</p>
        <div className="text-xs font-medium text-slate-500">
          {entitlement?.isLimited ? `${t.quotaLimited}: ${quotaLabel}` : quotaLabel}
        </div>
        {isLimitReached && (
          <p className="text-xs font-semibold text-amber-700">
            {t.limitReached} {t.limitReachedHint}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-900">{t.sourceLabel}</p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={sourceType === "google" ? "default" : "outline"}
              onClick={() => handleSourceChange("google")}
            >
              {t.sourceGoogle}
            </Button>
            <Button
              type="button"
              variant={sourceType === "url" ? "default" : "outline"}
              onClick={() => handleSourceChange("url")}
            >
              {t.sourceUrl}
            </Button>
          </div>
        </div>

        {sourceType === "google" ? (
          <div className="space-y-3">
            <form onSubmit={handleGoogleSearch} className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={googleQuery}
                onChange={(event) => setGoogleQuery(event.target.value)}
                placeholder={t.searchPlaceholder}
                required
              />
              <Button type="submit" disabled={isSearching || isBuildingPreview}>
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.searching}
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    {t.searchButton}
                  </>
                )}
              </Button>
            </form>

            {googleResults.length > 0 && (
              <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
                {googleResults.map((result) => (
                  <button
                    key={result.place_id}
                    type="button"
                    className="flex w-full items-start gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-left hover:bg-slate-50"
                    onClick={() => handleSelectGoogleResult(result)}
                    disabled={isBuildingPreview}
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{result.name}</p>
                      <p className="text-xs text-slate-600">{result.formatted_address}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {googleResults.length === 0 && !isSearching && (
              <p className="text-xs text-slate-500">{t.selectBusiness}</p>
            )}
          </div>
        ) : (
          <form onSubmit={handleCrawlUrl} className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder={t.urlPlaceholder}
              required
            />
            <Button type="submit" disabled={isCrawling || isBuildingPreview}>
              {isCrawling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.crawling}
                </>
              ) : (
                t.crawlButton
              )}
            </Button>
          </form>
        )}

        {(isBuildingPreview || isCrawling) && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t.previewTitle}
          </div>
        )}

        {preview ? (
          <div className="space-y-4 rounded-lg border border-slate-200 p-4">
            <h4 className="text-sm font-semibold text-slate-900">{t.previewTitle}</h4>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-900">{t.blocksTitle}</p>
              <label className="flex items-start gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={selectedBlocks.has("profile")}
                  onChange={() => toggleBlock("profile")}
                  disabled={!getProfileHasContent(preview)}
                />
                <span>{t.blockProfile}</span>
              </label>
              <label className="flex items-start gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={selectedBlocks.has("services")}
                  onChange={() => toggleBlock("services")}
                  disabled={preview.services.length === 0}
                />
                <span>{t.blockServices}</span>
              </label>
              <label className="flex items-start gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={selectedBlocks.has("hours")}
                  onChange={() => toggleBlock("hours")}
                  disabled={preview.hours.length === 0}
                />
                <span>{t.blockHours}</span>
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 text-xs font-semibold uppercase text-slate-500">{t.blockProfile}</p>
                <p className="text-sm font-semibold text-slate-900">{preview.profile.name || "-"}</p>
                <p className="text-xs text-slate-600">{preview.profile.category || "-"}</p>
                <p className="mt-2 text-xs text-slate-600">{preview.profile.description || "-"}</p>
                <p className="mt-2 text-xs text-slate-600">{preview.profile.address || "-"}</p>
                <p className="text-xs text-slate-600">{preview.profile.phone || "-"}</p>
                <p className="text-xs text-slate-600">{preview.profile.website || "-"}</p>
              </div>

              <div className="space-y-3">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase text-slate-500">{t.blockServices}</p>
                  {preview.services.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-4 text-xs text-slate-700">
                      {preview.services.map((service) => (
                        <li key={service.name}>{service.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500">{t.noServices}</p>
                  )}
                </div>

                <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase text-slate-500">{t.blockHours}</p>
                  {preview.hours.length > 0 ? (
                    <ul className="space-y-1 text-xs text-slate-700">
                      {preview.hours.map((hour) => (
                        <li key={`${hour.day_of_week}-${hour.open_time}-${hour.close_time}`}>
                          {hour.day_of_week}: {hour.is_closed ? "-" : `${hour.open_time ?? "-"} - ${hour.close_time ?? "-"}`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500">{t.noHours}</p>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleApply}
              disabled={isApplying || !hasSelectableBlocks || isLimitReached}
            >
              {isApplying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.applying}
                </>
              ) : (
                t.applyButton
              )}
            </Button>
          </div>
        ) : (
          <p className="text-xs text-slate-500">{t.noPreview}</p>
        )}
      </CardContent>
    </Card>
  );
}
