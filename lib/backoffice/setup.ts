export function getBusinessSetup(
  business: {
    name?: string | null
    category?: string | null
    description?: string | null
    phone?: string | null
    email?: string | null
    address?: string | null
  },
  services: readonly unknown[],
  hours: readonly { is_closed: boolean }[],
  sections: readonly { status?: string }[]
) {
  const setupChecklist = [
    Boolean(
      business.name?.trim() &&
      business.category?.trim() &&
      business.description?.trim()
    ),
    Boolean(business.phone?.trim() || business.email?.trim()),
    Boolean(business.address?.trim()),
    services.length > 0,
    hours.some((hour) => !hour.is_closed),
    sections.some((section) => section.status === 'published'),
  ]
  const setupCompletedCount = setupChecklist.filter(Boolean).length
  const setupCompletion = Math.round(
    (setupCompletedCount / setupChecklist.length) * 100
  )
  return { setupChecklist, setupCompletedCount, setupCompletion }
}
