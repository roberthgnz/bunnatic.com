import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  Globe2,
  MapPin,
  Phone,
  User,
  ExternalLink,
  Settings,
  ChevronRight,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBusinessBySlug } from "@/lib/supabase/actions";

export default async function BusinessOverviewPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  const t = {
    es: {
      profile: "Perfil del negocio",
      profileDesc:
        "Información principal que verán tus clientes en canales públicos.",
      category: "Categoría",
      description: "Descripción",
      contact: "Contacto",
      contactDesc: "Canales de contacto para reservas, consultas y soporte.",
      address: "Dirección",
      phone: "Teléfono",
      email: "Email",
      website: "Sitio web",
      empty: "Sin definir",
      setup: "Checklist de configuración",
      setupDesc:
        "Completa estos puntos para tener una operación estable y lista para escalar.",
      configure: "Ir a configuración",
      done: "Completado",
      pending: "Pendiente",
      status: "Estado",
      ready: "Activo",
      tasks: {
        category: "Definir categoría del negocio",
        description: "Publicar descripción comercial",
        contact: "Configurar teléfono o email",
        address: "Añadir dirección",
        website: "Connectar sitio web",
      },
    },
    ca: {
      profile: "Perfil del negoci",
      profileDesc:
        "Informació principal que veuran els teus clients en canals públics.",
      category: "Categoria",
      description: "Descripció",
      contact: "Contacte",
      contactDesc: "Canals de contacte per reserves, consultes i suport.",
      address: "Adreça",
      phone: "Telèfon",
      email: "Email",
      website: "Lloc web",
      empty: "Sense definir",
      setup: "Checklist de configuració",
      setupDesc:
        "Completa aquests punts per tenir una operació estable i preparada per escalar.",
      configure: "Anar a configuració",
      done: "Completat",
      pending: "Pendent",
      status: "Estat",
      ready: "Actiu",
      tasks: {
        category: "Definir categoria del negoci",
        description: "Publicar descripció comercial",
        contact: "Configurar telèfon o email",
        address: "Afegir adreça",
        website: "Connectar lloc web",
      },
    },
  }[locale === "ca" ? "ca" : "es"];

  const setupTasks = [
    {
      key: "category",
      label: t.tasks.category,
      done: Boolean(business.category?.trim()),
    },
    {
      key: "description",
      label: t.tasks.description,
      done: Boolean(business.description?.trim()),
    },
    {
      key: "contact",
      label: t.tasks.contact,
      done: Boolean(business.phone?.trim()) || Boolean(business.email?.trim()),
    },
    {
      key: "address",
      label: t.tasks.address,
      done: Boolean(business.address?.trim()),
    },
    {
      key: "website",
      label: t.tasks.website,
      done: Boolean(business.website?.trim()),
    },
  ];

  const recommendationsCount = setupTasks.filter((t) => !t.done).length;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
      {/* Top Section - Production Deployment Style */}
      <Card className="overflow-hidden border-slate-200 shadow-sm rounded-xl">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="font-medium text-slate-900">{t.profile}</div>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8 text-xs font-medium hidden sm:flex"
            >
              <Link href={`/${locale}/dashboard/businesses/${slug}/settings`}>
                <Settings className="w-3.5 h-3.5 mr-2" />
                {t.configure}
              </Link>
            </Button>
            <Button asChild size="sm" className="h-8 text-xs font-medium">
              <Link href={`/${locale}/w/${slug}`} target="_blank">
                Visit
                <ExternalLink className="w-3.5 h-3.5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Content Split */}
        <div className="flex flex-col md:flex-row bg-white">
          {/* Left Large Area */}
          <div className="flex-1 p-8 md:p-16 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/50 min-h-[280px]">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-2 text-center">
              {business.name || t.profile}
            </h2>
          </div>

          {/* Right Details Area */}
          <div className="w-full md:w-96 p-6 flex flex-col justify-center space-y-6">
            <div>
              <div className="text-xs text-slate-500 mb-1">{t.description}</div>
              <div className="text-sm font-medium text-slate-900 line-clamp-3">
                {business.description || (
                  <span className="text-slate-400 italic font-normal">
                    {t.empty}
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1">{t.category}</div>
              <div className="text-sm font-medium text-slate-900 flex items-center gap-2">
                {business.category ? (
                  business.category
                ) : (
                  <span className="text-slate-400 italic font-normal">
                    {t.empty}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div>
                <div className="text-xs text-slate-500 mb-1">{t.status}</div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  {t.ready}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Row */}
        <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-3 flex items-center gap-3">
          <Link
            href={`/${locale}/dashboard/businesses/${slug}/settings`}
            className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-slate-400" />
            {t.configure}
          </Link>
          {recommendationsCount > 0 && (
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200 text-xs font-normal"
            >
              {recommendationsCount} Recomendaciones
            </Badge>
          )}
        </div>
      </Card>

      {/* 3 Columns Details */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 shadow-sm rounded-xl hover:border-slate-300 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-5 pt-5">
            <CardTitle className="text-sm font-medium text-slate-900 flex items-center gap-2">
              {t.contact}{" "}
              <span className="text-slate-400 font-normal text-xs ml-1">
                24h
              </span>
            </CardTitle>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent className="px-5 pb-5 mt-2">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                <div className="text-sm text-slate-600 truncate flex-1">
                  {business.phone || (
                    <span className="text-slate-400 italic">{t.empty}</span>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-slate-400 mt-0.5" />
                <div className="text-sm text-slate-600 truncate flex-1">
                  {business.email || (
                    <span className="text-slate-400 italic">{t.empty}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm rounded-xl hover:border-slate-300 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-5 pt-5">
            <CardTitle className="text-sm font-medium text-slate-900 flex items-center gap-2">
              {t.address}{" "}
              <span className="text-slate-400 font-normal text-xs ml-1">
                6h
              </span>
            </CardTitle>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent className="px-5 pb-5 mt-2 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
              <div className="text-sm text-slate-600 line-clamp-2 flex-1">
                {business.address || (
                  <span className="text-slate-400 italic">{t.empty}</span>
                )}
              </div>
            </div>
            {/* Fake chart matching Observability vibe */}
            <div className="h-8 flex items-end gap-1 px-7 mt-2 opacity-20">
              <div className="w-full h-[2px] bg-blue-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm rounded-xl hover:border-slate-300 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-5 pt-5">
            <CardTitle className="text-sm font-medium text-slate-900 flex items-center gap-2">
              {t.website}{" "}
              <span className="text-slate-400 font-normal text-xs ml-1">
                1w
              </span>
            </CardTitle>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent className="px-5 pb-5 mt-2">
            <div className="flex items-start gap-3">
              <Globe2 className="w-4 h-4 text-slate-400 mt-0.5" />
              <div className="text-sm text-slate-600 truncate flex-1">
                {business.website ? (
                  <a
                    href={
                      business.website.startsWith("http")
                        ? business.website
                        : `https://${business.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-slate-900 font-medium"
                  >
                    {business.website}
                  </a>
                ) : (
                  <span className="text-slate-400 italic">{t.empty}</span>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 pl-7">
              <div className="w-2 h-2 rounded-full border border-slate-300"></div>
              0 online
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section - Active Branches Style */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900 mb-4">
          {t.setup}
        </h3>
        <Card className="border-slate-200 shadow-sm overflow-hidden rounded-xl">
          <div className="divide-y divide-slate-100">
            {setupTasks.map((task) => (
              <div
                key={task.key}
                className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 bg-white hover:bg-slate-50/80 transition-colors gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="mt-0.5 sm:mt-0">
                    {task.done ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">
                      {task.label}
                    </span>
                    <span className="text-xs text-slate-500 sm:hidden mt-0.5">
                      {task.done ? t.done : t.pending}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-500 pl-8 sm:pl-0">
                  <Badge
                    variant={task.done ? "secondary" : "outline"}
                    className={`hidden sm:inline-flex ${task.done ? "bg-slate-100 text-slate-700 hover:bg-slate-100 border-transparent" : "text-slate-500"}`}
                  >
                    {task.done ? t.done : t.pending}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hidden sm:flex"
                    asChild
                  >
                    <Link
                      href={`/${locale}/dashboard/businesses/${slug}/settings`}
                    >
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
