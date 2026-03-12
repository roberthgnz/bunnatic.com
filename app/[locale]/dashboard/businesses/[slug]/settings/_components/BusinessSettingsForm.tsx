'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateBusiness } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
    <div className="space-y-6">
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
          <Textarea
            id="description"
            name="description"
            defaultValue={business.description || ''}
            rows={6}
            className="max-w-2xl"
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? t.submitting : t.submit}
        </Button>
      </form>
    </div>
  )
}
