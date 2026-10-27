import Link from 'next/link'
import { getBreadcrumbSchema } from '@/lib/structured-data'
import { StructuredData } from './StructuredData'

export function Breadcrumbs({
  items,
}: {
  items: { name: string; path: string }[]
}) {
  return (
    <>
      <StructuredData data={getBreadcrumbSchema(items)} />
      <nav
        aria-label="Ruta de navegación"
        className="mb-8 text-sm text-(--home-muted)"
      >
        <ol className="flex flex-wrap gap-x-2 gap-y-1">
          {items.map((item, index) => (
            <li key={item.path}>
              {index > 0 && (
                <span aria-hidden="true" className="mr-2">
                  /
                </span>
              )}
              {index === items.length - 1 ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link className="underline underline-offset-4" href={item.path}>
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
