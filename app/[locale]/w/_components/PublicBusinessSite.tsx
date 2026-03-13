import Link from 'next/link'
import ContactForm from '../[slug]/_components/ContactForm'
import { Clock, Phone, Mail, MapPin } from 'lucide-react'

type PublicBusinessSiteProps = {
  business: {
    id: string
    slug: string
    name: string
    category: string | null
    description: string | null
    address: string | null
    phone: string | null
  }
  locale: string
  services: Array<{
    id: string
    name: string
    description: string | null
    price: number | null
    duration: number | null
  }>
  hours: Array<{
    day_of_week: number
    open_time: string | null
    close_time: string | null
    is_closed: boolean
  }>
}

export default function PublicBusinessSite({
  business,
  locale,
  services,
  hours,
}: PublicBusinessSiteProps) {
  const t = {
    es: {
      services: 'Nuestros Servicios',
      contact: 'Contáctanos',
      hours: 'Horario',
      closed: 'Cerrado',
      days: [
        'Domingo',
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
      ],
      poweredBy: 'Web creada con Bunnatic',
      hoursUnavailable: 'Horario no disponible',
      addressUnavailable: 'Dirección no disponible',
      phoneUnavailable: 'No disponible',
      location: 'Ubicación',
      phone: 'Teléfono',
    },
    ca: {
      services: 'Els nostres Serveis',
      contact: 'Contacta amb nosaltres',
      hours: 'Horari',
      closed: 'Tancat',
      days: [
        'Diumenge',
        'Dilluns',
        'Dimarts',
        'Dimecres',
        'Dijous',
        'Divendres',
        'Dissabte',
      ],
      poweredBy: 'Web creada amb Bunnatic',
      hoursUnavailable: 'Horari no disponible',
      addressUnavailable: 'Adreça no disponible',
      phoneUnavailable: 'No disponible',
      location: 'Ubicació',
      phone: 'Telèfon',
    },
  }[locale === 'ca' ? 'ca' : 'es']

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <header className="bg-slate-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-2 text-sm font-medium tracking-wide text-emerald-400 uppercase">
            {business.category}
          </p>
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            {business.name}
          </h1>
          <p className="mx-auto max-w-2xl text-lg whitespace-pre-wrap text-slate-300">
            {business.description}
          </p>
        </div>
      </header>

      <main className="flex-1 space-y-16 bg-slate-50 px-4 py-12">
        {services.length > 0 && (
          <section className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
              {t.services}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                    {service.price && (
                      <span className="rounded bg-emerald-100 px-2 py-1 text-sm font-bold text-emerald-800">
                        {service.price}€
                      </span>
                    )}
                  </div>
                  {service.description && (
                    <p className="mb-2 text-sm text-slate-600">
                      {service.description}
                    </p>
                  )}
                  {service.duration && (
                    <p className="text-xs text-slate-400">
                      {service.duration} min
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
              <Mail className="h-5 w-5 text-emerald-600" />
              {t.contact}
            </h2>
            <ContactForm businessId={business.id} locale={locale} />
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <Clock className="h-5 w-5 text-emerald-600" />
                {t.hours}
              </h2>
              <ul className="space-y-2 text-sm">
                {hours.map((h) => (
                  <li
                    key={h.day_of_week}
                    className="flex justify-between border-b border-slate-50 py-1 last:border-0"
                  >
                    <span className="font-medium text-slate-700">
                      {t.days[h.day_of_week]}
                    </span>
                    <span className="text-slate-500">
                      {h.is_closed
                        ? t.closed
                        : `${h.open_time?.slice(0, 5)} - ${h.close_time?.slice(0, 5)}`}
                    </span>
                  </li>
                ))}
                {hours.length === 0 && (
                  <p className="text-slate-500 italic">{t.hoursUnavailable}</p>
                )}
              </ul>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-slate-900">{t.location}</p>
                  <p className="text-sm text-slate-600">
                    {business.address || t.addressUnavailable}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-slate-900">{t.phone}</p>
                  <p className="text-sm text-slate-600">
                    {business.phone || t.phoneUnavailable}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white py-8 text-center text-sm text-slate-500">
        <p>
          {t.poweredBy}{' '}
          <Link href="/" className="font-bold text-emerald-600 hover:underline">
            Bunnatic
          </Link>
        </p>
      </footer>
    </div>
  )
}
