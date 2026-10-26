'use client'

import { useId, useRef, useState } from 'react'
import { submitLead } from '@/lib/db/actions'
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react'

type FieldName = 'name' | 'email' | 'phone' | 'message'
type FieldErrors = Partial<Record<FieldName, string>>
type Status = 'idle' | 'submitting' | 'success' | 'error'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const t = {
  name: 'Nombre',
  email: 'Email',
  phone: 'Teléfono',
  optional: '(opcional)',
  message: 'Mensaje',
  messagePlaceholder: 'Cuéntanos en qué podemos ayudarte',
  send: 'Enviar mensaje',
  sending: 'Enviando…',
  required: 'Campos obligatorios marcados con *',
  successTitle: '¡Mensaje enviado!',
  successText: 'Gracias por escribirnos. Te responderemos lo antes posible.',
  sendAnother: 'Enviar otro mensaje',
  error:
    'No hemos podido enviar tu mensaje. Revisa tu conexión e inténtalo de nuevo.',
  errors: {
    name: 'Escribe tu nombre.',
    email: 'Escribe tu email.',
    emailInvalid: 'Revisa el email: parece que no es válido.',
    phone: 'Revisa el teléfono: usa solo números, espacios o +.',
    message: 'Escribe tu mensaje.',
  },
}

function validate(formData: FormData): FieldErrors {
  const errors: FieldErrors = {}
  const value = (key: FieldName) => String(formData.get(key) ?? '').trim()

  if (!value('name')) errors.name = t.errors.name
  const email = value('email')
  if (!email) errors.email = t.errors.email
  else if (!EMAIL_PATTERN.test(email)) errors.email = t.errors.emailInvalid
  const phone = value('phone')
  if (phone && !/^[+\d\s().-]{6,}$/.test(phone)) errors.phone = t.errors.phone
  if (!value('message')) errors.message = t.errors.message

  return errors
}

const fieldClass =
  'mt-2 block w-full rounded-xl border border-current/20 bg-white px-4 py-3 text-base text-(--site-ink) placeholder:text-current/45 hover:border-current/40 focus-visible:border-(--site-accent) focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--site-accent) aria-invalid:border-[#b42318] sm:text-sm'

export default function ContactForm({
  businessId,
}: {
  businessId: string
  locale?: string
}) {
  const id = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [attempted, setAttempted] = useState(false)
  const loading = status === 'submitting'

  const fieldId = (name: FieldName) => `${id}-${name}`
  const errorId = (name: FieldName) => `${id}-${name}-error`

  function revalidate() {
    if (!attempted || !formRef.current) return
    setErrors(validate(new FormData(formRef.current)))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    const form = event.currentTarget
    const formData = new FormData(form)

    setAttempted(true)
    const nextErrors = validate(formData)
    setErrors(nextErrors)
    const firstInvalid = (Object.keys(nextErrors) as FieldName[])[0]
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setStatus('submitting')
    formData.append('businessId', businessId)

    try {
      const res = await submitLead(formData)
      if (res?.error) {
        setStatus('error')
        return
      }
      form.reset()
      setAttempted(false)
      setStatus('success')
      requestAnimationFrame(() => successRef.current?.focus())
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="flex flex-col items-start gap-4 py-6 outline-none"
      >
        <CheckCircle2
          className="size-10 text-(--site-accent)"
          aria-hidden="true"
        />
        <h3 className="font-serif text-3xl">{t.successTitle}</h3>
        <p className="max-w-sm text-base leading-7 opacity-80">
          {t.successText}
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-2 text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--site-accent)"
        >
          {t.sendAnother}
        </button>
      </div>
    )
  }

  const renderError = (name: FieldName) =>
    errors[name] ? (
      <p id={errorId(name)} className="mt-1.5 text-sm text-[#b42318]">
        {errors[name]}
      </p>
    ) : null

  const describedBy = (name: FieldName) =>
    errors[name] ? errorId(name) : undefined

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onChange={revalidate}
      noValidate
      aria-busy={loading}
      className="space-y-5"
    >
      <p className="text-xs opacity-70">{t.required}</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId('name')} className="text-sm font-semibold">
            {t.name} <span aria-hidden="true">*</span>
          </label>
          <input
            id={fieldId('name')}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy('name')}
            className={fieldClass}
          />
          {renderError('name')}
        </div>
        <div>
          <label htmlFor={fieldId('phone')} className="text-sm font-semibold">
            {t.phone}{' '}
            <span className="font-normal opacity-70">{t.optional}</span>
          </label>
          <input
            id={fieldId('phone')}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy('phone')}
            className={fieldClass}
          />
          {renderError('phone')}
        </div>
      </div>

      <div>
        <label htmlFor={fieldId('email')} className="text-sm font-semibold">
          {t.email} <span aria-hidden="true">*</span>
        </label>
        <input
          id={fieldId('email')}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          required
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describedBy('email')}
          className={fieldClass}
        />
        {renderError('email')}
      </div>

      <div>
        <label htmlFor={fieldId('message')} className="text-sm font-semibold">
          {t.message} <span aria-hidden="true">*</span>
        </label>
        <textarea
          id={fieldId('message')}
          name="message"
          rows={5}
          required
          placeholder={t.messagePlaceholder}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy('message')}
          className={`${fieldClass} resize-y`}
        />
        {renderError('message')}
      </div>

      <div aria-live="assertive" role="alert">
        {status === 'error' ? (
          <p className="flex items-start gap-2 rounded-xl bg-[#fdecea] px-4 py-3 text-sm text-[#8a1c12]">
            <AlertCircle
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            {t.error}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-(--site-accent) px-6 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--site-accent) disabled:cursor-wait disabled:opacity-70 motion-safe:transition-opacity sm:w-auto"
      >
        {loading ? (
          <Loader2
            className="size-4 motion-safe:animate-spin"
            aria-hidden="true"
          />
        ) : (
          <Send className="size-4" aria-hidden="true" />
        )}
        {loading ? t.sending : t.send}
      </button>
      <p className="sr-only" aria-live="polite">
        {loading ? t.sending : ''}
      </p>
    </form>
  )
}
