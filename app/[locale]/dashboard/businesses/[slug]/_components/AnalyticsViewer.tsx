'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Lun', visits: 40 },
  { name: 'Mar', visits: 30 },
  { name: 'Mie', visits: 20 },
  { name: 'Jue', visits: 27 },
  { name: 'Vie', visits: 18 },
  { name: 'Sab', visits: 23 },
  { name: 'Dom', visits: 34 },
]

export default function AnalyticsViewer({ 
  businessId,
  locale 
}: { 
  businessId: string,
  locale: string 
}) {
  const t = {
    es: {
      title: 'Analítica',
      description: 'Resumen de rendimiento de tu sitio web.',
      visits: 'Visitas',
      unique: 'Usuarios Únicos',
      duration: 'Duración Media',
      bounce: 'Rebote',
    },
    ca: {
      title: 'Analítica',
      description: 'Resum de rendiment del teu lloc web.',
      visits: 'Visites',
      unique: 'Usuaris Únics',
      duration: 'Durada Mitjana',
      bounce: 'Rebot',
    },
  }[locale === 'ca' ? 'ca' : 'es']

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.visits}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+19% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.unique}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.duration}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m 15s</div>
            <p className="text-xs text-muted-foreground">-4% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.bounce}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45%</div>
            <p className="text-xs text-muted-foreground">+2% desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <Tooltip />
              <Bar dataKey="visits" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
