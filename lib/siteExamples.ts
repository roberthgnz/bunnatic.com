export const siteExamples = [
  {
    slug: 'restaurante',
    sector: 'Restaurantes',
    category: 'Cocina de proximidad',
    name: 'Casa Oliva',
    location: 'Barcelona',
    tagline: 'Las cosas buenas,\na fuego lento.',
    description:
      'Producto de temporada, recetas de siempre y una mesa donde quedarse un rato más. Bienvenido a casa.',
    image: '/images/restaurant.jpg',
    imageAlt: 'Interior acogedor de un restaurante con plantas y luz natural',
    color: '#263d2d',
    surface: '#f4f1e9',
    action: 'Reserva tu mesa',
    services: [
      {
        title: 'Nuestra cocina',
        text: 'Recetas mediterráneas con ingredientes frescos y de temporada.',
      },
      {
        title: 'Menú de mediodía',
        text: 'Una pausa para disfrutar de la buena cocina, de lunes a viernes.',
      },
      {
        title: 'Momentos especiales',
        text: 'Un espacio acogedor para celebrar con las personas que importan.',
      },
    ],
  },
  {
    slug: 'peluqueria',
    sector: 'Peluquerías',
    category: 'Cabello y bienestar',
    name: 'Studio Alma',
    location: 'Madrid',
    tagline: 'Tu esencia.\nTu mejor versión.',
    description:
      'Un momento para ti. Cortes, color y cuidados pensados para que te sientas tan bien como te ves.',
    image: '/images/salon.jpg',
    imageAlt: 'Salón de peluquería luminoso con sillones y espejos',
    color: '#684a40',
    surface: '#f6eeea',
    action: 'Pide tu cita',
    services: [
      {
        title: 'Corte con personalidad',
        text: 'Escuchamos lo que buscas y encontramos el estilo que va contigo.',
      },
      {
        title: 'Color a tu medida',
        text: 'Tonos naturales y técnicas de color adaptadas a tu cabello.',
      },
      {
        title: 'Cuidado y rituales',
        text: 'Tratamientos para devolver suavidad y vitalidad a tu pelo.',
      },
    ],
  },
  {
    slug: 'clinica',
    sector: 'Clínicas',
    category: 'Tu clínica dental',
    name: 'Clínica Serena',
    location: 'Valencia',
    tagline: 'Vuelve a sonreír\ncon tranquilidad.',
    description:
      'Cuidamos de tu sonrisa con un trato cercano, explicaciones claras y un equipo que te escucha.',
    image: '/images/clinic.jpg',
    imageAlt:
      'Clínica dental moderna con salas luminosas y equipamiento profesional',
    color: '#24565b',
    surface: '#edf3f2',
    action: 'Solicita una visita',
    services: [
      {
        title: 'Prevención y cuidado',
        text: 'Revisiones y hábitos para acompañarte en tu salud bucodental.',
      },
      {
        title: 'Odontología general',
        text: 'Un plan de cuidado explicado paso a paso por nuestro equipo.',
      },
      {
        title: 'Estética dental',
        text: 'Opciones personalizadas para cuidar la armonía de tu sonrisa.',
      },
    ],
  },
] as const

export type SiteExample = (typeof siteExamples)[number]

export function getSiteExample(slug: string) {
  return siteExamples.find((example) => example.slug === slug)
}
