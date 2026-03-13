export async function generateBusinessContent(name: string, category: string) {
  // In a real implementation, this would call Gemini API
  // const apiKey = process.env.GEMINI_API_KEY
  // if (!apiKey) throw new Error("AI not configured")

  // Mock implementation based on category
  const isRestaurant =
    category.toLowerCase().includes('restaurante') ||
    category.toLowerCase().includes('bar') ||
    category.toLowerCase().includes('cafetería')
  const isSalon =
    category.toLowerCase().includes('peluquería') ||
    category.toLowerCase().includes('estética') ||
    category.toLowerCase().includes('belleza')

  let description = `Bienvenido a ${name}. Somos especialistas en ${category} ofreciendo la mejor calidad y servicio a nuestros clientes. Ven a visitarnos y descubre todo lo que podemos hacer por ti.`

  const services: Array<{
    name: string
    description: string
    price: number
    duration: number
  }> = []

  if (isRestaurant) {
    description = `En ${name}, nos apasiona la gastronomía. Ofrecemos una experiencia culinaria única con ingredientes frescos y locales. Nuestro ambiente acogedor es perfecto para cenas románticas, comidas familiares o eventos especiales. ¡Reserva tu mesa hoy!`
    services.push(
      {
        name: 'Menú del Día',
        description: 'Primer plato, segundo, postre y bebida.',
        price: 12.5,
        duration: 60,
      },
      {
        name: 'Cena Degustación',
        description: 'Selección de nuestros mejores platos.',
        price: 35.0,
        duration: 90,
      },
      {
        name: 'Desayuno Completo',
        description: 'Café, zumo y tostada o bollería.',
        price: 4.5,
        duration: 30,
      }
    )
  } else if (isSalon) {
    description = `Descubre tu mejor versión en ${name}. Nuestro equipo de estilistas expertos está aquí para asesorarte y cuidar de tu imagen con los tratamientos más innovadores. Utilizamos productos de primera calidad para garantizar resultados espectaculares.`
    services.push(
      {
        name: 'Corte de Pelo',
        description: 'Asesoramiento, lavado y corte.',
        price: 20.0,
        duration: 45,
      },
      {
        name: 'Tinte Completo',
        description: 'Coloración profesional y cuidado capilar.',
        price: 45.0,
        duration: 90,
      },
      {
        name: 'Peinado Evento',
        description: 'Recogidos y peinados para ocasiones especiales.',
        price: 30.0,
        duration: 60,
      }
    )
  }

  return { description, services }
}
