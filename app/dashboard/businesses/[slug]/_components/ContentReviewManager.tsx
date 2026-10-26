'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateSectionStatus } from '@/lib/backoffice/actions/content'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { FileText, Loader2, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'

const statusConfig = {
  published: {
    label_es: 'Publicado',
    label_ca: 'Publicat',
    variant: 'success',
    dot: 'bg-success',
  },
  review: {
    label_es: 'En revisión',
    label_ca: 'En revisió',
    variant: 'warning',
    dot: 'bg-warning',
  },
  draft: {
    label_es: 'Borrador',
    label_ca: 'Esborrany',
    variant: 'outline',
    dot: 'bg-muted-foreground/60',
  },
} as const

type ReviewSection = {
  id: string
  type: string
  status: string
  content?: {
    title?: string
  } | null
}

export default function ContentReviewManager({
  sections,
  locale,
}: {
  sections: ReviewSection[]
  locale: string
}) {
  const t = {
    es: {
      title: 'Revisión de contenido',
      description:
        'Decide qué bloques de tu web están en borrador, en revisión o publicados.',
      status: {
        draft: 'Borrador',
        review: 'En revisión',
        published: 'Publicado',
      },
      sectionTypes: {
        hero: 'Portada',
        about: 'Sobre nosotros',
        services: 'Servicios',
        contact: 'Contacto',
        reviews: 'Reseñas',
        team: 'Equipo',
      } as Record<string, string>,
      changeStatus: 'Cambiar estado de',
      untitled: 'Sin título',
      noSections: 'Todavía no hay bloques que revisar',
      noSectionsHint:
        'Cuando generes el contenido de tu web, sus bloques aparecerán aquí.',
      saved: 'Estado actualizado',
    },
    ca: {
      title: 'Revisió de contingut',
      description:
        'Decideix quins blocs del teu web estan en esborrany, en revisió o publicats.',
      status: {
        draft: 'Esborrany',
        review: 'En revisió',
        published: 'Publicat',
      },
      sectionTypes: {
        hero: 'Portada',
        about: 'Qui som',
        services: 'Serveis',
        contact: 'Contacte',
        reviews: 'Ressenyes',
        team: 'Equip',
      } as Record<string, string>,
      changeStatus: "Canviar l'estat de",
      untitled: 'Sense títol',
      noSections: 'Encara no hi ha blocs per revisar',
      noSectionsHint:
        'Quan generis el contingut del teu web, els seus blocs apareixeran aquí.',
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

  const publishedCount = sections.filter((s) => s.status === 'published').length

  return (
    <section
      aria-labelledby="content-review-title"
      className="bg-card ring-border overflow-hidden rounded-xl shadow-[0_1px_2px_rgba(31,42,28,0.04)] ring-1"
    >
      <div className="border-border flex items-start justify-between gap-3 border-b px-5 py-4 sm:px-6">
        <div>
          <h2
            id="content-review-title"
            className="text-foreground text-base font-semibold tracking-[-0.01em]"
          >
            {t.title}
          </h2>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {t.description}
          </p>
        </div>
        {sections.length > 0 ? (
          <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
            {publishedCount}/{sections.length}{' '}
            {t.status.published.toLowerCase()}
          </span>
        ) : null}
      </div>

      {sections.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <span className="bg-secondary text-secondary-foreground ring-border mb-3 flex size-10 items-center justify-center rounded-xl ring-1">
            <LayoutGrid className="size-5" aria-hidden="true" />
          </span>
          <p className="text-foreground text-sm font-medium">{t.noSections}</p>
          <p className="text-muted-foreground mt-1 max-w-xs text-xs leading-5">
            {t.noSectionsHint}
          </p>
        </div>
      ) : (
        <ul className="divide-border divide-y">
          {sections.map((section) => {
            const status = section.status as keyof typeof statusConfig
            const cfg = statusConfig[status] ?? statusConfig.draft
            const statusLabel = isCa ? cfg.label_ca : cfg.label_es
            const typeLabel = t.sectionTypes[section.type] ?? section.type
            const isUpdating = updatingId === section.id

            return (
              <li
                key={section.id}
                className="hover:bg-muted/50 flex items-center justify-between gap-4 px-5 py-3.5 transition-colors sm:px-6"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="bg-secondary text-secondary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
                    <FileText className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-foreground text-sm font-medium first-letter:uppercase">
                      {typeLabel}
                    </p>
                    <p className="text-muted-foreground max-w-[280px] truncate text-xs">
                      {section.content?.title || t.untitled}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <Badge
                    variant={cfg.variant}
                    className="hidden sm:inline-flex"
                  >
                    {statusLabel}
                  </Badge>

                  <div className="relative">
                    {isUpdating && (
                      <Loader2
                        className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 z-10 size-3.5 -translate-y-1/2 animate-spin"
                        aria-hidden="true"
                      />
                    )}
                    <Select
                      defaultValue={section.status}
                      onValueChange={(val) =>
                        handleStatusChange(section.id, val)
                      }
                      disabled={isUpdating}
                    >
                      <SelectTrigger
                        size="sm"
                        aria-label={`${t.changeStatus} ${typeLabel}`}
                        aria-busy={isUpdating}
                        className={cn('w-36 text-xs', isUpdating && 'pl-8')}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">
                          <span className="flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className={cn(
                                'size-1.5 rounded-full',
                                statusConfig.draft.dot
                              )}
                            />
                            {t.status.draft}
                          </span>
                        </SelectItem>
                        <SelectItem value="review">
                          <span className="flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className={cn(
                                'size-1.5 rounded-full',
                                statusConfig.review.dot
                              )}
                            />
                            {t.status.review}
                          </span>
                        </SelectItem>
                        <SelectItem value="published">
                          <span className="flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className={cn(
                                'size-1.5 rounded-full',
                                statusConfig.published.dot
                              )}
                            />
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
    </section>
  )
}
