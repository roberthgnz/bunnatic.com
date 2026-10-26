'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Eye, MessageSquare, MousePointerClick } from 'lucide-react'
import { StatCard } from '@/components/dashboard/page-header'
import type { AnalyticsSummary } from '@/lib/backoffice/types'

export default function AnalyticsViewer({
  summary,
}: {
  summary: AnalyticsSummary
}) {
  return (
    <div className="space-y-6">
      <section
        aria-label="Resultados de los últimos siete días"
        className="grid gap-4 sm:grid-cols-3"
      >
        <StatCard
          label="Visitas registradas"
          value={summary.visits.toLocaleString('es-ES')}
          hint="Visualizaciones de tu web"
          icon={Eye}
        />
        <StatCard
          label="Mensajes recibidos"
          value={summary.contacts?.toLocaleString('es-ES') ?? '—'}
          hint={
            summary.contacts === null
              ? 'Disponibles para el propietario'
              : 'Enviados desde el formulario'
          }
          icon={MessageSquare}
        />
        <StatCard
          label="Clics registrados"
          value={summary.clicks.toLocaleString('es-ES')}
          hint="Eventos de clic de tu web"
          icon={MousePointerClick}
        />
      </section>
      <section
        className="bg-card ring-border rounded-xl p-5 ring-1 sm:p-6"
        aria-labelledby="analytics-title"
      >
        <h2
          id="analytics-title"
          className="text-foreground text-base font-semibold"
        >
          El movimiento de tu web
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Últimos siete días, agrupados en UTC. Solo se muestran eventos
          registrados.
        </p>
        {summary.visits > 0 ? (
          <div className="mt-7 h-72" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.daily}>
                <XAxis
                  dataKey="label"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  labelFormatter={(_, payload) =>
                    payload[0]?.payload?.date ?? ''
                  }
                />
                <Bar
                  dataKey="visits"
                  name="Visitas"
                  fill="#52734a"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="border-border bg-muted/40 text-muted-foreground mt-7 rounded-xl border border-dashed px-6 py-12 text-center">
            <Eye
              className="mx-auto mb-3 size-7 opacity-50"
              aria-hidden="true"
            />
            <p className="text-foreground text-sm font-medium">
              Todavía no hay visitas registradas
            </p>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-6">
              Cuando tu web envíe eventos de visita, verás aquí la actividad. No
              se muestran estimaciones ni datos de ejemplo.
            </p>
          </div>
        )}
        <details className="border-border mt-5 border-t pt-4">
          <summary className="text-muted-foreground cursor-pointer rounded text-xs font-medium">
            Ver visitas por día
          </summary>
          <table className="mt-4 w-full text-left text-sm">
            <caption className="sr-only">
              Visitas registradas por día en UTC
            </caption>
            <thead>
              <tr className="border-border border-b">
                <th scope="col" className="py-2 font-medium">
                  Fecha
                </th>
                <th scope="col" className="py-2 text-right font-medium">
                  Visitas
                </th>
              </tr>
            </thead>
            <tbody>
              {summary.daily.map((day) => (
                <tr
                  key={day.date}
                  className="border-border border-b last:border-0"
                >
                  <th
                    scope="row"
                    className="text-muted-foreground py-2 font-normal"
                  >
                    {day.date}
                  </th>
                  <td className="py-2 text-right tabular-nums">{day.visits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>
    </div>
  )
}
