import { Badge } from '@/components/ui/badge'

export default function PlanBadge({ plan }: { plan?: string }) {
  const planName = plan || 'Esencial' // Default to Esencial
  
  const colors = {
    'Esencial': 'bg-slate-100 text-slate-800 border-slate-200',
    'Impulso': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Equipo': 'bg-blue-100 text-blue-800 border-blue-200',
    'Expansión': 'bg-purple-100 text-purple-800 border-purple-200',
  }

  return (
    <Badge variant="outline" className={colors[planName as keyof typeof colors]}>
      Plan {planName}
    </Badge>
  )
}
