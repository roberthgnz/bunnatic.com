const highlights = [
  { value: '5 min', label: 'para tener la primera propuesta de tu web' },
  { value: '14 días', label: 'de prueba gratis en cualquier plan' },
  { value: '0 €', label: 'para empezar, sin tarjeta de crédito' },
]

export default function Highlights() {
  return (
    <section
      aria-label="Locavo en cifras"
      className="border-b border-(--home-line)"
    >
      <dl className="home-container grid divide-y divide-(--home-line) sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {highlights.map(({ value, label }) => (
          <div
            key={value}
            className="flex flex-col-reverse gap-2 py-10 sm:px-8 sm:py-14 sm:first:pl-0"
          >
            <dt className="max-w-56 text-base text-(--home-muted)">{label}</dt>
            <dd className="text-[clamp(44px,5vw,72px)] leading-none font-medium tracking-[-0.05em]">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
