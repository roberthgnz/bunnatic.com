import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-label="Cargando el espacio de trabajo"
      className="space-y-8"
    >
      <span className="sr-only">Cargando tu espacio de trabajo…</span>
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-36 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-52 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
