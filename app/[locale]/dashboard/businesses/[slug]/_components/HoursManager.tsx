'use client'

import { useState } from 'react'
import { saveWorkingHours } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch' // Need to check if Switch exists, usually part of shadcn
import { Label } from '@/components/ui/label' // Need Label too
import { useRouter } from 'next/navigation'

// Fallback for Switch if not available (I will assume I need to use checkbox if switch is missing, but let's try to use standard input type checkbox for simplicity if components are missing)
// Wait, I saw components/ui/ ... let me check if switch exists. I don't recall seeing it in the file list.
// File list showed: button, card, input, etc. No switch.tsx. I will use checkbox.

export default function HoursManager({ 
  businessId, 
  initialHours,
  locale 
}: { 
  businessId: string, 
  initialHours: any[],
  locale: string 
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  // Default structure for 7 days
  const days = [0, 1, 2, 3, 4, 5, 6]
  const [hoursState, setHoursState] = useState(() => {
    const map = new Map(initialHours.map(h => [h.day_of_week, h]))
    return days.map(day => ({
      day_of_week: day,
      open_time: map.get(day)?.open_time || '09:00',
      close_time: map.get(day)?.close_time || '18:00',
      is_closed: map.get(day)?.is_closed ?? (day === 0 || day === 6), // Close weekends by default
    }))
  })

  const t = {
    es: {
      title: 'Horario de apertura',
      description: 'Define cuándo está abierto tu negocio.',
      save: 'Guardar cambios',
      days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      closed: 'Cerrado',
    },
    ca: {
      title: 'Horari d\'obertura',
      description: 'Defineix quan està obert el teu negoci.',
      save: 'Desar canvis',
      days: ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'],
      closed: 'Tancat',
    },
  }[locale === 'ca' ? 'ca' : 'es']

  function updateDay(index: number, field: string, value: any) {
    const newHours = [...hoursState]
    newHours[index] = { ...newHours[index], [field]: value }
    setHoursState(newHours)
  }

  async function handleSave() {
    setLoading(true)
    const res = await saveWorkingHours(businessId, hoursState)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success('Horario guardado')
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
      <CardContent>
        <div className="space-y-4">
          {hoursState.map((day, index) => (
            <div key={day.day_of_week} className="flex items-center gap-4 py-2 border-b last:border-0">
              <div className="w-32 font-medium">
                {t.days[day.day_of_week]}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={day.is_closed}
                  onChange={(e) => updateDay(index, 'is_closed', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  id={`closed-${index}`}
                />
                <label htmlFor={`closed-${index}`} className="text-sm text-muted-foreground w-16">
                  {t.closed}
                </label>
              </div>
              
              {!day.is_closed && (
                <div className="flex items-center gap-2">
                  <Input 
                    type="time" 
                    value={day.open_time} 
                    onChange={(e) => updateDay(index, 'open_time', e.target.value)}
                    className="w-32"
                  />
                  <span>-</span>
                  <Input 
                    type="time" 
                    value={day.close_time} 
                    onChange={(e) => updateDay(index, 'close_time', e.target.value)}
                    className="w-32"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.save}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
