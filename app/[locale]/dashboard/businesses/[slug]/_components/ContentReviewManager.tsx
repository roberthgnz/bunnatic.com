'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateSectionStatus } from '@/lib/supabase/actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { FileText, Loader2, LayoutGrid } from 'lucide-react'

const statusConfig = {
  published: {
    label_es: 'Publicado',
    label_ca: 'Publicat',
    cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
  review: {
    label_es: 'En revisión',
    label_ca: 'En revisió',
    cls: 'bg-amber-50 text-amber-700 ring-amber-200',
  },
  draft: {
    label_es: 'Borrador',
    label_ca: 'Esborrany',
    cls: 'bg-slate-50 text-slate-600 ring-slate-200',
  },
}

export default function ContentReviewManager({
  sections,
  locale,
}: {
  sections: any[]
  locale: string
}) {
  const t = {
    es: {
      title: 'Revisiones de contenido',
      description:
        'Gestiona el estado y aprobación de las secciones de tu web.',
      status: {
        draft: 'Borrador',
        review: 'En revisión',
        published: 'Publicado',
      },
      noSections: 'No hay secciones disponibles para revisar.',
      saved: 'Estado actualizado',
    },
    ca: {
      title: 'Revisions de contingut',
      description:
        "Gestiona l'estat i aprovació de les seccions de la teva web.",
      status: {
        draft: 'Esborrany',
        review: 'En revisió',
        published: 'Publicat',
      },
      noSections: 'No hi ha seccions disponibles per revisar.',
      saved: 'Estat actualitzat',
    },
  }[locale === 'ca' ? 'ca' : 'es']

  const isCa = locale === 'ca'
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const router = useRouter()

  async function handleStatusChange(id: string, newStatus: string) {
    setUpdatingId(id)
    const res = await updateSectionStatus(id, newStatus)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success(t.saved)
      router.refresh()
    }
    setUpdatingId(null)
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-900">{t.title}</h3>
        <p className="mt-0.5 text-xs text-slate-500">{t.description}</p>
      </div>

      {sections.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-14 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
            <LayoutGrid className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500">{t.noSections}</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {sections.map((section) => {
            const status = section.status as keyof typeof statusConfig
            const cfg = statusConfig[status] ?? statusConfig.draft
            const statusLabel = isCa ? cfg.label_ca : cfg.label_es

            return (
              <li
                key={section.id}
                className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-slate-50/50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <FileText className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 capitalize">
                      {section.type}
                    </p>
                    <p className="max-w-[260px] truncate text-xs text-slate-400">
                      {section.content?.title || '—'}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`hidden items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 sm:inline-flex ${cfg.cls}`}
                  >
                    {statusLabel}
                  </span>

                  <div className="relative">
                    {updatingId === section.id && (
                      <Loader2 className="pointer-events-none absolute top-1/2 left-2 z-10 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-slate-400" />
                    )}
                    <Select
                      defaultValue={section.status}
                      onValueChange={(val) =>
                        handleStatusChange(section.id, val)
                      }
                      disabled={updatingId === section.id}
                    >
                      <SelectTrigger
                        className={`h-8 w-36 text-xs ${updatingId === section.id ? 'pl-7' : ''}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">
                          <span className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                            {t.status.draft}
                          </span>
                        </SelectItem>
                        <SelectItem value="review">
                          <span className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                            {t.status.review}
                          </span>
                        </SelectItem>
                        <SelectItem value="published">
                          <span className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {t.status.published}
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
