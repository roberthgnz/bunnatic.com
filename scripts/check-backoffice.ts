import assert from 'node:assert/strict'
import {
  hasBusinessPermission,
  resolveBusinessRole,
  type BusinessPermission,
  type BusinessRole,
} from '../lib/backoffice/policy'
import {
  calendarEventSchema,
  serviceFromForm,
  servicesBatchSchema,
  workingHoursSchema,
  sectionStatusSchema,
} from '../lib/backoffice/schemas'
import { getBusinessNavigation } from '../lib/backoffice/navigation'
import { selectBusinesses } from '../lib/backoffice/directory'
import { getBusinessSetup } from '../lib/backoffice/setup'
import {
  actionError,
  BackofficeError,
  throwDataError,
} from '../lib/backoffice/errors'
import type { BusinessSummary } from '../lib/backoffice/types'

const business = { id: 'business-a', user_id: 'owner-a' }
const membership = {
  business_id: 'business-a',
  user_id: 'collaborator',
  role: 'editor',
  status: 'active',
}
assert.equal(resolveBusinessRole('owner-a', business, null), 'owner')
assert.equal(
  resolveBusinessRole('collaborator', business, membership),
  'editor'
)
for (const invalid of [
  null,
  { ...membership, business_id: 'business-b' },
  { ...membership, user_id: 'another-user' },
  { ...membership, status: 'pending' },
  { ...membership, status: 'inactive' },
  { ...membership, role: 'owner' },
  { ...membership, role: 'superadmin' },
]) {
  assert.equal(resolveBusinessRole('collaborator', business, invalid), null)
}
const permissions: BusinessPermission[] = [
  'read',
  'leads.read',
  'content.write',
  'calendar.write',
  'settings.write',
  'team.manage',
]
for (const permission of permissions) {
  assert.equal(hasBusinessPermission(null, permission), false)
  assert.equal(hasBusinessPermission('owner', permission), true)
}
for (const role of ['admin', 'editor', 'viewer'] as BusinessRole[]) {
  assert.equal(hasBusinessPermission(role, 'read'), true)
  for (const permission of [
    'leads.read',
    'content.write',
    'settings.write',
    'team.manage',
  ] as BusinessPermission[])
    assert.equal(hasBusinessPermission(role, permission), false)
  assert.equal(hasBusinessPermission(role, 'calendar.write'), role !== 'viewer')
  assert.equal(
    getBusinessNavigation('negocio', role).some(
      (item) => item.key === 'generation'
    ),
    false
  )
}
assert.equal(
  getBusinessNavigation('negocio', 'owner').some(
    (item) => item.key === 'generation'
  ),
  true
)

function service(name: string, price = '', duration = '') {
  const form = new FormData()
  form.set('name', name)
  form.set('price', price)
  form.set('duration', duration)
  return serviceFromForm(form)
}
assert.equal(service('  Corte  ', '0', '30').success, true)
assert.equal(service('  ').success, false)
for (const price of ['-1', 'NaN', 'Infinity', '12abc'])
  assert.equal(service('Corte', price).success, false)
for (const duration of ['0', '-10', '1.5', '30min'])
  assert.equal(service('Corte', '', duration).success, false)
assert.equal(servicesBatchSchema.safeParse([]).success, false)
assert.equal(
  servicesBatchSchema.safeParse(
    Array.from({ length: 101 }, () => ({ name: 'Corte' }))
  ).success,
  false
)
const day = {
  day_of_week: 1,
  open_time: '09:00',
  close_time: '18:00',
  is_closed: false,
}
assert.equal(workingHoursSchema.safeParse([day]).success, true)
assert.equal(
  workingHoursSchema.safeParse([
    { ...day, open_time: '09:00:00', close_time: '18:00:00' },
  ]).success,
  true
)
for (const invalid of [
  [],
  [day, day],
  [{ ...day, day_of_week: 7 }],
  [{ ...day, close_time: '08:00' }],
  [{ ...day, open_time: '25:00' }],
])
  assert.equal(workingHoursSchema.safeParse(invalid).success, false)
assert.equal(
  workingHoursSchema.safeParse([
    { ...day, is_closed: true, open_time: '', close_time: '' },
  ]).success,
  true
)
const event = {
  title: 'Reunión',
  type: 'general',
  start: new Date('2026-10-26T09:00:00Z'),
  end: new Date('2026-10-26T10:00:00Z'),
}
assert.equal(calendarEventSchema.safeParse(event).success, true)
assert.equal(
  calendarEventSchema.safeParse({ ...event, end: event.start }).success,
  false
)
assert.equal(
  calendarEventSchema.safeParse({ ...event, start: new Date('invalid') })
    .success,
  false
)
assert.equal(sectionStatusSchema.safeParse('deleted').success, false)

const row: BusinessSummary = {
  id: 'a',
  slug: 'clinica-serena',
  name: 'Clínica Serena',
  category: 'Dentista',
  description: null,
  address: null,
  phone: null,
  website: null,
  created_at: '2026-10-25T00:00:00Z',
  updated_at: '2026-10-25T00:00:00Z',
  role: 'owner',
  custom_domain: null,
  custom_domain_status: null,
}
const rows: BusinessSummary[] = [
  row,
  {
    ...row,
    id: 'b',
    slug: 'casa-oliva',
    name: 'Casa Oliva',
    role: 'viewer',
    custom_domain: 'casa.example',
    custom_domain_status: 'error',
  },
]
assert.deepEqual(
  selectBusinesses(rows, 'clinica dentista', 'all', 'recent').map(
    (item) => item.id
  ),
  ['a']
)
assert.deepEqual(
  selectBusinesses(rows, '', 'shared', 'name').map((item) => item.id),
  ['b']
)
assert.deepEqual(
  selectBusinesses(rows, '', 'attention', 'name').map((item) => item.id),
  ['b']
)
assert.deepEqual(selectBusinesses(rows, 'no existe', 'all', 'name'), [])
assert.deepEqual(
  selectBusinesses(rows, '', 'all', 'name').map((item) => item.id),
  ['b', 'a']
)
assert.deepEqual(
  rows.map((item) => item.id),
  ['a', 'b']
)
assert.equal(getBusinessSetup({}, [], [], []).setupCompletion, 0)
assert.equal(
  getBusinessSetup(
    {
      name: 'Casa',
      category: 'Restaurante',
      description: 'Cocina',
      phone: '123',
      address: 'Barcelona',
    },
    [{}],
    [{ is_closed: false }],
    [{ status: 'published' }]
  ).setupCompletion,
  100
)
assert.equal(
  actionError(new BackofficeError('FORBIDDEN', 'Acceso denegado')).error,
  'Acceso denegado'
)
assert.throws(
  () => throwDataError(new Error('sensitive database detail')),
  (error) =>
    error instanceof BackofficeError && !error.message.includes('sensitive')
)
console.log(
  'Backoffice: tenant isolation, active roles, write permissions, invalid input, search, setup and safe errors verified.'
)
