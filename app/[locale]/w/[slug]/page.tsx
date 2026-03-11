import { getBusinessBySlug, getServices, getWorkingHours } from '@/lib/supabase/actions'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ContactForm from './_components/ContactForm'
import { Clock, Phone, Mail, MapPin } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const business = await getBusinessBySlug(slug)

  if (!business) {
    return {
      title: 'Negocio no encontrado',
    }
  }

  return {
    title: `${business.name} | ${business.category}`,
    description: business.description || `Bienvenido a la web de ${business.name}, ${business.category}.`,
  }
}

export default async function PublicBusinessPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const business = await getBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const [services, hours] = await Promise.all([
    getServices(business.id),
    getWorkingHours(business.id),
  ])

  const t = {
    es: {
      services: 'Nuestros Servicios',
      contact: 'Contáctanos',
      hours: 'Horario',
      closed: 'Cerrado',
      days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      poweredBy: 'Web creada con Bunnatic',
    },
    ca: {
      services: 'Els nostres Serveis',
      contact: 'Contacta amb nosaltres',
      hours: 'Horari',
      closed: 'Tancat',
      days: ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'],
      poweredBy: 'Web creada amb Bunnatic',
    },
  }[locale === 'ca' ? 'ca' : 'es']

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Hero */}
      <header className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-emerald-400 font-medium mb-2 uppercase tracking-wide text-sm">{business.category}</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{business.name}</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto whitespace-pre-wrap">{business.description}</p>
        </div>
      </header>

      <main className="flex-1 bg-slate-50 py-12 px-4 space-y-16">
        
        {/* Services */}
        {services.length > 0 && (
          <section className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 text-slate-900">{t.services}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {services.map((service: any) => (
                <div key={service.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    {service.price && (
                      <span className="bg-emerald-100 text-emerald-800 text-sm font-bold px-2 py-1 rounded">
                        {service.price}€
                      </span>
                    )}
                  </div>
                  {service.description && <p className="text-slate-600 text-sm mb-2">{service.description}</p>}
                  {service.duration && <p className="text-slate-400 text-xs">{service.duration} min</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Info & Contact Grid */}
        <section className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          
          {/* Contact Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Mail className="h-5 w-5 text-emerald-600" />
              {t.contact}
            </h2>
            <ContactForm businessId={business.id} locale={locale} />
          </div>

          {/* Contact Info & Hours */}
          <div className="space-y-6">
            {/* Hours */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-600" />
                {t.hours}
              </h2>
              <ul className="space-y-2 text-sm">
                {hours.map((h: any) => (
                  <li key={h.day_of_week} className="flex justify-between py-1 border-b border-slate-50 last:border-0">
                    <span className="font-medium text-slate-700">{t.days[h.day_of_week]}</span>
                    <span className="text-slate-500">
                      {h.is_closed ? t.closed : `${h.open_time?.slice(0, 5)} - ${h.close_time?.slice(0, 5)}`}
                    </span>
                  </li>
                ))}
                {hours.length === 0 && <p className="text-slate-500 italic">Horario no disponible</p>}
              </ul>
            </div>

            {/* Address / Phone (Placeholder if not in DB, assuming potential future fields) */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Ubicación</p>
                    <p className="text-slate-600 text-sm">{business.address || "Dirección no disponible"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Teléfono</p>
                    <p className="text-slate-600 text-sm">{business.phone || "No disponible"}</p>
                  </div>
                </div>
             </div>
          </div>

        </section>
      </main>

      <footer className="bg-white border-t py-8 text-center text-sm text-slate-500">
        <p>
          {t.poweredBy} <Link href="/" className="font-bold text-emerald-600 hover:underline">Bunnatic</Link>
        </p>
      </footer>
    </div>
  )
}
