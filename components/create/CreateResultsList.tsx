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
      <div className="mb-3 flex items-baseline justify-between gap-3 px-1">
        <h2
          id="crear-results-title"
          className="text-sm font-semibold text-[#2b3b26]"
        >
          ¿Cuál es tu negocio?
        </h2>
        <p className="text-xs text-[#7b8271]">
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
              className="group flex w-full items-start gap-3 rounded-xl border border-[#e3e6da] bg-white p-3.5 text-left transition-colors hover:border-[#b9c6aa] hover:bg-[#fbfcf8] sm:items-center sm:gap-4 sm:p-4"
            >
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#e1e6d8] bg-[#f1f4ea] text-[#5b714c]"
              >
                <MapPin className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] leading-snug font-semibold break-words text-[#2b3b26]">
                  {place.name}
                </span>
                {place.formatted_address ? (
                  <span className="mt-0.5 line-clamp-2 block text-xs leading-5 break-words text-[#7b8271] sm:text-[13px]">
                    {place.formatted_address}
                  </span>
                ) : null}
                {typeof place.rating === 'number' || place.categoryLabel ? (
                  <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#687064]">
                    {typeof place.rating === 'number' ? (
                      <span className="inline-flex items-center gap-1">
                        <Star
                          className="size-3.5 fill-[#c9a15a] text-[#c9a15a]"
                          aria-hidden="true"
                        />
                        <span className="font-medium text-[#2b3b26]">
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
                      <span className="rounded-full border border-[#e1e6d8] bg-[#f6f7f1] px-2 py-0.5 text-[11px] text-[#5f6b55]">
                        {place.categoryLabel}
                      </span>
                    ) : null}
                  </span>
                ) : null}
              </span>
              <span className="mt-0.5 hidden shrink-0 items-center gap-1.5 text-xs font-medium text-[#5b714c] sm:mt-0 sm:inline-flex">
                Elegir
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </span>
              <ArrowRight
                className="mt-1 size-4 shrink-0 text-[#8a9180] sm:hidden"
                aria-hidden="true"
              />
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 px-1 text-xs leading-5 text-[#7b8271]">
        ¿No aparece? Prueba con el nombre exacto y la ciudad, o pega la
        dirección completa de tu web.
      </p>
    </section>
  )
}
