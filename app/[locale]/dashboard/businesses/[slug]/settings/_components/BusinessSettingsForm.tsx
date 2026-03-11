'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateBusiness } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface Business {
  id: string
  name: string
  slug: string
  category: string
  description: string | null
}

export default function BusinessSettingsForm({
  business,
  locale,
}: {
  business: Business
  locale: string
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const t = {
    es: {
      nameLabel: 'Nombre del negocio',
      categoryLabel: 'Categoría',
      descLabel: 'Descripción',
      submit: 'Guardar cambios',
      submitting: 'Guardando...',
      success: 'Negocio actualizado correctamente',
    },
    ca: {
      nameLabel: 'Nom del negoci',
      categoryLabel: 'Categoria',
      descLabel: 'Descripció',
      submit: 'Desar canvis',
      submitting: 'Desant...',
      success: 'Negoci actualitzat correctament',
    },
  }[locale === 'ca' ? 'ca' : 'es']

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const result = await updateBusiness(business.slug, formData)

    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success(t.success)
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          {t.nameLabel}
        </label>
        <Input
          id="name"
          name="name"
          defaultValue={business.name}
          required
          className="max-w-md"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">
          {t.categoryLabel}
        </label>
        <Input
          id="category"
          name="category"
          defaultValue={business.category}
          required
          className="max-w-md"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          {t.descLabel}
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={business.description || ''}
          rows={4}
          className="w-full max-w-md rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? t.submitting : t.submit}
      </Button>
    </form>
  )
}
