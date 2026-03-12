'use client'

import { useState } from 'react'
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
    },
  }[locale === 'ca' ? 'ca' : 'es']

  function updateDay(index: number, field: keyof HoursRow, value: string | boolean) {
    setHoursState((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  async function handleSave() {
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
            className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 md:grid-cols-[180px_140px_1fr]"
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
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">{t.from}</Label>
                  <Input
                    type="time"
                    value={day.open_time}
                    onChange={(e) => updateDay(index, 'open_time', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">{t.to}</Label>
                  <Input
                    type="time"
                    value={day.close_time}
                    onChange={(e) => updateDay(index, 'close_time', e.target.value)}
                  />
                </div>
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
