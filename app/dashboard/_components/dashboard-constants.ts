export const dashboardContent = {
  title: 'Bunnatic',
  enterprise: 'Enterprise',
  platform: 'Plataforma',
  businesses: 'Negocios',
  addBusiness: 'Agregar negocio',
  menu: {
    dashboard: 'Inicio',
    businesses: 'Mis negocios',
    newBusiness: 'Crear negocio',
    generation: 'Generación IA',
    settings: 'Configuración',
    getHelp: 'Obtener ayuda',
    search: 'Buscar',
    giveFeedback: 'Dar feedback',
    feedbackIssue: 'Incidencia',
    feedbackIdea: 'Idea',
    account: 'Cuenta',
    billing: 'Facturación',
    notifications: 'Notificaciones',
    logout: 'Cerrar sesión',
  },
  plans: {
    starter: 'Esencial',
    pro: 'Impulso',
    agency: 'Equipo',
    scale: 'Expansión',
  },
} as const

export type DashboardContent = typeof dashboardContent
