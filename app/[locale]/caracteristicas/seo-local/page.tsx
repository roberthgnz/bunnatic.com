import type { Metadata } from 'next'
import FeatureLanding from '../_components/FeatureLanding'
import { getFeatureSlug } from '@/lib/pageSlugs'
import { buildPageMetadata, type SeoLocale } from '@/lib/seo'

type FeaturePageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: FeaturePageProps): Promise<Metadata> {
  const { locale } = await params
  const safeLocale: SeoLocale = locale === 'ca' ? 'ca' : 'es'

  return buildPageMetadata({
    locale: safeLocale,
    title:
      safeLocale === 'ca'
        ? 'SEO local per negocis | Bunnatic'
        : 'SEO local para negocios | Bunnatic',
    description:
      safeLocale === 'ca'
        ? 'Millora la teva visibilitat local a Google i converteix cerques en contactes.'
        : 'Mejora tu visibilidad local en Google y convierte búsquedas en contactos.',
    esPath: `/caracteristicas/${getFeatureSlug('seo-local', 'es')}`,
    caPath: `/caracteristicas/${getFeatureSlug('seo-local', 'ca')}`,
  })
}

export default function SeoLocalPage() {
  return (
    <FeatureLanding
      slug="seo-local"
      icon="MapPin"
      copy={{
        es: {
          badge: 'Aparece cuando te están buscando',
          title: 'SEO local para atraer clientes listos para comprar',
          subtitle:
            'Optimizamos tu web para búsquedas de intención alta en tu zona, para que lleguen contactos de personas que ya quieren contratar.',
          urgencyText:
            'Si no sales en búsquedas locales, tus competidores se quedan con esos clientes.',
          trustLine:
            'SEO técnico + estructura comercial + velocidad de carga para mejorar conversión.',
          outcomesTitle: 'Impacto directo en el embudo',
          outcomes: [
            'Más visibilidad en búsquedas locales con intención de compra.',
            'Más clics a tu web gracias a títulos y contenido orientado a servicio.',
            'Más contactos por formulario y WhatsApp desde tráfico orgánico.',
          ],
          processTitle: 'Qué hacemos para mejorar tus resultados',
          process: [
            {
              title: 'Arquitectura local',
              description:
                'Definimos estructura y metadatos para tu ciudad y servicios principales.',
            },
            {
              title: 'Contenido orientado a conversión',
              description:
                'Creamos páginas que responden dudas y cierran objeciones de tu cliente ideal.',
            },
            {
              title: 'Publicación y seguimiento',
              description:
                'Publicamos con base técnica sólida y dejamos todo listo para escalar tráfico.',
            },
          ],
          objectionsTitle: 'Lo que suele frenar la decisión',
          objections: [
            {
              q: '¿El SEO tarda demasiado?',
              a: 'El posicionamiento es progresivo, pero desde el inicio mejoras visibilidad y calidad del tráfico.',
            },
            {
              q: '¿Tengo que escribir contenido yo?',
              a: 'No. La IA genera base optimizada y tú solo validas que refleje tu negocio.',
            },
          ],
          proofTitle: 'Prueba social de negocio local',
          testimonials: [
            {
              quote:
                "Empezamos a recibir llamadas de búsquedas tipo 'cerca de mí' tras publicar.",
              author: 'Jordi P.',
              role: 'Clínica dental',
            },
            {
              quote:
                'La web quedó enfocada a servicios y ahora nos encuentran por barrio.',
              author: 'Laura M.',
              role: 'Reformas',
            },
          ],
          planTitle: 'Plan recomendado para SEO local',
          planPrice: '19€/mes',
          planItems: [
            'Optimización SEO local incluida',
            'Actualización sencilla de servicios y horarios',
            'Soporte para escalar páginas clave',
          ],
          finalTitle: 'Empieza a captar búsquedas que ya existen',
          finalSubtitle:
            'Activa tu web optimizada hoy y convierte búsquedas locales en nuevos registros.',
          ctaPrimary: 'Registrarme gratis',
          ctaSecondary: 'Ver cómo funciona',
        },
        ca: {
          badge: "Apareix quan t'estan buscant",
          title: 'SEO local per atraure clients llestos per comprar',
          subtitle:
            "Optimitzem la teva web per cerques d'intenció alta a la teva zona, perquè arribin contactes de persones que ja volen contractar.",
          urgencyText:
            'Si no surts a cerques locals, la competència es queda aquests clients.',
          trustLine:
            'SEO tècnic + estructura comercial + velocitat de càrrega per millorar conversió.',
          outcomesTitle: "Impacte directe a l'embut",
          outcomes: [
            'Més visibilitat en cerques locals amb intenció de compra.',
            'Més clics a la teva web amb títols i contingut orientat a servei.',
            'Més contactes per formulari i WhatsApp des de trànsit orgànic.',
          ],
          processTitle: 'Què fem per millorar els teus resultats',
          process: [
            {
              title: 'Arquitectura local',
              description:
                'Definim estructura i metadades per a la teva ciutat i serveis principals.',
            },
            {
              title: 'Contingut orientat a conversió',
              description:
                'Creem pàgines que resolen dubtes i tanquen objeccions del teu client ideal.',
            },
            {
              title: 'Publicació i seguiment',
              description:
                'Publiquem amb base tècnica sòlida i ho deixem llest per escalar trànsit.',
            },
          ],
          objectionsTitle: 'El que sol frenar la decisió',
          objections: [
            {
              q: 'El SEO triga massa?',
              a: "El posicionament és progressiu, però des de l'inici millores visibilitat i qualitat del trànsit.",
            },
            {
              q: "He d'escriure contingut jo?",
              a: 'No. La IA genera una base optimitzada i tu només valides que reflecteixi el teu negoci.',
            },
          ],
          proofTitle: 'Prova social de negoci local',
          testimonials: [
            {
              quote:
                "Vam començar a rebre trucades de cerques tipus 'a prop meu' després de publicar.",
              author: 'Jordi P.',
              role: 'Clínica dental',
            },
            {
              quote:
                'La web va quedar enfocada a serveis i ara ens troben per barri.',
              author: 'Laura M.',
              role: 'Reformes',
            },
          ],
          planTitle: 'Pla recomanat per SEO local',
          planPrice: '19€/mes',
          planItems: [
            'Optimització SEO local inclosa',
            'Actualització simple de serveis i horaris',
            'Suport per escalar pàgines clau',
          ],
          finalTitle: 'Comença a captar cerques que ja existeixen',
          finalSubtitle:
            'Activa la teva web optimitzada avui i converteix cerques locals en nous registres.',
          ctaPrimary: 'Registrar-me gratis',
          ctaSecondary: 'Veure com funciona',
        },
      }}
    />
  )
}
