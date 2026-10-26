import { CircleAlert } from 'lucide-react'

type FieldErrorProps = {
  id: string
  message?: string
}

/** Inline field error. Pair the `id` with the input's `aria-describedby`. */
export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null

  return (
    <p
      id={id}
      className="text-destructive flex items-center gap-1.5 text-xs font-medium"
    >
      <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  )
}
