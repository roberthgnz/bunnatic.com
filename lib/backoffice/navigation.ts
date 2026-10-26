import { hasBusinessPermission, type BusinessRole } from './policy'

export const dashboardRoutes = [
  {
    href: '/dashboard',
    label: 'Inicio',
    description: 'El resumen de tus negocios',
  },
  {
    href: '/dashboard/businesses',
    label: 'Mis negocios',
    description: 'Busca y gestiona tus webs',
  },
  {
    href: '/dashboard/new',
    label: 'Crear negocio',
    description: 'Añade un nuevo negocio',
  },
  {
    href: '/dashboard/generation',
    label: 'Generación IA',
    description: 'Crea y mejora tu contenido',
  },
  {
    href: '/dashboard/subscription',
    label: 'Facturación',
    description: 'Gestiona tu plan',
  },
  {
    href: '/dashboard/profile',
    label: 'Mi cuenta',
    description: 'Tus datos personales',
  },
] as const

export const businessSections = [
  { key: 'overview', label: 'Resumen' },
  { key: 'services', label: 'Servicios' },
  { key: 'hours', label: 'Horario' },
  { key: 'leads', label: 'Mensajes' },
  { key: 'analytics', label: 'Analítica' },
  { key: 'calendar', label: 'Calendario' },
  { key: 'team', label: 'Equipo' },
  { key: 'generation', label: 'Generación IA' },
  { key: 'settings', label: 'Configuración' },
] as const

export type BusinessSectionKey = (typeof businessSections)[number]['key']

export function getBusinessNavigation(slug: string, role: BusinessRole) {
  const base = `/dashboard/businesses/${encodeURIComponent(slug)}`
  return businessSections
    .filter(
      (item) =>
        (item.key !== 'generation' ||
          hasBusinessPermission(role, 'content.write')) &&
        (item.key !== 'leads' || hasBusinessPermission(role, 'leads.read'))
    )
    .map((item) => ({ ...item, href: `${base}/${item.key}` }))
}

export function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim()
}
