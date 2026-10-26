import { ArrowRight, MapPin, Star } from 'lucide-react'

export type CreateResultItem = {
  place_id: string
  name: string
  formatted_address?: string
  rating?: number
  user_ratings_total?: number
  categoryLabel?: string | null
}

type CreateResultsListProps = {
  items: CreateResultItem[]
  onSelect: (placeId: string) => void
}

/** Selectable Google results. Each card is a real button (Tab + Enter). */
export default function CreateResultsList({
  items,
  onSelect,
}: CreateResultsListProps) {
  return (
    <section aria-labelledby="crear-results-title" className="mt-8">
      <div className="mb-4 flex items-baseline justify-between gap-3 px-1">
        <h2
          id="crear-results-title"
          className="text-[15px] font-medium text-[#0b0b0b]"
        >
          ¿Cuál es tu negocio?
        </h2>
        <p className="text-xs text-[#6b6b66]">
          {items.length === 1
            ? '1 resultado en Google'
            : `${items.length} resultados en Google`}
        </p>
      </div>
      <ul className="space-y-2">
        {items.map((place) => (
          <li key={place.place_id}>
            <button
              type="button"
              onClick={() => onSelect(place.place_id)}
              className="group flex w-full items-start gap-3 rounded-2xl border border-[#e6e6e1] bg-white p-4 text-left transition-colors hover:border-[#0b0b0b] sm:items-center sm:gap-4 sm:p-5"
            >
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f3f3ef] text-[#0b0b0b] transition-colors group-hover:bg-[#0b0b0b] group-hover:text-white"
              >
                <MapPin className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base leading-snug font-medium tracking-[-0.01em] break-words text-[#0b0b0b]">
                  {place.name}
                </span>
                {place.formatted_address ? (
                  <span className="mt-0.5 line-clamp-2 block text-xs leading-5 break-words text-[#6b6b66] sm:text-[13px]">
                    {place.formatted_address}
                  </span>
                ) : null}
                {typeof place.rating === 'number' || place.categoryLabel ? (
                  <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#6b6b66]">
                    {typeof place.rating === 'number' ? (
                      <span className="inline-flex items-center gap-1">
                        <Star
                          className="size-3.5 fill-[#0b0b0b] text-[#0b0b0b]"
                          aria-hidden="true"
                        />
                        <span className="font-medium text-[#0b0b0b]">
                          {place.rating.toLocaleString('es-ES')}
                        </span>
                        {typeof place.user_ratings_total === 'number' ? (
                          <span>
                            ({place.user_ratings_total.toLocaleString('es-ES')}{' '}
                            reseñas)
                          </span>
                        ) : null}
                      </span>
                    ) : null}
                    {place.categoryLabel ? (
                      <span className="rounded-full bg-[#f3f3ef] px-2.5 py-0.5 text-[11px] font-medium text-black/70">
                        {place.categoryLabel}
                      </span>
                    ) : null}
                  </span>
                ) : null}
              </span>
              <span className="mt-0.5 hidden min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-[#e6e6e1] px-4 text-[13px] font-medium text-[#0b0b0b] transition-colors group-hover:border-[#0b0b0b] group-hover:bg-[#0b0b0b] group-hover:text-white sm:mt-0 sm:inline-flex">
                Elegir
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </span>
              <ArrowRight
                className="mt-1 size-4 shrink-0 text-black/40 sm:hidden"
                aria-hidden="true"
              />
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-5 px-1 text-xs leading-5 text-[#6b6b66]">
        ¿No aparece? Prueba con el nombre exacto y la ciudad, o pega la
        dirección completa de tu web.
      </p>
    </section>
  )
}
