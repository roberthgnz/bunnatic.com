import { Badge } from '@/components/ui/badge'

export default function PlanBadge({ plan }: { plan?: string }) {
  const planName = plan || 'Esencial'

  const colors = {
    Esencial: 'border-slate-200 bg-slate-50 text-slate-700',
    Impulso: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    Equipo: 'border-blue-200 bg-blue-50 text-blue-700',
    Expansión: 'border-amber-200 bg-amber-50 text-amber-700',
  }

  return (
    <Badge
      variant="outline"
      className={colors[planName as keyof typeof colors] || 'border-slate-200 bg-slate-50 text-slate-700'}
    >
      {planName}
    </Badge>
  )
}
