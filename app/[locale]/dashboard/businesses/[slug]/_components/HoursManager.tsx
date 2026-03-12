'use client'

import { useState } from 'react'
import { z } from 'zod'
import { saveWorkingHours } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type HoursRow = {
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

const hoursRowSchema = z
  .object({
    day_of_week: z.number().int().min(0).max(6),
    open_time: z.string().regex(timeRegex, { message: 'time_format' }),
    close_time: z.string().regex(timeRegex, { message: 'time_format' }),
    is_closed: z.boolean(),
  })
  .refine(
    (row) => {
      if (row.is_closed) return true
      return row.open_time < row.close_time
    },
    { message: 'time_order', path: ['close_time'] }
  )

const hoursSchema = z.array(hoursRowSchema)

export default function HoursManager({
  businessId,
  initialHours,
  locale,
}: {
  businessId: string
  initialHours: any[]
  locale: string
}) {
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({})
  const router = useRouter()

  const days = [0, 1, 2, 3, 4, 5, 6]
  const [hoursState, setHoursState] = useState<HoursRow[]>(() => {
    const map = new Map(initialHours.map((h) => [h.day_of_week, h]))
    return days.map((day) => ({
      day_of_week: day,
      open_time: map.get(day)?.open_time || '09:00',
      close_time: map.get(day)?.close_time || '18:00',
      is_closed: map.get(day)?.is_closed ?? (day === 0 || day === 6),
    }))
  })

  const t = {
    es: {
      title: 'Horario de apertura',
      description: 'Define cuándo está abierto tu negocio.',
      save: 'Guardar cambios',
      days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      closed: 'Cerrado',
      from: 'Apertura',
      to: 'Cierre',
      saved: 'Horario guardado',
      errors: {
        time_format: 'Formato de hora inválido',
        time_order: 'La hora de cierre debe ser posterior a la de apertura',
      },
    },
    ca: {
      title: "Horari d'obertura",
      description: 'Defineix quan està obert el teu negoci.',
      save: 'Desar canvis',
      days: ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'],
      closed: 'Tancat',
      from: 'Obertura',
      to: 'Tancament',
      saved: 'Horari desat',
      errors: {
        time_format: "Format d'hora invàlid",
        time_order: "L'hora de tancament ha de ser posterior a l'obertura",
      },
    },
  }[locale === 'ca' ? 'ca' : 'es']

  function updateDay(index: number, field: keyof HoursRow, value: string | boolean) {
    setHoursState((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
    // Clear validation error for this day when user makes a change
    setValidationErrors((prev) => {
      const next = { ...prev }
      delete next[index]
      return next
    })
  }

  async function handleSave() {
    const result = hoursSchema.safeParse(hoursState)
    if (!result.success) {
      const errorMap: Record<number, string> = {}
      result.error.issues.forEach((issue) => {
        const dayIndex = Number(issue.path[0])
        if (!isNaN(dayIndex)) {
          const msgKey = issue.message as keyof typeof t.errors
          errorMap[dayIndex] = t.errors[msgKey] ?? issue.message
        }
      })
      setValidationErrors(errorMap)
      toast.error(Object.values(errorMap)[0] ?? 'Error de validación')
      return
    }

    setValidationErrors({})
    setLoading(true)
    const res = await saveWorkingHours(businessId, hoursState)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success(t.saved)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hoursState.map((day, index) => (
          <div
            key={day.day_of_week}
            className={`grid gap-3 rounded-md border p-4 md:grid-cols-[180px_140px_1fr] ${
              validationErrors[index] ? 'border-red-300 bg-red-50/40' : 'border-slate-200 bg-white'
            }`}
          >
            <p className="text-sm font-medium text-slate-900">{t.days[day.day_of_week]}</p>

            <div className="flex items-center gap-2">
              <Switch
                id={`closed-${day.day_of_week}`}
                checked={day.is_closed}
                onCheckedChange={(checked) => updateDay(index, 'is_closed', checked)}
              />
              <Label htmlFor={`closed-${day.day_of_week}`} className="text-sm text-slate-600">
                {t.closed}
              </Label>
            </div>

            {day.is_closed ? (
              <p className="text-sm text-slate-500">-</p>
            ) : (
              <div className="space-y-1">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500">{t.from}</Label>
                    <Input
                      type="time"
                      value={day.open_time}
                      onChange={(e) => updateDay(index, 'open_time', e.target.value)}
                      aria-invalid={!!validationErrors[index]}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500">{t.to}</Label>
                    <Input
                      type="time"
                      value={day.close_time}
                      onChange={(e) => updateDay(index, 'close_time', e.target.value)}
                      aria-invalid={!!validationErrors[index]}
                    />
                  </div>
                </div>
                {validationErrors[index] && (
                  <p className="text-xs text-red-500">{validationErrors[index]}</p>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {t.save}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
