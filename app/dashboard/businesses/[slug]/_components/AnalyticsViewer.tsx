'use client'

import { BarChart3, Clock, Eye, LogOut, Users } from 'lucide-react'
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { EmptyState, StatCard } from '@/components/dashboard/page-header'

type DailyVisits = { name: string; visits: number }

/**
 * Real traffic tracking is not connected yet. Once it is, feed the last
 * seven days here and the themed chart below renders automatically.
 */
const visitsByDay: DailyVisits[] = []

const numberFormatter = new Intl.NumberFormat('es-ES')

export default function AnalyticsViewer({
  businessId,
}: {
  businessId: string
  locale: string
}) {
  const t = {
    title: 'Analítica',
    description: 'Cómo encuentran y usan tu web tus clientes.',
    visits: 'Visitas',
    unique: 'Visitantes únicos',
    duration: 'Duración media',
    bounce: 'Tasa de rebote',
    noData: 'Sin datos todavía',
    chartTitle: 'Visitas de los últimos 7 días',
    chartDescription: 'Número de visitas diarias a tu web pública.',
    emptyTitle: 'Aún no hay datos de tráfico',
    emptyDescription:
      'Las métricas aparecerán aquí en cuanto tu web empiece a registrar visitas.',
  }

  const hasData = visitsByDay.length > 0
  const placeholder = <span className="text-muted-foreground/60">—</span>

  return (
    <div className="space-y-5 pb-10" data-business-id={businessId}>
      <div>
        <h2 className="text-foreground text-base font-semibold tracking-[-0.01em]">
          {t.title}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">{t.description}</p>
      </div>

      <section
        aria-label="Métricas principales"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard label={t.visits} value={placeholder} hint={t.noData} icon={Eye} />
        <StatCard
          label={t.unique}
          value={placeholder}
          hint={t.noData}
          icon={Users}
        />
        <StatCard
          label={t.duration}
          value={placeholder}
          hint={t.noData}
          icon={Clock}
        />
        <StatCard
          label={t.bounce}
          value={placeholder}
          hint={t.noData}
          icon={LogOut}
        />
      </section>

      {hasData ? (
        <section
          aria-labelledby="analytics-chart-title"
          className="bg-card ring-border rounded-xl p-5 shadow-[0_1px_2px_rgba(31,42,28,0.04)] ring-1 sm:p-6"
        >
          <h3
            id="analytics-chart-title"
            className="text-foreground text-base font-semibold tracking-[-0.01em]"
          >
            {t.chartTitle}
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {t.chartDescription}
          </p>
          <div className="mt-6 -ml-2 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitsByDay} barCategoryGap="28%">
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  width={40}
                  tickFormatter={(value: number) =>
                    numberFormatter.format(value)
                  }
                />
                <Tooltip
                  cursor={{ fill: 'var(--muted)' }}
                  formatter={(value) => [
                    numberFormatter.format(Number(value)),
                    t.visits,
                  ]}
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    boxShadow: '0 6px 20px -10px rgba(41,73,46,0.25)',
                    fontSize: 12,
                  }}
                  labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
                  itemStyle={{ color: 'var(--muted-foreground)' }}
                />
                <Bar
                  dataKey="visits"
                  name={t.visits}
                  fill="var(--chart-1)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : (
        <EmptyState
          icon={BarChart3}
          title={t.emptyTitle}
          description={t.emptyDescription}
        />
      )}
    </div>
  )
}
