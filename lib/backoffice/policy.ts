export type BusinessRole = 'owner' | 'admin' | 'editor' | 'viewer'
export type BusinessPermission =
  | 'read'
  | 'leads.read'
  | 'content.write'
  | 'calendar.write'
  | 'settings.write'
  | 'team.manage'

type Membership = {
  business_id: string
  user_id: string
  role: string
  status: string
}

/** Ownership comes from businesses.user_id, never from a submitted membership role. */
export function resolveBusinessRole(
  userId: string,
  business: { id: string; user_id: string },
  membership: Membership | null
): BusinessRole | null {
  if (business.user_id === userId) return 'owner'
  if (
    !membership ||
    membership.business_id !== business.id ||
    membership.user_id !== userId ||
    membership.status !== 'active'
  )
    return null
  return ['admin', 'editor', 'viewer'].includes(membership.role)
    ? (membership.role as BusinessRole)
    : null
}

export function hasBusinessPermission(
  role: BusinessRole | null,
  permission: BusinessPermission
): boolean {
  if (!role) return false
  if (permission === 'read') return true
  if (role === 'owner') return true
  // D1 query scopes enforce the same owner-only content permissions.
  // Calendar also permits active administrators and editors to write.
  return (
    permission === 'calendar.write' && (role === 'admin' || role === 'editor')
  )
}

export const businessRoleLabels: Record<BusinessRole, string> = {
  owner: 'Propietario',
  admin: 'Administrador',
  editor: 'Editor',
  viewer: 'Solo lectura',
}
