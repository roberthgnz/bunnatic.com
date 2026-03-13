'use client'

import { useState } from 'react'
import { submitLead } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader2, Send } from 'lucide-react'

export default function ContactForm({
  businessId,
  locale,
}: {
  businessId: string
  locale?: string
}) {
  const [loading, setLoading] = useState(false)

  const t = {
    name: 'Tu nombre',
    email: 'Tu email',
    phone: 'Teléfono (opcional)',
    message: '¿En qué podemos ayudarte?',
    send: 'Enviar mensaje',
    sending: 'Enviando...',
    success: 'Mensaje enviado correctamente',
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    formData.append('businessId', businessId)

    const res = await submitLead(formData)

    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success(t.success)
      ;(event.target as HTMLFormElement).reset()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          name="name"
          placeholder={t.name}
          required
          className="border-slate-200 bg-slate-50"
        />
      </div>
      <div>
        <Input
          name="email"
          type="email"
          placeholder={t.email}
          required
          className="border-slate-200 bg-slate-50"
        />
      </div>
      <div>
        <Input
          name="phone"
          type="tel"
          placeholder={t.phone}
          className="border-slate-200 bg-slate-50"
        />
      </div>
      <div>
        <textarea
          name="message"
          placeholder={t.message}
          required
          rows={4}
          className="placeholder:text-muted-foreground w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:outline-none"
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        {loading ? t.sending : t.send}
      </Button>
    </form>
  )
}
