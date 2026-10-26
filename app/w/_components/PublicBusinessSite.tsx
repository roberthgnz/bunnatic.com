import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react'
import ContactForm from '../[slug]/_components/ContactForm'
import { getBaseUrl } from '@/lib/seo'
import {
  formatCategory,
  formatDuration,
  formatPrice,
  getCity,
  getHoursRows,
  getMapsHref,
  getOpenStatus,
  getSitePalette,
  parseSocialLinks,
  safeImageUrl,
  splitDescription,
  toTelHref,
} from './publicSiteUtils'

type PublicBusinessSiteProps = {
  business: {
    id: string
    slug: string
    name: string
    category: string | null
    description: string | null
    address: string | null
    phone: string | null
    email?: string | null
    city?: string | null
    images?: string[] | null
    social_links?: unknown
    google_place_id?: string | null
  }
  locale: string
  services: Array<{
    id: string
    name: string
    description: string | null
    price: number | null
    duration: number | null
    image_url?: string | null
  }>
  hours: Array<{
    day_of_week: number
    open_time: string | null
    close_time: string | null
    is_closed: boolean
  }>
}

/** Shared focus ring: visible on every interactive element of the site. */
const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--site-accent)'

const eyebrow = 'text-[11px] font-medium tracking-[0.2em] uppercase opacity-70'

