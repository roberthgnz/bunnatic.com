// Concrete inputs to review, never promises of revenue or automated bookings.
export const sectorChecklists: Record<string, [string, string][]> = {
  restaurantes: [
    [
      'Carta',
      'Platos, precios vigentes y condiciones del menú; evita depender solo de una foto ilegible.',
    ],
    [
      'Reservas',
      'Canal atendido, tamaño de grupos y confirmación de la solicitud.',
    ],
    ['Visita', 'Horario de cocina, ubicación y accesibilidad comprobada.'],
  ],
  dentistas: [
    [
      'Tratamientos',
      'Explicación validada por el responsable clínico y límites de cada servicio.',
    ],
    [
      'Equipo',
      'Nombres y titulaciones verificadas, con permiso para publicar.',
    ],
    [
      'Primera visita',
      'Qué debe solicitar el paciente y cómo se confirma la cita.',
    ],
  ],
  esteticas: [
    [
      'Tratamientos',
      'Duración orientativa, condiciones y valoración previa si corresponde.',
    ],
    ['Imágenes', 'Fotografías con autorización; sin resultados garantizados.'],
    ['Citas', 'Cómo consultar disponibilidad y cuándo queda confirmada.'],
  ],
  farmacias: [
    [
      'Atención',
      'Horario vigente y servicios que realmente presta el establecimiento.',
    ],
    [
      'Información sanitaria',
      'Contenido revisado por el profesional responsable.',
    ],
    [
      'Ubicación',
      'Dirección, teléfono y acceso; verifica cualquier dato de guardias.',
    ],
  ],
  fotografos: [
    ['Portfolio', 'Selección de trabajos con permiso de publicación.'],
    [
      'Sesiones',
      'Tipo de encargo, entregables y condiciones de desplazamiento.',
    ],
    [
      'Presupuesto',
      'Información necesaria para valorar el proyecto y acordar fechas.',
    ],
  ],
  gimnasios: [
    ['Actividades', 'Clases vigentes, horarios y requisitos de participación.'],
    ['Tarifas', 'Qué incluye cada modalidad y sus condiciones.'],
    ['Instalaciones', 'Fotos actuales y forma de solicitar una visita.'],
  ],
  inmobiliarias: [
    [
      'Servicios',
      'Venta, alquiler o gestión con el alcance de la intermediación.',
    ],
    [
      'Inmuebles',
      'Disponibilidad y datos revisados; evita anuncios desactualizados.',
    ],
    [
      'Consulta',
      'Contacto para solicitar información, sin prometer una visita automática.',
    ],
  ],
  peluquerias: [
    ['Servicios', 'Cortes, color y otros trabajos con sus condiciones.'],
    ['Precios', 'Importes orientativos o necesidad de valoración previa.'],
    ['Agenda', 'Canal para pedir cita y confirmación por el negocio.'],
  ],
  talleres: [
    [
      'Reparaciones',
      'Tipos de vehículo, operaciones y alcance del diagnóstico.',
    ],
    [
      'Presupuesto',
      'Cómo se valora el trabajo y cómo se comunica la autorización.',
    ],
    ['Entrega', 'Horario de recepción y condiciones reales de atención.'],
  ],
  veterinarios: [
    [
      'Atención clínica',
      'Servicios y especies atendidas, revisados por el responsable veterinario.',
    ],
    [
      'Urgencias',
      'Disponibilidad real y canal correcto; no anuncies atención permanente si no existe.',
    ],
    ['Citas', 'Datos para solicitar consulta y cómo se confirma.'],
  ],
}
