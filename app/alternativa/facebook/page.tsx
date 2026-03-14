import type { Metadata } from 'next'
import AlternativeLanding from '../_components/AlternativeLanding'
import { getAlternativeSlug } from '@/lib/pageSlugs'
import { buildPageMetadata, type SeoLocale } from '@/lib/seo'

type AlternativePageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: AlternativePageProps): Promise<Metadata> {
  const { locale } = await params
  const safeLocale: SeoLocale = locale === 'ca' ? 'ca' : 'es'

  return buildPageMetadata({
    locale: safeLocale,
    title:
      safeLocale === 'ca'
        ? 'Alternativa a Facebook Pages per Captar Clients | Bunnatic'
        : 'Alternativa a Facebook Pages para Captar Clientes | Bunnatic',
    description:
      safeLocale === 'ca'
        ? "Passa de dependre de l'algoritme de Facebook a convertir visites en contactes amb una web pròpia optimitzada per SEO local."
        : 'Pasa de depender del algoritmo de Facebook a convertir visitas en contactos con una web propia optimizada para SEO local.',
    esPath: `/alternativa/${getAlternativeSlug('facebook', 'es')}`,
    caPath: `/alternativa/${getAlternativeSlug('facebook', 'ca')}`,
    keywords:
      safeLocale === 'ca'
        ? [
          'alternativa facebook',
          'web pròpia',
          'facebook business',
          'pàgina facebook',
        ]
        : [
          'alternativa facebook',
          'web propia',
          'facebook business',
          'página facebook',
          'mejor que facebook',
        ],
  })
}

export default function AlternativeFacebookPage() {
  return (
    <AlternativeLanding
      slug="facebook"
      copy={{
        es: {
          badge: 'No dependas del algoritmo para vender',
          title:
            'La alternativa a Facebook Pages para captar clientes de verdad',
          subtitle:
            'Facebook sirve para comunidad, pero no para controlar tu captación. Con una web propia conviertes búsquedas en contactos y ventas.',
          urgencyText:
            'Cada cambio del algoritmo puede recortar tu alcance sin aviso.',
          ctaPrimary: 'Crear cuenta gratis',
          ctaSecondary: 'Probar demo',
          trustLine:
            'Web propia + SEO local + CTAs directos para transformar visitas en registros.',
          competitorCardTitle: 'Solo con Facebook Pages',
          competitorItems: [
            'Tu visibilidad depende del alcance orgánico o de anuncios.',
            'El cliente se distrae con contenido de terceros.',
            'Información crítica difícil de estructurar para convertir.',
          ],
          novaCardTitle: 'Con Bunnatic',
          novaItems: [
            'Tu canal es tuyo, sin depender de reglas de una red social.',
            'Página enfocada a llamada, WhatsApp o formulario de contacto.',
            'Estructura preparada para que Google te encuentre por zona.',
          ],
          switchTitle: 'Cambio rápido para empezar a convertir mejor',
          switchSteps: [
            {
              title: 'Genera tu web en minutos',
              description:
                'La IA crea una base lista con tus servicios y propuesta comercial.',
            },
            {
              title: 'Activa captación directa',
              description:
                'Configuras formularios y botones para recibir oportunidades reales.',
            },
            {
              title: 'Mantén Facebook como apoyo',
              description:
                'Usas redes para visibilidad y la web para cerrar registros y ventas.',
            },
          ],
          proofTitle: 'Negocios que ya hicieron el cambio',
          testimonials: [
            {
              quote:
                'Seguimos publicando en Facebook, pero ahora los contactos llegan a nuestra web.',
              author: 'Lorena V.',
              role: 'Clínica dental',
            },
            {
              quote:
                'Dejamos de perder leads en mensajes sueltos y ahora todo entra por formulario.',
              author: 'Sergio P.',
              role: 'Taller local',
            },
          ],
          planTitle: 'Plan recomendado para captación estable',
          planPrice: '19€/mes',
          planItems: [
            'Editor visual con recomendaciones de IA ilimitadas',
            'Botón de WhatsApp y formulario integrado',
            'SEO local y soporte prioritario',
          ],
          finalTitle: 'Convierte tu audiencia en clientes propios',
          finalSubtitle:
            'Crea tu cuenta y utiliza Facebook para atraer, pero tu web para convertir.',
        },
        ca: {
          badge: "No depenguis de l'algoritme per vendre",
          title: "L'alternativa a Facebook Pages per captar clients de veritat",
          subtitle:
            'Facebook serveix per comunitat, però no per controlar captació. Amb web pròpia converteixes cerques en contactes i vendes.',
          urgencyText:
            "Cada canvi d'algoritme pot retallar el teu abast sense avís.",
          ctaPrimary: 'Crear compte gratis',
          ctaSecondary: 'Provar demo ara',
          trustLine:
            'Web pròpia + SEO local + CTAs directes per transformar visites en registres.',
          competitorCardTitle: 'Només amb Facebook Pages',
          competitorItems: [
            "La teva visibilitat depèn de l'abast orgànic o d'anuncis.",
            'El client es distreu amb contingut de tercers.',
            "Informació crítica difícil d'estructurar per convertir.",
          ],
          novaCardTitle: 'Amb Bunnatic',
          novaItems: [
            "El teu canal és teu, sense dependre de regles d'una xarxa social.",
            'Pàgina enfocada a trucada, WhatsApp o formulari de contacte.',
            'Estructura preparada perquè Google et trobi per zona.',
          ],
          switchTitle: 'Canvi ràpid per començar a convertir millor',
          switchSteps: [
            {
              title: 'Genera la teva web en minuts',
              description:
                'La IA crea una base llesta amb serveis i proposta comercial.',
            },
            {
              title: 'Activa captació directa',
              description:
                'Configures formularis i botons per rebre oportunitats reals.',
            },
            {
              title: 'Mantén Facebook com a suport',
              description:
                'Uses xarxes per visibilitat i la web per tancar registres i vendes.',
            },
          ],
          proofTitle: 'Negocis que ja han fet el canvi',
          testimonials: [
            {
              quote:
                'Continuem publicant a Facebook, però ara els contactes arriben a la nostra web.',
              author: 'Lorena V.',
              role: 'Clínica dental',
            },
            {
              quote:
                'Vam deixar de perdre leads en missatges solts i ara tot entra per formulari.',
              author: 'Sergio P.',
              role: 'Taller local',
            },
          ],
          planTitle: 'Pla recomanat per captació estable',
          planPrice: '19€/mes',
          planItems: [
            "Editor visual amb recomanacions d'IA il·limitades",
            'Botó de WhatsApp i formulari integrat',
            'SEO local i suport prioritari',
          ],
          finalTitle: 'Converteix la teva audiència en clients propis',
          finalSubtitle:
            'Crea el teu compte i fes servir Facebook per atraure, però la web per convertir.',
        },
      }}
    />
  )
}