export default function PublicBusinessSite({
  business,
  locale,
  services,
  hours,
}: PublicBusinessSiteProps) {
  const now = new Date()
  const category = formatCategory(business.category)
  const city = getCity(business.city, business.address)
  const { lead, rest } = splitDescription(business.description)
  const telHref = toTelHref(business.phone)
  const email = business.email?.trim() || null
  const { links: socialLinks, whatsapp } = parseSocialLinks(
    business.social_links
  )
  const photos = (business.images ?? [])
    .map(safeImageUrl)
    .filter((url): url is string => Boolean(url))
  const cover = photos[0] ?? null
  const gallery = photos.slice(1, 7)
  const hoursRows = getHoursRows(hours, now)
  const status = getOpenStatus(hours, now)
  const todayRow = hoursRows.find((row) => row.isToday)
  const mapsHref = business.address
    ? getMapsHref(business.name, business.address, business.google_place_id)
    : null
  const hasVisitInfo = hoursRows.length > 0 || Boolean(business.address)
  const subtitle = [category, city].filter(Boolean).join(' en ')

  const primaryAction = telHref
    ? { href: telHref, label: 'Llamar', icon: Phone, external: false }
    : whatsapp
      ? {
          href: whatsapp,
          label: 'WhatsApp',
          icon: MessageCircle,
          external: true,
        }
      : {
          href: '#contacto',
          label: 'Contactar',
          icon: Mail,
          external: false,
        }
  const PrimaryIcon = primaryAction.icon
  const externalProps = (external: boolean) =>
    external ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  const nav = [
    services.length > 0 && { href: '#servicios', label: 'Servicios' },
    hasVisitInfo && { href: '#visitanos', label: 'Horario y ubicación' },
    { href: '#contacto', label: 'Contacto' },
  ].filter((item): item is { href: string; label: string } => Boolean(item))

  const glance = (
    <dl className="grid gap-5 text-sm">
      {status ? (
        <div className="flex gap-3">
          <dt className="sr-only">Estado</dt>
          <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <dd>
            <span className="flex items-center gap-2 font-semibold">
              <span
                className={`size-2 rounded-full ${status.open ? 'bg-emerald-600' : 'bg-[#b4532a]'}`}
                aria-hidden="true"
              />
              {status.label}
            </span>
            {status.detail ? (
              <span className="mt-0.5 block opacity-75">{status.detail}</span>
            ) : null}
            {todayRow ? (
              <span className="mt-0.5 block opacity-75">
                Hoy: {todayRow.value}
              </span>
            ) : null}
          </dd>
        </div>
      ) : null}
      {business.address ? (
        <div className="flex gap-3">
          <dt className="sr-only">Dirección</dt>
          <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <dd>
            <span className="block leading-6">{business.address}</span>
            {mapsHref ? (
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-1 inline-flex items-center gap-1 font-semibold underline decoration-current/30 underline-offset-4 hover:decoration-current ${focusRing}`}
              >
                Cómo llegar
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
                <span className="sr-only">(se abre en Google Maps)</span>
              </a>
            ) : null}
          </dd>
        </div>
      ) : null}
      {business.phone && telHref ? (
        <div className="flex gap-3">
          <dt className="sr-only">Teléfono</dt>
          <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <dd>
            <a
              href={telHref}
              className={`font-semibold underline decoration-current/30 underline-offset-4 hover:decoration-current ${focusRing}`}
            >
              {business.phone}
            </a>
          </dd>
        </div>
      ) : null}
    </dl>
  )
  const hasGlance = Boolean(status || business.address || telHref)

  return (
    <div
      lang={locale}
      className="flex min-h-screen flex-col font-sans antialiased"
      style={getSitePalette(business.category, business.name)}
    >
      <a
        href="#contenido"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-md bg-(--site-accent) px-4 py-3 text-sm font-semibold text-white focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Saltar al contenido
      </a>

      {/* Sticky compact header */}
      <header className="sticky top-0 z-50 border-b border-current/10 bg-(--site-surface)/90 backdrop-blur-md supports-[backdrop-filter]:bg-(--site-surface)/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <a
            href="#inicio"
            className={`min-w-0 truncate font-serif text-xl tracking-tight sm:text-2xl ${focusRing}`}
          >
            {business.name}
          </a>
          <div className="flex shrink-0 items-center gap-6">
            <nav aria-label="Secciones" className="hidden md:block">
              <ul className="flex gap-6 text-sm">
                {nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={`opacity-80 hover:underline hover:underline-offset-4 hover:opacity-100 ${focusRing}`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <a
              href={primaryAction.href}
              {...externalProps(primaryAction.external)}
              className={`inline-flex min-h-10 items-center gap-2 rounded-full bg-(--site-accent) px-4 text-sm font-semibold text-white hover:opacity-90 motion-safe:transition-opacity ${focusRing}`}
            >
              <PrimaryIcon className="size-4" aria-hidden="true" />
              {primaryAction.label}
              {primaryAction.external ? (
                <span className="sr-only">(se abre en otra pestaña)</span>
              ) : null}
            </a>
          </div>
        </div>
      </header>

      <main id="contenido" className="flex-1">
        {/* Hero */}
        <section
          id="inicio"
          aria-labelledby="titulo-negocio"
          className={
            cover ? 'relative isolate overflow-hidden text-white' : 'relative'
          }
        >
          {cover ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- remote business photos aren't in next.config image domains */}
              <img
                src={cover}
                alt=""
                width={1600}
                height={1000}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 -z-20 size-full object-cover"
              />
              <div
                className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/45 to-black/25 md:bg-gradient-to-r md:from-black/75 md:via-black/45 md:to-black/10"
                aria-hidden="true"
              />
            </>
          ) : null}
          <div
            className={`mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end lg:gap-16 ${cover ? 'pt-28 pb-12 sm:pt-40 sm:pb-16' : 'pt-14 pb-14 sm:pt-24 sm:pb-20'}`}
          >
            <div>
              {category || city ? (
                <p className={`flex items-center gap-2 ${eyebrow}`}>
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {[city, category].filter(Boolean).join(' · ')}
                </p>
              ) : null}
              <h1
                id="titulo-negocio"
                className="mt-5 font-serif text-5xl leading-[1.02] tracking-tight text-balance sm:text-7xl lg:text-8xl"
              >
                {business.name}
              </h1>
              {subtitle ? (
                <p className="mt-4 font-serif text-2xl italic opacity-80 sm:text-3xl">
                  {subtitle}
                </p>
              ) : null}
              {lead ? (
                <p
                  className={`mt-6 max-w-xl text-base leading-7 whitespace-pre-line sm:text-lg sm:leading-8 ${cover ? 'text-white/90' : 'opacity-80'}`}
                >
                  {lead}
                </p>
              ) : null}
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={primaryAction.href}
                  {...externalProps(primaryAction.external)}
                  className={`inline-flex min-h-12 items-center gap-3 rounded-full px-6 text-sm font-semibold hover:opacity-90 motion-safe:transition-opacity ${cover ? 'bg-white text-(--site-ink)' : 'bg-(--site-accent) text-white'} ${focusRing}`}
                >
                  <PrimaryIcon className="size-4" aria-hidden="true" />
                  {primaryAction.label === 'Llamar'
                    ? `Llamar al ${business.phone}`
                    : primaryAction.label === 'WhatsApp'
                      ? 'Escríbenos por WhatsApp'
                      : 'Escríbenos'}
                  {primaryAction.external ? (
                    <span className="sr-only">(se abre en otra pestaña)</span>
                  ) : null}
                </a>
                {whatsapp && primaryAction.label !== 'WhatsApp' ? (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex min-h-12 items-center gap-2 rounded-full border border-current/40 px-6 text-sm font-semibold hover:border-current ${focusRing}`}
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    WhatsApp
                    <span className="sr-only">(se abre en otra pestaña)</span>
                  </a>
                ) : null}
                {services.length > 0 ? (
                  <a
                    href="#servicios"
                    className={`inline-flex min-h-12 items-center gap-2 rounded-full border border-current/40 px-6 text-sm font-semibold hover:border-current ${focusRing}`}
                  >
                    Ver servicios
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </div>

            {hasGlance ? (
              <aside
                aria-label="Información rápida"
                className={`rounded-2xl p-6 ${cover ? 'bg-white/95 text-(--site-ink) shadow-2xl shadow-black/20' : 'border border-current/10 bg-white/60'}`}
              >
                {glance}
              </aside>
            ) : null}
          </div>
        </section>

        {/* About */}
        {rest ? (
          <section
            id="nosotros"
            aria-labelledby="titulo-nosotros"
            className="mx-auto grid max-w-6xl scroll-mt-20 gap-6 border-t border-current/10 px-5 py-16 sm:px-8 sm:py-24 md:grid-cols-[1fr_1.2fr] md:gap-16"
          >
            <div>
              <p className={eyebrow}>Sobre nosotros</p>
              <h2
                id="titulo-nosotros"
                className="mt-4 font-serif text-4xl leading-tight sm:text-5xl"
              >
                Conoce <span className="italic">{business.name}</span>
              </h2>
            </div>
            <p className="max-w-xl text-base leading-8 whitespace-pre-line opacity-80">
              {rest}
            </p>
          </section>
        ) : null}

        {/* Gallery */}
        {gallery.length > 0 ? (
          <section
            aria-label="Fotos"
            className="mx-auto max-w-6xl px-5 pb-4 sm:px-8"
          >
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {gallery.map((src, index) => (
                <li
                  key={src}
                  className={`overflow-hidden rounded-2xl bg-(--site-soft) ${index === 0 && gallery.length > 2 ? 'col-span-2 row-span-2 md:col-span-1' : ''}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote business photos aren't in next.config image domains */}
                  <img
                    src={src}
                    alt={`Foto ${index + 2} de ${business.name}`}
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] size-full object-cover"
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Services */}
        {services.length > 0 ? (
          <section
            id="servicios"
            aria-labelledby="titulo-servicios"
            className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 sm:px-8 sm:py-24"
          >
            <div>
              <div>
                <p className={eyebrow}>Lo que hacemos</p>
                <h2
                  id="titulo-servicios"
                  className="mt-4 font-serif text-4xl leading-tight sm:text-5xl"
                >
                  Nuestros <span className="italic">servicios</span>
                </h2>
              </div>
            </div>
            <ul className="mt-10 border-t border-current/15">
              {services.map((service, index) => {
                const price = formatPrice(service.price)
                const duration = formatDuration(service.duration)
                const image = safeImageUrl(service.image_url)
                return (
                  <li
                    key={service.id}
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-b border-current/15 py-6 sm:gap-x-8 sm:py-7"
                  >
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element -- remote service photos aren't in next.config image domains
                      <img
                        src={image}
                        alt=""
                        width={72}
                        height={72}
                        loading="lazy"
                        decoding="async"
                        className="size-14 rounded-xl object-cover sm:size-[72px]"
                      />
                    ) : (
                      <span
                        className="w-8 pt-1 font-serif text-xl opacity-45 sm:w-12 sm:text-2xl"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-lg leading-snug font-semibold sm:text-xl">
                        {service.name}
                      </h3>
                      {service.description ? (
                        <p className="mt-2 max-w-2xl text-sm leading-6 opacity-75 sm:text-[15px] sm:leading-7">
                          {service.description}
                        </p>
                      ) : null}
                      {duration ? (
                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium opacity-75">
                          <Clock className="size-3.5" aria-hidden="true" />
                          <span className="sr-only">Duración:</span>
                          {duration}
                        </p>
                      ) : null}
                    </div>
                    {price ? (
                      <p className="pt-0.5 text-right font-serif text-xl whitespace-nowrap sm:text-2xl">
                        <span className="sr-only">Precio: </span>
                        {price}
                      </p>
                    ) : (
                      <span />
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        ) : null}

        {/* Hours & location */}
        {hasVisitInfo ? (
          <section
            id="visitanos"
            aria-labelledby="titulo-visitanos"
            className="scroll-mt-16 bg-(--site-soft)"
          >
            <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
              <p className={eyebrow}>Te esperamos</p>
              <h2
                id="titulo-visitanos"
                className="mt-4 font-serif text-4xl leading-tight sm:text-5xl"
              >
                Horario y <span className="italic">ubicación</span>
              </h2>
              <div
                className={`mt-10 grid gap-5 ${hoursRows.length > 0 && business.address ? 'md:grid-cols-2' : 'max-w-xl'}`}
              >
                {hoursRows.length > 0 ? (
                  <div className="rounded-2xl bg-(--site-surface) p-6 sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold">Horario</h3>
                      {status ? (
                        <p
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${status.open ? 'bg-emerald-100 text-emerald-900' : 'bg-[#f6e3d9] text-[#7a3115]'}`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${status.open ? 'bg-emerald-600' : 'bg-[#b4532a]'}`}
                            aria-hidden="true"
                          />
                          {status.label}
                          {status.detail ? ` · ${status.detail}` : ''}
                        </p>
                      ) : null}
                    </div>
                    <table className="mt-6 w-full text-sm">
                      <caption className="sr-only">
                        Horario semanal de {business.name}
                      </caption>
                      <tbody>
                        {hoursRows.map((row) => (
                          <tr
                            key={row.day}
                            aria-current={row.isToday ? 'date' : undefined}
                            className={
                              row.isToday
                                ? 'bg-(--site-soft) font-semibold'
                                : 'border-b border-current/10 last:border-0'
                            }
                          >
                            <th
                              scope="row"
                              className="rounded-l-lg py-3 pl-3 text-left font-medium"
                            >
                              {row.label}
                              {row.isToday ? (
                                <span className="ml-2 rounded-full bg-(--site-accent) px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                                  Hoy
                                </span>
                              ) : null}
                            </th>
                            <td
                              className={`rounded-r-lg py-3 pr-3 text-right tabular-nums ${row.closed ? 'opacity-70' : ''}`}
                            >
                              {row.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}

                {business.address ? (
                  <div className="flex flex-col rounded-2xl bg-(--site-surface) p-6 sm:p-8">
                    <h3 className="text-lg font-semibold">Dónde estamos</h3>
                    <address className="mt-6 font-serif text-2xl leading-snug not-italic sm:text-3xl">
                      {business.address}
                    </address>
                    <div className="mt-8 flex flex-wrap gap-3 md:mt-auto md:pt-8">
                      {mapsHref ? (
                        <a
                          href={mapsHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-(--site-accent) px-5 text-sm font-semibold text-white hover:opacity-90 ${focusRing}`}
                        >
                          <MapPin className="size-4" aria-hidden="true" />
                          Cómo llegar
                          <span className="sr-only">
                            (se abre en Google Maps)
                          </span>
                        </a>
                      ) : null}
                      {telHref ? (
                        <a
                          href={telHref}
                          className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-current/30 px-5 text-sm font-semibold hover:border-current ${focusRing}`}
                        >
                          <Phone className="size-4" aria-hidden="true" />
                          {business.phone}
                        </a>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {/* Contact */}
        <section
          id="contacto"
          aria-labelledby="titulo-contacto"
          className="mx-auto grid max-w-6xl scroll-mt-16 gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.15fr] lg:gap-16"
        >
          <div>
            <p className={eyebrow}>Contacto</p>
            <h2
              id="titulo-contacto"
              className="mt-4 font-serif text-4xl leading-tight sm:text-5xl"
            >
              ¿Hablamos? <span className="italic">Escríbenos.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 opacity-80">
              Cuéntanos qué necesitas y te responderemos lo antes posible.
              {telHref ? ' Si lo prefieres, también puedes llamarnos.' : ''}
            </p>
            {telHref || email || whatsapp ? (
              <ul className="mt-8 space-y-4 text-sm">
                {telHref ? (
                  <li>
                    <a
                      href={telHref}
                      className={`inline-flex items-center gap-3 font-semibold hover:underline hover:underline-offset-4 ${focusRing}`}
                    >
                      <span className="grid size-10 place-items-center rounded-full bg-(--site-soft)">
                        <Phone className="size-4" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="sr-only">Teléfono: </span>
                        {business.phone}
                      </span>
                    </a>
                  </li>
                ) : null}
                {whatsapp ? (
                  <li>
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-3 font-semibold hover:underline hover:underline-offset-4 ${focusRing}`}
                    >
                      <span className="grid size-10 place-items-center rounded-full bg-(--site-soft)">
                        <MessageCircle className="size-4" aria-hidden="true" />
                      </span>
                      WhatsApp
                      <span className="sr-only">(se abre en otra pestaña)</span>
                    </a>
                  </li>
                ) : null}
                {email ? (
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className={`inline-flex items-center gap-3 font-semibold break-all hover:underline hover:underline-offset-4 ${focusRing}`}
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-(--site-soft)">
                        <Mail className="size-4" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="sr-only">Email: </span>
                        {email}
                      </span>
                    </a>
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>
          <div className="rounded-3xl border border-current/10 bg-white/70 p-6 shadow-sm sm:p-10">
            <ContactForm businessId={business.id} locale={locale} />
          </div>
        </section>
      </main>

      <footer className="border-t border-current/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-serif text-2xl">{business.name}</p>
            {business.address ? (
              <p className="mt-2 text-sm leading-6 opacity-75">
                {business.address}
              </p>
            ) : null}
          </div>
          {socialLinks.length > 0 || telHref || email ? (
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {telHref ? (
                <li>
                  <a
                    href={telHref}
                    className={`hover:underline hover:underline-offset-4 ${focusRing}`}
                  >
                    {business.phone}
                  </a>
                </li>
              ) : null}
              {email ? (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className={`hover:underline hover:underline-offset-4 ${focusRing}`}
                  >
                    {email}
                  </a>
                </li>
              ) : null}
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 hover:underline hover:underline-offset-4 ${focusRing}`}
                  >
                    {link.label}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    <span className="sr-only">(se abre en otra pestaña)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-current/10 px-5 py-5 text-xs opacity-70 sm:px-8">
          <p>
            © {now.getFullYear()} {business.name}
          </p>
          <p>
            Web creada con{' '}
            <a
              href={getBaseUrl()}
              target="_blank"
              rel="noopener"
              className={`underline underline-offset-2 ${focusRing}`}
            >
              Locavo
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
