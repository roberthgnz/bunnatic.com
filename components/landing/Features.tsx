import Link from 'next/link'
import {
  ArrowUpRight,
  Check,
  Globe2,
  MapPin,
  MessageCircle,
  MousePointer2,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

export default function Features() {
  return (
    <section id="caracteristicas" className="landing-section bg-white">
      <div className="landing-container">
        <div className="mb-10 grid gap-5 md:grid-cols-2 md:items-end">
          <div>
            <p className="landing-eyebrow">
              Menos complicaciones. Más negocio.
            </p>
            <h2 className="landing-title">
              Todo lo que necesitas.
              <br />
              <span className="landing-serif">Y nada que te sobre.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-[#7a8071] md:ml-auto">
            Tu web debería trabajar para ti. Por eso reunimos diseño,
            visibilidad y contacto en una herramienta que sí entiendes.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="feature-card bg-[#eff2e8] md:col-span-2">
            <div className="grid h-full gap-7 sm:grid-cols-2 sm:items-center">
              <div>
                <span className="feature-icon">
                  <Sparkles className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">
                  Una web tan única
                  <br />
                  como tu negocio.
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#75806b]">
                  La IA transforma la información de tu negocio en textos,
                  servicios y un diseño con tu personalidad.
                </p>
                <Link
                  href="/caracteristicas/generacion-ia"
                  className="feature-link"
                >
                  Conoce a tu nuevo aliado
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
              <div className="rounded-2xl border border-[#dce2d2] bg-white/80 p-4 shadow-[0_8px_25px_#3b4b2c08]">
                <div className="mb-4 flex items-center gap-2 text-xs font-medium">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-[#e5edda]">
                    <Sparkles
                      className="size-3.5 text-[#607947]"
                      aria-hidden="true"
                    />
                  </span>
                  Un poco de magia, mucho de ti.
                </div>
                {[
                  'Tu historia, bien contada',
                  'Tus servicios, organizados',
                  'Tu estilo, en cada detalle',
                ].map((text) => (
                  <div
                    key={text}
                    className="flex items-center gap-2.5 border-t border-[#ebeee4] py-3 text-[11px] text-[#68745c]"
                  >
                    <Check
                      className="size-3.5 text-[#6a8e4c]"
                      aria-hidden="true"
                    />
                    {text}
                  </div>
                ))}
                <div className="mt-2 flex items-center justify-between rounded-lg bg-[#29452c] px-3 py-2.5 text-[10px] text-white">
                  <span>Lista para dar el siguiente paso</span>
                  <Check className="size-3.5" aria-hidden="true" />
                </div>
              </div>
            </div>
          </article>
          <article className="feature-card bg-[#f6f1e8]">
            <span className="feature-icon">
              <MapPin className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">
              Que te encuentren.
              <br />
              Justo donde estás.
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#807869]">
              SEO local y contenido estructurado para facilitar que Google
              descubra tu negocio.
            </p>
            <div className="mt-6 rounded-xl border border-[#e8e1d4] bg-white/80 p-3">
              <div className="flex items-center gap-2 text-[10px] text-[#8a8b7e]">
                <Search className="size-3" aria-hidden="true" />
                Tu servicio + tu ciudad
              </div>
              <div className="mt-3 text-xs font-medium text-[#475d80]">
                Tu negocio, más cerca de tus clientes
              </div>
              <p className="mt-1 text-[9px] text-[#8a8b7e]">
                Tu dirección · Tus servicios · Tu web
              </p>
            </div>
            <Link href="/caracteristicas/seo-local" className="feature-link">
              Más visibilidad local
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </article>
          <article className="feature-card bg-[#f7f4ed]">
            <span className="feature-icon">
              <MousePointer2 className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">
              Tu web cambia contigo.
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#7c7c6c]">
              Actualiza un horario, añade un servicio o mejora un texto con
              ayuda de IA. Tú tienes el control.
            </p>
            <Link
              href="/caracteristicas/edicion-asistida"
              className="feature-link"
            >
              Así de fácil se edita
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </article>
          <article className="feature-card bg-[#edf2ee]">
            <span className="feature-icon">
              <MessageCircle className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">
              De «te vi» a «te contacto».
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#747e70]">
              WhatsApp, llamadas y formularios para que el próximo cliente esté
              a un solo clic.
            </p>
            <Link
              href="/caracteristicas/formularios-contacto"
              className="feature-link"
            >
              Abre la conversación
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </article>
          <article className="feature-card bg-[#f0f0e8]">
            <span className="feature-icon">
              <Globe2 className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">
              La parte técnica, resuelta.
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#777e6e]">
              Alojamiento, conexión de dominio y certificado HTTPS. Un mismo
              lugar para tenerlo todo a mano.
            </p>
            <Link
              href="/caracteristicas/hosting-dominio"
              className="feature-link"
            >
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Conoce qué incluye
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </article>
        </div>
      </div>
    </section>
  )
}
