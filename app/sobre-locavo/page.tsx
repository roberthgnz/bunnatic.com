import Link from 'next/link'
import { LandingShell } from '@/components/landing/SeoLandingSections'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  locale: 'es',
  title: 'Sobre el proyecto y nuestro criterio editorial',
  description:
    'Qué es Locavo, para quién está pensado y cómo se prepara el contenido sobre webs y presencia digital de negocios locales.',
  esPath: '/sobre-locavo',
})

export default function AboutPage() {
  return (
    <LandingShell>
      <article className="landing-section">
        <div className="landing-container max-w-4xl!">
          <Breadcrumbs
            items={[
              { name: 'Inicio', path: '/' },
              { name: 'Sobre Locavo', path: '/sobre-locavo' },
            ]}
          />
          <h1 className="landing-title">Sobre Locavo</h1>
          <p className="mt-7 text-xl leading-relaxed text-(--home-muted)">
            Locavo es una herramienta para preparar y gestionar páginas web de
            negocios locales con asistencia de inteligencia artificial. Su
            contenido se dirige a personas que necesitan explicar sus servicios,
            mantener sus datos y facilitar el contacto. La marca Locavo publica
            las guías de este sitio; las recomendaciones generales deben
            adaptarse a las condiciones reales de cada negocio.
          </p>
          <h2 className="mt-12 text-3xl font-medium tracking-tight">
            Qué puedes esperar del producto
          </h2>
          <p className="mt-5 text-lg leading-8 text-(--home-muted)">
            El proyecto incluye edición de información comercial, servicios y
            horarios, así como preparación de contenido asistida por IA. Las
            funciones que dependen de proveedores externos requieren su
            configuración. Locavo está en una fase inicial y la disponibilidad
            debe comprobarse antes de contratar o depender de una integración.
          </p>
          <p className="mt-5 text-lg leading-8 text-(--home-muted)">
            Crear una web no garantiza que Google la indexe, una posición
            concreta o un número de clientes. Los ejemplos visuales ilustran
            diseños y no representan casos de éxito verificados.
          </p>
          <h2 className="mt-12 text-3xl font-medium tracking-tight">
            Cómo preparamos las guías
          </h2>
          <p className="mt-5 text-lg leading-8 text-(--home-muted)">
            La firma «Locavo» identifica a la marca que publica este contenido.
            No implica una acreditación profesional ni una prueba independiente
            del producto. Cada guía muestra su fecha, distingue las
            instrucciones prácticas de los datos externos y enlaza las fuentes
            concretas de las cifras utilizadas.
          </p>
          <ul className="mt-6 list-disc space-y-3 pl-6 text-lg leading-8 text-(--home-muted)">
            <li>
              Consultamos documentación primaria para afirmaciones sobre
              buscadores y estadísticas públicas.
            </li>
            <li>
              No presentamos estimaciones de tráfico ni resultados de clientes
              sin evidencia.
            </li>
            <li>
              Revisamos los textos generados con asistencia de IA y evitamos
              atribuirles experiencia personal.
            </li>
            <li>
              Las fechas cambian cuando se revisa el contenido; no se renuevan
              automáticamente en cada visita.
            </li>
          </ul>
          <p className="mt-8 text-sm text-(--home-muted)">
            Página publicada el{' '}
            <time dateTime="2026-10-27">27 de octubre de 2026</time>.
          </p>
          <div className="mt-10 flex flex-wrap gap-6 font-medium underline underline-offset-4">
            <Link href="/blog">Leer las guías</Link>
            <Link href="/negocio">Explorar sectores</Link>
            <Link href="/crear-pagina-web-negocio">Ver la herramienta</Link>
          </div>
        </div>
      </article>
    </LandingShell>
  )
}
