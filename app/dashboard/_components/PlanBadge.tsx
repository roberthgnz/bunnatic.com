import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const planStyles: Record<string, string> = {
  Esencial: 'border-border bg-muted text-muted-foreground',
  Impulso: 'border-primary/15 bg-secondary text-secondary-foreground',
  Equipo: 'border-primary/25 bg-accent text-primary',
  Expansión: 'border-primary bg-primary text-primary-foreground',
}

export default function PlanBadge({ plan }: { plan?: string }) {
  const planName = plan || 'Esencial'

  return (
    <Badge
      variant="outline"
      className={cn(planStyles[planName] ?? planStyles.Esencial)}
    >
      <span className="sr-only">Plan </span>
      {planName}
    </Badge>
  )
}
