import { z } from 'zod'

export const serviceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(120),
  description: z.string().trim().max(300).nullable().optional(),
  price: z.number().finite().min(0).max(99999999.99).nullable().optional(),
  duration: z.number().int().min(1).max(10080).nullable().optional(),
})
export const servicesBatchSchema = z.array(serviceSchema).min(1).max(100)
const time = /^([01]\d|2[0-3]):[0-5]\d(?::00)?$/
export const workingHoursSchema = z
  .array(
    z
      .object({
        day_of_week: z.number().int().min(0).max(6),
        open_time: z.string(),
        close_time: z.string(),
        is_closed: z.boolean(),
      })
      .refine(
        (row) =>
          row.is_closed ||
          (time.test(row.open_time) &&
            time.test(row.close_time) &&
            row.open_time < row.close_time),
        'La hora de cierre debe ser posterior a la apertura.'
      )
  )
  .min(1)
  .max(7)
  .refine(
    (rows) => new Set(rows.map((row) => row.day_of_week)).size === rows.length,
    'No puede haber días duplicados.'
  )
export const calendarEventSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    start: z.date(),
    end: z.date(),
    type: z.string().trim().min(1).max(50),
  })
  .refine(
    (event) => event.end > event.start,
    'El fin del evento debe ser posterior al inicio.'
  )
export const sectionStatusSchema = z.enum(['draft', 'review', 'published'])

export function serviceFromForm(form: FormData) {
  const price = form.get('price')
  const duration = form.get('duration')
  return serviceSchema.safeParse({
    name: form.get('name'),
    description: form.get('description'),
    price: price === null || price === '' ? null : Number(price),
    duration: duration === null || duration === '' ? null : Number(duration),
  })
}
